import * as moment from 'moment'

export function calculoIntereses(boleta, fecha_pago) {
  let interes = 0;
  let tasa = 2.8;
  if (boleta.fecha_vencimiento) {
      let cant_dias = moment(fecha_pago).diff(moment(boleta.fecha_vencimiento), 'days');
      if (cant_dias > 0) interes = (boleta.total * (tasa / 30) * cant_dias) / 100;
  }
  return interes;
}