import * as axios from 'axios';
import * as utils from '@/utils';
import rules from '@/rules';

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
          legal: []
        },
        departamentos: {
          real: [],
          legal: []
        },
        localidades: {
          real: [],
          legal: []
        }
      },

      validator: {
        solicitud: {
          fecha: [ rules.required, rules.fecha ], delegacion: [ rules.required ]
        },
        domicilioReal: {
          calle: [ rules.required ], numero: [ rules.required, rules.number ], localidad: [ rules.required ]
        },
        domicilioLegal: {
          calle: [ rules.required ], numero: [ rules.required, rules.number ], localidad: [ rules.required ]
        },
        contacto: {
          tipo: [ rules.required ], valor: [ rules.required ]
        },
      },
    }
  },

  computed: {
    paises: function() {
      return this.select_items.paises ? this.select_items.paises.map(i => i.nombre)  : [];
    },

    provincias: function() {
      return {
        real: this.select_items.provincias.real ? this.select_items.provincias.real.map(i => i.nombre)  : [],
        legal: this.select_items.provincias.legal ? this.select_items.provincias.legal.map(i => i.nombre)  : []
      }
    },

    departamentos: function() {
      return {
        real: this.select_items.departamentos.real ? this.select_items.departamentos.real.map(i => i.nombre)  : [],
        legal: this.select_items.departamentos.legal ? this.select_items.departamentos.legal.map(i => i.nombre)  : []
      }
    },

    localidades: function() {
      return {
        real: this.select_items.localidades.real ? this.select_items.localidades.real.map(i => i.nombre)  : [],
        legal: this.select_items.localidades.legal ? this.select_items.localidades.legal.map(i => i.nombre)  : []
      }
    },

    delegaciones: function() {
      return this.select_items.delegaciones ? this.select_items.delegaciones.map(i => i.nombre) : [];
    },
  },

  methods: {
    changePais: function(tipoDomicilio) {
      let domicilio = tipoDomicilio == 'real' ? 'domicilioReal' : 'domicilioLegal';
      let pais = this.solicitud.entidad[domicilio].pais;
      if (pais && pais.length) {
        let idPais = this.select_items.paises.find(p => p.nombre == pais).id;
        axios.get(`http://localhost:3400/api/provincias?pais_id=${idPais}`)
             .then(r => this.select_items.provincias[tipoDomicilio] = r.data)
             .catch(e => console.error(e));
      }
      else this.select_items.provincias[tipoDomicilio] = [];
    },

    changeProvincia: function(tipoDomicilio) {
      let domicilio = tipoDomicilio == 'real' ? 'domicilioReal' : 'domicilioLegal';
      let provincia = this.solicitud.entidad[domicilio].provincia;
      if (provincia && provincia.length) {
        let idProv = this.select_items.provincias[tipoDomicilio].find(p => p.nombre == provincia).id;
        axios.get(`http://localhost:3400/api/departamentos?provincia_id=${idProv}`)
             .then(r => this.select_items.departamentos[tipoDomicilio] = r.data)
             .catch(e => console.error(e));
      }
      else this.select_items.departamentos[tipoDomicilio] = [];
    },

    changeDepartamento: function(tipoDomicilio) {
      let domicilio = tipoDomicilio == 'real' ? 'domicilioReal' : 'domicilioLegal';
      let departamento = this.solicitud.entidad[domicilio].departamento;
      if (departamento && departamento.length) {
        let idDepto = this.select_items.departamentos[tipoDomicilio].find(p => p.nombre == departamento).id;
        axios.get(`http://localhost:3400/api/localidades?departamento_id=${idDepto}`)
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
