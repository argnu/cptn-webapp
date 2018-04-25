import Vue from 'vue'
import Router from 'vue-router'
import * as Cookies from 'js-cookie'
import * as axios from 'axios'
import Store from '@/stores/Global'
import Login from '@/components/Login'
import MainContainer from '@/components/MainContainer'
import DelegacionSeleccion from '@/components/DelegacionSeleccion'

import NuevaSolicitudEmpresa from '@/components/solicitudes/nueva/NuevaSolicitudEmpresa'
import NuevaSolicitudProfesional from '@/components/solicitudes/nueva/NuevaSolicitudProfesional'
import ListaSolicitud from '@/components/solicitudes/ListaSolicitud'

import MatriculaMain from '@/components/matriculas/MatriculaMain'
import Matricula from '@/components/matriculas/Matricula'
import MatriculaLista from '@/components/matriculas/MatriculaLista'
import ResumenCuenta from '@/components/matriculas/cuenta/ResumenCuenta'
import DeudasPendientes from '@/components/matriculas/cuenta/DeudasPendientes'

import Cobranza from '@/components/cobranzas/Cobranza'
import Legajo from '@/components/matriculas/legajos/Legajo'

import InstitucionLista from '@/components/instituciones/InstitucionLista'
import InstitucionDetalle from '@/components/instituciones/InstitucionDetalle'
import InstitucionNueva from '@/components/instituciones/InstitucionNueva'

import UsuarioLista from '@/components/usuarios/UsuarioLista'
import UsuarioNuevo from '@/components/usuarios/UsuarioNuevo'
import UsuarioDetalle from '@/components/usuarios/UsuarioDetalle'

import SistemaConfiguracion from '@/components/sistema/SistemaConfiguracion'

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
        else if (!Store.state.user || !Store.state.delegacion) {
          let user = JSON.parse(Cookies.get('CPTNUser'));
          let delegacion = JSON.parse(Cookies.get('CPTNDelegacion'));
          Store.setUser(user);
          Store.setDelegacion(delegacion);
          axios.defaults.headers.common['Authorization'] = `JWT ${user.token}`;
          next();
        }
        else next();
      },

      children: [
        {
          path: '/seleccionar-delegacion',
          name: 'DelegacionSeleccion',
          component: DelegacionSeleccion,
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
          path: '/solicitudes/empresas/modificar/:id',
          name: 'ModificarSolicitudEmpresa',
          component: NuevaSolicitudEmpresa,
          props: true
        },        
        {
          path: '/matriculas',
          component: MatriculaMain,
          children: [
            {
              path: 'lista',
              name: 'MatriculaLista',
              component: MatriculaLista,
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

        {
          path: '/instituciones/lista',
          name: 'InstitucionLista',
          component: InstitucionLista
        },
        {
          path: '/instituciones/nueva',
          name: 'InstitucionNueva',
          component: InstitucionNueva
        },
        {
          path: '/instituciones/:id',
          name: 'InstitucionDetalle',
          component: InstitucionDetalle,
          props: true
        },

        {
          path: '/usuarios/lista',
          name: 'UsuarioLista',
          component: UsuarioLista
        },
        {
          path: '/usuarios/nuevo',
          name: 'UsuarioNuevo',
          component: UsuarioNuevo
        },
        {
          path: '/usuarios/:id',
          name: 'UsuarioDetalle',
          component: UsuarioDetalle,
          props: true,
          beforeEnter: (to, from, next) => {
            if (to.params.id == Store.state.user.id || Store.state.user.admin) next();
            else next(false);
          },          
        },
        {
          path: '/configuracion',
          name: 'SistemaConfiguracion',
          component: SistemaConfiguracion          
        }
      ]
    },
  ]
})
