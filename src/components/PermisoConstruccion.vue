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
                      <v-flex xs6>
                        <v-radio label="Persona" value="persona" v-model="permiso.tipoComitente"></v-radio>
                      </v-flex>
                      <v-flex xs6>
                        <v-radio label="Empresa" value="empresa" v-model="permiso.tipoComitente"></v-radio>
                      </v-flex>
                    </v-layout>
                    <v-layout v-show="permiso.tipoComitente == 'persona'">
                      <v-flex xs6 class="mr-5">
                        <v-text-field label="Nombre">
                        </v-text-field>
                        <v-text-field label="Apellido">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs6 class="mr-5">
                        <v-text-field label="DNI">
                        </v-text-field>
                        <v-text-field label="Teléfono">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout v-show="permiso.tipoComitente == 'empresa'">
                      <v-flex xs6 class="mr-5">
                        <v-text-field label="Nombre">
                        </v-text-field>
                        <v-text-field label="Teléfono">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs6 class="mr-5">
                        <v-text-field label="CUIT">
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
                        <v-select
                          autocomplete
                          label="País"
                        >
                        </v-select>
                        <v-select
                          autocomplete
                          label="Departamento"
                        >
                        </v-select>
                        <v-text-field
                          label="Calle"
                        >
                        </v-text-field>
                      </v-flex>

                      <v-flex xs6 class="ml-4">
                        <v-select
                          autocomplete
                          label="Provincia"
                        >
                        </v-select>
                        <v-select
                          autocomplete
                          label="Localidad"
                        >
                        </v-select>
                        <v-text-field
                          label="Nro"
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>

                    <v-layout row>
                      <v-text-field label="Nomenclatura"></v-text-field>
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
                  <v-select
                    autocomplete
                    label="Categoría"
                  >
                  </v-select>
                </v-flex>

                <v-flex xs6 class="mx-4">
                  <v-select
                    autocomplete
                    label="Subcategoría"
                  >
                  </v-select>
                </v-flex>
              </v-layout>

              <br>
              <span class="subheading">Items</span>

              <v-layout row class="mt-4">
                <v-flex xs5 class="mx-4">
                  <typeahead
                    label="Descripción"
                    v-model="nuevo_item.descripcion"
                    :items="items_tarea"
                    @change="changeNuevoItem"
                  >
                  </typeahead>
                </v-flex>

                <v-flex xs5 class="mx-4">
                  <typeahead
                    label="Valor"
                    v-model="nuevo_item.valor"
                    :items="nuevo_item.values"
                  >
                  </typeahead>
                </v-flex>

                <v-flex xs2 class="mx-4">
                  <v-btn light @click="addItem">Agregar</v-btn>
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
        <v-btn class="primary white--text right" @click.native="">
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
      && this.valor.length;
  }
}


export default {
  name: 'permiso-construccion',
  data () {
    return {
      matricula: {},

      permiso: {
        tipoComitente: 'persona'
      },

      headers: {
          items: [
            { text: 'Descripción', value: 'descripcion' },
            { text: 'Valor', value: 'valor' }
          ]
      },

      items_tarea: [
          {
            text: 'Cantidad de m2',
            value: 1,
            values: [
              {text:'230', value: 230},
              {text:'534', value: 534},
            ]
          },
          {
            text: 'Tipo de Construcción',
            value: 2,
            values: [
              {text:'Choza', value: 'Choza'},
              {text:'Casa de barro', value: 'Casa de barro'},
            ]
          }
      ],

      items_extra: [],

      nuevo_item: new Item(),
    }
  },

  created: function() {
    axios.get(`http://localhost:3400/api/matriculas/${this.$route.params.id}`)
         .then(r => this.matricula = r.data)
         .catch(e => console.error(e));
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
      if (Number.isInteger(this.nuevo_item.descripcion)) {
        let item = this.items_tarea.find(i => i.value == this.nuevo_item.descripcion);
        this.nuevo_item.values = item.values;
      }
    }
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
