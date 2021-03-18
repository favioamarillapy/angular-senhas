import { Component, OnInit, Input } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/models/usuario';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})


export class HeaderComponent implements OnInit {

  usuario: Usuario;

  constructor(
    private usuarioService: UsuarioService
  ) {
    this.usuario = new Usuario(null, null, null, null, null, null);
  }

  async ngOnInit() {
    await this.getUsuario();

    this.usuarioService.loginEmitter
      .subscribe(response => {
        this.usuario = response;
      });

    this.usuarioService.logoutEmitter
      .subscribe(event => {
        this.getUsuario();
      });
  }

  logout() {
    this.usuarioService.cerrarSession();
    this.usuario = null;
  }

  async getUsuario() {
    this.usuario = await this.usuarioService.getUsuario();
  }

}
