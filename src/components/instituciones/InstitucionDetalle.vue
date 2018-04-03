<template>
    <v-container>
          <v-toolbar class="darken-3" color="primary">
        <v-toolbar-title class="white--text">Institución</v-toolbar-title>
      </v-toolbar>
      <v-card>
          <v-layout>
            <v-flex xs5 class="ma-4">
                    <template v-if="edit.nombre">
                        <v-text-field
                            label="Nombre"
                            v-model="institucion.nombre"
                        ></v-text-field>
                    </template>
                    <template v-else>
                        <b>Nombre:</b>
                        <span class="ml-2">{{ institucion.nombre }}</span>
                    </template>

                    <v-btn fab small light @click="edit.nombre = true" v-show="!edit.nombre">
                        <v-icon>edit</v-icon>
                    </v-btn>
                    <v-btn fab small light @click="cancelarEdit('nombre')" v-show="edit.nombre">
                        <v-icon>cancel</v-icon>
                    </v-btn>
                    <v-btn fab small light v-show="edit.nombre" @click="guardar('nombre')">
                        <v-icon>save</v-icon>
                    </v-btn>
            </v-flex>

            <v-flex xs5 class="ma-4">
                        <template v-if="edit.cue">
                            <v-text-field
                                label="CUE"
                                v-model="institucion.cue"
                            ></v-text-field>
                        </template>
                        <template v-else>
                            <b>CUE:</b>
                            <span class="ml-2">{{ institucion.cue }}</span>
                        </template>

                        <v-btn fab small light @click="edit.cue = true" v-show="!edit.cue">
                            <v-icon>edit</v-icon>
                        </v-btn>
                        <v-btn fab small light @click="cancelarEdit('cue')" v-show="edit.cue">
                            <v-icon>cancel</v-icon>
                        </v-btn>

                        <v-btn fab small light v-show="edit.cue" @click="guardar('cue')">
                            <v-icon>save</v-icon>
                        </v-btn>
            </v-flex>
          </v-layout>

        <span class="subheading blue--text text--darken-4 ma-4"><b>Títulos</b></span>

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
                                <td>
                                    <v-btn fab small dark color="primary"  @click="editTitulo(props.item)">
                                        <v-icon>edit</v-icon>
                                    </v-btn>
                                </td>
                                <td>
                                    <v-btn fab small dark color="primary"  @click="borrarTitulo(props.item.id)">
                                        <v-icon>delete</v-icon>
                                    </v-btn>
                                </td>
                                <td>{{ props.item.nombre }}</td>
                                <td>{{ props.item.nivel.valor }}</td>
                                <td>{{ props.item.tipo_matricula }}</td>
                                <td>{{ props.item.incumbencias | lista_incumbencias }}</td>
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
                            <v-text-field
                                label="Nombre"
                                v-model="nuevo_titulo.nombre"
                                :rules="[rules.required]"
                            >
                            </v-text-field>

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

                        <v-flex xs12 md3 class="mx-4">
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
                        </v-flex>

                        <v-flex xs12 md3 class="mx-4">
                            <v-select
                                label="Tipo de Matrícula"
                                autocomplete
                                :items="$options.tipos_matricula"
                                v-model="nuevo_titulo.tipo_matricula"
                                :rules="[rules.required]"
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
import axios from '@/axios'
import * as utils from '@/utils'
import { Header } from '@/model'
import { Institucion, Titulo } from '@/model/Institucion'
import MixinValidator from '@/components/mixins/MixinValidator'


export default {
    name: 'InstitucionDetalle',
    props: ['id'],
    mixins: [MixinValidator],

    headers: [
        Header('Modificar', 'edit'),
        Header('Borrar', 'borrar'),
        Header('Nombre', 'nombre'),
        Header('Nivel', 'nivel'),
        Header('Tipo de Matrícula', 'tipo_matricula'),
        Header('Incumbencias', 'incumbencias')
    ],

    tipos_matricula: [
        { text: 'TECA', value: 'TECA' },
        { text: 'TEC-', value: 'TEC-' },
        { text: 'IDO', value: 'IDO' }
    ],

    filters: {
        lista_incumbencias: function(lista) {
            return lista.map(i => i.incumbencia.valor).join(', ');
        }
    },

    data() {
        return {
            institucion: new Institucion(),
            institucion_original: null,
            show_formtitulo: false,
            nuevo_titulo: new Titulo(),
            titulo_edit: null,
            edit: {
                cue: false,
                nombre: false
            },
            opciones: [],
        }
    },

    created: function() {
        Promise.all([
            axios.get(`/opciones`),
            this.update()
        ])
        .then(r => {
            this.opciones = r[0].data;
        })
    },

    methods: {
        update: function() {
            return axios.get(`/instituciones/${this.id}`)
            .then(r => {
                this.institucion = r.data
                this.institucion_original = utils.clone(r.data);
            });
        },

        addTitulo: function() {
            if (this.$refs.form_titulo.validate()) {
                if (this.titulo_edit == null) {
                    axios.post(`/instituciones/${this.id}/titulos`, this.nuevo_titulo)
                    .then(r => {
                        this.update();
                        this.resetNuevoTitulo();
                    })
                }
                else {
                    axios.put(`/instituciones/${this.id}/titulos/${this.titulo_edit}`, this.nuevo_titulo)
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
            this.nuevo_titulo.nivel = titulo.nivel.id;
            this.nuevo_titulo.tipo_matricula = titulo.tipo_matricula;
            this.nuevo_titulo.incumbencias = titulo.incumbencias.map(i => i.incumbencia);
            this.show_formtitulo = true;
        },

        borrarTitulo: function(id) {
            axios.delete(`/instituciones/${this.id}/titulos/${id}`)
            .then(r => {
                this.update();
            })
            .catch(e => {
                if (e.response.status == 400)
                    alert('No es posible eliminar el título. Existen profesionales relacionados al mismo');
                else console.error(e);
            })
        },

        cancelar: function() {
            this.resetNuevoTitulo();
        },

        resetNuevoTitulo: function() {
            this.nuevo_titulo = new Titulo();
            this.show_formtitulo = false;
            this.titulo_edit = null;
            this.$refs.form_titulo.reset();
        },

        guardar: function(atributo) {
            let patch = {};
            patch[atributo] = this.institucion[atributo];
            axios.patch(`/instituciones/${this.id}`, patch)
            .then(r => {
                this.edit.nombre = false;
                this.edit.cue = false;
                this.update();
            })
        },

        cancelarEdit: function(atributo) {
            this.institucion[atributo] = this.institucion_original[atributo];
            this.edit[atributo] = false;
        }

    }

}
</script>

<style>

</style>
