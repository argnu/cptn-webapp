import Vue from 'vue'
import api from '@/services/api'
import * as utils from '@/utils'
import rules from '@/validation/rules.js'
import { Contacto, Telefono, Domicilio, Header } from '@/model'

const EntidadDomicilio = () => ({
    tipo: 'real',
    domicilio: new Domicilio()
})

class EntidadCondicionAfip {
  constructor() {
    this.condicion_afip = '';
    this.descripcion = '';
  }
}

const tipos_domicilio = [
  Header('Real (Domicilio Declarado en DNI)', 'real'),
  Header('Legal (Domicilio Profesional)', 'legal'),
  Header('Especial (Domicilio Constituido)', 'especial')
]


const headers = {
  contactos: [
    Header('', 'acciones'),
    Header('Tipo', 'tipo'),
    Header('Valor', 'valor'),
  ],

  condafip: [
    Header('', 'acciones'),
    Header('Tipo', 'tipo'),
    Header('Descripción', 'descripcion'),
  ],

  matriculados: [
    Header('', 'acciones'),
    Header('N°', 'numero'),
    Header('Nombre', 'nombre'),
    Header('Apellido', 'nombre'),
    Header('DNI', 'dni')
  ],

  domicilios: [
    Header('', 'acciones'),
    Header('Tipo', 'tipo'),
    Header('País', 'pais'),
    Header('Provincia', 'provincia'),
    Header('Departamento', 'departamento'),
    Header('Localidad', 'localidad'),
    Header('Dirección', 'direccion'),
  ],

  formacion: [
    Header('', 'acciones'),
    Header('Título', 'titulo'),
    Header('Institución', 'institucion'),
    Header('Fecha de Egreso', 'fechaEgreso'),
    Header('Fecha de Emisión', 'fechaEmision'),
    Header('Lapso Emisión', 'tiempoEmision')
  ],

  subsidiarios: [
    Header('', 'acciones'),
    Header('DNI', 'dni'),
    Header('Apellido', 'apellido'),
    Header('Nombre', 'nombre'),
    Header('Porcentaje', 'porcentaje')
  ],

  caja_previsional: [
    Header('', 'acciones'),
    Header('Nombre', 'nombre')
  ]
}

export default {
  data () {
    return {
      show_cargando: false,
      datos_cargados: false,
      domicilio_edit: null,
      contacto_edit: null,
      condafip_edit: null,
      step: 1,
      nuevo_contacto: new Contacto(),
      nueva_condafip: new EntidadCondicionAfip(),
      placeholder_contacto: '',
      rules_contacto: [rules.required],
      nuevo_telefono: new Telefono(),
      nuevo_domicilio: EntidadDomicilio(),
      delegaciones: [],
      opciones: {},
      paises: [],
      provincias: [],
      departamentos: [],
      localidades: [],
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
    },

    valid_domicilios: function() {
      return this.solicitud.entidad.domicilios.length > 0;
    }
  },

  methods: {
    getCondicionAfip: function(condicion) {
      if (typeof condicion == 'number')
        return this.opciones.condicionafip.find(c => condicion == c.id).valor;
      else
        return condicion.valor;
    },

    getTipoContacto: function(id) {
      return this.opciones.contacto.find(i => id == i.id).valor;
    },

    changePais: function() {
      if (this.nuevo_domicilio.domicilio.pais) {
        return api.get(`/provincias?pais_id=${this.nuevo_domicilio.domicilio.pais.id}`)
             .then(r => this.provincias = r.data)
             .catch(e => {
               console.error(e);
               Promise.reject(e);
              });
      }
      else {
        this.provincias = [];
        return Promise.resolve();
      }
    },

    changeProvincia: function () {
      if (this.nuevo_domicilio.domicilio.provincia) {
        return api.get(`/departamentos?provincia_id=${this.nuevo_domicilio.domicilio.provincia.id}`)
             .then(r => this.departamentos = r.data)
             .catch(e => {
               console.error(e);
               Promise.reject(e);
              });
      }
      else {
        this.departamentos = [];
        return Promise.resolve();
      }
    },

    changeDepartamento: function () {
      if (this.nuevo_domicilio.domicilio.departamento) {
        return api.get(`/localidades?departamento_id=${this.nuevo_domicilio.domicilio.departamento.id}`)
             .then(r => this.localidades = r.data)
             .catch(e => {
               console.error(e);
               Promise.reject(e);
              });
      }
      else {
        this.localidades = [];
        return Promise.resolve();
      }
    },

    chgTipoContacto: function(e) {
      if (e == 3) {
        this.rules_contacto = [rules.required, rules.email];
        this.placeholder_contacto = 'Ej. mweingart@argnu.org'
      }
      else if (e == 4) {
        this.rules_contacto = [rules.required, rules.url];
        this.placeholder_contacto = 'Ej. http://www.liberascio.org';
      }
      else this.placeholder_contacto = '';
    },

    addContacto: function () {
      if (this.$refs.form_contacto.validate()) {
        if (this.nuevo_contacto.tipo === 1 || this.nuevo_contacto.tipo === 2) {
          this.nuevo_contacto.valor = `+${this.nuevo_telefono.pais}-${this.nuevo_telefono.provincia}-${this.nuevo_telefono.numero}`;
        }

        if (this.contacto_edit == null) {
          this.solicitud.entidad.contactos.push(this.nuevo_contacto);
        }
        else {
          Vue.set(this.solicitud.entidad.contactos, this.contacto_edit, this.nuevo_contacto);
        }

        this.nuevo_contacto = new Contacto();
        this.nuevo_telefono = new Telefono();
        this.$refs.form_contacto.reset();
        this.contacto_edit = null;
      }
    },

    editContacto: function(index) {
      this.contacto_edit = index;
      this.nuevo_contacto = utils.clone(this.solicitud.entidad.contactos[index]);
      if (this.nuevo_contacto.tipo === 1 || this.nuevo_contacto.tipo === 2) {
        let params = this.nuevo_contacto.valor.substring(1, this.nuevo_contacto.valor.length).split('-')
        if (!this.nuevo_contacto.valor[0] == '+') params[0] = '54';
        this.nuevo_telefono = new Telefono(...params);
      }
    },

    cancelarEditContacto: function() {
      this.contacto_edit = null;
      this.nuevo_contacto = new Contacto();
      this.nuevo_telefono = new Telefono();
      this.$refs.form_contacto.reset();
    },

    addCondAfip: function () {
      if (this.$refs.form_condafip.validate()) {
        if (this.condafip_edit == null) {
          this.solicitud.entidad.condiciones_afip.push(this.nueva_condafip);
        }
        else {
          Vue.set(this.solicitud.entidad.condiciones_afip, this.condafip_edit, this.nueva_condafip);
        }

        this.nueva_condafip = new EntidadCondicionAfip();
        this.$refs.form_condafip.reset();
        this.condafip_edit = null;
      }
    },

    editCondAfip: function(index) {
      this.condafip_edit = index;
      this.nueva_condafip = utils.clone(this.solicitud.entidad.condiciones_afip[index]);
    },

    cancelarEditCondAfip: function() {
      this.condafip_edit = null;
      this.nueva_condafip = new Contacto();
      this.$refs.form_condafip.reset();
    },

    addDomicilio: function () {
      if (this.$refs.form_domicilio.validate()) {
        if (this.domicilio_edit != null) {
          this.nuevo_domicilio.tipo = this.solicitud.entidad.domicilios[this.domicilio_edit].tipo;
          this.nuevo_domicilio.id = this.solicitud.entidad.domicilios[this.domicilio_edit].id;
          Vue.set(this.solicitud.entidad.domicilios, this.domicilio_edit, this.nuevo_domicilio);
        }
        else {
          this.solicitud.entidad.domicilios.push(this.nuevo_domicilio);
        }
        
        this.resetDomicilio();
      }
    },

    copiarDomicilio: function(tipo) {
      let domicilio_copiar = this.solicitud.entidad.domicilios.find(d => d.tipo == tipo).domicilio;
      this.nuevo_domicilio.domicilio = utils.clone(domicilio_copiar);
      this.changeCombosDomicilio();
    },

    changeCombosDomicilio: function() {
      api.get(`/provincias?pais_id=${this.nuevo_domicilio.domicilio.pais.id}`)
      .then(r => {
        this.provincias = r.data;
        return api.get(`/departamentos?provincia_id=${this.nuevo_domicilio.domicilio.provincia.id}`)
      })
      .then(r => {
        this.departamentos = r.data;
        return api.get(`/localidades?departamento_id=${this.nuevo_domicilio.domicilio.departamento.id}`)
      })
      .then(r => {
        this.localidades = r.data;
      })
      .catch(e => console.error(e));
    },

    editDomicilio: function(index) {
      this.domicilio_edit = index;
      this.nuevo_domicilio = utils.clone(this.solicitud.entidad.domicilios[index]);
      this.changeCombosDomicilio(this.solicitud.entidad.domicilios[index].domicilio);
    },

    resetDomicilio: function() {
      this.domicilio_edit = null;
      // this.$refs.form_domicilio.reset();
      this.nuevo_domicilio = EntidadDomicilio();
      this.nuevo_domicilio.domicilio.pais = 1;
      this.nuevo_domicilio.domicilio.provincia = 14;
      this.nuevo_domicilio.domicilio.departamento = this.global_state.delegacion.domicilio.departamento;
      this.nuevo_domicilio.domicilio.localidad = this.global_state.delegacion.domicilio.localidad;        
    },

    removeElem: function(tipo, index) {
      this.solicitud.entidad[tipo].splice(index, 1);
    },


    prevStep: function() {
      this.step = this.step - 1;
    }
  }
}
