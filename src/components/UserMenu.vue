<template>
  <v-menu class="mr-4" :offset-y="true" transition="slide-y-transition">
    <v-btn icon slot="activator" dark>
      <v-icon x-large>account_circle</v-icon>
    </v-btn>
    <v-list>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>assignment_ind</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Perfil</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile>
        <v-list-tile-action>
          <v-icon>settings</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Configuración</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
      <v-list-tile @click="logout">
        <v-list-tile-action>
          <v-icon>exit_to_app</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Salir</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </v-menu>
</template>

<script>
import * as Cookies from 'js-cookie';

export default {
  name: 'UserMenu',
  data() {
    return {}
  },

  methods: {
    logout: function() {
      Cookies.remove('CPTNUser');
      this.$router.push({ path: '/login' });
    }
  },

}
</script>

<style>
</style>
