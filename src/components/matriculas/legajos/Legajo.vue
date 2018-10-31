<template>
  <v-container class="grey lighten-3" v-if="matricula">
  <v-dialog
    persistent
    fullscreen
    v-model="show_persona"
  >
    <persona-nueva 
        dialog
        :dni="nuevo_comitente.persona.dni"
        :cuit="nuevo_comitente.persona.cuit"
        :tipo="tipo_comitente"
        @cancelar="show_persona = false"
        @created="nuevaPersona"
    ></persona-nueva>
  </v-dialog>        

    <matricula-datos-basicos :matricula="matricula">
    </matricula-datos-basicos>

    <br>

    <v-toolbar class="darken-3" color="primary">
      <v-toolbar-title class="white--text">Legajo</v-toolbar-title>
    </v-toolbar>

    <v-layout row v-if="legajo.id && !edit">
      <v-flex xs12>
        <v-btn
          class="darken-1 white--text right" color="primary"
          @click.native="imprimir"
        >
          <v-icon dark left>print</v-icon>
          Imprimir
        </v-btn>
      </v-flex>
    </v-layout>
    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="ma-2 elevation-4">
          <v-card-text>
            <v-form ref="form_basico" v-model="valid.basicos">

            <v-layout row wrap>
              <v-flex xs3 class="ml-5">
                <v-select
                  tabindex="1"
                  label="Tipo:"
                  v-model="legajo.tipo"
                  :items="$options.tipos_legajo"
                  item-text="valor"
                  item-value="id"
                  :disabled="legajo.id > 0 && !this.edit"
                  return-object
                >
                </v-select>
              </v-flex>

              <v-flex xs3 class="ml-5" v-if="legajo.id > 0">
                  <v-text-field
                    label="N° Legajo"
                    v-model="legajo.numero_legajo"
                    disabled
                  >
                  </v-text-field>
              </v-flex>

              <v-flex xs3 class="ml-5">
                <input-fecha
                  tabindex="2"
                  label="Fecha"
                  v-model="legajo.fecha_solicitud"
                  :disabled="legajo.id > 0 && !this.edit"
                  :rules="[rules.required, rules.fecha]"
                >
                </input-fecha>
              </v-flex>
            </v-layout>

            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>


    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="ma-2 elevation-4">
          <v-card-title>
            <span class="subheading blue--text text--darken-4"><b>Comitentes</b></span>
          </v-card-title>
          <v-card-text>
              <v-form lazy-validation ref="form_comitente">

              <v-layout row v-if="!legajo.id || edit">
                  <v-flex xs6 class="mx-4">
                    <v-select
                      tabindex="3"
                      label="Tipo"
                      :items="tipo_persona"
                      :rules="[rules.required]"
                      v-model="tipo_comitente"
                      @change="chgTipoComitente"
                    ></v-select>

                  <v-text-field
                    disabled
                    label="Nombre"
                    v-model="nuevo_comitente.persona.nombre"
                    :rules="[rules.required]"
                  ></v-text-field>

                  <v-text-field
                    v-if="nuevo_comitente.persona.tipo == 'fisica'"
                    disabled
                    label="Apellido"
                    v-model="nuevo_comitente.persona.apellido"
                    :rules="[rules.required]"
                  ></v-text-field>

                  <input-numero
                    label="Porcentaje"
                    tabindex="9"
                    decimal
                    v-model="nuevo_comitente.porcentaje"
                    :rules="[rules.required]"
                  ></input-numero>
                </v-flex>

                <v-flex xs6>
                    <input-numero
                      v-if="nuevo_comitente.persona.tipo == 'fisica'"
                      tabindex="6"
                      label="Buscar DNI"
                      maxlength="8"
                      append-icon="search"
                      v-model="nuevo_comitente.persona.dni"
                      @change="chgDni"
                    ></input-numero>

                    <input-numero
                      tabindex="7"
                      maxlength="11"
                      :disabled="nuevo_comitente.persona.tipo == 'fisica'"
                      :label="nuevo_comitente.persona.tipo == 'fisica' ? 'CUIT/CUIL' : 'Buscar CUIT'"
                      :append-icon="nuevo_comitente.persona.tipo == 'fisica' ? '' : 'search'"
                      v-model="nuevo_comitente.persona.cuit"
                      @change="chgCuit"
                    ></input-numero>

                  <v-text-field
                    disabled
                    label="Telefono"
                    v-model="nuevo_comitente.persona.telefono"
                  ></v-text-field>
                </v-flex>
            </v-layout>

            <v-layout row v-if="!legajo.id || edit">
              <v-flex xs12>
                <v-btn class="right" @click="guardarComitente" tabindex="10">
                  {{ comitente_edit != null ? 'Guardar' : 'Agregar' }}
                </v-btn>
                <v-btn class="right" v-show="comitente_edit != null" @click="cancelarEditComitente">
                  Cancelar
                </v-btn>
              </v-flex>
            </v-layout>

            </v-form>


            <v-layout row class="mt-4">
              <v-flex xs12 class="mx-4">
                <v-data-table
                    :headers="$options.headers.comitentes"
                    :items="legajo.comitentes"
                    class="elevation-4"
                    no-data-text="No hay comitentes"
                    hide-actions
                >
                  <template slot="items" slot-scope="props">
                      <td class="justify-center layout px-0">
                        <template v-if="!legajo.id || edit">
                          <v-btn icon small class="mx-0" @click="rmComitente(props.index)">
                            <v-icon color="red">delete</v-icon>
                          </v-btn>
                          <v-btn icon small class="mx-4" @click="editComitente(props.index)">
                            <v-icon color="deep-purple">edit</v-icon>
                          </v-btn>
                        </template>
                      </td>
                      <td>{{ props.item.persona.cuit }}</td>
                      <td>{{ props.item.persona.nombre }}</td>
                      <td>{{ props.item.persona.apellido ? props.item.persona.apellido : '' }}</td>
                      <td>{{ props.item.persona.dni ? props.item.persona.dni : '' }}</td>
                      <td>{{ props.item.porcentaje }}</td>
                  </template>
                </v-data-table>

                <br>

                <v-alert color="error" icon="priority_high" :value="!valid_comitentes">
                  Los porcentajes deben sumar 100%
                </v-alert>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs12>
        <v-form ref="form_ubicacion" v-model="valid.ubicacion">
        <v-card class="ma-2 elevation-4">
          <v-card-title>
            <span class="subheading blue--text text--darken-4"><b>Ubicación del Trabajo</b></span>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap class="mx-5">
              <v-flex xs5 class="mr-5">
                  <v-text-field
                    tabindex="11"
                    label="Nomenclatura"
                    mask="##-##-###-####-####"
                    return-masked-value
                    v-model="legajo.nomenclatura"
                    :disabled="legajo.id > 0 && !this.edit"
                    :rules="[rules.required, rules.nomenclatura_catastral]"
                  ></v-text-field>
              </v-flex>

              <v-flex xs5 class="ml-4">
                  <v-text-field
                    tabindex="12"
                    maxlength="45"
                    label="N° Expediente Municipal"
                    v-model="legajo.expediente_municipal"
                    :disabled="legajo.id > 0 && !this.edit"
                  ></v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs6 class="ml-5">
                <v-select
                  tabindex="13"
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  :items="paises"
                  label="País"
                  v-model="legajo.domicilio.pais"
                  :disabled="legajo.id > 0 && !this.edit"
                  return-object
                  @input="changePais"
                >
                </v-select>

                <v-select
                  tabindex="14"
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  :items="departamentos"
                  label="Departamento"
                  @input="changeDepartamento"
                  v-model="legajo.domicilio.departamento"
                  return-object
                  :disabled="legajo.id > 0 && !this.edit"
                >
                </v-select>

                <v-text-field
                  tabindex="17"
                  label="Dirección"
                  v-model="legajo.domicilio.direccion"
                  :disabled="legajo.id > 0 && !this.edit"
                >
                </v-text-field>
              </v-flex>

              <v-flex xs6 class="mx-5">
                <v-select
                  tabindex="14"
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  :items="provincias"
                  label="Provincia"
                  @input="changeProvincia"
                  v-model="legajo.domicilio.provincia"
                  return-object
                  :disabled="legajo.id > 0 && !this.edit"
                >
                </v-select>

                <v-select
                  tabindex="16"
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  :items="localidades"
                  label="Localidad"
                  v-model="legajo.domicilio.localidad"
                  return-object
                  :disabled="legajo.id > 0 && !this.edit"
                >
                </v-select>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>

        </v-form>
      </v-flex>
    </v-layout>


    <v-layout row wrap>
      <v-flex xs12>
        <v-form ref="form_tareas" v-model="valid.tareas">

        <v-card class="ma-2 elevation-4">
          <v-card-title>
            <span class="subheading blue--text text--darken-4"><b>Tareas</b></span>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
                <v-flex xs3 class="ml-4">
                  <v-select
                    tabindex="18"
                    label="Categoría"
                    :items="categorias"
                    item-text="descripcion"
                    item-value="id"
                    v-model="categoria_selected"
                    :disabled="legajo.id > 0 && !this.edit"
                  >
                  </v-select>
                </v-flex>

                <v-flex xs3 class="ml-4">
                  <v-select
                    tabindex="18"
                    label="Subcategoría"
                    :items="subcategorias"
                    item-text="descripcion"
                    item-value="id"
                    v-model="legajo.subcategoria"
                    :disabled="legajo.id > 0 && !this.edit"
                    @input="chgSubcategoria"
                    :rules="[rules.required]"
                  >
                  </v-select>
                </v-flex>
            </v-layout>

            <v-layout row wrap class="mt-3" v-if="!legajo.id || edit">
              <v-flex xs3 class="ml-4">
                <typeahead
                  tabindex="19"
                  label="Item"
                  :items="items_predeterminados"
                  v-model="nuevo_item.item"
                  item-text="descripcion"
                  item-value="id"
                  @change="chgItemPredeterminado"
                >
                </typeahead>
              </v-flex>

              <v-flex xs3 class="ml-4">
                <typeahead
                  tabindex="20"
                  label="Valor"
                  :items="items_valores_predeterminados"
                  v-model="nuevo_item.valor"
                  item-text="valor"
                  item-value="valor"
                >
                </typeahead>
              </v-flex>

              <v-flex xs1 class="mx-3" v-show="tareaitem_edit != null">
                <v-btn
                  light
                  @click="cancelarEditTareaItem"
                >
                  Cancelar
                </v-btn>
              </v-flex>

              <v-flex xs2 class="mx-3">
                <v-btn
                  tabindex="21"
                  light
                  @click="guardarItem"
                  :disabled="item_invalid"
                >
                  {{ tareaitem_edit ? 'Guardar' : 'Agregar' }}
                </v-btn>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="mt-3">
              <v-flex xs12>
                <v-data-table
                    :headers="$options.headers.items"
                    :items="legajo.items"
                    class="elevation-4"
                    no-data-text="No hay items"
                    hide-actions
                >
                  <template slot="items" slot-scope="props">
                      <td class="justify-center layout px-0">
                        <template v-if="!legajo.id || edit">
                          <v-btn icon small class="mx-0" @click="removeItem(props.index)">
                            <v-icon color="red">delete</v-icon>
                          </v-btn>
                          <v-btn icon small class="mx-4" @click="editTareaItem(props.index)">
                            <v-icon color="deep-purple">edit</v-icon>
                          </v-btn>
                        </template>
                      </td>
                      <td>{{ getDescItem(props.item.item) }}</td>
                      <td>{{ props.item.valor }}</td>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  tabindex="22"
                  label="Información Adicional"
                  v-model="legajo.informacion_adicional"
                  textarea
                  rows="3"
                  :disabled="legajo.id > 0 && !this.edit"
                >
                </v-text-field>
              </v-flex>
            </v-layout>


          </v-card-text>
        </v-card>

        </v-form>
      </v-flex>
    </v-layout>


    <v-layout row wrap v-if="legajo.tipo.id == 2">
      <v-flex xs12>
        <v-card class="ma-2 elevation-4">
          <v-card-title>
            <span class="subheading blue--text text--darken-4"><b>Honorarios</b></span>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs3 class="ml-5">
                <input-fecha
                  tabindex="23"
                  label="Plazo Cumplimiento"
                  :disabled="legajo.id > 0 && !this.edit"
                  v-model="legajo.plazo_cumplimiento"
                >
                </input-fecha>
              </v-flex>

              <v-flex xs3 class="ml-5">
                <input-numero
                  tabindex="24"
                  label="Honorarios Presupuestados"
                  v-model="legajo.honorarios_presupuestados"
                  :disabled="legajo.id > 0 && !this.edit"
                  decimal
                ></input-numero>
              </v-flex>

              <v-flex xs3 class="ml-5">
                <v-text-field
                  tabindex="25"
                  label="Forma de Pago"
                  v-model="legajo.forma_pago"
                  :disabled="legajo.id > 0 && !this.edit"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>


    <template v-if="legajo.tipo.id == 3">
      <v-layout row wrap>
        <v-flex xs12>
          <v-card class="ma-2 elevation-4">
            <v-card-title>
              <span class="subheading blue--text text--darken-4"><b>Honorarios</b></span>
            </v-card-title>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs3 class="ml-5">
                  <input-numero
                    tabindex="26"
                    label="Honorarios"
                    v-model="legajo.honorarios_reales"
                    :disabled="legajo.id > 0 && !this.edit"
                    decimal
                  ></input-numero>

                  <v-checkbox
                    tabindex="29"
                    label="Tarea Pública"
                    v-model="legajo.tarea_publica"
                    :disabled="legajo.id > 0 && !this.edit"
                  >
                  </v-checkbox>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <input-fecha
                    tabindex="27"
                    label="Finalización Tarea"
                    :disabled="legajo.id > 0 && !this.edit"
                    v-model="legajo.finalizacion_tarea"
                  >
                  </input-fecha>

                  <v-checkbox
                    tabindex="30"
                    label="Relación de Dependencia"
                    v-model="legajo.dependencia"
                    :disabled="legajo.id > 0 && !this.edit"
                  >
                  </v-checkbox>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <input-numero
                    tabindex="28"
                    label="Porcentaje Cumplimiento"
                    v-model="legajo.porcentaje_cumplimiento"
                    :disabled="legajo.id > 0 && !this.edit"
                    decimal
                  ></input-numero>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>


      <v-layout row wrap>
        <v-flex xs12>
          <v-form ref="form_aportes" v-model="valid.aportes">

          <v-card class="ma-2 elevation-4">
            <v-card-title>
              <span class="subheading blue--text text--darken-4"><b>Aportes</b></span>
            </v-card-title>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs3 class="ml-5">
                  <input-numero
                    tabindex="31"
                    label="Aporte Neto"
                    decimal
                    v-model="legajo.aporte_neto"
                    :disabled="legajo.id > 0"
                    :rules="[rules.required]"
                  ></input-numero>

                  <input-numero
                    tabindex="34"
                    label="Cantidad de Planos"
                    v-model="legajo.cantidad_planos"
                    :disabled="legajo.id > 0 && !this.edit"
                  ></input-numero>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <input-numero
                    tabindex="32"
                    label="Aporte Bruto"
                    decimal
                    v-model="legajo.aporte_bruto"
                    :disabled="legajo.id > 0 && !this.edit"
                  ></input-numero>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <input-numero
                    tabindex="33"
                    label="Aporte Neto Bonificación"
                    decimal
                    v-model="legajo.aporte_neto_bonificacion"
                    :disabled="legajo.id > 0 && !this.edit"
                  ></input-numero>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12 class="mx-5">
                  <v-text-field
                    tabindex="35"
                    label="Observaciones"
                    v-model="legajo.observaciones"
                    textarea
                    rows="3"
                    :disabled="legajo.id > 0 && !this.edit"
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
          </v-form>
        </v-flex>
      </v-layout>
    </template>

    <v-btn
      class="green darken-1 white--text right"
      @click.native="submit"
      :disabled="(legajo.id > 0 && !edit) || submitted"
      :loading="submitted"
      tabindex="36"
    >
      Guardar Legajo
      <v-icon dark right>check_circle</v-icon>
    </v-btn>
    <br>

  </v-container>
</template>

<script>
import Vue from 'vue'
import api from '@/services/api'
import reports from '@/services/reports'
import moment from 'moment'
import { getFloat, clone } from '@/utils'
import rules from '@/validation/rules'
import { ColumnHeader, Domicilio, Comitente } from '@/model'
import { SelectItem } from '@/opciones'
import InputFecha from '@/components/base/InputFecha'
import InputNumero from '@/components/base/InputNumero'
import InputTexto from '@/components/base/InputTexto'
import Typeahead from '@/components/base/Typeahead'
import MatriculaDatosBasicos from '@/components/matriculas/MatriculaDatosBasicos'
import MixinValidator from '@/components/mixins/MixinValidator'
import MixinGlobalState from '@/components/mixins/MixinGlobalState'
import PersonaNueva from '@/components/personas/PersonaNueva'

const tipo_persona = [
  SelectItem('Física', 'fisica'),
  SelectItem('Jurídica', 'juridica')
]

const LegajoItem = () => ({
  item: '',
  valor: ''
})



const Legajo = (matricula) => ({
  matricula,
  comitentes: [],
  aporte_bruto: '',
  aporte_neto: '',
  aporte_neto_bonificacion: '',
  cantidad_planos: '',
  domicilio: new Domicilio(),
  delegacion: null,
  dependencia: false,
  fecha_solicitud: moment().format('DD/MM/YYYY'),
  finalizacion_tarea: '',
  forma_pago: '',
  honorarios_presupuestados: '',
  honorarios_reales: '',
  informacion_adicional: '',
  items: [],
  nomenclatura: '',
  expediente_municipal: '',
  observaciones: '',
  plazo_cumplimiento: '',
  porcentaje_cumplimiento: '',
  subcategoria: '',
  tarea_publica: false,
  tipo: 1
})

export default {

  name: 'Legajo',

  props: {
    id_legajo: [Number, String],
    id_matricula: [Number, String],
    edit: {
      type: Boolean,
      default: () => false
    }
  },

  mixins: [MixinGlobalState, MixinValidator],

  components: {
    PersonaNueva,
    InputTexto,
    InputFecha,
    InputNumero,
    Typeahead,
    MatriculaDatosBasicos
  },

  headers: {
    items: [
      ColumnHeader('', 'acciones'),
      ColumnHeader('Descripción', 'descripcion', false),
      ColumnHeader('Valor', 'valor', false)
    ],

    comitentes: [
      ColumnHeader('', 'acciones'),
      ColumnHeader('CUIT/CUIL', 'cuit', false),
      ColumnHeader('Nombre', 'nombre', false),
      ColumnHeader('Apellido', 'apellido', false),
      ColumnHeader('DNI', 'dni', false),
      ColumnHeader('%', 'porcentaje', false)
    ]
  },

  tipos_legajo: [
    { id: 1, valor: 'Permiso de Construcción'},
    { id: 2, valor: 'Orden de Trabajo'},
    { id: 3, valor: 'Legajo Técnico'}
  ],

  data () {
    return {
      legajo: Legajo(),
      tipo_comitente: 'fisica',
      valid: {
        basicos: false,
        ubicacion: false,
        tareas: false,
        aportes: false
      },
      matricula: null,
      categorias: [],
      paises: [],
      provincias: [],
      departamentos: [],
      localidades: [],
      nuevo_comitente: new Comitente('fisica'),
      categoria_selected: '',
      items_predeterminados: [],
      items_valores_predeterminados: [],
      nuevo_item: LegajoItem(),
      comitente_edit: null,
      tareaitem_edit: null,
      submitted: false,
      show_persona: false
    }
  },

  computed: {
    tipo_persona: function() {
      return tipo_persona;
    },

    subcategorias: function() {
      let categoria = this.categorias.find(c => c.id == this.categoria_selected);
      return categoria ? categoria.subcategorias : [];
    },

    suma_comitentes: function() {
      if (!this.legajo.comitentes.length) return 0;
      return this.legajo.comitentes.reduce((prev, act) => prev + getFloat(act.porcentaje), 0);
    },

    valid_comitentes: function() {
      return this.suma_comitentes === 100;
    },

    valid_form: function() {
      return this.valid.basicos && this.valid_comitentes && this.valid.ubicacion && this.valid.tareas
        && (this.legajo.tipo !=3 || this.valid.aportes);
    },

    item_item_invalid: function() {
      if (typeof this.nuevo_item.item == 'number') return false;
      return !this.nuevo_item.item.length;
    },

    item_valor_invalid: function() {
      if (typeof this.nuevo_item.valor == 'number') return false;
      return !this.nuevo_item.valor.length;
    },

    item_invalid: function() {
      return this.item_item_invalid || this.item_valor_invalid;
    }
  },

/*   watch: {
    '$route' (to, from) {
      this.$refs.form_ubicacion.reset();
    }
  },  */

  created: function() {
    Promise.all([
      api.get('/paises'),
      api.get('/tareas/categorias')
    ])
    .then(r => {
      this.paises = r[0].data;
      this.categorias = r[1].data;
      if (this.id_legajo) {
        return api.get(`/legajos/${this.id_legajo}`)
        .then(r => {
            this.legajo = r.data;
            this.legajo.fecha_solicitud = moment(this.legajo.fecha_solicitud, 'YYYY-MM-DD').format('DD/MM/YYYY');
            if (!this.legajo.domicilio) this.legajo.domicilio = new Domicilio();
            this.categoria_selected = this.categorias.find(c => c.subcategorias.find(s => s.id == this.legajo.subcategoria)).id;
            return Promise.resolve(this.legajo.matricula.id);
        })
      }
      else {
        this.legajo.domicilio.departamento = this.global_state.delegacion.domicilio.departamento.id;
        this.legajo.domicilio.localidad = this.global_state.delegacion.domicilio.localidad.id;
        return Promise.resolve(this.id_matricula);
      }
    })
    .then((id_matricula) => {
      this.changePais().then(() => this.changeProvincia()).then(() => this.changeDepartamento())
      .then(() => api.get(`/matriculas/${id_matricula}`))
      .then(r => this.matricula = r.data)
    })
    .catch(e => console.error(e))
  },

  methods: {
    changePais: function() {
      return api.get(`/provincias?pais_id=${this.legajo.domicilio.pais}`)
      .then(r => this.provincias = r.data)
      .catch(e => console.error(e));
    },

    changeProvincia: function() {
      return api.get(`/departamentos?provincia_id=${this.legajo.domicilio.provincia}`)
      .then(r => this.departamentos = r.data)
      .catch(e => console.error(e));
    },

    changeDepartamento: function() {
      return api.get(`/localidades?departamento_id=${this.legajo.domicilio.departamento}`)
      .then(r => this.localidades = r.data)
      .catch(e => console.error(e));
    },

    chgSubcategoria: function(e) {
      api.get(`/tareas/subcategorias/${this.legajo.subcategoria}/items`)
           .then(r => {
             this.items_predeterminados = r.data;
             let item = r.data.find(i => i.descripcion.indexOf('Superficie') != -1);
             if (item) this.nuevo_item.item = item.id;
             else this.nuevo_item.item = '';
           })
           .catch(e => console.error(e));
    },

    chgItemPredeterminado: function() {
      this.items_valores_predeterminados = [];
      if (typeof this.nuevo_item.item == 'number') {
        api.get(`/tareas/items/${this.nuevo_item.item}/predeterminados`)
             .then(r => this.items_valores_predeterminados = r.data)
             .catch(e => console.error(e));
      }
    },

    chgTipoComitente: function(e) {
      if (e) this.nuevo_comitente = new Comitente(e);
      else this.nuevo_comitente = new Comitente(e);
    },

    chgCuit: function() {
      if (this.tipo_comitente == 'juridica') {
        api.get(`/personas?tipo=juridica&cuit=${this.nuevo_comitente.persona.cuit}`)
        .then(r => {
          console.log(r.data)
          if (r.data.resultados.length > 0) {
            this.nuevo_comitente.persona = r.resultados.data[0];
          }
          else if (rules.cuit(this.nuevo_comitente.persona.cuit) === true) {
              if (confirm('No existe ninguna persona jurídica registrada con dicho cuit. Desea cargarla?')) {
                this.show_persona = true;
              }
          }
        })
      }
    },

    chgDni: function(e) {
      api.get(`/personas?tipo=fisica&dni=${this.nuevo_comitente.persona.dni}`)
      .then(r => {
        if (r.data.resultados.length > 0) {
            this.nuevo_comitente.persona = r.data.resultados[0];
        }
        else if (rules.dni(this.nuevo_comitente.persona.dni) === true) {
            if (confirm('No existe ninguna persona física registrada con dicho dni. Desea cargarla?')) {
              this.show_persona = true;
            }
        }
      })
    },

    guardarComitente: function() {
      if (this.$refs.form_comitente.validate()) {
        let buscar_com = this.legajo.comitentes.find(c => this.nuevo_comitente.persona.id === c.persona.id);

        if (!buscar_com || this.comitente_edit != null) {
          if (this.comitente_edit != null) {
            Vue.set(this.legajo.comitentes, this.comitente_edit, this.nuevo_comitente);
            this.comitente_edit = null;
          }
          else {
            this.legajo.comitentes.push(this.nuevo_comitente);
          }

          this.nuevo_comitente = new Comitente('fisica');
          this.$refs.form_comitente.reset();
        }
        else alert('Ya existe la misma persona en el listado!');
      }
    },

    rmComitente: function(index) {
      this.legajo.comitentes.splice(index, 1);
    },

    editComitente: function(index) {
      this.$refs.form_comitente.reset();
      this.comitente_edit = index;
      this.nuevo_comitente = clone(this.legajo.comitentes[index]);
      this.tipo_comitente = this.nuevo_comitente.persona.tipo;
    },

    cancelarEditComitente: function() {
      this.comitente_edit = null;
      this.nuevo_comitente = new Comitente('fisica');
      this.$refs.form_comitente.reset();
    },

    guardarItem: function() {
      if (typeof this.nuevo_item.item == 'string') {
        this.nuevo_item.item = {
          descripcion: this.nuevo_item.item
        }
      };

      if (this.tareaitem_edit != null) {
        Vue.set(this.legajo.items, this.tareaitem_edit, this.nuevo_item);
      }
      else this.legajo.items.push(this.nuevo_item);
      this.nuevo_item = LegajoItem();
    },

    removeItem: function(index) {
      this.legajo.items.splice(index, 1);
    },

    editTareaItem: function(index) {
      this.tareaitem_edit = index;
      this.nuevo_item = clone(this.legajo.items[index]);
      if (this.legajo.items[index].item.descripcion) this.nuevo_item.item = this.legajo.items[index].item.descripcion;
    },

    cancelarEditTareaItem: function() {
      this.tareaitem_edit = null;
      this.nuevo_item = LegajoItem();
    },

    getDescItem: function(item) {
      if (typeof item == 'number')
        return this.items_predeterminados.find(i => i.id == item).descripcion;
      else
        return item.descripcion;
    },

    prepare: function() {
      let legajo = clone(this.legajo);
      if (legajo.domicilio.localidad.id) legajo.domicilio.localidad = legajo.domicilio.localidad.id;
      legajo.delegacion = this.global_state.delegacion.id;
      legajo.tipo = legajo.tipo.id;
      legajo.aporte_bruto = getFloat(legajo.aporte_bruto);
      legajo.aporte_neto = getFloat(legajo.aporte_neto);
      legajo.aporte_neto_bonificacion = getFloat(legajo.aporte_neto_bonificacion);
      legajo.honorarios_presupuestados = getFloat(legajo.honorarios_presupuestados);
      legajo.honorarios_reales = getFloat(legajo.honorarios_reales);
      legajo.porcentaje_cumplimiento = getFloat(legajo.porcentaje_cumplimiento);
      legajo.items.forEach(i => {
        if (i.item.id) i.item = i.item.id;
      })
      legajo.comitentes.forEach(c => {
        c.persona = c.persona.id;
      })

      return legajo;
    },

    submit: function() {
      if (!this.$refs.form_basico.validate() || !this.$refs.form_ubicacion.validate()
        || !this.$refs.form_aportes.validate()) return alert('El formulario contiene errores. Por favor revisar');
      if (!this.valid_form) return alert('El formulario contiene errores. Por favor revisar');

      this.submitted = true;

      if (this.edit) {
        api.put(`/legajos/${this.legajo.id}`, this.prepare())
        .then(r => {
          this.snackOk('Legajo modificado exitosamente!');
          this.submitted = false;
          this.$router.go(-1);
        })
        .catch(e => {
          this.submitted = false;
          this.snackError(e);
        });
      }
      else {
        api.put(`/matriculas/${this.id_matricula}/legajos`, this.prepare())
        .then(r => {
          this.submitted = false;
          this.snackOk('Nuevo legajo creado exitosamente!');
          this.$router.go(-1);
        })
        .catch(e => {
          this.submitted = false;
          this.snackError(e);
        });
      }
    },

    nuevaPersona: function(persona) {
      this.nuevo_comitente.persona = persona;
      this.show_persona = false;
    },

    imprimir: function() {
      api.get(`/legajos/${this.id_legajo}`)
      .then(r => {
        reports.open({
          'jsp-source': 'legajos_tecnicos.jasper',
          'jsp-format': 'PDF',
          'jsp-output-file': `Legajo N° ${r.data.numero_legajo} - ${Date.now()}`,
          'jsp-only-gen': false,
          'legajo_id': r.data.id
        });
      })
    }
  },

}
</script>

<style>
input:disabled {
  color: rgb(58, 148, 209) !important;
}

.input-group:not(.input-group--error).input-group--disabled .input-group__selections__comma {
  color: rgb(58, 148, 209) !important;
}
</style>
