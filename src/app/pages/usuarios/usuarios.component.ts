import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  //efecto de carga de operaciones
  public cargando: boolean = true;

  //variables para mostrar u ocultar el formulario
  public form = false;
  public nuevo = false;

  //variables para persistencia de datos
  public modelo: Usuario;
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


  constructor(
    private servicioUsuario: UsuarioService
  ) {
    this.inicializarFiltros();
  }

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
      nombre_completo: '',
      email: '',
      rol: null,
    }
  }

  mostrarFormulario(form: boolean, nuevo: boolean) {
    this.nuevo = nuevo
    this.form = form

    if (!form) {
      this.inicializarMensaje();
    }

    if (form && nuevo) {
      this.modelo = new Usuario(null, null, null, null, null, null);
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

    const response: any = await this.servicioUsuario.getUsuarios(null, parametrosFlitro);

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
    const response: any = await this.servicioUsuario.getUsuarios(id);

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

    this.modelo.password = 'cambiar123.';
    const response: any = await this.servicioUsuario.registrar(this.modelo);

    if (response.success) {
      this.asignarMensaje(response);

      this.paginacion();
      setTimeout(() => {
        this.mostrarFormulario(false, false);
      }, 1500);

    } else {
      this.asignarMensaje(response);
    }

    this.cargando = false;
  }

  async actualizar() {
    this.cargando = true;
    const response: any = await this.servicioUsuario.actualizar(this.modelo, this.modelo.id);

    if (response.success) {
      this.asignarMensaje(response);

      this.paginacion();
      setTimeout(() => {
        this.mostrarFormulario(false, false);
      }, 1500);
    } else {
      this.asignarMensaje(response);
    }

    this.cargando = false;
  }

  setEstadoUsuario(id_usuario) {
    this.modelo = new Usuario(null, null, null, null, null, null);
    this.modelo.id = id_usuario;
  }

  async activarDesactivarUsuario() {
    const response: any = await this.servicioUsuario.activarDesactivarUsuario(this.modelo.id);

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

}
