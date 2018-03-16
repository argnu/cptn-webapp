<template>
  <v-container>

    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">{{ usuario.nombre }} {{ usuario.apellido }} </v-toolbar-title>
    </v-toolbar>

    <v-card>
        <br>
        <span class="subheading blue--text text--darken-4 ml-5"><b>Datos Básicos</b></span>

        <v-form ref="form_basico" v-model="valid_basico">
        <v-layout row>
            <v-flex xs12 md3 class="mx-5 mb-3">
                    <template v-if="edit.username.active">
                        <v-form ref="form_username">
                        <v-text-field
                            label="Usuario"
                            v-model="usuario.username"
                            :rules="[rules.required]"
                        ></v-text-field>
                        </v-form>
                    </template>
                    <template v-else>
                        <b>Usuario:</b> {{ usuario.username }}
                    </template>

                    <v-btn fab small light @click="startEdit('username')" v-show="!edit.username.active">
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn fab small light @click="cancelarEdit('username')" v-show="edit.username.active">
                        <v-icon>cancel</v-icon>
                    </v-btn>
                    <v-btn fab small light v-show="edit.username.active" @click="guardar('username')">
                        <v-icon>save</v-icon>
                    </v-btn>

                    <br>

                    <template v-if="edit.email.active">
                        <v-form ref="form_email">
                            <v-text-field
                                label="Email"
                                v-model="usuario.email"
                                :rules="[rules.email]"
                            ></v-text-field>
                        </v-form>
                    </template>
                    <template v-else>
                        <b>Email:</b> {{ usuario.email }}
                    </template>

                    <v-btn fab small light @click="startEdit('email')" v-show="!edit.email.active">
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn fab small light @click="cancelarEdit('email')" v-show="edit.email.active">
                        <v-icon>cancel</v-icon>
                    </v-btn>
                    <v-btn fab small light v-show="edit.email.active" @click="guardar('email')">
                        <v-icon>save</v-icon>
                    </v-btn>
            </v-flex>

            <v-flex xs12 md3 class="mx-5 mb-3">
                    <template v-if="edit.nombre.active">
                        <v-form ref="form_nombre">
                        <v-text-field
                            label="Nombre"
                            v-model="usuario.nombre"
                            :rules="[rules.required]"
                        ></v-text-field>
                        </v-form>
                    </template>
                    <template v-else>
                        <b>Nombre:</b> {{ usuario.nombre }}
                    </template>

                    <v-btn fab small light @click="startEdit('nombre')" v-show="!edit.nombre.active">
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn fab small light @click="cancelarEdit('nombre')" v-show="edit.nombre.active">
                        <v-icon>cancel</v-icon>
                    </v-btn>
                    <v-btn fab small light v-show="edit.nombre.active" @click="guardar('nombre')">
                        <v-icon>save</v-icon>
                    </v-btn>
            </v-flex>

            <v-flex xs12 md3 class="mx-5 mb-3">
                    <template v-if="edit.apellido.active">
                        <v-form ref="form_apellido">
                        <v-text-field
                            label="Apellido"
                            v-model="usuario.apellido"
                            :rules="[rules.required]"
                        ></v-text-field>
                        </v-form>
                    </template>
                    <template v-else>
                        <b>Apellido:</b> {{ usuario.apellido }}
                    </template>

                    <v-btn fab small light @click="startEdit('apellido')" v-show="!edit.apellido.active">
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn fab small light @click="cancelarEdit('apellido')" v-show="edit.apellido.active">
                        <v-icon>cancel</v-icon>
                    </v-btn>
                    <v-btn fab small light v-show="edit.apellido.active" @click="guardar('apellido')">
                        <v-icon>save</v-icon>
                    </v-btn>
            </v-flex>
        </v-layout>
        </v-form>

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
    </v-card>

  </v-container>
</template>

<script>
import Vue from 'vue'
import axios from '@/axios'
import { Header } from '@/model'
import { Usuario } from '@/model/Usuario'
import MixinValidator from '@/components/mixins/MixinValidator'

const EditField = () => ({
  previous: '',
  active: false
})

export default {
    name: 'UsuarioDetalle',
    props: ['id'],

    mixins: [MixinValidator],

    headers: [
        Header('', 'borrar'),
        Header('Nombre', 'nombre')
    ],

    data() {
        return {
            usuario: new Usuario(),
            password: '',
            password_re: '',
            nueva_delegacion: {},
            delegaciones: [],
            valid_basico: false,
            submitted: false,
            submitted_pass: false,
            edit: {
                username: EditField(),
                nombre: EditField(),
                apellido: EditField(),
                email: EditField()
            }
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

    created: function() {
        Promise.all([
            axios.get('/delegaciones'),
            axios.get(`/usuarios/${this.id}`),
            axios.get(`/usuarios/${this.id}/delegaciones`)
        ])
        .then(r => {
            this.delegaciones = r[0].data;
            this.usuario = r[1].data;
            Vue.set(this.usuario, 'delegaciones', r[2].data);
        })
        .catch(e => console.error(e));
    },

    methods: {
        addDelegacion: function() {
            if (this.nueva_delegacion.id) {
                axios.post(`/usuarios/${this.id}/delegaciones`, this.nueva_delegacion)
                .then(r => {
                    this.usuario.delegaciones.push(this.nueva_delegacion);
                    this.nueva_delegacion = {};
                })
                .catch(this.showError);                
            }
        },

        borrarDelegacion: function(index) {
            axios.delete(`/usuarios/${this.id}/delegaciones/${this.usuario.delegaciones[index].id}`)
            .then(r => {
                this.usuario.delegaciones.splice(index, 1);
            })
            .catch(this.showError);
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
                .catch(this.showError)
            }
        },

        startEdit: function(atributo) {
            this.edit[atributo].previous = this.usuario[atributo];
            this.edit[atributo].active = true;
        },

        cancelarEdit: function(atributo) {
            this.usuario[atributo] = this.edit[atributo].previous;
            this.edit[atributo].active = false;
        },

        guardar: function(atributo) {
            let ref_name = `form_${atributo}`;
            if (this.$refs[ref_name].validate()) {
                let patch = {};
                patch[atributo] = this.usuario[atributo];
                axios.patch(`/usuarios/${this.id}`, patch)
                .then(r => this.edit[atributo].active = false)
                .catch(this.showError)
            }
        },

        cambiarPass: function() {
            this.submitted_pass = true;
            if (this.$refs.form_pass.validate()) {
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
                .catch(this.showError)
            }
        },

        showError: function(e) {
            this.submitted = false;
            let msg = (!e.response || e.response.status == 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.msg;
            this.global_state.snackbar.msg = msg;
            this.global_state.snackbar.color = 'error';
            this.global_state.snackbar.show = true;
            console.error(e);
        }
    }

}
</script>

<style>

</style>
