import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/models/usuario';
import { Nivel } from 'src/app/models/nivel';
import { NivelService } from 'src/app/services/nivel.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  usuario: Usuario;

  constructor(
    private usuarioService: UsuarioService,
    private nivelService:NivelService
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
      .subscribe(response => {
        this.usuario = response;
      });
  }

  async getUsuario() {
    this.usuario = await this.usuarioService.getUsuario();
  }
}
