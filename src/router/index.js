import Vue from 'vue'
import Router from 'vue-router'
import axios from '@/axios'
import * as Cookies from 'js-cookie'
import Store from '@/stores/Global'
import Login from '@/components/Login'
import MainContainer from '@/components/MainContainer'
import DelegacionSeleccion from '@/components/DelegacionSeleccion'
import { NuevaSolicitudEmpresa, NuevaSolicitudProfesional, ListaSolicitud, ImprimirSolicitud} from '@/components/solicitudes'
import { MainMatriculas, ListaMatriculados, Matricula,
  MatriculaProfesional, ResumenCuenta,
  DeudasPendientes } from '@/components/matriculas'
import Cobranza from '@/components/cobranzas/Cobranza'
import Legajo from '@/components/matriculas/Legajo'


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
      redirect: '/seleccionar-delegacion',
      beforeEnter: (to, from, next) => {
        if (!Cookies.get('CPTNUser')) next({ path: '/login' });
        else {
          let user = JSON.parse(Cookies.get('CPTNUser'));
          let delegacion = Cookies.get('CPTNDelegacion');
          Store.setUser(user);
          Store.setDelegacion(delegacion);
          axios.defaults.headers.common['Authorization'] = `JWT ${user.token}`;          
          next();
        }
      },

      children: [
        {
          path: '/seleccionar-delegacion',
          name: 'DelegacionSeleccion',
          component: DelegacionSeleccion
        },
        {
          path: '/solicitudes/profesionales/nueva',
          name: 'NuevaSolicitudProfesional',
          component: NuevaSolicitudProfesional,
          props: (route) => ({ dni: route.query.dni ? route.query.dni : null })
        },
        {
          path: '/solicitudes/profesionales/modificar/:id',
          name: 'ModificarSolicitudProfesional',
          component: NuevaSolicitudProfesional,
          props: true
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
          path: '/solicitudes/profesionales/:id/imprimir',
          name: 'ImprimirSolicitud',
          component: ImprimirSolicitud,
          props: true
        },
        {
          path: '/solicitudes/empresas/modificar/:id',
          name: 'ModificarSolicitudEmpresa',
          component: NuevaSolicitudEmpresa,
          props: true
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
              path: ':id_matricula',
              component: Matricula,
              props: true
            },
            {
              path: ':id/deudas',
              name: 'DeudasPendientes',
              component: DeudasPendientes,
              props: true
            },
            {
              path: ':id_matricula/nuevo-legajo',
              name: 'NuevoLegajo',
              component: Legajo,
              props: true
            },
          ]
        },
        {
          path: '/legajos/:id_legajo',
          name: 'Legajo',
          component: Legajo,
          props: true
        },
      ]
    },
  ]
})
