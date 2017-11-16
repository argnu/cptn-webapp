<template>
  <v-container>
    <v-toolbar dark class="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Autenticación</v-toolbar-title>
    </v-toolbar>

    <v-card class="">
      <v-card-text>
        <v-text-field
          label="Nombre de Usuario"
          v-model="usuario.id"
        >
        </v-text-field>
        <br>
        <v-text-field
          label="Nombre de Usuario"
          v-model="usuario.password"
        >
        </v-text-field>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import * as axios from 'axios';

const User = () => ({
  id: '',
  password: ''
})

export default {
  name: 'Login',
  data () {
    return {
      usuario: User()
    }
  },

  created: function() {
  },

  methods: {
  },

}
</script>

<style>
</style>
