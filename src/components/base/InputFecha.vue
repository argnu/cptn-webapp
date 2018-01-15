<template>
  <v-layout row>
    <v-text-field
      :label="label"
      :value="formatted"
      append-icon="event"
      :append-icon-cb="cbIcon"
      :tabindex="tabindex"
      :rules="rules"
      :disabled="disabled"
      @change="updatePicker"
      @input="update($event)"
    >
    </v-text-field>
    <v-dialog
      v-model="show_dialog"
      >
      <v-date-picker autosave v-model="datepicker" style="margin:0 auto">
      </v-date-picker>
    </v-dialog>
  </v-layout>
</template>

<script>
import * as moment from 'moment'

export default {
  name: 'input-fecha',
  props: ['value', 'label', 'rules', 'tabindex', 'disabled'],
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
      let fecha = moment(this.value, 'DD/MM/YYYY', true);
      if (fecha.isValid()) return fecha.format('DD/MM/YYYY');
      if (this.value && this.value.match(/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/))
        return moment(this.value).format('DD/MM/YYYY');
      return '';
    }
  },

  methods: {
    update: function(e) {
      this.$emit('input', e);
    },

    updatePicker: function() {
      let fecha = moment(this.value, 'DD/MM/YYYY', true);
      if (fecha.isValid()) this.datepicker = fecha.toISOString();
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
