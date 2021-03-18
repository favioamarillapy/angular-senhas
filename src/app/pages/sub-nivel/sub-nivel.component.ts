import { Component, OnInit, ViewChild } from '@angular/core';
import { SubNivel } from 'src/app/models/sub-nivel';
import { SubnivelService } from 'src/app/services/subnivel.service';
import { NivelService } from 'src/app/services/nivel.service';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { MatAutocompleteTrigger } from '@angular/material';

export interface NivelList {
  id: number;
  descripcion: string;
}

@Component({
  selector: 'app-sub-nivel',
  templateUrl: './sub-nivel.component.html',
  styleUrls: ['./sub-nivel.component.css']
})
export class SubNivelComponent implements OnInit {

  //efecto de carga de operaciones
  public cargando: boolean = true;

  //variables para mostrar u ocultar el formulario
  public form = false;
  public nuevo = false;

  //variables para persistencia de datos
  public modelo: SubNivel;
  public listado: any;


  //varibles usadas para los filtros de las tablas
  public filtrosTabla: any = {};
  public parametrosTabla: any = []

  //variables para la paginacion
  public paginaActual = 1;
  public porPagina;
  public total;

  //varibles para mostrar mensajes
  public mensajeSuccess: boolean = false;
  public mensaje: string = '';

  @ViewChild(MatAutocompleteTrigger) _auto: MatAutocompleteTrigger;
  listControl = new FormControl();
  formControl = new FormControl();
  options: NivelList[];
  filteredOptions: Observable<NivelList[]>;


  constructor(
    private servicioSubNivel: SubnivelService,
    private servicioNivel: NivelService
  ) {
    this.inicializarFiltros();
  }

  async ngOnInit() {
    await this.getNiveles();

    this.filteredOptions = this.listControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filter(name) : this.options.slice())
      );

    this.paginacion(this.paginaActual);
  }

  displayFn(nivel: NivelList): string {
    return nivel && nivel.descripcion != '' ? nivel.descripcion : '';
  }

  private _filter(descripcion: string): NivelList[] {
    const filterValue = descripcion.toLowerCase();

    return this.options.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) === 0);
  }

  async inicializarMensaje() {
    this.mensajeSuccess = false;
    this.mensaje = '';
  }

  async asignarMensaje(response) {
    this.mensajeSuccess = response.success;
    this.mensaje = response.mensaje;
  }

  async inicializarFiltros() {
    this.filtrosTabla = {
      niveles_id: null,
      numero: '',
      descripcion: ''
    }
  }

  async mostrarFormulario(form: boolean, nuevo: boolean) {
    this.nuevo = nuevo
    this.form = form

    if (!form) {
      this.inicializarMensaje();
      await this.getNiveles();
    }

    if (form) {
      this.filteredOptions = this.formControl.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.name),
          map(name => name ? this._filter(name) : this.options.slice())
        );
    }

    if (form && nuevo) {
      this.modelo = new SubNivel(null, null, null, null, null);
    }
  }

  async paginacion(pagina?, filtros?) {
    this.paginaActual = (pagina) ? pagina : this.paginaActual;
    this.listado = null;
    this.cargando = true;

    let parametrosFlitro: any = {};

    //parametros de paginado
    parametrosFlitro = {
      paginar: true,
      page: this.paginaActual
    };

    //parametros de filtros de busqueda
    if (filtros) {
      this.parametrosTabla.forEach(element => {
        parametrosFlitro[element.key] = element.value;
      });
    }

    const response: any = await this.servicioSubNivel.obtener(null, parametrosFlitro);

    if (response.success) {
      this.listado = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.asignarMensaje(response);
    }

    this.cargando = false;
  }

  async filtrarTabla(event?: any) {
    if (event) {
      let key = event.target.name;
      let value = event.target.value;
      let tsThis = this;

      this.parametrosTabla.forEach(function (value, i) {
        if (value.key == 'niveles_id') {
          tsThis.parametrosTabla.splice(i, 1);
        }
      });

      this.parametrosTabla.push({ key, value });

      await this.paginacion(1, this.parametrosTabla);
    } else {
      await this.inicializarFiltros();
      await this.paginacion(1, null);
    }
  }


  async registrar() {
    this.cargando = true;

    const validar: any = await this.servicioSubNivel.validarSubNivel(this.modelo.numero, this.modelo.niveles_id);
    if (validar.success) {

      const response: any = await this.servicioSubNivel.registrar(this.modelo);
      if (response.success) {
        this.asignarMensaje(response);

        this.paginacion();
        setTimeout(() => {
          this.mostrarFormulario(false, false);
        }, 1500);

      } else {
        this.asignarMensaje(response);
      }

    } else {
      this.asignarMensaje(validar);
    }
    this.cargando = false;
  }


  async actualizar() {
    this.cargando = true;

    const validar: any = await this.servicioSubNivel.validarSubNivel(this.modelo.numero, this.modelo.niveles_id, this.modelo.id);

    if (validar.success) {
      const response: any = await this.servicioSubNivel.actualizar(this.modelo, this.modelo.id);
      if (response.success) {
        this.asignarMensaje(response);

        this.paginacion();
        setTimeout(() => {
          this.mostrarFormulario(false, false);
        }, 1500);
      } else {
        this.asignarMensaje(response);
      }
    } else {
      this.asignarMensaje(validar);
    }
    this.cargando = false;
  }

  setEstadoSubNivel(id_subnivel) {
    this.modelo = new SubNivel(null, null, null, null, null);
    this.modelo.id = id_subnivel;
  }

  async activarDesactivarSubNivel() {
    const response: any = await this.servicioSubNivel.eliminar(this.modelo.id);

    if (response) {
      if (response.success) {
        this.asignarMensaje(response);
        this.paginacion();

        setTimeout(() => {
          this.inicializarMensaje();
        }, 1500);
      } else {
        this.asignarMensaje(response);
      }
    }
  }

  async getModelo(id, idNivel) {
    this.cargando = true;

    const response: any = await this.servicioSubNivel.obtener(id);

    if (response.success) {
      this.modelo = response.data;
      this.formControl.setValue(response.data.nivel);
      this.mostrarFormulario(true, false);
    } else {
      this.asignarMensaje(response);
    }

    this.cargando = false;
  }

  async getNiveles() {
    const response: any = await this.servicioNivel.obtener();

    if (response.success) {
      this.options = response.data;
    }
  }

  optionSelected(nivel, modelo?) {
    let event = {
      target: {
        name: 'niveles_id',
        value: nivel.id
      }
    };

    if (modelo) {
      this.modelo.niveles_id = nivel.id;
    } else {
      this.filtrarTabla(event);
    }
  }

}
