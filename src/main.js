// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'

import 'vuetify/dist/vuetify.min.css'
import moment from 'moment'
import { round, getFloat} from '@/utils'

import { abilitiesPlugin } from '@casl/vue'
Vue.use(abilitiesPlugin)

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
  if (typeof number == 'number') return round(number, 2);
  else if (typeof number == 'string') return round(getFloat(number), 2);
});

Vue.filter('upperFirst', function (str) {
  if (!str.length) return str;
  let [first, ...resto] = str;
  return first.toUpperCase() + resto.join('');
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})