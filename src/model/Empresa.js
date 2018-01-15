import { Entidad } from '@/model/Entidad';

export class Empresa extends Entidad {
  constructor() {
    super();
    this.tipo = 'empresa';
    this.fechaInicio = '';
    this.fechaConstitucion = '';
    this.tipoEmpresa = '';
    this.tipoSociedad = '';
    this.incumbencias = [];
    this.representantes = [];
  }
}
