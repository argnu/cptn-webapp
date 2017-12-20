import axios from '@/axios';
import * as utils from '@/utils';
import rules from '@/rules';
import Store from '@/Store'

const Header = (text, value) => ({
    text, value
})

function getTipoDomicilio(str) {
  return `domicilio${str[0].toUpperCase() + str.substring(1, str.length)}`;
}

export default {
  data () {
    return {
      global_state: Store.state,
      step: 1,

      snackbar: {
        msg: '',
        show: false,
        color: ''
      },

      delegaciones: [],
      opciones: {},
      paises: [],
      provincias: {
        real: [],
        profesional: [],
        constituido: []
      },
      departamentos: {
        real: [],
        profesional: [],
        constituido: []
      },
      localidades: {
        real: [],
        profesional: [],
        constituido: []
      },

      validator: {
        solicitud: {
          fecha: [ rules.required, rules.fecha ], delegacion: [ rules.required ]
        },
        domicilioReal: {
          calle: [ rules.required ], numero: [ rules.required, rules.number ], localidad: [ rules.required ]
        },
        domicilioProfesional: {
          calle: [ rules.required ], numero: [ rules.required, rules.number ], localidad: [ rules.required ]
        },
        domicilioConstituido: {
          calle: [ rules.required ], numero: [ rules.required, rules.number ], localidad: [ rules.required ]
        },
        contacto: {
          tipo: [ rules.required ], valor: [ rules.required ]
        },
      },
    }
  },

  methods: {
    changePais: function(tipoDomicilio) {
      let domicilio = getTipoDomicilio(tipoDomicilio);
      let id_pais = this.solicitud.entidad[domicilio].pais;
      if (id_pais) {
        axios.get(`/provincias?pais_id=${id_pais}`)
             .then(r => this.provincias[tipoDomicilio] = r.data)
             .catch(e => console.error(e));
      }
      else this.provincias[tipoDomicilio] = [];
    },

    changeProvincia: function(tipoDomicilio) {
      let domicilio = getTipoDomicilio(tipoDomicilio);
      let provincia = this.solicitud.entidad[domicilio].provincia;
      if (provincia) {
        axios.get(`/departamentos?provincia_id=${provincia}`)
             .then(r => this.departamentos[tipoDomicilio] = r.data)
             .catch(e => console.error(e));
      }
      else this.departamentos[tipoDomicilio] = [];
    },

    changeDepartamento: function(tipoDomicilio) {
      let domicilio = getTipoDomicilio(tipoDomicilio);
      let departamento = this.solicitud.entidad[domicilio].departamento;
      if (departamento) {
        axios.get(`/localidades?departamento_id=${departamento}`)
             .then(r => this.localidades[tipoDomicilio] = r.data)
             .catch(e => console.error(e));
      }
      else this.localidades[tipoDomicilio] = [];
    },

    removeElem: function(tipo, index) {
      this.solicitud.entidad[tipo].splice(index, 1);
    },

    nextStep: function() {
       this.steps[+this.step - 1].touched = true;
       if (this.validStep(this.step)) this.step = +this.step + 1;
    },

    prevStep: function() {
      this.step = this.step - 1;
    },

    submitError: function() {
      this.global_state.snackbar.msg = 'Ha ocurrido un error en la carga';
      this.global_state.snackbar.color = 'error';
      this.global_state.snackbar.show = true;
    },
  }
}
