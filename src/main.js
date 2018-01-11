// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import * as moment from 'moment'
import * as Cookies from 'js-cookie'
import * as utils from '@/utils'
import { getTipoLegajo } from '@/utils/legajo'
import Store from '@/Store'

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.filter('tipo_legajo', getTipoLegajo);

Vue.filter('boolean', function (str) {
  return str ? 'Sí' : 'No';
});

Vue.filter('fecha', function (str) {
  if (!str && !str.length) return '';
  let moment_date = moment(str);
  return moment_date.isValid() ? format('DD/MM/YYYY') : '';
});

Vue.filter('round', function (number) {
  return number ? utils.round(number, 2) : 0;
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
      return JSON.parse(Cookies.get('CPTNUser'));
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