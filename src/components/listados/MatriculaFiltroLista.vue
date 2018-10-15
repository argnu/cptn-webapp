<template>
<v-container class="grey lighten-3">
  <v-toolbar class="darken-3" color="primary">
    <v-toolbar-title class="white--text">Búsqueda Avanzada de Matrículas</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-layout class="mt-4">
      <v-flex xs6 class="mx-4">
        <v-select
            label="Tipo de Matrícula:"
            multiple
            :items="opciones_globales.tipos_matricula"
            v-model="filtros.tipo"
            :rules="[rules.required]"
        >
        </v-select>
      </v-flex>

      <v-flex xs6 class="mx-4">
        <v-select
            label="Estado:"
            :items="global_state.opciones.estados"
            v-model="filtros.estado"
            item-text="valor"
            item-value="id"
        >
        </v-select>
      </v-flex>
  </v-layout>

  <v-layout>
      <v-flex xs12 class="mx-4">
        <span>Permite la publicación de los datos:</span>

        <v-checkbox
            tabindex="57"
            class="mt-4"
            label="Todos"
            v-model="check_all"
            @change="toggleCheckAll"
        >
        </v-checkbox>

        <v-layout row class="mt-2">
        <v-flex xs6>
            <v-checkbox
                tabindex="58"
                label="Email"
                v-model="filtros.publicacion.email"
            ></v-checkbox>

            <v-checkbox
                tabindex="59"
                label="Celular"
                v-model="filtros.publicacion.celular"
            ></v-checkbox>
        </v-flex>

        <v-flex xs6>
            <v-checkbox
                tabindex="60"
                label="Dirección"
                v-model="filtros.publicacion.direccion"
            ></v-checkbox>

            <v-checkbox
                tabindex="61"
                label="Acervo"
                v-model="filtros.publicacion.acervo"
            ></v-checkbox>
        </v-flex>
        </v-layout>
        </v-flex>
</v-layout>

    <v-card>
        <div v-if="filtros.tipo.length > 0">
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
                :items="matriculas"
                :loading="loading"
                :pagination.sync="pagination"
                :total-items="totalItems"
                :rows-per-page-items="[25,30,35]"
            >
                <template slot="items" slot-scope="props">
                    <td>{{ props.item.numeroMatricula }}</td>
                    <td>{{ props.item.estado.valor }}</td>
                    <td>{{ props.item.entidad.apellido }}</td>
                    <td>{{ props.item.entidad.nombre }}</td>
                    <td>{{ props.item.entidad.dni }}</td>
                    <td v-html="getDomicilio(props.item.entidad.domicilios, 'real')"></td>
                    <td v-html="getDomicilio(props.item.entidad.domicilios, 'legal')"></td>
                    <td v-html="getDomicilio(props.item.entidad.domicilios, 'especial')"></td>
                    <td v-html="getTitulos(props.item.entidad.formaciones)"></td>
                    <td>{{ difusion }}</td>
                </template>
            ></v-data-table>
        </div>

        <div v-else>
            <v-alert
                :value="true"
                type="info"
            >
                Debe seleccionar al menos un tipo de matrícula
            </v-alert>
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
import reports from '@/services/reports'
import { ColumnHeader } from '@/model'

import MixinValidator from '@/components/mixins/MixinValidator'
import MixinGlobalState from '@/components/mixins/MixinGlobalState'


export default {
    name: 'MatriculaFiltroLista',

    mixins: [MixinGlobalState, MixinValidator],

    headers: [
        ColumnHeader('N°', 'numero'),
        ColumnHeader('Estado', 'estado'),
        ColumnHeader('Apellido', 'apellido'),
        ColumnHeader('Nombre', 'nombre'),
        ColumnHeader('DNI', 'dni'),
        ColumnHeader('Domicilio Real', 'dom_real'),
        ColumnHeader('Domicilio Legal', 'dom_legal'),
        ColumnHeader('Domicilio Especial', 'dom_esp'),
        ColumnHeader('Titulos', 'titulos'),
        ColumnHeader('Difusión', 'difusion')
    ],

    data() {
        return {
            matriculas: [],
            check_all: true,
            filtros: {
                tipo: ['TECA'],
                estado: '',
                publicacion: {
                    email: true,
                    celular: true,
                    direccion: true,
                    acervo: true
                }
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

    computed: {
        difusion: function() {
            return Object.keys(this.filtros.publicacion)
            .filter(k => this.filtros.publicacion[k])
            .join(', ')
        }
    },

    created: function() {
        this.debouncedUpdate = _.debounce(this.update, 600, {
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

            let url = `/matriculas?limit=${limit}&offset=${offset}`;
            if (this.filtros.estado) url += `&estado=${this.filtros.estado}`;
            if (this.filtros.tipo.length === 1) url += `&tipo=${this.filtros.tipo[0]}`;
            else if (this.filtros.tipo.length > 1) {
                for(let tipo of this.filtros.tipo)
                    url += `&tipo[]=${tipo}`;
            }
            url += `&solicitud[publicarEmail]=${this.filtros.publicacion.email === true}`;
            url += `&solicitud[publicarAcervo]=${this.filtros.publicacion.acervo === true}`;
            url += `&solicitud[publicarDireccion]=${this.filtros.publicacion.direccion === true}`;
            url += `&solicitud[publicarCelular]=${this.filtros.publicacion.celular === true}`;

            if (this.pagination.sortBy) {
                url += `&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;
            }

            api.get(url)
            .then(r => {
                this.loading = false;
                this.matriculas = r.data.resultados;
                this.totalItems = r.data.totalQuery;
            })
            .catch(e => {
                console.error(e);
            })
        },

        getTitulos: function(titulos) {
            return titulos.map(t => `${t.titulo.nombre} (${t.titulo.nivel.valor})`).join('<br>');

        },

        getDomicilio: function(domicilios, tipo) {
            let dom = domicilios.find(d => d.tipo == tipo);
            if (!dom) return '';
            else return `${dom.domicilio.direccion}
            <br>
            Localidad: ${dom.domicilio.localidad.nombre} (${dom.domicilio.provincia.nombre})`;
        },

        exportar: function() {
            this.global_state.cursor_wait = true;
            let tabla = this.$refs.tabla_export;

            let url = `/matriculas?`;
            if (this.filtros.estado) url += `&estado=${this.filtros.estado}`;
            if (this.filtros.tipo.length === 1) url += `&tipo=${this.filtros.tipo[0]}`;
            else if (this.filtros.tipo.length > 1) {
                for(let tipo of this.filtros.tipo)
                    url += `&tipo[]=${tipo}`;
            }
            url += `&solicitud[publicarEmail]=${this.filtros.publicacion.email === true}`;
            url += `&solicitud[publicarAcervo]=${this.filtros.publicacion.acervo === true}`;
            url += `&solicitud[publicarDireccion]=${this.filtros.publicacion.direccion === true}`;
            url += `&solicitud[publicarCelular]=${this.filtros.publicacion.celular === true}`;

            if (this.pagination.sortBy) {
                url += `&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;
            }

            api.get(url)
            .then(r => {
                let rows = '';
                for(let matricula of r.data.resultados) {
                    rows += `
                    <tr>
                        <td>${ matricula.numeroMatricula }</td>
                        <td>${ matricula.estado.valor }</td>
                        <td>${ matricula.entidad.apellido }</td>
                        <td>${ matricula.entidad.nombre }</td>
                        <td>${ matricula.entidad.dni }</td>
                        <td>${ this.getDomicilio(matricula.entidad.domicilios, 'real') }</td>
                        <td>${ this.getDomicilio(matricula.entidad.domicilios, 'legal') }</td>
                        <td>${ this.getDomicilio(matricula.entidad.domicilios, 'especial') }</td>
                        <td>${ this.getTitulos(matricula.entidad.formaciones) }</td>
                        <td>${ this.difusion }</td>
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

        toggleCheckAll: function() {
            this.filtros.publicacion.email = this.check_all;
            this.filtros.publicacion.celular = this.check_all;
            this.filtros.publicacion.direccion = this.check_all;
            this.filtros.publicacion.acervo = this.check_all;
        }
    }

}
</script>

<style>

</style>
