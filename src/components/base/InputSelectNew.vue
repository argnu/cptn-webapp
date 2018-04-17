<template>
  <div>
    <v-text-field
        ref="input"
        append-icon="arrow_drop_down"
        :append-icon-cb="() => this.show_items = !this.show_items"
        :label="label"
        class="pb-0"
        @input="update"
        @keyup.down="down"
        @keyup.up="up"
        @keyup.enter.prevent="enter"
        @focusin="closeOptions"
        :tabindex="tabindex"
        :rules="rules"
        :value="input_val"
        :disabled="disabled"
        :maxlength="maxlength"
    >
    </v-text-field>

    <div id="lista">
        <v-list
            ref="lista"
            v-if="items.length && show_items"
            style="position:absolute;z-index:6;margin-top:-20px;max-height:200px;overflow:scroll"
        >
            <v-list-tile
                :class="{ 'grey lighten-2': i == i_active }"
                v-for="(item, i) of items"
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
  </div>
</template>

<script>
import { checkElem } from '@/utils'

export default {
  name: 'InputSelectNew',

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
        default () { return []; }
    },

    itemText: {
        type: String,
        default: 'text'
    },

    itemValue: {
        type: String,
        default: 'value'
    },

    tabindex: {
        type: String
    },

    maxlength: {
        type: String
    },

    items: {
        type: Array,
        default () { return []; }
    }
  },

  data () {
    return {
      show_items: false,
      text: '',
      i_active: 0
    }
  },

  computed: {
    input_val: function() {
      let item = this.items ? this.items.find(i => i[this.itemValue] == this.value) : null;
      return item ? item[this.itemText] : this.value;
    }
  },

  watch: {
      show_items: function(new_val) {
        let boxCloser = (e) => {
            this.show_items = false;
        }

        if (new_val) {
            document.body.addEventListener('click', boxCloser, false);
        }
        else {
            document.body.removeEventListener('click', boxCloser, false);
        }
      }
  },

  methods: {
    setText: function(item) {
      if (item) {
        this.show_items = false;
        this.$emit('input', item[this.itemValue]);
        this.$emit('change');
      }
    },

    update: function(e) {
      this.$emit('input', e);
    },

    down: function() {
      if (this.i_active + 1 === this.items.length) {
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
        this.i_active = this.items.length - 1;
        this.$refs.lista.$el.scrollTop = this.$refs.lista.$children[0].$el.scrollHeight * this.$refs.lista.$children.length;
      }
      else {
        this.i_active = this.i_active - 1;
        this.$refs.lista.$el.scrollTop = this.$refs.lista.$el.scrollTop - this.$refs.lista.$children[0].$el.scrollHeight;
      }
    },

    enter: function(e) {
      this.setText(this.items[this.i_active]);
      this.i_active = 0;
    },

    closeOptions: function() {
        this.show_items = false;
    },

  },

}
</script>

<style>
</style>
