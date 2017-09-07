<template>
  <v-app>
    <v-container>
      <v-layout row wrap>
        <v-flex xs12>
          <v-toolbar class="indigo" dark>
            <v-toolbar-title class="white--text">Listado de Solicitudes</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-container>
            <v-card>
              <v-card-title>
                Tipo de Entidad
              </v-card-title>
              <v-card-text class="grey lighten-4">
                <v-select
                  :items="select_items.tipo"
                  label="Tipo de Entidad"
                  single-line bottom
                  v-model="tipoEntidad"
                >
                </v-select>
              </v-card-text>
            </v-card>
          </v-container>


          <v-container>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-model="expand.filtros">
                <div slot="header">Filtros de Búsqueda</div>
                <v-container>
                  <v-layout row>
                    <v-flex xs4>
                      <v-select
                        :items="select_items.estado"
                        label="Estado de Solicitud"
                        single-line bottom
                        v-model="filtros.estado">
                      </v-select>
                    </v-flex>
                    <v-flex xs4>
                      <v-text-field
                         v-show="filtros.tipo == 'profesional'"
                         v-model="filtros.dni"
                         label="DNI">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs4>
                      <v-text-field
                         v-show="filtros.tipo == 'profesional'"
                         v-model="filtros.apellido"
                         label="Apellido">
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-container>

          <v-container>
            <v-data-table
                :headers="columnas"
                :items="solicitudes_filter"
                hide-actions
                class="elevation-1"
                no-data-text="No hay solicitudes">
              <template slot="headers" scope="props">
                <th style="text-align:left">Validar</th>
                <th v-for="header of props.headers" style="padding: 20px;text-align:left">
                  <b>{{ header.text }}</b>
                </th>
              </template>
              <template slot="items" scope="props">
                <td>
                  <v-btn icon class="green--text">
                    <v-icon dark>check_circle</v-icon>
                  </v-btn>
                </td>
                <td>{{ props.item.fecha | formatFecha }}</td>
                <td>{{ props.item.estado | upperFirst }}</td>
                <td v-if="filtros.tipo == 'profesional'">{{ props.item.entidad.dni }}</td>
                <td >{{ props.item.entidad.nombre }}</td>
                <td v-if="filtros.tipo == 'profesional'">{{ props.item.entidad.apellido }}</td>
              </template>
            </v-data-table>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import * as axios from 'axios';
import * as utils from '@/utils';

export default {
  name: 'lista-solicitud',
  data () {
    return {
      labelFecha: 'hola',
      select_items: {
        estado: [
          {
            text: 'Pendiente',
            value: 'pendiente'
          },
          {
            text: 'Aprobada',
            value: 'aprobada'
          },
          {
            text: 'Rechazada',
            value: 'rechazada'
          }
        ],
        tipo: [
          {
            text: 'Profesionales',
            value: 'profesional'
          },
          {
            text: 'Empresas',
            value: 'empresa'
          }
        ]
      },

      expand: {
        filtros: true
      },

      columnas: [
        {
          text: 'Fecha',
          value: 'fecha'
        },
        {
          text: 'Estado',
          value: 'estado'
        },
        {
          text: 'Nombre',
          value: 'nombre'
        }
      ],

      solicitudes: [],

      filtros: {
        estado: 'pendiente',
        dni: '',
        apellido: '',
      },

      tipoEntidad: '',
    }
  },

  filters: {
    formatFecha: function(str) {
      return utils.formatFecha(str);
    },

    upperFirst: function(str) {
      return utils.upperFirst(str);
    }
  },

  computed: {
    solicitudes_filter: function() {
      if (!this.filtros.estado.length && !this.filtros.dni.length
        && !this.filtros.apellido.length)
        return this.solicitudes;
      else {
        return this.solicitudes.filter(s => {
          if (this.tipoEntidad == 'profesional'
            &&  !s.entidad.apellido.toLowerCase().includes(this.filtros.apellido)) return false;
          if (this.tipoEntidad == 'profesional'
            &&  !s.entidad.dni.includes(this.filtros.dni)) return false;
          if (s.estado != this.filtros.estado) return false;
          return true;
        })
      }
    }
  },

  watch: {
    tipoEntidad: function(tipo) {
      this.solicitudes = [];
      axios.get(`http://localhost:3400/api/solicitudes?tipoEntidad=${tipo}`)
           .then(r => this.solicitudes = r.data)
           .catch(e => console.error(e));
    }
  },

  methods: {

  },

  components: {
  }

}
</script>

<style>
</style>
