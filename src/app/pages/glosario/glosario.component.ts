import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Glosario } from 'src/app/models/glosario';
import { GlosarioService } from 'src/app/services/glosario.service';
const API = environment.api;

@Component({
  selector: 'app-glosario',
  templateUrl: './glosario.component.html'
})



export class GlosarioComponent implements OnInit {

  //efecto de carga de operaciones
  public cargando: boolean = true;

  //variables para mostrar u ocultar el formulario
  public form = false;
  public nuevo = false;

  //variables para persistencia de datos
  public modelo: Glosario

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

  public fileUploaderConfig = {
    multiple: false,
    formatsAllowed: '.jpg,.png,.jpeg,.gif',
    maxSize: '50',
    uploadAPI: {
      url: `${API}/glosario/upload`
    },
    theme: 'attachPin',
    hideProgressBar: false,
    hideResetBtn: true,
    hideSelectBtn: false,
    replaceTexts: {
      attachPinBtn: 'Seleccionar Imagen',
    }
  };

  constructor(private glosarioServices: GlosarioService) { }

  ngOnInit() {
    this.paginacion(this.paginaActual);
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
      descripcion: '',
    }
  }

  mostrarFormulario(form: boolean, nuevo: boolean) {
    this.nuevo = nuevo
    this.form = form

    if (!form) {
      this.inicializarMensaje();
    }

    if (form && nuevo) {
      this.modelo = new Glosario(null, null, null, null);
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

    const response: any = await this.glosarioServices.obtener(null, parametrosFlitro);

    if (response.success) {
      this.listado = response.data;
      this.porPagina = response.per_page;
      this.total = response.total;
    } else {
      this.asignarMensaje(response);
    }

    this.cargando = false;
  }

  async filtrarTabla(event?) {
    if (event) {
      let key = event.target.name;
      let value = event.target.value;

      this.parametrosTabla.push({ key, value });

      await this.paginacion(null, this.parametrosTabla);
    } else {
      await this.inicializarFiltros();
      await this.paginacion(null, null);
    }
  }

  async getModelo(id) {
    this.cargando = true;
    const response: any = await this.glosarioServices.obtener(id);

    if (response.success) {
      this.modelo = response.data;
      this.mostrarFormulario(true, false);
    } else {
      this.asignarMensaje(response);
    }
    this.cargando = false;
  }

  async registrar() {
    this.cargando = true;
    const response: any = await this.glosarioServices.registrar(this.modelo);

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
    const response: any = await this.glosarioServices.actualizar(this.modelo, this.modelo.id);

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

  setEstadoGlosario(idGlosario) {
    this.modelo = new Glosario(null, null, null, null);
    this.modelo.id = idGlosario;
  }

  async activarDesactivarGlosario() {
    const response: any = await this.glosarioServices.eliminar(this.modelo.id);

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

  upload(event) {
    this.modelo.imagen = event.body.data;
  }


}
