<template>
  <v-container>

    <br>

    <v-layout row wrap>
      <v-flex xs9>
        <v-data-table
            :headers="headers_resumen"
            :items="boletas"
            class="elevation-1"
            :rows-per-page-items="[5, 10, 25]"
            no-data-text="No hay deudas pendientes"
        >
          <template slot="headers" slot-scope="props">
            <th></th>
            <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
              <b>{{ header.text }}</b>
            </th>
          </template>
          <template slot="items" slot-scope="props">
            <tr>
              <td>
                <v-btn 
                  v-if="props.item.tipo == 'volante'"
                  fab dark small @click="imprimirVolante(props.item.id)" color="blue"
                >
                  <v-icon>print</v-icon>
                </v-btn>                
              </td>
              <td>{{ props.item.fecha | fecha }}</td>
              <td>{{ props.item.fecha_vencimiento | fecha }}</td>
              <template v-if="props.item.tipo == 'boleta'">
                <td>{{ props.item.tipo_comprobante.descripcion }}</td>
                <td>${{ props.item.total }}</td>
                <td>${{ props.item.interes | round }}</td>                
              </template>
              <template v-if="props.item.tipo == 'volante'">
                <td>Volante de Pago</td>
                <td>${{ props.item.subtotal | round }}</td>
                <td>${{ props.item.interes_total | round }}</td>                
              </template>
              <td></td>
              <td>
                <v-checkbox
                  v-model="props.item.checked"
                >
                </v-checkbox>
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
              class="blue darken-1"
              style="width:100%"
              @click="generarVolante"
            >
              Volante Pago
            </v-btn>    
          </v-flex>
          <v-flex xs6 class="mx-1">
            <v-btn
              dark
              class="blue darken-1"
              style="width:100%"
              @click="expand_pago = true"
            >
              Pagar
            </v-btn>
          </v-flex>
        </v-layout>

      </v-flex>
    </v-layout>

    <br>

    <v-dialog v-model="expand_pago" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark class="blue">
          <v-toolbar-title class="white--text">Recibo de Pago</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="expand_pago = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        <cobranza
          :fecha="fecha_pago"
          :importe="importe_total"
          @cancelar="expand_pago = false"
          @aceptar="pagar"
        >
        </cobranza>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import axios from '@/axios'
import * as moment from 'moment'
import * as utils from '@/utils'
import { calculoIntereses } from '@/utils/cobranza'
import InputFecha from '@/components/base/InputFecha'
import Cobranza from '@/components/cobranzas/Cobranza'
import Store from '@/Store'
import { impresionVolante } from '@/utils/PDFUtils'

const headers = [
  { text: 'Fecha' },
  { text: 'Fecha de Vencimiento' },
  { text: 'Descripción' },
  { text: 'Importe' },
  { text: 'Intereses' }
]

export default {
  name: 'DeudasPendientes',
  props: ['id'],

  components: {
    InputFecha,
    Cobranza
  },

  data () {
    return {
      global_state: Store.state,
      boletas: [],
      fecha_pago: moment().format('DD/MM/YYYY'),
      expand_pago: false
    }
  },

  filters: {
    tipo_boleta: function(str) {
      if (str == 'boleta') return 'Boleta';
      if (str == 'volante') return 'Volante de Pago';
      return '';
    }
  },

  computed: {
    headers_resumen: function() {
      return headers;
    },

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
    }
  },

  created: function() {
    this.updateBoletas();
  },

  methods: {
    updateBoletas: function() {
      let url_boletas = `/boletas?matricula=${this.id}&sort=+fecha_vencimiento&estado=1`;
      let url_volantes = `/volantespago?matricula=${this.id}&sort=+fecha_vencimiento&pagado=false`;
      
      Promise.all([
        axios.get(url_boletas),
        axios.get(url_volantes)
      ])
      .then(([boletas, volantes]) => {        
        this.boletas = [];
        boletas.data.forEach(b => {
          b.tipo = 'boleta';
          b.checked = false;
          b.interes = calculoIntereses(b, moment(this.fecha_pago, 'DD/MM/YYYY'));
          this.boletas.push(b);
        });
        
        volantes.data.forEach(v => {
          v.tipo = 'volante';
          v.checked = false;
          this.boletas.push(v);
        });
      })
      .catch(e => console.error(e));
    },

    updateIntereses: function() {
      this.boletas.forEach(b => {
        if (b.tipo == 'boleta') {
          b.interes = calculoIntereses(b, moment(this.fecha_pago, 'DD/MM/YYYY'))
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
        delegacion: this.global_state.delegacion,
        operador: JSON.parse(Cookies.get('CPTNUser')).id 
      }
      
      axios.post('comprobantes', comprobante)
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
        delegacion: this.global_state.delegacion,
        operador: JSON.parse(Cookies.get('CPTNUser')).id 
      }
      
      axios.post('volantespago', volante)
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
        axios.get(`/volantespago/${id}`)
        .then(v => {
              let volante = v.data;
              axios.get(`/matriculas/${volante.matricula}`)
              .then(m =>{
                let matricula = m.data;
                volante.matricula= matricula;
                let pdf = impresionVolante(volante);
                pdf.save(`Volante ${id}.pdf`);             
              })
          });
    }
  },

}
</script>

<style>
</style>
