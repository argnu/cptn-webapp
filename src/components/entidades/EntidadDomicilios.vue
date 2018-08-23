<template>
<v-form ref="form_domicilio" lazy-validation>
    <v-layout row class="mx-4">
        <v-flex xs8>
            <v-select
                label="Tipo"
                autocomplete
                :tabindex="tabindex"
                :items="tipos_domicilio"
                :rules="domicilio_edit != null ? [] : [rules.required]"
                :disabled="domicilio_edit != null"
                v-model="nuevo_domicilio.tipo"
            >
            </v-select>
        </v-flex>

        <v-flex xs3 class="mt-2 ml-4">
            <v-menu offset-y>
                <v-btn slot="activator" :tabindex="tabindex+1" :disabled="!nuevo_domicilio.tipo.length">
                    Copiar de...
                </v-btn>
                <v-list>
                    <v-list-tile
                        v-for="tipo of tipos_domicilio_cargados"
                        :key="tipo.value" @click="copiarDomicilio(tipo.value)"
                    >
                    <v-list-tile-title>{{ tipo.text }}</v-list-tile-title>
                    </v-list-tile>
                </v-list>
            </v-menu>
        </v-flex>
        </v-layout>

        <v-layout row>
            <v-flex xs6 class="ma-4">
                <v-select
                    :tabindex="tabindex+2"
                    label="País"
                    return-object
                    autocomplete
                    item-text="nombre"
                    item-value="id"
                    :items="paises"
                    :rules="[rules.required]"
                    v-model="nuevo_domicilio.domicilio.pais"
                    @input="changePais"
                ></v-select>

                <v-select
                    :tabindex="tabindex+4"
                    label="Departamento"
                    autocomplete
                    return-object
                    :items="departamentos"
                    @input="changeDepartamento"
                    v-model="nuevo_domicilio.domicilio.departamento"
                    item-text="nombre"
                    item-value="id"
                    :rules="[rules.required]"
                ></v-select>

                <input-texto
                    :tabindex="tabindex+6"
                    uppercase
                    maxlength="100"
                    label="Dirección"
                    v-model="nuevo_domicilio.domicilio.direccion"
                    :rules="[rules.required]"
                ></input-texto>
            </v-flex>

            <v-flex xs6 class="ma-4">
                <v-select
                    :tabindex="tabindex+3"
                    :items="provincias"
                    label="Provincia"
                    @input="changeProvincia"
                    v-model="nuevo_domicilio.domicilio.provincia"
                    autocomplete
                    return-object
                    item-text="nombre"
                    item-value="id"
                    :rules="[rules.required]"
                ></v-select>

                <v-select
                    :tabindex="tabindex+5"
                    :items="localidades"
                    label="Localidad"
                    v-model="nuevo_domicilio.domicilio.localidad"
                    :rules="[rules.required]"
                    autocomplete
                    return-object
                    item-text="nombre"
                    item-value="id"
                ></v-select>
            </v-flex>
        </v-layout>

        <v-layout class="mb-4">
            <v-flex xs12>
                <v-btn
                    :tabindex="tabindex+7"
                    class="right"
                    light
                    @click="guardar"
                >
                {{ domicilio_edit != null ? 'Guardar' : 'Agregar' }}
                </v-btn>

                <v-btn class="right" light v-show="domicilio_edit != null" @click="resetDomicilio">
                    Cancelar
                </v-btn>
            </v-flex>
        </v-layout>

        <v-layout>
            <v-flex x12>
                <v-data-table
                    :headers="$options.headers.domicilios"
                    :items="value"
                    hide-actions
                    class="elevation-1 mx-4"
                    no-data-text="No hay domicilios"
                >
                    <template slot="items" slot-scope="props">
                        <tr :active="props.index == domicilio_edit">
                        <td class="justify-center layout px-0">
                            <v-btn icon small class="mx-0" @click="borrar(props.index)">
                            <v-icon color="red">delete</v-icon>
                            </v-btn>

                            <v-btn icon small class="mx-3" @click="edit(props.index)">
                            <v-icon color="deep-purple">mode_edit</v-icon>
                            </v-btn>
                        </td>

                        <td>{{ props.item.tipo | upperFirst }}</td>
                        <td>{{ props.item.domicilio.pais.nombre }}</td>
                        <td>{{ props.item.domicilio.provincia.nombre }}</td>
                        <td>{{ props.item.domicilio.departamento.nombre }}</td>
                        <td>{{ props.item.domicilio.localidad.nombre }}</td>
                        <td>{{ props.item.domicilio.direccion }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
</v-form>
</template>

<script>
import * as utils from '@/utils'
import api from '@/services/api'
import { Domicilio, EntidadCondicionAfip, Header } from '@/model'
import MixinValidator from '@/components/mixins/MixinValidator'
import InputTexto from '@/components/base/InputTexto'


const tipos_domicilio = [
    Header('Real (Domicilio Declarado en DNI)', 'real'),
    Header('Legal (Domicilio Profesional)', 'legal'),
    Header('Especial (Domicilio Constituido)', 'especial')
]

const EntidadDomicilio = () => ({
    tipo: '',
    domicilio: new Domicilio()
})

export default {
    name: 'EntidadDomicilios',

    props: {
        value: {
            type: Array,
            default: () => []
        },

        tabindex: [String,Number]
    },

    mixins: [MixinValidator],

    components: {
        InputTexto
    },

    headers: [
        Header('', 'acciones'),
        Header('Tipo', 'tipo'),
        Header('País', 'pais'),
        Header('Provincia', 'provincia'),
        Header('Departamento', 'departamento'),
        Header('Localidad', 'localidad'),
        Header('Dirección', 'direccion'),
    ],

    data() {
        return {
            domicilio_edit: null,
            nuevo_domicilio: EntidadDomicilio(),
            paises: [],
            provincias: [],
            departamentos: [],
            localidades: [],
        }
    },

    computed: {
        tipos_domicilio: function() {
            if (!this.value.length) return tipos_domicilio;
            else {
                let tipos = this.value.map(d => d.tipo);
                return tipos_domicilio.filter(d => {
                    return !tipos.find(t => t == d.value)
                });
            }
        }    ,

        tipos_domicilio_cargados: function() {
            if (!this.value.length) return [];
            else {
                let tipos = this.value.map(d => d.tipo);
                return tipos_domicilio.filter(d => {
                    return tipos.find(t => t == d.value)
                });
            }
        }
    },

    created: function() {
        this.nuevo_domicilio.domicilio.departamento = this.global_state.delegacion.domicilio.departamento;
        this.nuevo_domicilio.domicilio.localidad = this.global_state.delegacion.domicilio.localidad;

        api.get('/paises')
        .then(r => {
            this.paises = r.data;
            this.changeCombosDomicilio()
        })
        .catch(e => console.error(e));

    },

    methods: {
        changePais: function() {
            if (this.nuevo_domicilio.domicilio.pais) {
                return api.get(`/provincias?pais_id=${this.nuevo_domicilio.domicilio.pais.id}`)
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
            if (this.nuevo_domicilio.domicilio.provincia) {
                return api.get(`/departamentos?provincia_id=${this.nuevo_domicilio.domicilio.provincia.id}`)
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
            if (this.nuevo_domicilio.domicilio.departamento) {
                return api.get(`/localidades?departamento_id=${this.nuevo_domicilio.domicilio.departamento.id}`)
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

        guardar: function () {
            if (this.$refs.form_domicilio.validate()) {
                this.nuevo_domicilio.domicilio.direccion = this.nuevo_domicilio.domicilio.direccion.toUpperCase();

                let domicilios = utils.clone(this.value);

                if (this.domicilio_edit != null && this.value[this.domicilio_edit]) {
                    this.nuevo_domicilio.tipo = this.value[this.domicilio_edit].tipo;
                    this.nuevo_domicilio.id = this.value[this.domicilio_edit].id;
                    domicilios[this.domicilio_edit] = this.nuevo_domicilio;
                }
                else {
                    domicilios.push(this.nuevo_domicilio);
                }

                this.$emit('input', domicilios);
                this.resetDomicilio();
            }
        },

        copiarDomicilio: function(tipo) {
            let domicilio_copiar = this.value.find(d => d.tipo == tipo).domicilio;
            this.nuevo_domicilio.domicilio = utils.clone(domicilio_copiar);
            this.changeCombosDomicilio();
        },

        changeCombosDomicilio: function() {
            api.get(`/provincias?pais_id=${this.nuevo_domicilio.domicilio.pais.id}`)
            .then(r => {
                this.provincias = r.data;
                return api.get(`/departamentos?provincia_id=${this.nuevo_domicilio.domicilio.provincia.id}`)
            })
            .then(r => {
                this.departamentos = r.data;
                return api.get(`/localidades?departamento_id=${this.nuevo_domicilio.domicilio.departamento.id}`)
            })
            .then(r => {
                this.localidades = r.data;
            })
            .catch(e => console.error(e));
        },

        edit: function(index) {
            this.domicilio_edit = index;
            this.nuevo_domicilio = utils.clone(this.value[index]);
            this.changeCombosDomicilio();
        },

        borrar: function(index) {
            let domicilios = utils.clone(this.value);
            domicilios.splice(index, 1);
            this.$emit('input', domicilios);
        },

        resetDomicilio: function() {
            this.domicilio_edit = null;
            this.nuevo_domicilio = EntidadDomicilio();
            // this.$refs.form_domicilio.reset();
            this.nuevo_domicilio.domicilio.pais = 1;
            this.nuevo_domicilio.domicilio.provincia = 14;
            this.nuevo_domicilio.domicilio.departamento = this.global_state.delegacion.domicilio.departamento;
            this.nuevo_domicilio.domicilio.localidad = this.global_state.delegacion.domicilio.localidad;
        },
    }

}
</script>

<style>

</style>
