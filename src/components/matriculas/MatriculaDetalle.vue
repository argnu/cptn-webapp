<template>
    <v-layout row wrap v-if="matricula.entidad">
        <span class="ma-2"></span>
        <v-expansion-panel expand>
          <v-expansion-panel-content v-model="expand.basicos" class="blue lighten-4 grey--text text--darken-3">
            <div slot="header"><b>Datos Básicos</b></div>
            <v-card class="white">
              <v-card-text>
                <v-layout row wrap class="mx-5">
                  <v-flex xs6>
                    <div class="mb-3">
                      Número de Matrícula: {{ matricula.numeroMatricula }}
                    </div>
                    <div>
                      Fecha Resolución: {{ matricula.fechaResolucion | fecha }}
                    </div>
                  </v-flex>

                  <v-flex xs6>
                    <div class="mb-3">
                      Estado: {{ matricula.estado }}
                    </div>
                    <div class="">
                      Número de Acta: {{ matricula.numeroActa }}                      
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <br>

        <v-expansion-panel expand v-if="matricula.entidad.tipo == 'empresa'">
          <v-expansion-panel-content v-model="expand.detalle" class="blue lighten-4 grey--text text--darken-3">
            <div slot="header"><b>Datos de la Empresa</b></div>
            <v-card >
              <v-card-text>
                <v-layout row wrap class="mx-5">
                  <v-flex xs6>
                    <div class="mb-3">
                      Nombre: {{ matricula.entidad.nombre }}
                    </div>
                    <div class="mb-3">
                      CUIT: {{ matricula.entidad.cuit }}
                    </div>
                    <div class="mb-3">
                      Fecha de Constitución: {{ matricula.entidad.fechaConstitucion | fecha }}
                    </div>
                    <div>
                      Fecha de Inicio de Actividades: {{ matricula.entidad.fechaInicio | fecha }}
                    </div>
                  </v-flex>

                  <v-flex xs6>
                    <div class="mb-3">
                      Tipo de Empresa: {{ matricula.entidad.tipoEmpresa }}
                    </div>
                    <div class="mb-3">
                      Tipo de Sociedad: {{ matricula.entidad.tipoSociedad }}
                    </div>
                  </v-flex>
                </v-layout>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <br>

        <v-expansion-panel expand v-if="matricula.entidad.tipo == 'profesional'">
          <v-expansion-panel-content v-model="expand.detalle" class="blue lighten-4 grey--text text--darken-3">
            <div slot="header"><b>Datos del Profesional</b></div>
            <v-card >
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
                      Fecha Nacimiento: {{ matricula.entidad.fechaNacimiento | fecha }}
                    </div>
                    <div class="mb-3">
                      Relacion Dependencia: {{ matricula.entidad.relacionDependencia | boolean }}
                    </div>
                    <div class="mb-3">
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
          <v-expansion-panel-content v-model="expand.domicilios" class="blue lighten-4 grey--text text--darken-3">
            <div slot="header"><b>Domicilios</b></div>
            <v-card class="white">
              <v-card-text >
                <v-layout row wrap>
                  <v-flex xs3 class="ml-5">
                    <div class="mb-4">
                      <b>Domicilio Real</b>
                    </div>
                    <div class="mb-4">
                      Localidad: {{ domicilioReal ? domicilioReal.localidad.nombre : ''}}
                    </div>
                    <div class="mb-4">
                      Dirección: {{ domicilioReal ? domicilioReal.direccion : ''}}
                    </div>
                  </v-flex>

                  <v-flex xs3 class="ml-5">
                    <div class="mb-4">
                      <b>Domicilio Legal</b>
                    </div>
                    <div class="mb-4">
                      Localidad: {{ domicilioLegal ? domicilioLegal.localidad.nombre : ''}}
                    </div>
                    <div class="mb-4">
                      Dirección: {{ domicilioLegal ? domicilioLegal.direccion : '' }}
                    </div>
                  </v-flex>

                  <v-flex xs3 class="ml-5">
                    <div class="mb-4">
                      <b>Domicilio Especial</b>
                    </div>
                    <div class="mb-4">
                      Localidad: {{ domicilioEspecial ? domicilioEspecial.localidad.nombre : ''}}
                    </div>
                    <div class="mb-4">
                      Dirección: {{ domicilioEspecial ? domicilioEspecial.direccion : '' }}
                    </div>
                  </v-flex>
                </v-layout>

              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <br>

        <v-expansion-panel expand>
          <v-expansion-panel-content v-model="expand.contactos" class="blue lighten-4 grey--text text--darken-3">
            <div slot="header"><b>Contactos</b></div>
            <v-card class="white">
              <v-card-text >
                <v-data-table
                  :headers="headers.Contactos"
                  :items="matricula.entidad.contactos"
                  hide-actions
                  class="elevation-1 mt-4"
                  no-data-text="No hay contactos"
                >
                  <template slot="headers" slot-scope="props">
                          <th v-for="header of props.headers" :key="header.value" class="pa-3">
                            <b>{{ header.text }}</b>
                          </th>
                        </template>
                  <template slot="items" slot-scope="props">
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
          <v-expansion-panel-content v-model="expand.condiciones_afip" class="blue lighten-4 grey--text text--darken-3">
            <div slot="header"><b>Condiciones Impositivas</b></div>
            <v-card class="white">
              <v-card-text >
                <v-data-table
                  :headers="headers.CondicionesAfip"
                  :items="matricula.entidad.condiciones_afip"
                  hide-actions
                  class="elevation-1 mt-4"
                  no-data-text="No hay datos"
                >
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.condicion_afip.valor }}</td>
                    <td>{{ props.item.descripcion }}</td>
                  </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <br>

        <v-expansion-panel expand v-if="matricula.entidad.tipo == 'profesional'">
          <v-expansion-panel-content v-model="expand.formaciones" class="blue lighten-4 grey--text text--darken-3">
            <div slot="header"><b>Formaciones</b></div>
            <v-card class="white">
              <v-card-text >
                <v-data-table
                  :headers="headers.Formaciones"
                  :items="matricula.entidad.formaciones"
                  hide-actions
                  class="elevation-1 mt-4"
                  no-data-text="No hay formaciones"
                >
                  <template slot="headers" slot-scope="props">
                  <th v-for="header of props.headers" :key="header.value" class="pa-3">
                    <b>{{ header.text }}</b>
                  </th>
                </template>
                  <template slot="items" slot-scope="props">
                  <td>{{ props.item.titulo.nivel.valor }}</td>
                  <td>{{ props.item.titulo.nombre }}</td>
                  <td>{{ props.item.titulo.institucion.nombre }}</td>
                  <td>{{ props.item.fechaEgreso | fecha }}</td>
                  <td>{{ props.item.fechaEmision | fecha }}</td>
                </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <br>

        <v-expansion-panel expand v-if="matricula.entidad.tipo == 'profesional'">
          <v-expansion-panel-content v-model="expand.caja" class="blue lighten-4 grey--text text--darken-3">
            <div slot="header"><b>Cajas Previsionales</b></div>
            <v-card class="white">
              <v-card-text>
                <v-data-table
                  :headers="[ { text: 'Nombre', value: 'nombre', sortable: false } ]"
                  :items="matricula.entidad.cajas_previsionales"
                  hide-actions
                  class="elevation-1 mt-4"
                  no-data-text="No tiene cajas previsionales"
                >
                  <template slot="headers" slot-scope="props">
                      <th v-for="header of props.headers" :key="header.value" class="pa-3">
                        <b>{{ header.text }}</b>
                      </th>
                  </template>
                  <template slot="items" slot-scope="props">
                    <td>{{ props.item.caja.nombre }}</td>
                </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>

        <br>

        <v-expansion-panel expand v-if="matricula.entidad.tipo == 'profesional'">
          <v-expansion-panel-content v-model="expand.subsidiarios" class="blue lighten-4 grey--text text--darken-3">
            <div slot="header"><b>Subsidiarios</b></div>
            <v-card class="white">
              <v-card-text >
                <v-data-table
                  :headers="headers.Subsidiarios"
                  :items="matricula.entidad.subsidiarios"
                  hide-actions
                  class="elevation-1 mt-4"
                  no-data-text="No hay subsidiarios"
                >
                  <template slot="headers" slot-scope="props">
                  <th v-for="header of props.headers" :key="header.value" class="pa-3">
                    <b>{{ header.text }}</b>
                  </th>
                </template>
                  <template slot="items" slot-scope="props">
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
   

        <br>

        <v-expansion-panel expand v-if="matricula.entidad.tipo == 'empresa'">
          <v-expansion-panel-content v-model="expand.representantes" class="blue lighten-4 grey--text text--darken-3">
            <div slot="header"><b>Representantes Técnicos</b></div>
            <v-card class="white">
              <v-card-text >
                <v-data-table
                  :headers="headers.Representantes"
                  :items="matricula.entidad.representantes"
                  hide-actions
                  class="elevation-1 mt-4"
                  no-data-text="No hay representantes"
                >
                  <template slot="headers" slot-scope="props">
                          <th v-for="header of props.headers" :key="header.value" class="pa-3">
                            <b>{{ header.text }}</b>
                          </th>
                        </template>
                  <template slot="items" slot-scope="props">
                          <td>{{ props.item.numeroMatricula }}</td>
                          <td>{{ props.item.dni }}</td>
                          <td>{{ props.item.apellido }}</td>
                          <td>{{ props.item.nombre }}</td>
                          <td>{{ props.item.fechaInicio | fecha }}</td>
                          <td>{{ props.item.fechaFin | fecha }}</td>
                        </template>
                </v-data-table>
              </v-card-text>
            </v-card>
          </v-expansion-panel-content>
        </v-expansion-panel>        
    </v-layout>
</template>

<script>
import * as utils from '@/utils';
import * as headers from '@/model/Headers'

export default {
  name: 'MatriculaDetalle',
  props: ['matricula'],

  data() {
    return {
      expand: {
        basicos: true,
        detalle: false,
        domicilios: false,
        contactos: false,
        formaciones: false,
        caja: false,
        subsidiarios: false,
        representantes: false
      },
    }
  },

  computed: {
    headers: function() {
      return headers;
    },

    domicilioReal: function() {
      if (!this.matricula.entidad.domicilios.length) return null;
      let dom = this.matricula.entidad.domicilios.find(d => d.tipo == 'real');
      return dom ? dom.domicilio : null;
    },

    domicilioLegal: function() {
      if (!this.matricula.entidad.domicilios.length) return null;
      let dom = this.matricula.entidad.domicilios.find(d => d.tipo == 'legal');
      return dom ? dom.domicilio : null;
    },

    domicilioEspecial: function() {
      if (!this.matricula.entidad.domicilios.length) return null;
      let dom = this.matricula.entidad.domicilios.find(d => d.tipo == 'especial');
      return dom ? dom.domicilio : null;
    }
  },

  methods: {

  },

}
</script>

<style>
</style>
