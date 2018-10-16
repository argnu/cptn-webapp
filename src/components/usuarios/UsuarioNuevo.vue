<template>
  <v-container>

    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">Nuevo Usuario</v-toolbar-title>
    </v-toolbar>

    <v-progress-linear indeterminate v-show="show_cargando"></v-progress-linear>

    <v-card v-if="!show_cargando">
        <br>
        <span class="subheading blue--text text--darken-4 ml-5"><b>Datos Básicos</b></span>

        <v-form ref="form">
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
                    tabindex="6"
                    label="Email"
                    v-model="usuario.email"
                    :rules="[rules.email]"
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
            </v-flex>
        </v-layout>

        <v-divider></v-divider>
        <br>

        <span class="subheading blue--text text--darken-4 ml-5"><b>Contraseña</b></span>
        <v-layout row>
            <v-flex xs12 md3 class="mx-5 mb-2">
                <v-text-field
                    tabindex="4"
                    label="Contraseña"
                    type="password"
                    v-model="usuario.password"
                    :rules="id ? [] : [rules.required]"
                ></v-text-field>
            </v-flex>

            <v-flex xs12 md3 class="mx-5 mb-2">
                <v-text-field
                    tabindex="5"
                    label="Repetir Contraseña"
                    type="password"
                    v-model="usuario.password_re"
                    :rules="id ? [] : [rules.required]"
                ></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row>
            <v-flex xs12>
                <v-alert type="error" :value="!valid_pass">
                    Las contraseñas no coinciden!
                </v-alert>
            </v-flex>
        </v-layout>

        <v-divider></v-divider>
        <br>

        <span class="subheading blue--text text--darken-4 ml-5"><b>Administración</b></span>

        <v-layout row>
            <v-flex xs12 md3 class="mx-5">
                <v-select
                    tabindex="7"
                    label="Delegaciones"
                    autocomplete
                    multiple
                    :items="delegaciones"
                    item-value="id"
                    item-text="nombre"
                    :rules="[rules.required]"
                    v-model="usuario.delegaciones"
                ></v-select>
            </v-flex>

            <v-flex xs12 md3 class="mx-5">
                <v-select
                    multiple
                    tabindex="8"
                    v-if="$can('manage', 'Usuario')"
                    label="Roles"
                    :items="$options.roles"
                    :rules="[rules.required]"
                    v-model="usuario.roles"
                ></v-select>
            </v-flex>
        </v-layout>

        <v-layout>
            <v-flex xs12 class="ma-5">
                <v-btn
                    class="green darken-1 white--text right"
                    @click.native="submit"
                    :disabled="submitted"
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
        </v-form>
    </v-card>

  </v-container>
</template>

<script>
import Vue from 'vue'
import api from '@/services/api'
import * as utils from '@/utils'
import { Header } from '@/model'
import { Usuario, roles } from '@/model/Usuario'
import MixinValidator from '@/components/mixins/MixinValidator'
import InputTexto from '@/components/base/InputTexto'


export default {
    name: 'UsuarioNuevo',

    props: {
        id: [Number,String]
    },

    mixins: [MixinValidator],

    components: {
        InputTexto
    },

    roles,

    headers: [
        Header('Borrar', 'borrar'),
        Header('Nombre', 'nombre')
    ],

    data() {
        return {
            show_cargando: true,
            usuario: new Usuario(),
            delegaciones: [],
            submitted: false
        }
    },

    watch: {
        '$route' (to, from) {
            this.init();
        }
    },

    computed: {
        valid_pass: function() {
            if (!this.usuario.password_re || this.usuario.password_re.length === 0) return true;
            return this.usuario.password === this.usuario.password_re;
        }
    },

    created: function() {
        api.get('/delegaciones')
        .then(r => {
            this.delegaciones = r.data;
            this.init();
        })
        .catch(e => console.error(e));
    },

    methods: {
        init: function() {
            if (this.id) {
                if (this.$refs.form) this.$refs.form.reset();
                
                Promise.all([
                    api.get(`/usuarios/${this.id}`),
                    api.get(`/usuarios/${this.id}/delegaciones`)
                ])
                .then(([usuario, delegaciones]) => {
                    this.show_cargando = false
                    delete(usuario.data.hash_password);
                    this.usuario = usuario.data;
                    this.usuario.delegaciones = delegaciones.data.map(d => d.id);
                })
                .catch(e => console.error(e));
            }
            else {
                this.usuario = new Usuario();
                if (this.$refs.form) this.$refs.form.reset();
                this.show_cargando = false;
            }
        },

        submit: function() {
            if (this.$refs.form.validate() && this.valid_pass) {
                this.submitted = true;
                let usuario = utils.clone(this.usuario);
                usuario.username = usuario.username.toUpperCase();
                usuario.nombre = usuario.nombre.toUpperCase();
                usuario.apellido = usuario.apellido.toUpperCase();
                delete(usuario.password_re);

                if (!this.id) {
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
                        let msg = (!e.response || e.response.status == 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.mensaje;
                        this.global_state.snackbar.msg = msg;
                        this.global_state.snackbar.color = 'error';
                        this.global_state.snackbar.show = true;
                        console.error(e);
                    })
                }
                else {
                    api.put(`/usuarios/${this.id}`, usuario)
                    .then(r => {
                        this.submitted = false;
                        this.global_state.snackbar.msg = 'Usuario modificado exitosamente!';
                        this.global_state.snackbar.color = 'success';
                        this.global_state.snackbar.show = true;
                        this.$router.replace('/usuarios/lista');
                    })
                    .catch(e => {
                        this.submitted = false;
                        let msg = (!e.response || e.response.status == 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.mensaje;
                        this.global_state.snackbar.msg = msg;
                        this.global_state.snackbar.color = 'error';
                        this.global_state.snackbar.show = true;
                        console.error(e);
                    })
                }
            }
        }
    }

}
</script>

<style>

</style>
