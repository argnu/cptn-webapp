<template>
<div>
  <v-dialog
    persistent
    fullscreen
    v-model="show_persona"
  >
    <persona-nueva 
        dialog
        :dni="nuevo_subsidiario.dni"
        @cancelar="show_persona = false"
        @created="nuevaPersona"
    ></persona-nueva>
  </v-dialog>    

    <v-form ref="form_subsidiario" lazy-validation>
        <v-layout row>
            <v-flex xs6 class="ma-4">
                <input-numero
                    :tabindex="tabindex"
                    label="Buscar DNI"
                    maxlength="8"
                    append-icon="search"
                    v-model="nuevo_subsidiario.dni"
                    @change="chgDni"
                    :rules="[rules.required, rules.integer, rules.dni]"
                ></input-numero>

                <v-text-field
                    :tabindex="tabindex+1"
                    disabled
                    label="Apellido"
                    v-model="nuevo_subsidiario.apellido"
                    :rules="[rules.required]"
                ></v-text-field>
            </v-flex>

            <v-flex xs6 class="ma-4">
                <v-text-field
                    :tabindex="tabindex+1"
                    disabled
                    label="Nombre"
                    v-model="nuevo_subsidiario.nombre"
                    :rules="[rules.required]"
                ></v-text-field>

                <input-numero
                    :tabindex="tabindex+3"
                    label="Porcentaje"
                    decimal
                    v-model="nuevo_subsidiario.porcentaje"
                    :rules="[rules.required]"
                ></input-numero>
            </v-flex>
        </v-layout>

        <v-layout>
            <v-flex xs12>
                <v-btn class="right mb-4" light @click="guardar" :tabindex="tabindex+4">
                    {{ subsidiario_edit != null ? 'Guardar' : 'Agregar' }}
                </v-btn>
                <v-btn class="right" light v-show="subsidiario_edit != null" @click="cancelarEdit">
                    Cancelar
                </v-btn>
            </v-flex>
        </v-layout>

        <v-layout>
            <v-flex xs12>
                <v-data-table
                    :headers="$options.headers"
                    :items="value"
                    hide-actions
                    class="elevation-1 mx-4"
                    no-data-text="No hay subsidiarios"
                >
                    <template slot="items" slot-scope="props">
                        <tr :active="props.index == subsidiario_edit">
                        <td class="justify-center layout px-0">
                            <v-btn icon small class="mx-0" @click="borrar(props.index)">
                            <v-icon color="red">delete</v-icon>
                            </v-btn>

                            <v-btn icon small class="mx-3" @click="edit(props.index)">
                            <v-icon color="deep-purple">edit</v-icon>
                            </v-btn>
                        </td>
                        <td>{{ props.item.dni }}</td>
                        <td>{{ props.item.apellido }}</td>
                        <td>{{ props.item.nombre }}</td>
                        <td>{{ props.item.porcentaje }}</td>
                        </tr>
                    </template>
                </v-data-table>
            </v-flex>
        </v-layout>
    </v-form>
</div>
</template>

<script>
import moment from 'moment'
import api from '@/services/api'
import rules from '@/validation/rules'
import { clone } from '@/utils'
import { Subsidiario, ColumnHeader } from '@/model'
import MixinValidator from '@/components/mixins/MixinValidator'
import InputTexto from '@/components/base/InputTexto'
import InputNumero from '@/components/base/InputNumero'
import PersonaNueva from '@/components/personas/PersonaNueva'

export default {
    name: 'ProfesionalCajasPrevisionales',

    props: {
        value: {
            type: Array,
            default: () => []
        },

        opciones: {
            type: Array,
            default: () => []
        },

        tabindex: [String, Number]
    },

    mixins: [MixinValidator],

    components: {
        InputTexto,
        InputNumero,
        PersonaNueva
    },

    headers: [
        ColumnHeader('', 'acciones'),
        ColumnHeader('DNI', 'dni'),
        ColumnHeader('Apellido', 'apellido'),
        ColumnHeader('Nombre', 'nombre'),
        ColumnHeader('Porcentaje', 'porcentaje')
    ],

    computed: {
        cajas_previsionales_filter: function() {
            if (!this.value.length) return this.cajas_previsionales;
            return this.cajas_previsionales.filter(c =>
                !this.value.find(cp => {
                    return cp == c.nombre || cp == c.id || cp.nombre == c.nombre
                })
            );
        },
    },

    data() {
        return {
            subsidiario_edit: null,
            nuevo_subsidiario: new Subsidiario(),
            show_persona: false
        }
    },

    created: function() {
        api.get('/cajas-previsionales?sort=+nombre')
        .then(r => {
            this.cajas_previsionales = r.data;
        })
        .catch(e => console.error(e));
    },

    methods: {
        guardar: function() {
            if (this.$refs.form_subsidiario.validate()) {
                let buscar_subs = this.value.find(s => s.persona === this.nuevo_subsidiario.persona);
                if (!buscar_subs || this.subsidiario_edit != null) {
                    this.nuevo_subsidiario.nombre = this.nuevo_subsidiario.nombre.toUpperCase()
                    this.nuevo_subsidiario.apellido = this.nuevo_subsidiario.apellido.toUpperCase();
                    let subsidiarios = clone(this.value);

                    if (this.subsidiario_edit == null) subsidiarios.push(this.nuevo_subsidiario);
                    else subsidiarios[this.subsidiario_edit] = this.nuevo_subsidiario;

                    this.$emit('input', subsidiarios);
                    this.nuevo_subsidiario = new Subsidiario();
                    this.$refs.form_subsidiario.reset();
                    this.subsidiario_edit = null;
                }
                else alert('Ya existe la misma persona en el listado!')
            }
        },

        edit: function(index) {
            this.subsidiario_edit = index;
            this.nuevo_subsidiario = clone(this.value[index]);
        },

        borrar: function(index) {
            let subsidiarios = clone(this.value);
            subsidiarios.splice(index, 1);
            this.$emit('input', subsidiarios);
        },

        cancelarEdit: function() {
            this.subsidiario_edit = null;
            this.nuevo_subsidiario = new Subsidiario();
            this.$refs.form_subsidiario.reset();
        },

        chgDni: function() {
            api.get(`/personas?tipo=fisica&dni=${this.nuevo_subsidiario.dni}`)
            .then(r => {
                this.nuevo_subsidiario.persona = null;
                this.nuevo_subsidiario.nombre = null;
                this.nuevo_subsidiario.apellido = null;
                if (r.data.resultados.length > 0) {
                    let persona = r.data.resultados[0];
                    this.nuevo_subsidiario.persona = persona.id;
                    this.nuevo_subsidiario.nombre = persona.nombre;
                    this.nuevo_subsidiario.apellido = persona.apellido;
                }
                else if (rules.dni(this.nuevo_subsidiario.dni) === true) {
                    if (confirm('No existe ninguna persona registrada con dicho dni. Desea cargarla?')) {
                        this.show_persona = true;
                    }
                }
            })
            .catch(e => console.error(e));
        },

        nuevaPersona: function(persona) {
            this.nuevo_subsidiario.persona = persona.id;
            this.nuevo_subsidiario.dni = persona.dni;
            this.nuevo_subsidiario.nombre = persona.nombre;
            this.nuevo_subsidiario.apellido = persona.apellido;
            this.show_persona = false;
        }
    }

}
</script>

<style>

</style>
