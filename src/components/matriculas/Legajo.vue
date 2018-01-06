<template>
  <v-container class="grey lighten-3" v-if="matricula">
    <datos-basicos :matricula="matricula">
    </datos-basicos>

    <br>

    <v-toolbar class="blue darken-3">
      <v-toolbar-title class="white--text">Legajo</v-toolbar-title>
    </v-toolbar>

    <v-layout row>
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
                  :rules="validator.fecha"
                >
                </input-fecha>
              </v-flex>
            </v-layout>


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
              <v-layout row>
                  <v-flex xs3 class="mx-4">
                    <v-select
                      label="Tipo"
                      :items="tipo_persona"
                      v-model="nuevo_comitente.persona.tipo"
                      @input="chgTipoComitente"
                    ></v-select>

                    <v-text-field
                      label="CUIT/CUIL"
                      v-model="nuevo_comitente.persona.cuit"
                      :rules="submit_comitente ? validator.comitente.cuit : []"
                      :error="submit_comitente && !validControl(validator.comitente.cuit, nuevo_comitente.persona.cuit)"
                      @input="chgCuitComitente"
                    >
                    </v-text-field>

                    <v-text-field
                      label="Telefono"
                      v-model="nuevo_comitente.persona.telefono"
                    >
                    </v-text-field>

                    <v-text-field
                      label="Porcentaje"
                      v-model="nuevo_comitente.porcentaje"
                    ></v-text-field>

                    <v-btn @click="addComitente">
                      Agregar
                    </v-btn>
                </v-flex>

                <v-flex xs3>
                  <v-text-field
                    label="Nombre"
                    v-model="nuevo_comitente.persona.nombre"
                    :rules="submit_comitente ? validator.comitente.nombre : []"
                    :error="submit_comitente && !validControl(validator.comitente.nombre, nuevo_comitente.persona.nombre)"
                  >
                  </v-text-field>

                  <template v-if="nuevo_comitente.persona.tipo == 'fisica'">
                      <v-text-field
                        label="Apellido"
                        v-model="nuevo_comitente.persona.apellido"
                        :rules="submit_comitente ? validator.comitente.apellido : []"
                        :error="submit_comitente && !validControl(validator.comitente.apellido, nuevo_comitente.persona.apellido)"
                      >
                      </v-text-field>

                    <v-text-field
                      label="DNI"
                      v-model="nuevo_comitente.persona.dni"
                      :rules="submit_comitente ? validator.comitente.dni : []"
                      :error="submit_comitente && !validControl(validator.comitente.dni, nuevo_comitente.persona.dni)"
                    ></v-text-field>
                  </template>
                </v-flex>


              <v-flex xs5 class="mx-4">
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
                      <td>{{ props.item.porcentaje }}</td>
                      <td>
                        <v-btn fab small @click="rmComitente(props.item.persona.cuit)">
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
      </v-flex>
    </v-layout>

    <v-layout>
      <v-flex xs12>
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
                    :rules="validator.nomenclatura"
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
                  label="Calle"
                  v-model="legajo.domicilio.calle"
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

                <v-text-field
                  tabindex="14"
                  label="N°"
                  v-model="legajo.domicilio.numero"
                  :disabled="legajo.id > 0"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>


    <v-layout row wrap>
      <v-flex xs12>
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
                    :rules="validator.subcategoria"
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
                  v-model="nuevo_item.id"
                  item_text="descripcion"
                  item_value="id"
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
                  item_text="valor"
                  item_value="valor"
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
                      <template v-if="!legajo.id">
                        <td>{{ props.item.descripcion }}</td>
                        <td>{{ props.item.valor }}</td>
                      </template>
                      <template v-if="legajo.id > 0">
                        <td>{{ props.item.item.descripcion }}</td>
                        <td>{{ props.item.valor }}</td>
                      </template>
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
                  ></input-numero>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>


      <v-layout row wrap>
        <v-flex xs12>
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
                    v-model="legajo.aporte_neto"
                    :disabled="legajo.id > 0"
                    :rules="validator.aporte_neto"
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
                    v-model="legajo.aporte_bruto"
                    :disabled="legajo.id > 0"
                  ></input-numero>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <input-numero
                    tabindex="31"
                    label="Aporte Neto Bonificación"
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
        </v-flex>
      </v-layout>
    </template>

    <v-btn
      class="green darken-1 white--text right"
      @click.native="submit"
      :disabled="!valid_form"
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
import rules from '@/rules'
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
    Header('Descripción', 'descripcion'),
    Header('Valor', 'valor')
  ],

  comitentes: [
    Header('CUIT/CUIL', 'cuit'),
    Header('Nombre', 'nombre'),
    Header('%', 'porcentaje')
  ]
}

const Item = () => ({
  id: '',
  descripcion: '',
  valor: ''
})



const Legajo = (matricula) => ({
  matricula,
  comitentes: [],
  aporte_bruto: null,
  aporte_neto: null,
  aporte_neto_bonificacion: null,
  cantidad_planos: null,
  domicilio: new Domicilio(),
  delegacion: null,
  dependencia: false,
  fecha_solicitud: null,
  finalizacion_tarea: null,
  forma_pago: '',
  honorarios_presupuestados: null,
  honorarios_reales: null,
  informacion_adicional: '',
  items: [],
  nomenclatura: '',
  observaciones: '',
  plazo_cumplimiento: null,
  porcentaje_cumplimiento: null,
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
      matricula: null,
      categorias: [],
      paises: [],
      provincias: [],
      departamentos: [],
      localidades: [],
      nuevo_comitente: new Comitente('fisica'),
      submit_comitente: false,
      categoria_selected: '',
      items_predeterminados: [],
      items_valores_predeterminados: [],
      nuevo_item: Item(),
      validator: {
        fecha: [ rules.required, rules.fecha ],
        nomenclatura: [ rules.required ],
        aporte_neto: [ rules.required ],
        subcategoria: [ rules.required ],
        comitente: {
          cuit: [ rules.required ],
          nombre: [ rules.required ],
          apellido: [ rules.required ],
          dni: [ rules.required ]
        }
      },
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

    valid_form: function() {
      return this.validControl(this.validator.fecha, this.legajo.fecha_solicitud)
        && this.validControl(this.validator.nomenclatura, this.legajo.nomenclatura)
        && this.validControl(this.validator.subcategoria, this.legajo.subcategoria)
        && (this.legajo.tipo !=3 || this.validControl(this.validator.aporte_neto, this.legajo.aporte_neto));
    },

    valid_comitente: function() {
      if (this.nuevo_comitente.persona.tipo == 'juridica') {
        return this.validControl(this.validator.comitente.cuit, this.nuevo_comitente.persona.cuit)
          && this.validControl(this.validator.comitente.nombre, this.nuevo_comitente.persona.nombre)
      }
      else {
        return this.validControl(this.validator.comitente.cuit, this.nuevo_comitente.persona.cuit)
          && this.validControl(this.validator.comitente.nombre, this.nuevo_comitente.persona.nombre)        
          && this.validControl(this.validator.comitente.apellido, this.nuevo_comitente.persona.apellido)        
          && this.validControl(this.validator.comitente.dni, this.nuevo_comitente.persona.dni)        
      }
    }
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
      else return axios.get(`/matriculas/${this.id_matricula}`);
    })
    .then(r => {
        this.matricula = r.data;
    })
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
      if (typeof this.nuevo_item.id == 'number') {
        axios.get(`/tareas/items/${this.nuevo_item.id}/predeterminados`)
             .then(r => this.items_valores_predeterminados = r.data)
             .catch(e => console.error(e));
      }
    },

    chgTipoComitente: function() {
      if (this.nuevo_comitente.persona.tipo == 'fisica') this.nuevo_comitente = new Comitente('fisica');
      else this.nuevo_comitente = new Comitente('juridica');
    },

    chgCuitComitente: function() {
      axios.get(`/personas?cuit=${this.nuevo_comitente.persona.cuit}`)
      .then(r => {
        if (r.data.length == 1)  {
          this.nuevo_comitente.persona = r.data[0];
        }
      })
    },

    addComitente: function() {
      this.submit_comitente = true;
      if (this.valid_comitente) {
        this.legajo.comitentes.push(this.nuevo_comitente);
        this.submit_comitente = false;
        this.chgTipoComitente();
      }
    },

    rmComitente: function(cuit) {
      this.legajo.comitentes = this.legajo.comitentes.filter(c => c.cuit != cuit);
    },

    addItem: function() {
      if (typeof this.nuevo_item.id == 'number') {
        this.nuevo_item.descripcion = this.items_predeterminados.find(i => i.id == this.nuevo_item.id).descripcion;
      }
      else this.nuevo_item.descripcion = this.nuevo_item.id;
      this.legajo.items.push(this.nuevo_item);
      this.nuevo_item = Item();
    },

    submit: function() {
      this.legajo.operador = this.user.id;
      this.legajo.delegacion = this.global_state.delegacion;
      console.log(this.legajo)

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
