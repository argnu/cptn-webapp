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
                <v-text-field
                    label="Usuario"
                    v-model="usuario.username"
                    :rules="[rules.required]"
                ></v-text-field>

                <v-text-field
                    label="Contraseña"
                    type="password"
                    v-model="usuario.password"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-flex>

            <v-flex xs12 md3 class="mx-5 mb-3">
                <v-text-field
                    label="Nombre"
                    v-model="usuario.nombre"
                    :rules="[rules.required]"
                ></v-text-field>

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
                <v-text-field
                    label="Apellido"
                    v-model="usuario.apellido"
                    :rules="[rules.required]"
                ></v-text-field>

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
                    label="Delegación"
                    autocomplete
                    :items="delegaciones"
                    item-value="id"
                    item-text="nombre"
                    v-model="nueva_delegacion"
                    :rules="[rules.required]"
                    return-object
                >
                </v-select>
            </v-flex>

            <v-flex xs12 md1>
                <v-btn class="right mb-4" light @click="addDelegacion">
                    Agregar
                </v-btn>
            </v-flex>            
        </v-layout>


        <v-layout row class="mt-4">
            <v-flex xs11>
                <v-data-table
                    :headers="$options.headers"
                    :items="usuario.delegaciones"
                    hide-actions
                    class="elevation-1 mx-5"
                    no-data-text="No hay delegaciones"
                >
                    <template slot="items" slot-scope="props">
                        <td>
                            <v-btn fab small dark color="primary"  @click="borrarDelegacion(props.index)">
                                <v-icon>delete</v-icon>
                            </v-btn>
                        </td>
                        <td>{{ props.item.nombre }}</td>
                    </template>
                </v-data-table>
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
import axios from '@/axios'
import { Header } from '@/model'
import { Usuario } from '@/model/Usuario'
import MixinValidator from '@/components/mixins/MixinValidator'


export default {
    name: 'UsuarioNuevo',

    mixins: [MixinValidator],

    headers: [
        Header('Borrar', 'borrar'),
        Header('Nombre', 'nombre')
    ],

    data() {
        return {
            usuario: new Usuario(),
            nueva_delegacion: {},
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
        axios.get('/delegaciones')
        .then(r => this.delegaciones = r.data)
        .catch(e => console.error(e));
    },

    methods: {
        addDelegacion: function() {
            if (this.nueva_delegacion.id) {
                this.usuario.delegaciones.push(this.nueva_delegacion);
                this.nueva_delegacion = {};
            }
        },

        borrarDelegacion: function(index) {
            this.usuario.delegaciones.splice(index, 1);
        },


        submit: function() {
            this.submitted = true;
            if (this.valid_basico && this.valid_pass) {
                axios.post('/usuarios', this.usuario)
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
