<template>
    <v-text-field
        ref="input"
        :tabindex="tabindex"
        :prefix="prefix"
        :label="label"
        :rules="rules"
        :disabled="disabled"
        :value="formatted"
        @keypress="keypress($event)"
        @input="update($event)"
    ></v-text-field>
</template>

<script>
export default {
    name: 'InputNumero',
    props: ['label', 'disabled', 'value', 'rules', 'prefix', 'tabindex', 'decimal'],
    data() {
        return {
        }
    },    

    computed: {
        formatted: function() {
            return this.value ? this.value.toString().replace('.', ',') : '';
        }
    },

    methods: {
        keypress: function(e) {
            if (/\d{1}/.test(e.key)) return true;
            else {
                if (this.decimal && (e.key == '.' || e.key == ',')) {
                    if (this.$refs.input.value.indexOf(',') !== -1 || this.$refs.input.value.length === 0) e.preventDefault();
                    else return true;
                }  
                else if (e.key.length == 1) e.preventDefault();
            }
        },

        update: function(e) {
            if (e) this.$emit('input', this.decimal ? e.replace('.', ',') : e);
        }
    }

}
</script>

<style>

</style>
