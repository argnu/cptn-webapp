<template>
    <v-container>
      <detalle-dialog 
        ref="show_detalle"
        :tipo="detalle.tipo"
        :id="detalle.id"
        :titulo="detalle.titulo"
      ></detalle-dialog>

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
                <td class="justify-center layout px-0">
                  <v-btn
                    v-if="props.item.tipo != 'exencion'"
                    small icon
                    class="mx-0"
                    title="Imprimir"
                    @click="imprimir(props.item)"
                  >
                    <v-icon color="secondary">print</v-icon>
                  </v-btn>
                </td>
                  <td>{{ props.item.fecha | fecha }}</td>
                  <td>{{ props.item.fecha_vencimiento | fecha }}</td>
                  <td>{{ props.item.descripcion }}</td>
                  <template v-if="props.item.tipo == 'boleta'">
                    <td :class="props.item.estado && props.item.estado.id == 1 ? 'red lighten-4' : ''">
                        {{ props.item.estado ? props.item.estado.valor : '' }}
                    </td>                    
                  </template>
                  <template v-else-if="props.item.tipo == 'volante'">
                    <td class="red lighten-4">
                        Vencido
                    </td>                    
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
                  <td class="justify-center layout px-0">
                    <v-btn small icon class="mx-0"  @click="verDetalle(props.item)" title="Ver Detalle">
                      <v-icon color="primary">launch</v-icon>
                    </v-btn>
                  </td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>

      <v-layout row wrap v-if="resumen.length > 0">
        <v-flex xs6>
        </v-flex>
        <v-flex xs6>
          <v-data-table
              :items="[{ t: 'Totales', d: totales_debe, h: totales_haber }, { t: 'Saldo Deudor', h: saldo_deudor }]"
              class="elevation-1"
              hide-actions
              hide-headers
          >
            <template slot="items" slot-scope="props">
              <td>{{props.item.t }}</td>
              <td v-if="props.item.d">{{props.item.d | round }}</td>
              <td v-else></td>
              <td>{{props.item.h | round }}</td>
            </template>
          </v-data-table>
        </v-flex>
      </v-layout>
    </v-container>
</template>

<script>
import api from '@/services/api'
import reports from '@/services/reports'
import * as utils from '@/utils'
import moment from 'moment'
import { Header } from '@/model'
import MatriculaDatosBasicos from '@/components/matriculas/MatriculaDatosBasicos';
import DetalleDialog from '@/components/matriculas/cuenta/detalles/DetalleDialog';
import NuevaBoleta from '@/components/matriculas/cuenta/NuevaBoleta';
import InputFecha from '@/components/base/InputFecha';
import MixinValidator from '@/components/mixins/MixinValidator';

export default {
  name: 'ResumenCuenta',
  props: ['id'],
  mixins: [MixinValidator],

  headers: [
    Header('', 'imprimir'),
    Header('Fecha', 'fecha', true),
    Header('Fecha de Venc.', 'fecha_vencimiento', true),
    Header('Descripción', 'descripcion', true),
    Header('Estado', 'estado', true),
    Header('Debe', 'debe', true),
    Header('Ha  ber', 'haber', true),
    Header('Más info', 'detalle')
  ],

  data () {
    return {
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

  computed: {
    totales_debe: function() {
      return this.resumen.length ?
        this.resumen.reduce((prev, act) => prev + (act.debe || 0), 0)
        : 0;
    },

    totales_haber: function() {
      return this.resumen.length ?
        this.resumen.reduce((prev, act) => prev + (act.haber || 0), 0)
        : 0;
    },

    saldo_deudor: function() {
      return this.totales_debe - this.totales_haber;
    },

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
      let url_volantes = `/volantespago?matricula=${this.id}&sort=+fecha_vencimiento&vencido=true`;
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
       })).concat(volantes.data.map(c => {
         c.tipo = 'volante';
        //  c.debe = c.importe_total;
         c.descripcion = `Volante de Pago N° ${c.id}`;
         return c;
       })).concat(exenciones.data.map(c => {
         c.haber = c.importe;
         c.descripcion = c.tipo.descripcion;
         c.tipo = 'exencion';
         return c;
       }));

       this.resumen = resumen;
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
  },

  components: {
    MatriculaDatosBasicos,
    DetalleDialog,
    InputFecha
  }

}
</script>

<style>
</style>
