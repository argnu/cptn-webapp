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
      @focusout="show_items = false"
      @keyup.tab="show_items = false"
    >
    </v-text-field>

    <v-list v-if="items_filter.length && show_items" style="position:absolute;z-index:6">
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
  props: ['label', 'items'],

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
      this.$emit('input', this.text);
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
    }
  },

}
</script>

<style>
</style>
