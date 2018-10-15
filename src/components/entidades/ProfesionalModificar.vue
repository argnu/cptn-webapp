<template>
  <v-container v-if="profesional">
    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">Modificación de Datos del Profesional</v-toolbar-title>
    </v-toolbar>

    <v-card>
        <br>
        <span class="subheading blue--text text--darken-4 ml-4"><b>Datos Básicos</b></span>

        <v-form ref="form_profesional" v-model="valid.form_profesional">
        <v-layout row>
        <v-flex xs6 class="ma-4">
            <input-numero
                label="DNI"
                v-model="profesional.dni"
                :rules="[rules.required, rules.integer, rules.dni]"
                tabindex="3"
                maxlength="8"
                clearable
            >
            </input-numero>

            <input-texto
                label="Nombre"
                v-model="profesional.nombre"
                tabindex="5"
                maxlength="100"
                uppercase
                :rules="[rules.required]"
            >
            </input-texto>

            <v-select
                autocomplete
                label="Sexo"
                tabindex="7"
                :items="global_state.opciones.sexo"
                item-text="valor"
                item-value="id"
                return-object
                v-model="profesional.sexo"
                :rules="[rules.required]"
            >
            </v-select>

            <input-fecha
                v-model="profesional.fechaNacimiento"
                label="Fecha de Nacimiento"
                tabindex="9"
                :rules="[rules.required, rules.fecha]"
            >
            </input-fecha>

            <input-texto
                label="Nacionalidad"
                type="letras"
                uppercase
                v-model="profesional.nacionalidad"
                maxlength="45"
                tabindex="11"
            ></input-texto>
        </v-flex>

        <v-flex xs6 class="ma-4">
            <input-texto
                label="Apellido"
                type="letras"
                uppercase
                v-model="profesional.apellido"
                :rules="[rules.required]"
                maxlength="100"
                tabindex="4"
            ></input-texto>

            <input-numero
                label="CUIT/CUIL"
                v-model="profesional.cuit"
                :rules="[rules.cuit]"
                tabindex="6"
                maxlength="11"
            >
            </input-numero>

            <v-select
                autocomplete
                tabindex="8"
                :items="global_state.opciones.estadocivil"
                item-text="valor"
                item-value="id"
                return-object
                v-model="profesional.estadoCivil"
                label="Estado Civil"
                single-line bottom
                :rules="[rules.required]"
            ></v-select>

            <input-texto
                label="Lugar Nacimiento"
                uppercase
                v-model="profesional.lugarNacimiento"
                maxlength="100"
                tabindex="10"
            ></input-texto>

            <input-texto
                label="Observaciones"
                uppercase
                v-model="profesional.observaciones"
                tabindex="12"
            ></input-texto>
        </v-flex>
        </v-layout>

        <v-layout row>
        <v-flex xs12 class="mx-4">
            <profesional-add-foto
                edit
                :url="profesional_foto"
                @change="chgFoto"
            ></profesional-add-foto>
        </v-flex>
        </v-layout>

        <v-layout row class="mx-4 mt-4">
        <v-flex xs12 class="mt-4">
            <profesional-add-firma
            edit
            :url="profesional_firma"
            @change="chgFirma"
            ref="firma"
            ></profesional-add-firma>
        </v-flex>
        </v-layout>
        </v-form>

        <br>
        <v-divider></v-divider>
        <br>

        <span class="subheading blue--text text--darken-4 ml-4"><b>Domicilios</b></span>

        <v-layout row class="my-4">
            <v-flex x12>
                <entidad-domicilios
                    tabindex="13"
                    v-model="profesional.domicilios"
                ></entidad-domicilios>
            </v-flex>
        </v-layout>

        <v-divider></v-divider>
        <br>


        <span class="subheading blue--text text--darken-4 ml-4"><b>Contactos</b></span>
        <v-layout row class="my-4">
            <v-flex x12>
                <entidad-contactos
                    tabindex="13"
                    :opciones="global_state.opciones.contacto"
                    v-model="profesional.contactos"
                ></entidad-contactos>
            </v-flex>
        </v-layout>

        <br>
        <v-divider></v-divider>
        <br>


        <span class="subheading blue--text text--darken-4 ml-4"><b>Condición Impositiva</b></span>
        <v-layout row class="my-4">
            <v-flex x12>
                <entidad-condicion-afip
                    tabindex="18"
                    :opciones="global_state.opciones.condicionafip"
                    v-model="profesional.condiciones_afip"
                ></entidad-condicion-afip>
            </v-flex>
        </v-layout>

        <br>
        <v-divider></v-divider>
        <br>

        <span class="subheading blue--text text--darken-4 ml-4"><b>Formación Académica</b></span>
        <v-layout row class="my-4">
            <v-flex x12>
                <profesional-formaciones
                    tabindex="21"
                    :niveles="global_state.opciones.niveles_titulos"
                    v-model="profesional.formaciones"
                ></profesional-formaciones>
            </v-flex>
        </v-layout>

        <v-alert color="error" icon="priority_high" :value="!valid_formaciones">
            Debe ingresar al menos un título para el profesional
        </v-alert>

        <br>
        <v-divider></v-divider>
        <br>

        <span class="subheading blue--text text--darken-4 ml-4"><b>Relación Laboral</b></span>
        <v-layout row class="mt-4 ml-4">
            <v-flex xs6 class="ma-4">
                <v-checkbox
                tabindex="28"
                label="Relación de Dependencia" class="mb-4" v-model="profesional.relacionDependencia">
                </v-checkbox>

                <v-checkbox
                tabindex="30"
                label="Profesional Independiente" class="mb-4" v-model="profesional.independiente">
                </v-checkbox>

                <v-checkbox
                tabindex="32"
                label="Jubilado" class="mb-4" v-model="profesional.jubilado">
                </v-checkbox>
            </v-flex>

            <v-flex xs6 class="mr-4 mt-4">
                <input-texto
                    tabindex="29"
                    maxlength="100"
                    label="Empresa"
                    uppercase
                    :disabled="!profesional.relacionDependencia"
                    v-model="profesional.empresa"
                ></input-texto>

                <input-texto
                    tabindex="31"
                    maxlength="100"
                    label="Servicios Prestados"
                    uppercase
                    :disabled="!profesional.independiente"
                    v-model="profesional.serviciosPrestados"
                ></input-texto>
            </v-flex>
        </v-layout>

        <v-divider></v-divider>
        <br>


        <span class="subheading blue--text text--darken-4 ml-4"><b>Cajas Previsionales</b></span>
        <v-layout row class="my-4">
            <v-flex x12>
            <profesional-cajas-previsionales
                tabindex="33"
                v-model="profesional.cajas_previsionales"
            ></profesional-cajas-previsionales>
            </v-flex>
        </v-layout>

        <br>
        <v-divider></v-divider>
        <br>


        <span class="subheading blue--text text--darken-4 ml-4"><b>Subsidio Por Fallecimiento</b></span>
        <v-layout row class="my-4">
            <v-flex x12>
                <profesional-subsidiarios
                    tabindex="35"
                    v-model="profesional.subsidiarios"
                ></profesional-subsidiarios>

                <v-alert color="error" icon="priority_high" :value="!valid_subsidiarios">
                    Los porcentajes deben sumar 100%
                </v-alert>
            </v-flex>
        </v-layout>


        <br>
        <v-divider></v-divider>
        <br>


        <span class="subheading blue--text text--darken-4 ml-4"><b>Publicación de Datos</b></span>
        <v-layout row class="ma-4">
            <v-flex x12>
            <v-checkbox tabindex="40" label="De Acuerdo" v-model="deAcuerdo"></v-checkbox>

                <h3>Permitir la publicación de los datos:</h3>

                <v-checkbox
                    tabindex="41"
                    class="mt-4"
                    label="Todos"
                    @change="chgPublicarTodos"
                    v-model="publicar_todos"
                ></v-checkbox>

                <v-layout row class="mt-2">
                <v-flex xs6>
                    <v-checkbox
                    tabindex="42"
                    label="Email"
                    v-model="profesional.publicarEmail"
                    >
                    </v-checkbox>

                    <v-checkbox
                    tabindex="43"
                    label="Celular"
                    v-model="profesional.publicarCelular"
                    >
                    </v-checkbox>
                </v-flex>

                <v-flex xs6>
                    <v-checkbox
                    tabindex="44"
                    label="Dirección"
                    v-model="profesional.publicarDireccion"
                    >
                    </v-checkbox>

                    <v-checkbox
                    tabindex="45"
                    label="Acervo"
                    v-model="profesional.publicarAcervo"
                    >
                    </v-checkbox>
                </v-flex>
                </v-layout>

                <br>

                <v-checkbox
                    tabindex="46"
                    class="ma-0 pa-0" label="Recibir Actualizaciones" v-model="profesional.recibirActualizaciones"
                ></v-checkbox>
            </v-flex>
        </v-layout>
        <br>

        <v-layout row wrap>
          <v-flex xs12 class="ma-4">
            <v-btn
              :dark="!guardando"
              class="green right"
              :disabled="guardando"
              :loading="guardando"
              @click="submit"
            >
              Guardar
              <v-icon right>check_circle</v-icon>
            </v-btn>

            <v-btn dark class="red right" @click="$router.go(-1)">
              Cancelar
              <v-icon dark right>block</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>

    </v-card>
</v-container>
</template>

<script>
import Vue from 'vue'
import moment from 'moment'
import api from '@/services/api'
import * as utils from '@/utils'
import rules from '@/validation/rules.js'
import MixinValidator from '@/components/mixins/MixinValidator';
import MixinGlobalState from '@/components/mixins/MixinGlobalState'
import { Profesional } from '@/model';
import InputTexto from '@/components/base/InputTexto'
import InputFecha from '@/components/base/InputFecha'
import InputNumero from '@/components/base/InputNumero'
import ProfesionalAddFoto from '@/components/entidades/ProfesionalAddFoto'
import ProfesionalAddFirma from '@/components/entidades/ProfesionalAddFirma'
import EntidadDomicilios from '@/components/entidades/EntidadDomicilios'
import EntidadContactos from '@/components/entidades/EntidadContactos'
import EntidadCondicionAfip from '@/components/entidades/EntidadCondicionAfip'
import ProfesionalFormaciones from '@/components/entidades/ProfesionalFormaciones'
import ProfesionalCajasPrevisionales from '@/components/entidades/ProfesionalCajasPrevisionales'
import ProfesionalSubsidiarios from '@/components/entidades/ProfesionalSubsidiarios'

export default {
    name: 'ProfesionalModificar',

    props: ['id'],

    mixins: [MixinGlobalState, MixinValidator],

    components: {
        InputTexto,
        InputFecha,
        InputNumero,
        ProfesionalAddFoto,
        ProfesionalAddFirma,
        EntidadDomicilios,
        EntidadContactos,
        EntidadCondicionAfip,
        ProfesionalFormaciones,
        ProfesionalCajasPrevisionales,
        ProfesionalSubsidiarios
    },

    data() {
        return {
            profesional: null,
            foto: null,
            firma: null,
            deAcuerdo: true,
            publicar_todos: false,
            delegaciones: [],
            guardando: false,
            valid: {
                form_profesional: true
            }
        }
    },

    computed: {
        profesional_foto: function() {
            return this.profesional.foto ? `${this.profesional.foto}?${Date.now()}` : '';
        },

        profesional_firma: function() {
            return this.profesional.firma ? `${this.profesional.firma}?${Date.now()}` : '';
        },

        valid_domicilios: function() {
            return this.profesional.domicilios.length > 0;
        }, 

        suma_subsidiarios: function() {
            if (!this.profesional.subsidiarios.length) return 0;
            return this.profesional.subsidiarios.reduce((prev, act) => prev + +act.porcentaje, 0);
        },

        valid_subsidiarios: function() {
            return this.suma_subsidiarios === 100 || this.profesional.subsidiarios.length === 0;
        },

        valid_formaciones: function() {
            return this.profesional.formaciones.length > 0;
        },

        valid_form: function() {
            return this.valid.form_profesional && this.valid_subsidiarios && this.valid_domicilios && this.valid_formaciones;
        }
    },

    created: function() {
        Promise.all([
            api.get(`/profesionales/${this.id}`),
            api.get('/delegaciones')
        ])
        .then(r => {
            this.profesional = utils.clone(r[0].data);
            this.profesional.fechaNacimiento = utils.getFecha(r[0].data.fechaNacimiento)

            this.profesional.formaciones = [];
            for(let formacion of r[0].data.formaciones) {
                let formacion_nueva = formacion;
                formacion_nueva.tiempoEmision = utils.diffDatesStr(moment(formacion.fechaEmision), moment());
                this.profesional.formaciones.push(formacion_nueva);
            }

            r[0].data.subsidiarios.forEach(s => {
                s.dni = s.persona.dni;
                s.apellido = s.persona.apellido;
                s.nombre = s.persona.nombre;
                s.persona = s.persona.id;
            });
            this.profesional.subsidiarios = r[0].data.subsidiarios;

            this.delegaciones = r[1].data;
            this.show_cargando = false;
        })
        .catch(e => console.error(e));
    },

    methods: {
        chgFoto: function(foto) {
            this.foto = foto;
        },

        chgFirma: function(firma) {
            this.firma = firma;
        },

        chgPublicarTodos: function() {
            this.profesional.publicarEmail = this.publicar_todos;
            this.profesional.publicarDireccion = this.publicar_todos;
            this.profesional.publicarAcervo = this.publicar_todos;
            this.profesional.publicarCelular = this.publicar_todos;
        },

        prepare: function() {
            let profesional = utils.clone(this.profesional);

            profesional.nombre = profesional.nombre.toUpperCase();
            profesional.nacionalidad = profesional.nacionalidad ? profesional.nacionalidad.toUpperCase() : null;
            profesional.apellido = profesional.apellido.toUpperCase();
            profesional.lugarNacimiento = profesional.lugarNacimiento ? profesional.lugarNacimiento.toUpperCase() : null;
            profesional.observaciones = profesional.observaciones ? profesional.observaciones.toUpperCase() : null;
            profesional.empresa = profesional.empresa ? profesional.empresa.toUpperCase() : null;
            profesional.serviciosPrestados = profesional.serviciosPrestados ? profesional.serviciosPrestados.toUpperCase() : null;

            
            if (this.foto) profesional.foto = this.foto;
            else profesional.foto = null;
            if (this.firma) profesional.firma = this.firma;
            else profesional.firma = null;

            profesional.sexo = profesional.sexo.id;
            profesional.estadoCivil = profesional.estadoCivil.id;

            profesional.domicilios.forEach(d => {
                d.domicilio.pais = d.domicilio.pais.id;
                d.domicilio.provincia = d.domicilio.provincia.id;
                d.domicilio.departamento = d.domicilio.departamento.id;
                d.domicilio.localidad = d.domicilio.localidad.id;
            });

            profesional.contactos.forEach(c => {
                c.tipo = c.tipo.id;
            });

            profesional.condiciones_afip.forEach(c => {
                c.condicion_afip = c.condicion_afip.id;
            });

            profesional.formaciones.forEach(f => {
                f.titulo = f.titulo.id;
            });

            profesional.cajas_previsionales = profesional.cajas_previsionales.map(c => {
                if (c.caja) return c;
                else return c.id;
            });

            return profesional;
        },

        submit: function() {
            if (this.$refs.form_profesional.validate()) {
                if (this.valid_form) {
                    this.guardando = true;
                    api.put(`/profesionales/${this.id}`, this.prepare())
                    .then(r => {
                        this.guardando = false;
                        this.global_state.snackbar.msg = 'Profesional actualizado exitosamente!';
                        this.global_state.snackbar.color = 'success';
                        this.global_state.snackbar.show = true;
                        this.$router.go(-1);
                    })
                    .catch(e => {
                        this.submitError(e);
                        this.guardando = false;
                    });
                }
                else alert("El formulario es inválido. Por favor revise los datos ingresados")
            }
            else alert("El formulario es inválido. Por favor revise los datos ingresados")
        },
    }

}
</script>

<style>

</style>
