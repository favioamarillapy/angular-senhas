import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';


const API = environment.api;

@Injectable({
  providedIn: 'root'
})
export class SubnivelService extends BaseService {

  recurso = 'sub-nivel'

  validarSubNivel(numero?, niveles_id?, id?) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise<boolean>(resolve => {
      this.http.post(`${API}/${this.recurso}/validarSubNivel`, { id, numero,niveles_id}, { headers })
        .subscribe(
          (response: any) => {
            resolve(response);
          },
          (error) => {
            resolve(false);
          }
        );
    });
  }
}