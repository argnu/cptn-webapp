<template>
  <v-container class="grey lighten-3" v-if="matricula">

    <matricula-datos-basicos 
      :matricula="matricula"
      @habilitar="habilitar"
    >
    </matricula-datos-basicos>

    <br>

    <v-tabs fixed icons v-model="tab_selected">
        <v-tabs-slider color="black"></v-tabs-slider>
        <v-tab href="#tab-detalle">
          <v-icon  :class="{ 'black--text': tab_selected == 'tab-detalle' }">account_box</v-icon>
          <span :class="{ 'black--text': tab_selected == 'tab-detalle' }">Detalle</span>
        </v-tab>
        <v-tab href="#tab-cuenta">
          <v-icon :class="{ 'black--text': tab_selected == 'tab-cuenta' }">account_balance</v-icon>
          <span :class="{ 'black--text': tab_selected == 'tab-cuenta' }">Cuenta</span>
        </v-tab>
        <v-tab href="#tab-pendientes">
          <v-icon  :class="{ 'black--text': tab_selected == 'tab-pendientes' }">attach_money</v-icon>
          <span  :class="{ 'black--text': tab_selected == 'tab-pendientes' }">Deudas Pendientes</span>
        </v-tab>
        <v-tab href="#tab-legajo">
          <v-icon  :class="{ 'black--text': tab_selected == 'tab-legajo' }">work</v-icon>
          <span  :class="{ 'black--text': tab_selected == 'tab-legajo' }">Legajo Técnico</span>
        </v-tab>
        <v-tab href="#tab-historial">
          <v-icon  :class="{ 'black--text': tab_selected == 'tab-historial' }">history</v-icon>
          <span  :class="{ 'black--text': tab_selected == 'tab-historial' }">Historial</span>
        </v-tab>

        <v-tab-item id="tab-detalle">
          <matricula-detalle :matricula="matricula"></matricula-detalle>
        </v-tab-item>

        <v-tab-item id="tab-cuenta">
          <resumen-cuenta
            v-if="tab_selected == 'tab-cuenta'" 
            :id="matricula.id"
            ref="resumen"
          ></resumen-cuenta>
        </v-tab-item>

        <v-tab-item id="tab-pendientes">
          <deudas-pendientes 
            v-if="tab_selected == 'tab-pendientes'"
            :id="matricula.id" 
          ></deudas-pendientes>
        </v-tab-item>

        <v-tab-item id="tab-legajo">
          <legajo-lista 
            v-if="tab_selected == 'tab-legajo'"
            :id="matricula.id"
          ></legajo-lista>
        </v-tab-item>

        <v-tab-item id="tab-historial">
          <matricula-historial 
            v-if="tab_selected == 'tab-historial'"
            :id="matricula.id"
          ></matricula-historial>
        </v-tab-item>

    </v-tabs>
  </v-container>
</template>

<script>
import api from '@/services/api';
import MatriculaDatosBasicos from '@/components/matriculas/MatriculaDatosBasicos'
import ResumenCuenta from '@/components/matriculas/cuenta/ResumenCuenta'
import DeudasPendientes from '@/components/matriculas/cuenta/DeudasPendientes'
import MatriculaDetalle from '@/components/matriculas/MatriculaDetalle'
import LegajoLista from '@/components/matriculas/legajos/LegajoLista'
import MatriculaHistorial from '@/components/matriculas/MatriculaHistorial'

export default {
  name: 'Matricula',
  props: ['id_matricula'],

  components: {
    MatriculaDatosBasicos,
    MatriculaDetalle,
    MatriculaHistorial,
    ResumenCuenta,    
    LegajoLista,
    DeudasPendientes
  },  

  data () {
    return {
      matricula: null,
      tab_selected: 'tab-detalle'
    }
  },

  created: function() {
    this.update();
  },

  methods: {
    update: function() {
      api.get(`/matriculas/${this.id_matricula}`)
      .then(r => {
        this.matricula = r.data;
      })
      .catch(e => console.error(e));
    },

    habilitar: function() {
      // 13 ES ESTADO 'Habilitado'
      api.patch(`/matriculas/${this.id_matricula}`, { estado: 13 })
      .then(r => this.update())
      .catch(e => console.error(e));
    }
  }

}
</script>

<style>
</style>
