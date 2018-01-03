<template>
    <v-text-field
        ref="input"
        :tabindex="tabindex"
        :prefix="prefix"
        :label="label"
        :rules="rules"
        :error="error"
        :disabled="disabled"
        :value="value"
        @keypress="keypress($event)"
        @input="update($event)"
    ></v-text-field>
</template>

<script>
export default {
    name: 'InputNumero',
    props: ['label', 'disabled', 'value', 'rules', 'error', 'prefix', 'tabindex'],

    methods: {
        keypress: function(e) {
            e = (e) ? e : window.event;
            let key_code = (e.which) ? e.which : e.keyCode;
            console.log(key_code)
            if ((key_code > 31 && (key_code < 48 || key_code > 57)) 
                && key_code !== 46 && key_code !== 44 && key_code !== 37 && key_code !== 39) {
                e.preventDefault();
            } 
            else {
                if ((key_code === 46 || key_code === 44) && (this.$refs.input.value.indexOf(',') !== -1 || this.$refs.input.value.length === 0)) {
                    e.preventDefault();
                }           
                else return true;
            }
        },

        update: function(e) {
            this.$emit('input', e.replace('.', ','));
        }
    }

}
</script>

<style>

</style>
