<template>
  <v-container class="grey lighten-3" v-if="matricula">
    <datos-basicos :matricula="matricula">
    </datos-basicos>

    <br>

    <v-toolbar class="blue darken-3">
      <v-toolbar-title class="white--text">Legajo</v-toolbar-title>
    </v-toolbar>

    <v-layout row v-if="legajo.id">
      <v-flex xs12>
        <v-btn
          class="blue darken-1 white--text right"
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
            <v-form v-model="valid.basicos">

            <v-layout row wrap>
              <v-flex xs3 class="ml-5">
                <v-select
                  tabindex="1"
                  label="Tipo:"
                  :items="tipos_legajos"
                  v-model="legajo.tipo"
                  :disabled="legajo.id > 0"
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
                  :disabled="legajo.id > 0"
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

              <v-layout row v-if="!legajo.id">
                  <v-flex xs6 class="mx-4">
                    <v-select
                      label="Tipo"
                      :items="tipo_persona"
                      v-model="nuevo_comitente.persona.tipo"
                      :rules="[rules.required]"
                      @input="chgTipoComitente"
                    ></v-select>

                    <v-text-field
                      label="CUIT/CUIL"
                      v-model="nuevo_comitente.persona.cuit"
                      @input="chgCuitComitente"
                    >
                    </v-text-field>

                    <v-text-field
                      v-if="nuevo_comitente.persona.tipo == 'fisica'"
                      label="DNI"
                      v-model="nuevo_comitente.persona.dni"
                      :rules="[rules.required, rules.integer]"
                      @input="chgDni"
                    ></v-text-field>                    

                    <input-numero
                      label="Porcentaje"
                      decimal
                      v-model="nuevo_comitente.porcentaje"
                      :rules="[rules.required]"
                    ></input-numero>
                </v-flex>

                <v-flex xs6>
                  <v-text-field
                    label="Nombre"
                    v-model="nuevo_comitente.persona.nombre"
                    :rules="[rules.required]"
                  >
                  </v-text-field>

                      <v-text-field
                        v-if="nuevo_comitente.persona.tipo == 'fisica'"
                        label="Apellido"
                        v-model="nuevo_comitente.persona.apellido"
                        :rules="[rules.required]"
                      >
                      </v-text-field>

                    <v-text-field
                      label="Telefono"
                      v-model="nuevo_comitente.persona.telefono"
                    >
                    </v-text-field>


                  <v-btn @click="addComitente">
                    Agregar
                  </v-btn>                  
                </v-flex>
            </v-layout>

            </v-form>


            <v-layout row class="mt-4">
              <v-flex xs12 class="mx-4">
                <v-data-table
                    :headers="headers.comitentes"
                    :items="legajo.comitentes"
                    class="elevation-4"
                    no-data-text="No hay comitentes"
                    hide-actions
                >
                  <template slot="headers" slot-scope="props">
                    <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
                      <b>{{ header.text }}</b>
                    </th>
                    <th></th>
                  </template>
                  <template slot="items" slot-scope="props">
                    <tr>
                      <td>{{ props.item.persona.cuit }}</td>
                      <td>{{ props.item.persona.nombre }}</td>
                      <td>{{ props.item.persona.apellido ? props.item.persona.apellido : '' }}</td>
                      <td>{{ props.item.persona.dni ? props.item.persona.dni : '' }}</td>
                      <td>{{ props.item.porcentaje }}</td>
                      <td>
                        <v-btn fab small @click="rmComitente(props.index)">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                  </template>
                </v-data-table>

                <br>

                <v-alert color="error" icon="priority_high" :value="!this.legajo.id && !valid_comitentes">
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
            <v-layout row wrap>
              <v-flex xs12 class="mx-5">
                  <v-text-field
                    tabindex="8"
                    label="Nomenclatura"
                    v-model="legajo.nomenclatura"
                    :disabled="legajo.id > 0"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs6 class="ml-5">
                <v-select
                  tabindex="9"
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  :items="paises"
                  label="País"
                  @input="changePais"
                  v-model="legajo.domicilio.pais"
                  :disabled="legajo.id > 0"
                >
                </v-select>

                <v-select
                  tabindex="11"
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  :items="departamentos"
                  label="Departamento"
                  @input="changeDepartamento"
                  v-model="legajo.domicilio.departamento"
                  :disabled="legajo.id > 0"
                >
                </v-select>

                <v-text-field
                  tabindex="13"
                  label="Dirección"
                  v-model="legajo.domicilio.direccion"
                  :disabled="legajo.id > 0"
                >
                </v-text-field>
              </v-flex>

              <v-flex xs6 class="mx-5">
                <v-select
                  tabindex="10"
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  :items="provincias"
                  label="Provincia"
                  @input="changeProvincia"
                  v-model="legajo.domicilio.provincia"
                  :disabled="legajo.id > 0"
                >
                </v-select>

                <v-select
                  tabindex="12"
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  :items="localidades"
                  label="Localidad"
                  v-model="legajo.domicilio.localidad"
                  :disabled="legajo.id > 0"
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
                    tabindex="15"
                    label="Categoría"
                    :items="categorias"
                    item-text="descripcion"
                    item-value="id"
                    v-model="categoria_selected"
                    :disabled="legajo.id > 0"
                  >
                  </v-select>
                </v-flex>

                <v-flex xs3 class="ml-4">
                  <v-select
                    tabindex="16"
                    label="Subcategoría"
                    :items="subcategorias"
                    item-text="descripcion"
                    item-value="id"
                    v-model="legajo.subcategoria"
                    :disabled="legajo.id > 0"
                    @input="chgSubcategoria"
                    :rules="[rules.required]"
                  >
                  </v-select>
                </v-flex>
            </v-layout>

            <v-layout row wrap class="mt-3" v-if="!legajo.id">
              <v-flex xs4 class="ml-4">
                <typeahead
                  tabindex="17"
                  label="Item"
                  :items="items_predeterminados"
                  v-model="nuevo_item.item"
                  item-text="descripcion"
                  item-value="id"
                  @change="chgItemPredeterminado"
                >
                </typeahead>
              </v-flex>

              <v-flex xs4 class="ml-4">
                <typeahead
                  tabindex="18"
                  label="Valor"
                  :items="items_valores_predeterminados"
                  v-model="nuevo_item.valor"
                  item-text="valor"
                  item-value="valor"
                >
                </typeahead>
              </v-flex>

              <v-flex xs3 class="mx-3">
                <v-btn
                  tabindex="19"
                  light
                  @click="addItem"
                >
                  Agregar
                </v-btn>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="mt-3">
              <v-flex xs12>
                <v-data-table
                    :headers="headers.items"
                    :items="legajo.items"
                    class="elevation-4"
                    no-data-text="No hay items"
                    hide-actions
                >
                  <template slot="headers" slot-scope="props">
                    <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
                      <b>{{ header.text }}</b>
                    </th>
                  </template>
                  <template slot="items" slot-scope="props">
                    <tr>
                      <td>{{ getDescItem(props.item.item) }}</td>
                      <td>{{ props.item.valor }}</td>
                      <td>
                        <v-btn fab small @click="removeItem(props.index)">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </td>                      
                    </tr>
                  </template>
                </v-data-table>
              </v-flex>
            </v-layout>

            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                  tabindex="20"
                  label="Información Adicional"
                  v-model="legajo.informacion_adicional"
                  textarea
                  rows="3"
                  :disabled="legajo.id > 0"
                >
                </v-text-field>
              </v-flex>
            </v-layout>


          </v-card-text>
        </v-card>

        </v-form>
      </v-flex>
    </v-layout>


    <v-layout row wrap v-if="legajo.tipo == 2">
      <v-flex xs12>
        <v-card class="ma-2 elevation-4">
          <v-card-title>
            <span class="subheading blue--text text--darken-4"><b>Honorarios</b></span>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs3 class="ml-5">
                <input-fecha
                  tabindex="21"
                  label="Plazo Cumplimiento"
                  :disabled="legajo.id > 0"
                  v-model="legajo.plazo_cumplimiento"
                >
                </input-fecha>
              </v-flex>

              <v-flex xs3 class="ml-5">
                <input-numero
                  tabindex="22"
                  label="Honorarios Presupuestados"
                  v-model="legajo.honorarios_presupuestados"
                  :disabled="legajo.id > 0"
                  decimal
                ></input-numero>                
              </v-flex>

              <v-flex xs3 class="ml-5">
                <v-text-field
                  tabindex="23"
                  label="Forma de Pago"
                  v-model="legajo.forma_pago"
                  :disabled="legajo.id > 0"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>


    <template v-if="legajo.tipo == 3">
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
                    tabindex="24"
                    label="Honorarios Reales"
                    v-model="legajo.honorarios_reales"
                    :disabled="legajo.id > 0"
                    decimal
                  ></input-numero>

                  <v-checkbox
                    tabindex="27"
                    label="Tarea Pública"
                    v-model="legajo.tarea_publica"
                    :disabled="legajo.id > 0"
                  >
                  </v-checkbox>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <input-fecha
                    tabindex="25"
                    label="Finalización Tarea"
                    :disabled="legajo.id > 0"
                    v-model="legajo.finalizacion_tarea"
                  >
                  </input-fecha>

                  <v-checkbox
                    tabindex="28"
                    label="Relación de Dependencia"
                    v-model="legajo.dependencia"
                    :disabled="legajo.id > 0"
                  >
                  </v-checkbox>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <input-numero
                    tabindex="26"
                    label="Porcentaje Cumplimiento"
                    v-model="legajo.porcentaje_cumplimiento"
                    :disabled="legajo.id > 0"
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
                    tabindex="29"
                    label="Aporte Neto"
                    decimal
                    v-model="legajo.aporte_neto"
                    :disabled="legajo.id > 0"
                    :rules="[rules.required]"
                  ></input-numero>

                  <input-numero
                    tabindex="32"
                    label="Cantidad de Planos"
                    v-model="legajo.cantidad_planos"
                    :disabled="legajo.id > 0"
                  ></input-numero>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <input-numero
                    tabindex="30"
                    label="Aporte Bruto"
                    decimal
                    v-model="legajo.aporte_bruto"
                    :disabled="legajo.id > 0"
                  ></input-numero>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <input-numero
                    tabindex="31"
                    label="Aporte Neto Bonificación"
                    decimal
                    v-model="legajo.aporte_neto_bonificacion"
                    :disabled="legajo.id > 0"
                  ></input-numero>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12 class="mx-5">
                  <v-text-field
                    tabindex="33"
                    label="Observaciones"
                    v-model="legajo.observaciones"
                    textarea
                    rows="3"
                    :disabled="legajo.id > 0"
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
      :disabled="!valid_form || legajo.id > 0"
      tabindex="34"
    >
      Guardar Legajo
      <v-icon dark right>check_circle</v-icon>
    </v-btn>
    <br>

  </v-container>
</template>

<script>
import axios from '@/axios'
import * as moment from 'moment'
import { Header, Domicilio, Comitente } from '@/model'
import InputFecha from '@/components/base/InputFecha'
import InputNumero from '@/components/base/InputNumero'
import Typeahead from '@/components/base/Typeahead'
import DatosBasicos from '@/components/matriculas/DatosBasicos'
import ValidatorMixin from '@/components/mixins/ValidatorMixin'
import { impresionLegajo } from '@/utils/PDFUtils'
import { getTipoLegajo } from '@/utils/legajo'

const tipos = [
  Header('Permiso de Construcción', 1),
  Header('Orden de Trabajo', 2),
  Header('Legajo Técnico', 3)
]

const tipo_persona = [
  Header('Física', 'fisica'),
  Header('Jurídica', 'juridica')
]

const headers = {
  items: [
    Header('Descripción', 'descripcion', false),
    Header('Valor', 'valor', false)
  ],

  comitentes: [
    Header('CUIT/CUIL', 'cuit', false),
    Header('Nombre', 'nombre', false),
    Header('Apellido', 'apellido', false),
    Header('DNI', 'dni', false),
    Header('%', 'porcentaje', false)
  ]
}


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
  observaciones: '',
  plazo_cumplimiento: '',
  porcentaje_cumplimiento: '',
  subcategoria: '',
  tarea_publica: false,
  tipo: 1
})

export default {
  name: 'Legajo',
  props: ['id_legajo', 'id_matricula'],
  mixins: [ValidatorMixin],

  data () {
    return {
      legajo: Legajo(),
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
      nuevo_item: LegajoItem()
    }
  },

  computed: {
    tipos_legajos: function() {
      return tipos;
    },

    tipo_persona: function() {
      return tipo_persona;
    },

    headers: function() {
      return headers;
    },

    subcategorias: function() {
      let categoria = this.categorias.find(c => c.id == this.categoria_selected);
      return categoria ? categoria.subcategorias : [];
    },

    suma_comitentes: function() {
      if (!this.legajo.comitentes.length) return 0;
      return this.legajo.comitentes.reduce((prev, act) => prev + +act.porcentaje, 0);
    },    

    valid_comitentes: function() {
      return this.suma_comitentes === 100;   
    },

    valid_form: function() {
      return this.valid.basicos && this.valid_comitentes && this.valid.ubicacion && this.valid.tareas
        && (this.legajo.tipo !=3 || this.valid.aportes);
    },    
  },

  created: function() {
    Promise.all([
      axios.get('/paises'),
      axios.get('/tareas/categorias')
    ])
    .then(r => {
      this.paises = r[0].data;
      this.categorias = r[1].data;
      if (this.id_legajo) {
        return axios.get(`/legajos/${this.id_legajo}`)
              .then(r => {
                  this.legajo = r.data;
                  if (this.legajo.domicilio) {
                    this.paises = [this.legajo.domicilio.pais];
                    this.provincias = [this.legajo.domicilio.provincia];
                    this.departamentos = [this.legajo.domicilio.departamento];
                    this.localidades = [this.legajo.domicilio.localidad];
                  }
                  else this.legajo.domicilio = new Domicilio();

                  this.categoria_selected = this.categorias.find(c => c.subcategorias.find(s => s.id == this.legajo.subcategoria)).id;
                  return axios.get(`/matriculas/${this.legajo.matricula}`);
              })
      }
      else { 
        this.changePais();
        this.changeProvincia();        
        return axios.get(`/matriculas/${this.id_matricula}`);
      }
    })
    .then(r => this.matricula = r.data)
    .catch(e => console.error(e))
  },

  methods: {
    changePais: function() {
      axios.get(`/provincias?pais_id=${this.legajo.domicilio.pais}`)
             .then(r => this.provincias = r.data)
             .catch(e => console.error(e));
           },

    changeProvincia: function() {
        axios.get(`/departamentos?provincia_id=${this.legajo.domicilio.provincia}`)
             .then(r => this.departamentos = r.data)
             .catch(e => console.error(e));
    },

    changeDepartamento: function() {
        axios.get(`/localidades?departamento_id=${this.legajo.domicilio.departamento}`)
             .then(r => this.localidades = r.data)
             .catch(e => console.error(e));
    },

    chgSubcategoria: function() {
      axios.get(`/tareas/subcategorias/${this.legajo.subcategoria}/items`)
           .then(r => this.items_predeterminados = r.data)
           .catch(e => console.error(e));
    },

    chgItemPredeterminado: function() {
      this.items_valores_predeterminados = [];
      if (typeof this.nuevo_item.item == 'number') {
        axios.get(`/tareas/items/${this.nuevo_item.item}/predeterminados`)
             .then(r => this.items_valores_predeterminados = r.data)
             .catch(e => console.error(e));
      }
    },

    chgTipoComitente: function() {
      if (this.nuevo_comitente.persona.tipo == 'fisica') this.nuevo_comitente = new Comitente('fisica');
      else this.nuevo_comitente = new Comitente('juridica');
    },

    chgCuitComitente: function() {
      if (this.nuevo_comitente.persona.cuit && this.nuevo_comitente.persona.cuit.length) {
        axios.get(`/personas?cuit=${this.nuevo_comitente.persona.cuit}`)
        .then(r => {
          if (r.data.length == 1)  {
            this.nuevo_comitente.persona = r.data[0];
          }
        })
      }
    },

    chgDni: function() {
      if (this.nuevo_comitente.persona.tipo == 'fisica' && this.nuevo_comitente.persona.dni.length) {
        axios.get(`/personas?dni=${this.nuevo_comitente.persona.dni}`)
        .then(r => {
          if (r.data.length == 1)  {
            this.nuevo_comitente.persona = r.data[0];
          }
        })
      }
    },

    addComitente: function() {
      if (this.$refs.form_comitente.validate()) {
        this.legajo.comitentes.push(this.nuevo_comitente);
        this.chgTipoComitente();
        this.$refs.form_comitente.reset()
      }
    },

    rmComitente: function(index) {
      this.legajo.comitentes.splice(index, 1);
    },

    addItem: function() {
      if (typeof this.nuevo_item.item == 'string') {
        this.nuevo_item.item = {
          descripcion: this.nuevo_item.item 
        }
      };
      
      this.legajo.items.push(this.nuevo_item);
      this.nuevo_item = LegajoItem();
    },

    removeItem: function(index) {
      this.legajo.items.splice(index, 1);
    },

    getDescItem: function(item) {
      if (typeof item == 'number')
        return this.items_predeterminados.find(i => i.id == item).descripcion;
      else 
        return item.descripcion;
    },

    submit: function() {
      this.legajo.operador = this.user.id;
      this.legajo.delegacion = this.global_state.delegacion.id;

      axios.put(`/matriculas/${this.id_matricula}/legajos`, this.legajo)
           .then(r => {
             if (r.status != 201) {
               this.submitError();
             }
             this.global_state.snackbar.msg = 'Nuevo legajo creado exitosamente!';
             this.global_state.snackbar.color = 'success';
             this.global_state.snackbar.show = true;
             this.$router.go(-1);

           })
           .catch(e => this.submitError());
    },

    submitError: function() {
      this.global_state.snackbar.msg = 'Ha ocurrido un error en la carga';
      this.global_state.snackbar.color = 'error';
      this.global_state.snackbar.show = true;
    },

    imprimir: function() {
      let categoria = this.categorias.find(c => c.subcategorias.find(s => s.id == this.legajo.subcategoria))
      axios.get(`/legajos/${this.id_legajo}`)
      .then(r => {
        let legajo = r.data;
        let pdf = impresionLegajo(legajo, categoria);
        pdf.save(`${getTipoLegajo(legajo.tipo)} - N° ${legajo.numero_legajo}.pdf`)
      })
    }
  },

  components: {
    InputFecha,
    InputNumero,
    Typeahead,
    DatosBasicos
  }

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
