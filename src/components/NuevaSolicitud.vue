<template>
  <v-app>
    <v-container>
      <v-layout row wrap>
        <v-flex xs8>
          <v-toolbar class="indigo" dark>
            <v-toolbar-title class="white--text">Nueva Solicitud</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>


          <!-- CONTAINER DE NUEVO PROFESIONAL -->
          <v-container>
            <v-expansion-panel expand>
              <v-expansion-panel-content v-model="expand.profesional">
                <div slot="header">Datos del Profesional</div>
                <v-container>
                  <v-layout row>
                    <v-flex xs6>
                      <v-text-field label="Nombre"></v-text-field>
                      <v-text-field label="DNI"></v-text-field>
                      <v-select
                        :items="['Femenino','Masculino']"
                        v-model="profesional.sexo"
                        label="Sexo"
                        single-line
                        bottom>
                      </v-select>
                      <v-text-field
                         :value="dates_formatted.profesional"
                         label="Fecha de Nacimiento"
                         @focusin="show.fechaNacimiento = true"
                         @focusout="show.fechaNacimiento = false">
                      </v-text-field>
                      <v-date-picker
                        v-model="profesional.fechaNacimiento"
                        :date-format="formatDate"
                        :formatted-value.sync="dates_formatted.profesional"
                        v-show="show.fechaNacimiento">
                      </v-date-picker>
                      <v-text-field label="Nacionalidad"></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field label="Apellido"></v-text-field>
                      <v-text-field label="CUIT"></v-text-field>
                      <v-select
                        :items="['Casada/o', 'Soltera/o']"
                        v-model="profesional.sexo"
                        label="Estado Civil"
                        single-line
                        bottom>
                      </v-select>
                      <v-text-field label="Lugar Nacimiento"></v-text-field>
                      <v-text-field label="Observaciones"></v-text-field>
                    </v-flex>
                  </v-layout>
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
                        :items="['Fijo', 'Celular', 'Email', 'Web']"
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
                         :value="dates_formatted.titulo"
                         label="Fecha"
                         readonly
                         @focusin="show.fechaTitulo = true"
                         @focusout="show.fechaTitulo = false">
                      </v-text-field>
                      <v-date-picker
                        v-model="nueva_formacion.fecha"
                        :date-format="formatDate"
                        :formatted-value.sync="dates_formatted.titulo"
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


        </v-flex>

        <v-flex xs4>

        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
export default {
  name: 'nueva-solicitud',
  data () {
    return {
      dates_formatted: {
        titulo: null,
        profesional: null
      },

      expand: {
        profesional: true,
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
        fecha: this.dates_formatted.titulo,
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
  }
}
</script>

<style scoped>
</style>
