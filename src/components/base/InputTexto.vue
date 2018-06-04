<template>
    <v-text-field
        v-bind="$attrs"
        :value="value"
        @keypress="keypress($event)"
        @input="update($event)"
    ></v-text-field>
</template>

<script>
import Vue from 'vue'
import { isMobile } from '@/utils'

export default {
    name: 'InputTexto',
    inheritAttrs: false,
    
    props: {
      value: {
        //   type: String,
          required: true
      },

      uppercase: {
          type: Boolean,
          default: () => false
      },

      type: {
          type: String
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
            if (isMobile()) this.$emit('input', e);
            else this.$emit('input', this.format(e));
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
