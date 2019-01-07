<template>
  <v-container>

    <v-layout row class="my-4" v-if="botonNueva">
      <v-flex xs12>
        <v-btn class="green" dark @click="showAddBoleta">
          <v-icon class="mr-2">add</v-icon>
          Nueva Boleta
        </v-btn>
      </v-flex>
    </v-layout>

    <v-layout row wrap>
      <v-flex xs9>
        <v-data-table
            :loading="loading"
            :headers="$options.headers"
            :items="boletas"
            class="elevation-1"
            :rows-per-page-items="[25,30,35]"
            :no-data-text="loading ? '' : 'No hay deudas pendientes'"
            :no-results-text="loading ? '' : 'No hay deudas pendientes'"
        >
          <template slot="items" slot-scope="props">
              <td class="justify-center layout px-0">
                <v-checkbox v-model="props.item.checked"></v-checkbox>
              </td>
              <td>{{ props.item.fecha | fecha }}</td>
              <td>{{ props.item.fecha_vencimiento | fecha }}</td>
              <td>
                {{ props.item.descripcion }}
                <template v-if="props.item.tipo_comprobante && props.item.tipo_comprobante.id == 20 && props.item.legajo">
                  <br>
                  Nomenclatura: {{ props.item.legajo.nomenclatura }}
                  <br>
                  Comitentes: {{ props.item.legajo.comitentes | lista_comitentes }}
                </template>
              </td>
              <td>${{ props.item.total | round }}</td>
              <td>${{ props.item.interes | round }}</td>

              <td>
                <v-menu>
                  <v-btn icon slot="activator">
                    <v-icon class="blue--text">more_vert</v-icon>
                  </v-btn>

                  <v-list>
                    <v-list-tile
                      v-if="props.item.tipo == 'volante'"
                      small icon
                      class="mx-0"
                      title="Imprimir"
                      @click="imprimir(props.item)"
                    >
                      <v-icon class="mr-2" color="secondary">print</v-icon>
                      Imprimir
                    </v-list-tile>

                    <v-list-tile
                      title="Anular"
                      @click="anular(props.item)"
                    >
                      <v-icon class="mr-2" color="error">cancel_presentation</v-icon>
                      Anular
                    </v-list-tile>
                  </v-list>
                </v-menu>
              </td>
          </template>
        </v-data-table>
      </v-flex>

      <v-flex xs3 v-if="boletas.length">
        <input-fecha
          class="ml-5"
          label="Fecha de Pago"
          v-model="fecha_pago"
          @input="updateIntereses"
        >
        </input-fecha>

        <v-text-field
          class="mx-5"
          label="Subtotal"
          :value="subtotal"
          prefix="$"
          readonly
        >
        </v-text-field>

        <v-text-field
          class="mx-5"
          label="Intereses"
          :value="intereses_total"
          prefix="$"
          readonly
        >
        </v-text-field>

        <v-text-field
          class="mx-5"
          label="Bonificación"
          :value="bonificacion_total"
          prefix="$"
          readonly
        >
        </v-text-field>

        <v-text-field
          class="mx-5"
          label="Importe Total"
          :value="importe_total"
          prefix="$"
          readonly
        >
        </v-text-field>

        <v-layout row>
          <v-flex xs6 class="mx-4">
            <v-btn
              dark
              color="primary"
              class="darken-1"
              style="width:100%"
              @click="generarVolante"
            >
              Volante Pago
            </v-btn>
          </v-flex>
          <v-flex xs6 class="mx-1">
            <v-btn
              color="primary"
              class="darken-1"
              style="width:100%"
              @click="expand_pago = true"
              :disabled="boletas_selected.length == 0"
            >Pagar</v-btn>
          </v-flex>
        </v-layout>

      </v-flex>
    </v-layout>

    <br>

    <v-dialog v-model="expand_pago" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title class="white--text">Recibo de Pago</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="cerrarVentanaPago">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <cobranza
          ref="cobranza"
          :fecha="fecha_pago"
          :importe="importe_total"
          @cancelar="expand_pago = false"
          @aceptar="pagar"
        >
        </cobranza>
      </v-card>
    </v-dialog>


    <v-dialog v-model="show_addboleta" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title class="white--text">Nueva Boleta</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="show_addboleta = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>

        <nueva-boleta
          :id-matricula="id"
          @cancelar="show_addboleta = false"
          @update="nuevaBoleta"
        ></nueva-boleta>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import api from '@/services/api'
import reports from '@/services/reports'
import moment from 'moment'
import { clone, calculoIntereses, round, getFecha, sortByFecha } from '@/utils'
import { ColumnHeader } from '@/model'
import InputFecha from '@/components/base/InputFecha'
import Cobranza from '@/components/cobranzas/Cobranza'
import NuevaBoleta from '@/components/matriculas/cuenta/NuevaBoleta'
import MixinGlobalState from '@/components/mixins/MixinGlobalState'


export default {
  name: 'DeudasPendientes',

  props: ['id', 'botonNueva'],

  mixins: [MixinGlobalState],

  components: {
    InputFecha,
    Cobranza,
    NuevaBoleta
  },

  headers: [
    ColumnHeader('Sel.', 'check'),
    ColumnHeader('Fecha', 'fecha', true),
    ColumnHeader('Fecha de Venc.', 'fecha_vencimiento', true),
    ColumnHeader('Descripción', 'descripcion'),
    ColumnHeader('Importe', 'total'),
    ColumnHeader('Intereses', 'interes'),
    ColumnHeader('Bonificacion', 'bonificacion'),
    ColumnHeader('', 'acciones')
  ],

  data () {
    return {
      boletas: [],
      boletas_original: [],
      fecha_pago: moment().format('DD/MM/YYYY'),
      expand_pago: false,
      show_addboleta: false,
      loading: false,
      pagination: {
        sortBy: 'fecha_vencimiento',
        descending: false
      },
      interes_tasa: 2.8,
      interes_dias: 30,
      derecho_anual: 0,
    }
  },

  filters: {
    tipo_boleta: function(str) {
      if (str == 'boleta') return 'Boleta';
      if (str == 'volante') return 'Volante de Pago';
      return '';
    },

    lista_comitentes: function(lista) {
      return lista.map(c => `${c.persona.nombre} ${c.persona.tipo == 'fisica' ? c.persona.apellido : ''}`)
                  .join(', ');
    }
  },

  computed: {
    subtotal: function() {
      if (!this.boletas.length) return 0;
      let suma = this.boletas.reduce((prev, act) => {
        let num = act.tipo == 'boleta' ? act.total : act.subtotal - act.bonificacion_total;
        return prev + (act.checked ? num : 0);
      }, 0);
      return round(suma, 2);
    },

    intereses_total: function() {
      if (!this.boletas.length) return 0;
      let suma = this.boletas.reduce((prev, act) => {
        let num = act.tipo == 'boleta' ? act.interes : act.interes_total;
        return prev + (act.checked ? num : 0);
      }, 0);
      return round(suma, 2);
    },

    bonificacion_total: function() {
      if (!this.boletas_selected.length) return 0;
      let boletas_filter = this.boletas_selected.filter(b => {
        let anio = moment(b.fecha, 'YYYY-MM-DD').year();
        return (b.tipo_comprobante && b.tipo_comprobante.id == 16) && anio == new Date().getFullYear();
      });
      
      let fecha_limite_bonificacion = moment('2019-04-01', 'YYYY-MM-DD');
      if (boletas_filter.length == 12 && moment().isBefore(fecha_limite_bonificacion)) 
        return (this.derecho_anual/12) * 2;
      else 
        return 0;
    },

    importe_total: function() {
      return round(this.subtotal + this.intereses_total - this.bonificacion_total, 2);
    },

    boletas_selected: function() {
      return this.boletas.filter(b => b.checked);
    }
  },

  created: function() {
    Promise.all([
        api.get('/valores-globales?variable=3'), //Recupero tasa de interes(id=3) válido en la fecha
        api.get('/valores-globales?variable=4'),    //Recupero día de interés(id=4) válido en la fecha
        api.get('/valores-globales?variable=5')    //Recupero derecho anual
    ])
    .then(r => {
      this.interes_tasa = r[0].data[0].valor;
      this.interes_dias = r[1].data[0].valor;
      this.derecho_anual = r[2].data[0].valor;
    })
    .catch(e => console.error(e))
  },

  methods: {
    updateBoletas: function() {
      this.loading = true;
      let url_boletas = `/boletas?matricula=${this.id}&sort=+fecha_vencimiento&estado=1`;
      let url_volantes = `/volantespago?matricula=${this.id}&sort=+fecha_vencimiento&estado=1&vencido=false`;

      Promise.all([
        api.get(url_boletas),
        api.get(url_volantes)
      ])
      .then(([boletas, volantes]) => {
        this.boletas = [];
        boletas.data.forEach(b => {
          b.tipo = 'boleta';
          b.checked = false;
          b.descripcion = b.items[0].descripcion;
          b.interes = calculoIntereses(b, getFecha(this.fecha_pago), this.interes_tasa, this.interes_dias);
          this.boletas.push(b);
        });

        volantes.data.forEach(v => {
          v.tipo = 'volante';
          v.checked = false;
          v.descripcion = 'Volante de Pago';
          v.total = v.subtotal - v.bonificacion_total;
          v.interes = v.intereses_total;
          this.boletas.push(v);
        });

        this.boletas_original = clone(this.boletas);
        this.boletas = this.boletas.sort(sortByFecha('fecha_vto'));
        this.loading = false;
      })
      .catch(e => console.error(e));
    },

    updateIntereses: function() {
      this.boletas.forEach(b => {
        if (b.tipo == 'boleta') {
          b.interes = calculoIntereses(b, getFecha(this.fecha_pago), this.interes_tasa, this.interes.dias)
        }
      });
    },

    pagar: function(items_pago) {
      let comprobante = {
        boletas: clone(this.boletas_selected),
        items_pago,
        matricula: this.id,
        fecha: moment(),
        fecha_vencimiento: moment(),
        subtotal: this.subtotal,
        interes_total: this.intereses_total,
        bonificacion_total: this.bonificacion_total,
        importe_total: this.importe_total,
        delegacion: this.global_state.delegacion.id
      }

      api.post('comprobantes', comprobante)
      .then(r => {
        console.info(`Comprobante ${r.data.id} generado!`);
        this.snackOk('Comprobante generado exitosamente!')
        this.expand_pago = false;

        reports.open({
          'jsp-source': 'recibo.jasper',
          'jsp-format': 'PDF',
          'jsp-output-file': `Recibo N° ${r.data.numero} - ${Date.now()}`,
          'jsp-only-gen': false,
          'recibo_id': r.data.id
        });

        this.updateBoletas();
        this.$emit('update');
      })
      .catch(e => console.error(e));
    },

    generarVolante: function() {
      if (!this.boletas_selected.length) {
        return alert('Debe seleccionar al menos una boleta!');
      }

      if (this.boletas_selected.some(b => b.tipo == 'volante')) {
        return alert('No puede haber volantes de pago seleccionados para generar un volante');
      }

      let volante = {
        boletas: clone(this.boletas_selected),
        matricula: this.id,
        fecha: moment(),
        subtotal: this.subtotal,
        interes_total: this.intereses_total,
        importe_total: this.importe_total,
        bonificacion_total: this.bonificacion_total,
        delegacion: this.global_state.delegacion.id
      }

      api.post('volantespago', volante)
      .then(r => {
        this.snackOk('Volante de pago generado exitosamente!');
        let volante = r.data;
        console.info(`Volante ${volante.id} generado!`);
        volante.tipo = 'volante';
        this.imprimir(volante);
        this.updateBoletas();
        this.$emit('update');
      })
      .catch(e => console.error(e));
    },

    imprimir(item) {
      let titulo = 'Boleta';
      let numero = item.numero;
      let param_id = 'boleta_id';

      if (item.tipo == 'volante') {
        titulo = 'Volante de Pago';
        numero = item.id;
        param_id = 'volante_id';
      }

      reports.open({
        'jsp-source': `${item.tipo}.jasper`,
        'jsp-format': 'PDF',
        'jsp-output-file': `${titulo} N° ${numero} - ${Date.now()}`,
        'jsp-only-gen': false,
        [param_id]: item.id
      });
    },

    showAddBoleta: function() {
      this.show_addboleta = true;
    },

    nuevaBoleta: function() {
      this.updateBoletas();
      this.$emit('update');
      this.show_addboleta = false;
    },

    cerrarVentanaPago: function() {
      this.expand_pago = false;
      this.$refs.cobranza.reset();
    },

    anular: function(item) {
      let tipo = item.tipo == 'boleta' ? 'la boleta' : 'el volante';

      if (confirm(`Está segura/o que desea anular ${tipo}?`)) {
        if (item.tipo == 'boleta') {
          api.patch(`/boletas/${item.id}`, {
            estado: 11
          })
          .then(r => {
            this.snackOk('Boleta anulada exitosamente!')
            this.updateBoletas();
          })
          .catch(e => this.snackError(e));
        }
        else if (item.tipo == 'volante') {
          api.post(`/volantespago/${item.id}/anular`)
          .then(r => {
            this.snackOk('Volante anulado exitosamente!')
            this.updateBoletas();
          })
          .catch(e => this.snackError(e));
        }        
      }
    }    
  },

}
</script>

<style>
</style>
