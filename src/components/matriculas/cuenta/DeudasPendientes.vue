<template>
  <v-container>

    <v-layout row class="my-4">
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
            no-data-text="No hay deudas pendientes"
        >
          <template slot="items" slot-scope="props">
            <tr>
              <td class="justify-center layout px-0">
                <v-checkbox v-model="props.item.checked"></v-checkbox>
              </td>              
              <td>{{ props.item.fecha | fecha }}</td>
              <td>{{ props.item.fecha_vencimiento | fecha }}</td>
              <td>{{ props.item.descripcion }}</td>
              <td>${{ props.item.total | round }}</td>
              <td>${{ props.item.interes | round }}</td>
              <td class="justify-center layout px-0">
                <v-btn
                  v-if="props.item.tipo == 'volante'"
                  small icon
                  class="mx-0"
                  title="Imprimir"
                  @click="imprimirVolante(props.item.id)"
                >
                  <v-icon color="secondary">print</v-icon>
                </v-btn>
              </td>              
            </tr>
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
import * as moment from 'moment'
import * as utils from '@/utils'
import { Header } from '@/model'
import { calculoIntereses } from '@/utils/cobranza'
import InputFecha from '@/components/base/InputFecha'
import Cobranza from '@/components/cobranzas/Cobranza'
import NuevaBoleta from '@/components/matriculas/cuenta/NuevaBoleta'
import { impresionVolante } from '@/utils/PDFUtils'


export default {
  name: 'DeudasPendientes',
  props: ['id'],

  components: {
    InputFecha,
    Cobranza,
    NuevaBoleta
  },

  headers: [
    Header('Sel.', 'check'),
    Header('Fecha', 'fecha', true),
    Header('Fecha de Venc.', 'fecha_vencimiento', true),
    Header('Descripción', 'descripcion', true),
    Header('Importe', 'total', true),
    Header('Intereses', 'interes', true),
    Header('', 'imprimir')
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
      interes_dias: 30
    }
  },

  filters: {
    tipo_boleta: function(str) {
      if (str == 'boleta') return 'Boleta';
      if (str == 'volante') return 'Volante de Pago';
      return '';
    }
  },


  watch: {
    'pagination.sortBy': function(sortBy) {
      if (sortBy) {
        if (sortBy.includes('fecha')) this.boletas = this.boletas.sort(utils.sortByFecha(sortBy));
        else if (sortBy == 'descripcion') this.boletas = this.boletas.sort(utils.sortByString(sortBy));
        else this.boletas = this.boletas.sort(utils.sortByNumber(sortBy));
      }
      else this.boletas = utils.clone(this.boletas_original);
    }
  },

  computed: {
    subtotal: function() {
      if (!this.boletas.length) return 0;
      let suma = this.boletas.reduce((prev, act) => {
        let num = act.tipo == 'boleta' ? act.total : act.subtotal;
        return prev + (act.checked ? num : 0);
      }, 0);
      return utils.round(suma, 2);
    },

    intereses_total: function() {
      if (!this.boletas.length) return 0;
      let suma = this.boletas.reduce((prev, act) => {
        let num = act.tipo == 'boleta' ? act.interes : act.interes_total;
        return prev + (act.checked ? num : 0);
      }, 0);
      return utils.round(suma, 2);
    },

    importe_total: function() {
      return utils.round(this.subtotal + this.intereses_total, 2);
    },

    boletas_selected: function() {
      return this.boletas.filter(b => b.checked);
    }
  },

  created: function() {
    Promise.all([
        api.get('/valores_globales?variable=3'), //Recupero tasa de interes(id=3) válido en la fecha
        api.get('/valores_globales?variable=4')    //Recupero día de interés(id=4) válido en la fecha
    ])

    .then(r => {
      this.interes_tasa = r[0].data[0].valor;
      this.interes_dias = r[1].data[0].valor;
      this.updateBoletas();
    })
    .catch(e => console.error(e))
  },

  methods: {
    updateBoletas: function() {
      this.loading = true;
      let url_boletas = `/boletas?matricula=${this.id}&sort=+fecha_vencimiento&estado=1`;
      let url_volantes = `/volantespago?matricula=${this.id}&sort=+fecha_vencimiento&pagado=false&vencido=false`;

      Promise.all([
        api.get(url_boletas),
        api.get(url_volantes)
      ])
      .then(([boletas, volantes]) => {
        this.boletas = [];
        boletas.data.forEach(b => {
          b.tipo = 'boleta';
          b.checked = false;
          b.descripcion = b.tipo_comprobante.descripcion;
          b.interes = calculoIntereses(b, utils.getFecha(this.fecha_pago), this.interes_tasa, this.interes_dias);
          this.boletas.push(b);
        });

        volantes.data.forEach(v => {
          v.tipo = 'volante';
          v.checked = false;
          v.descripcion = 'Volante de Pago';
          v.total = v.subtotal;
          v.interes = v.intereses_total;
          this.boletas.push(v);
        });

        this.boletas_original = utils.clone(this.boletas);
        this.boletas = this.boletas.sort(utils.sortByFecha('fecha_vto'));
        this.loading = false;
      })
      .catch(e => console.error(e));
    },

    updateIntereses: function() {
      this.boletas.forEach(b => {
        if (b.tipo == 'boleta') {
          b.interes = calculoIntereses(b, utils.getFecha(this.fecha_pago), this.interes_tasa, this.interes.dias)
        }
      });
    },

    pagar: function(items_pago) {
      let boletas = this.boletas.filter(b => b.checked);

      let comprobante = {
        boletas,
        items_pago,
        matricula: this.id,
        fecha: moment(),
        fecha_vencimiento: moment(),
        subtotal: this.subtotal,
        interes_total: this.intereses_total,
        importe_total: this.importe_total,
        delegacion: this.global_state.delegacion.id
      }

      api.post('comprobantes', comprobante)
      .then(r => {
        console.info(`Comprobante ${r.data.id} generado!`);
        this.global_state.snackbar.msg = 'Comprobante generado exitosamente!';
        this.global_state.snackbar.color = 'success';
        this.global_state.snackbar.show = true;
        this.expand_pago = false;
        this.updateBoletas();
        this.$emit('update');
      })
      .catch(e => console.error(e));
    },

    generarVolante: function() {
      let boletas = this.boletas.filter(b => b.checked);

      if (!boletas.length) {
        this.global_state.snackbar.msg = 'Debe seleccionar al menos una boleta';
        this.global_state.snackbar.color = 'error';
        this.global_state.snackbar.show = true;
        return;
      }

      if (boletas.some(b => b.tipo == 'volante')) {
        this.global_state.snackbar.msg = 'No puede haber volantes de pago seleccionar para generar un volante';
        this.global_state.snackbar.color = 'error';
        this.global_state.snackbar.show = true;
        return;
      }

      let volante = {
        boletas,
        matricula: this.id,
        fecha: moment(),
        fecha_vencimiento: moment().add(15, 'days'),
        subtotal: this.subtotal,
        interes_total: this.intereses_total,
        importe_total: this.importe_total,
        delegacion: this.global_state.delegacion.id
      }

      api.post('volantespago', volante)
      .then(r => {
        console.info(`Volante ${r.data.id} generado!`);
        this.imprimirVolante(r.data.id);
        this.global_state.snackbar.msg = 'Volante de pago generado exitosamente!';
        this.global_state.snackbar.color = 'success';
        this.global_state.snackbar.show = true;
        this.updateBoletas();
        this.$emit('update');
      })
      .catch(e => console.error(e));
    },

    imprimirVolante(id) {
        api.get(`/volantespago/${id}`)
        .then(v => {
              let volante = v.data;
              api.get(`/matriculas/${volante.matricula}`)
              .then(m =>{
                let matricula = m.data;
                volante.matricula= matricula;
                let pdf = impresionVolante(volante);
                pdf.save(`Volante ${id}.pdf`);
              })
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
    }
  },

}
</script>

<style>
</style>
