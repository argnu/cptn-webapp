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

    <template v-if="exencion.boleta">
      <detalle-boleta :id="exencion.boleta.id"></detalle-boleta>
    </template>
  </v-container>
</template>

<script>
import api from '@/services/api'
;
import DetalleBoleta from './DetalleBoleta'

export default {
  name: 'DetalleExencion',
  props: ['id'],

  components: {
      DetalleBoleta
  },

  data () {
    return {
      exencion: {}
    }
  },

  created: function() {
    this.update();
  },

  methods: {
    update: function() {
      let url = `/comprobantes-exenciones/${this.id}`;

      api.get(url)
      .then(r => { 
        this.exencion = r.data;
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
