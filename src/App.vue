<template>
  <v-app :style="global_state.cursor_wait ? 'cursor:wait' : ''">
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

    <v-toolbar dark class="darken-1" color="primary">
      <v-toolbar-side-icon 
        v-if="isDelegacionSelected"
        @click="toggleMenuLateral" 
      ></v-toolbar-side-icon>

      <img class="ml-5" src="/static/logo.jpg" style="max-height:100%">

      <v-spacer></v-spacer>

      <v-toolbar-items v-if="isLogged">
        <v-list-tile-content class="mr-4" >
          <v-list-tile-title>{{ full_name }}</v-list-tile-title>
          <v-list-tile-sub-title style="font-size:120%">
            {{ delegacion ? delegacion.nombre : '' }}
          </v-list-tile-sub-title>
        </v-list-tile-content> 

        <menu-user></menu-user>
      </v-toolbar-items>

    </v-toolbar>

    <router-view></router-view>

    <v-footer class="darken-4" color="primary">
      <span class="white--text"></span>
    </v-footer>

    <template v-if="isLogged">
      <menu-lateral ref="menu_lateral"></menu-lateral>
    </template>
  </v-app>
</template>

<script>
import MenuUser from '@/components/MenuUser'
import MenuLateral from '@/components/MenuLateral'

export default {
  name: 'app',

  computed: {
    isLogged: function() {
      return !!this.global_state.user;
    },

    isDelegacionSelected: function() {
      return !!this.global_state.delegacion;
    },

    full_name: function() {
      return `${this.user.nombre} ${this.user.apellido}`;
    }
  },

  methods: {
    toggleMenuLateral: function() {
      this.$refs.menu_lateral.toggle();
    }
  },

  components: {
    MenuUser,
    MenuLateral
  }
}
</script>

<style>
</style>
