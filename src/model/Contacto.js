export class Contacto {
    constructor() {
        this.id = null;
        this.tipo = '';
        this.valor = '';
        this.whatsapp = false;
        this.celular = {
            prefijo: '',
            numero: ''
        };
    }
}