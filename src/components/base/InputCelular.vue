<template>
    <v-layout>
        <v-flex xs2>
            <input-numero
                prefix="+"
                suffix="9"
                maxlength="4"
                ref="pref_pais"
                :value="value.pais"
                :rules="[rules.required, rules.prefijoCelularPais]"
                @input="updatePrefijoPais"
            >
            </input-numero>
        </v-flex>
        <v-flex xs2 class="ml-2">
            <input-numero
                maxlength="5"
                ref="prefijo"
                :value="value.provincia"
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
        updatePrefijoPais: function(e) {
            this.$emit('input', { pais: e, provincia: this.value.provincia, numero: this.value.numero });
        },

        updatePrefijo: function(e) {
            this.$emit('input', { pais: this.value.pais, provincia: e, numero: this.value.numero });
        },

        updateNumero: function(e) {
            this.$emit('input', { pais: this.value.pais, provincia: this.value.provincia, numero: e });
        }
    },

    components: {
        InputNumero
    }

}
</script>

<style>

</style>
