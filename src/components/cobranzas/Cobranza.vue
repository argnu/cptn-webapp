<template>
  <v-container>
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
            <v-form lazy-validation ref="form_basico" v-model="valid.form_basico">

            <v-layout row wrap class="mt-4 mx-3">
                <v-flex xs6 class="mx-3">
                  <v-select
                    autocomplete single-line bottom
                    item-text="nombre"
                    item-value="id"
                    label="Forma de Pago"
                    :items="tipos_pago"
                    v-model="nueva_forma_pago.forma_pago"
                    :rules="[rules.required]"
                    @input="chgFormaPago($event)"
                  >
                  </v-select>
                </v-flex>

                <v-flex xs4 class="ml-3">
                  <input-numero
                    label="Importe"
                    prefix="$"
                    decimal
                    v-model="nueva_forma_pago.importe"
                    :rules="[rules.required]"
                  ></input-numero>
                </v-flex>
            </v-layout>

            </v-form>
          </v-flex>

          <v-flex xs4 v-if="esCheque" class="mt-4">
            <v-form lazy-validation ref="form_cheque" v-model="valid.form_cheque">
              <v-layout row wrap>
                <v-flex xs5>
                  <v-text-field
                    label="N° Cheque"
                    v-model="nueva_forma_pago.numero_cheque"
                    :rules="[rules.required]"
                  >
                  </v-text-field>
                  <input-fecha
                    label="Fecha Vto"
                    v-model="nueva_forma_pago.fecha_vto_cheque"
                    :rules="[rules.required, rules.fecha]"
                  ></input-fecha>
                </v-flex>

                <v-flex xs5 class="mx-3">
                  <v-select
                    autocomplete single-line bottom
                    item-text="nombre"
                    item-value="id"
                    label="Banco"
                    v-model="nueva_forma_pago.banco"
                    :items="bancos"
                    :rules="[rules.required]"
                  >
                </v-select>
                  <input-texto
                    label="Titular Cuenta"
                    uppercase
                    v-model="nueva_forma_pago.titular_cuenta"
                    :rules="[rules.required]"
                  >
                  </input-texto>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>

          <v-flex xs2 class="mt-4">
            <v-btn dark color="primary" @click="addItemPago">
              Agregar
            </v-btn>
          </v-flex>
        </v-layout>

        <div class="mx-5">
          <v-alert color="warning" icon="priority_high" :value="supera_importe">
            El importe abonado es superior al importe a pagar
          </v-alert>
        </div>        

        <br>

        <v-layout row>
          <v-flex xs12>
            <v-data-table
                :headers="$options.headers"
                :items="items_pago"
                class="elevation-1"
                no-data-text="No hay pagos"
                hide-actions
              >
              <template slot="items" slot-scope="props">
                  <td class="justify-center layout px-0">
                    <v-btn small icon class="mx-0"  @click="borrarPago(props.index)">
                      <v-icon color="red">delete</v-icon>
                    </v-btn>           
                  </td>                 
                  <td>{{ getTipoPago(props.item.forma_pago) }}</td>
                  <td>${{ props.item.importe | round }}</td>
                  <td>{{ props.item.numero_cheque }}</td>
                  <td>{{ getBanco(props.item.banco) }}</td>                 
              </template>
            </v-data-table>

            <br>

            <div class="right mr-5">
              <h4 class="blue--text"> Total: ${{ total | round }}</h4>
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

            <v-btn dark class="red right" @click="cancelar">
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
import api from '@/services/api'
import { ColumnHeader } from '@/model'
import { getFloat, clone } from '@/utils'
import InputTexto from '@/components/base/InputTexto'
import InputFecha from '@/components/base/InputFecha'
import InputNumero from '@/components/base/InputNumero'
import MixinValidator from '@/components/mixins/MixinValidator'


class ComprobantePago {
  constructor(forma_pago) {
    this.forma_pago = forma_pago;
    this.importe = '';
  }
}

class ComprobantePagoCheque extends ComprobantePago {
  constructor(forma_pago) {
    super(forma_pago);
    this.numero_cheque = '';
    this.banco = '';
    this.titular_cuenta = '';
    this.fecha_vto_cheque = '';
  }
}

const formatPago = (p) => `${p.cuenta} - ${p.nombre.trim()}`;

export default {
  name: 'Cobranza',
  mixins: [MixinValidator],

  props: {
    fecha: {
      type: String,
    },

    importe: {
      type: Number
    }
  },

  components: {
    InputTexto,
    InputFecha, 
    InputNumero
  },

  headers: [
    ColumnHeader('', 'borrar'),
    ColumnHeader('Forma de Pago', 'forma'),
    ColumnHeader('Importe', 'importe'),
    ColumnHeader('N° Cheque', 'numero_cheque'),
    ColumnHeader('Banco', 'banco')
  ],

  data () {
    return {
      tipos_pago: [],
      bancos: [],
      items_pago: [],
      nueva_forma_pago: new ComprobantePago(),
      valid: {
        form_basico: false,
        form_cheque: false
      }
    }
  },

  computed: {
    esCheque: function() {
      if (!this.nueva_forma_pago.forma_pago) return false;
      let forma_pago = this.tipos_pago.find(f => f.id == this.nueva_forma_pago.forma_pago);
      return forma_pago ? forma_pago.pago == 4 : false;
    },

    total: function() {
      if (!this.items_pago.length) return 0;
      return this.items_pago.reduce((prev, act) => prev + getFloat(act.importe), 0);
    },

    form_valid: function() {
      return this.total === this.importe;
    },

    supera_importe: function() {
      return this.total + getFloat(this.nueva_forma_pago.importe) > this.importe;
    }
  },

  watch: {
    importe: function(importe_nuevo) {
      this.nueva_forma_pago.importe = importe_nuevo;
    }
  },

  created: function() {
    Promise.all([
      api.get('/opciones?sort=+valor'),
      api.get('/bancos')
    ])
    .then(r => {
      this.tipos_pago = r[0].data.formaPago;
      this.bancos = r[1].data;
    })
    .catch(e => console.error(e));
  },

  methods: {
    chgFormaPago: function(tipo) {
      let importe_guardar = this.nueva_forma_pago.importe;
      if (this.esCheque) this.nueva_forma_pago = new ComprobantePagoCheque(tipo);
      else this.nueva_forma_pago = new ComprobantePago(tipo);
      this.nueva_forma_pago.importe = importe_guardar;
    },

    addItem: function() {
      this.items_pago.push(this.nueva_forma_pago);
      this.nueva_forma_pago = new ComprobantePago();
      this.$refs.form_basico.reset();
      if (this.$refs.form_cheque) this.$refs.form_cheque.reset();
      this.nueva_forma_pago.importe = this.importe - this.total;
    },

    addItemPago: function() {
      if (this.nueva_forma_pago.titular_cuenta)
        this.nueva_forma_pago.titular_cuenta = this.nueva_forma_pago.titular_cuenta.toUpperCase();

      if (this.supera_importe) return;
      
      if (this.esCheque) {
        let basico = this.$refs.form_basico.validate();
        let cheque = this.$refs.form_cheque.validate();
        if (basico && cheque) this.addItem();
      }
      else {
        if (this.$refs.form_basico.validate()) this.addItem();
      }
    },

    pagar: function() {
      if (this.form_valid) {
        let pagos = clone(this.items_pago)
        this.items_pago = [];
        this.$emit('aceptar', pagos);
      }
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
    },

    cancelar: function() {
      this.reset();
      this.$emit('cancelar');
    },

    reset: function() {
      this.items_pago = [];
      this.nueva_forma_pago.importe = this.importe;
    }
  },

}
</script>

<style>
</style>
