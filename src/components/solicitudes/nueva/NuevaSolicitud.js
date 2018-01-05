import Vue from 'vue'
import axios from '@/axios'
import * as utils from '@/utils'
import rules from '@/rules'
import { Contacto } from '@/model'

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

      nuevo_contacto: new Contacto(),

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
        domicilio: {
          pais: [rules.required], provincia: [rules.required], departamento: [rules.required], 
          calle: [ rules.required ], numero: [ rules.required, rules.number ], localidad: [ rules.required ]
        },
        contacto: {
          tipo: [rules.required], valor: [ rules.required ]
        },
      },
    }
  },

  methods: {
    changePais: function(tipoDomicilio, domicilio_existente) {
      let domicilio = getTipoDomicilio(tipoDomicilio);
      if (this.solicitud.entidad[domicilio].pais) {
        axios.get(`/provincias?pais_id=${this.solicitud.entidad[domicilio].pais}`)
             .then(r => {
               this.provincias[tipoDomicilio] = r.data;
               if (domicilio_existente) {                 
                 this.solicitud.entidad[domicilio].provincia = r.data.find(i => i.nombre == domicilio_existente.provincia).id;
                 this.changeProvincia(tipoDomicilio, domicilio_existente)
               }
              })
             .catch(e => console.error(e));
      }
      else this.provincias[tipoDomicilio] = [];
    },

    changeProvincia: function (tipoDomicilio, domicilio_existente) {
      let domicilio = getTipoDomicilio(tipoDomicilio);
      if (this.solicitud.entidad[domicilio].provincia) {        
        axios.get(`/departamentos?provincia_id=${this.solicitud.entidad[domicilio].provincia}`)
             .then(r => {
               this.departamentos[tipoDomicilio] = r.data;
               if (domicilio_existente) {
                 this.solicitud.entidad[domicilio].departamento = r.data.find(i => i.nombre == domicilio_existente.departamento).id;
                 this.changeDepartamento(tipoDomicilio, domicilio_existente)
               }
              })
             .catch(e => console.error(e));
      }
      else this.departamentos[tipoDomicilio] = [];
    },

    changeDepartamento: function (tipoDomicilio, domicilio_existente) {
      let domicilio = getTipoDomicilio(tipoDomicilio);
      if (this.solicitud.entidad[domicilio].departamento) {
        axios.get(`/localidades?departamento_id=${this.solicitud.entidad[domicilio].departamento}`)
             .then(r => {
               this.localidades[tipoDomicilio] = r.data
               if (domicilio_existente) {
                 this.solicitud.entidad[domicilio].localidad = r.data.find(i => i.nombre == domicilio_existente.localidad).id;
               }               
              })
             .catch(e => console.error(e));
      }
      else this.localidades[tipoDomicilio] = [];
    },

    addContacto: function () {
      this.submitted.contacto = true;
      if (this.nuevo_contacto.tipo === 2) {
        this.nuevo_contacto.valor = this.nuevo_contacto.celular.prefijo + this.nuevo_contacto.celular.numero;
      }
      if (utils.validObject(this.nuevo_contacto, this.validator.contacto)) {
        this.solicitud.entidad.contactos.push(this.nuevo_contacto);
        this.submitted.contacto = false;
        this.nuevo_contacto = new Contacto();
      }
    },    

    removeElem: function(tipo, index) {
      this.solicitud.entidad[tipo].splice(index, 1);
    },

    nextStep: function() {
      Vue.set(this.submitted.steps, this.step-1, true);
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
