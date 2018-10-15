<template>
<v-container class="grey lighten-3">
  <v-dialog v-model="show_aprobar" persistent max-width="40%">
    <v-toolbar class="darken-3" color="primary">
      <v-toolbar-title class="white--text">Aprobar Solicitud</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-card-text class="grey lighten-4">
        <v-container>
          <v-form lazy-validation ref="form_aprobar">
            <v-layout row class="mt-4">
              <v-flex xs5 class="mx-4">
                <v-select
                  label="Tipo de Documento:"
                  :items="global_state.opciones.documento"
                  item-text="valor"
                  item-value="id"
                  @change="chgTipoDoc"
                ></v-select>
              </v-flex>

              <v-flex xs5 class="mx-4">
                <v-select
                    autocomplete
                    clearable
                    :items="documentos"
                    item-value="id"
                    item-text="numero"
                    label="Documento"
                    v-model="documento"
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

            <v-layout row class="mt-5">
              <v-flex xs12>
                <v-btn
                  class="right green white--text"
                  @click.native="aprobar"
                  :disabled="submit_aprobar"
                  :loading="submit_aprobar"
                >
                  Guardar
                  <v-icon dark right>check_circle</v-icon>
                </v-btn>
                <v-btn class="right red white--text" @click.native="show_aprobar = false">
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
    <v-toolbar-title class="white--text">Solicitudes de Suspensión</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-layout class="mt-4">
      <v-flex xs6 class="mx-4">
        <input-fecha
            label="Fecha Desde:"
            v-model="filtros.fecha_desde"
            @change="updateList"
        ></input-fecha>

        <v-select
            :items="global_state.opciones.estadoSolicitud"
            label="Estado de Solicitud"
            single-line bottom
            clearable
            item-text="valor"
            item-value="id"
            v-model="filtros.estado"
            @input="updateList"
        ></v-select>
      </v-flex>

      <v-flex xs6 class="mx-4">
        <input-fecha
            label="Fecha Hasta:"
            v-model="filtros.fecha_hasta"
            @change="updateList"
        ></input-fecha>

        <v-text-field
            label="N° Matrícula:"
            clearable
            autocomplete
            v-model="filtros.delegacion"
            @input="updateList"
        ></v-text-field>
      </v-flex>

  </v-layout>

    <v-card>
        <div>
            <v-btn
                absolute dark fab top right small
                title="Exportar"
                color="primary"
                @click="exportar"
            >
                <v-icon>grid_on</v-icon>
            </v-btn>

            <v-data-table
                class="elevation-1 mt-4"
                no-data-text="No hay datos"
                :headers="$options.headers"
                :items="solicitudes"
                :loading="loading"
                :pagination.sync="pagination"
                :total-items="totalItems"
                :rows-per-page-items="[25,30,35]"
            >
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.fecha | fecha }}</td>
                    <td>{{ props.item.id }}</td>
                    <td>{{ props.item.estado.valor }}</td>
                    <td>{{ props.item.matricula.numero }}</td>
                    <td>{{ props.item.matricula | detalle_matricula }}</td>
                    <td>
                        <v-menu v-if="props.item.estado.id == 1">
                            <v-btn icon slot="activator">
                            <v-icon class="blue--text">more_vert</v-icon>
                            </v-btn>

                            <v-list>
                                <v-list-tile>
                                    <v-list-tile-title>
                                    <v-menu open-on-hover top offset-x left>
                                        <div slot="activator">
                                        <v-icon class="text--darken-2">print</v-icon>
                                        <span class="ml-2">Imprimir</span>
                                        </div>
                                        <v-list>
                                            <v-list-tile
                                                @click="imprimir(props.item.matricula.id)"
                                            >
                                                <v-icon class="text--darken-2 mr-2">print</v-icon>
                                                <v-list-tile-title>Solicitud</v-list-tile-title>
                                            </v-list-tile>

                                            <v-list-tile
                                                @click="imprimirAnexo(props.item.matricula.id)"
                                            >
                                                <v-icon class="text--darken-2 mr-2">print</v-icon>
                                                <v-list-tile-title>Anexo</v-list-tile-title>
                                            </v-list-tile>

                                            <v-list-tile
                                                @click="imprimirDDJJ(props.item.matricula.id)"
                                            >
                                                <v-icon class="text--darken-2 mr-2">print</v-icon>
                                                <v-list-tile-title>DDJJ Credencial</v-list-tile-title>
                                            </v-list-tile>
                                        </v-list>
                                    </v-menu>
                                    </v-list-tile-title>
                                </v-list-tile>

                                <v-list-tile
                                    @click="mostrarAprobar(props.item)"
                                >
                                    <v-icon class="green--text mr-2">check_circle</v-icon>
                                    <v-list-tile-title>Aprobar</v-list-tile-title>
                                </v-list-tile>
                            </v-list>
                        </v-menu>
                        </td>
                </template>
            ></v-data-table>
        </div>
    </v-card>

    <table style="display:none" ref="tabla_export" id="tabla_export">
        <thead>
            <tr>
                <th style="text-align:right" v-for="header of $options.headers" :key="header.value">
                    {{ header.text }}
                </th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>


</v-container>
</template>

<script>
import moment from 'moment'
import { debounce } from 'lodash'

import api from '@/services/api'
import reports from '@/services/reports'
import { ColumnHeader } from '@/model'
import InputFecha from '@/components/base/InputFecha'
import InputNumero from '@/components/base/InputNumero'
import MixinValidator from '@/components/mixins/MixinValidator'
import MixinGlobalState from '@/components/mixins/MixinGlobalState'


export default {
    name: 'SolicitudSuspensionLista',

    mixins: [MixinGlobalState, MixinValidator],

    components: {
        InputFecha,
        InputNumero
    },

    headers: [
        ColumnHeader('Fecha', 'fecha', true),
        ColumnHeader('N° Suspension', 'id', true),
        ColumnHeader('Estado', 'estado', true),
        ColumnHeader('N° Matrícula', 'matricula.numero', true),
        ColumnHeader('Detalle Matricula', 'detalle_matricula'),
        ColumnHeader('', 'acciones')
    ],

    filters: {
        detalle_matricula: function(matricula) {
            if (!matricula) return '';
            return `${matricula.entidad.nombre} ${matricula.entidad.apellido || ''}`
        }
    },

    data() {
        return {
            solicitudes: [],
            filtros: {
                fecha_desde: moment().startOf('year').format('DD/MM/YYYY'),
                fecha_hasta: moment().format('DD/MM/YYYY'),
                matricula: '',
                estado: ''
            },
            pagination: {
                descending: null,
                sortBy: null,
                page: 1,
                rowsPerPage: 25
            },
            totalItems: 0,
            loading: false,
            debouncedUpdate: null,

            selected: null,
            submit_aprobar: false,
            documento: null,
            documentos: []
        }
    },

    watch: {
        filtros: {
            handler() {
                this.pagination.page = 1;
                this.update();
            },
            deep: true
        },

        pagination: {
            handler() {
                this.update();
            },
            deep: true
        }
    },

    created: function() {
        this.debouncedUpdate = debounce(this.update, 600, {
            'maxWait': 1000
        });
    },

    methods: {
        updateList: function() {
            this.debouncedUpdate();
        },

        update: function() {
            this.loading = true;
            let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
            let limit = this.pagination.rowsPerPage;

            let url = `/solicitudes-suspension?limit=${limit}&offset=${offset}`;
            url += `&fecha[desde]=${this.filtros.fecha_desde}`
            url += `&fecha[hasta]=${this.filtros.fecha_hasta}`;
            if (this.filtros.estado) url += `&estado=${this.filtros.estado}`;
            if (this.filtros.matricula) url += `&filtros[matricula.numero]=${this.filtros.matricula}`;

            if (this.pagination.sortBy) {
                url += `&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;
            }

            api.get(url)
            .then(r => {
                this.loading = false;
                this.solicitudes = r.data.resultados;
                this.totalItems = r.data.totalQuery;
            })
            .catch(e => {
                console.error(e);
            })
        },

        exportar: function() {
            this.global_state.cursor_wait = true;
            let tabla = this.$refs.tabla_export;
            let url = `/solicitudes-suspension?`;
            url += `&fecha[desde]=${this.filtros.fecha_desde}`
            url += `&fecha[hasta]=${this.filtros.fecha_hasta}`;
            if (this.filtros.estado) url += `&estado=${this.filtros.estado}`;
            if (this.filtros.matricula) url += `&filtros[matricula.numero]=${this.filtros.matricula}`;

            if (this.pagination.sortBy) {
                url += `&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;
            }

            api.get(url)
            .then(r => {
                let rows = '';
                for(let solicitud of r.data.resultados) {
                    rows += `
                    <tr>
                        <td>${this.$options.filters.fecha(solicitud.fecha)}</td>
                        <td style="mso-number-format:'0'">${solicitud.id}</td>
                        <td style="mso-number-format:'\@'">${solicitud.matricula.numero}</td>
                        <td>${this.$options.filters.detalle_matricula(solicitud.matricula)}</td>
                    </tr>
                    `;
                }

                tabla.getElementsByTagName('tbody')[0].innerHTML = rows;

                window.open('data:application/vnd.ms-excel;base64,' + btoa(this.$refs.tabla_export.outerHTML));
                this.global_state.cursor_wait = false;
            })
            .catch(e => {
                console.error(e);
            })
        },

        imprimir: function(id_matricula) {
            reports.open({
                'jsp-source': 'solicitud_suspension_voluntad.jasper',
                'jsp-format': 'PDF',
                'jsp-output-file': `Solicitud Suspension - ${Date.now()}`,
                'jsp-only-gen': false,
                'matricula_id': id_matricula,
            });
        },

        imprimirAnexo: function(id_matricula) {
            reports.open({
                'jsp-source': 'anexo_solicitud_suspension.jasper',
                'jsp-format': 'PDF',
                'jsp-output-file': `Anexo Suspension - ${Date.now()}`,
                'jsp-only-gen': false,
                'matricula_id': id_matricula,
            });
        },

        imprimirDDJJ: function(id_matricula) {
            reports.open({
                'jsp-source': 'ddjjcredencial.jasper',
                'jsp-format': 'PDF',
                'jsp-output-file': `DDJJ Credencial - ${Date.now()}`,
                'jsp-only-gen': false,
                'matricula_id': id_matricula,
            });
        },

        mostrarAprobar: function(solicitud) {
            this.show_aprobar = true;
            this.selected = solicitud;
        },

        aprobar: function() {
            this.submit_aprobar = true;
            if (this.$refs.form_aprobar.validate()) {
                api.post(`/solicitudes-suspension/${this.selected.id}/aprobar`, { documento: this.documento })
                .then(r => {
                    this.snackOk('Solicitud de suspensión aprobada exitosamente!');
                    this.submit_aprobar = false;
                    this.show_aprobar = false;
                    this.documento = null;
                    this.update();

                    reports.open({
                        'jsp-source': 'certificado_suspension_matricula.jasper',
                        'jsp-format': 'PDF',
                        'jsp-output-file': `Certificado Suspension - ${Date.now()}`,
                        'jsp-only-gen': false,
                        'matricula_id': this.selected.matricula.id,
                    });                    
                })
                .catch(e => {
                    this.snackError(e);
                    this.submit_aprobar = false;
                });            
            }
        },

        chgTipoDoc: function(tipo) {
            if (tipo) { 
                api.get(`/documentos?tipo=${tipo}&sort=-fecha`)
                .then(r => this.documentos = r.data.resultados);
            }
        }         
    }

}
</script>

<style>

</style>
