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
                    tabindex="1"
                    label="Usuario"
                    type="letras"
                    uppercase
                    v-model="usuario.username"
                    :rules="[rules.required]"
                ></input-texto>

                <v-text-field
                    tabindex="4"
                    label="Contraseña"
                    type="password"
                    v-model="usuario.password"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-flex>

            <v-flex xs12 md3 class="mx-5 mb-3">
                <input-texto
                    tabindex="2"
                    type="letras"
                    label="Nombre"
                    uppercase
                    v-model="usuario.nombre"
                    :rules="[rules.required]"
                ></input-texto>

                <v-text-field
                    tabindex="5"
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
                    tabindex="3"
                    label="Apellido"
                    type="letras"
                    uppercase
                    v-model="usuario.apellido"
                    :rules="[rules.required]"
                ></input-texto>

                <v-text-field
                    tabindex="6"
                    label="Email"
                    v-model="usuario.email"
                    :rules="[rules.email]"
                ></v-text-field>                
            </v-flex>
        </v-layout>
        </v-form>

        <br>

        <v-layout row>
            <v-flex xs12 md3 class="mx-5">
                <v-select
                    tabindex="7"
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

            <v-flex xs12 md3 class="mx-5">
                <v-select
                    tabindex="8"
                    v-if="$can('manage', 'Usuario')"
                    label="Rol"
                    :items="$options.roles"
                    :rules="[rules.required]"
                    v-model="usuario.rol"
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

    roles: [
        { text: 'Administrador', value: 'admin' },
        { text: 'Usuario Sistema CPTN', value: 'usuario_cptn' },
        { text: 'Moderador Títulos', value: 'moderador_titulos' }
    ],

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
                usuario.username = usuario.username.toUpperCase();
                usuario.nombre = usuario.nombre.toUpperCase();
                usuario.apellido = usuario.apellido.toUpperCase();
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
