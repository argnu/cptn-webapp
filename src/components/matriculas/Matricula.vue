<template>
  <v-container class="grey lighten-3" v-if="matricula">

    <datos-basicos :matricula="matricula">
    </datos-basicos>

    <br>

    <v-tabs fixed icons v-model="tab_selected">
      <v-tabs-bar>
        <v-tabs-slider color="white"></v-tabs-slider>
        <v-tabs-item href="#tab-detalle">
          <v-icon  :class="{ 'white--text': tab_selected == 'tab-detalle' }">account_box</v-icon>
          <span :class="{ 'white--text': tab_selected == 'tab-detalle' }">Detalle</span>
        </v-tabs-item>
        <v-tabs-item href="#tab-cuenta">
          <v-icon :class="{ 'white--text': tab_selected == 'tab-cuenta' }">
            account_balance
          </v-icon>
          <span :class="{ 'white--text': tab_selected == 'tab-cuenta' }">Cuenta</span>
        </v-tabs-item>
        <v-tabs-item href="#tab-legajo">
          <v-icon  :class="{ 'white--text': tab_selected == 'tab-legajo' }">work</v-icon>
          <span  :class="{ 'white--text': tab_selected == 'tab-legajo' }">Legajo Técnico</span>
        </v-tabs-item>
      </v-tabs-bar>
      <v-tabs-items>
        <v-tabs-content id="tab-detalle">
          <matricula-detalle :matricula="matricula"></matricula-detalle>
        </v-tabs-content>

        <v-tabs-content id="tab-cuenta">
          <resumen-cuenta :id="matricula.id"></resumen-cuenta>
        </v-tabs-content>

        <v-tabs-content id="tab-legajo">
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
import axios from '@/axios';
import DatosBasicos from '@/components/matriculas/DatosBasicos'
import ResumenCuenta from '@/components/matriculas/cuenta/ResumenCuenta'
import MatriculaDetalle from '@/components/matriculas/MatriculaDetalle'

export default {
  name: 'Matricula',
  data () {
    return {
      matricula: null,
      tab_selected: 'tab-detalle'
    }
  },

  created: function() {
    axios.get(`/matriculas/${this.$route.params.id}`)
         .then(r => {
           this.matricula = r.data;
         })
         .catch(e => console.error(e));

  },

  methods: {
  },

  components: {
    DatosBasicos,
    ResumenCuenta,
    MatriculaDetalle
  }

}
</script>

<style>
</style>
