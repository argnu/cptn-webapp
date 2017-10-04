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
  }
}
