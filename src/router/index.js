import Vue from 'vue'
import Router from 'vue-router'
import NuevaSolicitudProfesional from '@/components/NuevaSolicitudProfesional'
import NuevaSolicitudEmpresa from '@/components/NuevaSolicitudEmpresa'
import ListaSolicitud from '@/components/ListaSolicitud'
import Matriculas from '@/components/Matriculas'
import ListaMatriculados from '@/components/ListaMatriculados'
import MatriculaProfesional from '@/components/MatriculaProfesional'
import PermisoConstruccion from '@/components/PermisoConstruccion'

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
      path: '/matriculas',
      component: Matriculas,
      children: [
        {
          path: 'lista',
          name: 'ListaMatriculados',
          component: ListaMatriculados,
        },
        {
          path: 'profesional/:id',
          component: MatriculaProfesional,
          props: true
        },
        {
          path: ':id/permiso',
          name: 'PermisoConstruccion',
          component: PermisoConstruccion
        },
      ]
    },
  ]
})
