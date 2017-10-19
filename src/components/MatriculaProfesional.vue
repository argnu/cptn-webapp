<template>
<div>
  <v-container>
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
                    <div>
                      Relacion Laboral: {{ matricula.entidad.relacionLaboral }}
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
                    <div v-if="getTipoRelacionalLaboral() == 'dependencia'">
                      Empresa: {{ matricula.entidad.empresa }}
                    </div>
                    <div v-if="getTipoRelacionalLaboral() == 'autonomo'">
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
                      Localidad: {{ matricula.entidad.domicilioReal.localidad }}
                    </div>
                    <div class="mb-4">
                      Calle: {{ matricula.entidad.domicilioReal.calle }}
                    </div>
                    <div class="mb-4">
                      N°: {{ matricula.entidad.domicilioReal.numero }}
                    </div>
                  </v-flex>

                  <v-flex xs5 class="ml-5">
                    <div class="mb-4">
                      <b>Domicilio Legal</b>
                    </div>
                    <div class="mb-4">
                      Localidad: {{ matricula.entidad.domicilioLegal.localidad }}
                    </div>
                    <div class="mb-4">
                      Calle: {{ matricula.entidad.domicilioLegal.calle }}
                    </div>
                    <div class="mb-4">
                      N°: {{ matricula.entidad.domicilioLegal.numero }}
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
                <v-data-table :headers="['Tipo', 'Valor']" :items="matricula.entidad.contactos" hide-actions class="elevation-1 mt-4" no-data-text="No hay contactos">
                  <template slot="headers" scope="props">
                          <th v-for="header of props.headers" style="padding: 20px">
                            {{ header }}
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
                <v-data-table :headers="['Tipo', 'Título', 'Institución', 'Fecha']" :items="matricula.entidad.formaciones" hide-actions class="elevation-1 mt-4" no-data-text="No hay formaciones">
                  <template slot="headers" scope="props">
                  <th v-for="header of props.headers" style="padding: 20px">
                    {{ header }}
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
                  :headers="['Nombre', 'Apellido', 'DNI', 'Fecha de Nacimiento', 'Vínculo', 'Invalidez']"
                  :items="matricula.entidad.beneficiarios"
                  hide-actions class="elevation-1 mt-4" no-data-text="No hay beneficiarios"
                >
                  <template slot="headers" scope="props">
                  <th v-for="header of props.headers" style="padding: 20px">
                    {{ header }}
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
                  :headers="['Nombre', 'Apellido', 'DNI', 'Porcentaje']"
                  :items="matricula.entidad.subsidiarios"
                  hide-actions class="elevation-1 mt-4" no-data-text="No hay subsidiarios"
                >
                  <template slot="headers" scope="props">
                  <th v-for="header of props.headers" style="padding: 20px">
                    {{ header }}
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
    }
  },

  filters: {
    formatFecha: function(str) {
      return utils.formatFecha(str);
    },

    upperFirst: function(str) {
      return str ? utils.upperFirst(str) : '';
    },

    boolean: function(v) {
      return v ? 'Sí' : 'No'
    }
  },

  created: function() {
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
    getTipoRelacionalLaboral: function() {
      if (this.matricula.entidad.relacionLaboral.includes('Dependencia')) return 'dependencia';
      else return 'autonomo';
    },
  },

}
</script>

<style>
</style>
