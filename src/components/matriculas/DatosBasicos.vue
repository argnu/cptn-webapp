<template>
  <v-container>
    <v-layout row wrap v-if="matricula && matricula.entidad">
      <v-flex xs12>
        <v-toolbar class="indigo" dark>
          <v-toolbar-title class="white--text">Datos del Matriculado</v-toolbar-title>
        </v-toolbar>

        <v-container fluid>
          <v-card class="grey lighten-4">
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs3>
                  N° Matrícula: {{ matricula.numeroMatricula }}
                </v-flex>
                <v-flex xs3>
                  Apellido: {{ matricula.entidad.apellido }}
                </v-flex>
                <v-flex xs3>
                  Nombre: {{ matricula.entidad.nombre }}
                </v-flex>
                <v-flex xs3>
                  Estado: {{ matricula.estado }}
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from '@/axios';

export default {
  name: 'DatosBasicos',
  data () {
    return {
      matricula: {}
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

}
</script>

<style>
</style>
