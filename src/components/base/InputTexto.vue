<template>
    <v-text-field
        ref="input"
        :tabindex="tabindex"
        :maxlength="maxlength"
        :prefix="prefix"
        :suffix="suffix"
        :label="label"
        :rules="rules"
        :disabled="disabled"
        :value="value"
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
        //   type: String,
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
          type: String
      },

      prependIcon: {
          type: String
      },

      maxlength: {
          type: [String, Number]
      }
    },

    methods: {
        keypress: function(e) {
            if (!this.type) return true;
            if (e.charCode == 32) return true;

            let regexp = /[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ'`]{1}/;
            if (this.type == 'alfanumerico') regexp = /\w{1}/;

            if (regexp.test(e.key)) return true
            else e.preventDefault();
        },

        update: function(e) {
            if (e) this.$emit('input', this.format(e));
        },

        format: function(e) {
            if (!e) return '';
            else if (this.uppercase) return e.toUpperCase();
            else return e;
        }
    }

}
</script>

<style>

</style>
