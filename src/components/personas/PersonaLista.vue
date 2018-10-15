<template>
<v-container class="grey lighten-3">
  <v-toolbar class="darken-3" color="primary">
    <v-toolbar-title class="white--text">Personas</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-card class="mt-4">
    <v-expansion-panel expand title="Filtros de Búsqueda">
      <v-expansion-panel-content v-model="expand_filtros" class="lighten-4" color="primary">
        <div slot="header"><b></b></div>
        <v-container class="white black--text">

            <v-layout>
                <v-flex xs12 md3 class="mx-4">
                <v-select
                    :items="opciones_globales.tipo"
                    label="Tipo"
                    single-line bottom
                    v-model="filtros.tipo"
                ></v-select>
                </v-flex>
            </v-layout>

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
                  v-model="filtros.cuit"
                  label="CUIT/CUIL"
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
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>

  <br>

    <v-data-table
      :headers="$options.headers[filtros.tipo]"
      :items="personas"
      class="elevation-1"
      :no-data-text="loading ? '' : 'No se encontraron personas'"
      :no-results-text="loading ? '' : 'No se encontraron personas'"
      :pagination.sync="pagination"
      :total-items="totalItems"
      :loading="loading"
      :rows-per-page-items="[25,30,35]"
    >

      <template slot="items" slot-scope="props">
        <td class="justify-center layout px-0">
          <v-btn
            v-if="$can('update', 'Persona')"
            small icon class="mx-0" @click="editar(props.item.id)">
            <v-icon color="deep-purple">edit</v-icon>
          </v-btn>

          <v-btn 
            v-if="$can('delete', 'Persona')"
            small icon class="mx-4" 
            @click="borrar(props.item.id)"
          >
            <v-icon color="error">delete</v-icon>
          </v-btn>
        </td>

        <template v-if="filtros.tipo == 'fisica'">
            <td>{{ props.item.dni }}</td>
            <td>{{ props.item.nombre }}</td>
            <td>{{ props.item.apellido }}</td>
            <td>{{ props.item.cuit }}</td>
        </template>

        <template v-else>
            <td>{{ props.item.cuit }}</td>
            <td>{{ props.item.nombre }}</td>
        </template>
      </template>
    </v-data-table>

</v-container>
</template>

<script>
import api from '@/services/api'
import { ColumnHeader } from '@/model'
import ListaStore from '@/stores/listados/Personas'

export default {
  name: 'lista-solicitud',


  headers: {
    juridica: [
      ColumnHeader('', 'acciones'),
      ColumnHeader('CUIT', 'cuit', true),
      ColumnHeader('Nombre', 'nombre', true)
    ],

    fisica: [
      ColumnHeader('', 'acciones'),
      ColumnHeader('DNI', 'dni', true),
      ColumnHeader('Nombre', 'nombre', true),
      ColumnHeader('Apellido', 'apellido', true),
      ColumnHeader('CUIT/CUIL', 'cuit', true)
    ]
  },

  data() {
    return {
      pagination: ListaStore.state.pagination,
      filtros: ListaStore.state.filtros,
      totalItems: 0,
      loading: false,
      expand_filtros: true,
      personas: [],
      debouncedUpdate: null
    }
  },

  watch: {
    filtros: {
      handler() {
        this.pagination.page = 1;
        this.updatePersonas();
      },
      deep: true
    },

    pagination: {
      handler() {
        this.updatePersonas();
      },
      deep: true
    }
  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.updatePersonas, 600, {
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

    updatePersonas: function() {
      this.loading = true;
      this.personas = [];
      let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
      let limit = this.pagination.rowsPerPage;

      let url = `/personas?limit=${limit}&offset=${offset}`;

      if (this.filtros.tipo) url += `&tipo=${this.filtros.tipo}`;
    //   if (this.filtros.nombre) url += `&filtros[nombre]=${this.filtros.nombre}`;
    //   if (this.filtros.cue) url += `&filtros[cue]=${this.filtros.cue}`;

      if (this.pagination.sortBy) url+=`&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;


      api.get(url)
        .then(r => {
          this.personas = r.data.resultados;
          this.totalItems = r.data.totalQuery;
          this.loading = false;
        })
        .catch(e => console.error(e));
    },

    editar: function(id) {
      this.$router.push(`/personas/${id}/modificar`);
    },

    borrar: function(id) {
        api.delete(`/personas/${id}`)
        .then(r => this.updatePersonas())
        .catch(e => {
            if (e.response.status == 409)
                alert('No es posible eliminar la persona. Existen elementos relacionados a la misma. Por ej.: comitentes o subsidiarios');
            else console.error(e);
        })
    },    

  }

}
</script>

<style>
</style>
