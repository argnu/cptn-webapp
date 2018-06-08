export class Entidad {
    constructor() {
        this.tipo = '';
        this.recibirActualizaciones = true;
        this.nombre = '';
        this.cuit = '';
        this.domicilios = [];
        this.contactos = [];
        this.condiciones_afip = [];
    }
}

export class EntidadCondicionAfip {
  constructor() {
    this.condicion_afip = '';
    this.descripcion = '';
  }
}