<template>
    <v-text-field
        ref="input"
        :tabindex="tabindex"
        :prefix="prefix"
        :suffix="suffix"
        :label="label"
        :rules="rules"
        :disabled="disabled"
        :value="formatted"
        :prepend-icon="prependIcon"
        @keypress="keypress($event)"
        @input="update($event)"
    ></v-text-field>
</template>

<script>

export default {
    name: 'InputTexto',
    props: {
      label: {
          type: String,
          default: ''
      },

      disabled: {
          type: Boolean,
          default: () => false
      },

      value: {
          type: String,
          required: true
      },

      rules: {
          type: Array,
          default () {
            return [];
          }
      },

      suffix: {
          type: String,
          default: () => ''
      },

      prefix: {
          type: String,
          default: () => ''
      },

      tabindex: {
          type: String
      },

      uppercase: {
          type: Boolean,
          default: () => false
      },

      type: {
          type: String,
          default: () => 'alfanumerico'
      },

      prependIcon: {
          type: String
      }
    },

    computed: {
        formatted: function() {
            return this.value && this.uppercase ? this.value.toUpperCase() : '';
        }
    },

    methods: {
        keypress: function(e) {
            if (e.charCode == 32) return true;

            let regexp = /[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ'`]{1}/;
            if (this.type == 'alfanumerico') regexp = /\w{1}/;

            if (regexp.test(e.key)) return true
            else e.preventDefault();
        },

        update: function(e) {
            if (e) this.$emit('input', e);
        }
    }

}
</script>

<style>

</style>
