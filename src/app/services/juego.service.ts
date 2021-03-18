import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class JuegoService extends BaseService {

  recurso = 'juego';

}
