<template>
  <v-container>
      <v-layout row wrap>
        <v-flex xs8>
          <form v-on:submit.prevent="submit">
          <v-toolbar class="blue darken-3">
            <v-toolbar-title class="white--text">Solicitud de Matriculación de Empresas</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>

          <v-container>
             <v-stepper v-model="step" vertical>

               <!-- PASO 1: DATOS DE SOLICITUD -->
                <v-stepper-step step="1" edit-icon="check" editable :complete="validStep(1) && step > 1" :rules="[() => step <= 1 || validStep(1)]">
                 Datos de la Solicitud
                </v-stepper-step>
                <v-stepper-content step="1">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                      <v-card-text>
                        <v-layout row>
                          <v-flex xs6 class="ma-4">
                            <input-fecha
                              tabindex="1"
                              v-model="solicitud.fecha"
                              label="Fecha de Solicitud"
                              :rules="validator.solicitud.fecha"
                              :error="submitted.steps[0] && !validControl(validator.solicitud.fecha, solicitud.fecha)"
                            >
                            </input-fecha>
                          </v-flex>

                          <v-flex xs6 class="ma-4">
                            <v-select
                              tabindex="2"
                              label="Delegación"
                              :items="delegaciones"
                              v-model="solicitud.delegacion"
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              :rules="validator.solicitud.delegacion"
                              :error="submitted.steps[0] && !validControl(validator.solicitud.delegacion, solicitud.delegacion)"
                            >
                            </v-select>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                    <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="3">Continuar</v-btn>
                </v-stepper-content>


                <!-- PASO 2: DATOS DE EMPRESA -->
                <v-stepper-step step="2" edit-icon="check" editable :complete="validStep(2) && step > 2" :rules="[() => step <= 2 || validStep(2)]">
                  Datos de la Empresa
                </v-stepper-step>
                <v-stepper-content step="2">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-layout row>
                        <v-flex xs6 class="ma-4">
                          <v-text-field
                            tabindex="4"
                            label="Nombre"
                            v-model="solicitud.entidad.nombre"
                            :rules="validator.empresa.nombre"
                            :error="submitted.steps[1] && !validControl(validator.empresa.nombre, solicitud.entidad.nombre)"
                          >
                          </v-text-field>

                          <v-select
                            autocomplete
                            tabindex="5"
                            item-text="valor"
                            item-value="id"
                            :items="opciones.empresa"
                            v-model="solicitud.entidad.tipoEmpresa"
                            label="Tipo de Empresa" single-line bottom
                            :rules="validator.empresa.tipoEmpresa"
                            :error="submitted.steps[1] && !validControl(validator.empresa.tipoEmpresa, solicitud.entidad.tipoEmpresa)"
                          >
                          </v-select>

                          <input-fecha
                              tabindex="6"
                              v-model="solicitud.entidad.fechaConstitucion"
                              label="Fecha de Constitución"
                          >
                          </input-fecha>

                          <v-select
                            autocomplete
                            tabindex="7"
                            item-text="valor"
                            item-value="id"
                            :items="opciones.condicionafip"
                            v-model="solicitud.entidad.condafip"
                            label="Condición AFIP" single-line bottom
                            :rules="validator.empresa.condafip"
                            :error="submitted.steps[1] && !validControl(validator.empresa.condafip, solicitud.entidad.condafip)"
                          >
                          </v-select>
                        </v-flex>

                        <v-flex xs6 class="ma-4">
                          <v-text-field
                            tabindex="8"
                            label="CUIT"
                            v-model="solicitud.entidad.cuit"
                            :rules="validator.empresa.cuit"
                            :error="submitted.steps[1] && !validControl(validator.empresa.cuit, solicitud.entidad.cuit)"
                          >
                          </v-text-field>

                          <input-fecha
                              tabindex="9"
                              v-model="solicitud.entidad.fechaInicio"
                              label="Fecha de Inicio de Actividades"
                          >
                          </input-fecha>

                          <v-select
                            autocomplete
                            tabindex="10"
                            item-text="valor"
                            item-value="id"
                            :items="opciones.sociedad"
                            v-model="solicitud.entidad.tipoSociedad"
                            label="Tipo de Sociedad" single-line bottom
                            :rules="validator.empresa.tipoSociedad"
                            :error="submitted.steps[1] && !validControl(validator.empresa.tipoSociedad, solicitud.entidad.tipoSociedad)"
                          >
                          </v-select>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="11">Continuar</v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 3: DOMICILIOS -->
                <v-stepper-step step="3" edit-icon="check" editable :complete="validStep(3) && step > 3" :rules="[() => step <= 3 || validStep(3)]">
                  Domicilios de la Empresa
                </v-stepper-step>
                <v-stepper-content step="3">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                        <v-layout row class="mx-4">
                          <v-flex xs5>
                            <v-select
                              :items="tipos_domicilio"
                              label="Tipo"
                              v-model="nuevo_domicilio.tipo"
                              autocomplete
                              :rules="validator.entdomicilio.tipo"
                              :error="submitted.domicilio && !validControl(validator.entdomicilio.tipo, nuevo_domicilio.tipo)"
                            >
                            </v-select>                          
                          </v-flex>

                          <v-flex xs5 class="mt-2 ml-4">
                            <v-menu offset-y>
                              <v-btn slot="activator">Copiar de...</v-btn>
                              <v-list>
                                <v-list-tile 
                                  v-for="tipo of tipos_domicilio_cargados" 
                                  :key="tipo.value" @click="copiarDomicilio(tipo.value)"
                                >
                                  <v-list-tile-title>{{ tipo.text }}</v-list-tile-title>
                                </v-list-tile>
                              </v-list>
                            </v-menu>
                          </v-flex>
                        </v-layout>

                        <v-layout row>
                          <v-flex xs6 class="ma-4">
                            <v-select
                              tabindex="12"
                              :items="paises"
                              label="País"
                              v-model="nuevo_domicilio.domicilio.pais"
                              autocomplete
                              item-text="nombre"
                              item-value="id"
                              @input="changePais"
                              :rules="validator.entdomicilio.domicilio.pais"
                              :error="submitted.domicilio && !validControl(validator.entdomicilio.domicilio.pais, nuevo_domicilio.domicilio.pais)"
                            >
                            </v-select>

                            <v-select
                              tabindex="14"
                              :items="departamentos"
                              label="Departamento"
                              @input="changeDepartamento"
                              v-model="nuevo_domicilio.domicilio.departamento"
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              :rules="validator.entdomicilio.domicilio.departamento"
                              :error="submitted.domicilio && !validControl(validator.entdomicilio.domicilio.departamento, nuevo_domicilio.domicilio.departamento)"
                            >
                            </v-select>

                            <v-text-field
                              tabindex="16"
                              label="Calle"
                              v-model="nuevo_domicilio.domicilio.calle"
                              :rules="validator.entdomicilio.domicilio.calle"
                              :error="submitted.domicilio && !validControl(validator.entdomicilio.domicilio.calle, nuevo_domicilio.domicilio.calle)"
                            >
                            </v-text-field>
                          </v-flex>

                          <v-flex xs6 class="ma-4">
                            <v-select
                              tabindex="13"
                              :items="provincias"
                              label="Provincia"
                              @input="changeProvincia"
                              v-model="nuevo_domicilio.domicilio.provincia"
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                              :rules="validator.entdomicilio.domicilio.provincia"
                              :error="submitted.domicilio && !validControl(validator.entdomicilio.domicilio.provincia, nuevo_domicilio.domicilio.provincia)"
                            >
                            </v-select>

                            <v-select
                              tabindex="15"
                              :items="localidades"
                              label="Localidad"
                              v-model="nuevo_domicilio.domicilio.localidad"
                              :rules="validator.entdomicilio.domicilio.localidad"
                              :error="submitted.domicilio && !validControl(validator.entdomicilio.domicilio.localidad, nuevo_domicilio.domicilio.localidad)"
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                            >
                            </v-select>

                            <v-text-field
                              tabindex="17"
                              label="N°"
                              v-model="nuevo_domicilio.domicilio.numero"
                              :rules="validator.entdomicilio.domicilio.numero"
                              :error="submitted.domicilio && !validControl(validator.entdomicilio.domicilio.numero, nuevo_domicilio.domicilio.numero)"
                            >
                            </v-text-field>
                          </v-flex>
                        </v-layout>

                        <v-layout class="mb-4">
                          <v-flex xs12>
                            <v-btn class="right" light @click="addDomicilio">Agregar</v-btn>
                          </v-flex>                     
                        </v-layout>

                        <v-data-table
                            :headers="headers.domicilios"
                            :items="solicitud.entidad.domicilios"
                            hide-actions
                            class="elevation-1"
                            no-data-text="No hay domicilios">
                          <template slot="headers" slot-scope="props">
                            <th v-for="(header, i) of props.headers" :key="i" class="pa-3">
                              <b>{{ header.text }}</b>
                            </th>
                            <th></th>
                          </template>
                          <template slot="items" slot-scope="props">
                            <td>{{ props.item.tipo | upperFirst }}</td>

                            <template v-if="!props.item.id">
                              <td>{{ props.item.pais_nombre }}</td>
                              <td>{{ props.item.provincia_nombre }}</td>
                              <td>{{ props.item.departamento_nombre }}</td>
                              <td>{{ props.item.localidad_nombre }}</td>                             
                            </template>
                            <template v-else>
                              <td>{{ props.item.domicilio.pais }}</td>
                              <td>{{ props.item.domicilio.provincia }}</td>
                              <td>{{ props.item.domicilio.departamento }}</td>
                              <td>{{ props.item.domicilio.localidad }}</td>                             
                            </template>

                            <td>{{ props.item.domicilio.calle }}</td>
                            <td>{{ props.item.domicilio.numero }}</td>                             
                            <td style="width:30px">
                              <v-btn fab small @click="removeElem('domicilios', props.index)">
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </td>
                          </template>
                        </v-data-table>

                    </v-card-text>
                  </v-card>
                  <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="30">Continuar</v-btn>
                  <v-btn flat @click.native="step = 2" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 4: CONTACTOS -->
                <v-stepper-step step="4" edit-icon="check" editable :complete="validStep(4) && step > 4" :rules="[() => step <= 4 || validStep(4)]">
                  Datos de Contacto
                </v-stepper-step>
                <v-stepper-content step="4">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-container>
                        <v-layout row>
                          <v-flex xs6>
                            <v-select
                              item-text="valor"
                              item-value="id"
                              :items="opciones.contacto"
                              label="Tipo de Contacto"
                              single-line
                              bottom
                              v-model="nuevo_contacto.tipo"
                              :rules="submitted.contacto ? validator.contacto.tipo: []"
                              :error="submitted.contacto && !validControl(validator.contacto.tipo, nuevo_contacto.tipo)"
                            >
                            </v-select>
                          </v-flex>

                          <v-flex xs6 class="mx-4" v-if="nuevo_contacto.tipo === 2">
                            <input-celular 
                              v-model="nuevo_contacto.celular"
                            ></input-celular>

                            <v-checkbox 
                              label="Whatsapp" 
                              v-model="nuevo_contacto.whatsapp" 
                              light
                            ></v-checkbox>
                          </v-flex>

                          <v-flex xs6 class="mx-4" v-else>
                            <v-text-field 
                              v-model="nuevo_contacto.valor" 
                              :rules="submitted.contacto ? validator.contacto.valor : []"
                              :error="submitted.contacto && !validControl(validator.contacto.valor, nuevo_contacto.valor)"
                            >
                            </v-text-field>
                          </v-flex>    

                          <v-flex xs2>
                            <v-btn class="right" light @click="addContacto">Agregar</v-btn>
                          </v-flex>                                                
                      </v-layout>

                        <v-data-table
                            :headers="headers.contactos"
                            :items="solicitud.entidad.contactos"
                            hide-actions
                            class="elevation-1"
                            no-data-text="No hay contactos">
                          <template slot="headers" slot-scope="props">
                            <th v-for="(header, i) of props.headers" :key="i" class="pa-3">
                              <b>{{ header.text }}</b>
                            </th>
                            <th></th>
                          </template>
                          <template slot="items" slot-scope="props">
                            <td>{{ getTipoContacto(props.item.tipo) }}</td>
                            <td>{{ props.item.valor }}</td>
                            <td style="width:30px">
                              <v-btn fab dark small color="blue" @click="removeElem('contactos', props.index)">
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </td>
                          </template>
                        </v-data-table>
                      </v-container>
                    </v-card-text>
                  </v-card>
                  <v-btn blue darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 5: INCUMBENCIAS -->
                <v-stepper-step step="5" edit-icon="check" editable :complete="validStep(5) && step > 5" :rules="[() => step <= 5 || validStep(5)]">
                  Incumbencias
                </v-stepper-step>
                <v-stepper-content step="5">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                      <v-container>
                        <v-layout row>
                          <v-flex xs8 class="ma-4">
                            <v-select
                              autocomplete single-line bottom
                              item-text="valor"
                              item-value="id"
                              :items="opciones.incumbencia"
                              v-model="nueva_incumbencia"
                              label="Incumbencias"
                              :rules="submitted.incumbencia ? validator.incumbencia : []"
                              :error="submitted.incumbencia && !validControl(validator.incumbencia, nueva_incumbencia)"
                            >
                            </v-select>
                          </v-flex>

                          <v-flex xs4 class="ma-4">
                            <v-btn light @click="addIncumbencia">Agregar</v-btn>
                          </v-flex>
                        </v-layout>


                          <v-data-table
                              :headers="headers.incumbencias"
                              :items="solicitud.entidad.incumbencias"
                              hide-actions
                              class="elevation-1"
                              no-data-text="No hay incumbencias">
                            <template slot="headers" slot-scope="props">
                              <th v-for="(header, i) of props.headers" :key="i" class="pa-3 text-xs-left">
                                <b>{{ header.text }}</b>
                              </th>
                              <th></th>
                            </template>
                            <template slot="items" slot-scope="props">
                              <td>{{ getTipoIncumbencia(props.item) }}</td>
                              <td style="width:30px">
                                <v-btn icon small @click="removeElem('incumbencias', props.index)">
                                  <v-icon>delete</v-icon>
                                </v-btn>
                              </td>
                            </template>
                          </v-data-table>
                      </v-container>
                    </v-card-text>
                  </v-card>
                  <v-btn blue darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 6: REPRESENTANTE -->
                <v-stepper-step step="6" edit-icon="check" editable :complete="validStep(6) && step > 6" :rules="[() => step <= 6 || validStep(6)]">
                  Representante Técnico
                </v-stepper-step>
                <v-stepper-content step="6">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>
                        <span class="ml-3"><b>Buscar:</b></span>
                        <v-layout row wrap>
                          <v-flex xs3  class="mx-3">
                            <v-text-field
                              label="N°"
                              @input="updateList"
                              v-model="filtros.numero"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs3>
                            <v-text-field
                              label="Apellido"
                              @input="updateList"
                              v-model="filtros.apellido"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs3  class="mx-3">
                            <v-text-field
                              label="DNI"
                              @input="updateList"
                              v-model="filtros.dni"
                            >
                            </v-text-field>
                          </v-flex>
                        </v-layout>

                        <v-layout row>
                          <v-flex xs12 class="ma-3">
                            <v-data-table
                                :rows-per-page-items="[5, 10, 25]"
                                :headers="headers.matriculados"
                                :items="matriculados"
                                class="elevation-1"
                                no-data-text="No se encontraron matriculados"
                                no-results-text="No se encontraron matriculados"
                                v-bind:pagination.sync="pagination"
                                :total-items="totalItems"
                                :loading="loading"
                                >
                              <template slot="headers" slot-scope="props">
                                <th v-for="(header, i) of props.headers" :key="i" class="pa-3 text-xs-left">
                                  <b>{{ header.text }}</b>
                                </th>
                                <th></th>
                              </template>
                              <template slot="items" slot-scope="props">
                                <tr>
                                  <td>{{ props.item.numeroMatricula }}</td>
                                  <td>{{ props.item.entidad.nombre }}</td>
                                  <td>{{ props.item.entidad.apellido }}</td>
                                  <td>{{ props.item.entidad.dni }}</td>
                                  <td>
                                    <v-btn fab dark small color="blue" @click="selectRepresentantePrimario(props.item)">
                                      <v-icon>check</v-icon>
                                    </v-btn>
                                  </td>
                                </tr>
                              </template>
                            </v-data-table>
                          </v-flex>
                        </v-layout>

                        <br>
                        <span class="ml-3"><b>Representante:</b></span>

                        <v-layout row wrap>
                          <v-flex xs12 class="mx-3">
                            <v-data-table
                                hide-actions
                                :headers="headers.matriculados"
                                :items="representante"
                                class="elevation-1"                                
                                no-data-text="No se agregaron representates"
                                no-results-text="No se agregaron representates"
                                >
                              <template slot="headers" slot-scope="props">
                                <th v-for="(header, i) of props.headers" :key="i" class="pa-3 text-xs-left">
                                  <b>{{ header.text }}</b>
                                </th>
                                <!-- <th></th> -->
                              </template>
                              <template slot="items" slot-scope="props">
                                <tr>
                                  <td>{{ props.item.numeroMatricula }}</td>
                                  <td>{{ props.item.nombre }}</td>
                                  <td>{{ props.item.apellido }}</td>
                                  <td>{{ props.item.dni }}</td>
                                  <!-- <td>
                                    <v-btn icon small @click="borrarRepresentante(props.item.numeroMatricula)">
                                      <v-icon>delete</v-icon>
                                    </v-btn>
                                  </td> -->
                                </tr>
                              </template>
                            </v-data-table>
                          </v-flex>
                        </v-layout>
                    </v-card-text>
                  </v-card>

                  <v-btn blue darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 7: REPRESENTANTES SECUNDARIOS -->
                <v-stepper-step step="7" edit-icon="check" editable :complete="validStep(7) && step > 7" :rules="[() => step <= 7 || validStep(7)]">
                  Representantes Legales
                </v-stepper-step>
                <v-stepper-content step="7">
                  <v-card class="grey lighten-4 elevation-4 mb-2">
                    <v-card-text>

                        <v-radio-group v-model="tipo_representante" row @change="updateListSec"> 
                          <v-radio label="Matriculado TEC" value="tec" ></v-radio>
                          <v-radio label="Matriculado Externo" value="ext"></v-radio>
                        </v-radio-group>
                        
                        <v-layout row wrap>
                          <v-flex xs1  class="mx-3">
                            <div class="ma-4">Filtrar:</div>
                          </v-flex>
                          <v-flex xs3  class="mx-3">
                            <v-text-field
                              label="N° Matrícula"
                              @input="updateListSec"
                              v-model="table_rep_sec.filtros.numero"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs3>
                            <v-text-field
                              label="Apellido"
                              @input="updateListSec"
                              v-model="table_rep_sec.filtros.apellido"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs3  class="mx-3">
                            <v-text-field
                              label="DNI"
                              @input="updateListSec"
                              v-model="table_rep_sec.filtros.dni"
                            >
                            </v-text-field>
                          </v-flex>
                        </v-layout>

                        <v-layout row>
                          <v-flex xs12 class="ma-3">
                            <v-card class="elevation-1" >
                              <v-card-text>
                                <v-btn
                                  v-show="tipo_representante == 'ext'"
                                  absolute dark fab top right small
                                  color="green"
                                  @click="expand_add = true"
                                >
                                  <v-icon>add</v-icon>
                                </v-btn>     

                                <v-data-table
                                    :rows-per-page-items="[5, 10, 25]"
                                    :headers="headers.matriculados"
                                    :items="table_rep_sec.matriculas"
                                    no-data-text="No se encontraron matriculados"
                                    no-results-text="No se encontraron matriculados"
                                    :pagination.sync="table_rep_sec.pagination"
                                    :total-items="table_rep_sec.total"
                                    :loading="table_rep_sec.loading"
                                    >
                                  <template slot="headers" slot-scope="props">
                                    <th v-for="(header, i) of props.headers" :key="i" class="pa-3 text-xs-left">
                                      <b>{{ header.text }}</b>
                                    </th>
                                    <th></th>
                                  </template>
                                  <template slot="items" slot-scope="props">
                                    <tr>
                                      <td>{{ props.item.numeroMatricula }}</td>
                                      <template v-if="props.item.entidad">
                                        <td>{{ props.item.entidad.nombre }}</td>
                                        <td>{{ props.item.entidad.apellido }}</td>
                                        <td>{{ props.item.entidad.dni }}</td>                                        
                                      </template>
                                      <template v-else>
                                        <td>{{ props.item.nombre }}</td>
                                        <td>{{ props.item.apellido }}</td>
                                        <td>{{ props.item.dni }}</td>                                        
                                      </template>                                      
                                      <td>
                                        <v-btn fab dark small color="blue" @click="addRepresentanteSecundario(props.item)">
                                          <v-icon>playlist_add</v-icon>
                                        </v-btn>
                                      </td>
                                    </tr>
                                  </template>
                                </v-data-table>                                 
                              </v-card-text>
                                  
                             </v-card>

                          </v-flex>
                        </v-layout>

                        <br>
                        <span class="ml-3"><b>Representantes Legales:</b></span>

                        <v-layout row wrap>
                          <v-flex xs12 class="mx-3">
                            <v-data-table
                                hide-actions
                                :headers="headers.matriculados"
                                :items="representantes_legales"
                                class="elevation-1"                                
                                no-data-text="No se agregaron representates"
                                no-results-text="No se agregaron representates"
                                >
                              <template slot="headers" slot-scope="props">
                                <th v-for="(header, i) of props.headers" :key="i" class="pa-3 text-xs-left">
                                  <b>{{ header.text }}</b>
                                </th>
                                <!-- <th></th> -->
                              </template>
                              <template slot="items" slot-scope="props">
                                <tr>
                                  <td>{{ props.item.numeroMatricula }}</td>
                                  <td>{{ props.item.nombre }}</td>
                                  <td>{{ props.item.apellido }}</td>
                                  <td>{{ props.item.dni }}</td>
                                  <!-- <td>
                                    <v-btn icon small @click="borrarRepresentante(props.item.numeroMatricula)">
                                      <v-icon>delete</v-icon>
                                    </v-btn>
                                  </td> -->
                                </tr>
                              </template>
                            </v-data-table>
                          </v-flex>
                        </v-layout>
                    </v-card-text>
                  </v-card>

                  <br><br>

                  <v-checkbox class="ma-0 pa-0" label="Recibir Actualizaciones" v-model="solicitud.entidad.recibirActualizaciones">
                  </v-checkbox>                  

                  <v-btn class="blue darken-1 white--text right" @click.native="imprimir" v-if="this.id">
                    Imprimir
                    <v-icon dark right>check_circle</v-icon>
                  </v-btn>

                  <v-btn class="blue darken-1 white--text right" @click.native="submit" :disabled="!validForm()">
                    Guardar Solicitud
                    <v-icon dark right>check_circle</v-icon>
                  </v-btn>
                  <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
                </v-stepper-content>


              </v-stepper>
          </v-container>

          </form>
        </v-flex>

        <div class="stuck">
          <v-toolbar class="blue darken-3">
            <v-toolbar-title class="white--text">Datos de la Empresa</v-toolbar-title>
            <v-spacer></v-spacer>
          </v-toolbar>
          <v-container>
            <v-card>
              <v-card-text id="info-empresa">
                <div><b>Nombre: </b> {{ solicitud.entidad.nombre }} </div>
                <div><b>CUIT: </b> {{ solicitud.entidad.cuit }} </div>
                <div><b>Fecha de Inicio de Actividades: </b> {{ solicitud.entidad.fechaInicio }} </div>
                <div><b>Fecha de Constitución: </b> {{ solicitud.entidad.fechaConstitucion }} </div>
                <div><b>Tipo de Empresa: </b> {{ solicitud.entidad.tipoEmpresa ? getTipoEmpresa(solicitud.entidad.tipoEmpresa) : '' }} </div>
                <div><b>Tipo de Sociedad: </b> {{ solicitud.entidad.tipoSociedad ? getTipoSociedad(solicitud.entidad.tipoSociedad) : '' }} </div>
              </v-card-text>
            </v-card>
          </v-container>
        </div>
      </v-layout>


    <v-dialog v-model="expand_add" fullscreen transition="dialog-bottom-transition" :overlay="false">
      <v-card>
        <v-toolbar dark class="blue">
          <v-toolbar-title class="white--text">Agregar Matriculado Externo</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="expand_add = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-toolbar>
        
        <nueva-matricula-externa
          @nueva="expand_add = false"
        ></nueva-matricula-externa>
      </v-card>
    </v-dialog>      
    </v-container>
</template>

<script>
import axios from '@/axios'
import * as moment from 'moment'
import * as utils from '@/utils'
import rules from '@/rules'
import * as Model from '@/model'
import InputFecha from '@/components/base/InputFecha'
import InputCelular from '@/components/base/InputCelular'
import ValidatorMixin from '@/components/mixins/ValidatorMixin'
import NuevaSolicitud from '@/components/solicitudes/nueva/NuevaSolicitud'
import NuevaMatriculaExterna from '@/components/NuevaMatriculaExterna'
import { impresionSolicitud } from '@/utils/PDFUtils'


export default {
  name: 'nueva-solicitud-empresa',
  mixins: [ValidatorMixin, NuevaSolicitud],
  props: ['id'],

  data () {
    return {
      expand_add: false,
      num_steps: 6,
      solicitud: new Model.Solicitud('empresa'),
      nuevo_contacto: new Model.Solicitud(),
      nueva_incumbencia: '',
      submitted: {
        steps: [
          false, false, false, false, false,
          false, false, false, false
        ],
        contacto: false,
        incumbencia: false
      },

      validator: {
        empresa: {
          nombre: [ rules.required ], cuit: [ rules.required, rules.number ],
          tipoEmpresa: [ rules.required ], tipoSociedad: [ rules.required ], condafip: [ rules.required ]
        },
        incumbencia: [ rules.required ]
      },

      tipo_representante: 'tec',

      matriculados: [],      
      debouncedUpdate: null,
      totalItems: 0,
      loading: false,
      pagination: {
         rowsPerPage: 5,
      },
      filtros: {
        numero: '',
        dni: '',
        apellido: ''
      },      

      table_rep_sec: {
        debounceUpdate: null,
        loading: false,
        matriculas: [],
        total: 0,
        pagination: {
          rowsPerPage: 5
        },
        filtros: {
          numero: '',
          dni: '',
          apellido: ''
        }       
      }, 
    }
  },

  watch: {
    filtros: {
      handler () {
        this.updateMatriculas();
      },
      deep: true
    },

    pagination: {
      handler () {
        this.updateMatriculas();
      },
      deep: true
    },

    step: function(new_step) {
      if (new_step == 7) this.updateListSec();
    }
  },

  computed: {
    representantes_legales: function() {
      if (!this.solicitud.entidad.representantes.length) return [];
      return this.solicitud.entidad.representantes.filter(r => r.tipo != 'primario');
    },

    representante: function() {
      if (!this.solicitud.entidad.representantes.length) return [];
      return this.solicitud.entidad.representantes.filter(r => r.tipo == 'primario');
    }
  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.updateMatriculas, 600, { 'maxWait': 1000 });
    this.table_rep_sec.debouncedUpdate = _.debounce(this.updateMatriculasSec, 600, { 'maxWait': 1000 });
    
    Promise.all([
      axios.get('/paises'),
      axios.get('/opciones?sort=valor'),
      axios.get('/delegaciones')
    ])
    .then(r => {
      this.paises = r[0].data;
      this.opciones = r[1].data;
      this.delegaciones = r[2].data;
      
      if (this.id) { 
        axios.get(`/solicitudes/${this.id}`)
        .then(r => {          
              this.solicitud = new Model.Solicitud('empresa');
              this.solicitud.fecha = moment(r.data.fecha).format('DD/MM/YYYY');
              this.solicitud.delegacion = this.delegaciones.find(d => d.nombre == r.data.delegacion).id;
              
              this.solicitud.entidad.id = r.data.entidad.id;
              this.solicitud.entidad.nombre = r.data.entidad.nombre;          
              this.solicitud.entidad.cuit = r.data.entidad.cuit;
              this.solicitud.entidad.fechaInicio = moment(r.data.entidad.fechaInicio).format('DD/MM/YYYY');
              this.solicitud.entidad.fechaConstitucion = moment(r.data.entidad.fechaConstitucion).format('DD/MM/YYYY');
              this.solicitud.entidad.tipoEmpresa = this.opciones.empresa.find(i => i.valor == r.data.entidad.tipoEmpresa).id;
              this.solicitud.entidad.tipoSociedad = this.opciones.sociedad.find(i => i.valor == r.data.entidad.tipoSociedad).id;
              this.solicitud.entidad.condafip = this.opciones.condicionafip.find(i => i.valor == r.data.entidad.condafip).id;

              this.solicitud.entidad.domicilios = entidad.domicilios;

              for(let contacto of r.data.entidad.contactos) {
                let contacto_nuevo = contacto;
                contacto_nuevo.tipo = this.opciones.contacto.find(i => i.valor == contacto.tipo).id;
                this.solicitud.entidad.contactos.push(contacto_nuevo);
              }

              for(let incumbencia of r.data.entidad.incumbencias) {
                this.solicitud.entidad.incumbencias.push(incumbencia.id);
              }

              this.solicitud.entidad.representantes = r.data.entidad.representantes;
        })
      }
    })
    .catch(e => console.error(e));
  },

  methods: {
    getTipoContacto: function(id) {
      return this.opciones.contacto.find(o => o.id == id).valor;
    },

    getTipoEmpresa: function(id) {
      return this.opciones.empresa.find(e => e.id == id).valor;
    },

    getTipoSociedad: function(id) {
      return this.opciones.sociedad.find(s => s.id == id).valor;
    },

    getTipoIncumbencia: function(id) {
      return this.opciones.incumbencia.find(o => o.id == id).valor;
    },

    addIncumbencia: function() {
      this.submitted.incumbencia = true;
      if ( this.validator.incumbencia[0](this.nueva_incumbencia) != 'Dato Obligatorio' ) {
        this.submitted.incumbencia = false;
        this.solicitud.entidad.incumbencias.push(this.nueva_incumbencia);
        this.nueva_incumbencia = '';
      }
    },

    submit: function() {
      this.solicitud.operador = this.user.id;
      
      if (!this.id) {
        axios.post('/solicitudes', this.solicitud)
            .then(r => {
              if (r.status != 201) {
                this.submitError();
              }
              this.global_state.snackbar.msg = 'Nueva solicitud creada exitosamente!';
              this.global_state.snackbar.color = 'success';
              this.global_state.snackbar.show = true;
              this.$router.push('/solicitudes/lista')

            })
            .catch(e => this.submitError());
      }
      else {
        axios.put(`/solicitudes/${this.id}`, this.solicitud)
          .then(r => {
            if (r.status != 200) {
              this.submitError();
            }
            this.global_state.snackbar.msg = 'Solicitud modificada exitosamente!';
            this.global_state.snackbar.color = 'success';
            this.global_state.snackbar.show = true;
            this.$router.replace('/solicitudes/lista');
          })
          .catch(e => this.submitError());        
      }      
    },

    validStep: function(i) {
      if (i == 1) return utils.validObject(this.solicitud.fecha, this.validator.solicitud);
      else if (i == 2) {
        let empresa = this.solicitud.entidad;
        return utils.validObject(empresa, this.validator.empresa);
      }
      else if (i == 3) {
        return this.solicitud.entidad.domicilios.length > 0;
      }
      else if (i == 6) {
        return this.solicitud.entidad.representantes.length > 0;
      }
      else return true;
    },

    updateMatriculasSec: function() {
      this.table_rep_sec.loading = true;
      this.table_rep_sec.matriculas = [];

      let offset = (this.table_rep_sec.pagination.page - 1) * this.table_rep_sec.pagination.rowsPerPage;
      let limit = this.table_rep_sec.pagination.rowsPerPage;

      let url;
      if (this.tipo_representante == 'ext') url = `/matriculas-externas?limit=${limit}&offset=${offset}`;
      else url = `/matriculas?tipoEntidad=profesional&estado=13&limit=${limit}&offset=${offset}`;      

      if (this.table_rep_sec.filtros.numero) url += `&numeroMatricula=${this.table_rep_sec.filtros.numero}`;
      if (this.table_rep_sec.filtros.dni) url+=`&dni=${this.table_rep_sec.filtros.dni}`;
      if (this.table_rep_sec.filtros.apellido) url+=`&apellido=${this.table_rep_sec.filtros.apellido}`;

      axios.get(url)
           .then(r => {
             this.table_rep_sec.matriculas = r.data.resultados;
             this.table_rep_sec.total = r.data.totalQuery;
             this.table_rep_sec.loading = false;
           })
           .catch(e => console.error(e));
    },

    updateMatriculas: function() {
      this.loading = true;
      this.matriculados = [];
      let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
      let limit = this.pagination.rowsPerPage;

      // El estado '13' es 'Habilitado'
      let url = `/matriculas?tipoEntidad=profesional&estado=13&limit=${limit}&offset=${offset}`;

      if (this.filtros.numero) url += `&numeroMatricula=${this.filtros.numero}`;
      if (this.filtros.dni) url+=`&dni=${this.filtros.dni}`;
      if (this.filtros.apellido) url+=`&apellido=${this.filtros.apellido}`;

      axios.get(url)
           .then(r => {
             this.matriculados = r.data.resultados;
             this.totalItems = r.data.totalQuery;
             this.loading = false;
           })
           .catch(e => console.error(e));
    },

    updateList: function() {
      this.debouncedUpdate();
    },

    updateListSec: function() {
      this.table_rep_sec.debouncedUpdate();
    },

    selectRepresentantePrimario: function(matricula) {
      this.solicitud.entidad.representantes = [{
        tipo: 'primario',
        matricula: matricula.id,
        numeroMatricula: matricula.numeroMatricula,
        dni: matricula.entidad.dni,
        apellido: matricula.entidad.apellido,
        nombre: matricula.entidad.nombre
      }]
    },

    addRepresentanteSecundario: function(matricula) {
      this.solicitud.entidad.representantes.push({
        tipo: 'secundario',
        matricula: matricula.id,
        numeroMatricula: matricula.numeroMatricula,
        dni: matricula.entidad ? matricula.entidad.dni : matricula.dni,
        apellido: matricula.entidad ? matricula.entidad.apellido : matricula.apellido,
        nombre: matricula.entidad ? matricula.entidad.nombre : matricula.nombre
      })
    },

    borrarRepresentante: function(numeroMatricula) {
      this.solicitud.entidad.representantes = this.solicitud.entidad.representantes
                                                  .filter(r => r.numeroMatricula != numeroMatricula);
    },

    imprimir: function() {
      axios.get(`/solicitudes/${this.id}`)
          .then(s => {
            let solicitud = s.data;
            let pdf = impresionSolicitud(solicitud);
            pdf.save(`Solicitud ${solicitud.entidad.nombre}.pdf`)
          })
          .catch(e => console.error(e));
    },   

    addMatriculaExterna: function() {

    }
  },

  components: {
    InputFecha, InputCelular,
    NuevaMatriculaExterna
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
