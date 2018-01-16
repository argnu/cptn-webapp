<template>
  <v-container>
    <br><br>
    <v-toolbar dark class="primary">
    </v-toolbar>

    <v-card class="">
      <v-card-text>
        <form @submit.prevent="autenticar">
          <v-layout row wrap>
            <v-flex xs3></v-flex>
            <v-flex xs6>
              <v-text-field
                label="Nombre de Usuario"
                prepend-icon="account_box"
                v-model="usuario.id"
                @input="submitted = false"
              >
              </v-text-field>
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
                Error de autenticación!
              </v-alert>

              <br>
              <v-btn dark class="blue" style="width:100%" type="submit">
                <v-icon right dark>fingerprint</v-icon>
                <span class="ml-3">Iniciar Sesión</span>
              </v-btn>

            </v-flex>
          </v-layout>
        </form>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from '@/axios'
import * as Cookies from 'js-cookie'

const User = () => ({
  id: '',
  password: ''
})

export default {
  name: 'Login',
  data () {
    return {
      usuario: User(),
      submitted: false,
      submit_error: false
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
      this.submit_error = false;
      axios.post('/usuarios/auth', this.usuario)
      .then(r => {
        Cookies.set('CPTNUser', JSON.stringify(r.data), 1);
        this.$router.push({ path: '/seleccionar-delegacion' });
      })
      .catch(e => {
        this.submit_error = true;
        // if (e.response.status == 500) this.submit_error = true;
        console.error(e);
      });
    }
  },

}
</script>

<style>
</style>
