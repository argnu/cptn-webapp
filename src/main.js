// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import * as utils from '@/utils'

Vue.use(Vuetify)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

Vue.filter('fecha', function(str) {
    return str ? utils.formatFecha(str) : '';
});

Vue.filter('upperFirst', function(str) {
    return str ? utils.upperFirst(str) : '';
});

Vue.filter('boolean', function(str) {
  return str ? 'Sí' : 'No';
});
