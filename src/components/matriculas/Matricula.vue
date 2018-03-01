<template>
  <v-container class="grey lighten-3" v-if="matricula">

    <matricula-datos-basicos 
      :matricula="matricula"
      @habilitar="habilitar"
    >
    </matricula-datos-basicos>

    <br>

    <v-tabs fixed icons v-model="tab_selected">
      <v-tabs-bar>
        <v-tabs-slider color="black"></v-tabs-slider>
        <v-tabs-item href="#tab-detalle">
          <v-icon  :class="{ 'black--text': tab_selected == 'tab-detalle' }">account_box</v-icon>
          <span :class="{ 'black--text': tab_selected == 'tab-detalle' }">Detalle</span>
        </v-tabs-item>
        <v-tabs-item href="#tab-cuenta">
          <v-icon :class="{ 'black--text': tab_selected == 'tab-cuenta' }">
            account_balance
          </v-icon>
          <span :class="{ 'black--text': tab_selected == 'tab-cuenta' }">Cuenta</span>
        </v-tabs-item>
        <v-tabs-item href="#tab-pendientes">
          <v-icon  :class="{ 'black--text': tab_selected == 'tab-pendientes' }">attach_money</v-icon>
          <span  :class="{ 'black--text': tab_selected == 'tab-pendientes' }">Deudas Pendientes</span>
        </v-tabs-item>
        <v-tabs-item href="#tab-legajo">
          <v-icon  :class="{ 'black--text': tab_selected == 'tab-legajo' }">work</v-icon>
          <span  :class="{ 'black--text': tab_selected == 'tab-legajo' }">Legajo Técnico</span>
        </v-tabs-item>
      </v-tabs-bar>

      <v-tabs-items>
        <v-tabs-content id="tab-detalle">
          <matricula-detalle :matricula="matricula"></matricula-detalle>
        </v-tabs-content>

        <v-tabs-content id="tab-cuenta">
          <resumen-cuenta 
            :id="matricula.id"
            ref="resumen"
          >
          </resumen-cuenta>
        </v-tabs-content>

        <v-tabs-content id="tab-pendientes">
          <deudas-pendientes 
            :id="matricula.id" 
            @update="updateDeudas"
          >            
          </deudas-pendientes>
        </v-tabs-content>

        <v-tabs-content id="tab-legajo">
          <legajo-lista :id="matricula.id"></legajo-lista>
        </v-tabs-content>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
import axios from '@/axios';
import MatriculaDatosBasicos from '@/components/matriculas/MatriculaDatosBasicos'
import ResumenCuenta from '@/components/matriculas/cuenta/ResumenCuenta'
import DeudasPendientes from '@/components/matriculas/cuenta/DeudasPendientes'
import MatriculaDetalle from '@/components/matriculas/MatriculaDetalle'
import LegajoLista from '@/components/matriculas/legajos/LegajoLista'

export default {
  name: 'Matricula',
  props: ['id_matricula'],

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
      axios.get(`/matriculas/${this.id_matricula}`)
      .then(r => {
        this.matricula = r.data;
      })
      .catch(e => console.error(e));
    },

    habilitar: function() {
      // 13 ES ESTADO 'Habilitado'
      axios.patch(`/matriculas/${this.id_matricula}`, { estado: 13, operador: this.user.id })
      .then(r => this.update())
      .catch(e => console.error(e));
    },

    updateDeudas: function() {
      this.$refs.resumen.updateBoletas();
    }
  },

  components: {
    MatriculaDatosBasicos,
    ResumenCuenta,
    MatriculaDetalle,
    LegajoLista,
    DeudasPendientes
  }

}
</script>

<style>
</style>
