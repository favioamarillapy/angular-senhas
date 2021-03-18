import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { NivelComponent } from './pages/nivel/nivel.component';
import { SubNivelComponent } from './pages/sub-nivel/sub-nivel.component';
import { JuegoComponent } from './pages/juego/juego.component';
import {GlosarioComponent} from './pages/glosario/glosario.component'

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard] },
  { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
  { path: 'niveles', component: NivelComponent, canActivate: [AuthGuard] },
  { path: 'sub-niveles', component: SubNivelComponent, canActivate: [AuthGuard] },
  { path: 'juego', component: JuegoComponent, canActivate: [AuthGuard] },
  { path: 'glosario', component: GlosarioComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'inicio' }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
