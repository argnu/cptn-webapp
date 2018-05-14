<template>
  <v-container>
    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">Configuración del Sistema</v-toolbar-title>
    </v-toolbar>
    <v-card>

        <br>

        <v-layout>
            <v-flex xs10>
            </v-flex>
            <v-flex xs2>
                <v-switch
                    label="Editar Datos"
                    v-model="edit"
                    @change="changeEdit"
                ></v-switch>
            </v-flex>
        </v-layout>

        <v-divider></v-divider>

        <br>

        <span class="subheading blue--text text--darken-4 ml-4"><b>Tasas de Interés</b></span>

        <v-layout row class="ma-4">
            <v-flex xs3 class="mr-5">
                <v-layout row>
                    <v-flex xs11 class="mx-2">
                        <v-form v-model="valid.interes.tasa">
                        <input-numero
                            label="Tasa"
                            decimal
                            v-model="interes_tasa"
                            :disabled="!edit"
                            :rules="[rules.required, rules.number]"
                        >
                        </input-numero>
                        </v-form>
                    </v-flex>
                    <v-flex xs1>
                        <v-btn
                            v-show="edit"
                            fab icon small
                            class="grey lighten-2"
                            @click.native="guardar('interes_tasa')"
                            :disabled="!valid.interes.tasa || submitted.interes_tasa || sinCambio('interes_tasa')"
                            :loading="submitted.interes_tasa"
                        >
                            <v-icon class="black--text">save</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>

            <v-flex xs3 class="ml-5">
                <v-layout row>
                    <v-flex xs11 class="mx-2">
                        <v-form v-model="valid.interes.dias">
                        <input-numero
                            label="Días"
                            v-model="interes_dias"
                            :disabled="!edit"
                            :rules="[rules.required, rules.dia]"
                        >
                        </input-numero>
                        </v-form>
                    </v-flex>
                    <v-flex xs1>
                        <v-btn
                            v-show="edit"
                            fab icon small
                            class="grey lighten-2"
                            @click.native="guardar('interes_dias')"
                            :disabled="!valid.interes.dias || submitted.interes_dias || sinCambio('interes_dias')"
                            :loading="submitted.interes_dias"
                        >
                            <v-icon class="black--text">save</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>

        <v-divider></v-divider>

        <br>
        <span class="subheading blue--text text--darken-4 ml-4"><b>Importes Matriculación</b></span>

        <v-layout row class="ma-4">
            <v-flex xs5 class="mr-5">
                <v-layout row>
                    <v-flex xs11 class="mx-2">
                        <v-form v-model="valid.matriculacion.comprobante">
                        <v-select
                            label="Tipo de Comprobante"
                            :items="tipos_comprobante"
                            item-text="descripcion"
                            item-value="id"
                            v-model="matriculacion_comprobante"
                            :disabled="!edit"
                            :rules="[rules.required]"
                        >
                        </v-select>
                        </v-form>
                    </v-flex>
                    <v-flex xs1>
                        <v-btn
                            v-show="edit"
                            fab icon small
                            class="grey lighten-2"
                            @click.native="guardar('matriculacion_comprobante')"
                            :disabled="!valid.matriculacion.comprobante || submitted.matriculacion_comprobante || sinCambio('matriculacion_comprobante')"
                            :loading="submitted.matriculacion_comprobante"
                        >
                            <v-icon class="black--text">save</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>

            <v-flex xs3 class="ml-5">
                <v-layout row>
                    <v-flex xs11 class="mx-2">
                        <v-form v-model="valid.matriculacion.importe">
                        <input-numero
                            label="Importe"
                            decimal
                            v-model="matriculacion_importe"
                            :disabled="!edit"
                            :rules="[rules.required, rules.number]"
                        >
                        </input-numero>
                        </v-form>
                    </v-flex>
                    <v-flex xs1>
                        <v-btn
                            v-show="edit"
                            fab icon small
                            class="grey lighten-2"
                            @click.native="guardar('matriculacion_importe')"
                            :disabled="!valid.matriculacion.importe || submitted.matriculacion_importe || sinCambio('matriculacion_importe')"
                            :loading="submitted.matriculacion_importe"
                        >
                            <v-icon class="black--text">save</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>
            </v-flex>
        </v-layout>

    </v-card>
  </v-container>
</template>

<script>
import api from '@/services/api'
import * as validation from '@/validation/utils'
import InputNumero from '@/components/base/InputNumero'
import MixinValidator from '@/components/mixins/MixinValidator'
export default {
    name: 'SistemaConfiguracion',

    mixins: [MixinValidator],

    components: {
        InputNumero
    },

    data() {
        return {
            interes_tasa: '',
            interes_dias: '',
            matriculacion_comprobante: '',
            matriculacion_importe: '',

            original: {
                interes_tasa: '',
                interes_dias: '',
                matriculacion_comprobante: '',
                matriculacion_importe: ''               
            },
            
            tipos_comprobante: [],

            submitted: {
                interes_tasa: false,
                interes_dias: false,
                matriculacion_comprobante: false,
                matriculacion_importe: false
            },

            valid: {
                interes: {
                    tasa: false,
                    dias: false
                },
                matriculacion: {
                    comprobante: false,
                    importe: false
                }
            },

            edit: false,

            ids_variables: {
                matriculacion_importe: 1,
                matriculacion_comprobante: 2,
                interes_tasa: 3,
                interes_dias: 4
            }
        }
    },

    created: function() {
        Promise.all([
            api.get('/opciones'),
            api.get('/valores_globales?nombre=matriculacion_importe'),
            api.get('/valores_globales?nombre=matriculacion_comprobante'),
            api.get('/valores_globales?nombre=interes_tasa'),
            api.get('/valores_globales?nombre=interes_dias')
        ])
        
        .then(r => {
            this.tipos_comprobante = r[0].data.comprobante;
            this.matriculacion_importe = r[1].data[0].valor;
            this.matriculacion_comprobante = r[2].data[0].valor;
            this.interes_tasa = r[3].data[0].valor;
            this.interes_dias = r[4].data[0].valor;

            this.original = {
                matriculacion_importe: this.matriculacion_importe,
                matriculacion_comprobante: this.matriculacion_comprobante,
                interes_tasa: this.interes_tasa,
                interes_dias: this.interes_dias
            }
            
            
        })
        .catch(e => console.error(e))
    },

    methods: {
        sinCambio: function(elem) {
            return this[elem] == this.original[elem];
        },

        guardar: function(element) {
            this.submitted[element] = true;
            api.post('/valores_globales', {
                variable: this.ids_variables[element],
                valor: this[element],
                fecha: new Date(),
            })
            .then(r => {
                this.submitted[element] = false;
                this.original[element] = this[element];
                this.global_state.snackbar.msg = 'Variable de configuración actualizada exitosamente!';
                this.global_state.snackbar.color = 'success';
                this.global_state.snackbar.show = true;
            })
            .catch(e => {
                this.submitted = false;
                let msg = (!e.response || e.response.status == 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.msg;
                this.global_state.snackbar.msg = msg;
                this.global_state.snackbar.color = 'error';
                this.global_state.snackbar.show = true;                    
                console.error(e);
            })          
        },

        changeEdit: function() {
            if (!this.edit) {
                for(let att in this.original) {
                    this[att] = this.original[att];
                }
            }
        }

    }

}
</script>

<style>

</style>
