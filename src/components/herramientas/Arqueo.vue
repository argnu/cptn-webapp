<template>
<v-container class="grey lighten-3">
  <v-toolbar class="darken-3" color="primary">
    <v-toolbar-title class="white--text">Arqueo</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-layout class="mt-4">
      <v-flex xs4 class="mx-4">
        <input-fecha
            label="Fecha Desde:"
            v-model="filtros.fecha_desde"
            @change="updateList"
        ></input-fecha>
      </v-flex>

      <v-flex xs4 class="mx-4">
        <input-fecha
            label="Fecha Hasta:"
            v-model="filtros.fecha_hasta"
            @change="updateList"
        ></input-fecha>
      </v-flex>

      <v-flex xs4 class="mx-4">
        <v-select
            label="Delegación:"
            v-model="filtros.delegacion"
            :items="delegaciones"
            item-text="nombre"
            item-value="id"
            @change="updateList"
        ></v-select>
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
            :items="comprobantes"
            :loading="loading"
            :pagination.sync="pagination"
            :total-items="totalItems"
            :rows-per-page-items="[25,30,35]"
        >
            <template slot="items" slot-scope="props">
                <td>{{ props.item.numero }}</td>
                <td>{{ props.item.matricula.numero }}</td>
                <td>{{ props.item.matricula | detalle_matricula }}</td>
                <td style="text-align:right">{{ props.item.importe_total }}</td>
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
import * as _ from 'lodash'
import * as utils from '@/utils'
import api from '@/services/api'
import { Header } from '@/model'
import InputFecha from '@/components/base/InputFecha'

export default {
    name: 'Arqueo',

    components: {
        InputFecha
    },

    headers: [
        Header('N° Recibo', 'numero', true),
        Header('N° Matrícula', 'matricula.numero', true),
        Header('Detalle Matrícula', 'detalle_matricula'),
        Header('Importe', 'importe_total', true, 'right')
    ],

    filters: {
        detalle_matricula: function(matricula) {
            if (!matricula) return '';
            return `${matricula.entidad.nombre} ${matricula.entidad.apellido || ''}`
        }
    },

    data() {
        return {
            delegaciones: [],
            comprobantes: [],
            filtros: {
                fecha_desde: moment().format('DD/MM/YYYY'),
                fecha_hasta: moment().format('DD/MM/YYYY'),
                delegacion: null
            },
            pagination: {
                descending: null,
                sortBy: null,
                page: 1,
                rowsPerPage: 25
            },
            totalItems: 0,
            loading: false,
            debouncedUpdate: null
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
        this.debouncedUpdate = _.debounce(this.update, 600, {
            'maxWait': 1000
        });

        api.get('/delegaciones')
        .then(r => {
            this.delegaciones = r.data;
            this.filtros.delegacion = this.global_state.delegacion.id;
        })
    },

    methods: {
        updateList: function() {
            this.debouncedUpdate();
        },

        update: function() {
            if (this.filtros.delegacion) {
                this.loading = true;
                let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
                let limit = this.pagination.rowsPerPage;

                let url = `/comprobantes?limit=${limit}&offset=${offset}`;
                url += `&fecha[desde]=${this.filtros.fecha_desde}`
                url += `&fecha[hasta]=${this.filtros.fecha_hasta}`;
                url += `&delegacion=${this.filtros.delegacion}`;

                if (this.pagination.sortBy) {
                    url += `&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;
                }

                api.get(url)
                .then(r => {
                    this.loading = false;
                    this.comprobantes = r.data.resultados;
                    this.totalItems = r.data.totalQuery;
                })
                .catch(e => {
                    console.error(e);
                })
            }
        },

        exportar: function() {
            this.global_state.cursor_wait = true;
            let tabla = this.$refs.tabla_export;
            let url = `/comprobantes?`;
            url += `&fecha[desde]=${this.filtros.fecha_desde}`
            url += `&fecha[hasta]=${this.filtros.fecha_hasta}`;
            url += `&delegacion=${this.filtros.delegacion}`;

            if (this.pagination.sortBy) {
                url += `&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;
            }

            api.get(url)
            .then(r => {
                let rows = '';
                let total = 0;
                for(let comprobante of r.data.resultados) {
                    rows += `
                    <tr>
                        <td style="mso-number-format:'0'">${comprobante.numero}</td>
                        <td style="mso-number-format:'\@'">${comprobante.matricula.numero}</td>
                        <td style="mso-number-format:'\@';white-space:nowrap;">${this.$options.filters.detalle_matricula(comprobante.matricula)}</td>
                        <td style="mso-number-format:'0\.00';text-align:right">${comprobante.importe_total.toString().replace('.', ',')}</td>
                    </tr>
                    `;
                    total += comprobante.importe_total;
                }

                rows += `
                    <tr>
                        <td colspan="3" style="text-align:right"><b>Total</b></td>
                        <td style="mso-number-format:'0\.00';text-align:right">${utils.round(total, 2).toString().replace('.', ',')}</td>
                    </tr>
                    `;

                tabla.getElementsByTagName('tbody')[0].innerHTML = rows;
                utils.download(`Arqueo (${this.filtros.fecha_desde.replace(/\//g, '-')} a ${this.filtros.fecha_hasta.replace(/\//g, '-')}).xlsx`,
                    'data:application/vnd.ms-excel;base64,' + btoa(tabla.outerHTML));
                this.global_state.cursor_wait = false;
            })
            .catch(e => {
                console.error(e);
            })
        }
    }

}
</script>

<style>

</style>
