<template>
<v-container>
  <v-layout row>
    <v-flex xs4 class="mx-4">
        <v-select
          :items="[]"
          v-model="filtros.tipo"
          label="Tipo"
          @input="updateList"
          clearable
        ></v-select>
    </v-flex>

    <v-flex xs4 class="mx-4">
        <v-text-field
          v-model="filtros.nomenclatura"
          label="Nomenclatura"
          @input="updateList"
          clearable
        ></v-text-field>

        <v-text-field
          v-model="filtros.numero"
          label="N°"
          @input="updateList"
          clearable
        ></v-text-field>
    </v-flex>

    <v-flex xs4 class="mx-4">
        <v-text-field
          v-model="filtros.comitente.nombre"
          label="Nombre Comitente"
          @input="updateList"
          clearable
        ></v-text-field>

        <v-text-field
          v-model="filtros.comitente.apellido"
          label="Apellido Comitente"
          @input="updateList"
          clearable
        ></v-text-field>
    </v-flex>
  </v-layout>

  <v-layout row wrap>
    <v-flex xs12>
      <v-card class="mt-5">
        <v-card-text>
          <v-btn
            v-if="showAdd"
            absolute dark fab top right
            color="green"
            @click="nuevoLegajo"
          >
            <v-icon>add</v-icon>
          </v-btn>
          <v-data-table
              :headers="$options.headers"
              :items="legajos"
              no-data-text=""
              :rows-per-page-items="[25,30,35]"
              :loading="loading"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.fecha_solicitud | fecha }}</td>
              <td>{{ props.item.tipo.valor }}</td>
              <td>{{ props.item.numero_legajo }}</td>
              <td>{{ props.item.nomenclatura }}</td>
              <td>{{ props.item.comitentes | lista_comitentes }}</td>
              <td class="justify-center layout px-0">
                <v-btn small icon class="mx-0" @click="imprimir(props.item.id)" title="Imprimir">
                  <v-icon color="secondary">print</v-icon>
                </v-btn>

                <v-btn small icon class="mx-4"  @click="verDetalle(props.item.id)" title="Ver Detalle">
                  <v-icon color="primary">launch</v-icon>
                </v-btn>
              </td>
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</v-container>
</template>

<script>
import api from '@/services/api';
import reports from '@/services/reports'
import * as utils from '@/utils'
import { Header } from '@/model'

export default {

  name: 'LegajoLista',

  props: {
    id: Number,
    showAdd: Boolean
  },

  headers: [
    Header('Fecha', 'fecha_solicitud', true),
    Header('Tipo', 'tipo', true),
    Header('N°', 'numero', true),
    Header('Nomenclatura', 'nomenclatura', true),
    Header('Comitentes', 'comitentes'),
    Header('', 'acciones')
  ],

  filters: {
    lista_comitentes: function(lista) {
      return lista.map(c => `${c.persona.nombre} ${c.persona.tipo == 'fisica' ? c.persona.apellido : ''}`)
                  .join(', ');
    }
  },

  data () {
    return {
      legajos: [],
      loading: false,

      filtros: {
        fecha_desde: '',
        fecha_hasta: '',
        numero: '',
        nomenclatura: '',
        tipo: '',
        comitente: {
          cuit: '',
          apellido: '',
        },
      },

      pagination: {
          page: 1,
          rowsPerPage: 25,
          descending: null,
          sortBy: null
      },

      debouncedUpdate: null,
    }
  },


  watch: {
    filtros: {
      handler() {
        this.pagination.page = 1;
        this.updateLegajos();
      },
      deep: true,
      inmediate: true
    },

    pagination: {
      handler() {
        this.updateLegajos();
      },
      deep: true,
      inmediate: true
    }
  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.updateLegajos, 600, {
      'maxWait': 1000
    });
    this.updateLegajos();
  },

  methods: {
    updateList: function() {
      this.debouncedUpdate();
    },

    updateLegajos: function() {
      this.loading = true;
      this.legajo = [];
      let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
      let limit = this.pagination.rowsPerPage;
      let url = `/matriculas/${this.id}/legajos?&limit=${limit}&offset=${offset}`;

      if (this.filtros.numero) url += `&numero=${this.filtros.numero}`;
      if (this.filtros.nomenclatura) url += `&nomenclatura=${this.filtros.nomenclatura}`;
      if (this.filtros.comitente) {
        for(let f in this.filtros.comitente) {
          if (this.filtros.comitente[f]) url += `&comitente[${f}]=${this.filtros.comitente[f]}`;
        }
      }

      if (this.pagination.sortBy) url+=`&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;

      api.get(url)
      .then(r => {
        this.legajos = r.data;
        this.loading = false;
      })
      .catch(e => console.error(e));
    },

    verDetalle: function(id) {
      this.$router.push({ path: `/legajos/${id}` });
    },

    nuevoLegajo: function() {
      this.$router.push({ path: `/matriculas/${this.id}/nuevo-legajo` });
    },

    imprimir: function(id) {
      reports.open({
        'jsp-source': 'legajos_tecnicos.jasper',
        'jsp-format': 'PDF',
        'jsp-output-file': `Legajo Técnico ${id} - ${Date.now()}`,
        'jsp-only-gen': false,
        'legajo_id': id
      });
    }
  },

}
</script>

<style>
</style>
