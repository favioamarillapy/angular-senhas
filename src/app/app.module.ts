import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { NgxPaginationModule } from 'ngx-pagination';
import { AngularFileUploaderModule } from "angular-file-uploader";

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule, MAT_DATE_LOCALE, MatSelectModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatStepperModule } from '@angular/material/stepper';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HeaderComponent } from './common/header/header.component';
import { UsuarioService } from './services/usuario.service';
import { FooterComponent } from './common/footer/footer.component';
import { InicioComponent } from './pages/inicio/inicio.component';
import { PaginacionComponent } from './common/paginacion/paginacion.component';
import { HttpClientModule } from '@angular/common/http';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { NivelComponent } from './pages/nivel/nivel.component';
import { SubNivelComponent } from './pages/sub-nivel/sub-nivel.component';
import { JuegoComponent } from './pages/juego/juego.component';
import { PipesModule } from './pipes/pipes.module';
import { GlosarioComponent } from './pages/glosario/glosario.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    InicioComponent,
    PaginacionComponent,
    UsuariosComponent,
    NivelComponent,
    SubNivelComponent,
    JuegoComponent,
    GlosarioComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    AngularFileUploaderModule,
    PipesModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBuZNII7koDWPXeKDT9IeSEuWezvQqlZ8c'
    }),
    HttpClientModule,
    BrowserAnimationsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatStepperModule
  ],
  exports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    BrowserAnimationsModule
  ],
  providers: [
    UsuarioService,
    { provide: MAT_DATE_LOCALE, useValue: 'es-MX' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
