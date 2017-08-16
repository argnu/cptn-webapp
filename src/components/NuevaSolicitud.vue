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

          <v-container>
            <v-card>
              <v-card-text>
                <h6>Datos Solicitud</h6>
                <v-layout row>
                  <v-flex xs6>
                    <v-text-field
                       v-model="solicitud.fecha"
                       label="Fecha de Solicitud"
                       @focusin="show.fechaSolicitud = true"
                       @focusout="show.fechaSolicitud = false">
                    </v-text-field>
                    <v-date-picker
                      :date-format="formatDate"
                      :formatted-value.sync="solicitud.fecha"
                      v-show="show.fechaSolicitud">
                    </v-date-picker>
                  </v-flex>
                  <v-flex xs6>
                    <v-select
                      :items="select_items.delegacion" v-model="solicitud.delegacion"
                      label="Delegación" single-line bottom>
                    </v-select>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-container>


          <!-- CONTAINER DE DATOS BASICOS DE PROFESIONAL -->
          <v-container>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-model="expand.profesional">
                <div slot="header">
                  <h6>Datos Básicos</h6>
                </div>
                <v-container>
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
                      <v-text-field
                         tabindex="7"
                         v-model="solicitud.profesional.fechaNacimiento"
                         label="Fecha de Nacimiento"
                         @focusin="show.fechaNacimiento = true"
                         @focusout="show.fechaNacimiento = false">
                      </v-text-field>
                      <v-date-picker
                        :date-format="formatDate"
                        :formatted-value.sync="solicitud.profesional.fechaNacimiento"
                        v-show="show.fechaNacimiento">
                      </v-date-picker>
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
                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-container>


          <!-- CONTAINER DE DOMICILIOS -->
          <v-container>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-model="expand.domicilios">
                <div slot="header"><h6>Domicilios</h6></div>
                <v-container>
                  <v-card>
                    <v-card-title>Domicilio Real</v-card-title>
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
                          :items="select_items.localidades"
                          label="Localidad"
                          single-line bottom
                          v-model="solicitud.profesional.domicilioReal.localidad">
                        </v-select>
                      </v-flex>
                    </v-layout>
                  </v-card>

                  <v-card>
                    <v-card-title>Domicilio Legal</v-card-title>
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
                  </v-card>

                </v-container>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-container>


          <!-- CONTAINER DE CONTACTOS -->
          <v-container>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-model="expand.contactos">
                <div slot="header"><h6>Contactos</h6></div>
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
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-container>



          <!-- CONTAINER DE FORMACIONES -->
          <v-container>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-model="expand.formaciones">
                <div slot="header"><h6>Formaciones</h6></div>
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
                      :items="solicitud.profesional.formaciones"
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

      solicitud: {
        fecha: null,
        delegacion: null,
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
        }
      },

      show: {
        fechaSolicitud: false,
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
      this.solicitud.profesional.contactos.push({
        tipo: this.nuevo_contacto.tipo,
        valor: this.nuevo_contacto.valor
      });
      this.nuevo_contacto = {
        tipo: '',
        valor: ''
      }
    },

    removeContacto: function(index) {
      this.solicitud.profesional.contactos.splice(index, 1);
    },

    addFormacion: function() {
      this.solicitud.profesional.formaciones.push({
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
      this.solicitud.profesional.formaciones.splice(index, 1);
    },

    submit: function() {
      axios.post('http://localhost:3400/solicitudes', this.solicitud)
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

h6 {
  padding-top: 10px;
}
</style>
