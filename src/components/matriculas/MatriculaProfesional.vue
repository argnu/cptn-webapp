<template>
<div>
  <v-container v-if="matricula.entidad">
    <v-layout row wrap>
      <v-toolbar class="indigo" dark>
        <v-toolbar-title class="white--text">Datos de Matrícula</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-container>
        <v-expansion-panel expand>
          <v-expansion-panel-content v-model="expand.basicos">
            <div slot="header">Datos Básicos</div>
            <v-card class="blue-grey lighten-4">
              <v-card-text>
                <v-layout row wrap class="mx-5">
                  <v-flex xs6>
                    <div class="mb-3">
                      Estado: {{ matricula.estado | upperFirst }}
                    </div>
                    <div>
                      Fecha Resolución: {{ matricula.fechaResolucion | formatFecha }}
                    </div>
                  </v-flex>

                  <v-flex xs6>
                    <div class="mb-3">
                      Número de Acta: {{ matricula.numeroActa }}
                    </div>
                    <div class="">
                      Número de Matrícula: {{ matricula.numeroMatricula }}
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <br>

        <v-expansion-panel expand>
          <v-expansion-panel-content v-model="expand.basicos">
            <div slot="header">Datos del Profesional</div>
            <v-card class="blue-grey lighten-4">
              <v-card-text>
                <v-layout row wrap class="mx-5">
                  <v-flex xs6>
                    <div class="mb-3">
                      Nombre: {{ matricula.entidad.nombre }}
                    </div>
                    <div class="mb-3">
                      Apellido: {{ matricula.entidad.apellido }}
                    </div>
                    <div class="mb-3">
                      DNI: {{ matricula.entidad.dni }}
                    </div>
                    <div class="mb-3">
                      Fecha Nacimiento: {{ matricula.entidad.fechaNacimiento | formatFecha }}
                    </div>
                    <div class="mb-3">
                      Relacion Dependencia: {{ matricula.entidad.relacionDependencia | boolean }}
                    </div>
                    <div>
                      Autónomo: {{ matricula.entidad.independiente | boolean }}
                    </div>
                  </v-flex>

                  <v-flex xs6>
                    <div class="mb-3">
                      Nacionalidad: {{ matricula.entidad.nacionalidad }}
                    </div>
                    <div class="mb-3">
                      Sexo: {{ matricula.entidad.sexo }}
                    </div>
                    <div class="mb-3">
                      Estado Civil: {{ matricula.entidad.estadoCivil }}
                    </div>
                    <div class="mb-3">
                      Observaciones: {{ matricula.entidad.observaciones }}
                    </div>
                    <div class="mb-3">
                      Empresa: {{ matricula.entidad.empresa }}
                    </div>
                    <div>
                      Servicios Prestados: {{ matricula.entidad.serviciosPrestados }}
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <br>

        <v-expansion-panel expand>
          <v-expansion-panel-content v-model="expand.basicos">
            <div slot="header">Domicilios</div>
            <v-card>
              <v-card-text class="blue-grey lighten-4">
                <v-layout row wrap>
                  <v-flex xs5 class="ml-5">
                    <div class="mb-4">
                      <b>Domicilio Real</b>
                    </div>
                    <div class="mb-4">
                      Localidad: {{ matricula.entidad.domicilioReal ? matricula.entidad.domicilioReal.localidad : ''}}
                    </div>
                    <div class="mb-4">
                      Calle: {{ matricula.entidad.domicilioReal ? matricula.entidad.domicilioReal.calle : ''}}
                    </div>
                    <div class="mb-4">
                      N°: {{ matricula.entidad.domicilioReal ? matricula.entidad.domicilioReal.numero : ''}}
                    </div>
                  </v-flex>

                  <v-flex xs5 class="ml-5">
                    <div class="mb-4">
                      <b>Domicilio Legal</b>
                    </div>
                    <div class="mb-4">
                      Localidad: {{ matricula.entidad.domicilioLegal ? matricula.entidad.domicilioLegal.localidad : ''}}
                    </div>
                    <div class="mb-4">
                      Calle: {{ matricula.entidad.domicilioLegal ? matricula.entidad.domicilioLegal.calle : '' }}
                    </div>
                    <div class="mb-4">
                      N°: {{ matricula.entidad.domicilioLegal ? matricula.entidad.domicilioLegal.numero : ''}}
                    </div>
                  </v-flex>
                </v-layout>

              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <br>

        <v-expansion-panel expand>
          <v-expansion-panel-content v-model="expand.basicos">
            <div slot="header">Contactos</div>
            <v-card>
              <v-card-text class="blue-grey lighten-4">
                <v-data-table :headers="headers.contactos" :items="matricula.entidad.contactos" hide-actions class="elevation-1 mt-4" no-data-text="No hay contactos">
                  <template slot="headers" scope="props">
                          <th v-for="header of props.headers" style="padding: 20px">
                            {{ header.text }}
                          </th>
                          <th></th>
                        </template>
                  <template slot="items" scope="props">
                          <td>{{ props.item.tipo }}</td>
                          <td>{{ props.item.valor }}</td>
                        </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <br>

        <v-expansion-panel expand>
          <v-expansion-panel-content v-model="expand.basicos">
            <div slot="header">Formaciones</div>
            <v-card>
              <v-card-text class="blue-grey lighten-4">
                <v-data-table :headers="headers.formaciones" :items="matricula.entidad.formaciones" hide-actions class="elevation-1 mt-4" no-data-text="No hay formaciones">
                  <template slot="headers" scope="props">
                  <th v-for="header of props.headers" style="padding: 20px">
                    {{ header.text }}
                  </th>
                  <th></th>
                </template>
                  <template slot="items" scope="props">
                  <td>{{ props.item.tipoFormacion }}</td>
                  <td>{{ props.item.titulo }}</td>
                  <td>{{ props.item.institucion }}</td>
                  <td>{{ props.item.fecha | formatFecha }}</td>
                </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <br>

        <v-expansion-panel expand>
          <v-expansion-panel-content v-model="expand.basicos">
            <div slot="header">Caja Previsional</div>
            <v-card>
              <v-card-text class="blue-grey lighten-4">
                <div class="mb-3">
                  Posee Caja Previsional: {{ matricula.entidad.poseeCajaPrevisional | boolean }}
                </div>
                <div v-if="matricula.entidad.poseeCajaPrevisional" class="mb-3">
                  Nombre Caja Previsional: {{ matricula.entidad.nombreCajaPrevisional }}
                </div>

                <!-- <div style="text-align:center">
                  Beneficiarios
                </div> -->
                <v-data-table
                  :headers="headers.beneficiarios"
                  :items="matricula.entidad.beneficiarios"
                  hide-actions class="elevation-1 mt-4" no-data-text="No hay beneficiarios"
                >
                  <template slot="headers" scope="props">
                  <th v-for="header of props.headers" style="padding: 20px">
                    {{ header.text }}
                  </th>
                  <th></th>
                </template>
                  <template slot="items" scope="props">
                  <td>{{ props.item.nombre }}</td>
                  <td>{{ props.item.apellido }}</td>
                  <td>{{ props.item.dni }}</td>
                  <td>{{ props.item.fechaNacimiento | formatFecha }}</td>
                  <td>{{ props.item.vinculo }}</td>
                  <td>{{ props.item.invalidez | boolean }}</td>
                </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <br>

        <v-expansion-panel expand>
          <v-expansion-panel-content v-model="expand.basicos">
            <div slot="header">Subsidiarios</div>
            <v-card>
              <v-card-text class="blue-grey lighten-4">
                <v-data-table
                  :headers="headers.subsidiarios"
                  :items="matricula.entidad.subsidiarios"
                  hide-actions class="elevation-1 mt-4" no-data-text="No hay subsidiarios"
                >
                  <template slot="headers" scope="props">
                  <th v-for="header of props.headers" style="padding: 20px">
                    {{ header.text }}
                  </th>
                  <th></th>
                </template>
                  <template slot="items" scope="props">
                  <td>{{ props.item.nombre }}</td>
                  <td>{{ props.item.apellido }}</td>
                  <td>{{ props.item.dni }}</td>
                  <td>{{ props.item.porcentaje }}</td>
                </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>


      </v-container>
    </v-layout>
  </v-container>
</div>
</template>

<script>
import * as axios from 'axios';
import * as utils from '@/utils';

export default {
  name: 'matricula-profesional',
  props: ['id'],

  data() {
    return {
      matricula: {},
      expand: {
        basicos: true
      },

      headers: {
        contactos: [
            {
              text: 'Tipo',
              value: 'tipo'
            },
            {
              text: 'Valor',
              value: 'valor'
            }
        ],

        formaciones: [
            {
              text: 'Tipo',
              value: 'tipo'
            },
            {
              text: 'Título',
              value: 'titulo'
            },
            {
              text: 'Institución',
              value: 'institucion'
            },
            {
              text: 'Fecha',
              value: 'fecha'
            }
        ],

        beneficiarios: [
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Apellido',
            value: 'apellido'
          },
          {
            text: 'DNI',
            value: 'dni'
          },
          {
            text: 'Fecha de Nacimiento',
            value: 'fechaNacimiento'
          },
          {
            text: 'Vínculo',
            value: 'vinculo'
          },
          {
            text: 'Invalidez',
            value: 'invalidez'
          }
        ],

        subsidiarios: [
          {
            text: 'Nombre',
            value: 'nombre'
          },
          {
            text: 'Apellido',
            value: 'apellido'
          },
          {
            text: 'DNI',
            value: 'dni'
          },
          {
            text: 'Porcentaje',
            value: 'porcentaje'
          }
        ]
      }
    }
  },

  filters: {
    formatFecha: function(str) {
      return str ? utils.formatFecha(str) : '';
    },

    upperFirst: function(str) {
      return str ? utils.upperFirst(str) : '';
    },

    boolean: function(v) {
      return v ? 'Sí' : 'No'
    }
  },

  created: function() {
    console.log(`http://localhost:3400/api/matriculas/${this.id}`);
    axios.get(`http://localhost:3400/api/matriculas/${this.id}`)
      .then(r => {
        console.log(r.data);
        this.matricula = r.data;
      })
      .catch(e => {
        console.error(e);
      });
  },

  methods: {

  },

}
</script>

<style>
</style>
