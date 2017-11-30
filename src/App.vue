<template>
  <v-app>

    <v-toolbar dark class="blue darken-1">
      <v-toolbar-side-icon @click="toggleMenuLateral" v-if="isLogged">
      </v-toolbar-side-icon>
      <img class="ml-5" src="/static/logo.jpg" style="max-height:100%">
      <v-spacer></v-spacer>

      <template v-if="isLogged">
        <user-menu></user-menu>
      </template>

    </v-toolbar>

    <router-view></router-view>

    <v-footer class="blue darken-4">
      <span class="white--text"></span>
    </v-footer>

    <template v-if="isLogged">
      <menu-lateral ref="menu_lateral"></menu-lateral>
    </template>    
  </v-app>
</template>

<script>
import * as Cookies from 'js-cookie'
import UserMenu from '@/components/UserMenu'
import MenuLateral from '@/components/MenuLateral'

export default {
  name: 'app',
  data() {
    return {
      user: null,
    }
  },

  updated: function() {
    this.user = Cookies.get('CPTNUser');
  },

  created: function() {
    this.user = Cookies.get('CPTNUser');
  },

  computed: {
    isLogged: function() {
      return !!this.user;
    }
  },

  methods: {
    toggleMenuLateral: function() {
      this.$refs.menu_lateral.toggle();
    }
  },

  components: {
    UserMenu,
    MenuLateral
  }
}
</script>

<style>
</style>
