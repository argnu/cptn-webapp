<template>
  <div v-if="boleta">
    <v-layout row wrap>
      <v-flex xs6>
        Número: {{ boleta.numero }}<br>
        Fecha: {{ boleta.fecha | fecha }} <br>
        Estado: {{ boleta.estado.valor }} <br>
        Fecha de Vencimiento: {{ boleta.fecha_vencimiento | fecha }}<br>
      </v-flex>

      <v-flex xs6>
        Tipo de Comprobante: {{ boleta.tipo_comprobante.abreviatura }}<br>
        Fecha de Pago: 
          <span v-if="boleta.estado.id == 2">{{ boleta.fecha_update | fecha }}
          </span><br>
      </v-flex>
    </v-layout>

    <br>

    <v-data-table
        :headers="$options.headers"
        :items="boleta.items"
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
  </div>
</template>

<script>
export default {
  name: 'DetalleBoleta',
  props: ['boleta'],

  headers: [
    { text: 'N°', value: 'item' },
    { text: 'Descripción', value: 'descripcion' },
    { text: 'Importe', value: 'importe' }
  ],
}
</script>

<style>
</style>
