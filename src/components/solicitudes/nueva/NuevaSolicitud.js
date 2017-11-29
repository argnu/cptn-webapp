import axios from '@/axios';
import * as utils from '@/utils';
import rules from '@/rules';

const Header = (text, value) => ({
    text, value
})

function getTipoDomicilio(str) {
  return `domicilio${str[0].toUpperCase() + str.substring(1, str.length)}`;
}

export default {
  data () {
    return {
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

  computed: {
    select_options: function() {
      return {
        paises: this.paises ? this.paises.map(i => Header(i.nombre, i.id))  : [],

        provincias: {
            real: this.provincias.real ? this.provincias.real.map(i => Header(i.nombre, i.id))  : [],
            profesional: this.provincias.profesional ? this.provincias.profesional.map(i => Header(i.nombre, i.id))  : [],
            constituido: this.provincias.constituido ? this.provincias.constituido.map(i => Header(i.nombre, i.id))  : []
        },

        departamentos: {
            real: this.departamentos.real ? this.departamentos.real.map(i => Header(i.nombre, i.id))  : [],
            profesional: this.departamentos.profesional ? this.departamentos.profesional.map(i => Header(i.nombre, i.id))  : [],
            constituido: this.departamentos.constituido ? this.departamentos.constituido.map(i => Header(i.nombre, i.id))  : []
        },

        localidades: {
            real: this.localidades.real ? this.localidades.real.map(i => Header(i.nombre, i.id))  : [],
            profesional: this.localidades.profesional ? this.localidades.profesional.map(i => Header(i.nombre, i.id))  : [],
            constituido: this.localidades.constituido ? this.localidades.constituido.map(i => Header(i.nombre, i.id))  : []
        },

        delegaciones: this.delegaciones ? this.delegaciones.map(i => Header(i.nombre, i.id)) : [],
      }
    }
  },

  methods: {
    changePais: function(tipoDomicilio) {
      let domicilio = getTipoDomicilio(tipoDomicilio);
      let pais = this.solicitud.entidad[domicilio].pais;
      if (pais && pais.length) {
        let idPais = this.paises.find(p => p.nombre == pais).id;
        axios.get(`/provincias?pais_id=${idPais}`)
             .then(r => this.provincias[tipoDomicilio] = r.data)
             .catch(e => console.error(e));
      }
      else this.provincias[tipoDomicilio] = [];
    },

    changeProvincia: function(tipoDomicilio) {
      let domicilio = getTipoDomicilio(tipoDomicilio);
      let provincia = this.solicitud.entidad[domicilio].provincia;
      if (provincia && provincia.length) {
        let idProv = this.provincias[tipoDomicilio].find(p => p.nombre == provincia).id;
        axios.get(`/departamentos?provincia_id=${idProv}`)
             .then(r => this.departamentos[tipoDomicilio] = r.data)
             .catch(e => console.error(e));
      }
      else this.departamentos[tipoDomicilio] = [];
    },

    changeDepartamento: function(tipoDomicilio) {
      let domicilio = getTipoDomicilio(tipoDomicilio);
      let departamento = this.solicitud.entidad[domicilio].departamento;
      if (departamento && departamento.length) {
        let idDepto = this.departamentos[tipoDomicilio].find(p => p.nombre == departamento).id;
        axios.get(`/localidades?departamento_id=${idDepto}`)
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
      this.snackbar.msg = 'Ha ocurrido un error en la carga';
      this.snackbar.color = 'error';
      this.snackbar.show = true;
    },
  }
}
