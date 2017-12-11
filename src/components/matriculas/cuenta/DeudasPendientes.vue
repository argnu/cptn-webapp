<template>
  <v-container>

    <br>

    <v-layout row wrap>
      <v-flex xs8>
        <v-data-table
            :headers="headers_resumen"
            :items="boletas"
            class="elevation-1"
            :rows-per-page-items="[5, 10, 25]"
            no-data-text="No hay deudas pendientes"
        >
          <template slot="headers" scope="props">
            <th v-for="header of props.headers" class="pa-3 text-xs-left">
              <b>{{ header.text }}</b>
            </th>
          </template>
          <template slot="items" scope="props">
            <tr>
              <td>{{ props.item.fecha | fecha }}</td>
              <td>{{ props.item.tipo_comprobante.descripcion }}</td>
              <td>{{ props.item.fecha_vencimiento | fecha }}</td>
              <td>${{ props.item.total }}</td>
              <td>${{ props.item.interes | round }}</td>
              <td></td>
              <td>
                <v-checkbox
                  v-model="props.item.checked"
                >
                </v-checkbox>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>

      <v-flex xs4>
        <input-fecha
          class="ml-5"
          label="Fecha de Pago"
          v-model="fecha_pago"
          @input="updateIntereses"
        >
        </input-fecha>

        <v-text-field
          class="mx-5"
          label="Subtotal"
          :value="subtotal"
          prefix="$"
          readonly
        >
        </v-text-field>

        <v-text-field
          class="mx-5"
          label="Intereses"
          :value="intereses_total"
          prefix="$"
          readonly
        >
        </v-text-field>

        <v-text-field
          class="mx-5"
          label="Importe Total"
          :value="importe_total"
          prefix="$"
          readonly
        >
        </v-text-field>

        <v-btn
          dark
          class="blue darken-1 mx-5"
          style="width:100%"
          @click="expand_pago = true"
        >
          Pagar
        </v-btn>

      </v-flex>
    </v-layout>

    <br>

    <v-dialog v-model="expand_pago" fullscreen transition="dialog-bottom-transition" :overlay=false>
      <v-card>
        <v-toolbar dark class="blue">
          <v-toolbar-title class="white--text">Recibo de Pago</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="expand_pago = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <cobranza
          @cancelar="expand_pago = false"
        >
        </cobranza>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import axios from '@/axios'
import * as moment from 'moment'
import * as utils from '@/utils'
import { calculoIntereses } from '@/utils/cobranza'
import InputFecha from '@/components/base/InputFecha'
import Cobranza from '@/components/cobranzas/Cobranza'

const headers = [
  { text: 'Fecha' },
  { text: 'Descripción' },
  { text: 'Fecha de Vencimiento' },
  { text: 'Importe' },
  { text: 'Intereses' }
]

export default {
  name: 'DeudasPendientes',
  props: ['id'],

  components: {
    InputFecha,
    Cobranza
  },

  data () {
    return {
      boletas: [],
      fecha_pago: moment().format('DD/MM/YYYY'),
      expand_pago: false
    }
  },

  computed: {
    headers_resumen: function() {
      return headers;
    },

    subtotal: function() {
      return this.boletas.length ?
        utils.round(this.boletas.reduce((prev, act) => prev + ( act.checked ? act.total : 0 ), 0), 2)
        : 0;
    },

    intereses_total: function() {
      return this.boletas.length ?
        utils.round(this.boletas.reduce((prev, act) => prev + ( act.checked ? act.interes : 0 ), 0), 2)
        : 0;
    },

    importe_total: function() {
      return this.subtotal + this.intereses_total;
    }
  },

  created: function() {
    let url_boletas = `/boletas?matricula=${this.id}&sort=+fecha_vencimiento&estado=1`;
    axios.get(url_boletas)
    .then(r => {
      this.boletas = r.data.map(b => {
        b.checked = false;
        b.interes = calculoIntereses(b, moment(this.fecha_pago, 'DD/MM/YYYY'));
        return b;
      })
    })
    .catch(e => console.error(e));
  },

  methods: {
    updateIntereses: function() {
      this.boletas.forEach(b => b.interes = calculoIntereses(b, moment(this.fecha_pago, 'DD/MM/YYYY')));
    }
  },

}
</script>

<style>
</style>
