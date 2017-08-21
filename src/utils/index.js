export function formatFecha(date_string) {
  if (date_string.indexOf('T') == -1) date_string += 'T15:16:23.729Z';
  let date = new Date(date_string);
  let dia = date.getDate();
  dia = (dia.toString().length == 1) ? '0'+dia : dia;
  let mes = date.getMonth()+1;
  mes = (mes.toString().length == 1) ? '0'+mes : mes;
  return `${dia}/${mes}/${date.getFullYear()}`;
}

export function upperFirst(str) {
  return str[0].toUpperCase() + str.substring(1, str.length);
}
