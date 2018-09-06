<template>
<v-container class="grey lighten-3">

  <v-dialog v-model="show_validar" persistent max-width="50%">
    <v-toolbar class="darken-3" color="primary">
      <v-toolbar-title class="white--text">Aprobar Solicitud de Matriculación</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-card-text class="grey lighten-4">
        <v-container>
          <v-form lazy-validation ref="form_aprobacion">

            <v-layout row v-if="filtros.tipoEntidad == 'profesional'">
              <v-flex xs4 class="mx-2">
                <v-select
                  label="Tipo de Matrícula:"
                  :items="$options.tipos_matricula"
                  v-model="matricula.tipo"
                  :rules="[rules.required]"
                >
                </v-select>
              </v-flex>
            </v-layout>

            <v-layout row>
              <v-flex xs4 class="mx-2">
                <v-select
                  label="Tipo de Documento:"
                  :items="opciones.documento"
                  item-text="valor"
                  item-value="id"
                  @change="chgTipoDoc"
                >
                </v-select>
              </v-flex>

              <v-flex xs4 class="mx-2">
                <v-select
                    autocomplete
                    clearable
                    :items="documentos"
                    item-value="id"
                    item-text="numero"
                    label="Documento"
                    v-model="matricula.documento"
                    :rules="[rules.required]"
                >
                    <template slot="item" slot-scope="data">
                        <v-list-tile-content>
                        <v-list-tile-title>N°: {{ data.item.numero }}</v-list-tile-title>
                        <v-list-tile-sub-title>Fecha: {{ data.item.fecha | fecha }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                    </template>
                </v-select>
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
                <v-btn
                  class="right green white--text"
                  @click.native="aprobar"
                  :disabled="submitValidacion"
                  :loading="submitValidacion"
                >
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


  <v-toolbar class="darken-3" color="primary">
    <v-toolbar-title class="white--text">Solicitudes de Matrículas</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-card class="mt-4">
    <v-expansion-panel expand>
      <v-expansion-panel-content v-model="expand.filtros" class="lighten-4" color="primary">
        <div slot="header"></div>
        <v-container class="white black--text">
          <v-layout row wrap>
            <v-flex xs12 md3 class="mx-3">
              <v-select
                :items="$options.select_items.tipo"
                label="Tipo de Entidad"
                single-line bottom
                v-model="filtros.tipoEntidad"
              ></v-select>

              <v-select
                :items="$options.select_items.estado"
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
      :headers="$options.headers[filtros.tipoEntidad]"
      :items="solicitudes"
      class="elevation-1"
      :no-data-text="loading ? '' : 'No se encontraron solicitudes'"
      :no-results-text="loading ? '' : 'No se encontraron solicitudes'"
      :pagination.sync="pagination"
      :total-items="totalItems"
      :loading="loading"
      :rows-per-page-items="[25,30,35]"
    >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.numero }}</td>
        <td>{{ props.item.fecha | fecha }}</td>

        <template v-if="filtros.tipoEntidad == 'profesional'">
          <td>{{ props.item.entidad.apellido }}</td>
          <td>{{ props.item.entidad.nombre }}</td>
          <td>{{ props.item.entidad.dni }}</td>
        </template>
        <template v-if="filtros.tipoEntidad == 'empresa'">
          <td>{{ props.item.entidad.nombre }}</td>
          <td>{{ props.item.entidad.cuit }}</td>
        </template>
        <td>{{ props.item.estado | upperFirst }}</td>
        <td>
          <v-menu>
            <v-btn icon slot="activator">
              <v-icon class="blue--text">more_vert</v-icon>
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

              <v-list-tile>
                <v-list-tile-title>
                  <v-menu open-on-hover top offset-x left>
                    <div slot="activator">
                      <v-icon color="primary">print</v-icon>
                      <span class="ml-2">Imprimir</span>
                    </div>
                    <v-list>
                      <v-list-tile @click="imprimirSolicitud(props.item)">
                        <v-list-tile-title>
                          <v-icon color="primary">print</v-icon>
                          <span class="ml-2">Solicitud</span>
                        </v-list-tile-title>
                      </v-list-tile>

                      <v-list-tile  v-show="filtros.tipoEntidad == 'profesional' && props.item.estado != 'Rechazada'" 
                        @click="imprimirCertificado(props.item)"
                      >
                        <v-list-tile-title>
                          <v-icon color="primary">print</v-icon>
                          <span class="ml-2">Certificado</span>
                        </v-list-tile-title>
                      </v-list-tile>

                      <v-list-tile  v-show="filtros.tipoEntidad == 'profesional' && props.item.estado != 'Rechazada'" 
                        @click="imprimirAnexoCaja(props.item)"
                      >
                        <v-list-tile-title>
                          <v-icon color="primary">print</v-icon>
                          <span class="ml-2">Anexo Caja</span>
                        </v-list-tile-title>
                      </v-list-tile>

                      <v-list-tile  v-show="filtros.tipoEntidad == 'profesional'" 
                        @click="imprimirCertBaja(props.item)"
                      >
                        <v-list-tile-title>
                          <v-icon color="primary">print</v-icon>
                          <span class="ml-2">Cert. Baja Caja Prev.</span>
                        </v-list-tile-title>
                      </v-list-tile>

                      <v-list-tile  v-show="filtros.tipoEntidad == 'profesional' && props.item.estado != 'Rechazada'" 
                        @click="imprimirDifusion(props.item)"
                      >
                        <v-list-tile-title>
                          <v-icon color="primary">print</v-icon>
                          <span class="ml-2">Aceptación de Difusión de Datos</span>
                        </v-list-tile-title>
                      </v-list-tile>
                    </v-list>
                  </v-menu>
                </v-list-tile-title>
              </v-list-tile>



              <v-list-tile v-show="props.item.estado == 'Pendiente'" @click="editSolicitud(props.item.id)">
                <v-list-tile-title>
                  <v-icon color="deep-purple">edit</v-icon>
                  <span class="ml-2">Modificar</span>
                </v-list-tile-title>
              </v-list-tile>

              <v-list-tile v-show="props.item.estado == 'Pendiente'" @click="showCambiarImgs(props.item.entidad)">
                <v-list-tile-title>
                  <v-icon color="deep-purple">add_a_photo</v-icon>
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
        <v-toolbar dark color="primary" ref="toolbar">
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
import api from '@/services/api'
import reports from '@/services/reports'
import * as _ from 'lodash'
import { Matricula, Header } from '@/model'
import * as utils from '@/utils'
import InputNumero from '@/components/base/InputNumero'
import InputFecha from '@/components/base/InputFecha'
import MixinValidator from '@/components/mixins/MixinValidator'
import CambiarFotoFirma from '@/components/solicitudes/CambiarFotoFirma'
import Store from '@/stores/Global'
import ListaStore from '@/stores/listados/Solicitudes'


export default {
  name: 'lista-solicitud',
  mixins: [MixinValidator],

  tipos_matricula: [
    { text: 'TECA', value: 'TECA' },
    { text: 'TEC-', value: 'TEC-' },
    { text: 'IDO', value: 'IDO' }
  ],

  select_items: {
    estado: [
      { text: 'Pendiente', value: 'Pendiente' },
      { text: 'Aprobada', value: 'Aprobada' },
      { text: 'Rechazada', value: 'Rechazada' }
    ],
    tipo: [
      { text: 'Profesionales', value: 'profesional' },
      { text: 'Empresas', value: 'empresa' }
    ]
  }, 

  headers: {
    empresa: [
      Header('N°', 'numero', true),
      Header('Fecha', 'fecha', true),
      Header('Nombre', 'nombreEmpresa', true),
      Header('CUIT', 'cuit', true),
      Header('Estado', 'estado', true),
      Header('Menú', 'acciones')
    ],

    profesional: [
      Header('N°', 'numero', true),
      Header('Fecha', 'fecha', true),
      Header('Apellido', 'apellido', true),
      Header('Nombre', 'nombre', true),
      Header('DNI', 'dni', true),
      Header('Estado', 'estado', true),
      Header('Menú', 'acciones')
    ]
  },

  data() {
    return {
      matricula: new Matricula(Store.state.delegacion.id),
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
      opciones: [],
      documentos: []
    }
  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.updateSolicitudes, 150);
    api.get('/opciones')
    .then(r => {
      this.opciones = r.data;
    })
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
        let url = `/solicitudes?entidad[tipo]=${this.filtros.tipoEntidad}&limit=${limit}&offset=${offset}`;

        if (this.filtros.estado) url += `&estado=${this.filtros.estado}`;
        if (this.filtros.numero && this.filtros.numero.length) url += `&filtros[numero]=${this.filtros.numero}`;
        if (this.filtros.tipoEntidad == 'profesional' && this.filtros.profesional.dni) url += `&filtros[profesional.dni]=${this.filtros.profesional.dni}`;
        if (this.filtros.tipoEntidad == 'profesional' && this.filtros.profesional.apellido) url += `&filtros[profesional.apellido]=${this.filtros.profesional.apellido}`;
        if (this.filtros.tipoEntidad == 'empresa' && this.filtros.empresa.cuit) url += `&filtros[entidad.cuit]=${this.filtros.empresa.cuit}`;
        if (this.filtros.tipoEntidad == 'empresa' && this.filtros.empresa.nombre) url += `&filtros[empresa.nombre]=${this.filtros.empresa.nombre}`;

        if (this.pagination.sortBy) url+=`&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;

        api.get(url)
          .then(r => {
            this.solicitudes = r.data.resultados;
            this.totalItems = r.data.totalQuery;
            this.loading = false;
          })
          .catch(e => console.error(e));
      }
    },

    selectSolicitud: function(solicitud) {
      this.matricula.solicitud = solicitud.id;
      this.show_validar = true;
    },

    chgTipoMatricula: function() {
      axios(`/matriculas/nuevo_numero?tipo=${this.matricula.tipo}`)
      .then(r => this.num_matricula_nueva = r.data)
      .catch(e => console.error(e));
    },

    imprimirSolicitud: function(item) {
      let nombre_reporte;
      if (this.filtros.tipoEntidad == 'empresa') nombre_reporte = 'solicitud_matricula_empresa';
      else  nombre_reporte = 'solicitud_matricula_profesional';
      
      reports.open({
        'jsp-source': `${nombre_reporte}.jasper`,
        'jsp-format': 'PDF',
        'jsp-output-file': `Solicitud ${item.numero} - ${Date.now()}`,
        'jsp-only-gen': false,
        'solicitud_id': item.id
      });
    },

    imprimirCertificado: function(item) {
      reports.open({
        'jsp-source': 'certificado_matricula.jasper',
        'jsp-format': 'PDF',
        'jsp-output-file': `Certificado Matricula en Tramite Sol. ${item.numero} - ${Date.now()}`,
        'jsp-only-gen': false,
        'solicitud_id': item.id
      });
    },

    imprimirAnexoCaja: function(item) {
      reports.open({
        'jsp-source': 'anexo_caja_previsional.jasper',
        'jsp-format': 'PDF',
        'jsp-output-file': `Anexo Caja Sol. ${item.numero} - ${Date.now()}`,
        'jsp-only-gen': false,
        'solicitud_id': item.id
      });
    },

    imprimirCertBaja: function(item) {
      reports.open({
        'jsp-source': 'certificado_baja_para_caja.jasper',
        'jsp-format': 'PDF',
        'jsp-output-file': `Certificado Baja Caja Previsional Sol. ${item.numero} - ${Date.now()}`,
        'jsp-only-gen': false,
        'solicitud_id': item.id
      });
    },

    imprimirDifusion: function(item) {
      reports.open({
        'jsp-source': 'aceptacion_difusion.jasper',
        'jsp-format': 'PDF',
        'jsp-output-file': `Aceptacion Difusion Datos Sol. ${item.numero} - ${Date.now()}`,
        'jsp-only-gen': false,
        'solicitud_id': item.id
      });
    },

    aprobar: function() {
      if (this.$refs.form_aprobacion.validate()) {
        this.submitValidacion = true;

        api.post('/matriculas', this.matricula)
        .then(r => {

          reports.open({
            'jsp-source': 'certificado_matriculado_habilitado.jasper',
            'jsp-format': 'PDF',
            'jsp-output-file': `Cert. Habilitacion Matricula ${r.data.numeroMatricula} - ${Date.now()}`,
            'jsp-only-gen': false,
            'id_matricula': r.data.id
          });        

          this.submitValidacion = false;
          this.updateSolicitudes();
          this.matricula = new Matricula();
          this.$refs.form_aprobacion.reset();
          this.show_validar = false;
          this.global_state.snackbar.msg = 'Solicitud aprobada exitosamente!';
          this.global_state.snackbar.color = 'success';
          this.global_state.snackbar.show = true;
        })
        .catch(e => {
          this.submitValidacion = false;
          console.error(e)
        });
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
        api.patch(`/solicitudes/${id}`, { estado: 3 })
        .then(r => {
            this.updateSolicitudes();
            this.global_state.snackbar.msg = 'Solicitud rechazada exitosamente!';
            this.global_state.snackbar.color = 'success';
            this.global_state.snackbar.show = true;
        })
        .catch(e => console.error(e));
      }
    },

    chgTipoDoc: function(tipo) {
      if (tipo) { 
        api.get(`/documentos?tipo=${tipo}&sort=-fecha`)
        .then(r => this.documentos = r.data.resultados);
      }
    }    
  },

  components: {
    InputFecha,
    InputNumero,
    CambiarFotoFirma
  }

}
</script>

<style>
</style>
