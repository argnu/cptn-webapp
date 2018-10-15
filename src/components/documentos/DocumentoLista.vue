<template>
<v-container class="grey lighten-3">
  <v-toolbar class="darken-3" color="primary">
    <v-toolbar-title class="white--text">Documentos</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-card class="mt-4">
    <v-expansion-panel expand title="Filtros de Búsqueda">
      <v-expansion-panel-content v-model="expand_filtros" class="lighten-4" color="primary">
        <div slot="header"><b></b></div>
        <v-container class="white black--text">
          <v-layout row wrap>
            <v-flex xs12 md3 class="mx-4">
                <v-select
                  label="Tipo:"
                  :items="global_state.opciones.documento"
                  v-model="filtros.tipo"
                  item-text="valor"
                  item-value="id"
                  clearable
                  @input="updateList"
                ></v-select>

                <v-text-field
                  v-model="filtros.numero"
                  label="N°"
                  clearable
                  @input="updateList"
                ></v-text-field>
            </v-flex>

            <v-flex xs12 md3 class="mx-4">
                <input-fecha
                  v-model="filtros.fecha_desde"
                  label="Fecha Desde:"
                  @input="updateList"
                ></input-fecha>

                <input-fecha
                  v-model="filtros.fecha_hasta"
                  label="Fecha Hasta:"
                  @input="updateList"
                ></input-fecha>
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

<v-card class="mt-5 elevation-0">
    <v-card-text>
        <v-btn
            v-if="$can('create', 'Documento')"
            absolute dark fab top right
            color="green"
            @click="$router.push('/documentos/nuevo')"
        >
        <v-icon>add</v-icon>
        </v-btn>

            <v-data-table
            :headers="$options.headers"
            :items="documentos"
            class="elevation-1"
            :no-data-text="loading ? '' :  'No se encontraron documentos'"
            :no-results-text="loading ? '' :  'No se encontraron documentos'"
            :pagination.sync="pagination"
            :total-items="pagination.totalItems"
            :loading="loading"
            :rows-per-page-items="[25,30,35]"
            >

            <template slot="items" slot-scope="props">
                <td class="justify-center layout px-0">
                    <v-btn 
                      v-if="$can('delete', 'Documento')"
                      small icon class="mx-0"  @click="eliminar(props.item.id)" title="Eliminar">
                        <v-icon color="red">delete</v-icon>
                    </v-btn>

                    <v-btn 
                      v-if="$can('update', 'Documento')"
                      small icon class="mx-4" @click="editar(props.item.id)" title="Modificar">
                        <v-icon color="deep-purple">edit</v-icon>
                    </v-btn>
                </td>
                <td>{{ props.item.tipo.valor }}</td>
                <td>{{ props.item.fecha | fecha }}</td>
                <td>{{ props.item.numero }}</td>
                <td>
                    <a v-if="props.item.archivo" :href="getUrlArchivo(props.item.id)" target="_blank">
                        <v-icon class="primary--text">attachment</v-icon>
                    </a>
                    <span v-else>No tiene</span>
                </td>
            </template>
            </v-data-table>
    </v-card-text>
</v-card>

</v-container>
</template>

<script>
import config from '@/config'
import api from '@/services/api'
import { debounce } from 'lodash'
import { ColumnHeader } from '@/model'
import Pagination from '@/model/Pagination'
import InputFecha from '@/components/base/InputFecha'
import MixinGlobalState from '@/components/mixins/MixinGlobalState'

export default {
  name: 'DocumentoLista',

  mixins: [MixinGlobalState],

  components: {
      InputFecha
  },

  headers: [
    ColumnHeader('', 'acciones'),
    ColumnHeader('Tipo', 'tipo', true),
    ColumnHeader('Fecha', 'fecha', true),
    ColumnHeader('N°', 'numero', true),
    ColumnHeader('Archivo', 'archivo')
  ],

  data() {
    return {
      pagination: Pagination(25),
      filtros: {
          fecha: null,
          numero: null,
          tipo: null
      },
      loading: false,
      expand_filtros: true,

      documentos: [],
      debouncedUpdate: null
    }
  },

  watch: {
    filtros: {
      handler() {
        this.pagination.page = 1;
        this.update();
      },
      deep: true
    },

    pagination: {
      handler() {
        this.update();
      },
      deep: true
    }
  },

  created: function() {
    this.debouncedUpdate = debounce(this.update, 800)
  },

  methods: {
    limpiarFiltros: function() {
      this.filtros = {
          fecha_desde: null,
          fecha_hasta: null,
          numero: null,
          tipo: null
      };
    },

    updateList: function() {
      this.debouncedUpdate();
    },

    update: function() {
      this.loading = true;
      this.documentos = [];
      let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
      let limit = this.pagination.rowsPerPage;

      let url = `/documentos?limit=${limit}&offset=${offset}`;

      if (this.filtros.tipo) url += `&tipo=${this.filtros.tipo}`;
      if (this.filtros.numero) url += `&filtros[numero]=${this.filtros.numero}`;
      if (this.filtros.fecha_desde) url += `&filtros[fecha.desde]=${this.filtros.fecha_desde}`;
      if (this.filtros.fecha_hasta) url += `&filtros[fecha.hasta]=${this.filtros.fecha_hasta}`;

      if (this.pagination.sortBy) url+=`&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;
      else url+='&sort=-fecha';

      api.get(url)
      .then(r => {
          this.documentos = r.data.resultados;
          this.pagination.totalItems = r.data.totalQuery;
          this.loading = false;
      })
      .catch(e => console.error(e));
    },

    getUrlArchivo: function(id) {
        return `${config.api}/documentos/${id}/archivo`;
    },

    eliminar: function(id) {
        if (confirm('Está segura/o que desea eliminar el documento?')) {
            api.delete(`/documentos/${id}`)
            .then(r => {
              this.snackOk('Documento eliminado exitosamente!');
              this.update();
            })
            .catch(e => {
                if (e.response.status == 409)
                    alert('No es posible eliminar el documento. Existen elementos relacionados al mismo');
                else this.snackError(e);
            })
        }
    },

    editar: function(id) {
        this.$router.push(`/documentos/${id}/modificar`);
    }
  }

}
</script>

<style>

</style>
