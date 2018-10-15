<template>
  <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-data-table
              :headers="$options.headers"
              :items="historial"
              class="elevation-1"
              :no-data-text="loading ? '' : 'No hay datos'"
              :no-results-text="loading ? '' : 'No hay datos'"
              :rows-per-page-items="[25,30,35]"
              :pagination.sync="pagination"
              :loading="loading"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td>{{ props.item.fecha | fecha }}</td>
                <td>{{ props.item.estado.valor }}</td>
                <td>
                    <a v-if="props.item.documento.archivo" :href="getUrlDoc(props.item.documento.id)" target="_blank">
                        {{ props.item.documento.tipo.valor }} N° {{ props.item.documento.numero }}
                    </a>
                    <span v-else>
                        {{ props.item.documento.tipo.valor }} N° {{ props.item.documento.numero }}
                    </span>
                </td>
                <td>{{ props.item.documento.fecha | fecha }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>      
  </v-container>
</template>

<script>
import api from '@/services/api'
import config from '@/config'
import { ColumnHeader } from '@/model'

export default {
    name: 'MatriculaHistorial',
    props: ['id'],

    headers: [
        ColumnHeader('Fecha', 'fecha'),
        ColumnHeader('Estado', 'estado'),
        ColumnHeader('Documento', 'tipo_doc'),
        ColumnHeader('Fecha Doc.', 'fecha_doc'),
    ],

    data() {
        return {
            historial: [],
            pagination: {
                page: 1,
                rowsPerPage: 25,
                descending: null,
                sortBy: null        
            },
            totalItems: 0,
            loading: false,            
        }
    },

    created: function() {
        api.get(`/matriculas/${this.id}/historial?sort=-fecha`)
        .then(r => {
            this.historial = r.data;
        })
    },

    methods: {
        getUrlDoc: function(id) {
            return `${config.api}/documentos/${id}/archivo`;
        }
    }

}
</script>

<style>

</style>
