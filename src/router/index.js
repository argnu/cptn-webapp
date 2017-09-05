import Vue from 'vue'
import Router from 'vue-router'
import NuevaSolicitud from '@/components/NuevaSolicitud'
import ListaSolicitud from '@/components/ListaSolicitud'
import NuevaSolicitudEmpresa from '@/components/NuevaSolicitudEmpresa'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'NuevaSolicitud',
      component: NuevaSolicitud
    },
    {
      path: '/lista',
      name: 'ListaSolicitud',
      component: ListaSolicitud
    },
    {
      path: '/solicitud/empresa/nueva',
      name: 'NuevaSolicitudEmpresa',
      component: NuevaSolicitudEmpresa
    }
  ]
})
