<template>
    <v-layout>
        <v-flex xs4>
            <input-numero
                ref="prefijo"
                prefix="+54 9"
                :value="value.prefijo"
                :rules="[rules.required, rules.prefijoCelular]"
                @input="updatePrefijo"
            >
            </input-numero>
        </v-flex>
        <v-flex xs5 class="ml-2">
            <input-numero
                ref="numero"
                :value="value.numero"
                :rules="[rules.required, rules.numeroCelular]"
                @input="updateNumero"
            >
            </input-numero>
        </v-flex>
    </v-layout>  
</template>

<script>
import ValidatorMixin from '@/components/mixins/ValidatorMixin'
import InputNumero from '@/components/base/InputNumero'

export default {
    name: 'InputCelular',
    mixins: [ValidatorMixin],
    props: ['value', 'whatsapp'],
    data() {
        return {
        }
    },

    methods: {
        updatePrefijo: function(e) {
            this.$emit('input', { prefijo: e, numero: this.value.numero });
        },

        updateNumero: function(e) {
            this.$emit('input', { prefijo: this.value.prefijo, numero: e });
        }
    },

    components: {
        InputNumero
    }

}
</script>

<style>

</style>
