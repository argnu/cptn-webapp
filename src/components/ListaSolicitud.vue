<template>
  <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-toolbar class="indigo" dark>
            <v-toolbar-title class="white--text">Listado de Solicitudes</v-toolbar-title>
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
                  v-model="tipoEntidad"
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
                    <v-flex xs4>
                      <v-select
                        :items="select_items.estado"
                        label="Estado de Solicitud"
                        single-line bottom
                        v-model="filtros.estado">
                      </v-select>
                    </v-flex>
                    <v-flex xs4>
                      <v-text-field
                         v-show="tipoEntidad == 'profesional'"
                         v-model="filtros.profesional.dni"
                         label="DNI"
                         @input="updateList"
                      >
                      </v-text-field>
                      <v-text-field
                         v-show="tipoEntidad == 'empresa'"
                         v-model="filtros.empresa.cuit"
                         label="CUIT"
                         @input="updateList"
                      >
                      </v-text-field>
                    </v-flex>

                    <v-flex xs4>
                      <v-text-field
                         v-show="tipoEntidad == 'profesional'"
                         v-model="filtros.profesional.apellido"
                         label="Apellido"
                         @input="updateList"
                      >
                      </v-text-field>
                      <v-text-field
                         v-show="tipoEntidad == 'empresa'"
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
                :headers="columnas[tipoEntidad]"
                :items="solicitudes_filter"
                class="elevation-1"
                no-data-text="No se encontraron solicitudes"
                no-results-text="No se encontraron solicitudes"
                v-bind:pagination.sync="pagination"
                :total-items="totalItems"
                :loading="loading"
                >
              <template slot="headers" scope="props">
                <th style="text-align:left">Validar</th>
                <th v-for="header of props.headers" style="padding: 20px;text-align:left">
                  <b>{{ header.text }}</b>
                </th>
              </template>
              <template slot="items" scope="props">
                <td>
                  <v-btn icon class="green--text">
                    <v-icon dark>check_circle</v-icon>
                  </v-btn>
                </td>
                <td>{{ props.item.fecha | formatFecha }}</td>
                <td>{{ props.item.estado | upperFirst }}</td>
                <template v-if="tipoEntidad == 'profesional'">
                  <td>{{ props.item.entidad.nombre }}</td>
                  <td>{{ props.item.entidad.apellido }}</td>
                  <td>{{ props.item.entidad.dni }}</td>
                </template>
                <template v-if="tipoEntidad == 'empresa'">
                  <td>{{ props.item.entidad.nombre }}</td>
                  <td>{{ props.item.entidad.cuit }}</td>
                </template>
              </template>
            </v-data-table>
          </v-container>
        </v-flex>
      </v-layout>

      <!-- <div class="text-xs-center">
        <v-pagination
          :length="pagination.total"
          v-model="pagination.page"
          :total-visible="pagination.max">
        </v-pagination>
      </div> -->
  </v-container>
</template>

<script>
import * as axios from 'axios';
import * as utils from '@/utils';
import * as _ from 'lodash';

export default {
  name: 'lista-solicitud',
  data () {
    return {
      // pagination: {
      //   total: 1,
      //   page: 1,
      //   max: 7,
      //   per_page: 1
      // },
      totalItems: 0,
      loading: false,
      pagination: {
         rowsPerPage: 1,
      },

      select_items: {
        estado: [
          {
            text: 'Pendiente',
            value: 'pendiente'
          },
          {
            text: 'Aprobada',
            value: 'aprobada'
          },
          {
            text: 'Rechazada',
            value: 'rechazada'
          }
        ],
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

      solicitudes: [],

      filtros: {
        estado: 'pendiente',
        profesional: {
          dni: '',
          apellido: ''
        },
        empresa: {
          nombre: ''
        }
      },

      tipoEntidad: '',

      debouncedUpdate: null,
    }
  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.updateSolicitudes, 600, { 'maxWait': 1000 });
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
    solicitudes_filter: function() {
      let ini = (this.pagination.page - 1) * this.pagination. rowsPerPage;
      return this.solicitudes.slice(ini, ini + this.pagination. rowsPerPage);
    }
  },

  watch: {
    tipoEntidad: function() {
      this.updateSolicitudes()
    },

    pagination: {
      handler () {
        // this.updateSolicitudes();
      },
      deep: true
    }
  },

  methods: {
    updateList: function() {
      this.debouncedUpdate();
    },

    updateSolicitudes: function() {
      this.loading = true;
      this.solicitudes = [];
      let url = `http://localhost:3400/api/solicitudes?tipoEntidad=${this.tipoEntidad}`;
      if (this.filtros.estado) url+=`&estado=${this.filtros.estado}`;
      if (this.filtros.profesional.dni) url+=`&dni=${this.filtros.profesional.dni}`;
      if (this.filtros.profesional.apellido) url+=`&apellido=${this.filtros.profesional.apellido}`;
      if (this.filtros.empresa.cuit) url+=`&cuit=${this.filtros.empresa.cuit}`;
      if (this.filtros.empresa.nombre) url+=`&nombreEmpresa=${this.filtros.empresa.nombre}`;

      axios.get(url)
           .then(r => {
             this.solicitudes = r.data;
             this.totalItems = this.solicitudes.length;
            //  this.pagination.total = this.totalItems / this.pagination.per_page;
            //  this.page = 1;
             this.loading = false;
           })
           .catch(e => console.error(e));
    }
  },

  components: {
  }

}
</script>

<style>
</style>
