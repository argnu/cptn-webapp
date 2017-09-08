<template>
  <v-app>

    <v-navigation-drawer absolute persistent light v-model="drawer.show" overflow>
      <v-toolbar flat class="transparent">
        <v-list class="pa-0">
          <v-list-tile avatar>
            <v-list-tile-avatar>
              <img src="http://www.coordinadora.com/wp-content/uploads/sidebar_usuario-corporativo.png" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>Usuario Conectado</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
      </v-toolbar>

      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        <v-subheader v-text="'Solicitudes'"></v-subheader>
        <v-list-tile v-for="item in drawer.items" :key="item.title" @click="goto(item.route)">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{ item.title }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-toolbar dark class="primary">
      <v-toolbar-side-icon @click="drawer.show = !drawer.show"></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Matriculaciones CPTN</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>

    <router-view></router-view>

    <v-footer class="indigo">
      <span class="white--text"></span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      drawer: {
        show: false,
        items: [
          { title: 'Listar', icon: 'view_list', route: '/solicitudes/lista' },
          { title: 'Nuevo Profesional', icon: 'account_circle', route: '/solicitudes/profesionales/nueva' },
          { title: 'Nueva Empresa', icon: 'business', route: '/solicitudes/empresas/nueva' }
        ],
      }
    }
  },

  methods: {
    goto: function(route) {
      this.$router.push({path: route});
      this.drawer.show = false;
    }
  }
}
</script>

<style>
@import '../node_modules/vuetify/dist/vuetify.min.css'
</style>
