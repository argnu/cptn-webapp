import { validRules } from '@/utils';

export default {

  methods: {
    validForm: function() {
      for (let i = 1; i < this.num_steps; i++) {
        if (!this.validStep(i)) return false;
      }
      return true;
    },

    validControl: function(rules, value) {
      return validRules(value, rules);
    },
  }
}
