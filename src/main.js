// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

import 'vuetify/dist/vuetify.min.css'
import * as moment from 'moment'
import * as Cookies from 'js-cookie'
import * as utils from '@/utils'
import Store from '@/stores/Global'

Vue.use(Vuetify)

Vue.config.productionTip = false

Vue.filter('boolean', function (str) {
  return str ? 'Sí' : 'No';
});

Vue.filter('fecha', function (str) {
  if (!str || !str.length) return '';
  if (/\d{2}\/\d{2}\/\d{4}/.test(str)) return str;
  let moment_date = moment(str);
  return moment_date.isValid() ? moment_date.format('DD/MM/YYYY') : '';
});

Vue.filter('round', function (number) {
  if (!number) return 0;
  if (typeof number == 'number') return utils.round(number, 2);
  else if (typeof number == 'string') return utils.round(utils.getFloat(number), 2);
});

Vue.filter('upperFirst', function (str) {
  if (!str.length) return str;
  let [first, ...resto] = str;
  return first.toUpperCase() + resto.join('');
});

Vue.mixin({
  data() {
    return {
      global_state: Store.state
    }
  },

  computed: {
    user: function () {
      return this.global_state.user;
    },

    delegacion: function () {
      return this.global_state.delegacion;
    }
  },

  methods: {
    showError: function(e) {
      console.log(e.response)
        let msg = (!e.response || e.response.status == 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.message;
        this.global_state.snackbar.msg = msg;
        this.global_state.snackbar.color = 'error';
        this.global_state.snackbar.show = true;
        console.error(e);
    }    
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})