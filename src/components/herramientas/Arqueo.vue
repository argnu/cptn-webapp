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
            clearable
            autocomplete
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
import { debounce } from 'lodash'
import api from '@/services/api'
import reports from '@/services/reports'
import { ColumnHeader } from '@/model'
import InputFecha from '@/components/base/InputFecha'
import MixinGlobalState from '@/components/mixins/MixinGlobalState'

export default {
    name: 'Arqueo',

    mixins: [MixinGlobalState],

    components: {
        InputFecha
    },

    headers: [
        ColumnHeader('N° Recibo', 'numero', true),
        ColumnHeader('N° Matrícula', 'matricula.numero', true),
        ColumnHeader('Detalle Matrícula', 'detalle_matricula'),
        ColumnHeader('Importe', 'importe_total', true, 'right')
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
        this.debouncedUpdate = debounce(this.update, 800);

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
            this.loading = true;
            let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
            let limit = this.pagination.rowsPerPage;

            let url = `/comprobantes?limit=${limit}&offset=${offset}`;
            url += `&fecha[desde]=${this.filtros.fecha_desde}`
            url += `&fecha[hasta]=${this.filtros.fecha_hasta}`;
            if (this.filtros.delegacion) url += `&delegacion=${this.filtros.delegacion}`;

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
        },

        exportar: function() {
            reports.open({
                'jsp-source': 'arqueo_diario.jasper',
                'jsp-format': 'PDF',
                'jsp-output-file': `Arqueo - ${Date.now()}`,
                'jsp-only-gen': false,
                'fecha_inicio': moment(this.filtros.fecha_desde, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                'fecha_fin': moment(this.filtros.fecha_hasta, 'DD/MM/YYYY').format('YYYY-MM-DD'),
                'delegacion': this.filtros.delegacion || 0
            });
        }
    }

}
</script>

<style>

</style>
