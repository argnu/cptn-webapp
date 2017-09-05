import { Profesional } from '@/model/Profesional';
import { Empresa } from '@/model/Empresa';

export class Solicitud {
  constructor(tipo) {
    this.fecha = '';
    this.delegacion = '';
    if (tipo == 'profesional')
      this.profesional = new Profesional();
    else if (tipo == 'empresa')
      this.empresa = new Empresa();
    this.exencionArt10 = false;
    this.exencionArt6 = false;
  }
}
