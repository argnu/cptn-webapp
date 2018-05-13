import * as moment from 'moment'

export function getFloat(value) {
  if (typeof value == 'number') return value;
  return value && value.length ? parseFloat(value.replace(',', '.')) : null;
}

export function getFecha(fecha) {
  if (!fecha) return moment(fecha).format('DD/MM/YYYY');
  if (typeof fecha == 'object') 
    return moment(fecha).isValid() ? moment(fecha).format('DD/MM/YYYY') : '';
  else 
    return fecha;
}


export function upperFirst(str) {
  return str[0].toUpperCase() + str.substring(1, str.length);
}

export function changeGenero(srt) {
  return str.substring(0, str.length - 1) + 'a';
}

export function validRules(value, rules) {
  for (let rule of rules) {
    if (! (rule(value) === true)) return false;
  }
  return true;
}

export function validObject(original, rules) {
  for(let att in rules) {
    if (typeof original[att] == 'object') return validObject(original[att], rules[att]);
    if (!validRules(original[att], rules[att])) return false;
  }
  return true;
}

export function clone(obj) {
  return JSON.parse(JSON.stringify(obj));}

export function round(numero, decimales) {
  if (!numero) return 0;
  let factor = Math.pow(10, decimales);
  return Math.round(numero * factor) / factor;
}

export function deepEqual(a,b) {
  if( (typeof a == 'object' && a != null) &&
      (typeof b == 'object' && b != null) )
  {
     let count = [0,0];
     for( let key in a) count[0]++;
     for( let key in b) count[1]++;
     if( count[0]-count[1] != 0) {return false;}
     for( let key in a)
     {
       if(!(key in b) || !deepEqual(a[key],b[key])) {return false;}
     }
     for( let key in b)
     {
       if(!(key in a) || !deepEqual(b[key],a[key])) {return false;}
     }
     return true;
  }
  else
  {
     return a === b;
  }
}

export function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type:mimeString });
}

export const sortByFecha = (atributo) => {
  return (a, b) => moment(a[atributo]).diff(b[atributo], 'days');
}

export const sortByString = (atributo) => {
  return (a, b) => a[atributo].localeCompare(b[atributo]);
}

export const sortByNumber = (atributo) => {
  return (a, b) => b[atributo] - a[atributo];
}

export function diffDatesStr(d1, d2) {
  let str = '';
  let str_meses = '';
  let str_dias = '';

  let anios = d2.diff(d1, 'years');
  let fecha_mas_anios = d1.add(anios, 'years');
  let meses = d2.diff(fecha_mas_anios, 'months');
  let fecha_mas_meses = fecha_mas_anios.add(meses, 'months');
  let dias = moment().diff(fecha_mas_meses, 'days');

  if (anios) str += `${anios} año${anios > 1 ? 's' : ''}`;
  if (meses) str_meses += `${meses} mes${meses > 1 ? 'es' : ''}`;
  if (dias) str_dias += `${dias} día${dias > 1 ? 's' : ''}`;

  if (meses && !dias) return str + ' y ' + str_meses;
  if (meses && !anios && !dias) return str_meses;
  if (meses && !anios && dias) return str_meses + ' y ' + str_dias;
  if (!meses && anios && dias) return str + ' y ' + str_dias;
  if (!meses && !anios && dias) return str_dias;
  if (anios && meses && dias) return str + ', ' + str_meses + ' y ' + str_dias;

  return str;
}