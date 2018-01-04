import { Profesional } from '@/model/Profesional';
import { Empresa } from '@/model/Empresa';
import Store from '@/Store'

export class Solicitud {
  constructor(tipo) {
    this.fecha = '';
    this.delegacion = Store.state.delegacion;
    if (tipo == 'profesional')
      this.entidad = new Profesional();
    else if (tipo == 'empresa')
      this.entidad = new Empresa();
    this.exencionArt10 = false;
    this.exencionArt6 = false;
    this.operador = null;
  }
}
