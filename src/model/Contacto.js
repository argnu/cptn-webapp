export class Contacto {
    constructor() {
        this.id = null;
        this.tipo = '';
        this.valor = '';
        this.whatsapp = false;
    }
}

export class Telefono {
    constructor(pais, provincia) {
        this.pais = pais ? pais : 0;
        this.provincia = provincia ? provincia : 0;
        this.numero = 0;
    }        
}