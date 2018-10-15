import moment from 'moment'

export default {
  required: value => {
    if (Array.isArray(value)) return value.length > 0 || 'Debe seleccionar al menos un elemento';
    else return !!value || 'Dato Obligatorio'
  },

  number: value => value && value.length ? (/^\d+(,\d+)?$/.test(value) || 'Formato incorrecto') : true,

  dni: value => value && value.length ? (/^\d{7,8}$/.test(value) || 'Debe contener 7 u 8 números') : true,

  cuit: value => value && value.length ? (/^\d{11}$/.test(value) || 'Debe contener 11 números') : true,

  integer: value => value && value.length ? (/^\d+$/.test(value) || 'Formato incorrecto') : true,

  fecha: value => {
    if (!(value && value.length)) return true;
    return moment(value, 'DD/MM/YYYY', true).isValid() ? true : 'Fecha inválida';
  },

  codpostal: value => {
    if (!(value && value.length)) return true;
    if (value.length != 4 || isNaN(value)) return 'Formato incorrecto';
    return true;
  },

  telefono: {
    pais: value => value && value.length ?
      /^\d{1,3}/.test(value)
    : true,

    provincia: value => {
      if (!(value && value.length)) return true;
      if (!/^0/.test(value)) return 'Formato incorrecto. Debe comenzar con 0';
      return true;
    },
  },

  celular: {
    provincia: value => {
      if (!(value && value.length)) return true;
      if (value.substring(0, 1) == '0') return 'Formato incorrecto. Omitir 0';
      return true;
    },

    numero: value => {
      if (!(value && value.length)) return true;
      if (value.substring(0,2) == '15') return 'Formato incorrecto. Omitir 15';
      return true;
    }    
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

  dia: value => value < 0 || value > 31 ? 'Número de día inválido' : true,

  nomenclatura_catastral: value => value.length == 19 ?
    true : 'Faltan caracteres'
}
