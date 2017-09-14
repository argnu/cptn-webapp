import Vue from 'vue'
import Router from 'vue-router'
import NuevaSolicitudProfesional from '@/components/NuevaSolicitudProfesional'
import NuevaSolicitudEmpresa from '@/components/NuevaSolicitudEmpresa'
import ListaSolicitud from '@/components/ListaSolicitud'
import ListaMatriculados from '@/components/ListaMatriculados'
import PermisoConstruccion from '@/components/PermisoConstruccion';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/solicitudes/profesionales/nueva',
      name: 'NuevaSolicitudProfesional',
      component: NuevaSolicitudProfesional
    },
    {
      path: '/solicitudes/lista',
      name: 'ListaSolicitud',
      component: ListaSolicitud
    },
    {
      path: '/solicitudes/empresas/nueva',
      name: 'NuevaSolicitudEmpresa',
      component: NuevaSolicitudEmpresa
    },
    {
      path: '/matriculas/lista',
      name: 'ListaMatriculados',
      component: ListaMatriculados
    },
    {
      path: '/matriculas/:id/permiso',
      name: 'PermisoConstruccion',
      component: PermisoConstruccion
    },
  ]
})
