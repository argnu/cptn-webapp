<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card class="mt-5">
        <v-card-text>
          <v-btn
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
              <td>{{ props.item.descripcion }}</td>
              <td class="justify-center layout px-0">
                <v-btn small icon class="mx-0"  @click="verDetalle(props.item.id)" title="Ver Detalle">
                  <v-icon color="primary">launch</v-icon>
                </v-btn>

                <v-btn small icon class="mx-4" @click="imprimir(props.item.id)" title="Imprimir">
                  <v-icon color="secondary">print</v-icon>
                </v-btn>
              </td>              
            </template>
          </v-data-table>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import api from '@/services/api';
import * as utils from '@/utils'
import { Header } from '@/model'
import { impresionLegajo } from '@/utils/PDFUtils'
import { getTipoLegajo } from '@/utils/legajo'

export default {

  name: 'LegajoLista',

  props: ['id'],

  headers: [
    Header('Fecha', 'fecha_solicitud', true),
    Header('Descripción', 'descripcion', true),
    Header('', 'acciones')
  ],

  data () {
    return {
      legajos: [],
      legajos_original: [],
      loading: false,
    }
  },

  watch: {
    'pagination.sortBy': function(sortBy) {
      if (sortBy) {
        if (sortBy.includes('fecha')) this.legajos = this.legajos.sort(utils.sortByFecha(sortBy));
        else if (sortBy == 'descripcion') this.legajos = this.legajos.sort(utils.sortByString(sortBy));
      }
      else this.legajos = utils.clone(this.legajos_original);
    }
  },

  created: function() {
    this.loading = true;
    api.get(`/matriculas/${this.id}/legajos`)
    .then(r => {
      this.legajos = r.data.map(l => {
       l.descripcion = `${getTipoLegajo(l.tipo)} - N° ${l.numero_legajo}`;
       return l;
      });
      this.legajos_original = utils.clone(this.legajos);
      this.loading = false;
    })
    .catch(e => console.error(e));
  },

  methods: {
    verDetalle: function(id) {
      this.$router.push({ path: `/legajos/${id}` });
    },

    nuevoLegajo: function() {
      this.$router.push({ path: `/matriculas/${this.id}/nuevo-legajo` });
    },

    imprimir: function(id) {
      Promise.all([
        api.get(`/legajos/${id}`),
        api.get('/tareas/categorias')
      ])
      .then(([legajo, categorias]) => {
        let categoria = categorias.data.find(c => c.subcategorias.find(s => s.id == legajo.data.subcategoria))
        let pdf = impresionLegajo(legajo.data, categoria);
        pdf.save(`${getTipoLegajo(legajo.data.tipo)} - N° ${legajo.data.numero_legajo}.pdf`)
      })
    }
  },

}
</script>

<style>
</style>
