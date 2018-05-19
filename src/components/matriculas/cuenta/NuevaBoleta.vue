<template>
  <v-container class="mt-4 mx-5">
    <v-form ref="form_boleta" v-model="valid.boleta">
        <v-layout row wrap>
            <v-flex xs5 class="mr-5">
                <input-fecha
                    label="Fecha"
                    v-model="boleta.fecha"
                    :rules="[rules.required, rules.fecha]"
                    @change="chgFecha"
                ></input-fecha>

                <v-select
                    autocomplete
                    label="Tipo de Comprobante"
                    item-text="descripcion"
                    item-value="id"
                    :items="tipos_comprobante"
                    v-model="boleta.tipo_comprobante"
                    :rules="[rules.required]"
                ></v-select>
            </v-flex>

            <v-flex xs5>
                <input-fecha
                    label="Fecha de Vencimiento"
                    v-model="boleta.fecha_vencimiento"
                    :rules="[rules.required, rules.fecha]"
                ></input-fecha>
            </v-flex>
        </v-layout>
    </v-form>

        <br>
        <span class="subheading blue--text text--darken-4"><b>Items</b></span>
        <br>

        <v-form lazy-validation ref="form_item" v-model="valid.item">
        <v-layout row class="mt-4">
            <v-flex xs4 class="mx-4">
                <input-texto
                    label="Descripción"
                    uppercase
                    v-model="boleta_item.descripcion"
                    :rules = "[rules.required]"
                ></input-texto>

            </v-flex>

            <v-flex xs4>
                <input-numero
                    label="Importe"
                    v-model="boleta_item.importe"
                    :rules = "[rules.required]"
                    decimal
                ></input-numero>
            </v-flex>

            <v-flex xs3>
                <v-btn
                    @click="addItem"
                >Agregar</v-btn>
            </v-flex>
        </v-layout>
        </v-form>

        <v-layout row class="mt-4">
            <v-flex xs12>
                <v-data-table
                    :headers="$options.headers"
                    :items="boleta.items"
                    class="elevation-1"
                    hide-actions
                >
                    <template slot="items" slot-scope="props">
                        <td>{{ props.index + 1 }}</td>
                        <td>{{ props.item.descripcion }}</td>
                        <td>{{ props.item.importe }}</td>
                        <td>
                            <v-btn fab small @click="removeItem(props.index)">
                            <v-icon>delete</v-icon>
                            </v-btn>
                        </td>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>

        <br>
        <v-btn
            class="green darken-1 white--text right"
            @click.native="submit"
            :disabled="!valid_form || submitted"
            :loading="submitted"
        >
            Guardar Boleta
            <v-icon dark right>check_circle</v-icon>
        </v-btn>

        <v-btn dark class="red right" @click="$emit('cancelar')">
            Cancelar
            <v-icon dark right>block</v-icon>
        </v-btn>
  </v-container>
</template>

<script>
import api from '@/services/api'
import * as utils from '@/utils'
import * as moment from 'moment'
import { Header } from '@/model'
import InputFecha from '@/components/base/InputFecha'
import InputTexto from '@/components/base/InputTexto'
import InputNumero from '@/components/base/InputNumero'
import MixinValidator from '@/components/mixins/MixinValidator'
import Store from '@/stores/Global'

class Boleta {
    constructor() {
        this.fecha = moment();
        this.fecha_vencimiento = moment(this.fecha).add(15, 'days');
        this.tipo_comprobante = '';
        this.matricula = '';
        this.total = '';
        this.estado = 1;
        this.delegacion = '';
        this.items = [];
    }
}

class BoletaItem {
    constructor() {
        this.descripcion = '';
        this.importe = '';
    }
}

export default {
    name: 'NuevaBoleta',
    props: ['idMatricula'],
    mixins: [MixinValidator],

    components: {
        InputFecha,
        InputNumero,
        InputTexto
    },

    headers: [
        Header('Item', 'item'),
        Header('Descripción', 'descripcion'),
        Header('Importe', 'importe'),
        Header('', 'acciones')
    ],

    data() {
        return {
            global_state: Store.state,
            valid: {
                boleta: false,
                item: false
            },
            boleta: new Boleta(),
            boleta_item: new BoletaItem(1),
            tipos_comprobante: [],
            submitted: false
        }
    },

    computed: {
        valid_form: function() {
            return this.valid.boleta && this.boleta.items.length > 0;
        }
    },

    created: function() {
        api.get('/opciones?sort=+valor')
        .then(r => {
            this.tipos_comprobante = r.data.comprobante;
        })
    },

    methods: {
        chgFecha: function(fecha) {
            this.boleta.fecha_vencimiento = moment(fecha, 'DD/MM/YYYY').add(15, 'days').format('DD/MM/YYYY');
        },

        removeItem: function(index) {
            this.boleta.items.splice(index, 1);
            this.boleta.items.length = this.boleta.items.length;
        },

        addItem: function() {
            if (this.$refs.form_item.validate()) {
                this.boleta.items.push(this.boleta_item);
                this.boleta_item = new BoletaItem();
                this.$refs.form_item.reset();
            }
        },

        submit: function() {
            this.submitted = true;
            if (this.$refs.form_boleta.validate()) {
                this.boleta.matricula = this.idMatricula;
                this.boleta.total = this.boleta.items.reduce((prev, act) => prev + utils.getFloat(act.importe), 0);
                this.boleta.delegacion = Store.state.delegacion.id;
                api.post('/boletas', this.boleta)
                .then(r => {
                    this.submitted = false;
                    this.boleta = new Boleta();
                    this.global_state.snackbar.msg = 'Nueva boleta creada exitosamente!';
                    this.global_state.snackbar.color = 'success';
                    this.global_state.snackbar.show = true;
                    this.$emit('update');
                    setTimeout(() => this.$refs.form_boleta.reset(), 10);
                })
                .catch(e => this.submitError(e));
            }
        },

        submitError: function(e) {
            this.submitted = false;
            let msg = (!e.response || e.response.status == 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.msg;
            this.global_state.snackbar.msg = msg;
            this.global_state.snackbar.color = 'error';
            this.global_state.snackbar.show = true;
        },
    }

}
</script>

<style>

</style>
