<template>
    <v-layout>
        <v-flex xs2>
            <input-numero
                prefix="+"
                :suffix="type == 'celular' ? '9' : ''"
                maxlength="4"
                ref="pref_pais"
                :value="value.pais"
                :rules="[rules.required, rules.telefono.pais]"
                @input="updatePrefijoPais"
            >
            </input-numero>
        </v-flex>
        <v-flex xs2 class="ml-2">
            <input-numero
                maxlength="5"
                ref="prefijo"
                :value="value.provincia"
                :rules="rules_prefprovincia"
                @input="updatePrefijo"
            >
            </input-numero>
        </v-flex>
        <v-flex xs5 class="ml-2">
            <input-numero
                ref="numero"
                :value="value.numero"
                :rules="[rules.required, rules.telefono.numero]"
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
    name: 'InputTelefono',
    mixins: [ValidatorMixin],
    props: ['value', 'type'],
    data() {
        return {
            rules_prefprovincia: []
        }
    },

    watch: {
        type: function(new_type) {
          this.rules_prefprovincia = (new_type == 'celular') ? [rules.required, rules.celular.provincia] : [rules.required, rules.telefono.provincia];
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
