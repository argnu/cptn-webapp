<template>
  <v-container v-if="comprobante">
    <v-layout row wrap>
      <v-flex xs6>
        Número: {{ comprobante.numero }}<br>
      </v-flex>

      <v-flex xs6>
        Fecha: {{ comprobante.fecha | fecha }} <br>
        <!-- Tipo de Comprobante: {{ comprobante.tipo_comprobante.abreviatura }}<br> -->
      </v-flex>
    </v-layout>

    <br>

    <v-data-table
        :headers="headers"
        :items="comprobante.items"
        class="elevation-1"
        no-data-text="No hay items"
        hide-actions
        >
      <template slot="headers" slot-scope="props">
        <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
          <b>{{ header.text }}</b>
        </th>
      </template>
      <template slot="items" slot-scope="props">
        <td>{{ props.item.item }}</td>
        <td>{{ props.item.descripcion }}</td>
        <td>{{ props.item.importe | round }}</td>
      </template>
    </v-data-table>

    <br>
    <v-data-table
        :headers="headers_pagos"
        :items="comprobante.pagos"
        class="elevation-1"
        no-data-text="No hay pagos"
        hide-actions
    >
      <template slot="headers" slot-scope="props">
        <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
          <b>{{ header.text }}</b>
        </th>
      </template>
      <template slot="items" slot-scope="props">
        <td>{{ getFormaPago(props.item.forma_pago) }}</td>
        <td>{{ props.item.fecha_pago | fecha }}</td>
        <td>{{ props.item.importe | round  }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import api from '@/services/api'
import * as utils from '@/utils';

const headers = [
  { text: 'N°', value: 'item' },
  { text: 'Descripción', value: 'descripcion' },
  { text: 'Importe', value: 'importe' }
];

const headers_pagos = [
  { text: 'Forma de Pago', value: 'forma_pago' },
  { text: 'Fecha', value: 'fecha' },
  { text: 'Importe', value: 'importe' }
];

let formas_pago = [];

export default {
  name: 'DetalleComprobante',
  props: ['comprobante'],

  data () {
    return {
      formas_pago: []
    }
  },

  computed: {
    headers: function() {
      return headers;
    },

    headers_pagos: function() {
      return headers_pagos;
    }
  },

  created: function() {
    api.get('/opciones?sort=+valor')
    .then(r => {
      this.formas_pago = r.data.formaPago;
    })
    .catch(e => console.error(e));
  },

  methods: {
    getFormaPago: function(id) {
      if (!id) return '';
      let forma_pago = this.formas_pago.find(f => f.id == id);
      return forma_pago ? forma_pago.nombre : '';
    }
  },

}
</script>

<style>
</style>
