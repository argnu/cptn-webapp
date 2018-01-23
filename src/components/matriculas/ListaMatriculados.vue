<template>
<v-container class="grey lighten-3">
  <v-toolbar class="blue darken-3">
    <v-toolbar-title class="white--text">Listado de Matriculados</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-card class="mt-4">
    <v-expansion-panel expand title="Filtros de Búsqueda">
      <v-expansion-panel-content v-model="expand.filtros" class="blue lighten-4">
        <div slot="header"><b></b></div>
        <v-container class="white black--text">
          <v-layout row wrap>
            <v-flex xs12 md3 class="mx-2">
              <v-select 
                :items="select_items.tipo" 
                label="Tipo de Entidad" 
                single-line bottom 
                v-model="filtros.tipoEntidad"
              ></v-select>
            </v-flex>

            <v-flex xs12 md3 class="mx-2">
              <v-select 
                :items="select_items.estados" 
                item-value="id"
                item-text="valor"
                label="Estado" 
                single-line bottom 
                autocomplete
                clearable
                v-model="filtros.estado"
              >
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

            <v-flex xs12 md3 class="mx-2">
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

    <v-data-table
      :headers="headers[filtros.tipoEntidad]"
      :items="matriculas"
      class="elevation-1"
      no-data-text="No se encontraron matriculados"
      no-results-text="No se encontraron matriculados"
      v-bind:pagination.sync="pagination"
      :total-items="totalItems"
      :loading="loading"
      :rows-per-page-items="[25,30,35]"
    >

      <template slot="items" slot-scope="props">
        <td>
          <v-btn fab small dark color="blue" slot="activator" @click="verMatricula(props.item.id)">
            <v-icon>assignment_ind</v-icon>
          </v-btn>
        </td>
        <td>{{ props.item.numeroMatricula }}</td>
        <td>{{ props.item.estado }}</td>
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
              <v-icon class="blue--text">more_vert</v-icon>
            </v-btn>            
            <v-list>
              <v-list-tile 
                v-if="props.item.estado != 'Habilitado'" 
                @click="habilitar(props.item.id)"
              >
                <v-icon class="green--text mr-2">check_circle</v-icon>
                <v-list-tile-title>Habilitar</v-list-tile-title>
              </v-list-tile>             
            </v-list>
          </v-menu>
        </td>
      </template>
    </v-data-table>

</v-container>
</template>

<script>
import * as utils from '@/utils';
import axios from '@/axios';
import * as _ from 'lodash';
import InputFecha from '@/components/base/InputFecha';
import {
  Matricula,
  Header
} from '@/model';

const headers = {
  emrpesa: [
    Header('', 'ver'),
    Header('N° Matrícula', 'numeroMatricula', true),
    Header('Estado', 'estado', true),
    Header('Nombre', 'nombreEmpresa', true),
    Header('CUIT', 'cuit', true),
    Header('', 'acciones')
  ],

  profesional: [
    Header('', 'ver'),
    Header('N° Matrícula', 'numeroMatricula', true),
    Header('Estado', 'estado', true),
    Header('Nombre', 'nombre', true),
    Header('Apellido', 'apellido', true),
    Header('DNI', 'dni', true),
    Header('', 'acciones')
  ]
}


export default {
  name: 'lista-solicitud',
  data() {
    return {
      totalItems: 0,
      loading: false,
      pagination: {
        page: 1,
        rowsPerPage: 25,
        sortBy: 'fat',
        descending: true
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
        estado: 'Habilitado',
        numero: '',
        profesional: {
          dni: '',
          apellido: ''
        },
        empresa: {
          nombre: ''
        }
      },

      matriculas: [],
      debouncedUpdate: null
    }
  },

  watch: {
    filtros: {
      handler() {
        this.pagination.page = 1;
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
    headers: function() {
      return headers;
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

        if (this.filtros.estado) url += `&estado=${this.filtros.estado}`;
        if (this.filtros.numero) url += `&numeroMatricula=${this.filtros.numero}`;
        if (this.filtros.profesional.dni) url += `&dni=${this.filtros.profesional.dni}`;
        if (this.filtros.profesional.apellido) url += `&apellido=${this.filtros.profesional.apellido}`;
        if (this.filtros.empresa.cuit) url += `&cuit=${this.filtros.empresa.cuit}`;
        if (this.filtros.empresa.nombre) url += `&nombreEmpresa=${this.filtros.empresa.nombre}`;

        if (this.pagination.sortBy) url+=`&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;

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

    habilitar: function(id) {
      if (confirm('Esta segura/o que desea Habilitar la Matrícula seleccionada?')) {
        // 13 ES ESTADO 'Habilitado'         
        axios.patch(`/matriculas/${id}`, { estado: 13, operador: this.user.id })
        .then(r => this.updateMatriculas())
        .catch(e => console.error(e));
      }
    },

    deshabilitar: function(id) {
      if (confirm('Esta segura/o que desea Deshabilitar la Matrícula seleccionada?')) {
        // 35 ES ESTADO 'DesHabilitado'
        axios.patch(`/matriculas/${id}`, { estado: 35, operador: this.user.id })
        .then(r => this.updateMatriculas())
        .catch(e => console.error(e));
      }
    }

  },

  components: {
    InputFecha
  }

}
</script>

<style>
</style>
