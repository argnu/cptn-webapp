<template>
<v-container class="grey lighten-3">
  <v-toolbar class="blue darken-3">
    <v-toolbar-title class="white--text">Listado de Matriculados</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <br>

  <v-card>
    <v-expansion-panel expand title="Filtros de Búsqueda">
      <v-expansion-panel-content v-model="expand.filtros" class="blue lighten-4">
        <div slot="header">
        </div>
        <v-container class="white black--text">
          <v-layout row>
            <v-flex xs4 class="ml-4">
              <v-select :items="select_items.tipo" label="Tipo de Entidad" single-line bottom v-model="filtros.tipoEntidad">
              </v-select>
            </v-flex>

            <v-flex xs4 class="mx-4">
              <v-select :items="estados" label="Estado" single-line bottom v-model="filtros.estado">
              </v-select>
              <div v-show="filtros.tipoEntidad == 'profesional'">
                <v-text-field v-model="filtros.profesional.dni" label="DNI" @input="updateList">
                </v-text-field>
              </div>
              <div v-show="filtros.tipoEntidad == 'empresa'">
                <v-text-field v-model="filtros.empresa.cuit" label="CUIT" @input="updateList">
                </v-text-field>
              </div>
            </v-flex>

            <v-flex xs4 class="mx-4">
              <v-text-field v-model="filtros.numero" label="N° Matrícula" @input="updateList">
              </v-text-field>
              <div v-show="filtros.tipoEntidad == 'profesional'">
                <v-text-field v-model="filtros.profesional.apellido" label="Apellido" @input="updateList">
                </v-text-field>
              </div>
              <div v-show="filtros.tipoEntidad == 'empresa'">
                <v-text-field v-model="filtros.empresa.nombre" label="Nombre" @input="updateList">
                </v-text-field>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>

  <br>

  <v-card>
    <v-data-table
      :headers="columnas[filtros.tipoEntidad]"
      :items="matriculas"
      class="elevation-1"
      no-data-text="No se encontraron matriculados"
      no-results-text="No se encontraron matriculados"
      v-bind:pagination.sync="pagination"
      :total-items="totalItems"
      :loading="loading"
    >
      <template slot="headers" scope="props">
        <tr class="blue lighten-4 text-xs-left">
          <th></th>
          <th v-for="header of props.headers" class="pa-3">
            <b>{{ header.text }}</b>
          </th>
        </tr>
      </template>
      <template slot="items" scope="props">
        <td>
          <v-btn icon slot="activator" @click="verMatricula(props.item.id)">
            <v-icon>assignment_ind</v-icon>
          </v-btn>
        </td>
        <td>{{ props.item.numeroMatricula }}</td>
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
      <!-- <td>
        <v-menu>
          <v-list>
            <v-list-tile @click="verDetalle(props.item.id)">
              <v-list-tile-title>Ver Detalle</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="verCuenta(props.item.id)">
              <v-list-tile-title>Resumen de Cuenta</v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="irPermiso(props.item.id)">
              <v-list-tile-title>Legajo Técnico</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </td> -->
      </template>
    </v-data-table>
  </v-card>
</v-container>
</template>

<script>
import * as utils from '@/utils';
import axios from '@/axios';
import * as _ from 'lodash';
import InputFecha from '@/components/base/InputFecha';
import {
  Matricula
} from '@/model';

export default {
  name: 'lista-solicitud',
  data() {
    return {
      totalItems: 0,
      loading: false,
      pagination: {
        rowsPerPage: 5,
      },

      select_items: {
        tipo: [{
            text: 'Profesionales',
            value: 'profesional'
          },
          {
            text: 'Empresas',
            value: 'empresa'
          }
        ],

        estados: []
      },

      expand: {
        filtros: true
      },

      filtros: {
        tipoEntidad: 'profesional',
        estado: '',
        numero: '',
        profesional: {
          dni: '',
          apellido: ''
        },
        empresa: {
          nombre: ''
        }
      },

      columnas: {
        empresa: [{
            text: 'N° Matrícula',
            value: 'numeroMatricula'
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
        profesional: [{
            text: 'N° Matrícula',
            value: 'numeroMatricula'
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

  watch: {
    filtros: {
      handler() {
        this.updateMatriculas();
      },
      deep: true
    },

    pagination: {
      handler() {
        this.updateMatriculas();
      },
      deep: true
    }
  },

  computed: {
    estados: function() {
      return this.select_items.estados ? this.select_items.estados.map(e => e.valor) : [];
    }
  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.updateMatriculas, 600, {
      'maxWait': 1000
    });
    axios.get('/opciones')
      .then(r => {
        this.select_items.estados = r.data.estadoMatricula;
      })
      .catch(e => console.error(e));
  },

  methods: {
    updateList: function() {
      this.debouncedUpdate();
    },

    updateMatriculas: function() {
      if (this.filtros.tipoEntidad.length) {
        this.loading = true;
        this.matriculas = [];
        let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
        let limit = this.pagination.rowsPerPage;

        let url = `/matriculas?tipoEntidad=${this.filtros.tipoEntidad}&limit=${limit}&offset=${offset}`;

        if (this.filtros.estado) {
          let estado = this.select_items.estados.find(e => e.valor == this.filtros.estado);
          url += `&estado=${estado.id}`
        }
        if (this.filtros.numero) url += `&numeroMatricula=${this.filtros.numero}`;
        if (this.filtros.profesional.dni) url += `&dni=${this.filtros.profesional.dni}`;
        if (this.filtros.profesional.apellido) url += `&apellido=${this.filtros.profesional.apellido}`;
        if (this.filtros.empresa.cuit) url += `&cuit=${this.filtros.empresa.cuit}`;
        if (this.filtros.empresa.nombre) url += `&nombreEmpresa=${this.filtros.empresa.nombre}`;

        axios.get(url)
          .then(r => {
            this.matriculas = r.data.resultados;
            this.totalItems = r.data.totalQuery;
            this.loading = false;
          })
          .catch(e => console.error(e));
      }
    },

    irPermiso: function(id) {
      this.$router.push(`/matriculas/${id}/permiso`);
    },

    verDetalle: function(id) {
      this.$router.push(`/matriculas/profesional/${id}`);
    },

    verCuenta: function(id) {
      this.$router.push(`/matriculas/${id}/resumen`);
    },

    verMatricula: function(id) {
      this.$router.push(`/matriculas/${id}`);
    },

  },

  components: {
    InputFecha
  }

}
</script>

<style>
</style>
