<template>
  <v-dialog v-model="show" persistent max-width="600" scrollable>
    <v-card v-if="boleta">
      <v-card-title class="headline">Detalle de Boleta</v-card-title>
      <v-card-text class="grey lighten-5">
        <v-layout row wrap>
          <v-flex xs6>
            Número: {{ boleta.numero }}<br>
            Fecha: {{ boleta.fecha | formatFecha }} <br>
            Estado: {{ boleta.estado.valor }} <br>
            Fecha de Vencimiento: {{ boleta.fecha_vencimiento | formatFecha }}<br>
          </v-flex>

          <v-flex xs6>
            Tipo de Comprobante: {{ boleta.tipo_comprobante.abreviatura }}<br>
            Fecha de Pago: {{ boleta.fecha_pago | formatFecha }}<br>
            <!-- Tipo de Pago: {{ boleta.tipo_pago }}<br> -->
          </v-flex>
        </v-layout>

        <br>

        <v-data-table
            :headers="headers"
            :items="boleta.items"
            class="elevation-1"
            no-data-text="No hay items"
            hide-actions
            >
          <template slot="headers" scope="props">
            <th v-for="header of props.headers" style="padding: 20px">
              {{ header.text }}
            </th>
          </template>
          <template slot="items" scope="props">
            <td>{{ props.item.item }}</td>
            <td>{{ props.item.descripcion }}</td>
            <td>{{ props.item.importe }}</td>
          </template>
        </v-data-table>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="green darken-1" flat @click.native="show = false">Cerrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import * as utils from '@/utils';

const headers = [
  { text: 'N°', value: 'item' },
  { text: 'Descripción', value: 'descripcion' },
  { text: 'Importe', value: 'importe' }
];

export default {
  name: 'DialogDetalle',
  props: ['boleta'],
  data () {
    return {
      show: false
    }
  },

  filters: {
    formatFecha: function(str) {
      return str ? utils.formatFecha(str) : '';
    }
  },

  computed: {
    headers: function() {
      return headers;
    }
  },

  created: function() {
  },

  methods: {
    mostrar: function() {
      this.show = true;
    }
  },

}
</script>

<style>
</style>
