<template>
    <v-text-field
        :class="uppercase ? 'uppercase' : ''"
        v-bind="$attrs"
        :value="value"
        :maxlength="maxlength"
        @input="$emit('input', $event)"
        @keypress="keypress($event)"
        @blur="active = false"
        @focus="active = true"
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

      maxlength: {
          type: [Number, String],
          default: () => 100
      },

      type: {
          type: String
      }
    },

    data: function() {
        return {
            active: false
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
        }
    }

}
</script>

<style>
.uppercase input {
    text-transform: uppercase
}
</style>
