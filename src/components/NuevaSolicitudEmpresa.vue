<template>
  <v-container>
      <v-snackbar
        :timeout="6000"
        :bottom="true"
        :right="true"
        :success="snackbar.context === 'success'"
        :error="snackbar.context === 'error'"
        v-model="snackbar.show"
      >
        {{ snackbar.msg }}
        <v-btn flat class="white--text" @click.native="snackbar.show = false">Cerrar</v-btn>
      </v-snackbar>


      <v-layout row wrap>
        <v-flex xs8>
          <form v-on:submit.prevent="submit">
          <v-toolbar class="indigo" dark>
            <v-toolbar-title class="white--text">Solicitud de Matriculación de Empresas</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-container>
             <v-stepper v-model="step" vertical>

               <!-- PASO 1: DATOS DE SOLICITUD -->
                <v-stepper-step step="1" edit-icon="check" editable :complete="validStep(1) && step > 1" :rules="[() => step <= 1 || validStep(1)]">
                 Datos de la Solicitud
                </v-stepper-step>
                <v-stepper-content step="1">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                      <v-card-text>
                        <v-layout row>
                          <v-flex xs6 class="ma-4">
                            <input-fecha
                              v-model="solicitud.fecha"
                              label="Fecha de Solicitud"
                              :rules="validator.solicitud.fecha"
                              :error="!validControl(validator.solicitud.fecha, solicitud.fecha) && steps[0].touched"
                            >
                            </input-fecha>
                          </v-flex>

                          <v-flex xs6 class="ma-4">
                            <typeahead
                              tabindex="2"
                              :items="select_items.delegacion"
                              v-model="solicitud.delegacion"
                              label="Delegación"
                              option="true"
                              :error="!validControl(validator.solicitud.delegacion, solicitud.delegacion) && steps[0].touched"
                              :rules="validator.solicitud.delegacion"
                            >
                            </typeahead>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                    <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                </v-stepper-content>


                <!-- PASO 2: DATOS DE EMPRESA -->
                <v-stepper-step step="2" edit-icon="check" editable :complete="validStep(2) && step > 2" :rules="[() => step <= 2 || validStep(2)]">
                  Datos de la Empresa
                </v-stepper-step>
                <v-stepper-content step="2">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-layout row>
                        <v-flex xs6 class="ma-4">
                          <v-text-field
                            label="Nombre"
                            v-model="solicitud.entidad.nombre"
                            tabindex="1"
                            :rules="validator.empresa.nombre"
                            :error="!validControl(validator.empresa.nombre, solicitud.entidad.nombre) && steps[1].touched"
                          >
                          </v-text-field>

                          <v-select
                            :items="select_items.tipoEmpresa"
                            v-model="solicitud.entidad.tipoEmpresa"
                            label="Tipo de Empresa" single-line bottom tabindex="5"
                            :rules="validator.empresa.tipoEmpresa"
                            :error="!validControl(validator.empresa.tipoEmpresa, solicitud.entidad.tipoEmpresa) && steps[1].touched"
                          >
                          </v-select>

                          <input-fecha
                              v-model="solicitud.entidad.fechaConstitucion"
                              label="Fecha de Constitución"
                          >
                          </input-fecha>

                          <v-select
                            :items="select_items.condafip"
                            v-model="solicitud.entidad.condafip"
                            label="Condición AFIP" single-line bottom tabindex="5"
                            :rules="validator.empresa.condafip"
                            :error="!validControl(validator.empresa.condafip, solicitud.entidad.confafip) && steps[1].touched"
                          >
                          </v-select>
                        </v-flex>

                        <v-flex xs6 class="ma-4">
                          <v-text-field
                            label="CUIT"
                            v-model="solicitud.entidad.cuit"
                            tabindex="1"
                            :rules="validator.empresa.cuit"
                            :error="!validControl(validator.empresa.cuit, solicitud.entidad.cuit) && steps[1].touched"
                          >
                          </v-text-field>

                          <input-fecha
                              v-model="solicitud.entidad.fechaInicio"
                              label="Fecha de Inicio de Actividades"
                          >
                          </input-fecha>

                          <v-select
                            :items="select_items.tipoSociedad"
                            v-model="solicitud.entidad.tipoSociedad"
                            label="Tipo de Sociedad" single-line bottom tabindex="5"
                            :rules="validator.empresa.tipoSociedad"
                            :error="!validControl(validator.empresa.tipoSociedad, solicitud.entidad.tipoSociedad) && steps[1].touched"
                          >
                          </v-select>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.@click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 3: DOMICILIOS -->
                <v-stepper-step step="3" edit-icon="check" editable :complete="validStep(3) && step > 3" :rules="[() => step <= 3 || validStep(3)]">
                  Domicilios de la Empresa
                </v-stepper-step>
                <v-stepper-content step="3">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                        <span class="title ml-4">Domicilio Real</span>
                        <v-layout row>
                          <v-flex xs6 class="ma-4">
                            <typeahead
                              option="true"
                              tabindex="15"
                              :items="paises"
                              label="País"
                              @change="changePais('real')"
                              v-model="solicitud.entidad.domicilioReal.pais"
                            >
                            </typeahead>
                            <typeahead
                              option="true"
                              tabindex="17"
                              :items="departamentos.real"
                              label="Departamento"
                              @change="changeDepartamento('real')"
                              v-model="solicitud.entidad.domicilioReal.departamento"
                            >
                            </typeahead>
                            <v-text-field
                              tabindex="19"
                              label="Calle"
                              v-model="solicitud.entidad.domicilioReal.calle"
                              :rules="validator.domicilioReal.calle"
                              :error="!validControl(validator.domicilioReal.calle, solicitud.entidad.domicilioReal.calle)
                                && steps[2].touched"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs6 class="ma-4">
                            <typeahead
                              option="true"
                              tabindex="16"
                              :items="provincias.real"
                              label="Provincia"
                              @change="changeProvincia('real')"
                              v-model="solicitud.entidad.domicilioReal.provincia"
                            >
                            </typeahead>
                            <typeahead
                              option="true"
                              tabindex="18"
                              :items="localidades.real"
                              label="Localidad"
                              v-model="solicitud.entidad.domicilioReal.localidad"
                              :rules="validator.domicilioReal.localidad"
                              :error="!validControl(validator.domicilioReal.localidad, solicitud.entidad.domicilioReal.localidad)
                                && steps[2].touched"
                            >
                            </typeahead>
                            <v-text-field
                              tabindex="20"
                              label="Nro"
                              v-model="solicitud.entidad.domicilioReal.numero"
                              :rules="validator.domicilioReal.numero"
                              :error="!validControl(validator.domicilioReal.numero, solicitud.entidad.domicilioReal.numero)
                                && steps[2].touched"
                            >
                            </v-text-field>
                          </v-flex>
                        </v-layout>

                        <br>

                        <span class="title ml-4">Domicilio Legal</span>
                        <v-layout row>
                          <v-flex xs6 class="ma-4">
                            <typeahead
                              option="true"
                              tabindex="21"
                              :items="paises"
                              label="País"
                              @change="changePais('legal')"
                              v-model="solicitud.entidad.domicilioLegal.pais"
                            >
                            </typeahead>
                            <typeahead
                              option="true"
                              tabindex="23"
                              :items="departamentos.legal"
                              label="Departamento"
                              @change="changeDepartamento('legal')"
                              v-model="solicitud.entidad.domicilioLegal.departamento"
                            >
                            </typeahead>
                            <v-text-field
                              tabindex="25"
                              label="Calle"
                              v-model="solicitud.entidad.domicilioLegal.calle"
                              :rules="validator.domicilioLegal.calle"
                              :error="!validControl(validator.domicilioLegal.calle, solicitud.entidad.domicilioLegal.calle)
                                && steps[2].touched"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs6 class="ma-4">
                            <typeahead
                              option="true"
                              tabindex="22"
                              :items="provincias.legal"
                              label="Provincia"
                              @change="changeProvincia('legal')"
                              v-model="solicitud.entidad.domicilioLegal.provincia"
                            >
                            </typeahead>
                            <typeahead
                              option="true"
                              tabindex="24"
                              :items="localidades.legal"
                              label="Localidad"
                              v-model="solicitud.entidad.domicilioLegal.localidad"
                              :rules="validator.domicilioLegal.localidad"
                              :error="!validControl(validator.domicilioLegal.localidad, solicitud.entidad.domicilioLegal.localidad)
                                && steps[2].touched"
                            >
                            </typeahead>
                            <v-text-field
                              tabindex="26"
                              label="Nro"
                              v-model="solicitud.entidad.domicilioLegal.numero"
                              :rules="validator.domicilioLegal.numero"
                              :error="!validControl(validator.domicilioLegal.numero, solicitud.entidad.domicilioLegal.numero)
                                && steps[2].touched"
                            >
                            </v-text-field>
                          </v-flex>
                        </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="nextStep" class="right" tabindex="27">Continuar</v-btn>
                  <v-btn flat @click.native="step = 2" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 4: CONTACTOS -->
                <v-stepper-step step="4" edit-icon="check" editable :complete="validStep(4) && step > 4" :rules="[() => step <= 4 || validStep(4)]">
                  Datos de Contacto
                </v-stepper-step>
                <v-stepper-content step="4">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-container>
                        <v-layout row>
                          <v-flex xs5 class="ma-4">
                            <v-select
                              :items="select_items.tipoContacto"
                              label="Tipo de Contacto"
                              single-line
                              bottom
                              v-model="nuevo_contacto.tipo"
                              :rules="submitContacto ? validator.contacto.tipo : []"
                              :error="!validControl(validator.contacto.tipo, nuevo_contacto.tipo)
                                && submitContacto"
                            >
                            </v-select>
                          </v-flex>

                          <v-flex xs5 class="ma-4">
                            <v-text-field
                              label="Valor"
                              v-model="nuevo_contacto.valor"
                              :rules="submitContacto ? validator.contacto.valor : []"
                              :error="!validControl(validator.contacto.valor, nuevo_contacto.valor)
                                && submitContacto"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs2 class="ma-4">
                            <v-btn light @click="addContacto">Agregar</v-btn>
                          </v-flex>
                        </v-layout>

                        <v-data-table
                            :headers="headers.contacto"
                            :items="solicitud.entidad.contactos"
                            hide-actions
                            class="elevation-1"
                            no-data-text="No hay contactos">
                          <template slot="headers" scope="props">
                            <th v-for="header of props.headers" style="padding: 20px">
                              {{ header }}
                            </th>
                            <th></th>
                          </template>
                          <template slot="items" scope="props">
                            <td>{{ getTipoContacto(props.item.tipo) }}</td>
                            <td>{{ props.item.valor }}</td>
                            <td style="width:30px">
                              <v-btn icon @click="removeElem('contactos', props.index)">
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </td>
                          </template>
                        </v-data-table>
                      </v-container>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.@click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 5: INCUMBENCIAS -->
                <v-stepper-step step="5" edit-icon="check" editable :complete="validStep(5) && step > 5" :rules="[() => step <= 5 || validStep(5)]">
                  Incumbencias
                </v-stepper-step>
                <v-stepper-content step="5">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-container>
                        <v-layout row>
                          <v-flex xs8 class="ma-4">
                            <v-select
                              :items="select_items.tipoIncumbencia"
                              label="Incumbencias"
                              single-line
                              bottom
                              v-model="nueva_incumbencia"
                              :rules="submitIncumbencia ? validator.incumbencia : []"
                            >
                          </v-select>
                          </v-flex>

                          <v-flex xs4 class="ma-4">
                            <v-btn light @click="addIncumbencia">Agregar</v-btn>
                          </v-flex>
                        </v-layout>


                          <v-data-table
                              :headers="headers.incumbencias"
                              :items="solicitud.entidad.incumbencias"
                              hide-actions
                              class="elevation-1"
                              no-data-text="No hay incumbencias">
                            <template slot="headers" scope="props">
                              <th v-for="header of props.headers" style="padding: 20px">
                                {{ header.text }}
                              </th>
                              <th></th>
                            </template>
                            <template slot="items" scope="props">
                              <td>{{ getTipoIncumbencia(props.item) }}</td>
                              <td style="width:30px">
                                <v-btn icon @click="removeElem('incumbencias', props.index)">
                                  <v-icon>delete</v-icon>
                                </v-btn>
                              </td>
                            </template>
                          </v-data-table>


                      </v-container>
                    </v-card-text>
                  </v-card>
                  <!-- <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn> -->
                  <v-btn class="primary white--text right" @click.native="submit" :disabled="!validForm()">
                    Guardar Solicitud
                    <v-icon dark right>check_circle</v-icon>
                  </v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


              </v-stepper>
          </v-container>

          <v-btn class="red white--text">Cancelar
          <v-icon dark right>block</v-icon>
          </v-btn>

          </form>
        </v-flex>

        <div class="stuck">
          <v-toolbar class="indigo" dark>
            <v-toolbar-title class="white--text">Datos de la Empresa</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-container>
            <v-card>
              <v-card-text id="info-empresa">
                <div><b>Nombre: </b> {{ solicitud.entidad.nombre }} </div>
                <div><b>CUIT: </b> {{ solicitud.entidad.cuit }} </div>
                <div><b>Fecha de Inicio de Actividades: </b> {{ solicitud.entidad.fechaInicio }} </div>
                <div><b>Fecha de Constitución: </b> {{ solicitud.entidad.fechaConstitucion }} </div>
                <div><b>Tipo de Empresa: </b> {{ getTipoEmpresa(solicitud.entidad.tipoEmpresa) }} </div>
                <div><b>Tipo de Sociedad: </b> {{ getTipoSociedad(solicitud.entidad.tipoSociedad) }} </div>
              </v-card-text>
            </v-card>
          </v-container>
        </div>
      </v-layout>
    </v-container>
</template>

<script>
import * as axios from 'axios';
import * as utils from '@/utils';
import rules from '@/rules';
import { Solicitud, Contacto, Empresa } from '@/model';
import InputFecha from '@/components/base/InputFecha';
import Typeahead from '@/components/base/Typeahead';
import ValidatorMixin from '@/components/mixins/ValidatorMixin';
import FiltersMixin from '@/components/mixins/FiltersMixin';

export default {
  name: 'nueva-solicitud-empresa',
  mixins: [ValidatorMixin, FiltersMixin],
  data () {
    return {
      step: 1,

      snackbar: {
        msg: '',
        show: false,
        context: ''
      },

      select_items: {
        delegacion: [
          'Neuquén',
          'Cipo'
        ],

        tipoContacto: [],
        tipoEmpresa: [],
        tipoSociedad: [],
        tipoIncumbencia: [],
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

      solicitud: new Solicitud('empresa'),

      nuevo_contacto: new Contacto(),
      nueva_incumbencia: '',

      headers: {
        contactos: [
          { text: 'Tipo', value: 'tipo' },
          { text: 'Valor', value: 'valor' },
        ],
        incumbencias: [
          { text: 'Nombre', value: 'valor' },
        ]
      },

      validator: {
        solicitud: {
          fecha: [ rules.required, rules.fecha ], delegacion: [ rules.required ]
        },
        empresa: {
          nombre: [ rules.required ], cuit: [ rules.required, rules.number ],
          tipoEmpresa: [ rules.required ], tipoSociedad: [ rules.required ], condafip: [ rules.required ]
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
        incumbencia: [ rules.required ]
      },

      steps: [
        { touched: false },
        { touched: false },
        { touched: false },
        { touched: false },
        { touched: false }
      ],

      submitContacto: false,
      submitIncumbencia: false,
    }
  },

  created: function() {
    Promise.all([
      axios.get('http://localhost:3400/api/paises'),
      axios.get('http://localhost:3400/api/opciones?sort=valor')
    ])
    .then(r => {
      this.select_items.paises = r[0].data;
      this.select_items.tipoContacto = utils.getItemsSelect(r[1].data.contacto, 'valor', 'id');
      this.select_items.tipoEmpresa = utils.getItemsSelect(r[1].data.empresa, 'valor', 'id');
      this.select_items.tipoSociedad = utils.getItemsSelect(r[1].data.sociedad, 'valor', 'id');
      this.select_items.tipoIncumbencia = utils.getItemsSelect(r[1].data.incumbencia, 'valor', 'id');
      this.select_items.condafip = utils.getItemsSelect(r[1].data.condicionafip, 'valor', 'id');
    })
    .catch(e => console.error(e));
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
    }
  },

  methods: {
    getTipoContacto: function(id) {
      return this.select_items.tipoContacto.find(o => o.value == id).text;
    },

    getTipoEmpresa: function(id) {
      let empresa = this.select_items.tipoEmpresa.find(o => o.value == id);
      return empresa ? empresa.text : '';
    },

    getTipoSociedad: function(id) {
      let sociedad = this.select_items.tipoSociedad.find(o => o.value == id);
      return sociedad ? sociedad.text : '';
    },

    getTipoIncumbencia: function(id) {
      let incumbencia = this.select_items.tipoIncumbencia.find(o => o.value == id);
      return incumbencia ? incumbencia.text : '';
    },

    changePais: function(tipoDomicilio) {
      let domicilio = tipoDomicilio == 'real' ? 'domicilioReal' : 'domicilioLegal';
      let pais = this.solicitud.entidad[domicilio].pais;
      if (pais.length) {
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
      if (provincia.length) {
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
      if (departamento.length) {
        let idDepto = this.select_items.departamentos[tipoDomicilio].find(p => p.nombre == departamento).id;
        axios.get(`http://localhost:3400/api/localidades?departamento_id=${idDepto}`)
             .then(r => this.select_items.localidades[tipoDomicilio] = r.data)
             .catch(e => console.error(e));
      }
      else this.select_items.localidades[tipoDomicilio] = [];
    },

    addContacto: function() {
       this.submitContacto = true;
       if ( utils.validObject(this.nuevo_contacto, this.validator.contacto) ) {
         this.solicitud.entidad.contactos.push(this.nuevo_contacto);
         this.nuevo_contacto = new Contacto();
         this.submitContacto = false;
       }
    },

    addIncumbencia: function() {
       this.submitIncumbencia = true;
       if ( this.validator.incumbencia[0](this.nueva_incumbencia) != 'Dato Obligatorio' ) {
         this.solicitud.entidad.incumbencias.push(this.nueva_incumbencia);
         this.nueva_incumbencia = '';
         this.submitIncumbencia = false;
       }
    },

    removeElem: function(tipo, index) {
      this.solicitud.entidad[tipo].splice(index, 1);
    },

    submit: function() {
      console.log(JSON.stringify(this.solicitud));
      axios.post('http://localhost:3400/api/solicitudes', this.solicitud)
           .then(r => {
             if (r.status != 201) {
               this.submitError();
             }
             this.snackbar.msg = 'Nueva solicitud creada exitosamente!';
             this.snackbar.context = 'success';
             this.snackbar.show = true;
             this.solicitud = new Solicitud('empresa');
           })
           .catch(e => this.submitError());
    },

    submitError: function() {
      this.snackbar.msg = 'Ha ocurrido un error en la carga';
      this.snackbar.context = 'error';
      this.snackbar.show = true;
    },

    nextStep: function() {
       this.steps[+this.step - 1].touched = true;
       if (this.validStep(this.step)) this.step = +this.step + 1;
    },

    validStep: function(i) {
      if (i == 1) return utils.validObject(this.solicitud, this.validator.solicitud);
      else if (i == 2) {
        let empresa = this.solicitud.entidad;
        return utils.validObject(empresa, this.validator.empresa);
      }
      else if (i == 3) {
        let domicilioR = this.solicitud.entidad.domicilioReal;
        let domicilioL = this.solicitud.entidad.domicilioReal;
        return utils.validObject(domicilioR, this.validator.domicilioReal)
          && utils.validObject(domicilioL, this.validator.domicilioLegal);
      }
      else return true;
    },

    validForm: function() {
      for (let i = 1; i < 6; i++) {
        if (!this.validStep(i)) return false;
      }
      return true;
    },

    prevStep: function() {
      this.step = this.step - 1;
    }
  },

  components: {
    InputFecha,
    Typeahead
  }
}
</script>

<style scoped>
#info-empresa div {
  margin-bottom: 10px;
}

h6 {
  padding-top: 10px;
}

.stuck {
    position: fixed;
    right: 10px;
    width: 30%;
    word-wrap: break-word;
}
</style>
