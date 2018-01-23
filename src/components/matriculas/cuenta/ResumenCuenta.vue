<template>
    <v-card>
      <dialog-detalle :item="item_selected" ref="show_detalle">
      </dialog-detalle>

      <br>
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
              no-data-text="No hay datos"
              no-results-text="No hay datos"
              :rows-per-page-items="[25,30,35]"
          >
            <template slot="headers" slot-scope="props">
              <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
                <b>{{ header.text }}</b>
              </th>
            </template>
            <template slot="items" slot-scope="props">
              <tr>
                <td>{{ props.item.fecha | fecha }}</td>
                <td>{{ props.item.fecha_vencimiento | fecha }}</td>
                <td v-if="props.item.tipo == 'boleta'">{{ props.item.tipo_comprobante.descripcion }}</td>
                <td v-if="props.item.tipo == 'comprobante'">Recibo</td>
                <td>{{ props.item.tipo == 'boleta' ? props.item.total : '' }}</td>
                <td>{{ props.item.tipo == 'comprobante' ? props.item.importe_cancelado : '' }}</td>
                <td>
                  <v-btn fab dark small color="blue" @click="verDetalle(props.item)">
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
            <template slot="items" slot-scope="props">
              <td>{{props.item.t}}</td>
              <td>{{props.item.d}}</td>
              <td>{{props.item.h}}</td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-card>
</template>

<script>
import axios from '@/axios';
import * as utils from '@/utils';
import moment from 'moment';
import rules from '@/rules';
import DatosBasicos from '@/components/matriculas/DatosBasicos';
import DialogDetalle from '@/components/matriculas/cuenta/detalles/DialogDetalle';
import InputFecha from '@/components/base/InputFecha';

const headers = [
  { text: 'Fecha' },
  { text: 'Fecha de Vencimiento' },
  { text: 'Descripción' },
  { text: 'Debe' },
  { text: 'Haber' }
]

const orderByFecha = function(a, b) {
  return moment(a.fecha_vencimiento).diff(b.fecha_vencimiento, 'days')
}

export default {
  name: 'ResumenCuenta',
  props: ['id'],
  data () {
    return {
      resumen: [],
      boletas: [],
      show_detalle: false,
      item_selected: null,
      filtros: {
        fecha_desde: moment().startOf('year').format("DD/MM/YYYY"),
        fecha_hasta: moment().endOf('year').format("DD/MM/YYYY")
      },
    }
  },

  computed: {
    headers_resumen: function() {
      return headers;
    },

    totales_debe: function() {
      return this.resumen.length ?
        this.resumen.reduce((prev, act) => prev + (act.tipo == 'boleta' ? act.total : 0), 0)
        : 0;
    },

    totales_haber: function() {
      return this.resumen.length ?
        this.resumen.reduce((prev, act) => prev + (act.tipo == 'comprobante' ? act.importe_cancelado : 0), 0)
        : 0;
    },

    saldo_deudor: function() {
      return this.totales_debe - this.totales_haber;
    },

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
      let url_boletas = `/boletas?matricula=${this.id}&sort=+fecha_vencimiento`;
      let url_comprobantes = `/comprobantes?matricula=${this.id}&sort=+fecha_vencimiento`;

      if (rules.fecha(this.filtros.fecha_desde)) {
        url_boletas += `&fecha_desde=${this.filtros.fecha_desde}`;
        url_comprobantes  += `&fecha_desde=${this.filtros.fecha_desde}`;
      }

      if (rules.fecha(this.filtros.fecha_hasta)) {
        url_boletas += `&fecha_hasta=${this.filtros.fecha_hasta}`;
        url_comprobantes += `&fecha_hasta=${this.filtros.fecha_hasta}`;
      }

      Promise.all([
        axios.get(url_boletas),
        axios.get(url_comprobantes)
      ])
     .then(([boletas, comprobantes]) => {
       let resumen = boletas.data.map(b => {
         b.tipo = 'boleta';
         return b;
       }).concat(comprobantes.data.map(c => {
         c.tipo = 'comprobante';
         return c;
       }));
       this.resumen = resumen.sort(orderByFecha);
     })
     .catch(e => console.error(e));
    },

    verDetalle: function(item) {
      this.item_selected = item;
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
