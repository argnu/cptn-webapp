<template>
<v-container>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card class="mt-5">
        <v-card-text>
          <!--Solo si el estado es habilitado!-->
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
              <td>{{ props.item.descripcion }}</td>
              <td class="justify-center layout px-0">
                <v-btn small icon class="mx-0" @click="imprimir(props.item)" title="Imprimir">
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
import reports from '@/services/reports';
import * as utils from '@/utils'
import { Header } from '@/model'
import { getTipoLegajo } from '@/utils/legajo'

export default {

  name: 'LegajoLista',

  props: {
    id: Number, 
    showAdd: Boolean
  },

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

    imprimir: function(legajo) {
      reports.open({
        'jsp-source': 'legajos_tecnicos.jasper',
        'jsp-format': 'PDF',
        'jsp-output-file': `Legajo N° ${legajo.numero_legajo} - ${Date.now()}`,
        'jsp-only-gen': false,
        'legajo_id': legajo.id
      });
    }
  },

}
</script>

<style>
</style>
