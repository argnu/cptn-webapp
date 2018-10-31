<template>
  <v-layout row>
    <v-text-field
      slot="activator"
      :label="label"
      :value="formatted"
      append-icon="event"
      :append-icon-cb="cbIcon"
      :tabindex="tabindex"
      :rules="rules"
      :disabled="disabled"
      @input="updatePicker($event)"
    >
    </v-text-field>

    <v-dialog :value="show_dialog" width="290px" persistent>
      <v-date-picker v-model="datepicker" @input="update()" locale="es-ar">
          <v-spacer></v-spacer>
          <v-btn flat color="primary" @click="show_dialog = false">Cancelar</v-btn>
      </v-date-picker>
    </v-dialog>
  </v-layout>
</template>

<script>
import moment from 'moment'
import { getFecha } from '@/utils'

export default {
  name: 'input-fecha',
  props: {
    label: {
        type: String,
        default: ''
    },

    disabled: {
        type: Boolean,
        default: false
    },

    value: {
        // type: String,
        required: true
    },

    rules: {
        type: Array,
        default () {
          return [];
        }
    },
    
    tabindex: {
        type: String
    },
  },

  data () {
    return {
      datepicker: null,
      show_dialog: false,
      date_formatted: ''
    }
  },

  computed: {
    formatted: function() {
      let fecha = moment(this.value, 'DD/MM/YYYY', true);
      if (fecha.isValid()) return getFecha(fecha);
      if (this.value && this.value.match(/^\d{4}\-\d{2}\-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/))
        return getFecha(this.value);
      return this.value;
    }
  },

  methods: {
    update: function(e) {
      this.show_dialog = false;
      let fecha = moment(this.datepicker);
      if (fecha.isValid()) { 
        this.$emit('input', getFecha(fecha));
        this.$emit('change', getFecha(fecha));
      }
    },

    updatePicker: function(e) {
      let fecha = moment(e, 'DD/MM/YYYY', true);
      if (fecha.isValid()) { 
        this.$emit('input', getFecha(fecha));
        this.$emit('change', getFecha(fecha));   
        this.datepicker = fecha.toISOString().substring(0,10);
      }
    },

    cbIcon: function() {
      this.show_dialog = true;
      this.updatePicker();
    }
  },

}
</script>

<style scoped>
</style>
