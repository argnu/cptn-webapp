<template>
  <v-container>
    <v-toolbar class="darken-3" color="primary">
      <v-toolbar-title class="white--text">Nueva Persona</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-card-text class="grey lighten-4">
        <v-container>
            <v-form ref="form">
                <v-layout>
                    <v-flex xs12 class="mx-4">
                        <v-select
                        label="Tipo"
                        :disabled="tipo != undefined && tipo != null"
                        :items="opciones_globales.tipo_persona"
                        :rules="[rules.required]"
                        v-model="persona.tipo"
                        ></v-select>
                    </v-flex>
                </v-layout>

                <v-layout row>
                    <v-flex xs6 class="mx-4">
                        <input-numero
                            v-if="persona.tipo == 'fisica'"
                            label="DNI"
                            maxlength="8"
                            clearable
                            v-model="persona.dni"
                            :rules="[rules.required, rules.integer]"
                        ></input-numero>

                        <input-texto
                            label="Nombre"
                            maxlength="100"
                            uppercase
                            v-model="persona.nombre"
                            :rules="[rules.required]"
                        ></input-texto>

                        <v-select
                            v-if="persona.tipo == 'fisica'"
                            autocomplete
                            :items="global_state.opciones.sexo"
                            item-text="valor"
                            item-value="id"
                            label="Sexo"
                            single-line
                            bottom
                            v-model="persona.sexo"
                        ></v-select>

                        <input-fecha
                            v-if="persona.tipo == 'fisica'"
                            v-model="persona.fechaNacimiento"
                            label="Fecha de Nacimiento"
                            :rules="[rules.fecha]"
                        >
                        </input-fecha>

                        <v-text-field
                            label="Telefono"
                            maxlength="30"
                            v-model="persona.telefono"
                        ></v-text-field>
                    </v-flex>

                    <v-flex xs6 class="mx-4">
                        <input-texto
                            v-if="persona.tipo == 'fisica'"
                            label="Apellido"
                            type="letras"
                            uppercase
                            maxlength="100"
                            v-model="persona.apellido"
                            :rules="[rules.required]"
                        ></input-texto>

                        <input-numero
                            label="CUIT/CUIL"
                            maxlength="11"
                            v-model="persona.cuit"
                            :rules="persona.tipo == 'fisica' ? []: [rules.cuit]"
                        ></input-numero>

                        <v-select
                            v-if="persona.tipo == 'fisica'"
                            autocomplete
                            :items="global_state.opciones.estadocivil"
                            item-text="valor"
                            item-value="id"
                            label="Estado Civil"
                            single-line
                            bottom
                            v-model="persona.estadoCivil"
                        ></v-select>

                        <input-texto
                            v-if="persona.tipo == 'fisica'"
                            label="Nacionalidad"
                            type="letras"
                            uppercase
                            maxlength="45"
                            v-model="persona.nacionalidad"
                        ></input-texto>

                        <input-texto
                            v-if="persona.tipo == 'fisica'"
                            label="Lugar Nacimiento"
                            uppercase
                            maxlength="100"
                            v-model="persona.lugarNacimiento"
                        ></input-texto>
                    </v-flex>
                </v-layout>

                <v-layout row class="ma-3">
                    <v-flex xs12>
                        <v-btn
                            class="right green white--text"
                            @click.native="submitPersona"
                            :disabled="submit_persona"
                            :loading="submit_persona"
                            >
                            Guardar
                        <v-icon dark right>check_circle</v-icon>
                        </v-btn>

                        <v-btn class="right red white--text" @click.native="cancelar">
                            Cancelar
                            <v-icon dark right>block</v-icon>
                        </v-btn>
                    </v-flex>
                </v-layout>                 
            </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import api from '@/services/api'
import { clone, getFecha } from '@/utils'
import InputTexto from '@/components/base/InputTexto'
import InputFecha from '@/components/base/InputFecha'
import InputNumero from '@/components/base/InputNumero'
import MixinValidator from '@/components/mixins/MixinValidator'
import MixinGlobalState from '@/components/mixins/MixinGlobalState'
import { PersonaFisica, PersonaJuridica } from '@/model'

function crearPersona(tipo) {
    if (tipo == 'fisica') return new PersonaFisica();
    else return new PersonaJuridica();
}

export default {
    name: 'PersonaNueva',

    props: {
        id: [Number, String],
        dni: String,
        cuit: String,
        tipo: String,
        dialog: {
            type: Boolean,
            default: () => false
        }
    },

    mixins: [MixinGlobalState, MixinValidator],

    components: {
        InputTexto,
        InputFecha,
        InputNumero
    },


    data() {
        return {
            persona: {},
            submit_persona: false
        }
    },

    watch: {
        dni: function(new_dni) {
            this.persona.dni = new_dni;
        },

        cuit: function(new_cuit) {
            this.persona.cuit = new_cuit;
        }
    },

    created: function() {
        if (this.tipo) this.persona = crearPersona(this.tipo);
        else this.persona = new PersonaFisica();

        if (this.id) {
            api.get(`personas/${this.id}`)
            .then(r => {
                this.persona = r.data;
                if (this.persona.sexo) this.persona.sexo = this.persona.sexo.id;
                if (this.persona.estadoCivil) this.persona.estadoCivil = this.persona.estadoCivil.id;
                if (this.persona.fechaNacimiento) this.persona.fechaNacimiento = getFecha(this.persona.fechaNacimiento)
            })
            .catch(e => console.error(e));
        }
    },

    methods: {
        submitPersona: function() {
            if (this.$refs.form.validate()) {
                let persona = clone(this.persona);
                persona.nombre = persona.nombre.toUpperCase();
                persona.apellido = persona.apellido ? persona.apellido.toUpperCase() : null
                persona.nacionalidad = persona.nacionalidad ? persona.nacionalidad.toUpperCase() : null;
                persona.lugarNacimiento = persona.lugarNacimiento ? persona.lugarNacimiento.toUpperCase() : null;

                if (this.id) {
                    api.put(`/personas/${this.id}`, persona)
                    .then(r => {
                        this.snackOk('Persona modificada exitosamente!');
                        this.persona = crearPersona(this.tipo);
                        this.$refs.form.reset();
                        if (this.dialog) this.$emit('updated', persona);
                        else this.$router.replace('/personas/lista');
                    })
                    .catch(e => this.snackError(e))
                }
                else {
                    api.post('/personas', persona)
                    .then(r => {
                        this.snackOk('Persona agregada exitosamente!');
                        this.persona = crearPersona(this.tipo);
                        this.$refs.form.reset();
                        persona.id = r.data.id;
                        if (this.dialog) this.$emit('created', persona);
                        else this.$router.replace('/personas/lista');
                    })
                    .catch(e => this.snackError(e))
                }
            }
        },

        cancelar: function() {
            if (this.dialog) this.$emit('cancelar');
            else this.$router.go(-1);
        }
    }

}
</script>

<style>

</style>
