// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import * as utils from '@/utils'
import * as moment from 'moment'

Vue.use(Vuetify)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

const tipos_legajos = ['Permiso de Construcción', 'Orden de Trabajo', 'Legajo Técnico'];

Vue.filter('tipo_legajo', function(i) {
    return i ? tipos_legajos[i-1] : '';
});

Vue.filter('boolean', function(str) {
  return str ? 'Sí' : 'No';
});

Vue.filter('fecha', function(str) {
  return str ? moment(str).format('DD/MM/YYYY') : '';
});

Vue.filter('round', function(number) {
  return number ? utils.round(number, 2) : 0;
});

Vue.filter('upperFirst', function(str) {
  if (!str.length) return str;
  let [first, ...resto] = str;
  return first.toUpperCase() + resto.join('');
});
