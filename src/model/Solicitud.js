import { Profesional } from '@/model/Profesional';
import { Empresa } from '@/model/Empresa';

export class Solicitud {
  constructor(tipo) {
    this.fecha = '';
    this.delegacion = '';
    this.tipoEntidad = tipo;
    if (tipo == 'profesional')
      this.entidad = new Profesional();
    else if (tipo == 'empresa')
      this.entidad = new Empresa();
    this.exencionArt10 = false;
    this.exencionArt6 = false;
  }
}
