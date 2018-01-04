export default {
  required: (value) => !!value || 'Dato Obligatorio',

  number: (value) => !isNaN(value) || 'Formato incorrecto',

  fecha: (value) => {
    let [dia, mes, anio] = value.split('/');
    if (isNaN(dia) || dia < 1 || dia > 31) return 'Formato incorrecto';
    if (isNaN(mes) || mes < 1 || mes > 12) return 'Formato incorrecto';
    if (isNaN(anio) || anio.length != 4) return 'Formato incorrecto';
    return true;
  },

  codpostal: (value) => {
    if (value.length != 4 || isNaN(value)) return 'Formato incorrecto';
    return true;
  },

  prefijoCelular: (value) => {
    if (value.substring(0, 1) == '0') return 'Formato incorrecto. Omitir 0';
    return true;
  },

  numeroCelular: (value) => {
    if (value.substring(0,2) == '15') return 'Formato incorrecto. Omitir 15';
    return true;
  },
}
