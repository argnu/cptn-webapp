<template>
  <v-layout row>
    <v-text-field
      :label="label"
      :value="formatted"
      append-icon="event"
      :append-icon-cb="cbIcon"
      :tabindex="tabindex"
      :rules="rules"
      :error="error"
      :disabled="disabled"
      @change="updatePicker"
      @input="update($event)"
    >
    </v-text-field>
    <v-dialog
      v-model="show_dialog"
      >
      <v-date-picker  autosave v-model="datepicker" style="margin:0 auto">
      </v-date-picker>
    </v-dialog>
  </v-layout>
</template>

<script>
import * as moment from 'moment'

export default {
  name: 'input-fecha',
  props: ['value', 'label', 'rules', 'error', 'tabindex', 'disabled'],
  data () {
    return {
      datepicker: null,
      show_dialog: false,
      date_formatted: ''
    }
  },

  watch: {
    datepicker: function(new_date) {
      let fecha = moment(new_date);
      if (fecha.isValid()) this.$emit('input', fecha.format('DD/MM/YYYY'));
    }
  },

  computed: {
    formatted: function() {
      let fecha = moment(this.value);
      return fecha.isValid() ? fecha.format('DD/MM/YYYY') : '';
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
