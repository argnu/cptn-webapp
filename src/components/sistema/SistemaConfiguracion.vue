<template>
  <v-container>
    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">Configuración del Sistema</v-toolbar-title>
    </v-toolbar>
    <v-card>

        <br>

        <v-layout>
            <v-flex xs5 class="ma-4">
                <v-select
                    label="Seleccione una variable"
                    item-text="descripcion"
                    item-value="id"
                    return-object
                    :items="tipos_variable"
                    v-model="variable_selected"
                    @input="updateHistorial"
                ></v-select>
            </v-flex>
        </v-layout>

        <v-card>        
            <div>
                <v-btn
                    v-if="variable_selected"
                    absolute dark fab top right small
                    color="green"
                    @click="addVariable"
                >
                    <v-icon>add</v-icon>
                </v-btn>       

                <v-data-table
                    :headers="$options.headers"
                    :items="variable_historial"
                    class="elevation-1"
                    no-data-text="No se encontraron datos"
                    no-results-text="No se encontraron datos"
                    :loading="loading"
                    :rows-per-page-items="[25,30,35]"
                >

                    <template slot="items" slot-scope="props">
                        <td class="justify-center layout px-0">
                        <v-btn small icon class="mx-0" @click="eliminar(props.item.id)">
                            <v-icon color="danger">delete</v-icon>
                        </v-btn>

                        <v-btn small icon class="mx-4" @click="editar(props.item)">
                            <v-icon color="deep-purple">edit</v-icon>
                        </v-btn>
                        </td>
                        <td>{{ props.item.variable.descripcion }}</td>
                        <td>{{ props.item.fecha_inicio | fecha }}</td>
                        <td>{{ props.item.fecha_fin | fecha }}</td>
                        <td>{{ props.item.valor }}</td>
                    </template>
                </v-data-table>            
            </div>
        </v-card>

    </v-card>

    <v-dialog :value="show_dialog" persistent>
        <v-card>
            <v-toolbar dark color="primary">
            <v-toolbar-title class="white--text">{{ edit ? 'Modificar' : 'Agregar' }} Variable</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="cerrarDialog">
                <v-icon>close</v-icon>
            </v-btn>
            </v-toolbar>
            <variable-global
                ref="form_variable"
                v-model="variable_form"
                @guardar="guardar"
                @cancelar="cerrarDialog"
            ></variable-global>

            <br>

            <v-alert
                class="mx-5"
                color="error"
                icon="warning"
                :value="error_msg.length > 0"
                transition="scale-transition"
            >{{ error_msg }}</v-alert>              

            <br>
        </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import moment from 'moment'
import api from '@/services/api'
import * as utils from '@/utils'
import VariableGlobal from '@/components/sistema/VariableGlobal'
import { Header } from '@/model'

class Variable {
    constructor() {
        this.variable = null;
        this.fecha_inicio = null;
        this.fecha_fin = null;
        this.valor = null;
    }
}

export default {
    name: 'SistemaConfiguracion',

    components: {
        VariableGlobal
    },

    headers: [
        Header('', 'acciones'),
        Header('Variable', 'descripcion'),
        Header('Fecha Inicio', 'fecha_inicio'),
        Header('Fecha Fin', 'fecha_fin'),
        Header('Valor', 'valor')
    ],

    data() {
        return {
            tipos_variable: [],
            variable_selected: null,
            variable_historial: [],
            loading: false,
            show_dialog: false,
            variable_form: new Variable(),
            edit: null,
            error_msg: ''
        }
    },

    created: function() {
        api.get('/opciones')
        .then(r => {
            this.tipos_variable = r.data.variableGlobal;
        })
        .catch(e => console.error(e))
    },

    methods: {
        updateHistorial: function() {
            api.get(`/valores_globales?variable=${this.variable_selected.id}`)
            .then(r => {
                this.variable_historial = r.data;
            })
            .catch(e => console.error(e));
        },

        eliminar: function(id) {
            api.delete(`/valores_globales/${id}`)
            .then(r => {
                this.updateHistorial();
            })
            .catch(e => console.error(e));
        },

        editar: function(variable) {
            this.variable_form = utils.clone(variable);
            this.variable_form.fecha_inicio = utils.getFecha(this.variable_form.fecha_inicio);
            this.variable_form.fecha_fin = utils.getFecha(this.variable_form.fecha_fin);
            this.edit = variable.id;
            this.$refs.form_variable.reset();
            this.show_dialog = true;
        },

        addVariable: function() {
            this.variable_form = new Variable();
            this.variable_form.variable = this.variable_selected;
            this.edit = null;
            if (this.$refs.form_variable) this.$refs.form_variable.reset();
            this.show_dialog = true;
        },

        checkFechas: function() {
            return this.variable_historial.reduce((prev, act) => {
                return prev && moment(act.fecha_fin, 'YYYY-MM-DD') < moment(this.variable_form.fecha_inicio, 'DD/MM/YYYY')
            }, true)
        },

        guardar: function() {
            if (moment(this.variable_form.fecha_inicio, 'DD/MM/YYYY') >= moment(this.variable_form.fecha_fin, 'DD/MM/YYYY'))
                this.error_msg = 'Error: rango de fechas incorrecto.';
            else if (!this.edit && !this.checkFechas())
                this.error_msg = 'Error: revisar la fecha de inicio de validez establecida, podría haber dos valores válidos en el mismo rango de fechas.';
            else {
                let variable = utils.clone(this.variable_form);
                variable.variable = variable.variable.id;

                if (this.edit) {
                    api.put(`/valores_globales/${this.edit}`, variable)
                    .then(r => {
                        this.show_dialog = false;
                        this.error_msg = '';
                        this.updateHistorial();
                    })
                    .catch(e => console.error(e)); 
                }
                else {
                    api.post('/valores_globales', variable)
                    .then(r => {
                        this.show_dialog = false;
                        this.error_msg = '';
                        this.updateHistorial();
                    })
                    .catch(e => console.error(e));                    
                }
            }
        },

        cerrarDialog: function() {
            this.error_msg = '';
            this.show_dialog = false;
        }

    }

}
</script>

<style>

</style>
