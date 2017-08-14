import Vue from 'vue'
import Router from 'vue-router'
import NuevaSolicitud from '@/components/NuevaSolicitud'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'NuevaSolicitud',
      component: NuevaSolicitud
    }
  ]
})
