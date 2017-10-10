<template>
  <div>
    <v-text-field
      ref="input"
      :label="label"
      class="pb-0"
      @input="update($event)"
      @keyup.down="down"
      @keyup.up="up"
      @keyup.enter="enter"
      @keydown.tab="tab"
      @focusout="focusout"
      :tabindex="tabindex"
      :error="error"
      :rules="rules"
      :value="value"
    >
    </v-text-field>

    <v-list v-if="items_filter.length && show_items" style="position:absolute;z-index:6;margin-top:-20px">
      <v-list-tile :class="{ 'grey lighten-2': i==i_active }"
        v-for="(item, i) of items_filter" key="item"
        @click="setText(item)"
        @mouseover="i_active = i"
      >
        <v-list-tile-content>
            <v-list-tile-title>{{ item }}</v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'typeahead',
  props: ['value', 'label', 'items', 'tabindex', 'option', 'error', 'rules'],

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
      if (this.items && this.value) {
        return this.items.filter(item =>
          item.toLowerCase().includes(this.value.toLowerCase())
        );
      }
      else return [];
    }
  },

  methods: {
    setText: function(item) {
      this.$emit('input', item);
      this.show_items = false;
      this.$emit('change');
    },

    update: function(e) {
      this.show_items = e.length > 0;
      this.$emit('input', e);
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

    tab: function() {
      if (this.option) {
        if (!this.items.find(i => i == this.value)) {
          this.$emit('input', '');
        }
      }
      this.$emit('change');
      this.show_items = false;
    },

    focusout: function() {
      setTimeout(x => {
        this.show_items = false;
      }, 100);
    }

  },

}
</script>

<style>
</style>
