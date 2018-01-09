import Vue from 'vue'
import axios from '@/axios'
import * as utils from '@/utils'
import rules from '@/rules'
import { Contacto, Domicilio, Header } from '@/model'

const EntidadDomicilio = () => ({
    tipo: '',
    domicilio: new Domicilio()
})

const tipos_domicilio = [
  Header('Real', 'real'),
  Header('Legal', 'legal'),
  Header('Especial', 'especial')
]


const headers = {
  contactos: [
    Header('Tipo', 'tipo'),
    Header('Valor', 'valor'),
  ],

  incumbencias: [
    Header('Nombre', 'nombre'),
  ],

  matriculados: [
    Header('N°', 'numero'),
    Header('Nombre', 'nombre'),
    Header('Apellido', 'nombre'),
    Header('DNI', 'dni')
  ],

  domicilios: [
    Header('Tipo', 'tipo'),
    Header('País', 'pais'),
    Header('Provincia', 'provincia'),
    Header('Departamento', 'departamento'),
    Header('Localidad', 'localidad'),
    Header('Calle', 'calle'),
    Header('N°', 'numero')
  ],

  formacion: [
    Header('Título', 'titulo'),
    Header('Fecha', 'fecha'),
    Header('Institución', 'institucion')
  ],

  beneficiarios: [
    Header('DNI', 'dni'),
    Header('Apellido', 'apellido'),
    Header('Nombre', 'nombre'),
    Header('Fecha de Nacimiento', 'fechaNacimiento'),
    Header('Vínculo', 'vinculo'),
    Header('Invalidez', 'invalidez')
  ],

  subsidiarios: [
    Header('DNI', 'dni'),
    Header('Apellido', 'apellido'),
    Header('Nombre', 'nombre'),
    Header('Porcentaje', 'porcentaje')
  ]
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
      nuevo_domicilio: EntidadDomicilio(),

      delegaciones: [],
      opciones: {},
      paises: [],
      provincias: [],
      departamentos: [],
      localidades: [],

      validator: {
        solicitud: {
          fecha: [ rules.required, rules.fecha ], delegacion: [ rules.required ]
        },
        entdomicilio: {
          tipo: [rules.required],
          domicilio: {
            pais: [rules.required], provincia: [rules.required], departamento: [rules.required],
            calle: [ rules.required ], numero: [ rules.required, rules.number ], localidad: [ rules.required ]
          }
        },
        contacto: {
          tipo: [rules.required], valor: [ rules.required ]
        },
      },
    }
  },

  computed: {
    headers: function() {
      return headers;
    },

    tipos_domicilio: function() {
      if (!this.solicitud.entidad.domicilios.length) return tipos_domicilio;
      else {
        let tipos = this.solicitud.entidad.domicilios.map(d => d.tipo);
        return tipos_domicilio.filter(d => {
          return !tipos.find(t => t == d.value)
        });
      }
    }    ,

    tipos_domicilio_cargados: function() {
      if (!this.solicitud.entidad.domicilios.length) return [];
      else {
        let tipos = this.solicitud.entidad.domicilios.map(d => d.tipo);
        return tipos_domicilio.filter(d => {
          return tipos.find(t => t == d.value)
        });
      }
    }
  },

  methods: {
    changePais: function() {
      if (this.nuevo_domicilio.domicilio.pais) {
        axios.get(`/provincias?pais_id=${this.nuevo_domicilio.domicilio.pais}`)
             .then(r => this.provincias = r.data)
             .catch(e => console.error(e));
      }
      else this.provincias = [];
    },

    changeProvincia: function () {
      if (this.nuevo_domicilio.domicilio.provincia) {
        axios.get(`/departamentos?provincia_id=${this.nuevo_domicilio.domicilio.provincia}`)
             .then(r => this.departamentos = r.data)
             .catch(e => console.error(e));
      }
      else this.departamentos = [];
    },

    changeDepartamento: function () {
      if (this.nuevo_domicilio.domicilio.departamento) {
        axios.get(`/localidades?departamento_id=${this.nuevo_domicilio.domicilio.departamento}`)
             .then(r => this.localidades = r.data)
             .catch(e => console.error(e));
      }
      else this.localidades = [];
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

    addDomicilio: function () {
      this.submitted.domicilio = true;
      if (utils.validObject(this.nuevo_domicilio, this.validator.entdomicilio)) {
        this.nuevo_domicilio.pais_nombre = this.paises.find(p => p.id == this.nuevo_domicilio.domicilio.pais).nombre;
        this.nuevo_domicilio.provincia_nombre = this.provincias.find(p => p.id == this.nuevo_domicilio.domicilio.provincia).nombre;
        this.nuevo_domicilio.departamento_nombre = this.departamentos.find(p => p.id == this.nuevo_domicilio.domicilio.departamento).nombre;
        this.nuevo_domicilio.localidad_nombre = this.localidades.find(p => p.id == this.nuevo_domicilio.domicilio.localidad).nombre;
        this.solicitud.entidad.domicilios.push(this.nuevo_domicilio);
        this.submitted.domicilio = false;
        this.nuevo_domicilio = EntidadDomicilio();
      }
    },

    copiarDomicilio: function(tipo) {
      let domicilio_copiar = this.solicitud.entidad.domicilios.find(d => d.tipo == tipo).domicilio;

      if (typeof domicilio_copiar.pais == 'number') {
        this.nuevo_domicilio.domicilio.pais = domicilio_copiar.pais;
        axios.get(`/provincias?pais_id=${this.nuevo_domicilio.domicilio.pais}`)
          .then(r => {
            this.provincias = r.data;
            this.nuevo_domicilio.domicilio.provincia = domicilio_copiar.provincia;
            return axios.get(`/departamentos?provincia_id=${this.nuevo_domicilio.domicilio.provincia}`)
          })
          .then(r => {
            this.departamentos = r.data
            this.nuevo_domicilio.domicilio.departamento = domicilio_copiar.departamento;
            return axios.get(`/localidades?departamento_id=${this.nuevo_domicilio.domicilio.departamento}`)
          })
          .then(r => {
            this.localidades = r.data;
            this.nuevo_domicilio.domicilio.localidad = domicilio_copiar.localidad;
            this.nuevo_domicilio.domicilio.calle = domicilio_copiar.calle;
            this.nuevo_domicilio.domicilio.numero = domicilio_copiar.numero;
          })
          .catch(e => console.error(e));
      }
      
      else {
        this.nuevo_domicilio.domicilio.pais = this.paises.find(p => p.nombre == domicilio_copiar.pais).id;
        axios.get(`/provincias?pais_id=${this.nuevo_domicilio.domicilio.pais}`)
          .then(r => {
            this.provincias = r.data;
            this.nuevo_domicilio.domicilio.provincia = this.provincias.find(p => p.nombre == domicilio_copiar.provincia).id;
            return axios.get(`/departamentos?provincia_id=${this.nuevo_domicilio.domicilio.provincia}`)
          })
          .then(r => {
            this.departamentos = r.data
            this.nuevo_domicilio.domicilio.departamento = this.departamentos.find(p => p.nombre == domicilio_copiar.departamento).id;
            return axios.get(`/localidades?departamento_id=${this.nuevo_domicilio.domicilio.departamento}`)
          })
          .then(r => {
            this.localidades = r.data;
            this.nuevo_domicilio.domicilio.localidad = this.localidades.find(p => p.nombre == domicilio_copiar.localidad).id;
            this.nuevo_domicilio.domicilio.calle = domicilio_copiar.calle;
            this.nuevo_domicilio.domicilio.numero = domicilio_copiar.numero || '';
          })
          .catch(e => console.error(e));
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
