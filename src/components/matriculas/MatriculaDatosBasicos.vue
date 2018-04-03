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
                    <img :src="matricula.entidad.foto" alt="Foto">
                  </v-avatar>
                </v-flex>

                <v-flex xs4>
                  <div class="mb-2">N° Matrícula: {{ matricula.numeroMatricula }}</div>
                  <template v-if="matricula.entidad.tipo == 'profesional'">
                    <div class="mb-2">Apellido: {{ matricula.entidad.apellido }}</div>
                    <div class="mb-2">Nombre: {{ matricula.entidad.nombre }}</div>
                  </template>         
                  <div class="mb-2">Estado: {{ matricula.estado }}</div>
                </v-flex>
                
                <v-flex xs2>                    
                  <img 
                    v-if="matricula.entidad.firma" 
                    :src="matricula.entidad.firma" 
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
export default {

  name: 'MatriculaDatosBasicos',

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
