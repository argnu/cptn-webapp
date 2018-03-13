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
      no-data-text="No se encontraron usuarios"
      no-results-text="No se encontraron usuarios"
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
        <td>
          <v-btn fab small dark color="primary" slot="activator" @click="desactivar(props.item.id)">
            <v-icon>do_not_disturb_off</v-icon>
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
import * as utils from '@/utils'
import axios from '@/axios'
import * as _ from 'lodash'
import { Header } from '@/model'
import ListaStore from '@/stores/listados/Usuarios'

export default {
  name: 'UsuarioLista',

  headers: [
    Header('', 'detalle'),
    Header('', 'desactivar'),
    Header('Usuario', 'username', true),
    Header('Nombre', 'nombre', true),
    Header('Apellido', 'apellido', true),
    Header('Email', 'email', true),
    Header('Activo', 'activo')
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
        this.udpateUsuarios();
      },
      deep: true
    },

    pagination: {
      handler() {
        this.udpateUsuarios();
      },
      deep: true
    }
  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.udpateUsuarios, 600, {
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

    udpateUsuarios: function() {
      this.loading = true;
      this.usuarios = [];
      let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
      let limit = this.pagination.rowsPerPage;

      let url = `/usuarios?limit=${limit}&offset=${offset}`;

      if (this.filtros.username) url += `&filter[username]=${this.filtros.username}`;
      if (this.filtros.nombre) url += `&filter[nombre]=${this.filtros.nombre}`;
      if (this.filtros.apellido) url += `&filter[apellido]=${this.filtros.apellido}`;
      if (this.filtros.email) url += `&filter[email]=${this.filtros.email}`;

      if (this.pagination.sortBy) url+=`&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;

      axios.get(url)
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

    desactivar: function(id) {
        if (confirm("Está seguro/a que desea desactivar al usuario?")) {
            axios.patch(`/usuarios/${id}`, { operador: this.user.id, activo: false })
            .then(r => {
                this.udpateUsuarios();
            })
            .catch(e => console.error(e));
        }
    }

  }

}
</script>

<style>
</style>
