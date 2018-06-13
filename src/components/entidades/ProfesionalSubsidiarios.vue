<template>
<v-form ref="form_subsidiario" lazy-validation>
    <v-layout row>
    <v-flex xs6 class="ma-4">
        <input-numero
            :tabindex="tabindex"
            label="DNI"
            maxlength="8"
            v-model="nuevo_subsidiario.dni"
            :rules="[rules.required, rules.integer, rules.dni]"
        ></input-numero>

        <input-texto
            :tabindex="tabindex+1"
            label="Apellido"
            maxlength="100"
            type="letras"
            uppercase
            v-model="nuevo_subsidiario.apellido"
            :rules="[rules.required]"
        ></input-texto>
    </v-flex>

    <v-flex xs6 class="ma-4">
        <input-texto
            :tabindex="tabindex+2"
            label="Nombre"
            maxlength="100"
            type="letras"
            uppercase
            v-model="nuevo_subsidiario.nombre"
            :rules="[rules.required]"
        ></input-texto>

        <input-numero
            :tabindex="tabindex+3"
            label="Porcentaje"
            decimal
            v-model="nuevo_subsidiario.porcentaje"
            :rules="[rules.required]"
        ></input-numero>
    </v-flex>
    </v-layout>

    <v-layout>
        <v-flex xs12>
            <v-btn class="right mb-4" light @click="guardar" :tabindex="tabindex+4">
                {{ subsidiario_edit != null ? 'Guardar' : 'Agregar' }}
            </v-btn>
            <v-btn class="right" light v-show="subsidiario_edit != null" @click="cancelarEdit">
                Cancelar
            </v-btn>
        </v-flex>
    </v-layout>

    <v-layout>
        <v-flex xs12>
            <v-data-table
                :headers="$options.headers"
                :items="value"
                hide-actions
                class="elevation-1 mx-4"
                no-data-text="No hay subsidiarios"
            >
                <template slot="items" slot-scope="props">
                    <tr :active="props.index == subsidiario_edit">
                    <td class="justify-center layout px-0">
                        <v-btn icon small class="mx-0" @click="borrar(props.index)">
                        <v-icon color="red">delete</v-icon>
                        </v-btn>

                        <v-btn icon small class="mx-3" @click="edit(props.index)">
                        <v-icon color="deep-purple">edit</v-icon>
                        </v-btn>
                    </td>
                    <td>{{ props.item.dni }}</td>
                    <td>{{ props.item.apellido }}</td>
                    <td>{{ props.item.nombre }}</td>
                    <td>{{ props.item.porcentaje }}</td>
                    </tr>
                </template>
            </v-data-table>
        </v-flex>
    </v-layout>
</v-form>
</template>

<script>
import moment from 'moment'
import api from '@/services/api'
import * as utils from '@/utils'
import { Subsidiario, Header } from '@/model'
import MixinValidator from '@/components/mixins/MixinValidator'
import InputTexto from '@/components/base/InputTexto'
import InputNumero from '@/components/base/InputNumero'

export default {
    name: 'ProfesionalCajasPrevisionales',

    props: {
        value: {
            type: Array,
            default: () => []
        },

        opciones: {
            type: Array,
            default: () => []
        },

        tabindex: [String, Number]
    },

    mixins: [MixinValidator],

    components: {
        InputTexto,
        InputNumero
    },

    headers: [
        Header('', 'acciones'),
        Header('DNI', 'dni'),
        Header('Apellido', 'apellido'),
        Header('Nombre', 'nombre'),
        Header('Porcentaje', 'porcentaje')
    ],

    computed: {
        cajas_previsionales_filter: function() {
            if (!this.value.length) return this.cajas_previsionales;
            return this.cajas_previsionales.filter(c =>
                !this.value.find(cp => {
                    return cp == c.nombre || cp == c.id || cp.nombre == c.nombre
                })
            );
        },
    },

    data() {
        return {
            subsidiario_edit: null,
            nuevo_subsidiario: new Subsidiario()
        }
    },

    created: function() {
        api.get('/cajas-previsionales?sort=+nombre')
        .then(r => {
            this.cajas_previsionales = r.data;
        })
        .catch(e => console.error(e));
    },

    methods: {
        guardar: function() {
            if (this.$refs.form_subsidiario.validate()) {
                let subsidiarios = utils.clone(this.value);

                if (this.subsidiario_edit == null) subsidiarios.push(this.nuevo_subsidiario);
                else subsidiarios[this.subsidiario_edit] = this.nuevo_subsidiario;
                
                this.$emit('input', subsidiarios);
                this.nuevo_subsidiario = new Subsidiario();
                this.$refs.form_subsidiario.reset();
                this.subsidiario_edit = null;
            }
        },

        edit: function(index) {
            this.subsidiario_edit = index;
            this.nuevo_subsidiario = utils.clone(this.value[index]);
        },

        borrar: function(index) {
            let subsidiarios = utils.clone(this.value);
            subsidiarios.splice(index, 1);
            this.$emit('input', subsidiarios);
        },

        cancelarEdit: function() {
            this.subsidiario_edit = null;
            this.nuevo_subsidiario = new Subsidiario();
            this.$refs.form_subsidiario.reset();
        },
    }

}
</script>

<style>

</style>
