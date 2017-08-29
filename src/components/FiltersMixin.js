import * as utils from '@/utils';

export default {
  filters: {
    formatFecha: function(str) {
      return utils.formatFecha(str);
    },

    upperFirst: function(str) {
      return str ? utils.upperFirst(str) : '';
    },

    boolean: function(v) {
      return v ? 'Sí' : 'No'
    }
  },
}
