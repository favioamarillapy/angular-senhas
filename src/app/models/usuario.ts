export class Usuario {
    constructor(
        public id: number,
        public nombre_completo: string,
        public email: string,
        public password: string,
        public rol: string,
        public sub?: number
    ) { }
}
