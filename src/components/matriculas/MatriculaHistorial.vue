<template>
  <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-data-table
              :headers="$options.headers"
              :items="historial"
              class="elevation-1"
              no-data-text="No hay datos"
              no-results-text="No hay datos"
              :rows-per-page-items="[25,30,35]"
              :pagination.sync="pagination"
              :loading="loading"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td>{{ props.item.fecha | fecha }}</td>
                <td>{{ props.item.estado.valor }}</td>
                <td>{{ props.item.documento.tipo.valor }} N° {{ props.item.documento.numero }}</td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>      
  </v-container>
</template>

<script>
import api from '@/services/api'
import { Header } from '@/model'

export default {
    name: 'MatriculaHistorial',
    props: ['id'],

    headers: [
        Header('Fecha', 'fecha'),
        Header('Estado', 'estado'),
        Header('Documento', 'tipo_doc')
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
    }

}
</script>

<style>

</style>
