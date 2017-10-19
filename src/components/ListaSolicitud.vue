<template>
  <v-container>

      <v-dialog v-model="show_validar" persistent width="50%">
        <v-card>
          <v-card-title>
            <span class="headline">Aprobar Matrícula</span>
          </v-card-title>
          <v-card-text class="grey lighten-4">
            <v-container>
              <v-layout row>
                <v-flex xs6>
                  <input-fecha
                    v-model="matricula.fechaResolucion"
                    label="Fecha de Resolución"
                  >
                  </input-fecha>
                </v-flex>
                <v-flex xs6>
                  <v-text-field
                     v-model="matricula.numeroActa"
                     label="N° Acta"
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn class="right green white--text" @click.native="validarMatricula">
                    Aprobar
                    <v-icon dark right>check_circle</v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>


      <v-layout row wrap>
        <v-flex xs12>
          <v-toolbar class="indigo" dark>
            <v-toolbar-title class="white--text">Listado de Solicitudes</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-container>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-model="expand.filtros">
                <div slot="header">Filtros de Búsqueda</div>
                <v-container>
                  <v-layout row>
                    <v-flex xs3 class="ma-4">
                      Tipo de Entidad:
                      <v-select
                        :items="select_items.tipo"
                        label="Tipo de Entidad"
                        single-line bottom
                        v-model="filtros.tipoEntidad"
                      >
                      </v-select>
                    </v-flex>

                    <v-flex xs3 class="ma-4">
                      Estado:
                      <v-select
                        :items="select_items.estado"
                        label="Estado de Solicitud"
                        single-line bottom
                        autocomplete
                        v-model="filtros.estado">
                      </v-select>
                    </v-flex>

                    <v-flex xs3 class="ma-4">
                      <br>
                      <div v-show="filtros.tipoEntidad == 'profesional'">
                        <v-text-field
                           v-model="filtros.profesional.dni"
                           label="DNI"
                           @input="updateList"
                        >
                        </v-text-field>
                      </div>

                      <div v-show="filtros.tipoEntidad == 'empresa'">
                        <v-text-field
                           v-model="filtros.empresa.cuit"
                           label="CUIT"
                           @input="updateList"
                        >
                        </v-text-field>
                      </div>
                    </v-flex>

                    <v-flex xs3 class="ma-4">
                      <br>
                      <div v-show="filtros.tipoEntidad == 'profesional'">
                        <v-text-field
                           v-model="filtros.profesional.apellido"
                           label="Apellido"
                           @input="updateList"
                        >
                        </v-text-field>
                      </div>
                      <div v-show="filtros.tipoEntidad == 'empresa'">
                        <v-text-field
                           v-model="filtros.empresa.nombre"
                           label="Nombre"
                           @input="updateList"
                        >
                        </v-text-field>
                      </div>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-container>

          <v-container>
            <v-data-table
                :headers="columnas[filtros.tipoEntidad]"
                :items="solicitudes_filter"
                class="elevation-1"
                no-data-text="No se encontraron solicitudes"
                no-results-text="No se encontraron solicitudes"
                v-bind:pagination.sync="pagination"
                :total-items="totalItems"
                :loading="loading"
                >
              <template slot="headers" scope="props">
                <th v-for="header of props.headers" style="padding: 20px;text-align:left">
                  <b>{{ header.text }}</b>
                </th>
              </template>
              <template slot="items" scope="props">
                <td>{{ props.item.fecha | formatFecha }}</td>
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
                      <v-list-tile @click="selectSolicitud(props.item.id)">
                        <v-list-tile-title>Aprobar</v-list-tile-title>
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
      matricula: new Matricula(),
      show_validar: false,
      totalItems: 0,
      loading: false,
      pagination: {
         rowsPerPage: 5,
      },

      select_items: {
        estado: [
          {
            text: 'Todas',
            value: 'todas'
          },
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
            },
            {
              text: 'Acciones',
              value: 'Acciones'
            },
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
            },
            {
              text: 'Acciones',
              value: 'Acciones'
            },
        ]
      },

      solicitudes: [],

      filtros: {
        estado: 'todas',
        tipoEntidad: '',
        profesional: {
          dni: '',
          apellido: ''
        },
        empresa: {
          nombre: ''
        }
      },

      debouncedUpdate: null
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
    filtros: {
      handler () {
        this.updateSolicitudes();
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

    updateSolicitudes: function() {
      this.loading = true;
      this.solicitudes = [];
      let url = `http://localhost:3400/api/solicitudes?tipoEntidad=${this.filtros.tipoEntidad}`;
      if (this.filtros.estado && this.filtros.estado != 'todas') url+=`&estado=${this.filtros.estado}`;
      if (this.filtros.profesional.dni) url+=`&dni=${this.filtros.profesional.dni}`;
      if (this.filtros.profesional.apellido) url+=`&apellido=${this.filtros.profesional.apellido}`;
      if (this.filtros.empresa.cuit) url+=`&cuit=${this.filtros.empresa.cuit}`;
      if (this.filtros.empresa.nombre) url+=`&nombreEmpresa=${this.filtros.empresa.nombre}`;

      axios.get(url)
           .then(r => {
             this.solicitudes = r.data;
             this.totalItems = this.solicitudes.length;
             this.loading = false;
           })
           .catch(e => console.error(e));
    },

    selectSolicitud: function(id) {
      this.show_validar = true;
      this.matricula.solicitud = id;
    },

    validarMatricula: function() {
      axios.post('http://localhost:3400/api/matriculas', this.matricula)
           .then(r => {
             this.updateSolicitudes();
             this.matricula = new Matricula();
             this.show_validar = false;
           })
           .catch(e => console.error(e));
    }
  },

  components: {
    InputFecha
  }

}
</script>

<style>
</style>
