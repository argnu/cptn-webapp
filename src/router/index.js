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
import SolicitudLista from '@/components/solicitudes/SolicitudLista'

import MatriculaMain from '@/components/matriculas/MatriculaMain'
import Matricula from '@/components/matriculas/Matricula'
import MatriculaLista from '@/components/matriculas/MatriculaLista'
import DeudasPendientes from '@/components/matriculas/cuenta/DeudasPendientes'
import ProfesionalModificar from '@/components/entidades/ProfesionalModificar'

import Cobranza from '@/components/cobranzas/Cobranza'
import Legajo from '@/components/matriculas/legajos/Legajo'

import InstitucionLista from '@/components/instituciones/InstitucionLista'
import InstitucionDetalle from '@/components/instituciones/InstitucionDetalle'
import InstitucionNueva from '@/components/instituciones/InstitucionNueva'

import UsuarioLista from '@/components/usuarios/UsuarioLista'
import UsuarioNuevo from '@/components/usuarios/UsuarioNuevo'
import UsuarioDetalle from '@/components/usuarios/UsuarioDetalle'

import BuscadorLegajo from '@/components/herramientas/BuscadorLegajo'
import Arqueo from '@/components/herramientas/Arqueo'
import SistemaConfiguracion from '@/components/sistema/SistemaConfiguracion'

import SolicitudSuspensionLista from '@/components/listados/SolicitudSuspensionLista'

import DocumentoLista from '@/components/documentos/DocumentoLista'
import DocumentoNuevo from '@/components/documentos/DocumentoNuevo'

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
          name: 'SolicitudLista',
          component: SolicitudLista
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
          path: '/profesionales/:id/modificar',
          name: 'ProfesionalModificar',
          component: ProfesionalModificar,
          props: true
        },

        {
          path: '/legajos/:id_legajo',
          name: 'Legajo',
          component: Legajo,
          props: true
        },        

        {
          path: '/legajos/:id_legajo/modificar',
          name: 'LegajoModificar',
          component: Legajo,
          props: (route) => {
            return { id_legajo: route.params.id_legajo, edit: true }
          }
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
          path: '/instituciones/modificar/:id',
          name: 'InstitucionEdit',
          component: InstitucionNueva,
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
            if (to.params.id == Store.state.user.id || this.$can('manage', 'Usuario')) next();
            else next(false);
          },
        },

        {
          path: '/herramientas/busqueda-legajo',
          name: 'BuscadorLegajo',
          component: BuscadorLegajo
        },
        {
          path: '/herramientas/arqueo',
          name: 'Arqueo',
          component: Arqueo
        },

        {
          path: '/configuracion',
          name: 'SistemaConfiguracion',
          component: SistemaConfiguracion
        },

        {
          path: '/listados/solicitudes-suspension',
          name: 'SolicitudSuspensionLista',
          component: SolicitudSuspensionLista
        },

        {
          path: '/documentos/lista',
          name: 'DocumentoLista',
          component: DocumentoLista
        },
        {
          path: '/documentos/nuevo',
          name: 'DocumentoNuevo',
          component: DocumentoNuevo
        },
        {
          path: '/documentos/:id/modificar',
          name: 'DocumentoModificar',
          component: DocumentoNuevo,
          props: true
        }
      ]
    },
  ]
})
