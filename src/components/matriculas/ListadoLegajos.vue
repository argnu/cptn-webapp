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
              no-data-text="">
            <template slot="headers" scope="props">
              <th v-for="header of props.headers" class="pa-3 text-xs-left">
                <b>{{ header.text }}</b>
              </th>
              <th></th>
            </template>
            <template slot="items" scope="props">
              <td>{{ props.item.fecha_solicitud | fecha }}</td>
              <td>{{ props.item.tipo | tipo_legajo }} - N° {{ props.item.solicitud }}</td>
              <td>
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
    }
  },

}
</script>

<style>
</style>
