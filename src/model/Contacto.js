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
        this.pais = pais ? pais : '';
        this.provincia = provincia ? provincia : '';
        this.numero = '';
    }        
}