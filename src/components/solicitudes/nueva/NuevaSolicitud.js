
export default {
  data () {
    return {
      show_cargando: false,
      datos_cargados: false,
      step: 1,
      delegaciones: []
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
