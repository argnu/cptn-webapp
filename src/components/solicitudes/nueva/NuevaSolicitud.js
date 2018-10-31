import Vue from 'vue'
import api from '@/services/api'

import rules from '@/validation/rules.js'


export default {
  data () {
    return {
      show_cargando: false,
      datos_cargados: false,
      step: 1,
      delegaciones: [],
      opciones: {},
    }
  },

  computed: {
    valid_domicilios: function() {
        return this.solicitud.entidad.domicilios.length > 0;
    },    
  },

  methods: {
    removeElem: function(tipo, index) {
      this.solicitud.entidad[tipo].splice(index, 1);
    },

    prevStep: function() {
      this.step = this.step - 1;
    }
  }
}
