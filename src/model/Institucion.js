import { Domicilio } from '@/model/Domicilio'

export class Institucion {
    constructor() {
        this.nombre = '';
        this.cue = '';
        this.domicilio = new Domicilio();
        this.titulos = [];
    }
}

export class Titulo {
    constructor() {
        this.nombre = '';
        this.nivel = '';
        this.tipo_matricula = '';
        this.validez_fecha_inicio = null;
        this.validez_fecha_fin = null;
    }
}