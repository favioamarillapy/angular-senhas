import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { BaseService } from './base.service'

const API = environment.api;



@Injectable({
  providedIn: 'root'
})
export class NivelService extends BaseService {

  recurso = 'nivel'

  validarnivel(numero, id?) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return new Promise<boolean>(resolve => {
      this.http.post(`${API}/${this.recurso}/validarNivel`, { id, numero }, { headers })
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





