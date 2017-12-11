<template>
  <v-container>
      <v-layout row wrap>
        <v-flex xs8>
          <form v-on:submit.prevent="submit">
          <v-toolbar class="blue darken-3">
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
                              tabindex="1"
                              v-model="solicitud.fecha"
                              label="Fecha de Solicitud"
                              :rules="validator.solicitud.fecha"
                              :error="!validControl(validator.solicitud.fecha, solicitud.fecha) && steps[0].touched"
                            >
                            </input-fecha>
                          </v-flex>

                          <v-flex xs6 class="ma-4">
                            <v-select
                              tabindex="2"
                              label="Delegación"
                              :items="delegaciones"
                              v-model="solicitud.delegacion"
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              :error="!validControl(validator.solicitud.delegacion, solicitud.delegacion) && steps[0].touched"
                              :rules="validator.solicitud.delegacion"
                            >
                            </v-select>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                    <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="3">Continuar</v-btn>
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
                            tabindex="4"
                            label="Nombre"
                            v-model="solicitud.entidad.nombre"
                            :rules="validator.empresa.nombre"
                            :error="!validControl(validator.empresa.nombre, solicitud.entidad.nombre) && steps[1].touched"
                          >
                          </v-text-field>

                          <v-select
                            tabindex="5"
                            item-text="valor"
                            item-value="id"
                            :items="opciones.empresa"
                            v-model="solicitud.entidad.tipoEmpresa"
                            label="Tipo de Empresa" single-line bottom
                            :rules="validator.empresa.tipoEmpresa"
                            :error="!validControl(validator.empresa.tipoEmpresa, solicitud.entidad.tipoEmpresa) && steps[1].touched"
                          >
                          </v-select>

                          <input-fecha
                              tabindex="6"
                              v-model="solicitud.entidad.fechaConstitucion"
                              label="Fecha de Constitución"
                          >
                          </input-fecha>

                          <v-select
                            tabindex="7"
                            item-text="valor"
                            item-value="id"
                            :items="opciones.condicionafip"
                            v-model="solicitud.entidad.condafip"
                            label="Condición AFIP" single-line bottom
                            :rules="validator.empresa.condafip"
                            :error="!validControl(validator.empresa.condafip, solicitud.entidad.confafip) && steps[1].touched"
                          >
                          </v-select>
                        </v-flex>

                        <v-flex xs6 class="ma-4">
                          <v-text-field
                            tabindex="8"
                            label="CUIT"
                            v-model="solicitud.entidad.cuit"
                            :rules="validator.empresa.cuit"
                            :error="!validControl(validator.empresa.cuit, solicitud.entidad.cuit) && steps[1].touched"
                          >
                          </v-text-field>

                          <input-fecha
                              tabindex="9"
                              v-model="solicitud.entidad.fechaInicio"
                              label="Fecha de Inicio de Actividades"
                          >
                          </input-fecha>

                          <v-select
                            tabindex="10"
                            item-text="valor"
                            item-value="id"
                            :items="opciones.sociedad"
                            v-model="solicitud.entidad.tipoSociedad"
                            label="Tipo de Sociedad" single-line bottom
                            :rules="validator.empresa.tipoSociedad"
                            :error="!validControl(validator.empresa.tipoSociedad, solicitud.entidad.tipoSociedad) && steps[1].touched"
                          >
                          </v-select>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="11">Continuar</v-btn>
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
                            <v-select
                              tabindex="12"
                              :items="paises"
                              label="País"
                              v-model="solicitud.entidad.domicilioReal.pais"
                              autocomplete
                              item-text="nombre"
                              item-value="id"
                              @input="changePais('real')"
                            >
                            </v-select>

                            <v-select
                              tabindex="14"
                              :items="departamentos.real"
                              label="Departamento"
                              @input="changeDepartamento('real')"
                              v-model="solicitud.entidad.domicilioReal.departamento"
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                            >
                            </v-select>

                            <v-text-field
                              tabindex="16"
                              label="Calle"
                              v-model="solicitud.entidad.domicilioReal.calle"
                              :rules="validator.domicilioReal.calle"
                              :error="!validControl(validator.domicilioReal.calle, solicitud.entidad.domicilioReal.calle)
                                && steps[2].touched"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs6 class="ma-4">
                            <v-select
                              tabindex="13"
                              :items="provincias.real"
                              label="Provincia"
                              @input="changeProvincia('real')"
                              v-model="solicitud.entidad.domicilioReal.provincia"
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                            >
                            </v-select>

                            <v-select
                              tabindex="15"
                              :items="localidades.real"
                              label="Localidad"
                              v-model="solicitud.entidad.domicilioReal.localidad"
                              :rules="validator.domicilioReal.localidad"
                              :error="!validControl(validator.domicilioReal.localidad, solicitud.entidad.domicilioReal.localidad)
                                && steps[2].touched"
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                            >
                            </v-select>

                            <v-text-field
                              tabindex="17"
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

                        <span class="title ml-4">Domicilio Profesional</span>
                        <v-layout row>
                          <v-flex xs6 class="ma-4">
                            <v-select
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              tabindex="18"
                              :items="paises"
                              label="País"
                              @input="changePais('profesional')"
                              v-model="solicitud.entidad.domicilioProfesional.pais"
                            >
                            </v-select>

                            <v-select
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              tabindex="20"
                              :items="departamentos.profesional"
                              label="Departamento"
                              @input="changeDepartamento('profesional')"
                              v-model="solicitud.entidad.domicilioProfesional.departamento"
                            >
                            </v-select>
                            <v-text-field
                              tabindex="22"
                              label="Calle"
                              v-model="solicitud.entidad.domicilioProfesional.calle"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs6 class="ma-4">
                            <v-select
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              tabindex="19"
                              :items="provincias.profesional"
                              label="Provincia"
                              @input="changeProvincia('profesional')"
                              v-model="solicitud.entidad.domicilioProfesional.provincia"
                            >
                            </v-select>

                            <v-select
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              tabindex="21"
                              :items="localidades.profesional"
                              label="Localidad"
                              v-model="solicitud.entidad.domicilioProfesional.localidad"
                            >
                            </v-select>
                            <v-text-field
                              tabindex="23"
                              label="Nro"
                              v-model="solicitud.entidad.domicilioProfesional.numero"
                            >
                            </v-text-field>
                          </v-flex>
                        </v-layout>
                        <br>

                        <span class="title ml-4">Domicilio Constituido</span>
                        <v-layout row>
                          <v-flex xs6 class="ma-4">
                            <v-select
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              tabindex="24"
                              :items="paises"
                              label="País"
                              @input="changePais('constituido')"
                              v-model="solicitud.entidad.domicilioConstituido.pais"
                            >
                            </v-select>

                            <v-select
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              tabindex="26"
                              :items="departamentos.constituido"
                              label="Departamento"
                              @input="changeDepartamento('constituido')"
                              v-model="solicitud.entidad.domicilioConstituido.departamento"
                            >
                            </v-select>
                            <v-text-field
                              tabindex="28"
                              label="Calle"
                              v-model="solicitud.entidad.domicilioConstituido.calle"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs6 class="ma-4">
                            <v-select
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              tabindex="25"
                              :items="provincias.constituido"
                              label="Provincia"
                              @input="changeProvincia('constituido')"
                              v-model="solicitud.entidad.domicilioConstituido.provincia"
                            >
                            </v-select>

                            <v-select
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              tabindex="27"
                              :items="localidades.constituido"
                              label="Localidad"
                              v-model="solicitud.entidad.domicilioConstituido.localidad"
                            >
                            </v-select>
                            <v-text-field
                              tabindex="29"
                              label="Nro"
                              v-model="solicitud.entidad.domicilioConstituido.numero"
                            >
                            </v-text-field>
                          </v-flex>
                        </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="30">Continuar</v-btn>
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
                              item-text="valor"
                              item-value="id"
                              :items="opciones.contacto"
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
                            :headers="headers.contactos"
                            :items="solicitud.entidad.contactos"
                            hide-actions
                            class="elevation-1"
                            no-data-text="No hay contactos">
                          <template slot="headers" scope="props">
                            <th v-for="header of props.headers" class="pa-3">
                              <b>{{ header.text }}</b>
                            </th>
                            <th></th>
                          </template>
                          <template slot="items" scope="props">
                            <td>{{ getTipoContacto(props.item.tipo) }}</td>
                            <td>{{ props.item.valor }}</td>
                            <td style="width:30px">
                              <v-btn fab dark small color="blue" @click="removeElem('contactos', props.index)">
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </td>
                          </template>
                        </v-data-table>
                      </v-container>
                    </v-card-text>
                  </v-card>
                  <v-btn blue darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
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
                              autocomplete single-line bottom
                              item-text="valor"
                              item-value="id"
                              :items="opciones.incumbencia"
                              v-model="nueva_incumbencia"
                              label="Incumbencias"
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
                              <th v-for="header of props.headers" class="pa-3 text-xs-left">
                                <b>{{ header.text }}</b>
                              </th>
                              <th></th>
                            </template>
                            <template slot="items" scope="props">
                              <td>{{ getTipoIncumbencia(props.item) }}</td>
                              <td style="width:30px">
                                <v-btn fab dark small color="blue" @click="removeElem('incumbencias', props.index)">
                                  <v-icon>delete</v-icon>
                                </v-btn>
                              </td>
                            </template>
                          </v-data-table>


                      </v-container>
                    </v-card-text>
                  </v-card>
                  <v-btn blue darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 6: REPRESENTANTE -->
                <v-stepper-step step="6" edit-icon="check" editable :complete="validStep(6) && step > 6" :rules="[() => step <= 6 || validStep(6)]">
                  Representante Técnico
                </v-stepper-step>
                <v-stepper-content step="6">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                        <span class="ml-3"><b>Buscar:</b></span>
                        <v-layout row wrap>
                          <v-flex xs3  class="mx-3">
                            <v-text-field
                              label="N°"
                              @input="updateList"
                              v-model="filtros.numero"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs3>
                            <v-text-field
                              label="Apellido"
                              @input="updateList"
                              v-model="filtros.apellido"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs3  class="mx-3">
                            <v-text-field
                              label="DNI"
                              @input="updateList"
                              v-model="filtros.dni"
                            >
                            </v-text-field>
                          </v-flex>
                        </v-layout>

                        <v-layout row>
                          <v-flex xs12 class="ma-3">
                            <v-data-table
                                :rows-per-page-items="[5, 10, 25]"
                                :headers="headers.matriculados"
                                :items="matriculados"
                                class="elevation-1"
                                no-data-text="No se encontraron matriculados"
                                no-results-text="No se encontraron matriculados"
                                v-bind:pagination.sync="pagination"
                                :total-items="totalItems"
                                :loading="loading"
                                >
                              <template slot="headers" scope="props">
                                <th v-for="header of props.headers" class="pa-3 text-xs-left">
                                  <b>{{ header.text }}</b>
                                </th>
                                <th></th>
                              </template>
                              <template slot="items" scope="props">
                                <tr>
                                  <td>{{ props.item.numeroMatricula }}</td>
                                  <td>{{ props.item.entidad.nombre }}</td>
                                  <td>{{ props.item.entidad.apellido }}</td>
                                  <td>{{ props.item.entidad.dni }}</td>
                                  <td>
                                    <v-btn fab dark small color="blue" @click="addRepresentante(props.item)">
                                      <v-icon>note_add</v-icon>
                                    </v-btn>
                                  </td>
                                </tr>
                              </template>
                            </v-data-table>
                          </v-flex>
                        </v-layout>

                        <br>
                        <span class="ml-3"><b>Representantes:</b></span>

                        <v-layout row wrap>
                          <v-flex xs12 class="mx-3">
                            <v-data-table
                                :rows-per-page-items="[5, 10, 25]"
                                :headers="headers.matriculados"
                                :items="solicitud.entidad.representantes"
                                class="elevation-1"
                                v-bind:pagination.sync="pagination"
                                :total-items="totalItems"
                                :loading="loading"
                                no-data-text="No se agregaron representates"
                                no-results-text="No se agregaron representates"
                                >
                              <template slot="headers" scope="props">
                                <th v-for="header of props.headers" class="pa-3 text-xs-left">
                                  <b>{{ header.text }}</b>
                                </th>
                                <th></th>
                              </template>
                              <template slot="items" scope="props">
                                <tr>
                                  <td>{{ props.item.numeroMatricula }}</td>
                                  <td>{{ props.item.entidad.nombre }}</td>
                                  <td>{{ props.item.entidad.apellido }}</td>
                                  <td>{{ props.item.entidad.dni }}</td>
                                  <td>
                                    <v-btn fab dark small color="blue" @click="borrarRepresentante(props.item.id)">
                                      <v-icon>delete</v-icon>
                                    </v-btn>
                                  </td>
                                </tr>
                              </template>
                            </v-data-table>
                          </v-flex>
                        </v-layout>


                    </v-card-text>
                  </v-card>
                  <v-btn class="blue darken-1 white--text right" @click.native="submit" :disabled="!validForm()">
                    Guardar Solicitud
                    <v-icon dark right>check_circle</v-icon>
                  </v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


              </v-stepper>
          </v-container>

          </form>
        </v-flex>

        <div class="stuck">
          <v-toolbar class="blue darken-3">
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
                <div><b>Tipo de Empresa: </b> {{ solicitud.entidad.tipoEmpresa ? getTipoEmpresa(solicitud.entidad.tipoEmpresa) : '' }} </div>
                <div><b>Tipo de Sociedad: </b> {{ solicitud.entidad.tipoSociedad ? getTipoSociedad(solicitud.entidad.tipoSociedad) : '' }} </div>
              </v-card-text>
            </v-card>
          </v-container>
        </div>
      </v-layout>
    </v-container>
</template>

<script>
import axios from '@/axios'
import * as utils from '@/utils'
import rules from '@/rules'
import Store from '@/Store'
import * as Model from '@/model'
import InputFecha from '@/components/base/InputFecha'
import ValidatorMixin from '@/components/mixins/ValidatorMixin'
import NuevaSolicitud from '@/components/solicitudes/nueva/NuevaSolicitud'

const headers = {
  contactos: [
    Model.Header('Tipo', 'tipo'),
    Model.Header('Valor', 'valor'),
  ],
  incumbencias: [
    Model.Header('Nombre', 'nombre'),
  ],
  matriculados: [
    Model.Header('N°', 'numero'),
    Model.Header('Nombre', 'nombre'),
    Model.Header('Apellido', 'nombre'),
    Model.Header('DNI', 'dni')
  ]
}

export default {
  name: 'nueva-solicitud-empresa',
  mixins: [ValidatorMixin, NuevaSolicitud],
  data () {
    return {
      global_state: Store.state,
      solicitud: new Model.Solicitud('empresa'),
      nuevo_contacto: new Model.Solicitud(),
      nueva_incumbencia: '',

      validator: {
        empresa: {
          nombre: [ rules.required ], cuit: [ rules.required, rules.number ],
          tipoEmpresa: [ rules.required ], tipoSociedad: [ rules.required ], condafip: [ rules.required ]
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

      matriculados: [],
      debouncedUpdate: null,
      totalItems: 0,
      loading: false,
      pagination: {
         rowsPerPage: 5,
      },
      filtros: {
        numero: '',
        dni: '',
        apellido: ''
      },
      matricula_selected: {}
    }
  },

  watch: {
    filtros: {
      handler () {
        this.updateMatriculas();
      },
      deep: true
    },

    pagination: {
      handler () {
        this.updateMatriculas();
      },
      deep: true
    }
  },

  computed: {
    headers: function() {
      return headers;
    }

  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.updateMatriculas, 600, { 'maxWait': 1000 });
    Promise.all([
      axios.get('/paises'),
      axios.get('/opciones?sort=valor'),
      axios.get('/delegaciones')
    ])
    .then(r => {
      this.paises = r[0].data;
      this.opciones = r[1].data;
      this.delegaciones = r[2].data;
    })
    .catch(e => console.error(e));
  },

  methods: {
    getTipoContacto: function(id) {
      return this.opciones.contacto.find(o => o.id == id).valor;
    },

    getTipoEmpresa: function(id) {
      return this.opciones.empresa.find(e => e.id == id).valor;
    },

    getTipoSociedad: function(id) {
      return this.opciones.sociedad.find(s => s.id == id).valor;
    },

    getTipoIncumbencia: function(id) {
      return this.opciones.incumbencia.find(o => o.id == id).valor;
    },

    addContacto: function() {
      this.submitContacto = true;
       if ( utils.validObject(this.nuevo_contacto, this.validator.contacto) ) {
         this.solicitud.entidad.contactos.push(this.nuevo_contacto);
         this.nuevo_contacto = new Model.Solicitud();
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

    prepareSubmit: function() {
      let solicitud = utils.clone(this.solicitud);
      solicitud.entidad.representantes = solicitud.entidad.representantes.map(r => r.id);
      return solicitud;
    },

    submit: function() {
      axios.post('/solicitudes', this.prepareSubmit())
           .then(r => {
             if (r.status != 201) {
               this.submitError();
             }
             this.global_state.snackbar.msg = 'Nueva solicitud creada exitosamente!';
             this.global_state.snackbar.color = 'success';
             this.global_state.snackbar.show = true;
             this.$router.push('/solicitudes/lista')

           })
           .catch(e => this.submitError());
    },

    validStep: function(i) {
      if (i == 1) return utils.validObject(this.solicitud, this.validator.solicitud);
      else if (i == 2) {
        let empresa = this.solicitud.entidad;
        return utils.validObject(empresa, this.validator.empresa);
      }
      else if (i == 3) {
        return utils.validObject(this.solicitud.entidad.domicilioReal, this.validator.domicilioReal)
      }
      else return true;
    },

    updateMatriculas: function() {
      this.loading = true;
      this.matriculas = [];
      let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
      let limit = this.pagination.rowsPerPage;

      // El estado '13' es 'Habilitado'
      let url = `/matriculas?tipoEntidad=profesional&estado=13&limit=${limit}&offset=${offset}`;

      if (this.filtros.numero) url += `&numeroMatricula=${this.filtros.numero}`;
      if (this.filtros.dni) url+=`&dni=${this.filtros.dni}`;
      if (this.filtros.apellido) url+=`&apellido=${this.filtros.apellido}`;

      axios.get(url)
           .then(r => {
             this.matriculados = r.data.resultados;
             this.totalItems = r.data.totalQuery;
             this.loading = false;
           })
           .catch(e => console.error(e));
    },

    updateList: function() {
      this.debouncedUpdate();
    },

    addRepresentante: function(matricula) {
      this.solicitud.entidad.representantes.push(matricula);
    },

    borrarRepresentante: function(id) {
      this.solicitud.entidad.representantes = this.solicitud.entidad.representantes
                                                  .filter(r => r.id != id);
    }
  },

  components: {
    InputFecha
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
