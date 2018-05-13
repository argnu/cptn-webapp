<template>
  <v-container>

    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">Nueva Institución</v-toolbar-title>
    </v-toolbar>

    <v-card>
        <br>
        <span class="subheading blue--text text--darken-4 ml-5"><b>Datos Básicos</b></span>

        <v-form ref="form_basico" v-model="valid_basico">
        <v-layout row>
            <v-flex xs4 class="mx-5 mb-3">
                <v-text-field
                    label="Nombre"
                    v-model="institucion.nombre"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-flex>

            <v-flex xs4 class="mx-5 mb-3">
                <v-text-field
                    label="CUE"
                    v-model="institucion.cue"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-flex>

            <v-flex xs4 class="mx-5 mb-3">
                <v-checkbox
                    label="Institución Válida"
                    v-model="institucion.valida"
                ></v-checkbox>
            </v-flex>
        </v-layout>
        </v-form>

        <v-divider class="my-5"></v-divider>

        <v-layout row>
            <v-flex xs12>
                <span class="subheading blue--text text--darken-4 ml-5 mb-4"><b>Domicilio</b></span>

                <v-layout row>
                    <v-flex xs6 class="ml-5">
                        <v-select
                            autocomplete single-line bottom
                            item-text="nombre"
                            item-value="id"
                            :items="paises"
                            label="País"
                            @input="changePais"
                            v-model="institucion.domicilio.pais"
                        >
                        </v-select>

                        <v-select
                            autocomplete single-line bottom
                            item-text="nombre"
                            item-value="id"
                            :items="departamentos"
                            label="Departamento"
                            @input="changeDepartamento"
                            v-model="institucion.domicilio.departamento"
                        >
                        </v-select>
                    </v-flex>

                    <v-flex xs6 class="mx-5">
                        <v-select
                            autocomplete single-line bottom
                            item-text="nombre"
                            item-value="id"
                            :items="provincias"
                            label="Provincia"
                            @input="changeProvincia"
                            v-model="institucion.domicilio.provincia"
                        >
                        </v-select>

                        <v-select
                            autocomplete single-line bottom
                            item-text="nombre"
                            item-value="id"
                            :items="localidades"
                            label="Localidad"
                            v-model="institucion.domicilio.localidad"
                        >
                        </v-select>
                    </v-flex>
                </v-layout>

                <v-layout xs12 class="mx-5">
                    <v-text-field
                        label="Dirección"
                        v-model="institucion.domicilio.direccion"
                    >
                    </v-text-field>
                </v-layout>
            </v-flex>
        </v-layout>

        <v-divider class="my-5"></v-divider>

        <span class="subheading blue--text text--darken-4 ml-5 mb-4"><b>Títulos</b></span>

        <v-form ref="form_titulo" lazy-validation>

        <v-layout row>
            <v-flex xs5 class="mx-5">
                <v-text-field
                    label="Nombre"
                    v-model="nuevo_titulo.nombre"
                    :rules="[rules.required]"
                >
                </v-text-field>

                <v-select
                    label="Tipo de Matrícula"
                    autocomplete
                    :items="$options.tipos_matricula"
                    v-model="nuevo_titulo.tipo_matricula"
                    :rules="[rules.required]"
                >
                </v-select>

                <v-checkbox
                    label="Título Válido"
                    v-model="nuevo_titulo.valido"
                ></v-checkbox>
            </v-flex>

            <v-flex xs5 class="mx-5">
                <v-select
                    label="Nivel"
                    autocomplete
                    :items="opciones.niveles_titulos"
                    item-value="id"
                    item-text="valor"
                    v-model="nuevo_titulo.nivel"
                    :rules="[rules.required]"
                >
                </v-select>

                <v-select
                    label="Incumbencias"
                    :items="opciones.incumbencia"
                    item-text="valor"
                    item-value="id"
                    v-model="nuevo_titulo.incumbencias"
                    multiple
                    max-height="400"
                    hint="Seleccione las incumbencias"
                    persistent-hint
                ></v-select>
            </v-flex>
        </v-layout>

        </v-form>

        <v-layout row>
            <v-flex xs12 class="mx-5">
                <v-btn class="right mb-4" light @click="addTitulo">
                    {{ titulo_edit != null ? 'Guardar' : 'Agregar' }}
                </v-btn>
                <v-btn class="right" light v-show="titulo_edit != null" @click="cancelarEditTitulo">
                    Cancelar
                </v-btn>
            </v-flex>
        </v-layout>

        <v-layout row class="mt-4">
            <v-flex xs11>
                <v-data-table
                    :headers="$options.headers"
                    :items="institucion.titulos"
                    hide-actions
                    class="elevation-1 mx-5"
                    no-data-text="No hay titulos"
                >
                    <template slot="items" slot-scope="props">
                        <td class="justify-center layout px-0">
                        <v-btn small icon class="mx-0" @click="borrarTitulo(props.index)">
                            <v-icon color="red">delete</v-icon>
                        </v-btn>

                        <v-btn small icon class="mx-4" @click="editTitulo(props.index)">
                            <v-icon color="deep-purple">edit</v-icon>
                        </v-btn>          
                        </td>                        
                        <td>{{ props.item.nombre }}</td>
                        <td>{{ getNivelTitulo(props.item.nivel) }}</td>
                        <td>{{ props.item.tipo_matricula }}</td>
                        <td>{{ props.item.valido | boolean }}</td>
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
import api from '@/services/api'
import * as utils from '@/utils'
import { Header } from '@/model'
import { Institucion, Titulo } from '@/model/Institucion'
import MixinValidator from '@/components/mixins/MixinValidator'


export default {
    name: 'InstitucionNueva',

    props: ['id'],

    mixins: [MixinValidator],

    headers: [
        Header('', 'acciones'),
        Header('Nombre', 'nombre'),
        Header('Nivel', 'nivel'),
        Header('Tipo de Matrícula', 'tipo_matricula'),
        Header('Válido', 'valido'),
    ],

    tipos_matricula: [
        { text: 'TECA', value: 'TECA' },
        { text: 'TEC-', value: 'TEC-' },
        { text: 'IDO', value: 'IDO' }
    ],

    data() {
        return {
            institucion: new Institucion(),
            nuevo_titulo: new Titulo(),
            titulo_edit: null,
            opciones: {},
            paises: [],
            provincias: [],
            departamentos: [],
            localidades: [],
            valid_basico: false,
            submitted: false
        }
    },

    created: function() {
        Promise.all([
            api.get('/paises'),
            api.get('/opciones')
        ])
        .then(r => {
            this.paises = r[0].data;
            this.opciones = r[1].data;
            if (this.id) {
                api.get(`/instituciones/${this.id}`)
                .then(r => {
                    this.institucion.nombre = r.data.nombre;
                    this.institucion.cue = r.data.cue;
                    this.institucion.valida = r.data.valida;
                    if (r.data.domicilio) {
                        this.institucion.domicilio = r.data.domicilio;
                        this.changePais()
                        .then(() => this.changeProvincia())
                        .then(() => this.changeDepartamento());
                    }
                    else {
                        this.changePais().then(() => this.changeProvincia());
                    }
                    for(let titulo of r.data.titulos) {
                        titulo.incumbencias = titulo.incumbencias.map(i => i.incumbencia.id);
                        this.institucion.titulos.push(titulo);
                    }
                    
                });
            }
            else {
                this.changePais().then(() => this.changeProvincia());
            }
        })
        .catch(e => console.error(e));
    },

    methods: {
        changePais: function() {
            if (this.institucion.domicilio.pais) {
                return api.get(`/provincias?pais_id=${this.institucion.domicilio.pais}`)
                .then(r => this.provincias = r.data)
                .catch(e => {
                    console.error(e);
                    Promise.reject(e);
                });
            }
            else {
                this.provincias = [];
                return Promise.resolve();
            }
        },

        changeProvincia: function () {
            if (this.institucion.domicilio.provincia) {
                return api.get(`/departamentos?provincia_id=${this.institucion.domicilio.provincia}`)
                .then(r => this.departamentos = r.data)
                .catch(e => {
                    console.error(e);
                    Promise.reject(e);
                });
            }
            else {
                this.departamentos = [];
                return Promise.resolve();
            }
        },

        changeDepartamento: function () {
            if (this.institucion.domicilio.departamento) {
                return api.get(`/localidades?departamento_id=${this.institucion.domicilio.departamento}`)
                .then(r => this.localidades = r.data)
                .catch(e => {
                    console.error(e);
                    Promise.reject(e);
                });
            }
            else {
                this.localidades = [];
                return Promise.resolve();
            }
        },

        getNivelTitulo: function(nivel) {
            let id = (typeof nivel == 'object') ? nivel.id : nivel;
            return this.opciones.niveles_titulos.find(n => n.id == id).valor;
        },

        addTitulo: function() {
            if (this.$refs.form_titulo.validate()) {
                let titulo = utils.clone(this.nuevo_titulo);

                if (this.titulo_edit == null) {
                    this.institucion.titulos.push(titulo);
                }
                else {
                    Vue.set(this.institucion.titulos, this.titulo_edit, titulo);
                }

                this.$refs.form_titulo.reset();
                this.nuevo_titulo = new Titulo();
                this.titulo_edit = null;
            }
        },

        editTitulo: function(index) {
            this.titulo_edit = index;
            this.nuevo_titulo = utils.clone(this.institucion.titulos[index]);
        },

        borrarTitulo: function(index) {
            this.institucion.titulos.splice(index, 1);
        },

        cancelarEditTitulo: function() {
            this.titulo_edit = null;
        },

        submit: function() {
            if (this.$refs.form_basico.validate()) {
                this.submitted = true;

                if (this.id) {
                    api.put(`/instituciones/${this.id}`, this.institucion)
                    .then(r => {
                        this.submitted = false;
                        this.global_state.snackbar.msg = 'Institución actualizada exitosamente!';
                        this.global_state.snackbar.color = 'success';
                        this.global_state.snackbar.show = true;
                        this.$router.replace('/instituciones/lista');
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
                else {
                    api.post('/instituciones', this.institucion)
                    .then(r => {
                        this.submitted = false;
                        this.global_state.snackbar.msg = 'Nueva institución creada exitosamente!';
                        this.global_state.snackbar.color = 'success';
                        this.global_state.snackbar.show = true;
                        this.$router.replace('/instituciones/lista');
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

}
</script>

<style>

</style>
