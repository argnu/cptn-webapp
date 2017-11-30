<template>
  <v-container>
    <v-toolbar dark class="blue">
      <v-toolbar-title class="white--text">Cobranzas</v-toolbar-title>
    </v-toolbar>
    <v-card class="">
      <v-card-text>
        <v-layout row wrap>
          <v-flex xs4 class="ml-5">
            N° de Recibo: 123456
          </v-flex>
          <v-flex xs4>
            Fecha: ???
          </v-flex>
        </v-layout>

        <v-layout row wrap class="mt-4">
          <v-flex xs4 class="mx-4">
            <v-select
              autocomplete single-line bottom
              item-text="valor"
              item-value="id"
              label="Forma de Pago"
              :items="tipos_pago"
              v-model="nueva_forma_pago.tipo"
            >
            </v-select>
          </v-flex>

          <v-flex xs3 class="mx-4">
            <input-fecha
              label="Fecha de Pago"
              v-model="nueva_forma_pago.fecha"
            >
            </input-fecha>
          </v-flex>

          <v-flex xs3 class="mx-4">
            <v-text-field
              label="Importe"
              v-model="nueva_forma_pago.importe"
            >
            </v-text-field>
          </v-flex>
        </v-layout>

        <v-container v-show="esCheque">
          <v-card class="">
            <v-card-title>
              Cheque
            </v-card-title>
            <v-card-text>
              <v-layout row wrap>
                <v-flex xs5 class="mx-3">
                  <v-text-field
                    label="N° Cheque"
                    v-model="nueva_forma_pago.cheque.numero"
                  >
                  </v-text-field>
                  <input-fecha
                    label="Fecha de Vencimiento"
                    v-model="nueva_forma_pago.cheque.fecha_vencimiento"
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
                  >
                </v-select>
                  <v-text-field
                    label="Titular Cuenta"
                    v-model="nueva_forma_pago.cheque.titular"
                  >
                  </v-text-field>
                </v-flex>
              </v-layout>
            </v-card-text>
          </v-card>
        </v-container>

        <v-layout row wrap>
          <v-flex xs12 class="ma-4">
            <v-btn light class="right" @click="addItemPago">
              Agregar
            </v-btn>
          </v-flex>
        </v-layout>

        <v-data-table
            :headers="header_pagos"
            :items="items_pago"
            class="elevation-1"
            no-data-text="">
          <template slot="headers" scope="props">
            <th v-for="header of props.headers" style="padding: 20px">
              {{ header.text }}
            </th>
          </template>
          <template slot="items" scope="props">
            <tr style="text-align:center">
              <td>{{props.item.tipo}}</td>
              <td>{{props.item.fecha}}</td>
              <td>{{props.item.importe}}</td>
            </tr>
          </template>
        </v-data-table>


        <v-layout row wrap>
          <v-flex xs12 class="ma-4">
            <v-btn dark class="blue right" @click="pagar">
              Pagar
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import axios from '@/axios';
import * as Model from '@/model';
import InputFecha from '@/components/base/InputFecha'


const Cheque = () => ({
  numero: '',
  banco: '',
  titular: '',
  fecha_vencimiento: ''
})

const FormaPago = () => ({
    tipo: '',
    fecha: '',
    importe: '',
    cheque: Cheque()
})

const header_pagos = [
  Model.Header('Forma de Pago', 'forma'),
  Model.Header('Fecha', 'fecha'),
  Model.Header('Importe', 'importe')
]

const formatPago = (p) => `${p.cuenta} - ${p.nombre.trim()}`;

export default {
  name: 'Cobranza',
  data () {
    return {
      tipos_pago: [],
      bancos: [],
      items_pago: [],
      nueva_forma_pago: FormaPago()
    }
  },

  computed: {
    header_pagos: function() {
      return header_pagos;
    },

    esCheque: function() {
      return this.nueva_forma_pago.tipo && this.nueva_forma_pago.tipo.pago == 4;
    }
  },

  created: function() {
    Promise.all([
      axios.get('/opciones'),
      axios.get('/bancos')
    ])
    .then(r => {
      this.tipos_pago = r[0].data.formaPago;
      this.bancos = r[1].data.map(b => b.nombre.trim());
    })
    .catch(e => console.error(e));
  },

  methods: {
    addItemPago: function() {
      this.items_pago.push(this.nueva_forma_pago);
      this.nueva_forma_pago = FormaPago();
    },

    pagar: function() {
      console.log(this.items_pago);
    }
  },

}
</script>

<style>
</style>
