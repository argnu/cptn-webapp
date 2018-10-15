<template>
  <v-container v-if="comprobante">
    <v-layout row wrap>
      <v-flex xs6>
        N° Recibo: {{ comprobante.numero }}<br>
      </v-flex>

      <v-flex xs6>
        Fecha: {{ comprobante.fecha | fecha }} <br>
      </v-flex>
    </v-layout>

    <br>

    <v-data-table
        v-if="comprobante.items"
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
        v-if="comprobante.pagos"
        :headers="$options.headers.pago"
        :items="comprobante.pagos"
        class="elevation-1"
        no-data-text="No hay pagos"
        hide-actions
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.forma_pago.nombre }}</td>
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
import { ColumnHeader } from '@/model'

let formas_pago = [];

export default {
  name: 'DetalleComprobante',
  
  props: ['id'],

  data () {
    return {
      comprobante: {},
      formas_pago: []
    }
  },

  headers: {
    comprobante: [
      ColumnHeader('N°', 'item' ),
      ColumnHeader('Descripción', 'descripcion'),
      ColumnHeader('Importe', 'importe')
    ],

    pago: [
      ColumnHeader('Forma de Pago', 'forma_pago'),
      ColumnHeader('Fecha', 'fecha'),
      ColumnHeader('Importe', 'importe')
    ]
  },


  watch: {
    id: function() {
      this.update();
    }
  },  

  computed: {
    total: function() {
      return this.comprobante.pagos.reduce((prev, act) => prev + +act.importe, 0);
    }
  },  

  created: function() {
    api.get('/opciones?sort=+valor')
    .then(r => {
      this.formas_pago = r.data.formaPago;
      this.update();
    })
    .catch(e => console.error(e));
  },

  methods: {
    update: function() {
      let url = `/comprobantes/${this.id}`;

      api.get(url)
      .then(r => this.comprobante = r.data)
      .catch(e => {
        console.error(e);
      })
    }     
  }

}
</script>

<style>
</style>
