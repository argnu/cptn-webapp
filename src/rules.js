export default {
  required: value => !!value || 'Dato Obligatorio',

  number: value => value && value.length ? (/^\d+,{0,1}\d+$/.test(value) || 'Formato incorrecto') : true,

  integer: value => value && value.length ? (/^\d+$/.test(value) || 'Formato incorrecto') : true,

  fecha: value => {
    if (!(value && value.length)) return true;
    let [dia, mes, anio] = value.split('/');
    if (isNaN(dia) || dia < 1 || dia > 31) return 'Formato incorrecto';
    if (isNaN(mes) || mes < 1 || mes > 12) return 'Formato incorrecto';
    if (isNaN(anio) || anio.length != 4) return 'Formato incorrecto';
    return true;
  },

  codpostal: value => {
    if (!(value && value.length)) return true;
    if (value.length != 4 || isNaN(value)) return 'Formato incorrecto';
    return true;
  },

  prefijoCelular: value => {
    if (!(value && value.length)) return true;
    if (value.substring(0, 1) == '0') return 'Formato incorrecto. Omitir 0';
    return true;
  },

  prefijoCelularPais: value => value && value.length ?
      /^\d{1,3}/.test(value)
    : true,

  numeroCelular: value => {
    if (!(value && value.length)) return true;
    if (value.substring(0,2) == '15') return 'Formato incorrecto. Omitir 15';
    return true;
  },

  email: value => value && value.length ? 
    (/(^$|^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/.test(value) 
      || 'Formato incorrecto'
    ) 
    : true,

  url: value => value && value.length ?
    (/^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value) 
     || 'Formato incorrecto'
    )
    : true,
}
