<template>

  <v-app>
    <v-container>
    <v-toolbar dark class="primary">
      <v-toolbar-side-icon></v-toolbar-side-icon>
      <v-toolbar-title class="white--text">Matriculaciones CPTN</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>
    </v-toolbar>

      <v-snackbar
        :timeout="6000"
        :bottom="true"
        :right="true"
        :success="snackbar.context === 'success'"
        :error="snackbar.context === 'error'"
        v-model="snackbar.show"
      >
        {{ snackbar.msg }}
        <v-btn flat class="white--text" @click.native="snackbar.show = false">Cerrar</v-btn>
      </v-snackbar>


      <v-layout row wrap>
        <v-flex xs8>
          <form v-on:submit.prevent="submit">
          <v-toolbar class="indigo" dark>
            <v-toolbar-title class="white--text">Solicitud de Matriculación de Profesionales</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-container>
             <v-stepper v-model="step" vertical>

               <!-- PASO 1: DATOS DE SOLICITUD -->
                <v-stepper-step step="1" editable v-bind:complete="step > 1">
                 Datos de la Solicitud
                </v-stepper-step>
                <v-stepper-content step="1">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                      <v-card-text>
                        <v-layout row>
                          <v-flex xs6>
                            <input-fecha v-model="solicitud.fecha" label="Fecha de Solicitud">
                            </input-fecha>
                          </v-flex>
                          <v-flex xs6 class="ml-5">
                            <v-select
                              autocomplete
                              v-bind:items="select_items.delegacion" v-model="solicitud.delegacion"
                              label="Delegación">
                            </v-select>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                    <v-btn primary @click.native="step = 2" class="right">Continuar</v-btn>
                </v-stepper-content>


                <!-- PASO 2: DATOS DE PROFESIONAL -->
                <v-stepper-step step="2" editable :complete="step > 2">
                  Datos del Profesional
                </v-stepper-step>
                <v-stepper-content step="2">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-layout row>
                        <v-flex xs6>
                          <v-text-field label="Nombre" v-model="solicitud.profesional.nombre"
                            tabindex="1">
                          </v-text-field>
                          <v-text-field label="DNI" v-model="solicitud.profesional.dni"
                            tabindex="3">
                          </v-text-field>
                          <v-select
                            :items="select_items.sexo" v-model="solicitud.profesional.sexo"
                            label="Sexo" single-line bottom tabindex="5">
                          </v-select>
                          <input-fecha
                              v-model="solicitud.profesional.fechaNacimiento"
                              label="Fecha de Nacimiento">
                          </input-fecha>
                          <v-text-field label="Nacionalidad" v-model="solicitud.profesional.nacionalidad"
                            tabindex="9">
                          </v-text-field>
                        </v-flex>
                        <v-flex xs6>
                          <v-text-field label="Apellido" v-model="solicitud.profesional.apellido"
                            tabindex="2">
                          </v-text-field>
                          <v-text-field label="CUIT" v-model="solicitud.profesional.cuit"
                            tabindex="4">
                          </v-text-field>
                          <v-select
                            tabindex="6"
                            :items="select_items.estadoCivil"
                            v-model="solicitud.profesional.estadoCivil"
                            label="Estado Civil"
                            single-line bottom>
                          </v-select>
                          <v-text-field label="Lugar Nacimiento" v-model="solicitud.profesional.lugarNacimiento"
                            tabindex="8">
                          </v-text-field>
                          <v-text-field label="Observaciones" v-model="solicitud.profesional.observaciones"
                            tabindex="10">
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="step = 3" class="right">Continuar</v-btn>
                  <v-btn flat @click.native="step = 1" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 3: DOMICILIOS -->
                <v-stepper-step step="3" editable :complete="step > 3">
                  Domicilios del Profesional
                </v-stepper-step>
                <v-stepper-content step="3">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                        Domicilio Real
                        <v-layout row>
                          <v-flex xs6>
                            <v-text-field label="Calle" v-model="solicitud.profesional.domicilioReal.calle">
                            </v-text-field>
                          </v-flex>
                          <v-flex xs6>
                            <v-text-field label="Nro" v-model="solicitud.profesional.domicilioReal.numero">
                            </v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout row>
                          <v-flex xs6>
                            <v-text-field label="Código Postal" v-model="solicitud.profesional.domicilioReal.codpostal">
                            </v-text-field>
                          </v-flex>
                          <v-flex xs6>
                            <v-select
                              autocomplete
                              :items="select_items.localidades"
                              label="Localidad"
                              v-model="solicitud.profesional.domicilioReal.localidad">
                            </v-select>
                          </v-flex>
                        </v-layout>

                        Domicilio Legal
                        <v-layout row>
                          <v-flex xs6>
                            <v-text-field label="Calle" v-model="solicitud.profesional.domicilioLegal.calle">
                            </v-text-field>
                          </v-flex>
                          <v-flex xs6>
                            <v-text-field label="Nro" v-model="solicitud.profesional.domicilioLegal.numero">
                            </v-text-field>
                          </v-flex>
                        </v-layout>
                        <v-layout row>
                          <v-flex xs6>
                            <v-text-field label="Código Postal" v-model="solicitud.profesional.domicilioLegal.codpostal">
                            </v-text-field>
                          </v-flex>
                          <v-flex xs6>
                            <v-select
                              :items="select_items.localidades"
                              label="Localidad"
                              single-line bottom
                              v-model="solicitud.profesional.domicilioLegal.localidad">
                            </v-select>
                          </v-flex>
                        </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="step = 4" class="right">Continuar</v-btn>
                  <v-btn flat @click.native="step = 2" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 4: CONTACTOS -->
                <v-stepper-step step="4" editable :complete="step > 4">
                  Datos de Contacto
                </v-stepper-step>
                <v-stepper-content step="4">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-container>
                        <v-layout row>
                          <v-flex xs6>
                            <v-select
                              :items="select_items.tipoContacto"
                              label="Tipo de Contacto"
                              single-line
                              bottom
                              v-model="nuevo_contacto.tipo">
                            </v-select>
                          </v-flex>
                          <v-flex xs6>
                            <v-text-field label="Valor" v-model="nuevo_contacto.valor">
                            </v-text-field>
                          </v-flex>
                          <v-btn light @click="addContacto">Agregar</v-btn>
                        </v-layout>

                        <v-data-table
                            :headers="headers.contacto"
                            :items="solicitud.profesional.contactos"
                            hide-actions
                            class="elevation-1"
                            no-data-text="No hay contactos">
                          <template slot="headers" scope="props">
                            <th v-for="header of props.headers" style="padding: 20px">
                              {{ header }}
                            </th>
                            <th></th>
                          </template>
                          <template slot="items" scope="props">
                            <td>{{ props.item.tipo }}</td>
                            <td>{{ props.item.valor }}</td>
                            <td style="width:30px">
                              <v-btn icon @click="removeContacto(props.index)">
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </td>
                          </template>
                        </v-data-table>
                      </v-container>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="step = 5" class="right">Continuar</v-btn>
                  <v-btn flat @click.native="step = 3" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 5: FORMACIONES -->
                <v-stepper-step step="5" editable :complete="step > 5">
                  Datos de Formación Académica
                </v-stepper-step>
                <v-stepper-content step="5">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-container>
                        <v-layout row>
                          <v-flex xs6>
                            <v-select
                              :items="['Grado', 'Posgrado']"
                              label="Tipo de Formación"
                              single-line
                              bottom
                              v-model="nueva_formacion.tipo">
                            </v-select>
                            <v-text-field label="Título" v-model="nueva_formacion.titulo">
                            </v-text-field>
                          </v-flex>
                          <v-flex xs6>
                            <input-fecha
                                v-model="nueva_formacion.fecha"
                                label="Fecha">
                            </input-fecha>
                            <v-text-field label="Institución" v-model="nueva_formacion.institucion">
                            </v-text-field>
                          </v-flex>
                        </v-layout>

                        <v-btn light @click="addFormacion" style="float:right">Agregar</v-btn>
                        <br style="clear:both">


                        <v-data-table
                            :headers="headers.formacion"
                            :items="solicitud.profesional.formaciones"
                            hide-actions
                            class="elevation-1"
                            no-data-text="No hay formaciones"
                            style="margin-top:30px">
                          <template slot="headers" scope="props">
                            <th v-for="header of props.headers" style="padding: 20px">
                              {{ header.text }}
                            </th>
                            <th></th>
                          </template>
                          <template slot="items" scope="props">
                            <td>{{ props.item.tipo }}</td>
                            <td>{{ props.item.titulo }}</td>
                            <td>{{ props.item.fecha }}</td>
                            <td>{{ props.item.institucion }}</td>
                            <td style="width:30px">
                              <v-btn icon @click="removeFormacion(props.index)">
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </td>
                          </template>
                        </v-data-table>
                      </v-container>
                    </v-card-text>
                  </v-card>
                  <v-btn class="primary white--text right" @click.native="submit">
                    Guardar Solicitud
                    <v-icon dark right>check_circle</v-icon>
                  </v-btn>
                  <v-btn flat @click.native="step = 4" class="right">Volver</v-btn>
                </v-stepper-content>

              </v-stepper>

          </v-container>

          <v-btn class="red white--text">Cancelar
          <v-icon dark right>block</v-icon>
          </v-btn>

          </form>
        </v-flex>

        <div class="stuck">
          <v-toolbar class="indigo" dark>
            <v-toolbar-title class="white--text">Datos del Profesional</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-container>
            <v-card>
              <v-card-text id="info-profesional">
                <div><b>Nombre: </b> {{ solicitud.profesional.nombre }} </div>
                <div><b>Apellido: </b> {{ solicitud.profesional.apellido }} </div>
                <div><b>DNI: </b> {{ solicitud.profesional.dni }} </div>
                <div><b>CUIT: </b> {{ solicitud.profesional.cuit }} </div>
                <div><b>Sexo: </b> {{ solicitud.profesional.sexo }} </div>
                <div><b>Estado Civil: </b> {{ solicitud.profesional.estadoCivil }} </div>
                <div><b>Fecha de Nacimiento: </b> {{ solicitud.profesional.fechaNacimiento }} </div>
                <div><b>Lugar de Nacimiento: </b> {{ solicitud.profesional.lugarNacimiento }} </div>
                <div><b>Nacionalidad: </b> {{ solicitud.profesional.nacionalidad }} </div>
                <div><b>Observaciones: </b> {{solicitud.profesional.observaciones }} </div>
              </v-card-text>
            </v-card>
          </v-container>
        </div>
      </v-layout>
    </v-container>
        <v-footer class="indigo">
      <span class="white--text"></span>
</v-footer>
  </v-app>
</template>

<script>
import * as axios from 'axios';
import * as utils from '@/utils';
import { Solicitud, Contacto, Formacion } from '@/model/Solicitud';
import InputFecha from '@/components/base/InputFecha';

export default {
  name: 'nueva-solicitud',
  data () {
    return {
      step: 1,

      snackbar: {
        msg: '',
        show: false,
        context: ''
      },

      select_items: {
        localidades: [
          {
            text: 'Neuquén',
            value: 1
          },
          {
            text: 'Neulen',
            value: 2
          },
          {
            text: 'Río Negro',
            value: 3
          },
          {
            text: 'Chos Malal',
            value: 4
          },
          {
            text: 'Chichinales',
            value: 5
          },
        ],

        sexo: [
          {
            text: 'Femenino',
            value: 'F'
          }, {
            text: 'Masculino',
            value: 'M'
          }
        ],

        tipoContacto: [
          {
            text: 'Fijo',
            value: 'fijo'
          },
          {
            text: 'Celular',
            value: 'celular'
          },
          {
            text: 'Email',
            value: 'email'
          },
          {
            text: 'Web',
            value: 'web'
          }
        ],

        estadoCivil: [
          {
            text: 'Casada/o',
            value: 'casado'
          },
          {
            text: 'Soltera/o',
            value: 'soltero'
          },
          {
            text: 'Viuda/o',
            value: 'viudo'
          },
          {
            text: 'Concubina/o',
            value: 'concubino'
          },
        ],

        delegacion: [
          {
            text: 'Neuquén',
            value: 1
          },
          {
            text: 'Cipo',
            value: 2
          },
          {
            text: 'Leo',
            value: 3
          }
        ]
      },

      expand: {
        profesional: true,
        domicilios: true,
        contactos: true,
        formaciones: true
      },

      solicitud: new Solicitud(),

      nuevo_contacto: new Contacto(),
      nueva_formacion: new Formacion(),

      headers: {
        contactos: [
          { text: 'Tipo', value: 'tipo' },
          { text: 'Valor', value: 'valor' },
        ],

        formacion: [
          { text: 'Tipo', value: 'tipo' },
          { text: 'Título', value: 'titulo' },
          { text: 'Fecha', value: 'fecha' },
          { text: 'Institución', value: 'institucion' }
        ]
      }
    }
  },

  methods: {
    addContacto: function() {
      this.solicitud.profesional.contactos.push(this.nuevo_contacto);
      this.nuevo_contacto = new Contacto();
    },

    removeContacto: function(index) {
      this.solicitud.profesional.contactos.splice(index, 1);
    },

    addFormacion: function() {
      this.solicitud.profesional.formaciones.push(this.nueva_formacion);
      this.nuevo_contacto = new Formacion();
    },

    removeFormacion: function(index) {
      this.solicitud.profesional.formaciones.splice(index, 1);
    },

    submit: function() {
      axios.post('http://localhost:3400/solicitudes', this.solicitud)
           .then(r => {
             if (r.status != 201) {
               this.submitError();
             }
             this.snackbar.msg = 'Nueva solicitud creada exitosamente!';
             this.snackbar.context = 'success';
             this.snackbar.show = true;
           })
           .catch(e => this.submitError());
    },

    submitError: function() {
      this.snackbar.msg = 'Ha ocurrido un error en la carga';
      this.snackbar.context = 'error';
      this.snackbar.show = true;
    },
  },

  components: {
    InputFecha
  }
}
</script>

<style scoped>
#info-profesional div {
  margin-bottom: 10px;
}

h6 {
  padding-top: 10px;
}

.stuck {
    position: fixed;
    right: 10px;
    width: 30%;
    word-wrap: break-word;
}
</style>
