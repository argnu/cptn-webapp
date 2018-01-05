import { Domicilio } from '@/model/Domicilio';

export class Entidad {
    constructor() {
        this.tipo = '';
        this.recibirActualizaciones = true;
        this.nombre = '';
        this.cuit = '';
        this.condafip = '';
        this.domicilioReal = new Domicilio();
        this.domicilioProfesional = new Domicilio();
        this.domicilioConstituido = new Domicilio();
        this.contactos = [];
    }
}
