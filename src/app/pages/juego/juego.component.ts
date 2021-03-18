import { Component, OnInit, ViewChild } from '@angular/core';
import { Juego } from 'src/app/models/juego';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SubnivelService } from 'src/app/services/subnivel.service';
import { startWith, map } from 'rxjs/operators';
import { Nivel } from 'src/app/models/nivel';
import { JuegoService } from 'src/app/services/juego.service';
import { JuegoOpcion } from 'src/app/models/juego-opcion';
import { environment } from 'src/environments/environment';

export interface NivelList {
  id: number;
  descripcion: string;
}
export interface SubNivelList {
  id: number;
  descripcion: string;
  nivel: Nivel
}
export interface OptionsList {
  id: string;
  descripcion: string;
}

const API = environment.api;


@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.css']
})
export class JuegoComponent implements OnInit {

  //efecto de carga de operaciones
  public cargando: boolean = true;

  //variables para mostrar u ocultar el formulario
  public form = false;
  public nuevo = false;

  //variables para persistencia de datos
  public modelo: Juego;
  public juegoOpcion: JuegoOpcion;
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

  public actualizarOpcion: boolean = false;

  listSubNivelControl = new FormControl();
  formSubNivelControl = new FormControl();
  optionsSubNivel: SubNivelList[];
  filteredSubNivelOptions: Observable<SubNivelList[]>;
  filteredSubNivelOptionsForm: Observable<SubNivelList[]>;

  formCorrectoControl = new FormControl();
  optionsCorrecto: OptionsList[];
  filteredCorrectoOptions: Observable<OptionsList[]>;

  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.jpeg,.gif',
    maxSize: '50',
    uploadAPI: {
      url: `${API}/juego/upload`
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    replaceTexts: {
      attachPinBtn: 'Seleccionar Imagen',
    }
  };

  constructor(
    private servicioSubNivel: SubnivelService,
    private servicioJuego: JuegoService
  ) {
    this.inicializarFiltros();
  }

  async ngOnInit() {
    await this.getSubNiveles();
    await this.getOpciones();

    this.filteredSubNivelOptions = this.listSubNivelControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterSubNivel(name) : this.optionsSubNivel.slice())
      );

    this.filteredSubNivelOptionsForm = this.formSubNivelControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterSubNivel(name) : this.optionsSubNivel.slice())
      );

    this.filteredCorrectoOptions = this.formCorrectoControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => name ? this._filterCorrecto(name) : this.optionsCorrecto.slice())
      );

    this.paginacion(this.paginaActual);
  }

  displayFnSubNivel(subNivel: SubNivelList): string {
    return subNivel && subNivel.descripcion != '' ? subNivel.nivel.descripcion + ' - ' + subNivel.descripcion : '';
  }

  private _filterSubNivel(descripcion: string): SubNivelList[] {
    const filterValue = descripcion.toLowerCase();

    return this.optionsSubNivel.filter(function (option) {
      let str = option.nivel.descripcion.toLowerCase() + ' - ' + option.descripcion.toLowerCase()
      return str.indexOf(filterValue) === 0;
    });
  }

  displayFnCorrecto(option: OptionsList): string {
    return option && option.descripcion != '' ? option.descripcion : '';
  }

  private _filterCorrecto(descripcion: string): OptionsList[] {
    console.log(descripcion);
    const filterValue = descripcion.toLowerCase();

    return this.optionsCorrecto.filter(option => option.descripcion.toLowerCase().indexOf(filterValue) === 0);
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
      nombre: '',
      sub_niveles_id: null,
      activo: ''
    }
  }

  async mostrarFormulario(form: boolean, nuevo: boolean) {
    this.juegoOpcion = new JuegoOpcion(null, null, null, null, null);
    this.nuevo = nuevo;
    this.form = form;

    if (!form) {
      this.inicializarMensaje();
    }

    if (form && nuevo) {
      this.modelo = new Juego(null, null, null, null, null);
      this.juegoOpcion = new JuegoOpcion(null, null, null, null, null);
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

    const response: any = await this.servicioJuego.obtener(null, parametrosFlitro);

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
        if (value.key == 'sub_niveles_id') {
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
    const response: any = await this.servicioJuego.registrar(this.modelo);

    if (response.success) {
      this.asignarMensaje(response);

      setTimeout(() => {
        this.mostrarFormulario(false, false);
      }, 1500);
      this.paginacion();
    } else {
      this.asignarMensaje(response);
    }

    this.cargando = false;
  }

  async actualizar() {
    this.cargando = true;
    const response: any = await this.servicioJuego.actualizar(this.modelo, this.modelo.id);

    if (response.success) {
      this.asignarMensaje(response);

      setTimeout(() => {
        this.mostrarFormulario(false, false);
      }, 1500);
      this.paginacion();
    } else {
      this.asignarMensaje(response);
    }

    this.cargando = false;
  }

  setEstadoSubNivel(id_subnivel) {
    this.modelo = new Juego(null, null, null, null, null);
    this.modelo.id = id_subnivel;
  }

  async activarDesactivarJuego() {
    const response: any = await this.servicioJuego.eliminar(this.modelo.id);

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

  async getModelo(id) {
    this.cargando = true;

    const response: any = await this.servicioJuego.obtener(id);

    if (response.success) {
      this.modelo = response.data;
      this.formSubNivelControl.setValue(response.data.sub_nivel);
      this.mostrarFormulario(true, false);
    } else {
      this.asignarMensaje(response);
    }

    this.cargando = false;
  }

  async getSubNiveles() {
    this.cargando = true;

    const response: any = await this.servicioSubNivel.obtener(null);

    if (response.success) {
      this.optionsSubNivel = response.data;
    }

    this.cargando = false;
  }

  async getOpciones() {
    let data: OptionsList[] = [
      { id: 'S', descripcion: 'SI' },
      { id: 'N', descripcion: 'NO' }
    ];

    this.optionsCorrecto = data;
  }

  optionsSubNivelSelected(subnivel, modelo?) {
    let event = {
      target: {
        name: 'niveles_id',
        value: subnivel.id
      }
    };

    if (modelo) {
      this.modelo.sub_niveles_id = subnivel.id;
    } else {
      this.filtrarTabla(event);
    }
  }

  optionsCorrectoSelected(opcion) {
    this.juegoOpcion.correcto = opcion.id;
  }

  agregarOpcion() {
    if (!this.modelo.opciones) {
      this.modelo.opciones = [];
    }
    this.modelo.opciones.push(this.juegoOpcion);

    this.juegoOpcion = new JuegoOpcion(null, null, null, null);
  }

  seEliminarOpcion(opcion) {
    this.juegoOpcion = opcion;
  }

  eliminarOpcion() {
    this.modelo.opciones.splice(this.juegoOpcion.index, 1);
    this.juegoOpcion = new JuegoOpcion(null, null, null, null);
  }

  async getOpcion(index) {
    this.juegoOpcion = await this.modelo.opciones[index];
    this.juegoOpcion.index = index;

    let descripcion = await (this.juegoOpcion.correcto == 'S') ? 'SI' : 'NO';
    let correcto = await { id: this.juegoOpcion.correcto, descripcion: descripcion }
    this.formCorrectoControl.setValue(correcto);

    this.actualizarOpcion = true;
  }

  async actualizarDataOpcion() {
    let index = this.juegoOpcion.index;

    this.modelo.opciones[index]['descripcion'] = this.juegoOpcion.descripcion;
    this.modelo.opciones[index]['correcto'] = this.juegoOpcion.correcto;

    this.juegoOpcion = new JuegoOpcion(null, null, null, null);
    this.actualizarOpcion = false;
  }

  cancelarOpcion() {
    this.juegoOpcion = new JuegoOpcion(null, null, null, null);
    this.actualizarOpcion = false;
  }

  upload(event) {
    this.modelo.imagen = event.body.data;
  }

}
