<template>
  <v-container class="grey lighten-3" v-if="matricula">
    <datos-basicos :matricula="matricula">
    </datos-basicos>

    <br>

    <v-toolbar class="blue darken-3">
      <v-toolbar-title class="white--text">Legajo</v-toolbar-title>
    </v-toolbar>

    <v-layout row wrap>
      <v-flex xs12>
        <v-card class="ma-2 elevation-4">
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs3 class="ml-5">
                <v-select
                  label="Tipo:"
                  :items="tipos_legajos"
                  v-model="legajo.tipo"
                  :disabled="legajo.id > 0"
                >
                </v-select>
              </v-flex>

              <v-flex xs3 class="ml-5">
                  <v-text-field
                    label="N° Solicitud"
                    v-model="legajo.solicitud"
                    :disabled="legajo.id > 0"
                  >
                  </v-text-field>
              </v-flex>

              <v-flex xs3 class="ml-5">
                <input-fecha
                  label="Fecha"
                  v-model="legajo.fecha_solicitud"
                  :disabled="legajo.id > 0"
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
            <span class="subheading blue--text text--darken-4"><b>Comitente</b></span>
          </v-card-title>
          <v-card-text>
              <v-layout row wrap>
                <template v-if="legajo.comitente.tipo == 'empresa' || legajo.comitente.empresa.length">
                  <v-flex xs6>
                    <template v-if="!legajo.id">
                        <v-text-field
                          label="Empresa:"
                          v-model="legajo.comitente.empresa"
                          :disabled="legajo.id > 0"
                        >
                        </v-text-field>
                    </template>
                  </v-flex>
                </template>

                <template v-if="legajo.comitente.tipo == 'persona' || !legajo.comitente.empresa.length">
                  <v-flex xs5 class="ml-5">
                    <template>
                        <v-text-field
                          label="Apellido"
                          v-model="legajo.comitente.apellido"
                          :disabled="legajo.id > 0"
                        >
                        </v-text-field>
                    </template>
                  </v-flex>

                  <v-flex xs5 class="ml-5">
                      <v-text-field
                        label="Nombre"
                        v-model="legajo.comitente.nombres"
                        :disabled="legajo.id > 0"
                      >
                      </v-text-field>
                  </v-flex>
                </template>
              </v-layout>

              <v-layout row wrap
                class="mt-4"
                v-if="legajo.comitente.tipo == 'persona' || !legajo.comitente.empresa.length"
              >
                <v-flex xs5 class="ml-5">
                    <v-text-field
                      label="DNI"
                      v-model="legajo.comitente.numero_documento"
                      :disabled="legajo.id > 0"
                    >
                    </v-text-field>
                </v-flex>

                <v-flex xs5 class="ml-5">
                    <v-text-field
                      label="Telefono"
                      v-model="legajo.comitente.telefono"
                      :disabled="legajo.id > 0"
                    >
                    </v-text-field>
                </v-flex>
              </v-layout>

          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

      <v-flex xs12>
        <v-card class="ma-2 elevation-4">
          <v-card-title>
            <span class="subheading blue--text text--darken-4"><b>Ubicación del Trabajo</b></span>
          </v-card-title>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs12 class="mx-5">
                  <v-text-field
                    label="Nomenclatura"
                    v-model="legajo.nomenclatura"
                    :disabled="legajo.id > 0"
                  >
                  </v-text-field>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs6 class="ml-5">
                <v-select
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  :items="paises"
                  label="País"
                  @input="changePais"
                  v-model="legajo.domicilio.pais"
                >
                </v-select>

                <v-select
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  :items="departamentos"
                  label="Departamento"
                  @input="changeDepartamento"
                  v-model="legajo.domicilio.departamento"
                >
                </v-select>

                <v-text-field
                  label="Calle"
                  v-model="legajo.domicilio.calle"
                >
                </v-text-field>
              </v-flex>

              <v-flex xs6 class="mx-5">
                <v-select
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  :items="provincias"
                  label="Provincia"
                  @input="changeProvincia"
                  v-model="legajo.domicilio.provincia"
                >
                </v-select>

                <v-select
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  :items="localidades"
                  label="Localidad"
                  v-model="legajo.domicilio.localidad"
                >
                </v-select>

                <v-text-field
                  label="N°"
                  v-model="legajo.domicilio.numero"
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
                    label="Subcategoría"
                    :items="subcategorias"
                    item-text="descripcion"
                    item-value="id"
                    v-model="legajo.subcategoria"
                    :disabled="legajo.id > 0"
                    @input="chgSubcategoria"
                  >
                  </v-select>
                </v-flex>
            </v-layout>

            <v-layout row wrap class="mt-3" v-if="!legajo.id">
              <v-flex xs4 class="ml-4">
                <typeahead
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
                  label="Valor"
                  :items="items_valores_predeterminados"
                  v-model="nuevo_item.valor"
                  item_text="valor"
                  item_value="valor"
                >
                </typeahead>
              </v-flex>

              <v-flex xs3 class="mx-3">
                <v-btn light @click="addItem">
                  Agregar
                </v-btn>
              </v-flex>
            </v-layout>

            <v-layout row wrap class="mt-3">
              <v-flex xs12>
                <v-data-table
                    :headers="headers_items"
                    :items="legajo.items"
                    class="elevation-4"
                    no-data-text=""
                >
                  <template slot="headers" scope="props">
                    <th v-for="header of props.headers" class="pa-3 text-xs-left">
                      <b>{{ header.text }}</b>
                    </th>
                  </template>
                  <template slot="items" scope="props">
                    <tr>
                      <template v-if="!legajo.id">
                        <td>{{ props.item.descripcion.length ? props.item.descripcion : props.item.id  }}</td>
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
          </v-card-title>>
          <v-card-text>
            <v-layout row wrap>
              <v-flex xs3 class="ml-5">
                <input-fecha
                  label="Plazo Cumplimiento"
                  :disabled="legajo.id > 0"
                  v-model="legajo.plazo_cumplimiento"
                >
                </input-fecha>
              </v-flex>

              <v-flex xs3 class="ml-5">
                <v-text-field
                  label="Honorarios Presupuestados"
                  type="number"
                  v-model="legajo.honorarios_presupuestados"
                  :disabled="legajo.id > 0"
                >
                </v-text-field>
              </v-flex>

              <v-flex xs3 class="ml-5">
                <v-text-field
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
                  <v-text-field
                    label="Honorarios Reales"
                    type="number"
                    v-model="legajo.honorarios_reales"
                    :disabled="legajo.id > 0"
                  >
                  </v-text-field>

                  <v-checkbox
                    label="Tarea Pública"
                    v-model="legajo.tarea_publica"
                    :disabled="legajo.id > 0"
                  >
                  </v-checkbox>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <input-fecha
                    label="Finalización Tarea"
                    :disabled="legajo.id > 0"
                    v-model="legajo.finalizacion_tarea"
                  >
                  </input-fecha>

                  <v-checkbox
                    label="Relación de Dependencia"
                    v-model="legajo.dependencia"
                    :disabled="legajo.id > 0"
                  >
                  </v-checkbox>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <v-text-field
                    label="Porcentaje Cumplimiento"
                    v-model="legajo.porcentaje_cumplimiento"
                    type="number"
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
              <span class="subheading blue--text text--darken-4"><b>Aportes</b></span>
            </v-card-title>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs3 class="ml-5">
                  <v-text-field
                    label="Aporte Neto"
                    type="number"
                    v-model="legajo.aporte_neto"
                    :disabled="legajo.id > 0"
                  >
                  </v-text-field>

                  <v-text-field
                    label="Cantidad de Planos"
                    type="number"
                    v-model="legajo.cantidad_planos"
                    :disabled="legajo.id > 0"
                  >
                  </v-text-field>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <v-text-field
                    label="Aporte Bruto"
                    type="number"
                    v-model="legajo.aporte_bruto"
                    :disabled="legajo.id > 0"
                  >
                  </v-text-field>
                </v-flex>

                <v-flex xs3 class="ml-5">
                  <v-text-field
                    label="Aporte Neto Bonificación"
                    type="number"
                    v-model="legajo.aporte_neto_bonificacion"
                    :disabled="legajo.id > 0"
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row wrap>
                <v-flex xs12 class="mx-5">
                  <v-text-field
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



  </v-container>
</template>

<script>
import axios from '@/axios'
import { Header, Domicilio } from '@/model'
import InputFecha from '@/components/base/InputFecha'
import Typeahead from '@/components/base/Typeahead'
import DatosBasicos from '@/components/matriculas/DatosBasicos'

const tipos = [
  Header('Permiso de Construcción', 1),
  Header('Orden de Trabajo', 2),
  Header('Legajo Técnico', 3)
]

const headers_items = [
  Header('Descripción', 'descripcion'),
  Header('Valor', 'valor')
]

const Item = () => ({
  id: '',
  descripcion: '',
  valor: ''
})

const Comitente = () => ({
  apellido: '',
  empresa: '',
  nombres: '',
  numero_documento: '',
  telefono: '',
  tipo: ''
})

const Legajo = (matricula) => ({
  matricula,
  aporte_bruto: '',
  aporte_neto: '',
  cantidad_planos: '',
  comitente: Comitente(),
  domicilio: new Domicilio(),
  delegacion: 1,    //DELEGACION NEUQUEN, CAMBIAR A LA DELEGACION DONDE SE LOGUEA
  dependencia: false,
  fecha_solicitud: '',
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
  tipo: ''
})

export default {
  name: 'Legajo',
  props: ['id_legajo', 'id_matricula'],

  data () {
    return {
      legajo: Legajo(),
      matricula: null,
      categorias: [],
      paises: [],
      provincias: [],
      departamentos: [],
      localidades: [],
      categoria_selected: '',
      items_predeterminados: [],
      items_valores_predeterminados: [],
      nuevo_item: Item()
    }
  },

  computed: {
    tipos_legajos: function() {
      return tipos;
    },

    headers_items: function() {
      return headers_items;
    },

    subcategorias: function() {
      let categoria = this.categorias.find(c => c.id == this.categoria_selected);
      return categoria ? categoria.subcategorias : [];
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
                  this.legajo.comitente.tipo = '';
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

    addItem: function() {
      if (typeof this.nuevo_item.id == 'number') {
        this.nuevo_item.descripcion = this.items_predeterminados.find(i => i.id == this.nuevo_item.id).descripcion;
      }
      this.legajo.items.push(this.nuevo_item);
      this.nuevo_item = Item();
    },
  },

  components: {
    InputFecha,
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
