<template>
  <v-container>
    <v-card class="elevation-4">
        <v-card-title>
            <span class="subheading blue--text text--darken-4"><b>Datos Personales</b></span>
        </v-card-title>
      <v-card-text>
          <v-layout row>
              <v-flex xs4 class="mx-4">
                <v-text-field
                    label="DNI"
                    v-model="matricula.persona.dni"
                    :rules="submitted ? validator.persona.dni : []"
                    :error="submitted && !validControl(validator.persona.dni, matricula.persona.dni)"                    
                    @input="chgDni"
                ></v-text-field>

                <v-text-field
                    label="CUIT/CUIL"
                    v-model="matricula.persona.cuit"
                ></v-text-field>
              </v-flex>

              <v-flex xs4>
                <v-text-field
                    label="Nombre"
                    v-model="matricula.persona.nombre"
                    :rules="submitted ? validator.persona.nombre : []"
                    :error="submitted && !validControl(validator.persona.nombre, matricula.persona.nombre)"                    
                ></v-text-field>  

                <v-text-field
                    label="Teléfono"
                    v-model="matricula.persona.telefono"
                ></v-text-field>                  
              </v-flex>

              <v-flex xs4 class="mx-4">
                <v-text-field
                    label="Apellido"
                    v-model="matricula.persona.apellido"
                    :rules="submitted ? validator.persona.apellido : []"
                    :error="submitted && !validControl(validator.persona.apellido, matricula.persona.apellido)"                    
                ></v-text-field>                  
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
                <v-text-field
                    label="N° Matrícula"
                    v-model="matricula.numeroMatricula"
                    :rules="submitted ? validator.numeroMatricula : []"
                    :error="submitted && !validControl(validator.numeroMatricula, matricula.numeroMatricula)"                    
                ></v-text-field>
              </v-flex>

              <v-flex xs4>
                <v-text-field
                    label="Nombre Institución"
                    v-model="matricula.nombreInstitucion"
                    :rules="submitted ? validator.nombreInstitucion : []"
                    :error="submitted && !validControl(validator.nombreInstitucion, matricula.nombreInstitucion)"                    
                ></v-text-field>                 
              </v-flex>

              <v-flex xs4 class="mx-4">              
              </v-flex>
          </v-layout>
      </v-card-text>
    </v-card>

    <v-btn class="blue darken-1 white--text right mt-4" @click.native="submit" :disabled="!valid_form">
        Agregar Matrícula
    <v-icon dark right>check_circle</v-icon>
    </v-btn>    
  </v-container>
</template>

<script>

import axios from '@/axios'
import { PersonaFisica } from '@/model/Persona'
import rules from '@/rules'
import ValidatorMixin from '@/components/mixins/ValidatorMixin'

class Matricula {
    constructor() {
        this.persona = new PersonaFisica();
        this.numeroMatricula = '';
        this.nombreInstitucion = '';
    }
}

export default {
    name: 'NuevaMatriculaExterna',
    mixins: [ValidatorMixin],

    data() {
        return {
            matricula: new Matricula(),
            submitted: false,
            validator: {
                persona: {
                    nombre: [ rules.required ], dni: [ rules.required, rules.number ],
                    apellido: [ rules.required ]
                },
                numeroMatricula: [ rules.required ],
                nombreInstitucion: [ rules.required ]
            },            
        }
    },

    computed: {
        valid_form: function() {
            return true;
        }
    },

    methods: {
        submit: function() {
            this.submitted = true;
            if (this.valid_form) {
                axios.post('/matriculas-externas', this.matricula)
                .then(r => {
                    if (r.status == 201) {
                        this.global_state.snackbar.msg = 'Matriculado externo cargado exitosamente';
                        this.global_state.snackbar.color = 'success';
                        this.global_state.snackbar.show = true;       
                        this.$emit('nueva');
                    }
                })
                .catch(e => console.error(e));
            }
        },

        chgDni: function() {
            axios.get(`/personas?dni=${this.matricula.persona.dni}`)
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
            .catch(e => console.error(e));            
        }
    }

}
</script>

<style>

</style>
