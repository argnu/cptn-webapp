<template>
    <v-container>
      <v-layout row wrap class="mt-4">
        <v-flex xs1 class="mt-5 mx-5">
          <b>Filtrar:</b>
        </v-flex>
        <v-flex xs4 class="ma-4">
          <input-fecha label="Fecha Desde" v-model="filtros.fecha_desde"></input-fecha>
        </v-flex>
        <v-flex xs4 class="ma-4">
          <input-fecha label="Fecha Hasta" v-model="filtros.fecha_hasta"></input-fecha>
        </v-flex>
      </v-layout>

      <v-layout row wrap>
        <v-flex xs12>
          <v-data-table
              :headers="$options.headers"
              :items="resumen"
              class="elevation-1"
              :no-data-text="loading ? '' : 'No hay datos'"
              :no-results-text="loading ? '' : 'No hay datos'"
              :rows-per-page-items="[25,30,35]"
              :pagination.sync="pagination"
              :loading="loading"
          >
            <template slot="items" slot-scope="props">
              <tr>
                <td class="justify-center layout px-0">
                  <v-btn small icon class="mx-0" title="Ver Detalle" @click="expand(props.index)">
                    <v-icon color="primary">{{ paneles[props.index] ? 'expand_less' : 'expand_more' }}</v-icon>
                  </v-btn>
                </td>

                <td>
                  {{ props.item.fecha | fecha }}
                </td>
                <td>{{ props.item.fecha_vencimiento | fecha }}</td>
                <td>{{ props.item.descripcion }}</td>

                  <template v-if="props.item.tipo == 'boleta'">
                    <td :class="props.item.estado && props.item.estado.id == 1 ? 'red lighten-4' : ''">
                        {{ props.item.estado ? props.item.estado.valor : '' }}
                    </td>
                  </template>
                  <template v-else-if="props.item.tipo == 'volante'">
                    <td class="red lighten-4">
                        {{ props.item.vencido ? 'Vencido' : 'Anulado' }}
                    </td>
                  </template>
                  <template v-else-if="props.item.tipo == 'comprobante' && props.item.anulado == 1">
                    <td>Anulado</td>
                  </template>
                  <template v-else>
                    <td></td>
                  </template>

                  <td>
                    <span v-if="props.item.debe">
                      {{ props.item.debe | round }}
                    </span>
                  <td>
                    <span v-if="props.item.haber">
                      {{ props.item.haber | round }}
                    </span>
                  </td>

                  <td>
                    <v-menu>
                      <v-btn icon slot="activator">
                        <v-icon class="blue--text">more_vert</v-icon>
                      </v-btn>

                      <v-list>
                        <v-list-tile
                          v-if="props.item.tipo != 'exencion'"
                          title="Imprimir"
                          @click="imprimir(props.item)"
                        >
                          <v-icon class="mr-2" color="secondary">print</v-icon>
                          Imprimir
                        </v-list-tile>

                        <v-list-tile
                          v-if="props.item.estado && props.item.estado.id == 1 || !props.item.anulado"
                          title="Anular"
                          @click="anular(props.item)"
                        >
                          <v-icon class="mr-2" color="error">cancel_presentation</v-icon>
                          Anular
                        </v-list-tile>
                      </v-list>
                    </v-menu>
                  </td>

                </tr>
                <tr>
                  <td colspan="8" v-show="paneles[props.index]">
                    <v-expansion-panel class="my-4">
                      <v-expansion-panel-content :value="paneles[props.index]">
                        <v-card>
                        <template v-if="props.item.tipo == 'boleta'">
                          <detalle-boleta :id="props.item.id"></detalle-boleta>
                        </template>
                        <template v-else-if="props.item.tipo == 'comprobante'">
                          <detalle-comprobante :id="props.item.id"></detalle-comprobante>
                        </template>
                        <template v-else-if="props.item.tipo == 'volante'">
                          <detalle-volante-pago :id="props.item.id"></detalle-volante-pago>
                        </template>
                        <template v-else-if="props.item.tipo == 'exencion'">
                          <detalle-exencion :id="props.item.id"></detalle-exencion>
                        </template>
                        </v-card>
                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </td>
                </tr>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
import Vue from 'vue'
import api from '@/services/api'
import reports from '@/services/reports'
import * as utils from '@/utils'
import moment from 'moment'
import { ColumnHeader } from '@/model'
import MatriculaDatosBasicos from '@/components/matriculas/MatriculaDatosBasicos';
import DetalleBoleta from '@/components/matriculas/cuenta/detalles/DetalleBoleta'
import DetalleComprobante from '@/components/matriculas/cuenta/detalles/DetalleComprobante'
import DetalleVolantePago from '@/components/matriculas/cuenta/detalles/DetalleVolantePago'
import DetalleExencion from '@/components/matriculas/cuenta/detalles/DetalleExencion'
import NuevaBoleta from '@/components/matriculas/cuenta/NuevaBoleta';
import InputFecha from '@/components/base/InputFecha';
import MixinValidator from '@/components/mixins/MixinValidator';
import MixinGlobalState from '@/components/mixins/MixinGlobalState'

export default {
  name: 'ResumenCuenta',
  props: ['id'],

  mixins: [MixinGlobalState, MixinValidator],

  components: {
    MatriculaDatosBasicos,
    DetalleExencion,
    DetalleBoleta,
    DetalleComprobante,
    DetalleVolantePago,
    InputFecha
  },

  headers: [
    ColumnHeader('+', 'detalle'),
    ColumnHeader('Fecha', 'fecha', true),
    ColumnHeader('Fecha de Venc.', 'fecha_vencimiento', true),
    ColumnHeader('Descripción', 'descripcion', true),
    ColumnHeader('Estado', 'estado', true),
    ColumnHeader('Deudor', 'debe', true),
    ColumnHeader('Acre.', 'haber', true),
    ColumnHeader('', 'acciones')
  ],

  data () {
    return {
      paneles: [],
      resumen: [],
      resumen_original: [],
      boletas: [],
      show_detalle: false,
      item_selected: null,
      loading: false,
      pagination: {
        sortBy: 'fecha',
        descending: true
      },
      filtros: {
        fecha_desde: moment().startOf('year').format("DD/MM/YYYY"),
        fecha_hasta: moment().endOf('year').format("DD/MM/YYYY")
      },
      detalle: {
        id: null,
        tipo: null,
        titulo: ''
      }
    }
  },

  watch: {
    filtros: {
      handler () {
        if ( (this.rules.fecha(this.filtros.fecha_desde) === true
                || !this.filtros.fecha_desde.length)
          && ( this.rules.fecha(this.filtros.fecha_hasta) === true
            || !this.filtros.fecha_hasta.length)
          )
          this.updateBoletas();
      },
      deep: true
    },

    'pagination.sortBy': function(sortBy) {
      if (sortBy) {
        if (sortBy.includes('fecha')) this.resumen = this.resumen.sort(utils.sortByFecha(sortBy));
        else if (sortBy == 'debe' || sortBy == 'haber') this.resumen = this.resumen.sort(utils.sortByNumber(sortBy));
        else this.resumen = this.resumen.sort(utils.sortByString(sortBy));
      }
      else this.resumen = utils.clone(this.resumen_original);
    }
  },

  created: function() {
    this.updateBoletas();
  },

  methods: {
    updateBoletas: function() {
      this.loading = true;
      let url_boletas = `/boletas?matricula=${this.id}&sort=+fecha_vencimiento`;
      let url_comprobantes = `/comprobantes?matricula=${this.id}&sort=+fecha_vencimiento`;
      let url_volantes = `/volantespago?matricula=${this.id}&sort=+fecha_vencimiento`;
      let url_exenciones = `/comprobantes-exenciones?matricula=${this.id}&sort=+fecha`;

      if (this.rules.fecha(this.filtros.fecha_desde)) {
        url_boletas += `&fecha_desde=${this.filtros.fecha_desde}`;
        url_comprobantes  += `&fecha_vencimiento[desde]=${this.filtros.fecha_desde}`;
        url_volantes  += `&fecha_vencimiento[desde]=${this.filtros.fecha_desde}`;
        url_exenciones  += `&fecha_desde=${this.filtros.fecha_desde}`;
      }

      if (this.rules.fecha(this.filtros.fecha_hasta)) {
        url_boletas += `&fecha_vencimiento[hasta]=${this.filtros.fecha_hasta}`;
        url_comprobantes += `&fecha_hasta=${this.filtros.fecha_hasta}`;
        url_volantes += `&fecha_vencimiento[hasta]=${this.filtros.fecha_hasta}`;
        url_exenciones += `&fecha_hasta=${this.filtros.fecha_hasta}`;
      }

      Promise.all([
        api.get(url_boletas),
        api.get(url_comprobantes),
        api.get(url_volantes),
        api.get(url_exenciones)
      ])
     .then(([boletas, comprobantes, volantes, exenciones]) => {
       //Sólo volantes vencidos o anulados
       volantes = volantes.data.filter(v => v.vencido || v.estado.id == 11);

       let resumen = boletas.data.map(b => {
         b.tipo = 'boleta';
         b.debe = b.total;
         b.descripcion = b.items[0].descripcion;
         return b;
       }).concat(comprobantes.data.resultados.map(c => {
         c.tipo = 'comprobante';
         c.haber = c.importe_cancelado;
         c.descripcion = `Recibo N° ${c.numero}`;
         return c;
       })).concat(volantes.map(c => {
         c.tipo = 'volante';
         c.debe = c.importe_total;
         c.descripcion = `Volante de Pago N° ${c.id}`;
         return c;
       })).concat(exenciones.data.map(c => {
         c.haber = c.importe;
         c.descripcion = c.tipo.descripcion;
         c.tipo = 'exencion';
         return c;
       }));

       this.resumen = resumen;
       this.paneles = resumen.map(r => false);
       this.resumen_original = utils.clone(resumen);
       this.resumen = this.resumen.sort(utils.sortByFecha('fecha_vencimiento'));
       this.loading = false;
     })
     .catch(e => console.error(e));
    },

    verDetalle: function(item) {
      this.detalle = {
        titulo: item.descripcion,
        id: item.id,
        tipo: item.tipo
      }
      this.$refs.show_detalle.mostrar();
    },

    imprimir(item) {
      let nombre_reporte = item.tipo;
      let param_id = 'boleta_id';
      let titulo = 'Boleta';
      let numero = item.numero

      if (item.tipo == 'volante') {
        titulo = 'Volante de Pago';
        param_id = 'volante_id';
        numero = item.id;
      }
      else if (item.tipo == 'comprobante') {
        nombre_reporte = 'recibo';
        param_id = 'recibo_id';
        titulo = 'Recibo';
      }

      reports.open({
        'jsp-source': `${nombre_reporte}.jasper`,
        'jsp-format': 'PDF',
        'jsp-output-file': `${titulo} N° ${numero} - ${Date.now()}`,
        'jsp-only-gen': false,
        [param_id]: item.id
      });
    },

    expand: function(index) {
      Vue.set(this.paneles, index, !this.paneles[index]);
    },

    anular: function(item) {
      let tipo = item.tipo == 'boleta' ? 'la boleta' : 'el recibo';

      if (confirm(`Está segura/o que desea anular ${tipo}?`)) {
        if (item.tipo == 'boleta') {
          api.patch(`/boletas/${item.id}`, {
            estado: 11
          })
          .then(r => {
            this.updateBoletas();
            this.global_state.snackbar.msg = 'Boleta anulada exitosamente!';
            this.global_state.snackbar.color = 'success';
            this.global_state.snackbar.show = true;
          })
          .catch(e => {
            this.submit_cambio = false;
            let msg = (!e.response || e.response.status == 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.msg;
            this.global_state.snackbar.msg = msg;
            this.global_state.snackbar.color = 'error';
            this.global_state.snackbar.show = true;
            console.error(e)
          });
        }
        else if (item.tipo == 'comprobante') {
          api.post(`/comprobantes/${item.id}/anular`)
          .then(r => {
            this.updateBoletas();
            this.global_state.snackbar.msg = 'Recibo anulado exitosamente!';
            this.global_state.snackbar.color = 'success';
            this.global_state.snackbar.show = true;
          })
          .catch(e => {
            let msg = (!e.response || e.response.status == 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.msg;
            this.global_state.snackbar.msg = msg;
            this.global_state.snackbar.color = 'error';
            this.global_state.snackbar.show = true;
            console.error(e)
          });
        }
      }
    }
  }

}
</script>

<style>
</style>
