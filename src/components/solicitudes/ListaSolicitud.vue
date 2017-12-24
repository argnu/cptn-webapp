<template>
<v-container class="grey lighten-3">

  <v-dialog v-model="show_validar" persistent max-width="50%">
    <v-toolbar class="blue darken-3">
      <v-toolbar-title class="white--text">Aprobar Solicitud de Matriculación</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-card-text class="grey lighten-4">
        <v-container>
          <v-layout>
            <v-flex xs12 class="mx-4">
              N° Matrícula: {{ num_matricula_nueva }}
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs6 class="ma-4">
              <input-fecha 
                v-model="matricula.fechaResolucion" 
                label="Fecha de Resolución" 
                :rules="validator.matricula.fechaResolucion"
                :error="submitValidacion 
                  && !validControl(validator.matricula.fechaResolucion, matricula.fechaResolucion)"
              >
              </input-fecha>
            </v-flex>

            <v-flex xs6 class="ma-4">
              <v-text-field 
                v-model="matricula.numeroActa" 
                label="N° Acta" 
                :rules="validator.matricula.numeroActa"
                :error="submitValidacion 
                  && !validControl(validator.matricula.numeroActa, matricula.numeroActa)"
              >
              </v-text-field>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex class="ml-4">
              <v-checkbox 
                label="Generar Boleta de Inscripción" 
                v-model="matricula.generar_boleta" 
                color="primary"
              >
              </v-checkbox>
            </v-flex>
          </v-layout>

          <v-layout row>
            <v-flex xs12>
              <v-btn class="right green white--text" @click.native="aprobar">
                Aprobar
                <v-icon dark right>check_circle</v-icon>
              </v-btn>
              <v-btn class="right red white--text" @click.native="show_validar = false">
                Cancelar
                <v-icon dark right>block</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>


  <v-toolbar class="blue darken-3">
    <v-toolbar-title class="white--text">Solicitudes de Matrículas</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <br>

  <v-card>
    <v-expansion-panel expand>
      <v-expansion-panel-content v-model="expand.filtros" class="blue lighten-4">
        <div slot="header"></div>
        <v-container class="white black--text">
          <v-layout row>
            <v-flex xs3 class="ma-4">
              Tipo de Entidad:
              <v-select :items="select_items.tipo" label="Tipo de Entidad" single-line bottom v-model="filtros.tipoEntidad">
              </v-select>
            </v-flex>

            <v-flex xs3 class="ma-4">
              Estado:
              <v-select :items="select_items.estado" label="Estado de Solicitud" single-line bottom v-model="filtros.estado">
              </v-select>
            </v-flex>

            <v-flex xs3 class="ma-4">
              <br>
              <div v-show="filtros.tipoEntidad == 'profesional'">
                <v-text-field v-model="filtros.profesional.dni" label="DNI" @input="updateList">
                </v-text-field>
              </div>

              <div v-show="filtros.tipoEntidad == 'empresa'">
                <v-text-field v-model="filtros.empresa.cuit" label="CUIT" @input="updateList">
                </v-text-field>
              </div>
            </v-flex>

            <v-flex xs3 class="ma-4">
              <br>
              <div v-show="filtros.tipoEntidad == 'profesional'">
                <v-text-field v-model="filtros.profesional.apellido" label="Apellido" @input="updateList">
                </v-text-field>
              </div>
              <div v-show="filtros.tipoEntidad == 'empresa'">
                <v-text-field v-model="filtros.empresa.nombre" label="Nombre" @input="updateList">
                </v-text-field>
              </div>
            </v-flex>
          </v-layout>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>

  <br>

  <v-card>
    <v-data-table
      :headers="headers[filtros.tipoEntidad]"
      :items="solicitudes_filter"
      class="elevation-1"
      no-data-text="No se encontraron solicitudes"
      no-results-text="No se encontraron solicitudes"
      :pagination.sync="pagination"
      :total-items="totalItems"
      :loading="loading"
      :rows-per-page-items="[5, 10, 25]"
    >
      <template slot="headers" slot-scope="props">
        <tr class="blue lighten-4 text-xs-left">
          <th><b>Fecha</b></th>
          <th><b>Estado</b></th>
          <th><b>Nombre</b></th>
          <th v-for="header of props.headers">
            <b>{{ header.text }}</b>
          </th>
          <th><b>Acciones</b></th>
        </tr>
      </template>
      <template slot="items" slot-scope="props">
            <td>{{ props.item.fecha | fecha }}</td>
            <td>{{ props.item.estado | upperFirst }}</td>
            <template v-if="filtros.tipoEntidad == 'profesional'">
              <td>{{ props.item.entidad.nombre }}</td>
              <td>{{ props.item.entidad.apellido }}</td>
              <td>{{ props.item.entidad.dni }}</td>
            </template>
            <template v-if="filtros.tipoEntidad == 'empresa'">
              <td>{{ props.item.entidad.nombre }}</td>
              <td>{{ props.item.entidad.cuit }}</td>
            </template>
      <td>
        <v-menu>
          <v-btn fab dark small color="blue" slot="activator">
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile v-show="props.item.estado != 'aprobada'" @click="selectSolicitud(props.item.id)">
              <v-list-tile-title>
                <v-icon class="green--text text--darken-2">check_circle</v-icon>
                <span class="ml-2">Aprobar</span>
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile @click="imprimirSolicitud(props.item.id)">
              <v-list-tile-title>
                <v-icon class="text--darken-2">print</v-icon>
                <span class="ml-2">Imprimir</span>
              </v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-show="props.item.estado != 'aprobada'" @click="editSolicitud(props.item.id)">
              <v-list-tile-title>
                <v-icon class="blue--text text--darken-2">edit</v-icon>
                <span class="ml-2">Modificar</span>
              </v-list-tile-title>
            </v-list-tile>
          </v-list>
        </v-menu>
      </td>
      </template>
    </v-data-table>
  </v-card>

</v-container>
</template>

<script>
import * as moment from 'moment'
import axios from '@/axios'
import * as _ from 'lodash'
import * as utils from '@/utils'
import rules from '@/rules'
import InputFecha from '@/components/base/InputFecha'
import { Matricula } from '@/model'
import ValidatorMixin from '@/components/mixins/ValidatorMixin'
import { impresionSolicitud } from '@/utils/PDFUtils'
import Cobranza from '@/components/cobranzas/Cobranza'
import Store from '@/Store'

const select_items = {
  estado: [
    { text: 'Todas', value: 'todas' },
    { text: 'Pendiente', value: 'pendiente' },
    { text: 'Aprobada', value: 'aprobada' },
    { text: 'Rechazada', value: 'rechazada' }
  ],
  tipo: [
    { text: 'Profesionales', value: 'profesional' },
    { text: 'Empresas', value: 'empresa' }
  ]
}

const headers = {
  empresa: [
    { text: 'CUIT', value: 'cuit' },
  ],
  profesional: [
    { text: 'Apellido', value: 'apellido' },
    { text: 'DNI', value: 'dni' },
  ]
}

export default {
  name: 'lista-solicitud',
  mixins: [ValidatorMixin],
  data() {
    return {
      global_state: Store.state,
      matricula: new Matricula(Store.state.delegacion),
      show_validar: false,
      num_matricula_nueva: null,
      totalItems: 0,
      loading: false,
      pagination: {
        rowsPerPage: 5,
      },

      expand: {
        filtros: true
      },

      solicitudes: [],

      filtros: {
        estado: 'todas',
        tipoEntidad: 'profesional',
        profesional: {
          dni: '',
          apellido: ''
        },
        empresa: {
          nombre: ''
        }
      },

      debouncedUpdate: null,

      validator: {
        matricula: {
          numeroActa: [rules.required, rules.number],
          fechaResolucion: [rules.required, rules.fecha]
        }
      },

      submitValidacion: false,
    }
  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.updateSolicitudes, 600, {
      'maxWait': 1000
    });
  },

  computed: {
    solicitudes_filter: function() {
      let ini = (this.pagination.page - 1) * this.pagination.rowsPerPage;
      return this.solicitudes.slice(ini, ini + this.pagination.rowsPerPage);
    },

    select_items: function() {
      return select_items;
    },

    headers: function() {
      return headers;
    }
  },

  watch: {
    filtros: {
      handler() {
        this.updateSolicitudes();
      },
      deep: true
    },

    pagination: {
      handler() {
        this.updateSolicitudes();
      },
      deep: true
    }
  },

  methods: {

    updateList: function() {
      this.debouncedUpdate();
    },

    updateSolicitudes: function() {
      if (this.filtros.tipoEntidad.length) {
        this.loading = true;
        this.solicitudes = [];
        let url = `/solicitudes?tipoEntidad=${this.filtros.tipoEntidad}`;
        if (this.filtros.estado && this.filtros.estado != 'todas') url += `&estado=${this.filtros.estado}`;
        if (this.filtros.profesional.dni) url += `&dni=${this.filtros.profesional.dni}`;
        if (this.filtros.profesional.apellido) url += `&apellido=${this.filtros.profesional.apellido}`;
        if (this.filtros.empresa.cuit) url += `&cuit=${this.filtros.empresa.cuit}`;
        if (this.filtros.empresa.nombre) url += `&nombreEmpresa=${this.filtros.empresa.nombre}`;

        axios.get(url)
          .then(r => {
            this.solicitudes = r.data;
            this.totalItems = this.solicitudes.length;
            this.loading = false;
          })
          .catch(e => console.error(e));
      }
    },

    selectSolicitud: function(id) {
      axios('/matriculas/nuevo_numero')
      .then(r => {
        this.num_matricula_nueva = r.data;
        this.show_validar = true;
        this.matricula.solicitud = id;
      })
      .catch(e => console.error(e));
    },

    imprimirSolicitud: function(id) {
      axios.get(`/solicitudes/${id}`)
          .then(s => {
            let solicitud = s.data;
            let pdf = impresionSolicitud(solicitud);
            pdf.save(`Solicitud ${solicitud.entidad.nombre} ${solicitud.entidad.apellido}.pdf`)
          })
          .catch(e => console.error(e));
    },

    aprobar: function() {
      this.submitValidacion = true;
      if (utils.validObject(this.matricula, this.validator.matricula)) {
        axios.post('/matriculas', this.matricula)
          .then(r => {
            this.updateSolicitudes();
            this.matricula = new Matricula();
            this.show_validar = false;
            this.submitValidacion = false;
            this.global_state.snackbar.msg = 'Solicitud aprobada exitosamente!';
            this.global_state.snackbar.color = 'success';
            this.global_state.snackbar.show = true;            
          })
          .catch(e => console.error(e));
      }
    },

    editSolicitud: function(id) {
      let tipo = this.filtros.tipoEntidad == 'profesional' ? 'profesionales' : 'empresas';
      this.$router.push(`/solicitudes/${tipo}/modificar/${id}`);
    },
  },

  components: {
    InputFecha,
    Cobranza
  }

}
</script>

<style>
</style>
