<template>
  <v-container>
    <datos-basicos></datos-basicos>
    <br>

    <v-layout row wrap>
      <v-flex xs12>
        <v-data-table
            :headers="headers_resumen"
            :items="boletas"
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
              <td>{{ props.item.tipo_comprobante.descripcion }}</td>
              <td>{{ props.item.fecha_vencimiento | formatFecha }}</td>
              <td>{{ props.item.total }}</td>
              <td>{{ props.item.interes }}</td>
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
    </v-layout>

    <br>
    <v-layout row wrap>
      <v-flex xs2>
        <v-subheader>Intereses:</v-subheader>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          :value="intereses"
          readonly
        >
        </v-text-field>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs2>
        <v-subheader>Importe Total:</v-subheader>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          :value="importe_total"
          readonly
        >
        </v-text-field>
      </v-flex>
    </v-layout>

    <br>
    <v-layout row wrap>
      <v-flex xs10>
      </v-flex>
      <v-flex xs2>
        <v-btn dark class="blue darken-1">
          Pagar
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from '@/axios';
import * as utils from '@/utils';
import DatosBasicos from '@/components/matriculas/DatosBasicos';

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

  data () {
    return {
      boletas: []
    }
  },

  filters: {
    formatFecha: function(str) {
      return str ? utils.formatFecha(str) : '';
    }
  },

  computed: {
    headers_resumen: function() {
      return headers;
    },

    importe_total: function() {
      return this.boletas.length ?
        this.boletas.reduce((prev, act) => prev + act.total, 0)
        : 0;
    },

    intereses: function() {
      return this.boletas.length ?
        this.boletas.reduce((prev, act) => prev + act.interes, 0)
        : 0;
    }
  },

  created: function() {
    let url_boletas = `/boletas?matricula=${this.id}&sort=+fecha_vencimiento&estado=1`;
    axios.get(url_boletas)
    .then(r => {
      this.boletas = r.data.map(b => {
        b.checked = false;
        b.interes = 0;
        return b;
      })
    })
    .catch(e => console.error(e));
  },

  methods: {
  },

  components: {
    DatosBasicos
  }

}
</script>

<style>
</style>
