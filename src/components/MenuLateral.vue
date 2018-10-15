<template>
  <v-navigation-drawer light temporary absolute v-model="show_drawer">
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img src="/static/sidebar_usuario-corporativo.png" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>{{ full_name }}</v-list-tile-title>
            <v-list-tile-sub-title>{{ delegacion ? delegacion.nombre : '' }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-toolbar>

    <v-list>

      <v-list-group
        prepend-icon="description"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Solicitudes</v-list-tile-title>
        </v-list-tile>

        <v-list-tile v-if="$can('create', 'Solicitud')" @click="goto('/solicitudes/profesionales/nueva')">
          <v-list-tile-sub-title>Nuevo Profesional</v-list-tile-sub-title>
        </v-list-tile>
        <v-list-tile v-if="$can('create', 'Solicitud')" @click="goto('/solicitudes/empresas/nueva')">
          <v-list-tile-sub-title>Nueva Empresa</v-list-tile-sub-title>
        </v-list-tile>
        <v-list-tile v-if="$can('read', 'Solicitud')" @click="goto('/solicitudes/lista')">
          <v-list-tile-sub-title>Ver Listado</v-list-tile-sub-title>
        </v-list-tile>
      </v-list-group>

      <v-divider></v-divider>

      <v-list-group
        v-if="$can('read', 'Matricula')"
        prepend-icon="assignment"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Matrículas</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="goto('/matriculas/lista')">
          <v-list-tile-sub-title>Ver Listado</v-list-tile-sub-title>
        </v-list-tile>
      </v-list-group>

      <v-divider></v-divider>

      <v-list-group
        v-if="$can('read', 'Persona')"
        prepend-icon="list"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Personas</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="goto('/personas/nueva')">
          <v-list-tile-sub-title>Nueva Persona</v-list-tile-sub-title>
        </v-list-tile>

        <v-list-tile @click="goto('/personas/lista')">
          <v-list-tile-sub-title>Ver Listado</v-list-tile-sub-title>
        </v-list-tile>
      </v-list-group>

      <v-divider></v-divider>

      <v-list-group
        prepend-icon="school"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Instituciones</v-list-tile-title>
        </v-list-tile>

        <v-list-tile v-if="$can('create', 'Institucion')" @click="goto('/instituciones/nueva')">
          <v-list-tile-sub-title>Agregar Nueva</v-list-tile-sub-title>
        </v-list-tile>
        <v-list-tile v-if="$can('read', 'Institucion')" @click="goto('/instituciones/lista')">
          <v-list-tile-sub-title>Ver Listado</v-list-tile-sub-title>
        </v-list-tile>
      </v-list-group>
      
      <v-divider></v-divider>

      <v-list-group
        prepend-icon="description"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Documentos</v-list-tile-title>
        </v-list-tile>

        <v-list-tile v-if="$can('create', 'Documento')" @click="goto('/documentos/nuevo')">
          <v-list-tile-sub-title>Agregar Nuevo</v-list-tile-sub-title>
        </v-list-tile>
        <v-list-tile v-if="$can('read', 'Documento')" @click="goto('/documentos/lista')">
          <v-list-tile-sub-title>Ver Listado</v-list-tile-sub-title>
        </v-list-tile>
      </v-list-group>
      
      <v-divider></v-divider>

      <v-list-group
        prepend-icon="list"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Listados</v-list-tile-title>
        </v-list-tile>

        <v-list-tile v-if="$can('read', 'SolicitudSuspension')" @click="goto('/listados/solicitudes-suspension')">
          <v-list-tile-sub-title>Solicitudes de Suspensión</v-list-tile-sub-title>
        </v-list-tile>

        <v-list-tile v-if="$can('read', 'Matricula')" @click="goto('/listados/matriculas')">
          <v-list-tile-sub-title>Profesionales</v-list-tile-sub-title>
        </v-list-tile>
      </v-list-group>

      <v-divider></v-divider>

      <v-list-group
        prepend-icon="build"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Herramientas</v-list-tile-title>
        </v-list-tile>

        <v-list-tile v-if="$can('read', 'Legajo')" @click="goto('/herramientas/busqueda-legajo')">
          <v-list-tile-sub-title>Búsqueda de Legajos</v-list-tile-sub-title>
        </v-list-tile>

        <v-list-tile v-if="$can('read', 'Comprobante')" @click="goto('/herramientas/arqueo')">
          <v-list-tile-sub-title>Arqueo</v-list-tile-sub-title>
        </v-list-tile>

        <v-list-tile v-if="$can('read', 'Comprobante')" @click="goto('/herramientas/resumen-ingresos')">
          <v-list-tile-sub-title>Resumen de Ingresos</v-list-tile-sub-title>
        </v-list-tile>
      </v-list-group>

      <v-divider></v-divider>

      <v-list-group
        prepend-icon="account_circle"
        v-if="$can('manage', 'Usuario')"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Usuarios</v-list-tile-title>
        </v-list-tile>

        <v-list-tile v-if="$can('create', 'Usuario')" @click="goto('/usuarios/nuevo')">
          <v-list-tile-sub-title>Agregar Nuevo</v-list-tile-sub-title>
        </v-list-tile>
        <v-list-tile v-if="$can('read', 'Usuario')" @click="goto('/usuarios/lista')">
          <v-list-tile-sub-title>Ver Listado</v-list-tile-sub-title>
        </v-list-tile>
      </v-list-group>

      <v-divider></v-divider>

      <v-list-group
        prepend-icon="settings"
        v-if="$can('manage', 'ValoresGlobales')"
      >
        <v-list-tile slot="activator">
          <v-list-tile-title>Sistema</v-list-tile-title>
        </v-list-tile>

        <v-list-tile @click="goto('/configuracion')">
          <v-list-tile-sub-title>Configuración</v-list-tile-sub-title>
        </v-list-tile>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import MixinGlobalState from '@/components/mixins/MixinGlobalState'

export default {
  name: 'MenuLateral',

  mixins: [MixinGlobalState],

  data () {
    return {
      show_drawer: false,
    }
  },

  computed: {
    full_name: function() {
      return `${this.user.nombre} ${this.user.apellido}`;
    }
  },

  methods: {
    goto: function(route) {
      this.$router.push({path: route});
      this.show_drawer = false;
    },

    toggle: function() {
      this.show_drawer = !this.show_drawer;
    },
  },

}
</script>

<style>
</style>
