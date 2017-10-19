<template>
  <v-layout row>
    <v-text-field :label="label" :value="value" @input="update($event)"
      append-icon="event" :append-icon-cb="cbIcon"
      :tabindex="tabindex"
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
  props: ['value', 'label', 'rules', 'error', 'tabindex'],
  data () {
    return {
      datepicker: null,
      show_dialog: false,
      date_formatted: ''
    }
  },

  watch: {
    datepicker: function(new_date) {
      if (new_date) {
        if (new_date instanceof Date) new_date = new_date.toISOString();
        let formatted = utils.formatFecha(new_date);
        this.$emit('input', formatted);
      }
    }
  },

  methods: {
    update: function(e) {
      this.$emit('input', e);
    },

    updatePicker: function() {
      let [dia, mes, anio] = this.value.split('/');
      if (dia && mes && anio) {
        let date = new Date(`${anio}-${mes}-${dia}T00:00:00`);
        if (isNaN( date.getTime())) {
          this.datepicker = null;
          return;
        }
        this.datepicker = date;
      }
    },

    cbIcon: function() {
      this.updatePicker();
      this.show_dialog = true;
    }
  },

}
</script>

<style scoped>
</style>
