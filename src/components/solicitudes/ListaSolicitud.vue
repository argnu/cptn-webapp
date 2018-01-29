<template>
<v-container class="grey lighten-3">

  <v-dialog v-model="show_validar" persistent max-width="50%">
    <v-toolbar class="blue darken-3">
      <v-toolbar-title class="white--text">Aprobar Solicitud de Matriculación</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-card-text class="grey lighten-4">
        <v-container>
          <v-form lazy-validation ref="form_aprobacion">

            <v-layout>
              <v-flex xs12 class="mx-4">
                <v-select
                  v-show="matricula.tipo != 'EMP'"
                  label="Tipo:"
                  :items="select_items.tipos_matricula"
                  v-model="matricula.tipo"
                  @input="chgTipoMatricula"
                >
                </v-select>
              </v-flex>
            </v-layout>

            <v-layout row class="mt-4">
              <v-flex xs6 class="mx-4">
                N° Matrícula: {{ num_matricula_nueva }}
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs6 class="ma-4">
                <input-fecha
                  v-model="matricula.fechaResolucion"
                  label="Fecha de Resolución"
                  :rules="[rules.required, rules.fecha]"

                >
                </input-fecha>
              </v-flex>

              <v-flex xs6 class="ma-4">
                <v-text-field
                  v-model="matricula.numeroActa"
                  label="N° Acta"
                  :rules="[rules.required, rules.integer]"
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

          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>


  <v-toolbar class="blue darken-3">
    <v-toolbar-title class="white--text">Solicitudes de Matrículas</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-card class="mt-4">
    <v-expansion-panel expand>
      <v-expansion-panel-content v-model="expand.filtros" class="blue lighten-4">
        <div slot="header"></div>
        <v-container class="white black--text">
          <v-layout row wrap>
            <v-flex xs12 md3 class="mx-3">
              <v-select
                :items="select_items.tipo"
                label="Tipo de Entidad"
                single-line bottom
                v-model="filtros.tipoEntidad"
              ></v-select>

              <v-select
                :items="select_items.estado"
                label="Estado de Solicitud"
                single-line bottom
                clearable
                v-model="filtros.estado"
              ></v-select>
            </v-flex>

            <v-flex xs12 md3 class="mx-3">
              <v-text-field
                clearable
                v-model="filtros.numero"
                label="N° Solicitud"
                @input="updateList"
              ></v-text-field>

              <div v-show="filtros.tipoEntidad == 'profesional'">
                <v-text-field 
                  clearable
                  v-model="filtros.profesional.dni" 
                  label="DNI" 
                  @input="updateList"
                ></v-text-field>
              </div>

              <div v-show="filtros.tipoEntidad == 'empresa'">
                <v-text-field 
                  clearable
                  v-model="filtros.empresa.cuit" 
                  label="CUIT" 
                  @input="updateList"
                ></v-text-field>
              </div>
            </v-flex>

            <v-flex xs12 md3 class="mx-3">
              <div v-show="filtros.tipoEntidad == 'profesional'">
                <v-text-field 
                  clearable
                  v-model="filtros.profesional.apellido" 
                  label="Apellido" 
                  @input="updateList"
                ></v-text-field>
              </div>

              <div v-show="filtros.tipoEntidad == 'empresa'">
                <v-text-field 
                  clearable
                  v-model="filtros.empresa.nombre" 
                  label="Nombre" 
                  @input="updateList"
                ></v-text-field>
              </div>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12>
              <v-btn                
                @click="limpiarFiltros"
              >Limpiar Filtros</v-btn>              
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
      :items="solicitudes"
      class="elevation-1"
      no-data-text="No se encontraron solicitudes"
      no-results-text="No se encontraron solicitudes"
      :pagination.sync="pagination"
      :total-items="totalItems"
      :loading="loading"
      :rows-per-page-items="[25,30,35]"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.numero }}</td>
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
              <v-list-tile v-show="props.item.estado == 'Pendiente'" @click="selectSolicitud(props.item)">
                <v-list-tile-title>
                  <v-icon class="green--text text--darken-2">check_circle</v-icon>
                  <span class="ml-2">Aprobar</span>
                </v-list-tile-title>
              </v-list-tile>

              <v-list-tile v-show="props.item.estado == 'Pendiente'" @click="rechazar(props.item.id)">
                <v-list-tile-title>
                  <v-icon class="red--text text--darken-2">thumb_down</v-icon>
                  <span class="ml-2">Rechazar</span>
                </v-list-tile-title>
              </v-list-tile>

              <v-list-tile @click="imprimirSolicitud(props.item.id)">
                <v-list-tile-title>
                  <v-icon class="text--darken-2">print</v-icon>
                  <span class="ml-2">Imprimir</span>
                </v-list-tile-title>
              </v-list-tile>

              <v-list-tile v-show="props.item.estado != 'Rechazada'" @click="editSolicitud(props.item.id)">
                <v-list-tile-title>
                  <v-icon class="blue--text text--darken-2">edit</v-icon>
                  <span class="ml-2">Modificar</span>
                </v-list-tile-title>
              </v-list-tile>

              <v-list-tile v-show="props.item.estado != 'Rechazada'" @click="showCambiarImgs(props.item.entidad)">
                <v-list-tile-title>
                  <v-icon class="blue--text text--darken-2">add_a_photo</v-icon>
                  <span class="ml-2">Cambiar Foto y/o Firma</span>
                </v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td>
      </template>
    </v-data-table>
  </v-card>


    <v-dialog v-model="expand_cambiar_imgs" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark class="blue" ref="toolbar">
          <v-toolbar-title class="white--text">Cambiar Foto y/o Firma</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="cerrarImgs">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <template v-if="profesional_selected">
          <cambiar-foto-firma
            ref="cambiar_imgs"
            :profesional="profesional_selected"
            @cerrar="cerrarImgs"
          ></cambiar-foto-firma>
        </template>
      </v-card>
    </v-dialog>



</v-container>
</template>

<script>
import * as moment from 'moment'
import axios from '@/axios'
import * as _ from 'lodash'
import { Matricula, Header } from '@/model'
import * as utils from '@/utils'
import { impresionSolicitud } from '@/utils/PDFUtils'
import InputFecha from '@/components/base/InputFecha'
import ValidatorMixin from '@/components/mixins/ValidatorMixin'
import CambiarFotoFirma from '@/components/solicitudes/CambiarFotoFirma'
import Store from '@/stores/Global'
import ListaStore from '@/stores/listados/Solicitudes'

const select_items = {
  estado: [
    { text: 'Pendiente', value: 'Pendiente' },
    { text: 'Aprobada', value: 'Aprobada' },
    { text: 'Rechazada', value: 'Rechazada' }
  ],
  tipo: [
    { text: 'Profesionales', value: 'profesional' },
    { text: 'Empresas', value: 'empresa' }
  ],
  tipos_matricula: [
    { text: 'TECA', value: 'TECA' },
    { text: 'TECB', value: 'TECB' },
    { text: 'IDO', value: 'IDO' }
  ]
}

const headers = {
  empresa: [
    Header('N°', 'numero', true),
    Header('Fecha', 'fecha', true),
    Header('Estado', 'estado', true),
    Header('Nombre', 'nombreEmpresa', true),
    Header('CUIT', 'cuit', true),
    Header('', 'acciones')
  ],

  profesional: [
    Header('N°', 'numero', true),
    Header('Fecha', 'fecha', true),
    Header('Estado', 'estado', true),
    Header('Apellido', 'apellido', true),
    Header('Nombre', 'nombre', true),
    Header('DNI', 'dni', true),
    Header('', 'acciones')
  ]
}

export default {
  name: 'lista-solicitud',
  mixins: [ValidatorMixin],

  data() {
    return {
      matricula: new Matricula(Store.state.delegacion),
      show_validar: false,
      num_matricula_nueva: null,
      totalItems: 0,
      loading: false,
      pagination: ListaStore.state.pagination,
      filtros: ListaStore.state.filtros,
      profesional_selected: '',
      expand: {
        filtros: true
      },
      expand_cambiar_imgs: false,
      solicitudes: [],
      debouncedUpdate: null,
      submitValidacion: false,
    }
  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.updateSolicitudes, 150);
  },

  computed: {
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
        this.pagination.page = 1;
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
    limpiarFiltros: function() {
      ListaStore.limpiarFiltros();
    },

    updateList: function() {
      this.debouncedUpdate();
    },

    updateSolicitudes: function() {
      if (this.filtros.tipoEntidad.length) {
        this.loading = true;
        this.solicitudes = [];
        let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
        let limit = this.pagination.rowsPerPage;
        let url = `/solicitudes?tipoEntidad=${this.filtros.tipoEntidad}&limit=${limit}&offset=${offset}`;

        if (this.filtros.estado) url += `&estado=${this.filtros.estado}`;
        if (this.filtros.numero && this.filtros.numero.length) url += `&numero=${this.filtros.numero}`;
        if (this.filtros.tipoEntidad == 'profesional' && this.filtros.profesional.dni) url += `&dni=${this.filtros.profesional.dni}`;
        if (this.filtros.tipoEntidad == 'profesional' && this.filtros.profesional.apellido) url += `&apellido=${this.filtros.profesional.apellido}`;
        if (this.filtros.tipoEntidad == 'empresa' && this.filtros.empresa.cuit) url += `&cuit=${this.filtros.empresa.cuit}`;
        if (this.filtros.tipoEntidad == 'empresa' && this.filtros.empresa.nombre) url += `&nombreEmpresa=${this.filtros.empresa.nombre}`;
        
        if (this.pagination.sortBy) url+=`&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;

        axios.get(url)
          .then(r => {
            this.solicitudes = r.data.resultados;
            this.totalItems = r.data.totalQuery;
            this.loading = false;
          })
          .catch(e => console.error(e));
      }
    },

    selectSolicitud: function(solicitud) {
      if (solicitud.entidad.tipo == 'empresa') this.matricula.tipo = 'EMP';
      axios(`/matriculas/nuevo_numero?tipo=${this.matricula.tipo}`)
      .then(r => {
        this.num_matricula_nueva = r.data
        this.show_validar = true;
        this.matricula.solicitud = solicitud.id;
      })
      .catch(e => console.error(e));
    },

    chgTipoMatricula: function() {
      axios(`/matriculas/nuevo_numero?tipo=${this.matricula.tipo}`)
      .then(r => this.num_matricula_nueva = r.data)
      .catch(e => console.error(e));
    },

    imprimirSolicitud: function(id) {
      axios.get(`/solicitudes/${id}`)
          .then(s => {
            let solicitud = s.data;
            let pdf = impresionSolicitud(solicitud);
            pdf.save(`Solicitud ${solicitud.entidad.nombre} ${solicitud.entidad.apellido || '' }.pdf`)
          })
          .catch(e => console.error(e));
    },

    aprobar: function() {
      if (this.$refs.form_aprobacion.validate()) {
        this.matricula.operador = this.user.id;

        axios.post('/matriculas', this.matricula)
          .then(r => {
            this.updateSolicitudes();
            this.matricula = new Matricula();
            this.$refs.form_aprobacion.reset();
            this.show_validar = false;
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

    showCambiarImgs: function(prof) {
      this.profesional_selected = prof;
      this.expand_cambiar_imgs = true;
    },

    cerrarImgs: function() {
      this.expand_cambiar_imgs = false
      this.$refs.cambiar_imgs.reset();
      this.profesional_selected = null;
      this.updateSolicitudes();
    },

    rechazar: function(id) {
      if (confirm('Esta segura/o que desea Rechazar la Solicitud de Matriculación seleccionada?')) {
        // 3 ES ESTADO 'Rechazada'
        axios.patch(`/solicitudes/${id}`, { estado: 3, updated_by: this.user.id })
        .then(r => {
            this.updateSolicitudes();
            this.global_state.snackbar.msg = 'Solicitud rechazada exitosamente!';
            this.global_state.snackbar.color = 'success';
            this.global_state.snackbar.show = true;          
        })
        .catch(e => console.error(e));
      }
    }    
  },

  components: {
    InputFecha,
    CambiarFotoFirma
  }

}
</script>

<style>
</style>
