import Vue from 'vue'
import Router from 'vue-router'
import axios from '@/axios';
import * as Cookies from 'js-cookie';
import Login from '@/components/Login';
import MainContainer from '@/components/MainContainer';
import { NuevaSolicitudEmpresa, NuevaSolicitudProfesional, ListaSolicitud } from '@/components/solicitudes'
import { MainMatriculas, ListaMatriculados, Matricula,
  MatriculaProfesional, ResumenCuenta,
  DeudasPendientes } from '@/components/matriculas'
import Cobranza from '@/components/cobranzas/Cobranza'


Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: Login
    },

    {
      path: '/',
      name: 'MainContainer',
      component: MainContainer,
      beforeEnter: (to, from, next) => {
        if (!Cookies.get('CPTNUser')) next({ path: '/login' });
        else {
          let user = JSON.parse(Cookies.get('CPTNUser'));
          axios.defaults.headers.common['Authorization'] = `JWT ${user.token}`;
          next();
        }
      },

      children: [
        {
          path: '/pago',
          name: 'Cobranza',
          component: Cobranza
        },
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
          component: MainMatriculas,
          children: [
            {
              path: 'lista',
              name: 'ListaMatriculados',
              component: ListaMatriculados,
            },
            {
              path: ':id',
              component: Matricula,
              props: true
            },
            // {
            //   path: ':id/permiso',
            //   name: 'PermisoConstruccion',
            //   component: PermisoConstruccion
            // },
            {
              path: ':id/resumen',
              name: 'ResumenCuenta',
              component: ResumenCuenta,
              props: true
            },
            {
              path: ':id/deudas',
              name: 'DeudasPendientes',
              component: DeudasPendientes,
              props: true
            },
          ]
        },
      ]
    },
  ]
})
