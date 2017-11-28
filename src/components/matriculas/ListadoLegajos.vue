<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-data-table
          :headers="headers"
          :items="legajos"
          class="elevation-1"
          no-data-text="">
        <template slot="headers" scope="props">
          <th v-for="header of props.headers" class="pa-3 text-xs-left">
            <b>{{ header.text }}</b>
          </th>
        </template>
        <template slot="items" scope="props">
          <td>{{ props.item.fecha_solicitud | fecha }}</td>
          <td>{{ props.item.tipo | tipo_legajo }} - N° {{ props.item.solicitud }}</td>
          <!-- <td>{{ props.item.estado }}</td> -->
        </template>
      </v-data-table>
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

const tipos_legajos = ['Permiso de Construcción', 'Orden de Trabajo', 'Legajo Técnico'];

export default {
  name: 'ListadoLegajos',
  props: ['id'],

  data () {
    return {
      legajos: []
    }
  },

  filters: {
    tipo_legajo: function(num) {
      return num ? tipos_legajos[num-1] : '';
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
  },

}
</script>

<style>
</style>
