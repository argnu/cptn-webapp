<template>
  <v-layout row>
    <v-text-field :label="label" v-model="date_formatted" @input="update"
      append-icon="event" :append-icon-cb="() => show_dialog = true"
      @change="updatePicker" :rules="rules" :error="error">
    </v-text-field>
    <v-dialog
      v-model="show_dialog"
      lazy
      full-width>
      <v-date-picker  autosave v-model="datepicker">
      </v-date-picker>
    </v-dialog>
  </v-layout>
</template>

<script>
import * as utils from '@/utils';

export default {
  name: 'input-fecha',
  props: ['value', 'label', 'rules', 'error'],
  data () {
    return {
      datepicker: '',
      show_dialog: false,
      date_formatted: ''
    }
  },

  watch: {
    datepicker: function(new_date) {
      if (new_date) {
        let formatted = utils.formatFecha(new_date);
        this.date_formatted = formatted;
        this.$emit('input', this.date_formatted);
      }
    },

    value: function(new_val) {
      this.date_formatted = new_val;
      this.updatePicker();
    }
  },

  methods: {
    update: function() {
      this.$emit('input', this.date_formatted);
    },

    updatePicker: function() {
      let [dia, mes, anio] = this.date_formatted.split('/');
      if (dia && mes && anio) {
        let date = new Date(`${anio}-${mes}-${dia}T20:12:26.033Z`);
        if (isNaN( date.getTime())) {
          this.datepicker = null;
          return;
        }
        this.datepicker = date.toISOString();
      }
    }
  },

}
</script>

<style scoped>
</style>
