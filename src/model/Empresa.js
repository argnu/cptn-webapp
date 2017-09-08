import { Domicilio } from '@/model/Domicilio';

export class Empresa {
  constructor() {
    this.nombre = '';
    this.cuit = '';
    this.fechaInicio = '';
    this.fechaConstitucion = '';
    this.tipoEmpresa = '';
    this.tipoSociedad = '';
    this.domicilioReal = new Domicilio();
    this.domicilioLegal = new Domicilio();
    this.contactos = [];
    this.incumbencias = [];
  }
}
