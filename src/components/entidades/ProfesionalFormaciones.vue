<template>
<v-form ref="form_formacion" lazy-validation>
    <v-container>
        <v-layout row>
            <v-flex xs6 class="mx-4">
                <v-select
                    :tabindex="tabindex"
                    autocomplete
                    clearable
                    :items="instituciones"
                    item-value="id"
                    item-text="nombre"
                    return-object
                    label="Institución"
                    v-model="nueva_formacion.institucion"
                    :rules="[rules.required]"
                    :filter="filterInstitucion"
                    @input="chgInstitucion"
                >
                    <template slot="item" slot-scope="data">
                        <v-list-tile-action>
                        <v-icon class="green--text" v-if="data.item.valida">check_circle</v-icon>
                        <v-icon class="red--text" v-else>block</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                        <v-list-tile-title>{{ data.item.nombre }}</v-list-tile-title>
                        <v-list-tile-sub-title>CUE: {{ data.item.cue }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </template>
                </v-select>

                <v-select
                    :tabindex="tabindex+1"
                    autocomplete
                    clearable
                    :items="niveles"
                    item-text="valor"
                    item-value="id"
                    return-object
                    label="Nivel Educativo"
                    v-model="nueva_formacion.nivel"
                    :disabled="!nueva_formacion.institucion"
                    @input="updateTitulos"
            ></v-select>

            <v-select
                :tabindex="tabindex+2"
                autocomplete
                clearable
                item-text="nombre"
                item-value="id"
                return-object
                :items="titulos"
                label="Título"
                v-model="nueva_formacion.titulo"
                :rules="[rules.required]"
            >
                <template slot="item" slot-scope="data">
                <template>
                    <v-list-tile-action>
                    <v-icon class="green--text" v-if="data.item.valido">check_circle</v-icon>
                    <v-icon class="red--text" v-else>block</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                    <v-list-tile-title>{{ data.item.nombre }}</v-list-tile-title>
                    </v-list-tile-content>
                </template>
                </template>
            </v-select>

            <v-checkbox
                label="Título Principal"
                :tabindex="tabindex+5"
                class="my-2"
                v-model="nueva_formacion.principal"
                :disabled="existeTituloPrincipal && !nueva_formacion.principal"
            ></v-checkbox>
            </v-flex>

            <v-flex xs6 class="mx-4">
            <input-fecha
                :tabindex="tabindex+3"
                v-model="nueva_formacion.fechaEmision"
                label="Fecha Emisión"
                :rules="[rules.fecha]"
                @change="chgFechaEmision"
            >
            </input-fecha>

            <input-fecha
                :tabindex="tabindex+4"
                v-model="nueva_formacion.fechaEgreso"
                label="Fecha Egreso"
                :rules="[rules.required, rules.fecha]"
            >
            </input-fecha>

            <v-text-field
                label="Lapso desde Emisión"
                readonly
                v-model="nueva_formacion.tiempoEmision"
            ></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout class="mb-4">
            <v-flex xs12>
            <v-btn class="right" light @click="guardar" :tabindex="tabindex+6">
                {{ formacion_edit != null ? 'Guardar' : 'Agregar' }}
            </v-btn>
            <v-btn class="right" light v-show="formacion_edit != null" @click="cancelarEdit">
                Cancelar
            </v-btn>
            </v-flex>
        </v-layout>

        <v-data-table
            :headers="$options.headers"
            :items="value"
            hide-actions
            class="elevation-1 mt-4"
            no-data-text="No hay formaciones"
            style="margin-top:30px"
        >
            <template slot="items" slot-scope="props">
            <tr :active="props.index == formacion_edit">
                <td class="justify-center layout px-0">
                <v-btn icon small class="mx-0" @click="borrar(props.index)">
                    <v-icon color="red">delete</v-icon>
                </v-btn>

                <v-btn icon small class="mx-3" @click="edit(props.index)">
                    <v-icon color="deep-purple">mode_edit</v-icon>
                </v-btn>
                </td>
                <td>{{ props.item.titulo.nombre }}</td>
                <td>{{ props.item.institucion ? props.item.institucion.nombre : props.item.titulo.institucion.nombre }}</td>
                <td>{{ props.item.fechaEgreso | fecha }}</td>
                <td>{{ props.item.fechaEmision | fecha }}</td>
                <td>{{ props.item.tiempoEmision }}</td>
                <td>{{ props.item.principal | boolean }}</td>
            </tr>
            </template>
        </v-data-table>
    </v-container>
</v-form>
</template>

<script>
import moment from 'moment'
import api from '@/services/api'
import * as utils from '@/utils'
import { Formacion, Header } from '@/model'
import MixinValidator from '@/components/mixins/MixinValidator'
import InputFecha from '@/components/base/InputFecha';

export default {
    name: 'ProfesionalFormaciones',

    props: {
        value: {
            type: Array,
            default: () => []
        },

        niveles: {
            type: Array,
            default: () => []
        },

        tabindex: [String, Number]
    },

    mixins: [MixinValidator],

    components: {
        InputFecha
    },

    headers: [
        Header('', 'acciones'),
        Header('Título', 'titulo'),
        Header('Institución', 'institucion'),
        Header('Fecha Egreso', 'fechaEgreso'),
        Header('Fecha Emisión', 'fechaEmision'),
        Header('Lapso Emisión', 'tiempoEmision'),
        Header('Principal', 'principal')
    ],

    computed: {
        existeTituloPrincipal: function() {
            return this.value.find(f => f.principal) != undefined;
        },
    },

    data() {
        return {
            nueva_formacion: new Formacion(),
            formacion_edit: null,
            instituciones: [],
            titulos: []
        }
    },

    created: function() {
        api.get('/instituciones')
        .then(r => {
            this.instituciones = r.data.resultados;
        })
        .catch(e => console.error(e));
    },

    methods: {
        updateTitulos: function() {
            if (this.nueva_formacion.institucion) {
                let url = `/instituciones/${this.nueva_formacion.institucion.id}/titulos`;
                if (this.nueva_formacion.nivel && this.nueva_formacion.nivel.id) 
                    url += `?nivel=${this.nueva_formacion.nivel.id}`;

                return api.get(url)
                .then(r => {
                    this.titulos = r.data;
                    if (this.nueva_formacion.titulo && !this.titulos.find(t => t.id == this.nueva_formacion.titulo.id))
                        this.nueva_formacion.titulo = null;
                })
                .catch(e => console.error(e));
            }
            else this.titulos = [];
        },

        chgInstitucion: function() {
            this.nueva_formacion.nivel = null;
            this.updateTitulos();
        },

        guardar: function() {
            if (this.$refs.form_formacion.validate()) {
                let formaciones = utils.clone(this.value);

                if (this.formacion_edit == null) formaciones.push(this.nueva_formacion);
                else formaciones[this.formacion_edit] = this.nueva_formacion;

                this.$emit('input', formaciones);
                this.nueva_formacion = new Formacion();
                this.formacion_edit = null;
                this.$refs.form_formacion.reset();
            }
        },

        edit: function(index) {
            this.formacion_edit = index;
            this.nueva_formacion = utils.clone(this.value[index]);
            if (this.nueva_formacion.id) {
                this.nueva_formacion.institucion = this.nueva_formacion.titulo.institucion;
                this.nueva_formacion.nivel = this.nueva_formacion.titulo.nivel;
            }
            this.updateTitulos();
        },

        borrar: function(index) {
            let formaciones = utils.clone(this.value);
            formaciones.splice(index, 1);
            this.$emit('input', formaciones);
        },

        cancelarEdit: function() {
            this.formacion_edit = null;
            this.nueva_formacion = new Formacion();
            this.$refs.form_formacion.reset();
        },

        chgFechaEmision: function() {
            this.nueva_formacion.tiempoEmision = '';
            let fecha = moment(this.nueva_formacion.fechaEmision, 'DD/MM/YYYY', true);
            if (fecha.isValid()) {
                this.nueva_formacion.tiempoEmision = utils.diffDatesStr(fecha, moment());
            }
        },

        filterInstitucion: function(item, queryText) {
            if (!queryText || !queryText.length) return true;
            if (item.cue && item.cue.includes(queryText)) return true;
            if (item.nombre.toLowerCase().includes(queryText.toLowerCase())) return true;
            return false;
        }
    }

}
</script>

<style>

</style>
