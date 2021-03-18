import { JuegoOpcion } from './juego-opcion';

export class Juego {
    constructor(
        public id?: number,
        public nombre?: string,
        public imagen?: string,
        public sub_niveles_id?: number,
        public activo?: string,
        public opciones?: any
    ) { }
}
