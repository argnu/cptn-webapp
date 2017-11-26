<template>
  <div v-if="boleta">
    <v-layout row wrap>
      <v-flex xs6>
        Número: {{ boleta.numero }}<br>
        Fecha: {{ boleta.fecha | fecha }} <br>
        Estado: {{ boleta.estado.valor }} <br>
        Fecha de Vencimiento: {{ boleta.fecha_vencimiento | fecha }}<br>
      </v-flex>

      <v-flex xs6>
        Tipo de Comprobante: {{ boleta.tipo_comprobante.abreviatura }}<br>
        Fecha de Pago: {{ boleta.fecha_pago | fecha }}<br>
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
  </div>
</template>

<script>
import * as utils from '@/utils';

const headers = [
  { text: 'N°', value: 'item' },
  { text: 'Descripción', value: 'descripcion' },
  { text: 'Importe', value: 'importe' }
];

export default {
  name: 'DetalleBoleta',
  props: ['boleta'],

  data () {
    return {
    }
  },

  computed: {
    headers: function() {
      return headers;
    }
  },

  methods: {
  },

}
</script>

<style>
</style>
