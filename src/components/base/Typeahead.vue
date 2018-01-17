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
      :tabindex="tabindex"
      :rules="rules"
      :value="input_val"
      :disabled="disabled"
      :maxlength="maxlength"
    >
    </v-text-field>

    <v-list
      ref="lista"
      v-if="items_filter.length && show_items"
      style="position:absolute;z-index:6;margin-top:-20px;max-height:200px;overflow:scroll"
    >
        <v-list-tile 
          :class="{ 'grey lighten-2': i == i_active }"
          v-for="(item, i) of items_filter" 
          :key="item[itemValue]"
          @click="setText(item)"
          @mouseover="i_active = i"
        >
          <v-list-tile-content>
              <v-list-tile-title>{{ item[itemText] }}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

  </div>
</template>

<script>
export default {
  name: 'typeahead',
  props: ['value', 'label', 'items', 'tabindex', 'option',
    'error', 'rules', 'disabled', 'itemText', 'itemValue',
    'maxlength'
  ],

  data () {
    return {
      show_items: false,
      text: '',
      i_active: 0
    }
  },

  computed: {
    items_filter: function() {
      if (this.items && this.value && this.show_items) {
        return this.items.filter(item =>
          item[this.itemText].toLowerCase().includes(this.value.toLowerCase())
        );
      }
      else return [];
    },

    input_val: function() {
      let item = this.items ? this.items.find(i => i[this.itemValue] == this.value) : null;
      return item ? item[this.itemText] : this.value;
    }
  },

  methods: {
    setText: function(item) {
      this.show_items = false;
      this.$emit('input', item[this.itemValue]);
      this.$emit('change');
    },

    update: function(e) {
      if (e) this.show_items = e.length > 0;
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
            this.$emit('input', null);
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
