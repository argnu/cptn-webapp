import { Domicilio } from '@/model/Domicilio'

export class Institucion {
    constructor() {
        this.nombre = '';
        this.cue = '';
        this.domicilio = new Domicilio();
        this.valida = true;
        this.titulos = [];
    }
}

export class Titulo {
    constructor() {
        this.nombre = '';
        this.nivel = '';
        this.tipo_matricula = '';
        this.valido = true;
        this.incumbencias = [];
    }
}