<template>
    <v-layout row wrap v-if="matricula && matricula.entidad">
      <v-toolbar class="blue darken-3">
        <v-toolbar-title class="white--text">Matrícula</v-toolbar-title>
      </v-toolbar>
      <v-flex xs12>
          <v-card class="grey lighten-4">
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs4>
                  N° Matrícula: {{ matricula.numeroMatricula }}
                </v-flex>
                <v-flex xs4>
                  Apellido: {{ matricula.entidad.apellido }}
                </v-flex>
                <v-flex xs4>
                  Nombre: {{ matricula.entidad.nombre }}
                </v-flex>
              </v-layout>

              <v-layout class="mt-4">
                <v-flex xs4 >
                  Estado: {{ matricula.estado }}
                </v-flex>
                <v-flex v-if="matricula.estado != 'Habilitada'">
                  <v-btn class="right green white--text" @click.native="habilitar">
                    Hablilitar
                    <v-icon dark right>check_circle</v-icon>
                  </v-btn>
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
  methods: {
    habilitar: function() {
      this.$emit('habilitar');
    }
  },

}
</script>

<style>
</style>
