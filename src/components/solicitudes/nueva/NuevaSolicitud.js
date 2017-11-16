import axios from '@/axios';
import * as utils from '@/utils';
import rules from '@/rules';

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

      select_items: {
        delegaciones: [],
        tipoContacto: [],
        condafip: [],
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
        }
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

  filters: {
    formatFecha: function(str) {
      return utils.formatFecha(str);
    },

    boolean: function(str) {
      return str ? 'Sí' : 'No';
    }
  },

  computed: {
    paises: function() {
      return this.select_items.paises ? this.select_items.paises.map(i => i.nombre)  : [];
    },

    provincias: function() {
      return {
        real: this.select_items.provincias.real ? this.select_items.provincias.real.map(i => i.nombre)  : [],
        profesional: this.select_items.provincias.profesional ? this.select_items.provincias.profesional.map(i => i.nombre)  : [],
        constituido: this.select_items.provincias.constituido ? this.select_items.provincias.constituido.map(i => i.nombre)  : []
      }
    },

    departamentos: function() {
      return {
        real: this.select_items.departamentos.real ? this.select_items.departamentos.real.map(i => i.nombre)  : [],
        profesional: this.select_items.departamentos.profesional ? this.select_items.departamentos.profesional.map(i => i.nombre)  : [],
        constituido: this.select_items.departamentos.constituido ? this.select_items.departamentos.constituido.map(i => i.nombre)  : []
      }
    },

    localidades: function() {
      return {
        real: this.select_items.localidades.real ? this.select_items.localidades.real.map(i => i.nombre)  : [],
        profesional: this.select_items.localidades.profesional ? this.select_items.localidades.profesional.map(i => i.nombre)  : [],
        constituido: this.select_items.localidades.constituido ? this.select_items.localidades.constituido.map(i => i.nombre)  : []
      }
    },

    delegaciones: function() {
      return this.select_items.delegaciones ? this.select_items.delegaciones.map(i => i.nombre) : [];
    },
  },

  methods: {
    changePais: function(tipoDomicilio) {
      let domicilio = getTipoDomicilio(tipoDomicilio);
      let pais = this.solicitud.entidad[domicilio].pais;
      if (pais && pais.length) {
        let idPais = this.select_items.paises.find(p => p.nombre == pais).id;
        axios.get(`/provincias?pais_id=${idPais}`)
             .then(r => this.select_items.provincias[tipoDomicilio] = r.data)
             .catch(e => console.error(e));
      }
      else this.select_items.provincias[tipoDomicilio] = [];
    },

    changeProvincia: function(tipoDomicilio) {
      let domicilio = getTipoDomicilio(tipoDomicilio);
      let provincia = this.solicitud.entidad[domicilio].provincia;
      if (provincia && provincia.length) {
        let idProv = this.select_items.provincias[tipoDomicilio].find(p => p.nombre == provincia).id;
        axios.get(`/departamentos?provincia_id=${idProv}`)
             .then(r => this.select_items.departamentos[tipoDomicilio] = r.data)
             .catch(e => console.error(e));
      }
      else this.select_items.departamentos[tipoDomicilio] = [];
    },

    changeDepartamento: function(tipoDomicilio) {
      let domicilio = getTipoDomicilio(tipoDomicilio);
      let departamento = this.solicitud.entidad[domicilio].departamento;
      if (departamento && departamento.length) {
        let idDepto = this.select_items.departamentos[tipoDomicilio].find(p => p.nombre == departamento).id;
        axios.get(`/localidades?departamento_id=${idDepto}`)
             .then(r => this.select_items.localidades[tipoDomicilio] = r.data)
             .catch(e => console.error(e));
      }
      else this.select_items.localidades[tipoDomicilio] = [];
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
