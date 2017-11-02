<template>
  <v-container>

    <v-layout row>
      <v-flex xs12>
        <!-- DATOS GENERALES -->
        <v-card v-if="matricula.entidad">
          <v-card-title>
            <span class="title ml-4">Datos Generales</span>
          </v-card-title>
          <v-card-text>
            <v-layout>
              <v-flex xs4 class="ma-4">
                <span class="body-2">Número de Matrícula:</span> {{ matricula.numeroMatricula }}
              </v-flex>
              <v-flex xs4 class="ma-4" v-show="matricula.entidad.tipo == 'profesional'">
                <span class="body-2">Apellido:</span>
                <span class="body-1">{{ matricula.entidad.apellido }}</span>
                <br><br>
                <span class="body-2">Nombre:</span>
                <span class="body-1">{{ matricula.entidad.nombre }}</span>
              </v-flex>
              <v-flex xs6 class="ma-4" v-show="matricula.entidad.tipo == 'empresa'">
                <span class="body-2">Nombre:</span>
                <span class="body-1">{{ matricula.entidad.nombre }}</span>
                <br><br>
                <span class="body-2">CUIT:</span>
                <span class="body-1">{{ matricula.entidad.cuit }}</span>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <br>

    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-layout>
              <v-flex xs6>
                <!-- DATOS DEL COMITENTE -->
                  <v-container fluid>
                    <span class="title">Datos del Comitente</span>
                    <v-layout class="mt-5">
                      <v-flex xs12>
                        <v-radio-group v-model="permiso.tipoComitente" row>
                          <v-radio label="Persona" value="persona" ></v-radio>
                          <v-radio label="Empresa" value="empresa"></v-radio>
                        </v-radio-group>
                      </v-flex>
                    </v-layout>
                    <v-layout v-show="permiso.tipoComitente == 'persona'">
                      <v-flex xs6 class="mr-5">
                        <v-text-field label="Nombre" tabindex="1">
                        </v-text-field>
                        <v-text-field label="Apellido" tabindex="2">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs6 class="mr-5">
                        <v-text-field label="DNI" tabindex="2">
                        </v-text-field>
                        <v-text-field label="Teléfono" tabindex="6">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout v-show="permiso.tipoComitente == 'empresa'">
                      <v-flex xs6 class="mr-5">
                        <v-text-field label="Nombre" tabindex="7">
                        </v-text-field>
                        <v-text-field label="Teléfono" tabindex="8">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs6 class="mr-5">
                        <v-text-field label="CUIT" tabindex="9">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
              </v-flex>

              <v-flex xs6>
                <!-- DATOS DE LA UBICACIÓN -->
                  <v-container fluid>
                    <span class="title">Ubicación</span>
                    <v-layout row class="mt-3">
                      <v-flex xs6>
                        <typeahead
                          tabindex="10"
                          option="true"
                          :items="paises"
                          label="País"
                          @change="changePais()"
                          v-model="permiso.pais"
                        >
                        </typeahead>
                        <typeahead
                          tabindex="12"
                          option="true"
                          :items="departamentos"
                          label="Departamento"
                          @change="changeDepartamento()"
                          v-model="permiso.departamento"
                        >
                        </typeahead>
                        </v-select>
                        <v-text-field
                          tabindex="14"
                          label="Calle"
                          v-model="permiso.calle"
                        >
                        </v-text-field>
                      </v-flex>

                      <v-flex xs6 class="ml-4">
                        <typeahead
                          tabindex="11"
                          option="true"
                          :items="provincias"
                          label="Provincia"
                          @change="changeProvincia()"
                          v-model="permiso.provincia"
                        >
                        </typeahead>
                        <typeahead
                          tabindex="13"
                          option="true"
                          :items="localidades"
                          label="Localidad"
                          v-model="permiso.localidad"
                        >
                        </typeahead>
                        <v-text-field
                          tabindex="15"
                          label="Nro"
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>

                    <v-layout row>
                      <v-text-field label="Nomenclatura" tabindex="16"></v-text-field>
                    </v-layout>
                  </v-container fluid>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <br>

    <v-layout row>
      <v-flex xs12>
        <!-- DATOS DE LAS TAREAS -->
        <v-card>
          <v-card-title>
            <span class="title ml-4">Tareas</span>
          </v-card-title>
          <v-card-text>
            <v-container class="mx-4">
              <v-layout row>
                <v-flex xs6 class="mx-4">
                  <typeahead
                    tabindex="17"
                    option="true"
                    label="Categoría"
                  >
                  </typeahead>
                </v-flex>

                <v-flex xs6 class="mx-4">
                  <typeahead
                    tabindex="18"
                    option="true"
                    label="Subcategoría"
                  >
                  </typeahead>
                </v-flex>
              </v-layout>

              <br>
              <span class="subheading">Items</span>

              <v-layout row class="mt-4">
                <v-flex xs5 class="mx-4">
                  <typeahead
                    tabindex="19"
                    label="Descripción"
                    v-model="nuevo_item.descripcion"
                    :items="items_tarea_select"
                    @change="changeNuevoItem"
                  >
                  </typeahead>
                </v-flex>

                <v-flex xs5 class="mx-4">
                  <typeahead
                    tabindex="20"
                    label="Valor"
                    v-model="nuevo_item.valor"
                    :items="nuevo_item.values"
                  >
                  </typeahead>
                </v-flex>

                <v-flex xs2 class="mx-4">
                  <v-btn light @click="addItem" tabindex="21">Agregar</v-btn>
                </v-flex>
              </v-layout>

              <v-layout row class="ma-4">
                  <v-data-table
                      :headers="headers.items"
                      :items="items_extra"
                      hide-actions
                      class="elevation-1"
                      no-data-text="No hay items nuevos">
                    <template slot="headers" scope="props">
                      <th v-for="header of props.headers" style="padding: 20px">
                        {{ header.text }}
                      </th>
                      <th></th>
                    </template>
                    <template slot="items" scope="props">
                      <td>{{ getDescripcionItem(props.item.descripcion) }}</td>
                      <td>{{ props.item.valor }}</td>
                      <td style="width:30px">
                        <v-btn icon @click="removeItemExtra(props.index)">
                          <v-icon>delete</v-icon>
                        </v-btn>
                      </td>
                    </template>
                  </v-data-table>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <br>

    <v-layout row>
      <v-flex xs12>
        <v-btn class="blue darken-1 white--text right" @click.native="" tabindex="23">
          Guardar
          <v-icon dark right></v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import * as axios from 'axios';
import Typeahead from '@/components/base/Typeahead';

class Item {
  constructor() {
    this.descripcion = '';
    this.valor = '';
    this.values = [];
  }

  isValid() {
    return (this.descripcion.toString().length)
      && this.valor.toString().length;
  }
}


export default {
  name: 'permiso-construccion',
  data () {
    return {
      matricula: {},

      permiso: {
        tipoComitente: 'persona',
        pais: '',
        provincia: '',
        departamento: '',
        localidad: '',
        calle: ''
      },

      headers: {
          items: [
            { text: 'Descripción', value: 'descripcion' },
            { text: 'Valor', value: 'valor' }
          ]
      },

      select_items: {
        paises: [],
        provincias: [],
        departamentos: [],
        localidades: [],
      },

      items_tarea: [
          {
            text: 'Cantidad de m2',
            value: 1,
            values: [ "230", "534" ]
          },
          {
            text: 'Tipo de Construcción',
            value: 2,
            values: [ 'Choza', 'Casa de barro' ]
          }
      ],

      items_extra: [],

      nuevo_item: new Item(),
    }
  },

  created: function() {
    Promise.all([
      axios.get('http://localhost:3400/api/paises'),
      // axios.get(`http://localhost:3400/api/matriculas/${this.$route.params.id}`)
    ])
    .then(r => {
      this.select_items.paises = r[0].data;
      // this.matricula = r[1].data
    })
    .catch(e => console.error(e));
  },

  computed: {
    items_tarea_select: function() {
      return this.items_tarea.length ? this.items_tarea.map(i => i.text) : [];
    },

    paises: function() {
      return this.select_items.paises.length ? this.select_items.paises.map(p => p.nombre) : [];
    },

    provincias: function() {
      return this.select_items.provincias ? this.select_items.provincias.map(i => i.nombre)  : [];
    },

    departamentos: function() {
      return this.select_items.departamentos ? this.select_items.departamentos.map(i => i.nombre)  : [];
    },

    localidades: function() {
      return this.select_items.localidades ? this.select_items.localidades.map(i => i.nombre)  : [];
    }
  },

  methods: {
    addItem: function() {
      if (this.nuevo_item.isValid()) {
        this.items_extra.push(this.nuevo_item);
        this.nuevo_item = new Item();
      }
    },

    removeItemExtra: function(i) {
      this.items_extra.splice(i, 1);
    },

    getDescripcionItem: function(d) {
      return Number.isInteger(d) ? this.items_tarea.find(i => i.value == d).text : d;
    },

    changeNuevoItem: function() {
      this.nuevo_item.values = [];
      if (this.nuevo_item.descripcion.length) {
        let item = this.items_tarea.find(i => i.text == this.nuevo_item.descripcion);
        this.nuevo_item.values = item.values;
      }
    },

    changePais: function(tipoDomicilio) {
      if (this.permiso.pais.length) {
        let idPais = this.select_items.paises.find(p => p.nombre == this.permiso.pais).id;
        axios.get(`http://localhost:3400/api/provincias?pais_id=${idPais}`)
             .then(r => this.select_items.provincias = r.data)
             .catch(e => console.error(e));
      }
      else this.select_items.provincias = [];
    },

    changeProvincia: function(tipoDomicilio) {
      if (this.permiso.provincia.length) {
        let idProv = this.select_items.provincias.find(p => p.nombre == this.permisoprovincia).id;
        axios.get(`http://localhost:3400/api/departamentos?provincia_id=${idProv}`)
             .then(r => this.select_items.departamentos = r.data)
             .catch(e => console.error(e));
      }
      else this.select_items.departamentos = [];
    },

    changeDepartamento: function(tipoDomicilio) {
      if (this.permiso.departamento.length) {
        let idDepto = this.select_items.departamentos.find(p => p.nombre == this.permiso.departamento).id;
        axios.get(`http://localhost:3400/api/localidades?departamento_id=${idDepto}`)
             .then(r => this.select_items.localidades = r.data)
             .catch(e => console.error(e));
      }
      else this.select_items.localidades = [];
    },
  },

  components: {
    Typeahead
  }

}
</script>

<style>
  .body-1 {
    margin-left: 10px;
  }
</style>
