export default {

  methods: {
    validForm: function() {
      for (let i = 1; i < this.steps.length; i++) {
        if (!this.validStep(i)) return false;
      }
      return true;
    },

    validControl: function(rules, value) {
      for(let rule of rules) {
        if (rule(value) !== true) return false;
      }
      return true;
    },
  }
}
