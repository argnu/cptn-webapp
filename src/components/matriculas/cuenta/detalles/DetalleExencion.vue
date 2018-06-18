<template>
  <v-container v-if="exencion">
    <v-layout row wrap>
      <v-flex xs6>
        <div>
            Fecha: {{ exencion.fecha | fecha }} <br>
        </div>              
      </v-flex>

      <v-flex xs6>
        <div>
            Importe: {{ exencion.importe }} <br>
        </div>        
      </v-flex>
    </v-layout>

    <v-divider class="my-3"></v-divider>

    <detalle-boleta
        :boleta="exencion.boleta"
    ></detalle-boleta>
  </v-container>
</template>

<script>
import api from '@/services/api'
import * as utils from '@/utils';
import DetalleBoleta from './DetalleBoleta'

export default {
  name: 'DetalleExencion',
  props: ['exencion'],

  components: {
      DetalleBoleta
  }
}
</script>

<style>
</style>
