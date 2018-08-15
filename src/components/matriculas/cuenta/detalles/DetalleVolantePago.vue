<template>
  <v-container v-if="volante">
    <v-layout row wrap>
      <v-flex xs6>
        <div>
            N° Volante: {{ volante.id }}
        </div>

        <div class="my-1">
            Fecha de Venc.: {{ volante.fecha_vencimiento | fecha }} <br>
        </div>
      </v-flex>

      <v-flex xs6>
        <div>
            Fecha: {{ volante.fecha | fecha }} <br>
        </div>
      </v-flex>
    </v-layout>

    <br>

    <span class="subheading blue--text text--darken-4"><b>Boletas</b></span>

    <br>
    <v-divider class="my-3"></v-divider>

    <template v-for="boleta of volante.boletas">
        <detalle-boleta
            :key="'boleta' + boleta.id"
            :id="boleta.id"
        ></detalle-boleta>
        <v-divider class="my-3" :key="'divider' + boleta.id"></v-divider>
    </template>

    <table class="right table-totales">
        <tbody>
            <tr>
                <td class="celda-titulo">Subtotal:</td>
                <td>{{ volante.subtotal | round }}</td>
            </tr>
            <tr>
                <td class="celda-titulo">Total Intereses:</td>
                <td>{{ volante.interes_total | round }}</td>
            </tr>
            <tr>
                <td class="celda-titulo">Total:</td>
                <td>{{ volante.importe_total | round }}</td>
            </tr>
        </tbody>
    </table>
  </v-container>
</template>

<script>
import api from '@/services/api'
import * as utils from '@/utils';
import { Header } from '@/model'
import DetalleBoleta from './DetalleBoleta'

export default {
  name: 'DetalleVolantePago',
  props: ['id'],

  components: {
      DetalleBoleta
  },

  headers: [
    Header('N°', 'item' ),
    Header('Descripción', 'descripcion'),
    Header('Importe', 'importe')
  ],

  data () {
    return {
      volante: {}
    }
  },

  created: function() {
    this.update();
  },

  methods: {
    update: function() {
      let url = `/volantespago/${this.id}`;

      api.get(url)
      .then(r => this.volante = r.data)
      .catch(e => {
        console.error(e);
      })
    }
  }
}
</script>

<style>
.table-totales td {
    text-align: right;
}

.table-totales .celda-titulo {
    padding-right: 30px;
    font-weight: bold;
}
</style>
