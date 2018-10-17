<template>
<v-container class="grey lighten-3">
  <v-toolbar class="darken-3" color="primary">
    <v-toolbar-title class="white--text">Resumen de Ingresos</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-layout class="mt-4">
      <v-flex xs4 class="mx-4">
        <input-fecha
            label="Fecha Desde:"
            v-model="filtros.fecha_desde"
        ></input-fecha>
      </v-flex>

      <v-flex xs4 class="mx-4">
        <input-fecha
            label="Fecha Hasta:"
            v-model="filtros.fecha_hasta"
        ></input-fecha>
      </v-flex>

      <v-flex xs2 class="mx-4">
        <v-btn
            title="Imprimir"
            color="primary"
            @click="imprimir"
        >
            <v-icon class="mr-2">print</v-icon>
            Imprimir
        </v-btn>
      </v-flex>
  </v-layout>
</v-container>    
</template>

<script>
import moment from 'moment'
import reports from '@/services/reports'
import InputFecha from '@/components/base/InputFecha'

export default {
    name: 'ResumenIngresos',

    components: {
        InputFecha   
    },

    data() {
        return {
            filtros: {
                fecha_desde: moment().format('DD/MM/YYYY'),
                fecha_hasta: moment().format('DD/MM/YYYY')
            }            
        }
    },

    methods: {
        imprimir: function() {
            reports.open({
                'jsp-source': 'resumen_ingresos.jasper',
                'jsp-format': 'PDF',
                'jsp-output-file': `Resumen Ingresos - ${Date.now()}`,
                'jsp-only-gen': false,
                'fecha_inicio': moment(this.filtros.fecha_desde, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                'fecha_fin': moment(this.filtros.fecha_hasta, 'DD/MM/YYYY').format('YYYY-MM-DD')
            });            
        }
    }

}
</script>

<style>

</style>
