<template>
<v-container class="grey lighten-3">
  <v-toolbar class="darken-3" color="primary">
    <v-toolbar-title class="white--text">Instituciones</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-card class="mt-4">
    <v-expansion-panel expand title="Filtros de Búsqueda">
      <v-expansion-panel-content v-model="expand_filtros" class="lighten-4" color="primary">
        <div slot="header"><b></b></div>
        <v-container class="white black--text">
          <v-layout row wrap>
            <v-flex xs12 md3 class="mx-4">
                <v-text-field 
                  v-model="filtros.nombre" 
                  label="Nombre" 
                  @input="updateList"
                  clearable
                ></v-text-field>
            </v-flex>

            <v-flex xs12 md3 class="mx-4">
                <v-text-field 
                  v-model="filtros.cue" 
                  label="CUE" 
                  @input="updateList"
                  clearable
                ></v-text-field>
            </v-flex>

            <v-flex xs12 md3 class="mx-4">
              <v-btn @click="limpiarFiltros">
                Limpiar Filtros
              </v-btn>
                            
            </v-flex>             
          </v-layout>

          <v-layout row wrap>
           
          </v-layout>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>

  <br>

    <v-data-table
      :headers="$options.headers"
      :items="instituciones"
      class="elevation-1"
      no-data-text="No se encontraron instituciones"
      no-results-text="No se encontraron instituciones"
      :pagination.sync="pagination"
      :total-items="totalItems"
      :loading="loading"
      :rows-per-page-items="[25,30,35]"
    >

      <template slot="items" slot-scope="props">
        <td>
          <v-btn fab small dark color="primary" slot="activator" @click="verDetalle(props.item.id)">
            <v-icon>assignment</v-icon>
          </v-btn>
        </td>
        <!-- <td>
          <v-btn fab small dark color="primary" slot="activator">
            <v-icon>edit</v-icon>
          </v-btn>
        </td> -->
        <td>{{ props.item.cue }}</td>
        <td>{{ props.item.nombre }}</td>
      </template>
    </v-data-table>

</v-container>
</template>

<script>
import * as utils from '@/utils'
import api from '@/services/api'
import * as _ from 'lodash'
import { Header } from '@/model'
import ListaStore from '@/stores/listados/Instituciones'

export default {
  name: 'lista-solicitud',

  headers: [
    Header('Ver', 'detalle'),
    Header('CUE', 'cue', true),
    Header('Nombre', 'nombre', true)
  ],

  data() {
    return {
      pagination: ListaStore.state.pagination,
      filtros: ListaStore.state.filtros,
      totalItems: 0,
      loading: false,
      expand_filtros: true,
      instituciones: [],
      debouncedUpdate: null
    }
  },

  watch: {
    filtros: {
      handler() {
        this.pagination.page = 1;
        this.udpateInstituciones();
      },
      deep: true
    },

    pagination: {
      handler() {
        this.udpateInstituciones();
      },
      deep: true
    }
  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.udpateInstituciones, 600, {
      'maxWait': 1000
    });
  },

  methods: {
    limpiarFiltros: function() {
      ListaStore.limpiarFiltros();
    },

    updateList: function() {
      this.debouncedUpdate();
    },

    udpateInstituciones: function() {
      this.loading = true;
      this.instituciones = [];
      let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
      let limit = this.pagination.rowsPerPage;

      let url = `/instituciones?limit=${limit}&offset=${offset}`;

      if (this.filtros.nombre) url += `&filter[nombre]=${this.filtros.nombre}`;
      if (this.filtros.cue) url += `&filter[cue]=${this.filtros.cue}`;

      if (this.pagination.sortBy) url+=`&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;

      api.get(url)
        .then(r => {
          this.instituciones = r.data.resultados;
          this.totalItems = r.data.totalQuery;
          this.loading = false;
        })
        .catch(e => console.error(e));
    },

    verDetalle: function(id) {
      this.$router.push(`/instituciones/${id}`);
    },    

  }

}
</script>

<style>
</style>
