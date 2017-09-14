<template>
  <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-toolbar class="indigo" dark>
            <v-toolbar-title class="white--text">Listado de Matriculados</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-container>
            <v-card>
              <v-card-title>
                Tipo de Entidad
              </v-card-title>
              <v-card-text class="grey lighten-4">
                <v-select
                  :items="select_items.tipo"
                  label="Tipo de Entidad"
                  single-line bottom
                  v-model="filtros.tipoEntidad"
                >
                </v-select>
              </v-card-text>
            </v-card>
          </v-container>


          <v-container>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-model="expand.filtros">
                <div slot="header">Filtros de Búsqueda</div>
                <v-container>
                  <v-layout row>
                    <v-flex xs4 class="ml-5">
                      <v-text-field
                         v-show="filtros.tipoEntidad == 'profesional'"
                         v-model="filtros.profesional.dni"
                         label="DNI"
                         @input="updateList"
                      >
                      </v-text-field>
                      <v-text-field
                         v-show="filtros.tipoEntidad == 'empresa'"
                         v-model="filtros.empresa.cuit"
                         label="CUIT"
                         @input="updateList"
                      >
                      </v-text-field>
                    </v-flex>

                    <v-flex xs4 class="ml-5">
                      <v-text-field
                         v-show="filtros.tipoEntidad == 'profesional'"
                         v-model="filtros.profesional.apellido"
                         label="Apellido"
                         @input="updateList"
                      >
                      </v-text-field>
                      <v-text-field
                         v-show="filtros.tipoEntidad == 'empresa'"
                         v-model="filtros.empresa.nombre"
                         label="Nombre"
                         @input="updateList"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-container>

          <v-container>
            <v-data-table
                :headers="columnas[filtros.tipoEntidad]"
                :items="matriculas_filter"
                class="elevation-1"
                no-data-text="No se encontraron matriculados"
                no-results-text="No se encontraron matriculados"
                v-bind:pagination.sync="pagination"
                :total-items="totalItems"
                :loading="loading"
                >
              <template slot="headers" scope="props">
                <th v-for="header of props.headers" style="padding: 20px;text-align:left">
                  <b>{{ header.text }}</b>
                </th>
                <th></th>
              </template>
              <template slot="items" scope="props">
                <td>{{ props.item.fechaResolucion | formatFecha }}</td>
                <td>{{ props.item.estado | upperFirst }}</td>
                <template v-if="filtros.tipoEntidad == 'profesional'">
                  <td>{{ props.item.entidad.nombre }}</td>
                  <td>{{ props.item.entidad.apellido }}</td>
                  <td>{{ props.item.entidad.dni }}</td>
                </template>
                <template v-if="filtros.tipoEntidad == 'empresa'">
                  <td>{{ props.item.entidad.nombre }}</td>
                  <td>{{ props.item.entidad.cuit }}</td>
                </template>
                <td>
                  <v-menu>
                    <v-btn icon slot="activator">
                      <v-icon>settings</v-icon>
                    </v-btn>
                    <v-list>
                      <v-list-tile @click="irPermiso(props.item.id)">
                        <v-list-tile-title>Permiso de Construcción</v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </td>
              </template>
            </v-data-table>
          </v-container>
        </v-flex>
      </v-layout>
  </v-container>
</template>

<script>
import * as axios from 'axios';
import * as utils from '@/utils';
import * as _ from 'lodash';
import InputFecha from '@/components/base/InputFecha';
import { Matricula } from '@/model';

export default {
  name: 'lista-solicitud',
  data () {
    return {
      totalItems: 0,
      loading: false,
      pagination: {
         rowsPerPage: 1,
      },

      select_items: {
        tipo: [
          {
            text: 'Profesionales',
            value: 'profesional'
          },
          {
            text: 'Empresas',
            value: 'empresa'
          }
        ]
      },

      expand: {
        filtros: true
      },

      filtros: {
        tipoEntidad: 'profesional',
        profesional: {
          dni: '',
          apellido: ''
        },
        empresa: {
          nombre: ''
        }
      },

      columnas: {
        empresa: [
            {
              text: 'Fecha',
              value: 'fecha'
            },
            {
              text: 'Estado',
              value: 'estado'
            },
            {
              text: 'Nombre',
              value: 'nombre'
            },
            {
              text: 'CUIT',
              value: 'cuit'
            },
            {
              text: 'Acciones',
              value: 'acciones'
            }
        ],
        profesional: [
            {
              text: 'Fecha',
              value: 'fecha'
            },
            {
              text: 'Estado',
              value: 'estado'
            },
            {
              text: 'Nombre',
              value: 'nombre'
            },
            {
              text: 'Apellido',
              value: 'apellido'
            },
            {
              text: 'DNI',
              value: 'dni'
            }
        ]
      },

      matriculas: [],
      debouncedUpdate: null
    }
  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.updateMatriculas, 600, { 'maxWait': 1000 });
  },

  filters: {
    formatFecha: function(str) {
      return utils.formatFecha(str);
    },

    upperFirst: function(str) {
      return utils.upperFirst(str);
    }
  },

  computed: {
    matriculas_filter: function() {
      let ini = (this.pagination.page - 1) * this.pagination. rowsPerPage;
      return this.matriculas.slice(ini, ini + this.pagination. rowsPerPage);
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
        },
        deep: true
      }
    },

  methods: {
    updateList: function() {
      this.debouncedUpdate();
    },

    updateMatriculas: function() {
      this.loading = true;
      this.matriculas = [];
      let url = `http://localhost:3400/api/matriculas?filtros.tipoEntidad=${this.filtros.tipoEntidad}`;
      if (this.filtros.profesional.dni) url+=`&dni=${this.filtros.profesional.dni}`;
      if (this.filtros.profesional.apellido) url+=`&apellido=${this.filtros.profesional.apellido}`;
      if (this.filtros.empresa.cuit) url+=`&cuit=${this.filtros.empresa.cuit}`;
      if (this.filtros.empresa.nombre) url+=`&nombreEmpresa=${this.filtros.empresa.nombre}`;

      axios.get(url)
           .then(r => {
             this.matriculas = r.data;
             this.totalItems = this.matriculas.length;
             this.loading = false;
           })
           .catch(e => console.error(e));
    },

    irPermiso: function(id) {
      this.$router.push(`/matriculas/${id}/permiso`);
    }

  },

  components: {
    InputFecha
  }

}
</script>

<style>
</style>
