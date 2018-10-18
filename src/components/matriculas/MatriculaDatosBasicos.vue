<template>
    <v-layout row wrap v-if="matricula && matricula.entidad">
      <v-toolbar class="darken-3" color="primary">
        <v-toolbar-title class="white--text">Matrícula</v-toolbar-title>
      </v-toolbar>
      <v-flex xs12>
          <v-card class="grey lighten-4">
            <v-card-text>
              <v-layout row wrap>

                <v-flex xs2 class="ml-5">
                  <v-avatar
                    v-if="matricula.entidad.foto"
                    size="100px"
                    class="grey lighten-4"
                  >
                    <img :src="profesional_foto" alt="Foto">
                  </v-avatar>
                </v-flex>

                <v-flex xs4>
                  <div class="mb-2">N° Matrícula: {{ matricula.numeroMatricula }}</div>
                  <template v-if="matricula.entidad.tipo == 'profesional'">
                    <div class="mb-2">Apellido: {{ matricula.entidad.apellido }}</div>
                    <div class="mb-2">Nombre: {{ matricula.entidad.nombre }}</div>
                  </template>
                  <div class="mb-2">N° Solicitud: {{ matricula.numero_solicitud ? matricula.numero_solicitud : matricula.idMigracion }}</div>
                  <div class="mb-2">Estado: {{ matricula.estado.valor }}</div>

                  <v-alert :value="es_joven_prof" type="info">JOVEN PROFESIONAL</v-alert>
                </v-flex>

                <v-flex xs2>
                  <img
                    v-if="matricula.entidad.firma"
                    :src="profesional_firma"
                    alt="Firma"
                    style="max-width:200px"
                  >
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
      </v-flex>
    </v-layout>
</template>

<script>
import { clone } from '@/utils'
import moment from 'moment'

export default {

  name: 'MatriculaDatosBasicos',

  props: ['matricula'],

  computed: {
    profesional_foto: function() {
        return `${this.matricula.entidad.foto}?${Date.now()}`;
    },

    profesional_firma: function() {
        return `${this.matricula.entidad.firma}?${Date.now()}`;
    },

    es_joven_prof: function() {
      let profesional = this.matricula.entidad;
      let anios = moment().diff(profesional.fechaNacimiento, 'years');

      //Si no tiene menos de 25 años, no es jóven profesional
      if (anios >= 25) return false;

      let titulo_principal = profesional.formaciones.find(f => f.principal === true);


      //Si no tiene título principal o el mismo no tiene fecha de emisión, no se puede determinar
      //false por defecto
      if (!titulo_principal || !titulo_principal.fechaEmision) return false;

      let meses_dif = moment().diff(titulo_principal.fechaEmision, 'months');

      //Si es Nivel Secundario y hace menos de 24 meses
      if (titulo_principal.titulo.nivel.id === 1 && meses_dif < 24) return true;

      //Si es Técnico o Nivel Universitario y hace menos de 12 meses
      if (titulo_principal.titulo.nivel.id > 1 
        && titulo_principal.titulo.nivel.id < 5 
        && meses_dif < 12) return true;

      //Cualquier otro caso no es jóven profesional
      return false;
    }
  },

  methods: {
    habilitar: function() {
      this.$emit('habilitar');
    }
  },

}
</script>

<style>
</style>
