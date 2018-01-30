export class Contacto {
    constructor() {
        this.id = null;
        this.tipo = '';
        this.valor = '';
        this.whatsapp = false;
    }
}

export class Telefono {
    constructor(pais, provincia, numero) {
        this.pais = pais ? pais : '54';
        this.provincia = provincia ? provincia : '';
        this.numero = numero ? numero : '';
    }        
}