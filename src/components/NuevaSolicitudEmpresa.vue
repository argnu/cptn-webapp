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
            <v-toolbar-title class="white--text">Solicitud de Matriculación de Empresas</v-toolbar-title>
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
                            <input-fecha
                              v-model="solicitud.fecha"
                              label="Fecha de Solicitud"
                            >
                            </input-fecha>
                          </v-flex>
                          <v-flex xs6 class="ml-5">
                            <v-select
                              autocomplete
                              v-bind:items="select_items.delegacion" v-model="solicitud.delegacion"
                              label="Delegación"
                            >
                            </v-select>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                    <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                </v-stepper-content>


                <!-- PASO 2: DATOS DE EMPRESA -->
                <v-stepper-step step="2" editable :complete="step > 2">
                  Datos de la Empresa
                </v-stepper-step>
                <v-stepper-content step="2">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-layout row>
                        <v-flex xs6>
                          <v-text-field
                            label="Nombre"
                            v-model="solicitud.empresa.nombre"
                            tabindex="1"
                          >
                          </v-text-field>

                          <v-select
                            autocomplete
                            :items="select_items.tipoEmpresa"
                            v-model="solicitud.empresa.tipoEmpresa"
                            label="Tipo de Empresa" single-line bottom tabindex="5">
                          </v-select>

                          <input-fecha
                              v-model="solicitud.empresa.fechaConstitucion"
                              label="Fecha de Constitución"
                          >
                          </input-fecha>
                        </v-flex>

                        <v-flex xs6>
                          <v-text-field
                            label="CUIT"
                            v-model="solicitud.empresa.cuit"
                            tabindex="1"
                          >
                          </v-text-field>

                          <input-fecha
                              v-model="solicitud.empresa.fechaInicio"
                              label="Fecha de Inicio de Actividades"
                          >
                          </input-fecha>

                          <v-select
                            autocomplete
                            :items="select_items.tipoSociedad"
                            v-model="solicitud.empresa.tipoSociedad"
                            label="Tipo de Sociedad" single-line bottom tabindex="5">
                          </v-select>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.@click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 3: DOMICILIOS -->
                <v-stepper-step step="3" editable :complete="step > 3">
                  Domicilios de la Empresa
                </v-stepper-step>
                <v-stepper-content step="3">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                        <span>Domicilio Real</span>
                        <v-layout row>
                          <v-flex xs6>
                            <v-select
                              autocomplete
                              :items="select_items.paises"
                              label="País"
                              @change="changePais('real')"
                              v-model="solicitud.empresa.domicilioReal.pais"
                            >
                            </v-select>
                            <v-select
                              autocomplete
                              :items="select_items.departamentos.real"
                              label="Departamento"
                              @change="changeDepartamento('real')"
                              v-model="solicitud.empresa.domicilioReal.departamento"
                            >
                            </v-select>
                            <v-text-field
                              label="Calle"
                              v-model="solicitud.empresa.domicilioReal.calle"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs6>
                            <v-select
                              autocomplete
                              :items="select_items.provincias.real"
                              label="Provincia"
                              @change="changeProvincia('real')"
                              v-model="solicitud.empresa.domicilioReal.provincia"
                            >
                            </v-select>
                            <v-select
                              autocomplete
                              :items="select_items.localidades.real"
                              label="Localidad"
                              v-model="solicitud.empresa.domicilioReal.localidad"
                            >
                            </v-select>
                            <v-text-field
                              label="Nro"
                              v-model="solicitud.empresa.domicilioReal.numero"
                            >
                            </v-text-field>
                          </v-flex>
                        </v-layout>

                        <span>Domicilio Legal</span>
                        <v-layout row>
                          <v-flex xs6>
                            <v-select
                              autocomplete
                              :items="select_items.paises"
                              label="País"
                              @change="changePais('legal')"
                              v-model="solicitud.empresa.domicilioLegal.pais"
                            >
                            </v-select>
                            <v-select
                              autocomplete
                              :items="select_items.departamentos.legal"
                              label="Departamento"
                              @change="changeDepartamento('legal')"
                              v-model="solicitud.empresa.domicilioLegal.departamento"
                            >
                            </v-select>
                            <v-text-field
                              label="Calle"
                              v-model="solicitud.empresa.domicilioLegal.calle"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs6>
                            <v-select
                              autocomplete
                              :items="select_items.provincias.legal"
                              label="Provincia"
                              @change="changeProvincia('legal')"
                              v-model="solicitud.empresa.domicilioLegal.provincia"
                            >
                            </v-select>
                            <v-select
                              autocomplete
                              :items="select_items.localidades.legal"
                              label="Localidad"
                              v-model="solicitud.empresa.domicilioLegal.localidad"
                            >
                            </v-select>
                            <v-text-field
                              label="Nro"
                              v-model="solicitud.empresa.domicilioLegal.numero"
                            >
                            </v-text-field>
                          </v-flex>
                        </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.@click.native="prevStep" class="right">Volver</v-btn>
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
                              autocomplete
                              :items="select_items.tipoContacto"
                              label="Tipo de Contacto"
                              single-line
                              bottom
                              v-model="nuevo_contacto.tipo"
                            >
                            </v-select>
                          </v-flex>
                          <v-flex xs6>
                            <v-text-field
                              label="Dato"
                              v-model="nuevo_contacto.valor"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-btn light @click="addContacto">Agregar</v-btn>
                        </v-layout>

                        <v-data-table
                            :headers="headers.contacto"
                            :items="solicitud.empresa.contactos"
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
                            <td>{{ props.item.tipo | upperFirst }}</td>
                            <td>{{ props.item.valor }}</td>
                            <td style="width:30px">
                              <v-btn icon @click="removeContacto('contactos', props.index)">
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </td>
                          </template>
                        </v-data-table>
                      </v-container>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.@click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 5: INCUMBENCIAS -->
                <v-stepper-step step="5" editable :complete="step > 5">
                  Incumbencias
                </v-stepper-step>
                <v-stepper-content step="5">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-container>
                        <v-layout row>
                        </v-layout>
                      </v-container>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
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
            <v-toolbar-title class="white--text">Datos de la Empresa</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-container>
            <v-card>
              <v-card-text id="info-empresa">
                <div><b>Nombre: </b> {{ solicitud.empresa.nombre }} </div>
                <!-- <div><b>Apellido: </b> {{ solicitud.profesional.apellido }} </div>
                <div><b>DNI: </b> {{ solicitud.profesional.dni }} </div>
                <div><b>CUIT: </b> {{ solicitud.profesional.cuit }} </div>
                <div><b>Sexo: </b> {{ solicitud.profesional.sexo | upperFirst }} </div>
                <div><b>Estado Civil: </b> {{ solicitud.profesional.estadoCivil | upperFirst }} </div>
                <div><b>Fecha de Nacimiento: </b> {{ solicitud.profesional.fechaNacimiento }} </div>
                <div><b>Lugar de Nacimiento: </b> {{ solicitud.profesional.lugarNacimiento }} </div>
                <div><b>Nacionalidad: </b> {{ solicitud.profesional.nacionalidad }} </div>
                <div><b>Observaciones: </b> {{solicitud.profesional.observaciones }} </div> -->
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
import { Solicitud, Contacto, Empresa } from '@/model';
import InputFecha from '@/components/base/InputFecha';
import ValidatorMixin from '@/components/ValidatorMixin';
import FiltersMixin from '@/components/FiltersMixin';

function getItemsSelect(data, textKey, valueKey) {
  return data.map(e => {
    return {
      text: utils.upperFirst(e[textKey]),
      value: e[valueKey]
    }
  });
}

function validRules(value, rules) {
  for (let rule of rules) {
    if (! (rule(value) === true)) return false;
  }
  return true;
};

function validObject(original, rules) {
  for(let att in rules) {
    if (!validRules(original[att], rules[att])) return false;
  }
  return true;
}

export default {
  name: 'nueva-solicitud-empresa',
  mixins: [ValidatorMixin, FiltersMixin],
  data () {
    return {
      step: 1,

      snackbar: {
        msg: '',
        show: false,
        context: ''
      },

      select_items: {
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
        ],

        tipoContacto: [],
        tipoEmpresa: [],
        tipoSociedad: [],
        paises: [],
        provincias: {
          real: [],
          legal: []
        },
        departamentos: {
          real: [],
          legal: []
        },
        localidades: {
          real: [],
          legal: []
        }
      },

      solicitud: new Solicitud('empresa'),

      nuevo_contacto: new Contacto(),

      headers: {
        contactos: [
          { text: 'Tipo', value: 'tipo' },
          { text: 'Valor', value: 'valor' },
        ]
      }
    }
  },

  created: function() {
    Promise.all([
      axios.get('http://localhost:3400/api/paises'),
      axios.get('http://localhost:3400/api/opciones')
    ])
    .then(r => {
      this.select_items.paises = getItemsSelect(r[0].data, 'nombre', 'id')
      this.select_items.tipoContacto = getItemsSelect(r[1].data.contacto, 'valor', 'valor');
    })
    .catch(e => console.error(e));
  },

  methods: {
    changePais: function(tipoDomicilio) {
      let domicilio = tipoDomicilio == 'real' ? 'domicilioReal' : 'domicilioLegal';
      let pais = this.solicitud.empresa[domicilio].pais;
      axios.get(`http://localhost:3400/api/provincias?pais=${pais}`)
           .then(r => this.select_items.provincias[tipoDomicilio] = getItemsSelect(r.data, 'nombre', 'id'))
           .catch(e => console.error(e));
    },

    changeProvincia: function(tipoDomicilio) {
      let domicilio = tipoDomicilio == 'real' ? 'domicilioReal' : 'domicilioLegal';
      let provincia = this.solicitud.empresa[domicilio].pais;
      axios.get(`http://localhost:3400/api/departamentos?provincia=${provincia}`)
           .then(r => this.select_items.departamentos[tipoDomicilio] = getItemsSelect(r.data, 'nombre', 'id'))
           .catch(e => console.error(e));
    },

    changeDepartamento: function(tipoDomicilio) {
      let domicilio = tipoDomicilio == 'real' ? 'domicilioReal' : 'domicilioLegal';
      let departamento = this.solicitud.empresa[domicilio].pais;
      axios.get(`http://localhost:3400/api/localidades?departamento=${departamento}`)
           .then(r => this.select_items.localidades[tipoDomicilio] = getItemsSelect(r.data, 'nombre', 'id'))
           .catch(e => console.error(e));
    },

    addContacto: function() {
       this.solicitud.empresa.contactos.push(this.nuevo_contacto);
       this.nuevo_contacto = new Contacto();
    },

    removeElem: function(tipo, index) {
      this.solicitud.empresa[tipo].splice(index, 1);
    },

    submit: function() {
      console.log(JSON.stringify(this.solicitud));
      // axios.post('http://localhost:3400/api/solicitudes', this.solicitud)
      //      .then(r => {
      //        if (r.status != 201) {
      //          this.submitError();
      //        }
      //        this.snackbar.msg = 'Nueva solicitud creada exitosamente!';
      //        this.snackbar.context = 'success';
      //        this.snackbar.show = true;
      //        this.solicitud = new Solicitud();
      //      })
      //      .catch(e => this.submitError());
    },

    submitError: function() {
      this.snackbar.msg = 'Ha ocurrido un error en la carga';
      this.snackbar.context = 'error';
      this.snackbar.show = true;
    },

    nextStep: function() {
      this.step = +this.step + 1;
    },

    prevStep: function() {
      this.step = this.step - 1;
    }
  },

  components: {
    InputFecha
  }
}
</script>

<style scoped>
#info-empresa div {
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
