<template>
  <v-navigation-drawer temporary light v-model="show_drawer">
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="http://www.coordinadora.com/wp-content/uploads/sidebar_usuario-corporativo.png" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ full_name }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-toolbar>

    <v-list class="pt-0" dense>
      <v-divider class="mb-3"></v-divider>
      <v-subheader class="bold" v-text="'Solicitudes'"></v-subheader>
      <v-list-tile  v-for="item in items" :key="item.title" @click="goto(item.route)">
        <v-list-tile-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-divider class="mb-3"></v-divider>
      <v-subheader class="bold" v-text="'Matriculados'"></v-subheader>
      <v-list-tile @click="goto('/matriculas/lista')">
        <v-list-tile-action>
          <v-icon>view_list</v-icon>
        </v-list-tile-action>
        <v-list-tile-content>
          <v-list-tile-title>Listar</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>

      <v-divider></v-divider>
      <br>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import * as Cookies from 'js-cookie'

const items = [
  { title: 'Listar', icon: 'view_list', route: '/solicitudes/lista' },
  { title: 'Nuevo Profesional', icon: 'account_circle', route: '/solicitudes/profesionales/nueva' },
  { title: 'Nueva Empresa', icon: 'business', route: '/solicitudes/empresas/nueva' }
];

export default {
  name: 'MenuLateral',
  data () {
    return {
      show_drawer: false,
      user: null
    }
  },

  computed: {
    items: function() {
      return items;
    },

    full_name: function() {
      return `${this.user.nombre} ${this.user.apellido}`;
    }
  },

  created: function() {
    this.user = JSON.parse(Cookies.get('CPTNUser'));
  },

  methods: {
    goto: function(route) {
      this.$router.push({path: route});
      this.show_drawer = false;
    },

    toggle: function() {
      this.show_drawer = !this.show_drawer;
    },
  },

}
</script>

<style>
.bold {
  font-weight: bold;
}
</style>
