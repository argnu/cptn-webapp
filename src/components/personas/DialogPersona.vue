<template>
  <v-dialog
    persistent
    fullscreen
    :value="value"
    @input="$emit('input', $event)"
  >
    <v-toolbar class="darken-3" color="primary">
      <v-toolbar-title class="white--text">Nueva Persona</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-card-text class="grey lighten-4">
        <v-container>
            <v-form ref="form">
                <v-layout row>
                    <v-flex xs6 class="ma-4">
                        <input-numero
                            v-if="tipo == 'fisica'"
                            label="DNI"
                            maxlength="10"
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
                            v-if="tipo == 'fisica'"
                            autocomplete
                            :items="opciones.sexo"
                            item-text="valor"
                            item-value="id"
                            label="Sexo"
                            single-line
                            bottom
                            v-model="persona.sexo"
                            :rules="[rules.required]"
                        ></v-select>

                        <input-fecha
                            v-if="tipo == 'fisica'"
                            v-model="persona.fechaNacimiento"
                            label="Fecha de Nacimiento"
                            :rules="[rules.required, rules.fecha]"
                        >
                        </input-fecha>

                        <v-text-field
                            label="Telefono"
                            maxlength="30"
                            v-model="persona.telefono"
                        ></v-text-field>                         
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                        <input-texto
                            v-if="tipo == 'fisica'"
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
                            :rules="[rules.cuit]"
                        ></input-numero>

                        <v-select
                            v-if="tipo == 'fisica'"
                            autocomplete
                            :items="opciones.estadocivil"
                            item-text="valor"
                            item-value="id"
                            label="Estado Civil"
                            single-line
                            bottom
                            v-model="persona.estadoCivil"
                            :rules="[rules.required]"
                        ></v-select>

                        <input-texto
                            v-if="tipo == 'fisica'"
                            label="Nacionalidad"
                            type="letras"
                            uppercase
                            maxlength="45"
                            v-model="persona.nacionalidad"
                        ></input-texto>

                        <input-texto
                            v-if="tipo == 'fisica'"
                            label="Lugar Nacimiento"
                            uppercase
                            maxlength="100"
                            v-model="persona.lugarNacimiento"
                        ></input-texto>                       
                    </v-flex>
                    </v-layout>
            </v-form>

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

                <v-btn class="right red white--text" @click.native="$emit('input', false)">
                  Cancelar
                  <v-icon dark right>block</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import api from '@/services/api'
import { clone } from '@/utils'
import InputTexto from '@/components/base/InputTexto'
import InputFecha from '@/components/base/InputFecha'
import InputNumero from '@/components/base/InputNumero'
import MixinValidator from '@/components/mixins/MixinValidator'
import { PersonaFisica, PersonaJuridica } from '@/model'

function crearPersona(tipo) {
    if (tipo == 'fisica') return new PersonaFisica();
    else return new PersonaJuridica();
}

export default {
    name: 'DialogPersona',

    props: {
        value: Boolean,
        dni: String,
        cuit: String,
        tipo: {
            type: String,
            default: () => 'fisica'
        }
    },

    mixins: [MixinValidator],

    components: {
        InputTexto,
        InputFecha,
        InputNumero
    },

    data() {
        return {
            persona: crearPersona(this.tipo),
            opciones: {},
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
        api.get('/opciones?sort=valor')
        .then(r => {
            this.opciones = r.data;
        })
        .catch(e => console.error(e));
    },

    methods: {
        submitPersona: function() {
            if (this.$refs.form.validate()) {
                let persona = clone(this.persona);
                persona.tipo = this.tipo;
                persona.nombre = persona.nombre.toUpperCase();
                persona.apellido = persona.apellido ? persona.apellido.toUpperCase() : null
                persona.nacionalidad = persona.nacionalidad ? persona.nacionalidad.toUpperCase() : null;
                persona.lugarNacimiento = persona.lugarNacimiento ? persona.lugarNacimiento.toUpperCase() : null;

                api.post('/personas', persona)
                .then(r => {
                    this.persona = crearPersona(this.tipo);
                    this.$refs.form.reset();
                    this.$emit('created', persona);
                })
                .catch(e => console.error(e));
            }
        }
    }

}
</script>

<style>

</style>
