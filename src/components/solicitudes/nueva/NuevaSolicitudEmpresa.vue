<template>
  <v-container fluid>
    <v-dialog
      persistent
      fullscreen
      v-model="show_persona"
    >
      <persona-nueva 
          dialog
          :dni="rep_legal.dni"
          @cancelar="show_persona = false"
          @created="nuevaPersona"
      ></persona-nueva>
    </v-dialog>    

      <v-layout row wrap>
        <v-flex xs10>
          <form v-on:submit.prevent="submit">
          <v-toolbar class="darken-3" color="primary">
            <v-toolbar-title class="white--text">Solicitud de Matriculación de Empresas</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-container>
            <v-progress-linear indeterminate v-show="show_cargando"></v-progress-linear>

             <v-stepper v-model="step" vertical v-if="!show_cargando">
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
                          <input-texto
                            tabindex="4"
                            maxlength="100"
                            label="Nombre"
                            uppercase
                            v-model="solicitud.entidad.nombre"
                            :rules="[rules.required]"
                          ></input-texto>

                          <v-select
                            autocomplete
                            tabindex="5"
                            item-text="valor"
                            item-value="id"
                            return-object
                            :items="global_state.opciones.empresa"
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

                          <v-select
                              label="Incumbencias"
                              max-height="400"
                              hint="Seleccione las incumbencias"
                              persistent-hint
                              multiple                              
                              :items="global_state.opciones.incumbencia"
                              item-text="valor"
                              item-value="id"
                              v-model="solicitud.entidad.incumbencias"
                          ></v-select>                          
                        </v-flex>

                        <v-flex xs6 class="ma-4">
                          <input-numero
                            tabindex="8"
                            maxlength="11"
                            label="CUIT"
                            v-model="solicitud.entidad.cuit"
                            :rules="[rules.required, rules.cuit]"
                          ></input-numero>

                          <input-fecha
                              tabindex="9"
                              v-model="solicitud.entidad.fechaInicio"
                              label="Fecha de Inicio de Actividades"
                          >
                          </input-fecha>

                          <v-select
                            autocomplete
                            single-line
                            bottom
                            tabindex="10"
                            item-text="valor"
                            item-value="id"
                            return-object
                            :items="global_state.opciones.sociedad"
                            v-model="solicitud.entidad.tipoSociedad"
                            label="Tipo de Sociedad"
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
                      <entidad-domicilios
                        tabindex="12"
                        v-model="solicitud.entidad.domicilios"
                      ></entidad-domicilios>

                      <v-alert class="mt-4" color="error" icon="priority_high" :value="!valid_domicilios">
                        Debe ingresar al menos un domicilio
                      </v-alert>
                    </v-card-text>
                  </v-card>
                  <v-btn color="primary" darken-1 @click.native="nextStep" class="right" tabindex="20">Continuar</v-btn>
                  <v-btn flat @click.native="step = 2" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 4: CONTACTOS -->
                <v-stepper-step step="4" edit-icon="check" editable :complete="step > 4">
                  Datos de Contacto
                </v-stepper-step>
                <v-stepper-content step="4">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <entidad-contactos
                        tabindex="21"
                        :opciones="global_state.opciones.contacto"
                        v-model="solicitud.entidad.contactos"
                      ></entidad-contactos>
                    </v-card-text>
                  </v-card>
                  <v-btn color="primary" darken-1 @click.native="nextStep" class="right"
                    tabindex="26"
                  >Continuar</v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


            <!-- PASO 5: CONDICION IMPOSITIVA -->
            <v-stepper-step step="5" edit-icon="check" editable :complete="step > 5">
              Condición Impositiva
            </v-stepper-step>
            <v-stepper-content step="5">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <entidad-condicion-afip
                    tabindex="27"
                    :opciones="condiciones_afip"
                    v-model="solicitud.entidad.condiciones_afip"
                  ></entidad-condicion-afip>
                </v-card-text>
              </v-card>
              <v-btn color="primary" @click.native="nextStep" class="right" tabindex="30"
              >Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>


                <!-- PASO 6: REPRESENTANTE -->
                <v-stepper-step step="6" edit-icon="check" editable
                  :complete="valid_representante && step > 6"
                  :rules="[() => step <= 6 || valid_representante]"
                >
                  Representantes Técnicos
                </v-stepper-step>
                <v-stepper-content step="6">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                        <span class="ml-3"><b>Buscar:</b></span>
                        <v-layout row wrap>
                          <v-flex xs3  class="mx-3">
                            <v-text-field
                              label="N°"
                              maxlength="30"
                              @input="updateList"
                              v-model="filtros.numero"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs3>
                            <v-text-field
                              label="Apellido"
                              maxlength="50"
                              @input="updateList"
                              v-model="filtros.apellido"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs3  class="mx-3">
                            <v-text-field
                              label="DNI"
                              maxlength="8"
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
                                :headers="$options.headers.matriculados"
                                :items="matriculados"
                                class="elevation-1"
                                no-data-text="No se encontraron matriculados"
                                no-results-text="No se encontraron matriculados"
                                :pagination.sync="pagination"
                                :total-items="totalItems"
                                :loading="loading"
                            >
                              <template slot="items" slot-scope="props">
                                <tr>
                                  <td class="justify-center layout px-0">
                                    <v-btn icon small class="mx-0" @click="addRepresentanteTecnico(props.item)">
                                      <v-icon color="primary">playlist_add</v-icon>
                                    </v-btn>
                                  </td>                                  
                                  <td>{{ props.item.numeroMatricula }}</td>
                                  <td>{{ props.item.entidad.nombre }}</td>
                                  <td>{{ props.item.entidad.apellido }}</td>
                                  <td>{{ props.item.entidad.dni }}</td>
                                </tr>
                              </template>
                            </v-data-table>
                          </v-flex>
                        </v-layout>

                        <br>
                        <template v-if="representantes_tecnicos.length > 0">
                          <span class="ml-3"><b>Representantes Técnicos:</b></span>

                          <v-layout row wrap>
                            <v-flex xs12 class="mx-3">
                              <v-data-table
                                  hide-actions
                                  :headers="$options.headers.rep_tecnico"
                                  :items="representantes_tecnicos"
                                  class="elevation-1"
                                  no-data-text="No se agregaron representates"
                                  no-results-text="No se agregaron representates"
                                  >
                                <template slot="items" slot-scope="props">
                                  <tr>
                                    <td class="justify-center layout px-0">
                                      <v-btn icon small class="mx-0" @click="borrarRepresentanteTecnico(props.item.matricula.id)">
                                        <v-icon color="red">delete</v-icon>
                                      </v-btn>
                                    </td>                                    
                                    <td>{{ props.item.matricula.numeroMatricula }}</td>
                                    <td>{{ props.item.matricula.entidad.nombre }} {{ props.item.matricula.entidad.apellido }}</td>
                                    <td>{{ props.item.matricula.entidad.dni }}</td>
                                    <td>
                                      <input-fecha
                                        v-model="props.item.fechaInicio"
                                      ></input-fecha>
                                    </td>
                                    <td>
                                      <input-fecha
                                        v-model="props.item.fechaFin"
                                      ></input-fecha>
                                    </td>
                                  </tr>
                                </template>
                              </v-data-table>
                            </v-flex>
                          </v-layout>
                        </template>
                    </v-card-text>
                  </v-card>

                  <v-btn blue darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 7: REPRESENTANTES LEGALES -->
                <v-stepper-step step="7" edit-icon="check" editable>
                  Representantes Legales
                </v-stepper-step>
                <v-stepper-content step="7">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                        <v-layout row wrap>
                          <v-flex xs3  class="mx-3">
                            <input-numero
                                label="Buscar DNI"
                                maxlength="8"
                                append-icon="search"
                                v-model="rep_legal.dni"
                                @change="chgDni"
                                :append-icon-cb="chgDni"
                            ></input-numero>
                          </v-flex>

                          <v-flex xs3>
                            <v-text-field
                              disabled
                              label="Apellido"
                              v-model="rep_legal.apellido"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs3  class="mx-3">
                            <v-text-field
                              disabled
                              label="Nombre"
                              v-model="rep_legal.nombre"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs1  class="mx-3">
                            <v-btn class="right mb-4" light @click="addRepresentanteLegal">
                                Guardar
                            </v-btn>
                          </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                          <v-flex xs12 class="mx-3">
                            <v-data-table
                                hide-actions
                                :headers="$options.headers.matriculados"
                                :items="representantes_legales"
                                class="elevation-1"
                                no-data-text="No se agregaron representates"
                                no-results-text="No se agregaron representates"
                              >
                              <template slot="items" slot-scope="props">
                                <tr>
                                  <td class="justify-center layout px-0">
                                    <v-btn icon small class="mx-0" @click="borrarRepresentanteLegal(props.item)">
                                      <v-icon color="red">delete</v-icon>
                                    </v-btn>
                                  </td>

                                  <template v-if="props.item.id && props.item.matricula">
                                    <td>{{ props.item.matricula.numeroMatricula }}</td>
                                    <td>{{ props.item.matricula.entidad.dni }}</td>
                                    <td>{{ props.item.matricula.entidad.nombre }}</td>
                                    <td>{{ props.item.matricula.entidad.apellido }}</td>                                    
                                  </template>

                                  <template v-else-if="props.item.id && props.item.persona">
                                    <td></td>
                                    <td>{{ props.item.persona.dni }}</td>
                                    <td>{{ props.item.persona.nombre }}</td>
                                    <td>{{ props.item.persona.apellido }}</td>                                    
                                  </template>

                                  <template v-else>
                                    <td>{{ props.item.numero }}</td>
                                    <td>{{ props.item.dni }}</td>
                                    <td>{{ props.item.nombre }}</td>
                                    <td>{{ props.item.apellido }}</td>                                    
                                  </template>
                                </tr>
                              </template>
                            </v-data-table>
                          </v-flex>
                        </v-layout>
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
                <div><b>Tipo de Empresa: </b> {{ solicitud.entidad.tipoEmpresa ? solicitud.entidad.tipoEmpresa.valor : '' }} </div>
                <div><b>Tipo de Sociedad: </b> {{ solicitud.entidad.tipoSociedad ? solicitud.entidad.tipoSociedad.valor : '' }} </div>
              </v-card-text>
            </v-card>
          </v-container>
        </div>
      </v-layout>
    </v-container>
</template>

<script>
import { debounce } from 'lodash'
import api from '@/services/api'
import rules from '@/validation/rules'
import { getFecha, clone } from '@/utils'
import { Solicitud, ColumnHeader } from '@/model'
import InputNumero from '@/components/base/InputNumero'
import InputTexto from '@/components/base/InputTexto'
import InputFecha from '@/components/base/InputFecha'
import MixinValidator from '@/components/mixins/MixinValidator'
import MixinGlobalState from '@/components/mixins/MixinGlobalState'
import NuevaSolicitud from '@/components/solicitudes/nueva/NuevaSolicitud'
import PersonaNueva from '@/components/personas/PersonaNueva'
import EntidadDomicilios from '@/components/entidades/EntidadDomicilios'
import EntidadContactos from '@/components/entidades/EntidadContactos'
import EntidadCondicionAfip from '@/components/entidades/EntidadCondicionAfip'

export default {
  name: 'nueva-solicitud-empresa',

  mixins: [MixinGlobalState, MixinValidator, NuevaSolicitud],

  props: ['id'],

  components: {
    InputFecha,
    InputTexto,
    InputNumero,
    PersonaNueva,
    EntidadDomicilios,
    EntidadContactos,
    EntidadCondicionAfip
  },

  headers: {
    matriculados: [
      ColumnHeader('', 'acciones'),
      ColumnHeader('N°', 'numero'),
      ColumnHeader('Nombre', 'nombre'),
      ColumnHeader('Apellido', 'nombre'),
      ColumnHeader('DNI', 'dni')
    ],

    rep_tecnico: [
      ColumnHeader('', 'acciones'),
      ColumnHeader('N°', 'numero'),
      ColumnHeader('Nombre', 'nombre'),
      ColumnHeader('DNI', 'dni'),
      ColumnHeader('Fecha Inicio', 'fini'),
      ColumnHeader('Fecha Cese', 'ffin')
    ]
  },

  data () {
    return {
      solicitud: new Solicitud('empresa'),
      nuevo_contacto: new Solicitud(),

      valid: {
        form_solicitud: false,
        form_empresa: false
      },

      tipo_representante: 'tec',

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
      guardando: false,
      expand_add: false,
      show_persona: false,
      rep_legal: {
        persona: null,
        dni: null,
        nombre: null,
        apellido: null
      }
    }
  },

  watch: {
    '$route' (to, from) {
      if (this.datos_cargados) this.initForm();
    },

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
    representantes_legales: function() {
      return this.solicitud.entidad.representantes.filter(r => r.tipo == 'legal');
    },

    representantes_tecnicos: function() {
      return this.solicitud.entidad.representantes.filter(r => r.tipo == 'tecnico');
    },

    valid_representante: function() {
      return this.solicitud.entidad.representantes.length > 0;
    },

    valid_form: function() {
      return this.valid.form_solicitud && this.valid.form_empresa
        && this.valid_domicilios
        && this.valid_representante;
    },

    condiciones_afip: function() {
      return this.global_state.opciones.condicionafip.filter(c => c.t_entidad != 'profesional');
    }
  },

  created: function() {
    this.debouncedUpdate = debounce(this.updateMatriculas, 600, { 'maxWait': 1000 });

    api.get('/delegaciones')
    .then(r => {
      this.delegaciones = r.data;
      this.datos_cargados = true;
      this.initForm();
    })
    .catch(e => console.error(e));
  },

  methods: {
    init: function(reset) {
      this.show_cargando = false;
      if (reset) this.$refs.form_empresa.reset();
    },

    initForm: function() {
      this.step = 1;
      this.updateMatriculas();

      if (this.id) {
        this.show_cargando = true;
        api.get(`/solicitudes/${this.id}`)
        .then(r => {
              this.solicitud = new Solicitud('empresa');
              this.solicitud.fecha = getFecha(r.data.fecha);
              this.solicitud.delegacion = this.delegaciones.find(d => d.nombre == r.data.delegacion).id;
              this.solicitud.entidad = r.data.entidad;
              this.solicitud.entidad.fechaInicio = getFecha(r.data.entidad.fechaInicio);
              this.solicitud.entidad.fechaConstitucion = getFecha(r.data.entidad.fechaConstitucion);
              this.solicitud.entidad.incumbencias = r.data.entidad.incumbencias.map(i => i.incumbencia.id);
              this.solicitud.entidad.representantes = r.data.entidad.representantes.map(r => {
                r.fechaInicio = getFecha(r.fechaInicio);
                r.fechaFin = getFecha(r.fechaFin);
                return r;
              });
              this.valid.form_solicitud = true;
              this.valid.form_empresa = true;
              this.init(false);
        })
      }
      else {
        this.solicitud = new Solicitud('empresa');
        this.solicitud.delegacion = +this.global_state.delegacion.id;
        this.init(true);
      }
    },

    submit: function() {
      this.guardando = true;

      let solicitud = clone(this.solicitud);
      solicitud.entidad.nombre = solicitud.entidad.nombre.toUpperCase();
      solicitud.entidad.tipoEmpresa = solicitud.entidad.tipoEmpresa.id;
      solicitud.entidad.tipoSociedad = solicitud.entidad.tipoSociedad ? solicitud.entidad.tipoSociedad.id : null;

      solicitud.entidad.domicilios.forEach(d => {
        d.domicilio.pais = d.domicilio.pais.id;
        d.domicilio.provincia = d.domicilio.provincia.id;
        d.domicilio.departamento = d.domicilio.departamento.id;
        d.domicilio.localidad = d.domicilio.localidad.id;
      });

      solicitud.entidad.contactos.forEach(c => {
        c.tipo = c.tipo.id;
      });

      solicitud.entidad.condiciones_afip.forEach(c => {
        c.condicion_afip = c.condicion_afip.id;
      });

      solicitud.entidad.representantes.forEach(r => {
        if (r.matricula) r.matricula = r.matricula.id;
        if (r.persona) r.persona = r.persona.id;
      })


      if (!this.id) {
        api.post('/solicitudes', solicitud)
            .then(r => {
              this.snackOk('Nueva solicitud creada exitosamente!');
              this.guardando = false;
              this.$router.push('/solicitudes/lista')

            })
            .catch(e => this.snackError(e));
      }
      else {
        api.put(`/solicitudes/${this.id}`, solicitud)
          .then(r => {
            this.snackOk('Solicitud modificada exitosamente!');
            this.guardando = false;
            this.$router.replace('/solicitudes/lista');
          })
          .catch(e => this.snackError(e));
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
      this.matriculados = [];
      let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
      let limit = this.pagination.rowsPerPage;

      // El estado '13' es 'Habilitado'
      let url = `/matriculas?entidad[tipo]=profesional&estado=13&limit=${limit}&offset=${offset}`;

      if (this.filtros.numero) url += `&filtros[numeroMatricula]=${this.filtros.numero}`;
      if (this.filtros.dni) url+=`&filtros[profesional.dni]=${this.filtros.dni}`;
      if (this.filtros.apellido) url+=`&filtros[profesional.apellido]=${this.filtros.apellido}`;

      api.get(url)
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

    addRepresentanteTecnico: function(matricula) {
      let representante = {
        tipo: 'tecnico',
        matricula: matricula,
        fechaInicio: '',
        fechaFin: ''
      };
      this.solicitud.entidad.representantes.push(representante);
    },

    addRepresentanteLegal: function() {
      let representante = this.rep_legal;
      representante.tipo = 'legal';
      this.solicitud.entidad.representantes.push(clone(representante));
    },

    borrarRepresentanteLegal: function(representante) {
      if (representante.persona)
        this.solicitud.entidad.representantes = this.solicitud.entidad.representantes
                                                .filter(r => r.tipo != 'legal' || r.persona != representante.persona);
      else 
        this.solicitud.entidad.representantes = this.solicitud.entidad.representantes
                                                .filter(r => r.tipo != 'legal' || r.matricula != representante.matricula);      
    },

    borrarRepresentanteTecnico: function(id) {
      this.solicitud.entidad.representantes = this.solicitud.entidad.representantes
                                              .filter(r => r.tipo != 'tecnico' || r.matricula.id != id);
    },

    imprimir: function() {
      api.get(`/solicitudes/${this.id}`)
          .then(s => {
            reports.open({
              'jsp-source': 'solicitud_matricula_empresa.jasper',
              'jsp-format': 'PDF',
              'jsp-output-file': `Solicitud ${solicitud.numero} - ${Date.now()}`,
              'jsp-only-gen': false,
              'solicitud_id': item.id
            });
          })
          .catch(e => console.error(e));
    },

    chgDni: function() {
      this.rep_legal.persona = null;
      this.rep_legal.matricula = null;
      this.rep_legal.numero = null;
      this.rep_legal.nombre = null;
      this.rep_legal.apellido = null;

      api.get(`/matriculas?filtros[profesional.dni]=${this.rep_legal.dni}`)
      .then(r => {
        if (r.data.resultados.length > 0) {
          let matricula = r.data.resultados[0];
          this.rep_legal.matricula = matricula;
          this.rep_legal.numero = matricula.numeroMatricula;
          this.rep_legal.nombre = matricula.entidad.nombre;
          this.rep_legal.apellido = matricula.entidad.apellido;          
        }
        else {
          return api.get(`/personas?tipo=fisica&dni=${this.rep_legal.dni}`)
          .then(r => {
              if (r.data.resultados.length > 0) {
                  let persona = r.data.resultados[0];
                  this.rep_legal.persona = persona.id;
                  this.rep_legal.nombre = persona.nombre;
                  this.rep_legal.apellido = persona.apellido;
              }
              else if (rules.dni(this.rep_legal.dni) === true) {
                  if (confirm('No existe ninguna persona registrada con dicho dni. Desea cargarla?')) {
                      this.show_persona = true;
                  }
              }
          })
        }
      })
      .catch(e => console.error(e));
    },    

    nuevaPersona: function(persona) {
        this.rep_legal.persona = persona.id;
        this.rep_legal.dni = persona.dni;
        this.rep_legal.nombre = persona.nombre;
        this.rep_legal.apellido = persona.apellido;
        this.show_persona = false;
    }
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
