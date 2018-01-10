<template>
    <v-layout>
        <v-flex xs4>
            <v-text-field 
                ref="prefijo"
                prefix="+54 9"
                :value="value.prefijo"
                maxlength="4"
                @input="updatePrefijo"
                :rules="[rules.required, rules.prefijoCelular]"
            >
            </v-text-field>
        </v-flex>
        <v-flex xs5 class="ml-2">
            <v-text-field 
                ref="numero"
                :value="value.numero"
                maxlength="8"
                @input="updateNumero"
                :rules="[rules.required, rules.numeroCelular]"
            >
            </v-text-field>
        </v-flex>
    </v-layout>  
</template>

<script>
import ValidatorMixin from '@/components/mixins/ValidatorMixin'

export default {
    name: 'InputCelular',
    props: ['value', 'whatsapp', 'rules', 'error'],
    mxins: [ValidatorMixin],

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
