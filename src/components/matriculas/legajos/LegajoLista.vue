<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card class="mt-5">
        <v-card-text>
          <v-btn
            absolute dark fab top right
            color="green"
            @click="nuevoLegajo"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <v-data-table
              :headers="headers"
              :items="legajos"
              no-data-text=""
              :rows-per-page-items="[25,30,35]"
              :loading="loading"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td>{{ props.item.fecha_solicitud | fecha }}</td>
                <td>{{ props.item.descripcion }}</td>
                <td>
                  <v-btn fab dark small @click="imprimir(props.item.id)" color="blue">
                    <v-icon>print</v-icon>
                  </v-btn>                
                  <v-btn fab dark small @click="verDetalle(props.item.id)" color="blue">
                    <v-icon>launch</v-icon>
                  </v-btn>
                </td>                
              </tr>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from '@/axios';
import * as utils from '@/utils'
import { Header } from '@/model'
import { impresionLegajo } from '@/utils/PDFUtils'
import { getTipoLegajo } from '@/utils/legajo'

const headers = [
  Header('Fecha', 'fecha_solicitud', true),
  Header('Descripción', 'descripcion', true),
  Header('', 'acciones')
]


export default {
  
  name: 'LegajoLista',

  props: ['id'],

  data () {
    return {
      legajos: [],
      legajos_original: [],
      loading: false,
    }
  },

  computed: {
    headers: function() {
      return headers;
    }
  },

  watch: {
    'pagination.sortBy': function(sortBy) {
      if (sortBy) {
        if (sortBy.includes('fecha')) this.legajos = this.legajos.sort(utils.sortByFecha(sortBy));
        else if (sortBy == 'descripcion') this.legajos = this.legajos.sort(utils.sortByString(sortBy));
      }
      else this.legajos = utils.clone(this.legajos_original);
    }
  },    

  created: function() {
    this.loading = true;
    axios.get(`/matriculas/${this.id}/legajos`)
    .then(r => {
      this.legajos = r.data.map(l => {
       l.descripcion = `${getTipoLegajo(l.tipo)} - N° ${l.numero_legajo}`; 
       return l;
      });
      this.legajos_original = utils.clone(this.legajos);
      this.loading = false;
    })
    .catch(e => console.error(e));
  },

  methods: {
    verDetalle: function(id) {
      this.$router.push({ path: `/legajos/${id}` });
    },

    nuevoLegajo: function() {
      this.$router.push({ path: `/matriculas/${this.id}/nuevo-legajo` });
    },

    imprimir: function(id) {
      Promise.all([
        axios.get(`/legajos/${id}`),
        axios.get('/tareas/categorias')
      ])
      .then(([legajo, categorias]) => {        
        let categoria = categorias.data.find(c => c.subcategorias.find(s => s.id == legajo.data.subcategoria))
        let pdf = impresionLegajo(legajo.data, categoria);
        pdf.save(`${getTipoLegajo(legajo.data.tipo)} - N° ${legajo.data.numero_legajo}.pdf`)
      }) 
    }    
  },

}
</script>

<style>
</style>
