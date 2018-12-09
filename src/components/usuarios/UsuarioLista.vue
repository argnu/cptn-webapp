<template>
<v-container class="grey lighten-3">
  <v-toolbar class="darken-3" color="primary">
    <v-toolbar-title class="white--text">Usuarios</v-toolbar-title>
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
                  v-model="filtros.apellido"
                  label="Apellido"
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
      :items="usuarios"
      class="elevation-1"
      :no-data-text="loading ? '' :  'No se encontraron usuarios'"
      :no-results-text="loading ? '' :  'No se encontraron usuarios'"
      :pagination.sync="pagination"
      :total-items="totalItems"
      :loading="loading"
      :rows-per-page-items="[25,30,35]"
    >

      <template slot="items" slot-scope="props">
        <td class="justify-center layout px-0">
          <v-btn small icon class="mx-0"  @click="verDetalle(props.item.id)" title="Ver Detalle">
            <v-icon color="primary">assignment</v-icon>
          </v-btn>

          <v-btn 
            small 
            icon 
            class="mx-2"  
            @click="$router.push(`/usuarios/${props.item.id}/modificar`)" 
            title="Ver Detalle"
          >
            <v-icon color="deep-purple">edit</v-icon>
          </v-btn>

          <v-btn small icon  @click="toggleActivo(props.item)"
            :title="props.item.activo ? 'Desactivar' : 'Activar'"
          >
            <v-icon color="deep-purple">
              {{ props.item.activo ? 'check_box' : 'check_box_outline_blank' }}
            </v-icon>
          </v-btn>
        </td>
        <td>{{ props.item.username }}</td>
        <td>{{ props.item.nombre }}</td>
        <td>{{ props.item.apellido }}</td>
        <td>{{ props.item.email }}</td>
        <td>{{ props.item.activo | boolean }}</td>
      </template>
    </v-data-table>

</v-container>
</template>

<script>

import api from '@/services/api'
import { debounce } from 'lodash'
import { ColumnHeader } from '@/model'
import ListaStore from '@/stores/listados/Usuarios'

export default {
  name: 'UsuarioLista',

  headers: [
    ColumnHeader('', 'acciones'),
    ColumnHeader('Usuario', 'username', true),
    ColumnHeader('Nombre', 'nombre', true),
    ColumnHeader('Apellido', 'apellido', true),
    ColumnHeader('Email', 'email', true),
    ColumnHeader('Activo', 'activo')
  ],

  data() {
    return {
      pagination: ListaStore.state.pagination,
      filtros: ListaStore.state.filtros,
      totalItems: 0,
      loading: false,
      expand_filtros: true,
      usuarios: [],
      debouncedUpdate: null
    }
  },

  watch: {
    filtros: {
      handler() {
        this.pagination.page = 1;
        this.updateUsuarios();
      },
      deep: true
    },

    pagination: {
      handler() {
        this.updateUsuarios();
      },
      deep: true
    }
  },

  created: function() {
    this.debouncedUpdate = debounce(this.updateUsuarios, 600, {
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

    updateUsuarios: function() {
      this.loading = true;
      this.usuarios = [];
      let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
      let limit = this.pagination.rowsPerPage;

      let url = `/usuarios?limit=${limit}&offset=${offset}`;

      if (this.filtros.username) url += `&filtros[username]=${this.filtros.username}`;
      if (this.filtros.nombre) url += `&filtros[nombre]=${this.filtros.nombre}`;
      if (this.filtros.apellido) url += `&filtros[apellido]=${this.filtros.apellido}`;
      if (this.filtros.email) url += `&filtros[email]=${this.filtros.email}`;

      if (this.pagination.sortBy) url+=`&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;
      else url+='&sort=+apellido';

      api.get(url)
        .then(r => {
          this.usuarios = r.data.resultados;
          this.totalItems = r.data.totalQuery;
          this.loading = false;
        })
        .catch(e => console.error(e));
    },

    verDetalle: function(id) {
      this.$router.push(`/usuarios/${id}`);
    },

    toggleActivo: function(usuario) {
      let msg = `Está seguro/a que desea ${usuario.activo ? 'desactivar' : 'activar'} al usuario?`;
        if (confirm(msg)) {
            api.patch(`/usuarios/${usuario.id}`, { activo: !usuario.activo })
            .then(r => this.updateUsuarios())
            .catch(e => console.error(e));
        }
    }

  }

}
</script>

<style>
</style>
