<template>
  <v-container>
    <v-toolbar dark class="primary mt-2">
    </v-toolbar>

    <v-card>
      <v-card-text>
        <form @submit.prevent="autenticar">

          <v-layout row wrap v-if="!delegaciones.length">
            <v-flex md6 offset-md3 xs12>
              <input-texto
                label="Nombre de Usuario"
                prepend-icon="account_box"
                uppercase
                type="letras"
                v-model="usuario.username"
                @input="submitted = false"
              ></input-texto>

              <br>
              <v-text-field
                label="Contraseña"
                v-model="usuario.password"
                type="password"
                prepend-icon="vpn_key"
                @input="submitted = false"
              >
              </v-text-field>

              <br>

              <v-alert
                color="error"
                icon="warning"
                :value="login_error"
                transition="scale-transition"
              >
                {{ auth_error }}
              </v-alert>

              <br>
              <v-btn 
                dark 
                color="primary" 
                style="width:100%" 
                type="submit"
                :loading="submitted"
                :disabled="submitted"
              >
                <v-icon right dark>fingerprint</v-icon>
                <span class="ml-3">Iniciar Sesión</span>
              </v-btn>

            </v-flex>
          </v-layout>

          <v-layout v-if="delegaciones.length">
            <v-flex md6 offset-md3 xs12>
              <span class="subheading blue--text text--darken-4"><b>Seleccionar Delegación</b></span>
              <v-list>
                  <v-list-tile avatar v-for="delegacion in delegaciones" :key="delegacion.id" @click="select(delegacion)">
                      <v-list-tile-avatar>
                      <v-icon>location_city</v-icon>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                      <v-list-tile-title>{{ delegacion.nombre }}</v-list-tile-title>
                      </v-list-tile-content>
                      <v-list-tile-action>
                      <v-btn icon ripple>
                          <v-icon color="grey lighten-1">account_circle</v-icon>
                      </v-btn>
                      </v-list-tile-action>
                  </v-list-tile>
              </v-list>              
            </v-flex>            
          </v-layout>
        </form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import api from '@/services/api'
import * as Cookies from 'js-cookie'
import * as utils from '@/utils'
import Store from '@/stores/Global'
import InputTexto from '@/components/base/InputTexto'


const User = () => ({
  username: '',
  password: ''
})

export default {
  name: 'Login',

  components: {
    InputTexto
  },

  data () {
    return {
      usuario: User(),
      submitted: false,
      submit_error: false,
      auth_error: '',
      delegaciones: []
    }
  },

  computed: {
    login_error: function() {
      return this.submitted && this.submit_error;
    }
  },


  methods: {
    autenticar: function() {
      this.submitted = true;
      this.auth_error = 'Usuario/contraseña inválidos'
      this.submit_error = false;
      this.usuario.username = this.usuario.username.toUpperCase();

      api.post('/usuarios/auth', this.usuario)
      .then(r => {
        this.$ability.update(r.data.rules);

        Cookies.set('CPTNUser', JSON.stringify(r.data), 1);
        Store.setUser(r.data);
        api.defaults.headers.common['Authorization'] = `JWT ${r.data.token}`;
        api.get(`/usuarios/${r.data.id}/delegaciones`)
        .then(r => { 
          if (!r.data.length) {
            this.submit_error = true;
            this.auth_error = 'El usuario no tiene delegaciones asociadas';
          }
          else this.delegaciones = r.data
        })
        .catch(e => console.error(e));        
      })
      .catch(e => {
        console.error(e);
        this.submit_error = true;
        if (e.response.status != 403) console.error(e);
      });
    },

    select: function(delegacion) {
      Store.setDelegacion(delegacion);
      Cookies.set('CPTNDelegacion', JSON.stringify(delegacion));
      this.$router.push({ path: '/matriculas/lista' })
    }    
  },

}
</script>

<style>
</style>
