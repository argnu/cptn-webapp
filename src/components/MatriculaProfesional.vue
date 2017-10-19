<template>
  <div>
    <v-container fluid>
      <v-layout row wrap>
        <v-toolbar class="indigo" dark>
          <v-toolbar-title class="white--text">Datos de Matrícula</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-container fluid>

        </v-container>
      </v-layout>
    </v-container>
  </div>
</template>

<script>
import * as axios from 'axios';

export default {
  name: 'matricula-profesional',
  props: ['id'],

  data () {
    return {
      matricula: new Matricula()
    }
  },

  created: function() {
    axios.get(`http://localhost:3400/api/matriculas/${this.id}`)
         .then(r => {
           console.log(r.data);
            this.matricula = r.data;
         })
         .catch(e => {
           console.error(e);
         });
  },

  methods: {
  },

}
</script>

<style>
</style>
