import { Domicilio } from '@/model/Domicilio';

export class Empresa {
  constructor() {
    this.tipo = 'empresa';
    this.nombre = '';
    this.cuit = '';
    this.condafip = '';
    this.fechaInicio = '';
    this.fechaConstitucion = '';
    this.tipoEmpresa = '';
    this.tipoSociedad = '';
    this.domicilioReal = new Domicilio();
    this.domicilioProfesional = new Domicilio();
    this.domicilioConstituido = new Domicilio();
    this.contactos = [];
    this.incumbencias = [];
  }
}
