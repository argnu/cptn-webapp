<template>
  <v-menu class="mr-4" :offset-y="true" transition="slide-y-transition">
    <v-btn icon slot="activator" dark>
      <v-icon x-large>account_circle</v-icon>
    </v-btn>
    <v-list>
<!--       <v-list-tile>
        <v-list-tile-action>
          <v-icon>assignment_ind</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Perfil</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile> -->
      <v-list-tile @click="cambiarDelegacion">
        <v-list-tile-action>
          <v-icon>location_city</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Cambiar Delegación</v-list-tile-title>
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
import Store from '@/Store'

export default {
  name: 'UserMenu',
  data() {
    return {}
  },

  methods: {
    logout: function() {
      Cookies.remove('CPTNUser');
      Cookies.remove('CPTNDelegacion');
      Store.removeUser();
      this.$router.push({ path: '/login' });
    },

    cambiarDelegacion: function() {
      this.$router.push({ path: '/seleccionar-delegacion' });
    }
  },

}
</script>

<style>
</style>
