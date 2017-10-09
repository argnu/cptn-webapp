<template>
  <div>
    <v-text-field
      :label="label"
      v-model="text"
      class="pb-0"
      @input="update"
      @keyup.down="down"
      @keyup.up="up"
      @keyup.enter="enter"
      @focusout="focusout"
      @keyup.tab="show_items = false"
      :tabindex="tabindex"
      :error="error"
      :rules="rules"
    >
    </v-text-field>

    <v-list v-if="items_filter.length && show_items" style="position:absolute;z-index:6;margin-top:-20px">
      <v-list-tile :class="{ 'grey lighten-2': i==i_active }"
        v-for="(item, i) of items_filter" key="item.value" @click="setText(item)"
        @mouseover="i_active = i"
      >
        <v-list-tile-content>
            <v-list-tile-title>{{ item.text }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'typeahead',
  props: ['label', 'items', 'tabindex', 'option', 'error', 'rules'],

  data () {
    return {
      show_items: false,
      text: '',
      i_active: 0
    }
  },

  created: function() {
  },

  computed: {
    items_filter: function() {
      if (this.items) {
        return this.items.filter(item =>
          item.text.toLowerCase().includes(this.text.toLowerCase())
        );
      }
      else return [];
    }
  },

  methods: {
    setText: function(item) {
      this.text = item.text;
      this.$emit('input', item.value);
      this.show_items = false;
      this.$emit('change');
    },

    update: function() {
      if (this.text.length > 0) this.show_items = true;
      else this.show_items = false;
      if (!this.option) this.$emit('input', this.text);
    },

    down: function() {
      if (this.i_active + 1 === this.items_filter.length) this.i_active = 0;
      else this.i_active = this.i_active + 1;
    },

    up: function() {
      if (!this.i_active) this.i_active = this.items_filter.length - 1;
      else this.i_active = this.i_active - 1;
    },

    enter: function() {
      this.setText(this.items_filter[this.i_active]);
      this.i_active = 0;
      this.$emit('change');
    },

    focusout: function() {
      if (this.option) {
        if (!this.items.find(i => i.text == this.text)) {
          this.text = '';
          this.$emit('input', this.text);
          this.$emit('change');
        }
      }
      this.show_items = false;
    }
  },

}
</script>

<style>
</style>
