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
          >
            <template slot="headers" slot-scope="props">
              <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
                <b>{{ header.text }}</b>
              </th>
              <th></th>
            </template>
            <template slot="items" slot-scope="props">
              <td>{{ props.item.fecha_solicitud | fecha }}</td>
              <td>{{ props.item.tipo | tipo_legajo }} - N° {{ props.item.numero_legajo }}</td>
              <td>
                <v-btn fab dark small @click="imprimir(props.item.id)" color="blue">
                  <v-icon>print</v-icon>
                </v-btn>                
                <v-btn fab dark small @click="verDetalle(props.item.id)" color="blue">
                  <v-icon>launch</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import axios from '@/axios';
import { impresionLegajo } from '@/utils/PDFUtils'
import { getTipoLegajo } from '@/utils/legajo'

const Header = (text, value) => ({
  text, value
})

const headers = [
  Header('Fecha', 'fecha'),
  Header('Descripción', 'descripcion'),
  // Header('Estado', 'estado')
]


export default {
  name: 'ListadoLegajos',
  props: ['id'],

  data () {
    return {
      legajos: []
    }
  },

  computed: {
    headers: function() {
      return headers;
    }
  },

  created: function() {
    axios.get(`/matriculas/${this.id}/legajos`)
    .then(r => {
      this.legajos = r.data;
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
