<template>
  <div v-if="boleta">
    <v-layout row wrap>
      <v-flex xs6>
        N°: {{ boleta.numero }}<br>
        Fecha: {{ boleta.fecha | fecha }} <br>
        Estado: {{ boleta.estado ? boleta.estado.valor : '' }} <br>
        Fecha de Vencimiento: {{ boleta.fecha_vencimiento | fecha }}<br>
      </v-flex>

      <v-flex xs6>
        Tipo de Comprobante: {{ boleta.tipo_comprobante ? boleta.tipo_comprobante.abreviatura : '' }}<br>
        Fecha de Pago: 
          <span v-if="boleta.estado && boleta.estado.id == 2">{{ boleta.fecha_update | fecha }}
          </span><br>
      </v-flex>
    </v-layout>

    <br>

    <v-data-table
        v-if="boleta.items"
        :headers="$options.headers"
        :items="boleta.items"
        class="elevation-1"
        no-data-text="No hay items"
        hide-actions
    >
      <template slot="items" slot-scope="props">
        <tr>
          <td>{{ props.item.item }}</td>
          <td>{{ props.item.descripcion }}</td>
          <td>{{ props.item.importe | round }}</td>
        </tr>
      </template>
      <template slot="footer">
        <tr v-if="boleta.interes && boleta.interes > 0">
          <td></td>
          <td style="font-size:13px">Intereses</td>
          <td style="font-size:13px">{{ boleta.interes | round }}</td>          
        </tr>        
        <tr>
          <td colspan="2" style="text-align:right;font-size:13px"><strong>Total Boleta</strong></td>
          <td style="font-size:13px">{{ total | round }}</td>
        </tr>
      </template>      
    </v-data-table>
  </div>
</template>

<script>
import { Header } from '@/model'

export default {
  name: 'DetalleBoleta',
  props: ['boleta'],

  headers: [
    Header('N°', 'item'),
    Header('Descripción', 'descripcion'),
    Header('Importe', 'importe' )
  ],

  computed: {
    total: function() {
      return this.boleta.items.reduce((prev, act) => prev + +act.importe, 0);
    }
  },  
}
</script>

<style>
</style>
