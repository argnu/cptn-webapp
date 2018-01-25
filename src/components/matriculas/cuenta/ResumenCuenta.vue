<template>
    <v-card>
      <dialog-detalle :item="item_selected" ref="show_detalle">
      </dialog-detalle>

      <v-layout row class="mt-4">
        <v-flex xs12>
          <v-btn class="green right" dark @click="showAddBoleta">
            <v-icon class="mr-2">add</v-icon>
            Nueva Boleta
          </v-btn>
        </v-flex>
      </v-layout>

      <v-layout row wrap class="mt-4">
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
              v-bind:pagination.sync="pagination"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td>{{ props.item.fecha | fecha }}</td>
                <td>{{ props.item.fecha_vencimiento | fecha }}</td>
                <td>{{ props.item.descripcion }}</td>
                <td>{{ props.item.debe }}</td>
                <td>{{ props.item.haber }}</td>
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

      <v-dialog v-model="show_addboleta" fullscreen transition="dialog-bottom-transition" :overlay="false">
        <v-card>
          <v-toolbar dark class="blue">
            <v-toolbar-title class="white--text">Nueva Boleta</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="show_addboleta = false">
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar>
          
          <nueva-boleta
            :id-matricula="id"
            @cancelar="show_addboleta = false"
            @update="nuevaBoleta"
          ></nueva-boleta>

        </v-card>
      </v-dialog>      
    </v-card>
</template>

<script>
import axios from '@/axios'
import * as utils from '@/utils'
import moment from 'moment'
import { Header } from '@/model'
import DatosBasicos from '@/components/matriculas/DatosBasicos';
import DialogDetalle from '@/components/matriculas/cuenta/detalles/DialogDetalle';
import NuevaBoleta from '@/components/matriculas/cuenta/NuevaBoleta';
import InputFecha from '@/components/base/InputFecha';
import ValidatorMixin from '@/components/mixins/ValidatorMixin';

const headers = [
  Header('Fecha', 'fecha', true),
  Header('Fecha de Vencimiento', 'fecha_vencimiento', true),
  Header('Descripción', 'descripcion', true),
  Header('Debe', 'debe', true),
  Header('Haber', 'haber', true),
  Header('', 'detalle')
]

const sortByFecha = (atributo) => {
  return (a, b) => moment(a[atributo]).diff(b[atributo], 'days');
}

const sortByString = (atributo) => {
  return (a, b) => a[atributo].localeCompare(b[atributo]);
}

const sortByNumber = (atributo) => {
  return (a, b) => b[atributo] - a[atributo];
}

export default {
  name: 'ResumenCuenta',
  props: ['id'],
  mixins: [ValidatorMixin],

  data () {
    return {
      resumen: [],
      resumen_original: [],
      boletas: [],
      show_detalle: false,
      show_addboleta: false,
      item_selected: null,
      pagination: {
        sortBy: 'fecha_vencimiento',
        descending: false
      },
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
        if ( (this.rules.fecha(this.filtros.fecha_desde) === true
                || !this.filtros.fecha_desde.length)
          && ( this.rules.fecha(this.filtros.fecha_hasta) === true
            || !this.filtros.fecha_hasta.length)
          )
          this.updateBoletas();
      },
      deep: true
    },

    'pagination.sortBy': function(sortBy) {
      if (sortBy) {
        if (sortBy.includes('fecha')) this.resumen = this.resumen.sort(sortByFecha(sortBy));
        else if (sortBy == 'debe' || sortBy == 'haber') this.resumen = this.resumen.sort(sortByNumber(sortBy));
        else this.resumen = this.resumen.sort(sortByString(sortBy));
      }
      else this.resumen = utils.clone(this.resumen_original);
    }
  },

  created: function() {
    this.updateBoletas();
  },

  methods: {
    updateBoletas: function() {
      let url_boletas = `/boletas?matricula=${this.id}&sort=+fecha_vencimiento`;
      let url_comprobantes = `/comprobantes?matricula=${this.id}&sort=+fecha_vencimiento`;

      if (this.rules.fecha(this.filtros.fecha_desde)) {
        url_boletas += `&fecha_desde=${this.filtros.fecha_desde}`;
        url_comprobantes  += `&fecha_desde=${this.filtros.fecha_desde}`;
      }

      if (this.rules.fecha(this.filtros.fecha_hasta)) {
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
         b.debe = b.total;
         b.descripcion = b.tipo_comprobante.descripcion;
         return b;
       }).concat(comprobantes.data.map(c => {
         c.tipo = 'comprobante';
         c.haber = c.importe_cancelado;
         c.descripcion = 'Recibo';
         return c;
       }));
       this.resumen = resumen;
       this.resumen_original = utils.clone(resumen);
       this.resumen = this.resumen.sort(sortByFecha('fecha_vencimiento'));
     })
     .catch(e => console.error(e));
    },

    verDetalle: function(item) {
      this.item_selected = item;
      this.$refs.show_detalle.mostrar();
    },

    showAddBoleta: function() {
      this.show_addboleta = true;
    },

    nuevaBoleta: function() {
      this.updateBoletas();
      this.show_addboleta = false;
    }

  },

  components: {
    DatosBasicos,
    DialogDetalle,
    InputFecha,
    NuevaBoleta
  }

}
</script>

<style>
</style>
