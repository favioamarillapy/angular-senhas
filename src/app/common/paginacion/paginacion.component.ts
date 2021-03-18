import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-paginacion',
  templateUrl: './paginacion.component.html',
  styleUrls: ['./paginacion.component.css']
})
export class PaginacionComponent implements OnInit {

  @Output() actualizarPagina = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  actualizar(pagina) {
    this.actualizarPagina.emit(pagina);
  }
}
