<template>
    <v-layout row wrap v-if="matricula && matricula.entidad">
      <v-toolbar class="blue darken-3">
        <v-toolbar-title class="white--text">Matrícula</v-toolbar-title>
      </v-toolbar>
      <v-flex xs12>
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
      </v-flex>
    </v-layout>
</template>

<script>
export default {
  name: 'DatosBasicos',
  props: ['matricula'],

  data () {
    return {
    }
  },

  methods: {
  },

}
</script>

<style>
</style>
