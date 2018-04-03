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
                :value="val_provincia"
                :rules="type == 'celular' ? [rules.required, rules.celular.provincia] : [rules.required, rules.telefono.provincia]"
                @input="updatePrefijo"
            >
            </input-numero>
        </v-flex>
        <v-flex xs5 class="ml-2">
            <input-numero
                ref="numero"
                :value="value.numero"
                :rules="type == 'celular' ? [rules.required, rules.celular.numero] : [rules.required]"
                @input="updateNumero"
            >
            </input-numero>
        </v-flex>
    </v-layout>  
</template>

<script>
import MixinValidator from '@/components/mixins/MixinValidator'
import InputNumero from '@/components/base/InputNumero'

export default {
    name: 'InputTelefono',
    mixins: [MixinValidator],
    props: {
        type: {
            type: String,
            default: ''
        },

        disabled: {
            type: Boolean,
            default: false
        },

        value: {
            type: Object,
            required: true
        }
    },    
    
    data() {
        return {
            rules_prefprovincia: [],
            rules_numero: []
        }
    },

    computed: {
        val_provincia: function() {
            if (this.value.provincia) return this.value.provincia;
            else {
                if (this.type == 'celular') return '299';
                else return '0299';
            }
        }
    },

    methods: {
        updatePrefijoPais: function(e) {
            this.$emit('input', { pais: e, provincia: this.val_provincia, numero: this.value.numero });
        },

        updatePrefijo: function(e) {
            this.$emit('input', { pais: this.value.pais, provincia: e, numero: this.value.numero });
        },

        updateNumero: function(e) {
            this.$emit('input', { pais: this.value.pais, provincia: this.val_provincia, numero: e });
        }
    },

    components: {
        InputNumero
    }

}
</script>

<style>

</style>
