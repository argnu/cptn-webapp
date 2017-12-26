<template>
    <v-layout row wrap v-if="matricula && matricula.entidad">
      <v-toolbar class="blue darken-3">
        <v-toolbar-title class="white--text">Matrícula</v-toolbar-title>
      </v-toolbar>
      <v-flex xs12>
          <v-card class="grey lighten-4">
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs2>
                  <v-avatar
                    v-if="matricula.entidad.foto"
                    size="100px"
                    class="grey lighten-4"
                  >
                    <img :src="matricula.entidad.foto" alt="Foto">
                  </v-avatar>
                </v-flex>
                <v-flex xs3>
                  N° Matrícula: {{ matricula.numeroMatricula }} <br> <br>
                  Estado: {{ matricula.estado }}
                </v-flex>
                <v-flex xs3>
                  Apellido: {{ matricula.entidad.apellido }} <br> <br>
                </v-flex>
                <v-flex xs3>
                  Nombre: {{ matricula.entidad.nombre }} <br> <br>                 
                </v-flex>
                <v-flex xs1>
                  <v-avatar
                    v-if="matricula.entidad.firma"
                    size="50px"
                    class="grey lighten-4"
                  >
                    <img :src="matricula.entidad.firma" alt="Firma">
                  </v-avatar>                   
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
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
