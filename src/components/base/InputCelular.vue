<template>
    <v-layout>
        <v-flex xs3>
            <v-text-field 
                ref="prefijo"
                prefix="+54 9"
                :value="value.prefijo"
                maxlength="4"
                @input="updatePrefijo"
                :rules="validator.prefijo"
            >
            </v-text-field>
        </v-flex>
        <v-flex xs5 class="mx-2">
            <v-text-field 
                ref="numero"
                :value="value.numero"
                maxlength="8"
                @input="updateNumero"
                :rules="validator.numero"
            >
            </v-text-field>
        </v-flex>
    </v-layout>  
</template>

<script>
import rules from '@/rules'

export default {
    name: 'InputCelular',
    props: ['value', 'whatsapp', 'rules', 'error'],
    data() {
        return {
            validator: {
                prefijo: [rules.required, rules.prefijoCelular],
                numero: [rules.required, rules.numeroCelular]
            }
        }
    },

    methods: {
        updatePrefijo: function(e) {
            this.$emit('input', { prefijo: e, numero: this.value.numero });
        },

        updateNumero: function(e) {
            this.$emit('input', { prefijo: this.value.prefijo, numero: e });
        }


    }

}
</script>

<style>

</style>
