<template>
  <v-container v-if="comprobante">
    <v-layout row wrap>
      <v-flex xs6>
        Comprobante N°: {{ comprobante.numero }}<br>
      </v-flex>

      <v-flex xs6>
        Fecha: {{ comprobante.fecha | fecha }} <br>
        <!-- Tipo de Comprobante: {{ comprobante.tipo_comprobante.abreviatura }}<br> -->
      </v-flex>
    </v-layout>

    <br>

    <v-data-table
        :headers="$options.headers.comprobante"
        :items="comprobante.items"
        class="elevation-1"
        no-data-text="No hay items"
        hide-actions
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.item }}</td>
        <td>{{ props.item.descripcion }}</td>
        <td>{{ props.item.importe | round }}</td>
      </template>
    </v-data-table>

    <br>
    <v-data-table
        :headers="$options.headers.pago"
        :items="comprobante.pagos"
        class="elevation-1"
        no-data-text="No hay pagos"
        hide-actions
    >
      <template slot="items" slot-scope="props">
        <td>{{ getFormaPago(props.item.forma_pago) }}</td>
        <td>{{ props.item.fecha_pago | fecha }}</td>
        <td>{{ props.item.importe | round  }}</td>
      </template>
      <template slot="footer">
        <td colspan="2" style="text-align:right;font-size:13px"><strong>Total Comprobante</strong></td>
        <td style="font-size:13px">{{ total | round }}</td>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import api from '@/services/api'
import * as utils from '@/utils';
import { Header } from '@/model'

let formas_pago = [];

export default {
  name: 'DetalleComprobante',
  props: ['comprobante'],

  data () {
    return {
      formas_pago: []
    }
  },

  headers: {
    comprobante: [
      Header('N°', 'item' ),
      Header('Descripción', 'descripcion'),
      Header('Importe', 'importe')
    ],

    pago: [
      Header('Forma de Pago', 'forma_pago'),
      Header('Fecha', 'fecha'),
      Header('Importe', 'importe')
    ]
  },

  created: function() {
    api.get('/opciones?sort=+valor')
    .then(r => {
      this.formas_pago = r.data.formaPago;
    })
    .catch(e => console.error(e));
  },

  computed: {
    total: function() {
      return this.comprobante.pagos.reduce((prev, act) => prev + +act.importe, 0);
    }
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
