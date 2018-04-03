export class Persona {
    constructor() {
        this.id = '';
        this.tipo = '';
        this.nombre = '';
        this.cuit = '';
        this.telefono = '';
    }
}

export class PersonaJuridica extends Persona {
    constructor() {
        super();
        this.tipo = 'juridica';
    }
}

export class PersonaFisica extends Persona {
    constructor() {
        super();
        this.tipo = 'fisica';
        this.apellido = '';
        this.dni = '';
    }
}

export class Comitente {
    constructor(tipo) {
        this.porcentaje = '';
        this.id = null;        
        if (tipo == 'fisica') 
            this.persona = new PersonaFisica();
        else 
            this.persona = new PersonaJuridica();
    }
}