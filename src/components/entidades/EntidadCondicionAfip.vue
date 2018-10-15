<template>
<v-form ref="form_condafip" lazy-validation>
    <v-container>
        <v-layout row>
            <v-flex xs4 class="mx-2">
                <v-select
                    :tabindex="tabindex"
                    autocomplete
                    :items="opciones"
                    item-text="valor"
                    item-value="id"
                    return-object
                    v-model="nueva_condafip.condicion_afip"
                    label="Condición Impositiva"
                    :rules="[rules.required]"
                >
                </v-select>
            </v-flex>

            <v-flex xs7 class="mx-2">
                <input-texto
                    :tabindex="tabindex+2"
                    label="Descripción"
                    maxlength="150"
                    uppercase
                    v-model="nueva_condafip.descripcion"
                ></input-texto>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12>
                <v-btn class="right" light @click="guardar" :tabindex="tabindex+3">
                    {{ condafip_edit != null ? 'Guardar' : 'Agregar' }}
                </v-btn>
                <v-btn class="right" light v-show="condafip_edit != null" @click="cancelarEdit">
                    Cancelar
                </v-btn>
            </v-flex>
        </v-layout>

        <v-data-table
            :headers="$options.headers"
            :items="value"
            hide-actions
            class="elevation-1 mt-4"
            no-data-text="No hay datos"
        >
            <template slot="items" slot-scope="props">
            <tr :active="props.index == condafip_edit">
                <td class="justify-center layout px-0">
                <v-btn icon small class="mx-0" @click="borrar(props.index)">
                    <v-icon color="red">delete</v-icon>
                </v-btn>

                <v-btn icon small class="mx-3" @click="edit(props.index)">
                    <v-icon color="deep-purple">mode_edit</v-icon>
                </v-btn>
                </td>
                <td>{{ props.item.condicion_afip.valor }}</td>
                <td>{{ props.item.descripcion }}</td>
            </tr>
            </template>
        </v-data-table>
    </v-container>

</v-form>  
</template>

<script>
import { clone } from '@/utils'
import { EntidadCondicionAfip, ColumnHeader } from '@/model'
import MixinValidator from '@/components/mixins/MixinValidator'
import InputTexto from '@/components/base/InputTexto'

export default {
    name: 'EntidadCondicionAfip',

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
        InputTexto
    },

    headers: [
        ColumnHeader('', 'acciones'),
        ColumnHeader('Tipo', 'tipo'),
        ColumnHeader('Descripción', 'descripcion')
    ],

    data() {
        return {
            nueva_condafip: new EntidadCondicionAfip(),
            condafip_edit: null,
        }
    },    

    methods: {
        guardar: function () {
            if (this.$refs.form_condafip.validate()) {
                this.nueva_condafip.descripcion = this.nueva_condafip.descripcion.toUpperCase();
                let condiciones_afip = clone(this.value);

                if (this.condafip_edit == null) condiciones_afip.push(this.nueva_condafip);
                else condiciones_afip[this.condafip_edit] = this.nueva_condafip;

                this.$emit('input', condiciones_afip);
                this.nueva_condafip = new EntidadCondicionAfip();
                this.$refs.form_condafip.reset();
                this.condafip_edit = null;
            }
        },

        edit: function(index) {
            this.condafip_edit = index;
            this.nueva_condafip = clone(this.value[index]);
        },

        cancelarEdit: function() {
            this.condafip_edit = null;
            this.nueva_condafip = new Contacto();
            this.$refs.form_condafip.reset();
        },

        borrar: function( index) {
            let condiciones_afip = clone(this.value);
            condiciones_afip.splice(index, 1);
            this.$emit('input', condiciones_afip);
        },        
    }

}
</script>

<style>

</style>
