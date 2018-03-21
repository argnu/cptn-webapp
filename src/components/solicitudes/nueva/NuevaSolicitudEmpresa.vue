<template>
  <v-container fluid>
      <v-layout row wrap>
        <v-flex xs10>
          <form v-on:submit.prevent="submit">
          <v-toolbar class="darken-3" color="primary">
            <v-toolbar-title class="white--text">Solicitud de Matriculación de Empresas</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-container>
            <v-progress-linear indeterminate v-show="show_cargando"></v-progress-linear>

             <v-stepper v-model="step" vertical>

               <!-- PASO 1: DATOS DE SOLICITUD -->
                <v-stepper-step step="1" edit-icon="check" editable 
                  :complete="valid.form_solicitud && step > 1" 
                  :rules="[() => step <= 1 || valid.form_solicitud]"
                >
                 Datos de la Solicitud
                </v-stepper-step>
                <v-stepper-content step="1">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                      <v-card-text>
                        <v-form ref="form_solicitud" lazy-validation v-model="valid.form_solicitud">

                        <v-layout row>
                          <v-flex xs6 class="ma-4">
                            <input-fecha
                              tabindex="1"
                              v-model="solicitud.fecha"
                              label="Fecha de Solicitud"
                              :rules="[rules.required, rules.fecha]"
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
                              :rules="[rules.required]"
                            >
                            </v-select>
                          </v-flex>
                        </v-layout>

                        </v-form>
                      </v-card-text>
                    </v-card>
                    <v-btn color="primary" darken-1 @click.native="nextStep" class="right" tabindex="3">Continuar</v-btn>
                </v-stepper-content>


                <!-- PASO 2: DATOS DE EMPRESA -->
                <v-stepper-step step="2" edit-icon="check" editable 
                  :complete="valid.form_empresa && step > 2" 
                  :rules="[() => step <= 2 || valid.form_empresa]"
                >
                  Datos de la Empresa
                </v-stepper-step>
                <v-stepper-content step="2">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-form ref="form_empresa" lazy-validation v-model="valid.form_empresa">

                      <v-layout row>
                        <v-flex xs6 class="ma-4">
                          <v-text-field
                            tabindex="4"
                            label="Nombre"
                            v-model="solicitud.entidad.nombre"
                            :rules="[rules.required]"
                          >
                          </v-text-field>

                          <v-select
                            autocomplete
                            tabindex="5"
                            item-text="valor"
                            item-value="id"
                            :items="opciones.empresa"
                            v-model="solicitud.entidad.tipoEmpresa"
                            label="Tipo de Empresa" single-line bottom
                            :rules="[rules.required]"
                          >
                          </v-select>

                          <input-fecha
                              tabindex="6"
                              v-model="solicitud.entidad.fechaConstitucion"
                              label="Fecha de Constitución"
                          >
                          </input-fecha>
                        </v-flex>

                        <v-flex xs6 class="ma-4">
                          <v-text-field
                            tabindex="8"
                            label="CUIT"
                            v-model="solicitud.entidad.cuit"
                            :rules="[rules.required, rules.integer]"
                          >
                          </v-text-field>

                          <input-fecha
                              tabindex="9"
                              v-model="solicitud.entidad.fechaInicio"
                              label="Fecha de Inicio de Actividades"
                          >
                          </input-fecha>

                          <v-select
                            autocomplete
                            tabindex="10"
                            item-text="valor"
                            item-value="id"
                            :items="opciones.sociedad"
                            v-model="solicitud.entidad.tipoSociedad"
                            label="Tipo de Sociedad" single-line bottom
                            :rules="[rules.required]"
                          >
                          </v-select>
                        </v-flex>
                      </v-layout>

                      </v-form>
                    </v-card-text>
                  </v-card>
                  <v-btn color="primary" darken-1 @click.native="nextStep" class="right" tabindex="11">Continuar</v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 3: DOMICILIOS -->
                <v-stepper-step step="3" edit-icon="check" editable 
                  :complete="valid_domicilios && step > 3" 
                  :rules="[() => step <= 3 || valid_domicilios]"
                >
                  Domicilios de la Empresa
                </v-stepper-step>
                <v-stepper-content step="3">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-form lazy-validation ref="form_domicilio">
                        <v-layout row class="mx-4">
                          <v-flex xs8>
                            <v-select
                              :items="tipos_domicilio"
                              label="Tipo"
                              v-model="nuevo_domicilio.tipo"
                              autocomplete
                              :rules="domicilio_edit != null ? [] : [rules.required]"
                            >
                            </v-select>                          
                          </v-flex>

                          <v-flex xs3 class="mt-2 ml-4">
                            <v-menu offset-y>
                              <v-btn slot="activator">Copiar de...</v-btn>
                              <v-list>
                                <v-list-tile 
                                  v-for="tipo of tipos_domicilio_cargados" 
                                  :key="tipo.value" @click="copiarDomicilio(tipo.value)"
                                >
                                  <v-list-tile-title>{{ tipo.text }}</v-list-tile-title>
                                </v-list-tile>
                              </v-list>
                            </v-menu>
                          </v-flex>
                        </v-layout>

                        <v-layout row>
                          <v-flex xs6 class="ma-4">
                            <v-select
                              tabindex="12"
                              :items="paises"
                              label="País"
                              v-model="nuevo_domicilio.domicilio.pais"
                              autocomplete
                              item-text="nombre"
                              item-value="id"
                              @input="changePais"
                              :rules="[rules.required]"
                            >
                            </v-select>

                            <v-select
                              tabindex="14"
                              :items="departamentos"
                              label="Departamento"
                              @input="changeDepartamento"
                              v-model="nuevo_domicilio.domicilio.departamento"
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              :rules="[rules.required]"
                            >
                            </v-select>

                            <v-text-field
                              tabindex="16"
                              label="Dirección"
                              v-model="nuevo_domicilio.domicilio.direccion"
                              :rules="[rules.required]"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs6 class="ma-4">
                            <v-select
                              tabindex="13"
                              :items="provincias"
                              label="Provincia"
                              @input="changeProvincia"
                              v-model="nuevo_domicilio.domicilio.provincia"
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              :rules="[rules.required]"
                            >
                            </v-select>

                            <v-select
                              tabindex="15"
                              :items="localidades"
                              label="Localidad"
                              v-model="nuevo_domicilio.domicilio.localidad"
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              :rules="[rules.required]"
                            >
                            </v-select>
                          </v-flex>
                        </v-layout>

                        <v-layout class="mb-4">
                          <v-flex xs12>
                            <v-btn 
                              class="right" 
                              light 
                              @click="addDomicilio"
                            >
                              {{ domicilio_edit != null ? 'Guardar' : 'Agregar' }}
                            </v-btn>

                            <v-btn class="right" light v-show="domicilio_edit != null" @click="cancelarEditDomicilio">
                              Cancelar
                            </v-btn>                             
                          </v-flex>                     
                        </v-layout>

                        <v-data-table
                            :headers="headers.domicilios"
                            :items="solicitud.entidad.domicilios"
                            hide-actions
                            class="elevation-1"
                            no-data-text="No hay domicilios">
                          <template slot="headers" slot-scope="props">
                            <th v-for="(header, i) of props.headers" :key="i" class="pa-3">
                              <b>{{ header.text }}</b>
                            </th>
                          </template>
                          <template slot="items" slot-scope="props">
                            <tr :active="props.index == domicilio_edit">
                              <td>
                                <v-btn fab small @click="editDomicilio(props.index)">
                                  <v-icon>mode_edit</v-icon>
                                </v-btn>
                                <v-btn fab small @click="removeElem('domicilios', props.index)">
                                    <v-icon>delete</v-icon>
                                  </v-btn>                                
                              </td>                              
                              <td>{{ props.item.tipo | upperFirst }}</td>

                              <template v-if="!props.item.id">
                                <td>{{ props.item.pais_nombre }}</td>
                                <td>{{ props.item.provincia_nombre }}</td>
                                <td>{{ props.item.departamento_nombre }}</td>
                                <td>{{ props.item.localidad_nombre }}</td>                             
                              </template>
                              <template v-else>
                                <td>{{ props.item.domicilio.pais }}</td>
                                <td>{{ props.item.domicilio.provincia }}</td>
                                <td>{{ props.item.domicilio.departamento }}</td>
                                <td>{{ props.item.domicilio.localidad }}</td>                             
                              </template>

                              <td>{{ props.item.domicilio.direccion }}</td>
                            </tr>                              
                          </template>
                        </v-data-table>

                      <v-alert class="mt-4" color="error" icon="priority_high" :value="!valid_domicilios">
                        Debe ingresar al menos un domicilio
                      </v-alert>                             

                      </v-form>
                    </v-card-text>
                  </v-card>
                  <v-btn color="primary" darken-1 @click.native="nextStep" class="right" tabindex="30">Continuar</v-btn>
                  <v-btn flat @click.native="step = 2" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 4: CONTACTOS -->
                <v-stepper-step step="4" edit-icon="check" editable :complete="step > 4">
                  Datos de Contacto
                </v-stepper-step>
                <v-stepper-content step="4">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-form lazy-validation ref="form_contacto">

                      <v-container>
                          <v-layout row>
                            <v-flex xs3 class="mx-2">
                              <v-select
                                single-line bottom
                                :items="opciones.contacto"
                                item-text="valor"
                                item-value="id"
                                label="Tipo"
                                v-model="nuevo_contacto.tipo"
                                :rules="[rules.required]"
                                @change="chgTipoContacto"
                              >
                              </v-select>
                            </v-flex>

                            <v-flex xs8 class="mx-2" v-if="nuevo_contacto.tipo > 0 && nuevo_contacto.tipo < 3">
                              <input-telefono
                                :type="(nuevo_contacto.tipo === 2) ? 'celular' : 'fijo'"
                                v-model="nuevo_telefono"
                              ></input-telefono>

                              <v-checkbox
                                v-show="nuevo_contacto.tipo === 2"
                                label="Whatsapp"
                                v-model="nuevo_contacto.whatsapp"
                                light
                              ></v-checkbox>
                            </v-flex>

                            <v-flex xs8 class="mx-2" v-else>
                              <v-text-field
                                v-model="nuevo_contacto.valor"
                                :rules="rules_contacto"
                                :placeholder="placeholder_contacto"
                              >
                              </v-text-field>
                            </v-flex>
                          </v-layout>

                          <v-layout row wrap>
                            <v-flex xs12>
                              <v-btn class="right" light @click="addContacto">
                                {{ contacto_edit != null ? 'Guardar' : 'Agregar' }}
                              </v-btn>
                              <v-btn class="right" light v-show="contacto_edit != null" @click="cancelarEditContacto">
                                Cancelar
                              </v-btn>
                            </v-flex>
                          </v-layout>

                        <v-data-table
                            :headers="headers.contactos"
                            :items="solicitud.entidad.contactos"
                            hide-actions
                            class="elevation-1 mt-4"
                            no-data-text="No hay contactos">
                          <template slot="headers" slot-scope="props">
                            <th></th>
                            <th v-for="(header, i) of props.headers" :key="i" class="pa-3">
                              <b>{{ header.text }}</b>
                            </th>
                            <th></th>
                          </template>
                          <template slot="items" slot-scope="props">
                            <td>
                              <v-btn fab small @click="editContacto(props.index)">
                                <v-icon>mode_edit</v-icon>
                              </v-btn>                              
                              <v-btn fab small @click="removeElem('contactos', props.index)">
                                <v-icon>delete</v-icon>
                              </v-btn>                              
                            </td>
                            <td>{{ getTipoContacto(props.item.tipo) }}</td>
                            <td>{{ props.item.valor }}</td>
                            <td>
                              <span v-if="props.item.tipo == 2">
                                Whatsapp: {{ props.item.whatsapp | boolean }}
                              </span>
                            </td>
                          </template>
                        </v-data-table>
                      </v-container>
                      </v-form>
                    </v-card-text>
                  </v-card>
                  <v-btn color="primary" darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 5: REPRESENTANTE -->
                <v-stepper-step step="5" edit-icon="check" editable 
                  :complete="valid_representante && step > 5" 
                  :rules="[() => step <= 5 || valid_representante]"
                >
                  Representante Técnico
                </v-stepper-step>
                <v-stepper-content step="5">
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
                                :rows-per-page-items="[10, 15, 20]"
                                :headers="headers.matriculados"
                                :items="matriculados"
                                class="elevation-1"
                                no-data-text="No se encontraron matriculados"
                                no-results-text="No se encontraron matriculados"
                                :pagination.sync="pagination"
                                :total-items="totalItems"
                                :loading="loading"
                                >
                              <template slot="headers" slot-scope="props">
                                <th v-for="(header, i) of props.headers" :key="i" class="pa-3 text-xs-left">
                                  <b>{{ header.text }}</b>
                                </th>
                                <th></th>
                              </template>
                              <template slot="items" slot-scope="props">
                                <tr>
                                  <td>{{ props.item.numeroMatricula }}</td>
                                  <td>{{ props.item.entidad.nombre }}</td>
                                  <td>{{ props.item.entidad.apellido }}</td>
                                  <td>{{ props.item.entidad.dni }}</td>
                                  <td>
                                    <v-btn fab dark small color="primary" @click="selectRepresentantePrimario(props.item)">
                                      <v-icon>check</v-icon>
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
                                hide-actions
                                :headers="headers.matriculados"
                                :items="solicitud.entidad.representantes"
                                class="elevation-1"                                
                                no-data-text="No se agregaron representates"
                                no-results-text="No se agregaron representates"
                                >
                              <template slot="headers" slot-scope="props">
                                <th v-for="(header, i) of props.headers" :key="i" class="pa-3 text-xs-left">
                                  <b>{{ header.text }}</b>
                                </th>
                                <!-- <th></th> -->
                              </template>
                              <template slot="items" slot-scope="props">
                                <tr>
                                  <td>{{ props.item.numeroMatricula }}</td>
                                  <td>{{ props.item.nombre }}</td>
                                  <td>{{ props.item.apellido }}</td>
                                  <td>{{ props.item.dni }}</td>
                                  <!-- <td>
                                    <v-btn icon small @click="borrarRepresentante(props.item.numeroMatricula)">
                                      <v-icon>delete</v-icon>
                                    </v-btn>
                                  </td> -->
                                </tr>
                              </template>
                            </v-data-table>
                          </v-flex>
                        </v-layout>

                      <v-alert class="mt-4" color="error" icon="priority_high" :value="!valid_representante">
                        Debe seleccionar un representante
                      </v-alert>                             
                    </v-card-text>
                  </v-card>

                  <br><br>

                  <v-checkbox class="ma-0 pa-0" label="Recibir Actualizaciones" v-model="solicitud.entidad.recibirActualizaciones">
                  </v-checkbox>                  

                  <v-btn color="primary" class="darken-1 white--text right" @click.native="imprimir" v-if="this.id">
                    Imprimir
                    <v-icon dark right>check_circle</v-icon>
                  </v-btn>

                  <v-btn 
                    color="primary" 
                    class="darken-1 white--text right" 
                    @click.native="submit" 
                    :disabled="!valid_form || guardando"
                    :loading="guardando"
                  >
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
          <v-toolbar class="darken-3" color="primary">
            <v-toolbar-title class="white--text">Empresa</v-toolbar-title>
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
import * as moment from 'moment'
import * as utils from '@/utils'
import { Solicitud } from '@/model'
import InputFecha from '@/components/base/InputFecha'
import InputTelefono from '@/components/base/InputTelefono'
import MixinValidator from '@/components/mixins/MixinValidator'
import NuevaSolicitud from '@/components/solicitudes/nueva/NuevaSolicitud'
import { impresionSolicitud } from '@/utils/PDFUtils'


export default {
  name: 'nueva-solicitud-empresa',
  mixins: [MixinValidator, NuevaSolicitud],
  props: ['id'],

  data () {
    return {
      solicitud: new Solicitud('empresa'),
      nuevo_contacto: new Solicitud(),

      valid: {
        form_solicitud: false,
        form_empresa: false
      },      

      matriculados: [],
      debouncedUpdate: null,
      totalItems: 0,
      loading: false,
      pagination: {
        page: 1,
        rowsPerPage: 10,
      },
      filtros: {
        numero: '',
        dni: '',
        apellido: ''
      },
      matricula_selected: {},
      guardando: false
    }
  },

  watch: {
    filtros: {
      handler () {
        this.pagination.page = 1;
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
    valid_representante: function() {
      return this.solicitud.entidad.representantes.length > 0;
    },

    valid_form: function() {
      return this.valid.form_solicitud && this.valid.form_empresa 
        && this.valid_domicilios
        && this.valid_representante;
    }
  },

  watch: {
    '$route' (to, from) {
      if (this.datos_cargados) this.initForm();
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
      this.datos_cargados = true;
      this.nuevo_domicilio.domicilio.departamento = this.global_state.delegacion.domicilio.departamento.id;
      this.nuevo_domicilio.domicilio.localidad = this.global_state.delegacion.domicilio.localidad.id;
      this.initForm();   
    })
    .catch(e => console.error(e));
  },

  methods: {
    init: function(reset) {
      this.changePais()
      .then(() => this.changeProvincia())
      .then(() => this.changeDepartamento())
      .then(() => {
        this.show_cargando = false;
        if (reset) this.$refs.form_empresa.reset();
      });
    },

    initForm: function() {
      this.step = 1;
      this.updateMatriculas();
      if (this.id) { 
        this.show_cargando = true;
        axios.get(`/solicitudes/${this.id}`)
        .then(r => {          
              this.solicitud = new Solicitud('empresa');
              this.solicitud.fecha = utils.getFecha(r.data.fecha);
              this.solicitud.delegacion = this.delegaciones.find(d => d.nombre == r.data.delegacion).id;
              
              this.solicitud.entidad.id = r.data.entidad.id;
              this.solicitud.entidad.nombre = r.data.entidad.nombre;          
              this.solicitud.entidad.cuit = r.data.entidad.cuit;
              this.solicitud.entidad.fechaInicio = utils.getFecha(r.data.entidad.fechaInicio);
              this.solicitud.entidad.fechaConstitucion = utils.getFecha(r.data.entidad.fechaConstitucion);
              this.solicitud.entidad.tipoEmpresa = this.opciones.empresa.find(i => i.valor == r.data.entidad.tipoEmpresa).id;
              this.solicitud.entidad.tipoSociedad = this.opciones.sociedad.find(i => i.valor == r.data.entidad.tipoSociedad).id;

              this.solicitud.entidad.domicilios = r.data.entidad.domicilios;

              for(let contacto of r.data.entidad.contactos) {
                let contacto_nuevo = contacto;
                contacto_nuevo.tipo = this.opciones.contacto.find(i => i.valor == contacto.tipo).id;
                this.solicitud.entidad.contactos.push(contacto_nuevo);
              }

              this.solicitud.entidad.representantes = r.data.entidad.representantes;
              this.init(false);
        })
      }
      else {
        this.solicitud = new Solicitud('empresa');
        this.solicitud.delegacion = +this.global_state.delegacion.id;        
        this.init(true);
      }       
    },

    getTipoContacto: function(id) {
      return this.opciones.contacto.find(o => o.id == id).valor;
    },

    getTipoEmpresa: function(id) {
      return this.opciones.empresa.find(e => e.id == id).valor;
    },

    getTipoSociedad: function(id) {
      return this.opciones.sociedad.find(s => s.id == id).valor;
    },

    submit: function() {
      this.guardando = true;
      
      if (!this.id) {
        axios.post('/solicitudes', this.solicitud)
            .then(r => {
              this.guardando = false;
              this.global_state.snackbar.msg = 'Nueva solicitud creada exitosamente!';
              this.global_state.snackbar.color = 'success';
              this.global_state.snackbar.show = true;
              this.$router.push('/solicitudes/lista')

            })
            .catch(e => this.submitError(e));
      }
      else {
        axios.put(`/solicitudes/${this.id}`, this.solicitud)
          .then(r => {
            this.guardando = false;
            if (r.status != 200) {
              this.submitError(e);
            }
            this.global_state.snackbar.msg = 'Solicitud modificada exitosamente!';
            this.global_state.snackbar.color = 'success';
            this.global_state.snackbar.show = true;
            this.$router.replace('/solicitudes/lista');
          })
          .catch(e => this.submitError(e));        
      }      
    },

    nextStep: function() {
      let next = true;
      if (this.step == 1) next = this.$refs.form_solicitud.validate();
      else if (this.step == 2) next = this.$refs.form_empresa.validate();
      else if (this.step == 3) next = this.valid_domicilios;

      if (next) this.step = +this.step + 1;
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

    selectRepresentantePrimario: function(matricula) {
      this.solicitud.entidad.representantes = [{
        tipo: 'primario',
        matricula: matricula.id,
        numeroMatricula: matricula.numeroMatricula,
        dni: matricula.entidad.dni,
        apellido: matricula.entidad.apellido,
        nombre: matricula.entidad.nombre
      }]
    },

    borrarRepresentante: function(numeroMatricula) {
      this.solicitud.entidad.representantes = this.solicitud.entidad.representantes
                                                  .filter(r => r.numeroMatricula != numeroMatricula);
    },

    imprimir: function() {
      axios.get(`/solicitudes/${this.id}`)
          .then(s => {
            let solicitud = s.data;
            let pdf = impresionSolicitud(solicitud);
            pdf.save(`Solicitud ${solicitud.entidad.nombre}.pdf`)
          })
          .catch(e => console.error(e));
    },    
  },

  components: {
    InputFecha, InputTelefono
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
    width: 15%;
    word-wrap: break-word;
}
</style>
