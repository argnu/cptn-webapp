<template>
    <v-container v-if="value">
        <v-form ref="form_variable" lazy-validation>
            <v-layout>
                <v-flex xs12 md3 class="mx-4">
                    <v-text-field
                        label="Descripción"
                        readonly
                        :value="value.variable ? value.variable.descripcion : ''"
                    ></v-text-field>

                    <input-numero
                        class="mt-2"
                        label="Valor"
                        decimal
                        :value="value.valor"
                        :rules="[rules.required]"
                        @input="chgVariable('valor', $event)"
                    ></input-numero>
                </v-flex>

                <v-flex xs12 md3 class="mx-4">
                    <input-fecha
                        label="Fecha de Inicio"
                        :value="value.fecha_inicio"
                        :rules="[rules.required, rules.fecha]"
                        @input="chgVariable('fecha_inicio', $event)"
                    ></input-fecha>
                </v-flex>

                <v-flex xs12 md3 class="mx-4">
                    <input-fecha
                        label="Fecha de Fin"
                        :value="value.fecha_fin"
                        :rules="[rules.required, rules.fecha]"
                        @input="chgVariable('fecha_fin', $event)"
                    ></input-fecha>
                </v-flex>
            </v-layout>

            <v-layout class="mb-4">
                <v-flex xs12>
                <v-btn
                    class="green right"
                    dark
                    @click="validar"
                >
                    Guardar
                    <v-icon dark right>check_circle</v-icon>
                </v-btn>

                <v-btn dark class="red right" @click="$emit('cancelar')">
                    Cancelar
                    <v-icon dark right>block</v-icon>
                </v-btn>
                </v-flex>
            </v-layout>
        </v-form>      
    </v-container>
</template>

<script>
import InputTexto from '@/components/base/InputTexto'
import InputNumero from '@/components/base/InputNumero'
import InputFecha from '@/components/base/InputFecha'
import MixinValidator from '@/components/mixins/MixinValidator'
import * as utils from '@/utils'

export default {
    name: 'VariableGlobal',

    props: ['value'],

    mixins: [MixinValidator],

    components: {
        InputNumero,
        InputTexto,
        InputFecha
    },

    methods: {
        chgVariable: function(atributo, valor) {
            let variable = utils.clone(this.value);
            variable[atributo] = valor;
            this.$emit('input', variable);
        },

        reset: function() {
            this.$refs.form_variable.reset();
        },

        validar: function() {
            if (this.$refs.form_variable.validate()) this.$emit('guardar');
        }
    }

}
</script>

<style>

</style>
