<template>
  <v-container>

    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">Nuevo Usuario</v-toolbar-title>
    </v-toolbar>

    <v-card>
        <br>
        <span class="subheading blue--text text--darken-4 ml-5"><b>Datos Básicos</b></span>

        <v-form ref="form_basico" v-model="valid_basico">
        <v-layout row>
            <v-flex xs12 md3 class="mx-5 mb-3">
                <input-texto
                    label="Usuario"
                    type="letras"
                    uppercase
                    v-model="usuario.username"
                    :rules="[rules.required]"
                ></input-texto>

                <v-text-field
                    label="Contraseña"
                    type="password"
                    v-model="usuario.password"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-flex>

            <v-flex xs12 md3 class="mx-5 mb-3">
                <input-texto
                    type="letras"
                    label="Nombre"
                    uppercase
                    v-model="usuario.nombre"
                    :rules="[rules.required]"
                ></input-texto>

                <v-text-field
                    label="Repetir Contraseña"
                    type="password"
                    v-model="usuario.password_re"
                    :rules="[rules.required]"
                ></v-text-field>  
                <v-alert type="error" :value="(usuario.password.length > 0 || usuario.password_re.length > 0) && !valid_pass">
                    Las contraseñas no coinciden!
                </v-alert>
            </v-flex>

            <v-flex xs12 md3 class="mx-5 mb-3">
                <input-texto
                    label="Apellido"
                    type="letras"
                    uppercase
                    v-model="usuario.apellido"
                    :rules="[rules.required]"
                ></input-texto>

                <v-text-field
                    label="Email"
                    v-model="usuario.email"
                    :rules="[rules.email]"
                ></v-text-field>                
            </v-flex>
        </v-layout>
        </v-form>

        <br>

        <span class="subheading blue--text text--darken-4 ml-5 mb-4"><b>Delegaciones</b></span>

        <v-layout row>
            <v-flex xs12 md7 class="mx-5">
                <v-select
                    label="Delegaciones"
                    autocomplete
                    multiple
                    return-object
                    :items="delegaciones"
                    item-value="id"
                    item-text="nombre"
                    :rules="[rules.required]"
                    v-model="usuario.delegaciones"
                ></v-select>
            </v-flex>
        </v-layout>

        <v-layout>
            <v-flex xs12 class="ma-5">
                <v-btn
                    class="green darken-1 white--text right"
                    @click.native="submit"
                    :disabled="!valid_basico || submitted"
                    :loading="submitted"
                >
                    Guardar
                    <v-icon dark right>check_circle</v-icon>
                </v-btn>

                <v-btn dark class="red right" @click="$router.go(-1)">
                    Cancelar
                    <v-icon dark right>block</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>
    </v-card>

  </v-container>
</template>

<script>
import Vue from 'vue'
import api from '@/services/api'
import * as utils from '@/utils'
import { Header } from '@/model'
import { Usuario } from '@/model/Usuario'
import MixinValidator from '@/components/mixins/MixinValidator'
import InputTexto from '@/components/base/InputTexto'


export default {
    name: 'UsuarioNuevo',

    mixins: [MixinValidator],

    components: {
        InputTexto
    },

    headers: [
        Header('Borrar', 'borrar'),
        Header('Nombre', 'nombre')
    ],

    data() {
        return {
            usuario: new Usuario(),
            delegaciones: [],
            valid_basico: false,
            submitted: false
        }
    },

    computed: {
        valid_pass: function() {
            return this.usuario.password === this.usuario.password_re;
        }
    },

    created: function() {
        api.get('/delegaciones')
        .then(r => this.delegaciones = r.data)
        .catch(e => console.error(e));
    },

    methods: {
        submit: function() {
            this.submitted = true;
            if (this.valid_basico && this.valid_pass) {
                let usuario = utils.clone(this.usuario);
                usuario.delegaciones = usuario.delegaciones.map(d => d.id);

                api.post('/usuarios', usuario)
                .then(r => {
                    this.submitted = false;
                    this.global_state.snackbar.msg = 'Nuevo usuario creado exitosamente!';
                    this.global_state.snackbar.color = 'success';
                    this.global_state.snackbar.show = true;
                    this.$router.replace('/usuarios/lista');
                })
                .catch(e => {
                    this.submitted = false;
                    let msg = (!e.response || e.response.status == 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.msg;
                    this.global_state.snackbar.msg = msg;
                    this.global_state.snackbar.color = 'error';
                    this.global_state.snackbar.show = true;                    
                    console.error(e);
                })
            }
        }
    }

}
</script>

<style>

</style>
