<template>
  <v-dialog v-model="show" persistent max-width="600" scrollable>
    <v-card v-if="item">
      <v-card-title class="headline" color="primary">
        Detalle de {{ titulo_tipo }}
      </v-card-title>
      <v-card-text class="grey lighten-5">
        <template v-if="item.tipo == 'boleta'">
          <detalle-boleta :boleta="item"></detalle-boleta>
        </template>
        <template v-if="item.tipo == 'comprobante'">
          <detalle-comprobante :comprobante="item"></detalle-comprobante>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" class="darken-1" flat @click.native="show = false">
          <v-icon>close</v-icon>
          Cerrar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import DetalleBoleta from './DetalleBoleta';
import DetalleComprobante from './DetalleComprobante';

export default {
  name: 'DetalleDialog',
  props: ['item'],
  data () {
    return {
      show: false
    }
  },

  computed: {
    titulo_tipo: function() {
      let [a, ...rest] = this.item.tipo;
      return [a.toUpperCase()].concat(rest).join('');
    }
  },

  methods: {
    mostrar: function() {
      this.show = true;
    }
  },

  components: {
    DetalleBoleta,
    DetalleComprobante
  }

}
</script>

<style>
</style>
