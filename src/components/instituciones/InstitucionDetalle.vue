<template>
    <v-container>
          <v-toolbar class="darken-3" color="primary">
        <v-toolbar-title class="white--text">Institución</v-toolbar-title>
      </v-toolbar>
      <v-card>

          <br>
          <span class="subheading blue--text text--darken-4 ml-5"><b>Datos Básicos</b></span>
          <br>

        <v-layout  class="ma-4">
            <v-flex xs4 class="mx-4">
                <b>Nombre:</b>
                <span class="ml-2">{{ institucion.nombre }}</span>
            </v-flex>

            <v-flex xs4 class="mx-4">
                <b>CUE:</b>
                <span class="ml-2">{{ institucion.cue }}</span>
            </v-flex>

            <v-flex xs2 class="mx-4">
                <b>Válida:</b>
                <span class="ml-2">{{ institucion.valida | boolean }}</span>
            </v-flex>
        </v-layout>

        <v-divider class="my-5"></v-divider>
        
        <span class="subheading blue--text text--darken-4 ml-5"><b>Títulos</b></span>

        <v-layout row>
            <v-flex xs12 class="ma-4">
                <v-card class="elevation-0">
                    <div>
                        <v-btn
                            absolute dark fab top right small
                            color="green"
                            @click="show_formtitulo = true"
                        >
                            <v-icon>add</v-icon>
                        </v-btn>
                        <!-- <span class="subheading blue--text text--darken-4"><b>Títulos</b></span> -->
                        <v-data-table
                            :headers="$options.headers"
                            :items="institucion.titulos"
                            class="elevation-1"
                            no-data-text="No tiene títulos"
                            no-results-text="No tiene títulos"
                            hide-actions
                        >
                            <template slot="items" slot-scope="props">
                                <td class="justify-center layout px-0">
                                    <v-btn small icon class="mx-0" @click="borrarTitulo(props.item.id)">
                                        <v-icon color="red">delete</v-icon>
                                    </v-btn>

                                    <v-btn small icon class="mx-4" @click="editTitulo(props.item)">
                                        <v-icon color="deep-purple">edit</v-icon>
                                    </v-btn>
                                </td>
                                <td>{{ props.item.nombre }}</td>
                                <td>{{ props.item.nivel.valor }}</td>
                                <td>{{ props.item.tipo_matricula.valor }}</td>
                                <td>{{ props.item.incumbencias | lista_incumbencias }}</td>
                                <td>{{ props.item.valido | boolean }}</td>
                            </template>
                        </v-data-table>
                    </div>
                </v-card>
            </v-flex>
        </v-layout>
      </v-card>


        <v-dialog v-model="show_formtitulo" fullscreen transition="dialog-bottom-transition" :overlay="false">
        <v-card>
            <v-toolbar dark color="primary">
            <v-toolbar-title class="white--text">{{ titulo_edit != null ? 'Modificar' : 'Agregar' }} Título</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="show_formtitulo = false">
                <v-icon>close</v-icon>
            </v-btn>
            </v-toolbar>
            <v-container>
                <v-form ref="form_titulo" lazy-validation>
                    <v-layout>
                        <v-flex xs12 md3 class="mx-4">
                            <input-texto
                                label="Nombre"
                                uppercase
                                v-model="nuevo_titulo.nombre"
                                :rules="[rules.required]"
                            >
                            </input-texto>

                            <v-select
                                label="Incumbencias"
                                :items="opciones.incumbencia"
                                item-text="valor"
                                item-value="id"
                                v-model="nuevo_titulo.incumbencias"
                                multiple
                                return-object
                                max-height="400"
                                hint="Seleccione las incumbencias"
                                persistent-hint
                            ></v-select>
                        </v-flex>

                        <v-flex xs12 md3 class="mx-4">
                            <v-select
                                label="Nivel"
                                autocomplete
                                return-object
                                :items="opciones.niveles_titulos"
                                item-value="id"
                                item-text="valor"
                                v-model="nuevo_titulo.nivel"
                                :rules="[rules.required]"
                            >
                            </v-select>

                            <v-checkbox
                                class="mt-2"
                                label="Válido"
                                v-model="nuevo_titulo.valido"
                            ></v-checkbox>
                        </v-flex>

                        <v-flex xs12 md3 class="mx-4">
                            <v-select
                                label="Tipo de Matrícula"
                                autocomplete
                                clearable
                                return-object
                                item-text="valor"
                                item-value="id"
                                :items="opciones.matricula"
                                v-model="nuevo_titulo.tipo_matricula"
                            >
                            </v-select>
                        </v-flex>
                    </v-layout>

                    <v-layout class="mb-4">
                        <v-flex xs12>
                        <v-btn
                            class="green right"
                            dark
                            @click="addTitulo"
                        >
                            {{ titulo_edit != null ? 'Guardar' : 'Agregar' }}
                            <v-icon dark right>check_circle</v-icon>
                        </v-btn>

                        <v-btn dark class="red right" @click="cancelar">
                            Cancelar
                            <v-icon dark right>block</v-icon>
                        </v-btn>
                        </v-flex>
                    </v-layout>
                </v-form>
            </v-container>

        </v-card>
        </v-dialog>
    </v-container>
</template>

<script>
import api from '@/services/api'
import * as utils from '@/utils'
import { Header } from '@/model'
import { Institucion, Titulo } from '@/model/Institucion'
import InputTexto from '@/components/base/InputTexto'
import MixinValidator from '@/components/mixins/MixinValidator'


export default {
    name: 'InstitucionDetalle',

    props: ['id'],

    mixins: [MixinValidator],

    components: {
        InputTexto
    },

    headers: [
        Header('', 'acciones'),
        Header('Nombre', 'nombre'),
        Header('Nivel', 'nivel'),
        Header('Tipo de Matrícula', 'tipo_matricula'),
        Header('Incumbencias', 'incumbencias'),
        Header('Válido', 'valido')
    ],

    filters: {
        lista_incumbencias: function(lista) {
            return lista.map(i => i.incumbencia.valor).join(', ');
        }
    },

    data() {
        return {
            institucion: new Institucion(),
            show_formtitulo: false,
            nuevo_titulo: new Titulo(),
            titulo_edit: null,
            opciones: []
        }
    },

    created: function() {
        Promise.all([
            api.get(`/opciones`),
            this.update()
        ])
        .then(r => {
            this.opciones = r[0].data;
        })
    },

    methods: {
        update: function() {
            return api.get(`/instituciones/${this.id}`)
            .then(r => {
                this.institucion = r.data
                this.institucion_mod = utils.clone(r.data);
            });
        },

        addTitulo: function() {
            if (this.$refs.form_titulo.validate()) {
                let titulo = utils.clone(this.nuevo_titulo);
                titulo.nombre = titulo.nombre.toUpperCase();

                if (titulo.tipo_matricula) titulo.tipo_matricula = titulo.tipo_matricula.id;
                titulo.nivel = titulo.nivel.id;
                titulo.incumbencias = titulo.incumbencias.map(i => i.id);

                if (this.titulo_edit == null) {
                    api.post(`/instituciones/${this.id}/titulos`, titulo)
                    .then(r => {
                        this.update();
                        this.resetNuevoTitulo();
                    })
                }
                else {
                    api.put(`/instituciones/${this.id}/titulos/${this.titulo_edit}`, titulo)
                    .then(r => {
                        this.update();
                        this.resetNuevoTitulo();
                    })
                }
            }
        },

        editTitulo: function(titulo) {
            this.titulo_edit = titulo.id;
            this.nuevo_titulo.nombre = titulo.nombre;
            this.nuevo_titulo.nivel = titulo.nivel;
            this.nuevo_titulo.tipo_matricula = titulo.tipo_matricula;
            this.nuevo_titulo.incumbencias = titulo.incumbencias.map(i => i.incumbencia);
            this.nuevo_titulo.valido = titulo.valido;
            this.show_formtitulo = true;
        },

        borrarTitulo: function(id) {
            api.delete(`/instituciones/${this.id}/titulos/${id}`)
            .then(r => {
                this.update();
            })
            .catch(e => {
                if (e.response.status == 409)
                    alert('No es posible eliminar el título. Existen profesionales relacionados al mismo');
                else console.error(e);
            })
        },

        cancelar: function() {
            this.resetNuevoTitulo();
        },

        resetNuevoTitulo: function() {
            this.$refs.form_titulo.reset();
            this.nuevo_titulo = new Titulo();
            this.show_formtitulo = false;
            this.titulo_edit = null;
        }

    }

}
</script>

<style>

</style>
