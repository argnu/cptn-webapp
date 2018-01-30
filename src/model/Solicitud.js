import { Profesional } from '@/model/Profesional'
import { Empresa } from '@/model/Empresa'
import * as moment from 'moment'

export class Solicitud {
  constructor(tipo) {
    this.fecha = moment().format('DD/MM/YYYY');
    this.delegacion = '';
    if (tipo == 'profesional')
      this.entidad = new Profesional();
    else if (tipo == 'empresa')
      this.entidad = new Empresa();
    this.operador = null;
  }
}
