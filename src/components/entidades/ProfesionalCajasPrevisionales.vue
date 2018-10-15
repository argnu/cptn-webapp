<template>
<v-form lazy-validation ref="form_beneficiario" @submit.prevent>
    <v-layout row>
        <v-flex xs5 class="mx-4">
            <input-select-new
                :tabindex="tabindex"
                label="Nombre"
                maxlength="100"
                :items="cajas_previsionales_filter"
                item-text="nombre"
                item-value="id"
                v-model="nueva_caja"
                :rules="[rules.required]"
                return-object
            ></input-select-new>
        </v-flex>

        <v-flex xs3>
            <v-btn @click="addCaja" :tabindex="tabindex+1">Agregar</v-btn>
        </v-flex>
    </v-layout>

    <v-layout>
        <v-flex xs12>
            <v-data-table
                :headers="$options.headers"
                :items="value"
                hide-actions
                class="elevation-1 mx-4"
                no-data-text="No hay cajas agregadas"
                style="margin-top:30px"
            >
                <template slot="items" slot-scope="props">
                <td class="justify-center layout px-0">
                    <v-btn icon small class="mx-0" @click="borrar(props.index)">
                    <v-icon color="red">delete</v-icon>
                    </v-btn>
                </td>
                <template v-if="props.item.caja">
                    <td>{{ props.item.caja.nombre }}</td>
                </template>
                <template v-else>
                    <td>{{ props.item.nombre }}</td>
                </template>
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
import { Formacion, ColumnHeader } from '@/model'
import MixinValidator from '@/components/mixins/MixinValidator'
import InputTexto from '@/components/base/InputTexto'
import InputSelectNew from '@/components/base/InputSelectNew';

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
        InputSelectNew
    },

    headers: [
        ColumnHeader('', 'acciones'),
        ColumnHeader('Nombre', 'nombre')
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
            cajas_previsionales: [],
            nueva_caja: '',
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
        updateCajas: function() {
            return api.get('/cajas-previsionales?sort=+nombre')
            .then(r => this.cajas_previsionales = r.data)
            .catch(e => console.error(e));
        },

        addCaja: function() {
            if (this.$refs.form_beneficiario.validate()) {
                let cajas = this.value;

                if (typeof this.nueva_caja == 'object') {
                    this.value.push(this.nueva_caja);
                    this.nueva_caja = '';
                    this.$refs.form_beneficiario.reset();
                    this.$emit('input', cajas);
                }
                else if (typeof this.nueva_caja == 'string') {
                    api.post('/cajas-previsionales', { nombre: this.nueva_caja })
                    .then(caja => {
                        this.updateCajas()
                        .then(() => {
                        this.value.push(caja.data);
                        this.nueva_caja = '';
                        this.$refs.form_beneficiario.reset();
                        this.$emit('input', cajas);
                        })
                    })
                    .catch(e => console.log(e));
                }
            }
        },

        borrar: function(index) {
            let cajas = this.value;
            cajas.splice(index, 1);
            this.$emit('input', cajas);
        }
    }

}
</script>

<style>

</style>
