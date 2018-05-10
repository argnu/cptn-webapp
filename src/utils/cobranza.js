import * as moment from 'moment'

export function calculoIntereses(boleta, fecha_pago, interes_tasa, interes_dias) {
  let interes = 0;
  if (boleta.fecha_vencimiento) {
      let cant_dias = moment(fecha_pago, 'DD/MM/YYYY').diff(moment(boleta.fecha_vencimiento), 'days');
      if (cant_dias > 0) interes = (boleta.total * (interes_tasa / interes_dias) * cant_dias) / 100;
  }
  return interes;
}