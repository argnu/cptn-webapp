<template>
  <v-container>

    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">{{ usuario.nombre }} {{ usuario.apellido }} </v-toolbar-title>
    </v-toolbar>

    <v-card>
        <br>
        <v-layout class="mt-4">
            <v-flex xs10>
                <span class="subheading blue--text text--darken-4 ml-5"><b>Datos Básicos</b></span>
            </v-flex>
            <v-flex xs2>
                <v-switch
                    label="Editar Datos"
                    v-model="edit"
                ></v-switch>
            </v-flex>
        </v-layout>        

        <v-form ref="form_basico" v-model="valid_basico">
        <v-layout row>
            <v-flex xs12 md3 class="mx-5 mb-3">
                <template v-if="edit">
                    <v-text-field
                        label="Usuario"
                        v-model="usuario.username"
                        :rules="[rules.required]"
                    ></v-text-field>
                </template>
                <template v-else>
                    <div class="mb-3">
                        <b>Usuario:</b> {{ usuario.username }}
                    </div>
                </template>

                <template v-if="edit">
                    <v-text-field
                        label="Email"
                        v-model="usuario.email"
                        :rules="[rules.email]"
                    ></v-text-field>
                </template>
                <template v-else>
                    <div>
                        <b>Email:</b> {{ usuario.email }}
                    </div>
                </template>                   

            </v-flex>

            <v-flex xs12 md3 class="mx-5 mb-3">
                    <template v-if="edit">
                        <v-text-field
                            label="Nombre"
                            v-model="usuario.nombre"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </template>
                    <template v-else>
                        <div>
                            <b>Nombre:</b> {{ usuario.nombre }}
                        </div>
                    </template>

                    <v-select
                        class="mt-2"
                        label="Delegaciones"
                        autocomplete
                        multiple
                        item-value="id"
                        item-text="nombre"
                        v-model="usuario.delegaciones"
                        :items="opciones_delegacion"
                        :rules="[rules.required]"
                        :readonly="!edit || !user.admin"
                    ></v-select>                    
            </v-flex>

            <v-flex xs12 md3 class="mx-5 mb-3">
                    <template v-if="edit">
                        <v-text-field
                            label="Apellido"
                            v-model="usuario.apellido"
                            :rules="[rules.required]"
                        ></v-text-field>
                    </template>
                    <template v-else>
                        <div>
                            <b>Apellido:</b> {{ usuario.apellido }}
                        </div> 
                    </template>
            </v-flex>
        </v-layout>
        </v-form>


        <v-layout v-show="edit" class="mb-4">
            <v-flex xs12>
                <v-btn
                    class="green darken-1 white--text right"
                    @click.native="guardar"
                    :disabled="!valid_basico || submitted"
                    :loading="submitted"
                >
                    Guardar
                    <v-icon dark right>check_circle</v-icon>
                </v-btn>

                <v-btn dark class="red right" @click="cancelEdit">
                    Cancelar
                    <v-icon dark right>block</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>        

        <v-divider></v-divider>
        <br>

        <span class="subheading blue--text text--darken-4 ml-5 mb-4"><b>Cambiar Contraseña</b></span>

        <v-form ref="form_pass">
        <v-layout row>
            <v-flex xs12 md4 class="mx-5 mb-3">
                <v-text-field
                    label="Contraseña"
                    type="password"
                    v-model="password"
                    :rules="[rules.required]"
                ></v-text-field>

                <v-alert type="error" :value="!valid_pass && submitted_pass">
                    Las contraseñas no coinciden!
                </v-alert>
            </v-flex>

            <v-flex xs12 md4 class="mx-5 mb-3">
                <v-text-field
                    label="Repetir Contraseña"
                    type="password"
                    v-model="password_re"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-flex>

            <v-flex xs12 md1 class="mx-5 mb-3">
                <v-btn class="right mb-4" light @click="cambiarPass">
                    Cambiar
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
import { Usuario } from '@/model/Usuario'
import MixinValidator from '@/components/mixins/MixinValidator'


export default {
    name: 'UsuarioDetalle',
    props: ['id'],

    mixins: [MixinValidator],

    headers: [
        Header('Borrar', 'borrar'),
        Header('Nombre', 'nombre')
    ],

    data() {
        return {
            usuario: new Usuario(),
            usuario_original: new Usuario(),
            password: '',
            password_re: '',
            nueva_delegacion: {},
            delegaciones: [],
            valid_basico: false,
            submitted: false,
            submitted_pass: false,
            edit: false
        }
    },

    computed: {
        opciones_delegacion: function() {
            return this.delegaciones.filter(d => !this.usuario.delegaciones.find(u => u.id == d.id));
        },

        valid_pass: function() {
            return this.password === this.password_re;
        },
    },

    beforeRouteUpdate() {
        this.update();
    },

    created: function() {
        this.update();
    },

    methods: {
        update: function() {
            return Promise.all([
                api.get('/delegaciones'),
                api.get(`/usuarios/${this.id}`),
                api.get(`/usuarios/${this.id}/delegaciones`)
            ])
            .then(r => {
                this.delegaciones = r[0].data;
                this.usuario = r[1].data;
                this.usuario.delegaciones = r[2].data.map(d => d.id);
                this.usuario_original = utils.clone(this.usuario);
            })
            .catch(e => console.error(e));
        },


        submit: function() {
            this.submitted = true;
            if (this.valid_basico && this.valid_pass) {
                api.post('/usuarios', this.usuario)
                .then(r => {
                    this.submitted = false;
                    this.global_state.snackbar.msg = 'Nuevo usuario creado exitosamente!';
                    this.global_state.snackbar.color = 'success';
                    this.global_state.snackbar.show = true;
                    this.$router.replace('/usuarios/lista');
                })
                .catch(e => {
                    this.submitted = false;
                    this.showError(e)
                });
            }
        },

        guardar: function() {
            if (this.$refs.form_basico.validate()) {
                let patch_usuario = utils.clone(this.usuario);
                api.put(`/usuarios/${this.id}`, patch_usuario)
                .then(r => {
                    this.edit = false;
                    this.global_state.snackbar.msg = 'Datos modificados exitosamente!';
                    this.global_state.snackbar.color = 'success';
                    this.global_state.snackbar.show = true;      
                    this.update();              
                })
                .catch(e => {
                    this.submitted = false;
                    this.showError(e)
                });
            }
        },

        cancelEdit: function() {
            this.usuario = utils.clone(this.usuario_original);
            this.edit = false;
        },

        cambiarPass: function() {
            this.submitted_pass = true;
            if (this.$refs.form_pass.validate() && this.valid_pass) {
                let patch = { password: this.password };

                api.patch(`/usuarios/${this.id}`, patch)
                .then(r => {
                    this.submitted_pass = false;
                    this.password = '';
                    this.password_re = '';
                    this.$refs.form_pass.reset();
                    this.global_state.snackbar.msg = 'Contraseña modificada exitosamente!';
                    this.global_state.snackbar.color = 'success';
                    this.global_state.snackbar.show = true;
                })
                .catch(e => {
                    this.submitted = false;
                    this.showError(e)
                });
            }
        }
    }

}
</script>

<style>

</style>
