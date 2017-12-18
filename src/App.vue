<template>
  <v-app>
    <v-snackbar
      :timeout="6000"
      bottom
      right
      :color="global_state.snackbar.color"
      v-model="global_state.snackbar.show"
    >
      {{ global_state.snackbar.msg }}
      <v-btn flat class="white--text" @click.native="global_state.snackbar.show = false">Cerrar</v-btn>
    </v-snackbar>

    <v-toolbar dark class="blue darken-1">
      <v-toolbar-side-icon @click="toggleMenuLateral" v-if="isDelegacionSelected">
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
import Store from '@/Store'

export default {
  name: 'app',
  data() {
    return {
      global_state: Store.state
    }
  },

  computed: {
    isLogged: function() {
      return !!this.global_state.user;
    },

    isDelegacionSelected: function() {
      console.log(this.global_state.delegacion);
      
      return  !!this.global_state.delegacion;
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
