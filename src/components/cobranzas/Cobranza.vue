<template>
  <v-container>
    <!-- <v-toolbar dark class="blue">
      <v-toolbar-title class="white--text">Cobranzas</v-toolbar-title>
    </v-toolbar> -->

    <v-card class="elevation-4">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs3 class="ml-4">
            <h3 class="blue--text">Fecha: {{ fecha }} </h3>
          </v-flex>
          <v-flex xs3 class="ml-4">
            <h3 class="blue--text">Importe Total: ${{ importe }}</h3>
          </v-flex>
        </v-layout>

        <br>

        <v-layout row>
          <v-flex xs6>
            <v-layout row wrap class="mt-4 mx-3">
              <v-flex xs6 class="mx-3">
                <v-select
                  autocomplete single-line bottom
                  item-text="nombre"
                  item-value="id"
                  label="Forma de Pago"
                  :items="tipos_pago"
                  v-model="nueva_forma_pago.forma_pago"
                  :rules="submit_forma_pago ? validator.tipo : []"
                  :error="submit_forma_pago && !validControl(validator.tipo, nueva_forma_pago.forma_pago)"
                >
                </v-select>
              </v-flex>

              <v-flex xs4 class="ml-3">
                <v-text-field
                  type="number"
                  label="Importe"
                  v-model="nueva_forma_pago.importe"
                  prefix="$"
                  :rules="submit_forma_pago ? validator.importe : []"
                  :error="submit_forma_pago && !validControl(validator.importe, nueva_forma_pago.importe)"
                >
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-flex>

          <v-flex xs4 v-show="esCheque" class="mt-4">
              <v-layout row wrap>
                <v-flex xs5>
                  <v-text-field
                    label="N° Cheque"
                    v-model="nueva_forma_pago.cheque.numero"
                    :rules="submit_forma_pago ? validator.cheque.numero : []"
                    :error="submit_forma_pago && !validControl(validator.cheque.numero, nueva_forma_pago.cheque.numero)"
                  >
                  </v-text-field>
                  <input-fecha
                    label="Fecha Vto"
                    v-model="nueva_forma_pago.cheque.fecha_vencimiento"
                    :rules="submit_forma_pago ? validator.cheque.fecha_vencimiento : []"
                    :error="submit_forma_pago && !validControl(validator.cheque.fecha_vencimiento, nueva_forma_pago.cheque.fecha_vencimiento)"
                  >
                </input-fecha>
                </v-flex>

                <v-flex xs5 class="mx-3">
                  <v-select
                    autocomplete single-line bottom
                    item-text="nombre"
                    item-value="id"
                    label="Banco"
                    v-model="nueva_forma_pago.cheque.banco"
                    :items="bancos"
                    :rules="submit_forma_pago ? validator.cheque.banco : []"
                    :error="submit_forma_pago && !validControl(validator.cheque.banco, nueva_forma_pago.cheque.banco)"
                  >
                </v-select>
                  <v-text-field
                    label="Titular Cuenta"
                    v-model="nueva_forma_pago.cheque.titular"
                    :rules="submit_forma_pago ? validator.cheque.titular : []"
                    :error="submit_forma_pago && !validControl(validator.cheque.titular, nueva_forma_pago.cheque.titular)"
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>
          </v-flex>

          <v-flex xs2 class="mt-4">
            <v-btn dark class="blue" @click="addItemPago">
              Agregar
            </v-btn>
          </v-flex>
        </v-layout>

        <br>

        <v-layout row>
          <v-flex xs12>
            <v-data-table
                :headers="header_pagos"
                :items="items_pago"
                class="elevation-1"
                no-data-text="No hay pagos"
                hide-actions
              >
              <template slot="headers" slot-scope="props">
                <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
                  <b>{{ header.text }}</b>
                </th>
                <th></th>
              </template>
              <template slot="items" slot-scope="props">
                <tr>
                  <td>{{ getTipoPago(props.item.forma_pago) }}</td>
                  <td>${{ props.item.importe }}</td>
                  <td>{{ props.item.cheque.numero }}</td>
                  <td>{{ getBanco(props.item.cheque.banco) }}</td>
                  <td>
                    <v-btn fab class="grey" dark small @click="borrarPago(props.index)">
                      <v-icon>delete</v-icon>
                    </v-btn>
                  </td>
                </tr>
              </template>
            </v-data-table>

            <br>

            <div class="mx-5">
              <v-alert color="warning" icon="priority_high" :value="total > importe">
                El importe abonado es superior al importe a pagar
              </v-alert>
            </div>
            <div class="right mr-5">
              <h4 class="blue--text"> Total: ${{ total }}</h4>
            </div>
          </v-flex>
        </v-layout>


        <v-layout row wrap>
          <v-flex xs12 class="ma-4">
            <v-btn
              :dark="form_valid"
              class="green right"
              :disabled="!form_valid"
              @click="pagar"
            >
              Aceptar
              <v-icon dark right>check_circle</v-icon>
            </v-btn>

            <v-btn dark class="red right" @click="$emit('cancelar')">
              Cancelar
              <v-icon dark right>block</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from '@/axios'
import * as Model from '@/model'
import * as utils from '@/utils'
import rules from '@/rules'
import InputFecha from '@/components/base/InputFecha'
import ValidatorMixin from '@/components/mixins/ValidatorMixin'


const Cheque = () => ({
  numero: null,
  banco: null,
  titular: '',
  fecha_vencimiento: null
})

const FormaPago = () => ({
    forma_pago: '',
    importe: 0,
    cheque: Cheque()
})

const header_pagos = [
  Model.Header('Forma de Pago', 'forma'),
  Model.Header('Importe', 'importe'),
  Model.Header('N° Cheque', 'numero'),
  Model.Header('Banco', 'banco')
]

const formatPago = (p) => `${p.cuenta} - ${p.nombre.trim()}`;

export default {
  name: 'Cobranza',
  props: {
    fecha: {
      type: String,
    },

    importe: {
      type: Number
    }
  },

  mixins: [ValidatorMixin],

  components: {
    InputFecha
  },

  data () {
    return {
      tipos_pago: [],
      bancos: [],
      items_pago: [],
      nueva_forma_pago: FormaPago(),
      submit_forma_pago: false,
      validator: {
        forma_pago: [rules.required],
        importe: [rules.required],
        cheque: {
          numero: [rules.required],
          banco: [rules.required],
          titular: [rules.required],
          fecha_vencimiento:[rules.required]
        }
      }
    }
  },

  computed: {
    header_pagos: function() {
      return header_pagos;
    },

    esCheque: function() {
      if (!this.nueva_forma_pago.forma_pago) return false;
      let forma_pago = this.tipos_pago.find(f => f.id == this.nueva_forma_pago.forma_pago);
      return forma_pago ? forma_pago.pago == 4 : false;
    },

    total: function() {
      if (!this.items_pago.length) return 0;
      return this.items_pago.reduce((prev, act) => prev + +act.importe, 0)
    },

    form_valid: function() {
      return this.total == this.importe;
    }
  },

  created: function() {
    Promise.all([
      axios.get('/opciones'),
      axios.get('/bancos')
    ])
    .then(r => {
      this.tipos_pago = r[0].data.formaPago;
      this.bancos = r[1].data;
    })
    .catch(e => console.error(e));
  },

  methods: {
    addItemPago: function() {
      this.submit_forma_pago = true;
      if (this.esCheque && !utils.validObject(this.nueva_forma_pago, this.validator)) return;
      if (!this.esCheque && !this.nueva_forma_pago.importe.length) return;

      this.items_pago.push(this.nueva_forma_pago);
      this.submit_forma_pago = false;
      this.nueva_forma_pago = FormaPago();
    },

    pagar: function() {
      this.$emit('aceptar', utils.clone(this.items_pago));
      this.items_pago = [];
    },

    getTipoPago: function(id) {
      let forma_pago = this.tipos_pago.find(f => f.id == id);
      return forma_pago ? forma_pago.nombre : '';
    },

    getBanco: function(id) {
      let banco = this.bancos.find(b => b.id == id);
      return banco ? banco.nombre : '';
    },

    borrarPago: function(index) {
      this.items_pago.splice(index, 1);
    }
  },

}
</script>

<style>
</style>
