<template>
  <v-dialog v-model="show" persistent max-width="600" scrollable>
    <v-card v-if="item">
      <v-card-title class="headline" color="primary">
        {{ titulo }}
      </v-card-title>
      <v-card-text class="grey lighten-5">
        <template v-if="tipo == 'boleta'">
          <detalle-boleta :boleta="item"></detalle-boleta>
        </template>
        <template v-else-if="tipo == 'comprobante'">
          <detalle-comprobante :comprobante="item"></detalle-comprobante>
        </template>
        <template v-else-if="tipo == 'volante'">
          <detalle-volante-pago :volante="item"></detalle-volante-pago>
        </template>
        <template v-else-if="tipo == 'exencion'">
          <detalle-exencion :exencion="item"></detalle-exencion>
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
import api from '@/services/api'
import DetalleBoleta from './DetalleBoleta'
import DetalleComprobante from './DetalleComprobante'
import DetalleVolantePago from './DetalleVolantePago'
import DetalleExencion from './DetalleExencion'

export default {
  name: 'DetalleDialog',
  
  props: ['id', 'tipo'],

  components: {
    DetalleBoleta,
    DetalleComprobante,
    DetalleVolantePago,
    DetalleExencion
  },

  data () {
    return {
      show: false,
      item: {},
      titulo: ''
    }
  },

  watch: {
    id: function() {
      this.update();
    },

    tipo: function() {
      this.update();
    }
  },

  methods: {
    mostrar: function() {
      this.show = true;
    },

    update: function() {
      let url;
      if (this.tipo == 'boleta') url = '/boletas';
      else if (this.tipo == 'volante') url = '/volantespago';
      else if (this.tipo == 'comprobante') url = '/comprobantes';
      else if (this.tipo == 'exencion') url = '/exenciones';

      url += `/${this.id}`;
      api.get(url)
      .then(r => {
        this.item = r.data;
        if (this.tipo == 'boleta') this.titulo = r.data.items[0].descripcion;
        else if (this.tipo == 'volante') this.titulo = `Volante de Pago N° ${r.data.id}`;
        else if (this.tipo == 'comprobante') this.titulo = `Recibo N° ${r.data.numero}`;
        else if (this.tipo == 'exencion') this.titulo = r.data.tipo.descripcion;
      })
      .catch(e => {
        console.error(e);
      })
    }
  }

}
</script>

<style>
</style>
