<template>
<v-container fluid>
    <v-dialog v-model="show_imprimir" max-width="290">
      <v-card>
        <v-card-title class="headline">Nueva Solicitud</v-card-title>
        <v-card-text>
          Desea imprimir la solicitud creada?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="imprimir">Sí</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="cancelarImpresion">No</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  <v-layout row wrap>
    <v-flex xs10>
      <form v-on:submit.prevent="submit">
        <v-toolbar class="darken-3" color="primary">
          <v-toolbar-title class="white--text">Solicitud de Matriculación de Profesionales</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-container>
          <v-progress-linear indeterminate v-show="show_cargando"></v-progress-linear>

          <v-stepper v-model="step" vertical>

            <!-- PASO 1: DATOS DE SOLICITUD -->
            <v-stepper-step step="1" edit-icon="check" editable :complete="valid.form_solicitud && step > 1" :rules="[() => step <= 1 || valid.form_solicitud]">
              Datos de la Solicitud
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-form ref="form_solicitud" v-model="valid.form_solicitud">
                    <v-layout row>
                      <v-flex xs6 class="ma-4">
                        <input-fecha
                          tabindex="1"
                          v-model="solicitud.fecha"
                          label="Fecha de Solicitud"
                          :rules="[rules.required, rules.fecha]"
                          :disabled="solicitud.estado && solicitud.estado != 'Pendiente'"
                        >
                        </input-fecha>
                      </v-flex>

                      <v-flex xs6 class="ma-4">
                        <v-select
                          autocomplete single-line bottom
                          item-text="nombre"
                          item-value="id"
                          tabindex="2"
                          :items="delegaciones"
                          v-model="solicitud.delegacion"
                          label="Delegación"
                          :rules="[rules.required]"
                          :disabled="solicitud.estado && solicitud.estado != 'Pendiente'"
                        >
                        </v-select>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-card>
              <v-btn color="primary" darken-1 @click.native="nextStep" class="right" tabindex="3">Continuar</v-btn>
            </v-stepper-content>
            <!-- FIN PASO 1 -->


            <!-- PASO 2: DATOS DE PROFESIONAL -->
            <v-stepper-step step="2" edit-icon="check" editable
              :complete="valid.form_profesional && step > 2"
              :rules="[() => step <= 2 || valid.form_profesional]"
            >
              Datos del Profesional
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>

                  <v-form ref="form_profesional" v-model="valid.form_profesional">

                  <v-layout row>
                    <v-flex xs6 class="ma-4">
                      <input-numero
                        label="DNI"
                        v-model="solicitud.entidad.dni"
                        :rules="[rules.required, rules.integer]"
                        tabindex="3"
                        maxlength="10"
                        clearable
                        @blur="chgDni"
                        @keypress.enter="chgDni"
                      >
                      </input-numero>

                      <input-texto
                        label="Nombre"
                        v-model="solicitud.entidad.nombre"
                        tabindex="5"
                        maxlength="100"
                        uppercase
                        :rules="[rules.required]"
                      >
                      </input-texto>

                      <v-select
                        autocomplete
                        tabindex="7"
                        :items="opciones.sexo"
                        item-text="valor"
                        item-value="id"
                        return-object
                        v-model="solicitud.entidad.sexo"
                        label="Sexo"
                        single-line bottom
                        :rules="[rules.required]"
                      >
                      </v-select>

                      <input-fecha
                        v-model="solicitud.entidad.fechaNacimiento"
                        label="Fecha de Nacimiento"
                        tabindex="9"
                        :rules="[rules.required, rules.fecha]"
                      >
                      </input-fecha>

                      <input-texto
                        label="Nacionalidad"
                        type="letras"
                        uppercase
                        v-model="solicitud.entidad.nacionalidad"
                        maxlength="45"
                        tabindex="11"
                      ></input-texto>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <input-texto
                        label="Apellido"
                        type="letras"
                        uppercase
                        v-model="solicitud.entidad.apellido"
                        :rules="[rules.required]"
                        maxlength="100"
                        tabindex="4"
                      ></input-texto>

                      <input-numero
                        label="CUIT/CUIL"
                        v-model="solicitud.entidad.cuit"
                        :rules="[rules.cuit]"
                        tabindex="6"
                        maxlength="11"
                      >
                      </input-numero>

                      <v-select
                        autocomplete
                        tabindex="8"
                        :items="opciones.estadocivil"
                        item-text="valor"
                        item-value="id"
                        return-object
                        v-model="solicitud.entidad.estadoCivil"
                        label="Estado Civil"
                        single-line bottom
                        :rules="[rules.required]"
                      ></v-select>

                      <input-texto
                        label="Lugar Nacimiento"
                        uppercase
                        v-model="solicitud.entidad.lugarNacimiento"
                        maxlength="100"
                        tabindex="10"
                      ></input-texto>

                      <input-texto
                        label="Observaciones"
                        uppercase
                        v-model="solicitud.entidad.observaciones"
                        tabindex="12"
                      ></input-texto>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12 class="mx-4">
                      <profesional-add-foto
                          edit
                          :url="solicitud.entidad.foto ? solicitud.entidad.foto : ''"
                          @change="chgFoto"
                      ></profesional-add-foto>
                    </v-flex>
                  </v-layout>

                  <v-layout row class="mx-4 mt-4">
                    <v-flex xs12 class="mt-4">
                      <profesional-add-firma
                        edit
                        :url="solicitud.entidad.firma ? solicitud.entidad.firma : ''"
                        @change="chgFirma"
                        ref="firma"
                      ></profesional-add-firma>
                    </v-flex>
                  </v-layout>

                  </v-form>
                </v-card-text>
              </v-card>
              <v-btn color="primary" darken-1 @click.native="nextStep" class="right" tabindex="14">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>


            <!-- PASO 3: DOMICILIOS -->
            <v-stepper-step step="3" edit-icon="check"
              editable
              :complete="valid_domicilios && step > 3"
              :rules="[() => step <= 3 || valid_domicilios]"
            >
              Domicilios del Profesional
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <entidad-domicilios
                    tabindex="15"
                    v-model="solicitud.entidad.domicilios"
                  ></entidad-domicilios>

                  <v-alert class="mt-4" color="error" icon="priority_high" :value="!valid_domicilios">
                      Debe ingresar al menos un domicilio
                  </v-alert>                  
                </v-card-text>
              </v-card>
              <v-btn color="primary" darken-1 @click.native="nextStep" class="right" tabindex="22">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>


            <!-- PASO 4: CONTACTOS -->
            <v-stepper-step step="4" edit-icon="check" editable :complete="step > 4">
              Datos de Contacto
            </v-stepper-step>
            <v-stepper-content step="4">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <entidad-contactos
                    tabindex="23"
                    :opciones="opciones.contacto"
                    v-model="solicitud.entidad.contactos"
                  ></entidad-contactos>
                </v-card-text>
              </v-card>

              <v-btn color="primary" darken-1 @click.native="nextStep" class="right" tabindex="28"
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
                    tabindex="29"
                    :opciones="opciones.condicionafip"
                    v-model="solicitud.entidad.condiciones_afip"
                  ></entidad-condicion-afip>
                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="32">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>


            <!-- PASO 6: FORMACIONES -->
            <v-stepper-step step="6" edit-icon="check"
              editable
              :complete="valid_formaciones && step > 6"
              :rules="[() => step <= 6 || valid_formaciones]"
            >
              Datos de Formación Académica
            </v-stepper-step>
            <v-stepper-content step="6">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <profesional-formaciones
                    tabindex="33"
                    :niveles="opciones.niveles_titulos"
                    v-model="solicitud.entidad.formaciones"
                  ></profesional-formaciones>

                  <v-alert color="error" icon="priority_high" :value="!valid_formaciones">
                      Debe ingresar al menos un título para el profesional
                  </v-alert>                  
                </v-card-text>
              </v-card>
              <v-btn color="primary" darken-1 @click.native="nextStep" class="right" tabindex="40"
              >Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>


            <!-- PASO 7: DATOS ADICIONALES -->
            <v-stepper-step step="7" edit-icon="check" editable :complete="step > 7">
              Relación Laboral
            </v-stepper-step>
            <v-stepper-content step="7">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-layout row>
                    <v-flex xs6 class="ma-4">
                      <v-checkbox
                        tabindex="41"
                        label="Relación de Dependencia" class="mb-4" v-model="solicitud.entidad.relacionDependencia">
                      </v-checkbox>

                      <v-checkbox
                        tabindex="43"
                        label="Profesional Independiente" class="mb-4" v-model="solicitud.entidad.independiente">
                      </v-checkbox>

                      <v-checkbox
                        tabindex="45"
                        label="Jubilado" class="mb-4" v-model="solicitud.entidad.jubilado">
                      </v-checkbox>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <input-texto
                        tabindex="42"
                        maxlength="100"
                        label="Empresa"
                        uppercase
                        :disabled="!solicitud.entidad.relacionDependencia"
                        v-model="solicitud.entidad.empresa"
                      ></input-texto>

                      <input-texto
                        tabindex="44"
                        label="Servicios Prestados"
                        uppercase
                        :disabled="!solicitud.entidad.independiente"
                        v-model="solicitud.entidad.serviciosPrestados"
                      ></input-texto>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
              <v-btn color="primary" darken-1 @click.native="nextStep" class="right" tabindex="45">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>



            <!-- PASO 8: CAJA PREVISIONAL -->
            <v-stepper-step step="8" edit-icon="check" editable :complete="step > 8">
              Caja Previsional
            </v-stepper-step>
            <v-stepper-content step="8">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>

                  <v-checkbox
                    tabindex="46"
                    label="Solicitar Caja Previsional"
                    v-model="solicitar_caja"
                    class="ml-4 mb-4"
                  ></v-checkbox>

                  <profesional-cajas-previsionales
                    tabindex="47"
                    v-model="solicitud.entidad.cajas_previsionales"
                  ></profesional-cajas-previsionales>
                </v-card-text>
              </v-card>
              <v-btn color="primary" darken-1 @click.native="nextStep" class="right" tabindex="49">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>



            <!-- PASO 9: SUBSIDIO POR FALLECIMIENTO -->
            <v-stepper-step step="9" edit-icon="check" editable
              :complete="valid_subsidiarios && step > 9"
              :rules="[() => step <= 9 || valid_subsidiarios]"
            >
              Subsidio Por Fallecimiento
            </v-stepper-step>
            <v-stepper-content step="9">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <profesional-subsidiarios
                    tabindex="50"
                    v-model="solicitud.entidad.subsidiarios"
                  ></profesional-subsidiarios>

                  <v-alert color="error" icon="priority_high" :value="!valid_subsidiarios">
                  Los porcentajes deben sumar 100%
                  </v-alert>                  
                </v-card-text>
              </v-card>
              <v-btn color="primary" darken-1 @click.native="nextStep" class="right" tabindex="55">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>



            <!-- PASO 9: DECLARACION Y EXENCIONES -->
            <v-stepper-step step="10" edit-icon="check" editable :complete="step > 10">
              Declaración de Difusión de Datos y Recepción de Información
            </v-stepper-step>
            <v-stepper-content step="10">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-checkbox tabindex="56" label="De Acuerdo" v-model="deAcuerdo">
                  </v-checkbox>

                  <h3>Permitir la publicación de los datos:</h3>

                  <v-checkbox
                    tabindex="57"
                    class="mt-4"
                    label="Todos"
                    @change="chgPublicarTodos"
                    v-model="publicar_todos"
                  >
                  </v-checkbox>

                  <v-layout row class="mt-2">
                    <v-flex xs6>
                      <v-checkbox
                        tabindex="58"
                        label="Email"
                        v-model="solicitud.entidad.publicarEmail"
                      >
                      </v-checkbox>

                      <v-checkbox
                        tabindex="59"
                        label="Celular"
                        v-model="solicitud.entidad.publicarCelular"
                      >
                      </v-checkbox>
                    </v-flex>

                    <v-flex xs6>
                      <v-checkbox
                        tabindex="60"
                        label="Dirección"
                        v-model="solicitud.entidad.publicarDireccion"
                      >
                      </v-checkbox>

                      <v-checkbox
                        tabindex="61"
                        label="Acervo"
                        v-model="solicitud.entidad.publicarAcervo"
                      >
                      </v-checkbox>
                    </v-flex>
                  </v-layout>

                  <br>

                  <v-checkbox
                    tabindex="62"
                    class="ma-0 pa-0" label="Recibir Actualizaciones" v-model="solicitud.entidad.recibirActualizaciones"
                  ></v-checkbox>
                </v-card-text>
              </v-card>

              <v-btn
                tabindex="63"
                color="primary"
                class="darken-1 white--text right"
                :loading="guardando"
                :disabled="!valid_form || guardando"
                @click.native="submit"
              >
                Guardar Solicitud
                <v-icon dark right>check_circle</v-icon>
              </v-btn>

              <v-btn color="primary" class="darken-1 white--text right" @click.native="imprimir" v-if="this.id">
                Imprimir
                <v-icon dark right>check_circle</v-icon>
              </v-btn>

              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>
          </v-stepper>

        </v-container>

      </form>
    </v-flex>

    <div class="stuck">
      <v-toolbar color="primary" class="darken-3">
        <v-toolbar-title class="white--text">Profesional</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-container>
        <v-card>
          <v-card-text id="info-profesional">
            <div><b>Nombre: </b> {{ solicitud.entidad.nombre }} </div>
            <div><b>Apellido: </b> {{ solicitud.entidad.apellido }} </div>
            <div><b>DNI: </b> {{ solicitud.entidad.dni }} </div>
            <div><b>CUIT/CUIL: </b> {{ solicitud.entidad.cuit }} </div>
            <div><b>Sexo: </b> {{ solicitud.entidad.sexo ? solicitud.entidad.sexo.valor : '' }} </div>
            <div><b>Estado Civil: </b> {{ solicitud.entidad.estadoCivil ? solicitud.entidad.estadoCivil.valor : ''  }} </div>
            <div><b>Fecha de Nacimiento: </b> {{ solicitud.entidad.fechaNacimiento }} </div>
            <div><b>Lugar de Nacimiento: </b> {{ solicitud.entidad.lugarNacimiento }} </div>
            <div><b>Nacionalidad: </b> {{ solicitud.entidad.nacionalidad }} </div>
            <div><b>Observaciones: </b> {{solicitud.entidad.observaciones }} </div>
          </v-card-text>
        </v-card>
      </v-container>
    </div>
  </v-layout>
</v-container>
</template>

<script>
import api from '@/services/api'
import reports from '@/services/reports'
import moment from 'moment'
import rules from '@/validation/rules.js'
import * as utils from '@/utils'
import {
  Solicitud,
  Subsidiario,
  Header
} from '@/model';
import InputTexto from '@/components/base/InputTexto';
import InputFecha from '@/components/base/InputFecha';
import InputTelefono from '@/components/base/InputTelefono';
import InputNumero from '@/components/base/InputNumero';
import ProfesionalAddFoto from '@/components/entidades/ProfesionalAddFoto';
import ProfesionalAddFirma from '@/components/entidades/ProfesionalAddFirma';
import MixinValidator from '@/components/mixins/MixinValidator';
import NuevaSolicitud from '@/components/solicitudes/nueva/NuevaSolicitud';
import EntidadDomicilios from '@/components/entidades/EntidadDomicilios'
import EntidadContactos from '@/components/entidades/EntidadContactos'
import EntidadCondicionAfip from '@/components/entidades/EntidadCondicionAfip'
import ProfesionalFormaciones from '@/components/entidades/ProfesionalFormaciones'
import ProfesionalCajasPrevisionales from '@/components/entidades/ProfesionalCajasPrevisionales'
import ProfesionalSubsidiarios from '@/components/entidades/ProfesionalSubsidiarios'

export default {
  name: 'nueva-solicitud',

  props: ['id', 'dni'],

  mixins: [MixinValidator, NuevaSolicitud],

  components: {
    InputTexto,
    InputFecha,
    InputTelefono,
    InputNumero,
    ProfesionalAddFoto,
    ProfesionalAddFirma,
    EntidadDomicilios,
    EntidadContactos,
    EntidadCondicionAfip,
    ProfesionalFormaciones,
    ProfesionalCajasPrevisionales,
    ProfesionalSubsidiarios
  },

  data() {
    return {
      deAcuerdo: true,
      solicitud: new Solicitud('profesional'),
      publicar_todos: false,
      solicitar_caja: false,
      foto: null,
      firma: null,
      show_imprimir: false,
      id_creada: null,
      guardando: false,
      valid: {
        form_solicitud: false,
        form_profesional: false
      }      
    }
  },

  computed: {
    suma_subsidiarios: function() {
      if (!this.solicitud.entidad.subsidiarios.length) return 0;
      return this.solicitud.entidad.subsidiarios.reduce((prev, act) => prev + +act.porcentaje, 0);
    },

    valid_subsidiarios: function() {
      return this.suma_subsidiarios === 100 || this.solicitud.entidad.subsidiarios.length === 0;
    },

    valid_formaciones: function() {
      return this.solicitud.entidad.formaciones.length > 0;
    },

    valid_form: function() {
      return this.valid.form_solicitud && this.valid.form_profesional
        && this.valid_subsidiarios && this.valid_domicilios;
    }
  },

  watch: {
    '$route' (to, from) {
      if (this.datos_cargados) this.init();
    }
  },

  created: function() {
    Promise.all([
        api.get('/opciones?sort=valor'),
        api.get('/delegaciones')
      ])
      .then(r => {
        this.opciones = r[0].data;
        this.delegaciones = r[1].data;
        this.datos_cargados = true;
        this.init();
      })
      .catch(e => console.error(e));
  },


  methods: {
    init: function() {
      this.step = 1;
      this.initForm().then(reset => {
          this.show_cargando = false;
          if (reset) {
            this.$refs.firma.reset();
            this.$refs.form_profesional.reset();
          }
      });
    },

    initForm: function() {
      this.show_cargando = true;
      this.solicitud = new Solicitud('profesional');

      if (this.id) {
        return api.get(`/solicitudes/${this.id}`)
        .then(r => {
            this.solicitud.fecha = utils.getFecha(r.data.fecha);
            this.solicitud.delegacion = this.delegaciones.find(d => d.nombre == r.data.delegacion).id;
            this.solicitud.estado = r.data.estado;
            this.fillProfesional(r.data.entidad);
            return Promise.resolve(false);
        });
      }
      else {
        this.solicitud.fecha = utils.getFecha();
        this.solicitud.delegacion = +this.global_state.delegacion.id;

        if (this.dni) {
          this.solicitud.entidad.dni = this.dni;
          return this.chgDni().then(() => false)
        }
        else {
          return Promise.resolve(true);
        }
      }
    },

    fillProfesional: function(entidad) {
      this.solicitud.entidad = utils.clone(entidad);
      this.solicitud.entidad.fechaNacimiento = utils.getFecha(entidad.fechaNacimiento)

      this.solicitud.entidad.formaciones = [];
      for(let formacion of entidad.formaciones) {
        let formacion_nueva = formacion;
        formacion_nueva.tiempoEmision = utils.diffDatesStr(moment(formacion.fechaEmision), moment());
        this.solicitud.entidad.formaciones.push(formacion_nueva);
      }

      this.solicitud.entidad.subsidiarios = [];
      for(let subsidiario of entidad.subsidiarios) {
        let subsidiario_nuevo = { id: subsidiario.id };
        subsidiario_nuevo.dni = subsidiario.dni;
        subsidiario_nuevo.apellido = subsidiario.apellido;
        subsidiario_nuevo.nombre = subsidiario.nombre;
        subsidiario_nuevo.porcentaje = subsidiario.porcentaje.toString();
        this.solicitud.entidad.subsidiarios.push(subsidiario_nuevo);
      }
    },

    chgDni: function() {
      return api.get(`/profesionales?dni=${this.solicitud.entidad.dni}`)
      .then(r => {
        if (r.data.length > 0) this.fillProfesional(r.data[0]);
        else this.solicitud.entidad.id = null;
        return;
      })
      .catch(e => console.error(e));
    },

    chgPublicarTodos: function() {
      this.solicitud.entidad.publicarEmail = this.publicar_todos;
      this.solicitud.entidad.publicarDireccion = this.publicar_todos;
      this.solicitud.entidad.publicarAcervo = this.publicar_todos;
      this.solicitud.entidad.publicarCelular = this.publicar_todos
    },

    chgFoto: function(foto) {
        this.foto = foto;
    },

    chgFirma: function(firma) {
        this.firma = firma;
    },

    nextStep: function() {
      let next = true;
      if (this.step == 1) next = this.$refs.form_solicitud.validate();
      else if (this.step == 2) next = this.$refs.form_profesional.validate();
      else if (this.step == 3) next = this.valid_domicilios;
      else if (this.step == 9) next = this.valid_subsidiarios;
      if (next) this.step = +this.step + 1;
    },

    makeFormData: function() {
      let form_data = new FormData();
      if (this.foto)
        form_data.append('foto', this.foto);
      if (this.firma)
        form_data.append('firma', this.firma);

      let solicitud = utils.clone(this.solicitud);

      solicitud.entidad.sexo = solicitud.entidad.sexo.id;
      solicitud.entidad.estadoCivil = solicitud.entidad.estadoCivil.id;

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

      solicitud.entidad.formaciones.forEach(f => {
        f.titulo = f.titulo.id;
      });

      solicitud.entidad.cajas_previsionales = solicitud.entidad.cajas_previsionales.map(c => {
        if (c.caja) return c;
        else return c.id;
      });

      form_data.append('solicitud', JSON.stringify(solicitud));
      return form_data;
    },

    submit: function() {
      this.guardando = true;

      if (!this.id) {
        api.post('/solicitudes', this.makeFormData())
          .then(r => {
            this.guardando = false;
            this.id_creada = r.data.id;
            this.show_imprimir = true;
            this.$refs.firma.reset();
            this.global_state.snackbar.msg = 'Nueva solicitud creada exitosamente!';
            this.global_state.snackbar.color = 'success';
            this.global_state.snackbar.show = true;
          })
          .catch(e => this.submitError(e));
      }
      else {
        api.put(`/solicitudes/${this.id}`, this.makeFormData())
          .then(r => {
            this.guardando = false;
            this.global_state.snackbar.msg = 'Solicitud modificada exitosamente!';
            this.global_state.snackbar.color = 'success';
            this.global_state.snackbar.show = true;
            this.$router.replace('/solicitudes/lista');
          })
          .catch(e => {
            this.submitError(e);
            this.guardando = false;
          });
      }
    },

    imprimir: function() {
      let id = this.id_creada;
      if (!id) id = this.id;
      Promise.all([
        api.get(`/solicitudes/${id}`),
        api.get(`/matriculas?entidad=${id}`)
      ])
      .then(rs => {
        let solicitud = rs[0].data;
        let es_rematriculado = rs[1].data.length > 0;

        if (this.solicitar_caja) {
          reports.open({
            'jsp-source': 'anexo_caja_previsional.jasper',
            'jsp-format': 'PDF',
            'jsp-output-file': `Anexo Caja Sol. ${solicitud.numero} - ${Date.now()}`,
            'jsp-only-gen': false,
            'solicitud_id': solicitud.id
          });
        }

        if (es_rematriculado) {
          reports.open({
            'jsp-source': 'certificado_matricula.jasper',
            'jsp-format': 'PDF',
            'jsp-output-file': `Certificado Matricula en Tramite Sol. ${solicitud.numero} - ${Date.now()}`,
            'jsp-only-gen': false,
            'solicitud_id': solicitud.id
          });
        }

        reports.open({
          'jsp-source': 'solicitud_matricula_profesional.jasper',
          'jsp-format': 'PDF',
          'jsp-output-file': `Solicitud ${solicitud.numero}-${Date.now()}`,
          'jsp-only-gen': false,
          'solicitud_id': solicitud.id
        });

        if (this.id_creada) this.$router.replace('/solicitudes/lista');
      })
      .catch(e => console.error(e));
    },

    cancelarImpresion: function() {
      this.$router.replace('/solicitudes/lista');
    }
  }
}
</script>

<style scoped>
#info-profesional div {
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