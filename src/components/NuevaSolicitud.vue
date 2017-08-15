<template>
  <v-app>
    <v-container>
      <v-layout row wrap>
        <v-flex xs8>
          <form v-on:submit.prevent="submit">

          <v-toolbar class="indigo" dark>
            <v-toolbar-title class="white--text">Nueva Solicitud</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>


          <!-- CONTAINER DE DATOS BASICOS DE PROFESIONAL -->
          <v-container>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-model="expand.profesional">
                <div slot="header">Datos Básicos</div>
                <v-container>
                  <v-layout row>
                    <v-flex xs6>
                      <v-text-field label="Nombre" v-model="profesional.nombre"
                        tabindex="1">
                      </v-text-field>
                      <v-text-field label="DNI" v-model="profesional.dni"
                        tabindex="3">
                      </v-text-field>
                      <v-select
                        :items="select_items.sexo" v-model="profesional.sexo"
                        label="Sexo" single-line bottom tabindex="5">
                      </v-select>
                      <v-text-field
                         tabindex="7"
                         v-model="profesional.fechaNacimiento"
                         label="Fecha de Nacimiento"
                         @focusin="show.fechaNacimiento = true"
                         @focusout="show.fechaNacimiento = false">
                      </v-text-field>
                      <v-date-picker
                        :date-format="formatDate"
                        :formatted-value.sync="profesional.fechaNacimiento"
                        v-show="show.fechaNacimiento">
                      </v-date-picker>
                      <v-text-field label="Nacionalidad" v-model="profesional.nacionalidad"
                        tabindex="9">
                      </v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field label="Apellido" v-model="profesional.apellido"
                        tabindex="2">
                      </v-text-field>
                      <v-text-field label="CUIT" v-model="profesional.cuit"
                        tabindex="4">
                      </v-text-field>
                      <v-select
                        tabindex="6"
                        :items="select_items.estadoCivil"
                        v-model="profesional.estadoCivil"
                        label="Estado Civil"
                        single-line bottom>
                      </v-select>
                      <v-text-field label="Lugar Nacimiento" v-model="profesional.lugarNacimiento"
                        tabindex="8">
                      </v-text-field>
                      <v-text-field label="Observaciones" v-model="profesional.observaciones"
                        tabindex="10">
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-container>


          <!-- CONTAINER DE DOMICILIOS -->
          <v-container>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-model="expand.domicilios">
                <div slot="header">Domicilios</div>
                <v-container>
                  <v-card>
                    <v-card-title>Domicilio Real</v-card-title>
                    <v-layout row>
                      <v-flex xs6>
                        <v-text-field label="Calle" v-model="profesional.domicilioReal.calle">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field label="Nro" v-model="profesional.domicilioReal.numero">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs6>
                        <v-text-field label="Código Postal" v-model="profesional.domicilioReal.codpostal">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-select
                          :items="select_items.localidades"
                          label="Localidad"
                          single-line bottom
                          v-model="profesional.domicilioReal.localidad">
                        </v-select>
                      </v-flex>
                    </v-layout>
                  </v-card>

                  <v-card>
                    <v-card-title>Domicilio Legal</v-card-title>
                    <v-layout row>
                      <v-flex xs6>
                        <v-text-field label="Calle" v-model="profesional.domicilioLegal.calle">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-text-field label="Nro" v-model="profesional.domicilioLegal.numero">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout row>
                      <v-flex xs6>
                        <v-text-field label="Código Postal" v-model="profesional.domicilioLegal.codpostal">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-select
                          :items="select_items.localidades"
                          label="Localidad"
                          single-line bottom
                          v-model="profesional.domicilioLegal.localidad">
                        </v-select>
                      </v-flex>
                    </v-layout>
                  </v-card>

                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-container>


          <!-- CONTAINER DE CONTACTOS -->
          <v-container>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-model="expand.contactos">
                <div slot="header">Contactos</div>
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
                      :headers="['Tipo', 'Valor']"
                      :items="profesional.contactos"
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
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-container>



          <!-- CONTAINER DE FORMACIONES -->
          <v-container>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-model="expand.formaciones">
                <div slot="header">Formaciones</div>
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
                      <v-text-field
                         v-model="nueva_formacion.fecha"
                         label="Fecha"
                         readonly
                         @focusin="show.fechaTitulo = true"
                         @focusout="show.fechaTitulo = false">
                      </v-text-field>
                      <v-date-picker
                        :date-format="formatDate"
                        :formatted-value.sync="nueva_formacion.fecha"
                        v-show="show.fechaTitulo">
                      </v-date-picker>
                      <v-text-field label="Institución" v-model="nueva_formacion.institucion">
                      </v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-btn light @click="addFormacion" style="float:right">Agregar</v-btn>
                  <br style="clear:both">


                  <v-data-table
                      :headers="['Tipo', 'Título', 'Fecha', 'Institución']"
                      :items="profesional.formaciones"
                      hide-actions
                      class="elevation-1"
                      no-data-text="No hay formaciones"
                      style="margin-top:30px">
                    <template slot="headers" scope="props">
                      <th v-for="header of props.headers" style="padding: 20px">
                        {{ header }}
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
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-container>

          <v-btn light type="submit" style="float:right;">Enviar Solicitud</v-btn>

          </form>
        </v-flex>

        <v-flex xs4>
          <v-toolbar class="indigo" dark>
            <v-toolbar-title class="white--text">Datos del Profesional</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-container>
            <v-card>
              <v-card-text id="info-profesional">
                <div><b>Nombre: </b> {{ profesional.nombre }} </div>
                <div><b>Apellido: </b> {{ profesional.apellido }} </div>
                <div><b>DNI: </b> {{ profesional.dni }} </div>
                <div><b>CUIT: </b> {{ profesional.cuit }} </div>
                <div><b>Sexo: </b> {{ profesional.sexo }} </div>
                <div><b>Estado Civil: </b> {{ profesional.estadoCivil }} </div>
                <div><b>Fecha de Nacimiento: </b> {{ profesional.fechaNacimiento }} </div>
                <div><b>Lugar de Nacimiento: </b> {{ profesional.lugarNacimiento }} </div>
                <div><b>Nacionalidad: </b> {{ profesional.nacionalidad }} </div>
                <div><b>Observaciones: </b> {{profesional.observaciones }} </div>
              </v-card-text>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
import * as axios from 'axios';

export default {
  name: 'nueva-solicitud',
  data () {
    return {
      select_items: {
        localidades: [{
          text: 'Neuquén',
          value: 1
        }],

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


        ]
      },

      expand: {
        profesional: true,
        domicilios: false,
        contactos: false,
        formaciones: false
      },

      profesional: {
        nombre: '',
        apellido: '',
        dni: '',
        cuit: '',
        sexo: '',
        estadoCivil: '',
        lugarNacimiento: '',
        fechaNacimiento: null,
        nacionalidad: '',
        observaciones: '',
        domicilioReal: {
          calle: '',
          numero: '',
          codpostal: '',
          localidad: null
        },
        domicilioLegal: {

        },
        contactos: [],
        formaciones: []
      },

      show: {
        fechaNacimiento: false,
        fechaTitulo: false
      },

      nuevo_contacto: {
        tipo: '',
        valor: ''
      },

      nueva_formacion: {
        tipo: '',
        titulo: '',
        fecha: null,
        institucion: ''
      },
    }
  },

  methods: {
    formatDate: function(date_string) {
      let date = new Date(date_string);
      let dia = date.getDate();
      dia = (dia.toString().length == 1) ? '0'+dia : dia;
      let mes = date.getMonth()+1;
      mes = (mes.toString().length == 1) ? '0'+mes : mes;
      return `${dia}/${mes}/${date.getFullYear()}`;
    },

    addContacto: function() {
      this.profesional.contactos.push({
        tipo: this.nuevo_contacto.tipo,
        valor: this.nuevo_contacto.valor
      });
      this.nuevo_contacto = {
        tipo: '',
        valor: ''
      }
    },

    removeContacto: function(index) {
      this.profesional.contactos.splice(index, 1);
    },

    addFormacion: function() {
      this.profesional.formaciones.push({
        tipo: this.nueva_formacion.tipo,
        titulo: this.nueva_formacion.titulo,
        fecha: this.nueva_formacion.fecha,
        institucion: this.nueva_formacion.institucion
      });
      this.nuevo_contacto = {
        tipo: '',
        titulo: '',
        fecha: null,
        institucion: ''
      }
    },

    removeFormacion: function(index) {
      this.profesional.formaciones.splice(index, 1);
    },

    submit: function() {
      axios.post('http://localhost:3400/profesionales', this.profesional)
           .then(r => console.log(r.data))
           .catch(e => console.error(e));
    },
  }
}
</script>

<style scoped>
#info-profesional div {
  margin-bottom: 10px;
}
</style>
