<template>
  <v-container>

    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">{{ usuario.nombre }} {{ usuario.apellido }} </v-toolbar-title>
    </v-toolbar>

    <v-card>
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

        <template v-if="user.admin">
            <br>

            <span class="subheading blue--text text--darken-4 ml-5 mb-4"><b>Delegaciones</b></span>

            <v-layout row class="mt-3">
                <v-flex xs12 md7 class="mx-5">
                    <v-select
                        label="Delegación"
                        autocomplete
                        :items="opciones_delegacion"
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
        </template>
    </v-card>

  </v-container>
</template>

<script>
import Vue from 'vue'
import axios from '@/axios'
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
                axios.get('/delegaciones'),
                axios.get(`/usuarios/${this.id}`),
                axios.get(`/usuarios/${this.id}/delegaciones`)
            ])
            .then(r => {
                this.delegaciones = r[0].data;
                this.usuario = r[1].data;
                Vue.set(this.usuario, 'delegaciones', r[2].data);
                this.usuario_original = utils.clone(this.usuario);
            })
            .catch(e => console.error(e));
        },

        addDelegacion: function() {
            if (this.nueva_delegacion.id) {
                axios.post(`/usuarios/${this.id}/delegaciones`, this.nueva_delegacion)
                .then(r => {
                    this.usuario.delegaciones.push(this.nueva_delegacion);
                    this.nueva_delegacion = {};
                })
                .catch(e => {
                    this.submitted = false;
                    this.showError(e)
                });
            }
        },

        borrarDelegacion: function(index) {
            axios.delete(`/usuarios/${this.id}/delegaciones/${this.usuario.delegaciones[index].id}`)
            .then(r => {
                this.usuario.delegaciones.splice(index, 1);
            })
            .catch(e => {
                this.submitted = false;
                this.showError(e)
            });
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
                    this.showError(e)
                });
            }
        },

        guardar: function() {
            if (this.$refs.form_basico.validate()) {
                let patch_usuario = utils.clone(this.usuario);
                delete(patch_usuario.delegaciones);

                axios.patch(`/usuarios/${this.id}`, patch_usuario)
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

                axios.patch(`/usuarios/${this.id}`, patch)
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
