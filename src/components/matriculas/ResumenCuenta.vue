<template>
  <v-container>
      <dialog-detalle :boleta="boleta_selected" ref="show_detalle">
      </dialog-detalle>

      <datos-basicos></datos-basicos>
      <br>
      <v-layout row wrap>
        <v-flex xs12>
          <v-toolbar class="indigo" dark>
            <v-toolbar-title class="white--text">Resumen de Cuenta</v-toolbar-title>
          </v-toolbar>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs1 class="mt-5 mx-5">
          <b>Filtrar:</b>
        </v-flex>
        <v-flex xs4 class="ma-4">
          <input-fecha label="Fecha Desde" v-model="filtros.fecha_desde"></input-fecha>
        </v-flex>
        <v-flex xs4 class="ma-4">
          <input-fecha label="Fecha Hasta" v-model="filtros.fecha_hasta"></input-fecha>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <v-data-table
              :headers="headers_resumen"
              :items="resumen"
              class="elevation-1"
              no-data-text="">
            <template slot="headers" scope="props">
              <th v-for="header of props.headers" style="padding: 20px">
                {{ header.text }}
              </th>
            </template>
            <template slot="items" scope="props">
              <tr>
                <td>{{ props.item.fecha | formatFecha }}</td>
                <td>{{ props.item.fecha_vencimiento | formatFecha }}</td>
                <td>{{ props.item.tipo_comprobante.descripcion }}</td>
                <td>{{ props.item.total }}</td>
                <td></td>
                <td>
                  <v-btn icon @click="verDetalle(props.item)">
                    <v-icon>launch</v-icon>
                  </v-btn>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs6>
        </v-flex>
        <v-flex xs6>
          <v-data-table
              :items="[{ t: 'Totales', d: totales_debe, h: totales_haber }, { t: 'Saldo Deudor', h: saldo_deudor }]"
              class="elevation-1"
              hide-actions
              hide-headers
          >
            <template slot="items" scope="props">
              <td>{{props.item.t}}</td>
              <td>{{props.item.d}}</td>
              <td>{{props.item.h}}</td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>

      <br>

      <v-layout row wrap>
        <v-flex xs2>
          <v-btn dark class="blue darken-1">
            Cobrar
          </v-btn>
        </v-flex>
        <v-flex xs2>
          <v-btn dark class="blue darken-1">
            Condonar
          </v-btn>
        </v-flex>
        <v-flex xs2>
          <v-btn dark class="blue darken-1">
            Plan de Pago
          </v-btn>
        </v-flex>
      </v-layout>

    </v-container>
</template>

<script>
import * as axios from 'axios';
import * as utils from '@/utils';
import rules from '@/rules';
import DatosBasicos from '@/components/matriculas/DatosBasicos';
import DialogDetalle from '@/components/matriculas/DialogDetalle';
import InputFecha from '@/components/base/InputFecha';

const headers = [
  { text: 'Fecha' },
  { text: 'Fecha de Vencimiento' },
  { text: 'Descripción' },
  { text: 'Debe' },
  { text: 'Haber' }
]

export default {
  name: 'ResumenCuenta',
  props: ['id'],
  data () {
    return {
      resumen: [],
      boletas: [],
      show_detalle: false,
      boleta_selected: null,
      filtros: {
        fecha_desde: '',
        fecha_hasta: ''
      },
    }
  },

  computed: {
    headers_resumen: function() {
      return headers;
    },

    totales_debe: function() {
      return this.resumen.length ?
        this.resumen.reduce((prev, act) => prev + act.total, 0)
        : 0;
    },

    totales_haber: function() {
      return 0;
    },

    saldo_deudor: function() {
      return this.totales_debe - this.totales_haber;
    },

  },

  filters: {
    formatFecha: function(str) {
      return str ? utils.formatFecha(str) : '';
    }
  },

  watch: {
    filtros: {
      handler () {
        if ( (rules.fecha(this.filtros.fecha_desde) === true
                || !this.filtros.fecha_desde.length)
          && ( rules.fecha(this.filtros.fecha_hasta) === true
            || !this.filtros.fecha_hasta.length)
          )
          this.updateBoletas();
      },
      deep: true
    }
  },

  created: function() {
    this.updateBoletas();
  },

  methods: {
    updateBoletas: function() {
      let url = `http://localhost:3400/api/boletas?matricula=${this.id}`;
      if (rules.fecha(this.filtros.fecha_desde)) url += `&fecha_desde=${this.filtros.fecha_desde}`;
      if (rules.fecha(this.filtros.fecha_hasta)) url += `&fecha_hasta=${this.filtros.fecha_hasta}`;

      axios.get(url)
           .then(r => this.resumen = r.data)
           .catch(e => console.error(e));
    },

    verDetalle: function(boleta) {
      this.boleta_selected = boleta;
      this.$refs.show_detalle.mostrar();
    },

  },

  components: {
    DatosBasicos,
    DialogDetalle,
    InputFecha
  }

}
</script>

<style>
</style>
