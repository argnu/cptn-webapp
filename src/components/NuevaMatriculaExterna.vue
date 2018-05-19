<template>
  <v-container>
    <v-form ref="form_matricula" v-model="valid_form">

    <v-card class="elevation-4">
        <v-card-title>
            <span class="subheading blue--text text--darken-4"><b>Datos Personales</b></span>
        </v-card-title>
      <v-card-text>          
          <v-layout row>
              <v-flex xs4 class="mx-4">
                <input-numero
                    label="DNI"
                    maxlength="8"
                    v-model="matricula.persona.dni"
                    :rules="[rules.required, rules.number]"
                    @input="chgDni"
                ></input-numero>

                <input-numero
                    maxlength="11"
                    label="CUIT/CUIL"
                    v-model="matricula.persona.cuit"
                    :rules="[rules.cuit]"
                ></input-numero>
              </v-flex>

              <v-flex xs4>
                <input-texto
                    label="Nombre"
                    type="letras"
                    uppercase
                    v-model="matricula.persona.nombre"
                    :rules="[rules.required]"
                ></input-texto>  

                <v-text-field
                    label="Teléfono"
                    v-model="matricula.persona.telefono"
                ></v-text-field>                  
              </v-flex>

              <v-flex xs4 class="mx-4">
                <input-texto
                    type="letras"
                    label="Apellido"
                    uppercase
                    v-model="matricula.persona.apellido"
                    :rules="[rules.required]"
                ></input-texto>                  
              </v-flex>
          </v-layout>
      </v-card-text>
    </v-card>

    <br>

    <v-card class="elevation-4">
        <v-card-title>
            <span class="subheading blue--text text--darken-4"><b>Datos de Matrícula</b></span>
        </v-card-title>
      <v-card-text>
          <v-layout row>
              <v-flex xs4 class="mx-4">
                <input-texto
                    label="N° Matrícula"
                    uppercase
                    v-model="matricula.numeroMatricula"
                    :rules="[rules.required]"
                ></input-texto>
              </v-flex>

              <v-flex xs4>
                <input-texto
                    label="Nombre Institución"
                    uppercase
                    v-model="matricula.nombreInstitucion"
                    :rules="[rules.required]"
                ></input-texto>                 
              </v-flex>

              <v-flex xs4 class="mx-4">              
              </v-flex>
          </v-layout>
      </v-card-text>
    </v-card>

    </v-form>

    <v-btn class="blue darken-1 white--text right mt-4" 
        @click.native="submit" 
        :disabled="!valid_form || submitted"
        :loading="submitted"
    >
        Agregar Matrícula
    <v-icon dark right>check_circle</v-icon>
    </v-btn>    
  </v-container>
</template>

<script>

import api from '@/services/api'
import { PersonaFisica } from '@/model/Persona'
import rules from '@/validation/rules.js'
import MixinValidator from '@/components/mixins/MixinValidator'
import InputNumero from '@/components/base/InputNumero'
import InputTexto from '@/components/base/InputTexto'

class Matricula {
    constructor() {
        this.persona = new PersonaFisica();
        this.numeroMatricula = '';
        this.nombreInstitucion = '';
    }
}

export default {
    name: 'NuevaMatriculaExterna',
    mixins: [MixinValidator],

    components: {
        InputTexto,
        InputNumero
    },

    data() {
        return {
            matricula: new Matricula(),
            submitted: false,    
            valid_form: false       
        }
    },

    methods: {
        submit: function() {
            this.submitted = true;
            if (this.$refs.form_matricula.validate()) {
                api.post('/matriculas-externas', this.matricula)
                .then(r => {
                    if (r.status == 201) {
                        this.matricula = new Matricula();
                        this.submitted = false;
                        this.global_state.snackbar.msg = 'Matriculado externo cargado exitosamente';
                        this.global_state.snackbar.color = 'success';
                        this.global_state.snackbar.show = true;       
                        this.$emit('nueva');
                        this.$refs.form_matricula.reset();
                    }
                })
                .catch(e => {
                    this.submitted = false;
                    this.showError(e)
                });
            }
        },

        chgDni: function() {
            api.get(`/personas?dni=${this.matricula.persona.dni}`)
            .then(r => {
                if (r.data.length) {
                    let persona = r.data.find(p => p.dni == this.matricula.persona.dni);
                    if (persona) { 
                        this.matricula.persona = persona;
                    }
                    else { 
                        let dni = this.matricula.persona.dni;
                        this.matricula.persona = new PersonaFisica();
                        this.matricula.persona.dni = dni;
                    };
                }
            })
            .catch(e => {
                this.submitted = false;
                this.showError(e)
            });   
        }
    }

}
</script>

<style>

</style>
