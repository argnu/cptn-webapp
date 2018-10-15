<template>
<v-form ref="form_contacto" lazy-validation>

    <v-container>
        <v-layout row>
            <v-flex xs3 class="mx-2">
                <v-select
                    label="Tipo"
                    item-text="valor"
                    item-value="id"
                    return-object
                    :tabindex="tabindex"
                    :items="opciones"
                    :rules="[rules.required]"
                    v-model="nuevo_contacto.tipo"
                    @change="chgTipoContacto"
                >
                </v-select>
            </v-flex>

            <v-flex xs8 class="mx-2" v-if="nuevo_contacto.tipo && nuevo_contacto.tipo.id > 0 && nuevo_contacto.tipo.id < 3">
                <input-telefono
                    :tabindex="tabindex+1"
                    :type="(nuevo_contacto.tipo && nuevo_contacto.tipo.id === 2) ? 'celular' : 'fijo'"
                    v-model="nuevo_telefono"
                ></input-telefono>

                <v-checkbox
                    :tabindex="tabindex+2"
                    v-show="nuevo_contacto.tipo && nuevo_contacto.tipo.id === 2"
                    label="Whatsapp"
                    v-model="nuevo_contacto.whatsapp"
                    light
                ></v-checkbox>
                </v-flex>

            <v-flex xs8 class="mx-2" v-else>
                <v-text-field
                    maxlength="255"
                    :tabindex="tabindex+3"
                    v-model="nuevo_contacto.valor"
                    :rules="rules_contacto"
                    :placeholder="placeholder_contacto"
                ></v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12>
            <v-btn class="right" light @click="guardar" :tabindex="tabindex+4">
                {{ contacto_edit != null ? 'Guardar' : 'Agregar' }}
            </v-btn>
            <v-btn class="right" light v-show="contacto_edit != null" @click="cancelarEditContacto">
                Cancelar
            </v-btn>
            </v-flex>
        </v-layout>

        <v-data-table
            :headers="$options.headers"
            :items="value"
            hide-actions
            class="elevation-1 mt-4"
            no-data-text="No hay contactos"
        >
            <template slot="items" slot-scope="props">
            <tr :active="props.index == contacto_edit">
                <td class="justify-center layout px-0">
                <v-btn icon small class="mx-0" @click="borrar(props.index)">
                    <v-icon color="red">delete</v-icon>
                </v-btn>

                <v-btn icon small class="mx-3" @click="edit(props.index)">
                    <v-icon color="deep-purple">mode_edit</v-icon>
                </v-btn>
                </td>
                <td>{{ props.item.tipo.valor }}</td>
                <td>{{ props.item.valor }}</td>
                <td>
                <span v-if="props.item.tipo.id == 2">
                    Whatsapp: {{ props.item.whatsapp | boolean }}
                </span>
                </td>
            </tr>
            </template>
        </v-data-table>
    </v-container>
</v-form>
</template>

<script>
import { clone } from '@/utils'
import { Contacto, Telefono, ColumnHeader } from '@/model'
import rules from '@/validation/rules.js'
import MixinValidator from '@/components/mixins/MixinValidator'
import InputTexto from '@/components/base/InputTexto'
import InputTelefono from '@/components/base/InputTelefono';
import InputNumero from '@/components/base/InputNumero';

export default {
    name: 'EntidadContactos',

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
        InputTelefono,
        InputNumero
    },

    headers: [
        ColumnHeader('', 'acciones'),
        ColumnHeader('Tipo', 'tipo'),
        ColumnHeader('Valor', 'valor')
    ],

    data() {
        return {
            contacto_edit: null,
            nuevo_contacto: new Contacto(),
            nuevo_telefono: new Telefono(),
            placeholder_contacto: '',
            rules_contacto: [rules.required],
        }
    },

    methods: {
        chgTipoContacto: function(e) {
            this.nuevo_contacto.valor = '';
            if (e && e.id == 3) {
                this.rules_contacto = [rules.required, rules.email];
                this.placeholder_contacto = 'Ej. mweingart@argnu.org'
            }
            else if (e && e.id == 4) {
                this.rules_contacto = [rules.required, rules.url];
                this.placeholder_contacto = 'Ej. http://www.liberascio.org';
            }
            else this.placeholder_contacto = '';
        },

        guardar: function () {
            if (this.$refs.form_contacto.validate()) {
                if (this.nuevo_contacto.tipo.id === 1 || this.nuevo_contacto.tipo.id === 2) {
                    this.nuevo_contacto.valor = `+${this.nuevo_telefono.pais}-${this.nuevo_telefono.provincia}-${this.nuevo_telefono.numero}`;
                }

                let contactos = clone(this.value);

                if (this.contacto_edit == null) contactos.push(this.nuevo_contacto);
                else contactos[this.contacto_edit] = this.nuevo_contacto;

                this.$emit('input', contactos);
                this.nuevo_contacto = new Contacto();
                this.nuevo_telefono = new Telefono();
                this.$refs.form_contacto.reset();
                this.contacto_edit = null;
            }
        },

        edit: function(index) {
            this.contacto_edit = index;
            this.nuevo_contacto = clone(this.value[index]);
            if (this.nuevo_contacto.tipo.id === 1 || this.nuevo_contacto.tipo.id === 2) {
                let params = this.nuevo_contacto.valor.substring(1, this.nuevo_contacto.valor.length).split('-')
                if (!this.nuevo_contacto.valor[0] == '+') params[0] = '54';
                this.nuevo_telefono = new Telefono(...params);
            }
        },

        cancelarEditContacto: function() {
            this.contacto_edit = null;
            this.nuevo_contacto = new Contacto();
            this.nuevo_telefono = new Telefono();
            this.$refs.form_contacto.reset();
        },

        borrar: function(index) {
            let contactos = clone(this.value);
            contactos.splice(index, 1);
            this.$emit('input', contactos);
        },
    }

}
</script>

<style>

</style>
