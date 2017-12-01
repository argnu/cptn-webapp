<template>
  <div>
    <v-text-field
      ref="input"
      :label="label"
      class="pb-0"
      @input="update"
      @keyup.down="down"
      @keyup.up="up"
      @keyup.enter="enter"
      @focusout="focusout"
      :tabindex="tabindex"
      :error="error"
      :rules="rules"
      :value="input_val"
    >
    </v-text-field>

    <v-list
      ref="lista"
      v-if="items_filter.length && show_items"
      style="position:fixed;z-index:6;margin-top:-20px;max-height:200px;overflow:scroll"
    >
      <v-list-tile :class="{ 'grey lighten-2': i == i_active }"
        v-for="(item, i) of items_filter" key="item"
        @click="setText(item)"
        @mouseover="i_active = i"
      >
        <v-list-tile :class="{ 'grey lighten-2': i == i_active }"
          v-for="(item, i) of items_filter" key="item.value"
          @click="setText(item)"
          @mouseover="i_active = i"
        >
          <v-list-tile-content>
              <v-list-tile-title>{{ item.text }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </div>

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

  computed: {
    margintop: function() {
      return 10
    },

    items_filter: function() {
      if (this.items && this.value && this.show_items) {
        return this.items.filter(item =>
          item.text.toLowerCase().includes(this.value.toLowerCase())
        );
      }
      else return [];
    },

    input_val: function() {
      let item = this.items ? this.items.find(i => i.value == this.value) : null;
      return item ? item.text : this.value;
    }
  },

  methods: {
    setText: function(item) {
      this.show_items = false;
      this.$emit('input', item.value);
      this.$emit('change');
    },

    update: function(e) {
      this.show_items = e.length > 0;
      if (!this.options) this.$emit('input', e);
    },

    down: function() {
      if (this.i_active + 1 === this.items_filter.length) {
        this.$refs.lista.$el.scrollTop = 0;
        this.i_active = 0;
      }
      else {
        this.i_active = this.i_active + 1;
        if (this.i_active > 3) {
          this.$refs.lista.$el.scrollTop = this.$refs.lista.$el.scrollTop + this.$refs.lista.$children[0].$el.scrollHeight;
        }
      }
    },

    up: function() {
      if (!this.i_active) {
        this.i_active = this.items_filter.length - 1;
        this.$refs.lista.$el.scrollTop = this.$refs.lista.$children[0].$el.scrollHeight * this.$refs.lista.$children.length;
      }
      else {
        this.i_active = this.i_active - 1;
        this.$refs.lista.$el.scrollTop = this.$refs.lista.$el.scrollTop - this.$refs.lista.$children[0].$el.scrollHeight;
      }
    },

    enter: function() {
      this.setText(this.items_filter[this.i_active]);
      this.i_active = 0;
    },

    focusout: function() {
      setTimeout(x => {
        if (this.option) {
          if (!this.items.find(i => i.value == this.value)) {
            this.$emit('input', '');
          }
        }
        this.$emit('change');
        this.show_items = false;
      }, 100);
    }

  },

}
</script>

<style>
</style>
