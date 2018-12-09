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
        :maxlength="maxlength"
        :append-icon="appendIcon"
        @keypress="keypress($event)"
        @input="update($event, 'input')"
        @change="update($event, 'change')"
    ></v-text-field>
</template>

<script>
export default {
    name: 'InputNumero',
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

      decimal: {
          type: Boolean,
          default: () => false
      },

      maxlength: {
          type: String
      },

      appendIcon: {
          type: String
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
                    if (e.target.value.indexOf(',') !== -1 || e.target.value.length === 0) e.preventDefault();
                    else return true;
                }  
                else if (e.key.length == 1) e.preventDefault();
            }
        },

        update: function(e, type) {
            if (e) this.$emit(type, this.decimal ? e.replace('.', ',') : e);
        }
    }

}
</script>

<style>

</style>
