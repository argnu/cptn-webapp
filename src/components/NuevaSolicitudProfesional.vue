<template>
  <v-container>
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
                            <input-fecha
                              v-model="solicitud.fecha"
                              label="Fecha de Solicitud"
                              :rules="validation.solicitud.fecha"
                            >
                            </input-fecha>
                          </v-flex>
                          <v-flex xs6 class="ml-5">
                            <v-select
                              autocomplete
                              v-bind:items="select_items.delegacion" v-model="solicitud.delegacion"
                              label="Delegación"
                              :rules="validation.solicitud.delegacion"
                            >
                            </v-select>
                          </v-flex>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                    <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
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
                          <v-text-field
                            label="Nombre"
                            v-model="solicitud.entidad.nombre"
                            tabindex="1"
                            :rules="validation.profesional.nombre"
                          >
                          </v-text-field>
                          <v-text-field
                            label="DNI"
                            v-model="solicitud.entidad.dni"
                            :rules="validation.profesional.dni"
                            tabindex="3">
                          </v-text-field>
                          <v-select
                            autocomplete
                            :items="select_items.sexo"
                            v-model="solicitud.entidad.sexo"
                            label="Sexo" single-line bottom tabindex="5">
                          </v-select>
                          <input-fecha
                              v-model="solicitud.entidad.fechaNacimiento"
                              label="Fecha de Nacimiento"
                              :rules="validation.profesional.fechaNacimiento"
                          >
                          </input-fecha>
                          <v-text-field label="Nacionalidad" v-model="solicitud.entidad.nacionalidad"
                            tabindex="9">
                          </v-text-field>
                          <v-select
                            autocomplete
                            :items="select_items.condafip"
                            v-model="solicitud.entidad.condafip"
                            label="Condición AFIP" single-line bottom tabindex="5">
                          </v-select>
                        </v-flex>

                        <v-flex xs6>
                          <v-text-field label="Apellido"
                            v-model="solicitud.entidad.apellido"
                            :rules="validation.profesional.apellido"
                            tabindex="2"
                          >
                          </v-text-field>
                          <v-text-field label="CUIT" v-model="solicitud.entidad.cuit"
                            tabindex="4">
                          </v-text-field>
                          <v-select
                            autocomplete
                            tabindex="6"
                            :items="select_items.estadoCivil"
                            v-model="solicitud.entidad.estadoCivil"
                            label="Estado Civil"
                            single-line bottom>
                          </v-select>
                          <v-text-field label="Lugar Nacimiento" v-model="solicitud.entidad.lugarNacimiento"
                            tabindex="8">
                          </v-text-field>
                          <v-text-field label="Observaciones" v-model="solicitud.entidad.observaciones"
                            tabindex="10">
                          </v-text-field>
                        </v-flex>
                      </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.native="step = 1" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 3: DOMICILIOS -->
                <v-stepper-step step="3" editable :complete="step > 3">
                  Domicilios del Profesional
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
                              v-model="solicitud.entidad.domicilioReal.pais"
                            >
                            </v-select>
                            <v-select
                              autocomplete
                              :items="select_items.departamentos.real"
                              label="Departamento"
                              @change="changeDepartamento('real')"
                              v-model="solicitud.entidad.domicilioReal.departamento"
                            >
                            </v-select>
                            <v-text-field
                              label="Calle"
                              v-model="solicitud.entidad.domicilioReal.calle"
                              :rules="validation.domicilioReal.calle"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs6>
                            <v-select
                              autocomplete
                              :items="select_items.provincias.real"
                              label="Provincia"
                              @change="changeProvincia('real')"
                              v-model="solicitud.entidad.domicilioReal.provincia"
                            >
                            </v-select>
                            <v-select
                              autocomplete
                              :items="select_items.localidades.real"
                              label="Localidad"
                              v-model="solicitud.entidad.domicilioReal.localidad"
                              :rules="validation.domicilioReal.localidad"
                            >
                            </v-select>
                            <v-text-field
                              label="Nro"
                              v-model="solicitud.entidad.domicilioReal.numero"
                              :rules="validation.domicilioReal.numero"
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
                              v-model="solicitud.entidad.domicilioLegal.pais"
                            >
                            </v-select>
                            <v-select
                              autocomplete
                              :items="select_items.departamentos.legal"
                              label="Departamento"
                              @change="changeDepartamento('legal')"
                              v-model="solicitud.entidad.domicilioLegal.departamento"
                            >
                            </v-select>
                            <v-text-field
                              label="Calle"
                              v-model="solicitud.entidad.domicilioLegal.calle"
                              :rules="validation.domicilioLegal.calle"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs6>
                            <v-select
                              autocomplete
                              :items="select_items.provincias.legal"
                              label="Provincia"
                              @change="changeProvincia('legal')"
                              v-model="solicitud.entidad.domicilioLegal.provincia"
                            >
                            </v-select>
                            <v-select
                              autocomplete
                              :items="select_items.localidades.legal"
                              label="Localidad"
                              v-model="solicitud.entidad.domicilioLegal.localidad"
                              :rules="validation.domicilioLegal.localidad"
                            >
                            </v-select>
                            <v-text-field
                              label="Nro"
                              v-model="solicitud.entidad.domicilioLegal.numero"
                              :rules="validation.domicilioLegal.numero"
                            >
                            </v-text-field>
                          </v-flex>
                        </v-layout>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
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
                              autocomplete
                              :items="select_items.tipoContacto"
                              label="Tipo de Contacto"
                              single-line
                              bottom
                              v-model="nuevo_contacto.tipo"
                              :rules="validation.contacto.tipo"
                            >
                            </v-select>
                          </v-flex>
                          <v-flex xs6>
                            <v-text-field
                              label="Valor"
                              v-model="nuevo_contacto.valor"
                              :rules="validation.contacto.valor"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-btn light @click="addContacto">Agregar</v-btn>
                        </v-layout>

                        <v-data-table
                            :headers="headers.contacto"
                            :items="solicitud.entidad.contactos"
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
                              autocomplete
                              :items="select_items.tipoFormacion"
                              label="Tipo de Formación"
                              single-line
                              bottom
                              v-model="nueva_formacion.tipo"
                              :rules="validation.formacion.tipo"
                            >
                            </v-select>
                            <v-text-field
                              label="Título"
                              v-model="nueva_formacion.titulo"
                              :rules="validation.formacion.titulo"
                            >
                            </v-text-field>
                          </v-flex>
                          <v-flex xs6>
                            <input-fecha
                              v-model="nueva_formacion.fecha"
                              label="Fecha"
                              :rules="validation.formacion.fecha"
                            >
                            </input-fecha>
                            <v-select
                              autocomplete
                              :items="select_items.instituciones"
                              label="Institución"
                              single-line
                              bottom
                              v-model="nueva_formacion.institucion"
                              :rules="validation.formacion.institucion"
                            >
                            </v-select>
                            </v-text-field>
                          </v-flex>
                        </v-layout>

                        <v-btn light @click="addFormacion" style="float:right">Agregar</v-btn>
                        <br style="clear:both">


                        <v-data-table
                            :headers="headers.formacion"
                            :items="solicitud.entidad.formaciones"
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
                            <td>{{ getInstitucion(props.item.institucion) }}</td>
                            <td style="width:30px">
                              <v-btn icon @click="removeFormacion('formaciones', props.index)">
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </td>
                          </template>
                        </v-data-table>
                      </v-container>
                    </v-card-text>
                  </v-card>
                  <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                  <v-btn flat @click.native="step = 4" class="right">Volver</v-btn>
                </v-stepper-content>


                <!-- PASO 6: DATOS ADICIONALES -->
                 <v-stepper-step step="6" editable v-bind:complete="step > 6">
                  Datos Adicionales
                 </v-stepper-step>
                 <v-stepper-content step="6">
                   <v-card class="grey lighten-4 elevation-4 mb-2">
                       <v-card-text>
                         <v-layout row>
                           <v-flex xs6>
                             <v-radio
                                label="Relación de Dependencia"
                                v-model="solicitud.entidad.relacionLaboral"
                                value="1"
                              >
                             </v-radio>
                             <v-radio
                                label="Autónomo"
                                v-model="solicitud.entidad.relacionLaboral"
                                value="2"
                              >
                             </v-radio>
                           </v-flex>
                           <v-flex xs6 class="ml-5">
                             <v-text-field
                                label="Empresa"
                                v-show="solicitud.entidad.relacionLaboral == 1"
                                v-model="solicitud.entidad.empresa"
                              >
                             </v-text-field>
                             <v-text-field
                                label="Servicios Prestados"
                                v-show="solicitud.entidad.relacionLaboral == 2"
                                v-model="solicitud.entidad.serviciosPrestados"
                              >
                             </v-text-field>
                           </v-flex>
                         </v-layout>
                       </v-card-text>
                     </v-card>
                     <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                     <v-btn flat @click.native="step = 5" class="right">Volver</v-btn>
                 </v-stepper-content>



                <!-- PASO 7: CAJA PREVISIONAL -->
                 <v-stepper-step step="7" editable v-bind:complete="step > 7">
                  Caja Previsional
                 </v-stepper-step>
                 <v-stepper-content step="7">
                   <v-card class="grey lighten-4 elevation-4 mb-2">
                       <v-card-text>
                         <v-layout row>
                           <v-flex xs6>
                             <v-radio
                                label="Ya poseo Caja Previsional"
                                value="poseo"
                                v-model="cajaPrevisional"
                              >
                             </v-radio>
                           </v-flex>
                           <v-flex xs6>
                             <v-text-field
                                label="Nombre"
                                v-show="cajaPrevisional == 'poseo'"
                                v-model="solicitud.entidad.cajaPrevisional"
                              >
                             </v-text-field>
                           </v-flex>
                         </v-layout>

                         <v-layout row>
                           <v-flex>
                             <v-radio
                                label="Solicitar Alta"
                                value="alta"
                                v-model="cajaPrevisional"
                              >
                             </v-radio>
                           </v-flex>
                         </v-layout>

                         <v-layout row v-show="cajaPrevisional == 'alta'">
                           <v-flex xs6>
                             <v-text-field
                                label="DNI"
                                v-model="nuevo_beneficiario.dni"
                              >
                             </v-text-field>
                             <v-text-field
                                label="Apellido"
                                v-model="nuevo_beneficiario.apellido"
                              >
                             </v-text-field>
                             <v-text-field
                                label="Nombre"
                                v-model="nuevo_beneficiario.nombre"
                              >
                             </v-text-field>
                           </v-flex>
                           <v-flex xs6>
                             <input-fecha
                               v-model="nuevo_beneficiario.fechaNacimiento"
                               label="Fecha de Nacimiento"
                               :rules="validation.formacion.fecha"
                             >
                             </input-fecha>
                             <v-text-field
                                label="Vínculo"
                                v-model="nuevo_beneficiario.vinculo"
                              >
                             </v-text-field>
                             <v-checkbox
                                label="Invalidez"
                                v-model="nuevo_beneficiario.invalidez"
                              >
                             </v-checkbox>
                           </v-flex>
                         </v-layout>

                         <div v-show="cajaPrevisional == 'alta'">
                           <v-btn class="right mb-4" light @click="addBeneficiario">
                             Agregar
                           </v-btn>
                           <v-data-table
                               :headers="headers.beneficiarios"
                               :items="solicitud.entidad.beneficiarios"
                               hide-actions
                               class="elevation-1"
                               no-data-text="No hay beneficiarios">
                             <template slot="headers" scope="props">
                               <th v-for="header of props.headers" style="padding: 20px">
                                 {{ header.text }}
                               </th>
                               <th></th>
                             </template>
                             <template slot="items" scope="props">
                               <td>{{ props.item.dni }}</td>
                               <td>{{ props.item.apellido }}</td>
                               <td>{{ props.item.nombre }}</td>
                               <td>{{ props.item.fechaNacimiento }}</td>
                               <td>{{ props.item.vinculo }}</td>
                               <td>{{ props.item.invalidez | boolean }}</td>
                               <td style="width:30px">
                                 <v-btn icon @click="removeElem('beneficiarios', props.index)">
                                   <v-icon>delete</v-icon>
                                 </v-btn>
                               </td>
                             </template>
                           </v-data-table>
                         </div>
                       </v-card-text>
                     </v-card>
                     <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                     <v-btn flat @click.native="step = 6" class="right">Volver</v-btn>
                 </v-stepper-content>



                <!-- PASO 8: SUBSIDIO POR FALLECIMIENTO -->
                 <v-stepper-step step="8" editable v-bind:complete="step > 8">
                  Subsidio Por Fallecimiento
                 </v-stepper-step>
                 <v-stepper-content step="8">
                   <v-card class="grey lighten-4 elevation-4 mb-2">
                       <v-card-text>
                         <v-layout row>
                           <v-flex xs6>
                             <v-text-field
                                label="DNI"
                                v-model="nuevo_subsidiario.dni"
                              >
                             </v-text-field>
                             <v-text-field
                                label="Apellido"
                                v-model="nuevo_subsidiario.apellido"
                              >
                             </v-text-field>
                           </v-flex>
                           <v-flex xs6>
                             <v-text-field
                                label="Nombre"
                                v-model="nuevo_subsidiario.nombre"
                              >
                             </v-text-field>
                             <v-text-field
                                label="Porcentaje"
                                v-model="nuevo_subsidiario.porcentaje"
                              >
                             </v-text-field>
                           </v-flex>
                         </v-layout>

                         <v-btn class="right mb-4" light @click="addSubsidiario">
                           Agregar
                         </v-btn>

                         <v-data-table
                             :headers="headers.subsidiarios"
                             :items="solicitud.entidad.subsidiarios"
                             hide-actions
                             class="elevation-1"
                             no-data-text="No hay subsidiarios">
                           <template slot="headers" scope="props">
                             <th v-for="header of props.headers" style="padding: 20px">
                               {{ header.text }}
                             </th>
                             <th></th>
                           </template>
                           <template slot="items" scope="props">
                             <td>{{ props.item.dni }}</td>
                             <td>{{ props.item.apellido }}</td>
                             <td>{{ props.item.nombre }}</td>
                             <td>{{ props.item.porcentaje }}</td>
                             <td style="width:30px">
                               <v-btn icon @click="removeElem('subsidiarios', props.index)">
                                 <v-icon>delete</v-icon>
                               </v-btn>
                             </td>
                           </template>
                         </v-data-table>

                       </v-card-text>
                     </v-card>
                     <v-btn primary @click.native="nextStep" class="right">Continuar</v-btn>
                     <v-btn flat @click.native="step = 6" class="right">Volver</v-btn>
                 </v-stepper-content>



                 <!-- PASO 9: DECLARACION Y EXENCIONES -->
                  <v-stepper-step step="9" editable v-bind:complete="step > 9">
                   Declaración y Exenciones
                  </v-stepper-step>
                  <v-stepper-content step="9">
                    <v-card class="grey lighten-4 elevation-4 mb-2">
                        <v-card-text>
                          <blockquote>
                            Declaro bajo juramento que no he desarrollado actividades dentro del teerritorio de la Provinca de Neuquén, previo a la fecha de inscripción.
  Se efectúa la presente Declaración Jurada a los fines de no abonar las multas y recargos impuestos por el Consejo Profesional de Técnicos de Neuquén.

  Nota: de comprobarse la falsedad de la presente Declaración Jurada el Consejo Profesional aplicará al profesional una sanción consistente en duplo de la matrículo anual vigente.
  Art 29, Ley 708
</blockquote>

                          <v-checkbox label="De Acuerdo" v-model="deAcuerdo">
                          </v-checkbox>

                          <v-checkbox
                             class="ma-0 pa-0"
                             label="Solicitar Exención Art. 10"
                             v-model="solicitud.exencionArt10"
                           >
                          </v-checkbox>

                          <v-checkbox
                             class="ma-0 pa-0"
                             label="Solicitar Exención Art. 6"
                             v-model="solicitud.exencionArt6"
                           >
                          </v-checkbox>

                          <v-checkbox
                             class="ma-0 pa-0"
                             label="Permitir la publicación de los datos"
                             v-model="solicitud.entidad.publicar"
                           >
                          </v-checkbox>

                        </v-card-text>
                      </v-card>
                      <v-btn class="primary white--text right" @click.native="submit">
                        Guardar Solicitud
                        <v-icon dark right>check_circle</v-icon>
                      </v-btn>
                      <v-btn flat @click.native="step = 7" class="right">Volver</v-btn>
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
                <div><b>Nombre: </b> {{ solicitud.entidad.nombre }} </div>
                <div><b>Apellido: </b> {{ solicitud.entidad.apellido }} </div>
                <div><b>DNI: </b> {{ solicitud.entidad.dni }} </div>
                <div><b>CUIT: </b> {{ solicitud.entidad.cuit }} </div>
                <div><b>Sexo: </b> {{ solicitud.entidad.sexo }} </div>
                <div><b>Estado Civil: </b> {{ solicitud.entidad.estadoCivil }} </div>
                <div><b>Fecha de Nacimiento: </b> {{ solicitud.entidad.fechaNacimiento }} </div>
                <div><b>Lugar de Nacimiento: </b> {{ solicitud.entidad.lugarNacimiento }} </div>
                <div><b>Nacionalidad: </b> {{ solicitud.entidad.nacionalidad }} </div>
                <div><b>Observaciones: </b> {{solicitud.entidad.observaciones }} </div>
              </v-card-text>
            </v-card>
          </v-container>
        </div>
      </v-layout>
  </v-container>
</template>

<script>
import * as axios from 'axios';
import * as utils from '@/utils';
import { Solicitud, Contacto, Formacion,
         Beneficiario, Subsidiario } from '@/model';
import InputFecha from '@/components/base/InputFecha';
import ValidatorMixin from '@/components/mixins/ValidatorMixin';
import FiltersMixin from '@/components/mixins/FiltersMixin';


export default {
  name: 'nueva-solicitud',
  mixins: [ValidatorMixin, FiltersMixin],
  data () {
    return {
      deAcuerdo: false,
      cajaPrevisional: 'poseo',

      validation: {
          solicitud: {
            fecha: [],
            delegacion: []
          },
          profesional: {
            nombre: [],
            apellido: [],
            dni: [],
            fechaNacimiento: []
          },
          domicilioLegal: {
            calle: [],
            numero: [],
            localidad: [],
          },
          domicilioReal: {
            calle: [],
            numero: [],
            localidad: [],
          },
          contacto: {
            tipo: [],
            valor: []
          },
          formacion: {
            tipo: [],
            institucion: [],
            fecha: [],
            titulo: []
          }
      },

      step: 1,

      snackbar: {
        msg: '',
        show: false,
        context: ''
      },

      select_items: {
        instituciones: [
            {
              text: 'Universidad Nacional del Comahue',
              value: 1
            }
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
        ],

        sexo: [],
        estadoCivil: [],
        tipoContacto: [],
        tipoFormacion: [],
        relacionLaboral: [],
        condafip: [],
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

      solicitud: new Solicitud('profesional'),

      nuevo_contacto: new Contacto(),
      nueva_formacion: new Formacion(),
      nuevo_beneficiario: new Beneficiario(),
      nuevo_subsidiario: new Subsidiario(),

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
        ],

        beneficiarios: [
          { text: 'DNI', value: 'dni' },
          { text: 'Apellido', value: 'apellido' },
          { text: 'Nombre', value: 'nombre' },
          { text: 'Fecha de Nacimiento', value: 'fechaNacimiento' },
          { text: 'Vínculo', value: 'vinculo' },
          { text: 'Invalidez', value: 'invalidez' }
        ],

        subsidiarios: [
          { text: 'DNI', value: 'dni' },
          { text: 'Apellido', value: 'apellido' },
          { text: 'Nombre', value: 'nombre' },
          { text: 'Porcentaje', value: 'porcentaje' }
        ]
      }
    }
  },

  created: function() {
    Promise.all([
      axios.get('http://localhost:3400/api/paises'),
      axios.get('http://localhost:3400/api/opciones?sort=valor')
    ])
    .then(r => {
      this.select_items.paises = utils.getItemsSelect(r[0].data, 'nombre', 'id')
      this.select_items.sexo = utils.getItemsSelect(r[1].data.sexo, 'valor', 'id')
      this.select_items.estadoCivil = utils.getItemsSelect(r[1].data.estadocivil, 'valor', 'id');
      this.select_items.condafip = utils.getItemsSelect(r[1].data.condicionafip, 'valor', 'id');
      this.select_items.tipoContacto = utils.getItemsSelect(r[1].data.contacto, 'valor', 'id');
      this.select_items.tipoFormacion = utils.getItemsSelect(r[1].data.formacion, 'valor', 'id');
    })
    .catch(e => console.error(e));
  },

  methods: {
    changePais: function(tipoDomicilio) {
      let domicilio = tipoDomicilio == 'real' ? 'domicilioReal' : 'domicilioLegal';
      let pais = this.solicitud.entidad[domicilio].pais;
      axios.get(`http://localhost:3400/api/provincias?pais_id=${pais}`)
           .then(r => this.select_items.provincias[tipoDomicilio] = utils.getItemsSelect(r.data, 'nombre', 'id'))
           .catch(e => console.error(e));
    },

    changeProvincia: function(tipoDomicilio) {
      let domicilio = tipoDomicilio == 'real' ? 'domicilioReal' : 'domicilioLegal';
      let provincia = this.solicitud.entidad[domicilio].pais;
      axios.get(`http://localhost:3400/api/departamentos?provincia_id=${provincia}`)
           .then(r => this.select_items.departamentos[tipoDomicilio] = utils.getItemsSelect(r.data, 'nombre', 'id'))
           .catch(e => console.error(e));
    },

    changeDepartamento: function(tipoDomicilio) {
      let domicilio = tipoDomicilio == 'real' ? 'domicilioReal' : 'domicilioLegal';
      let departamento = this.solicitud.entidad[domicilio].pais;
      axios.get(`http://localhost:3400/api/localidades?departamento_id=${departamento}`)
           .then(r => this.select_items.localidades[tipoDomicilio] = utils.getItemsSelect(r.data, 'nombre', 'id'))
           .catch(e => console.error(e));
    },

    getInstitucion: function(id) {
        return this.select_items.instituciones.find(i => id == i.value ).text;
    },

    addContacto: function() {
      this.validation.contacto.tipo = [ this.rules.required ];
      this.validation.contacto.valor = [ this.rules.required ];
       if ( utils.validObject(this.nuevo_contacto, this.validation.contacto) ) {
         this.solicitud.entidad.contactos.push(this.nuevo_contacto);
         this.validation.contacto.tipo = [];
         this.validation.contacto.valor = [];
         this.nuevo_contacto = new Contacto();
       }
    },

    removeElem: function(tipo, index) {
      this.solicitud.entidad[tipo].splice(index, 1);
    },

    addFormacion: function() {
      this.validation.formacion.tipo = [ this.rules.required ];
      this.validation.formacion.institucion = [ this.rules.required ];
      this.validation.formacion.titulo = [ this.rules.required ];
      this.validation.formacion.fecha = [ this.rules.required, this.rules.fecha ];
      if ( utils.validObject(this.nueva_formacion, this.validation.formacion) ) {
        this.solicitud.entidad.formaciones.push(this.nueva_formacion);
        this.nueva_formacion = new Formacion();
        this.validation.formacion.tipo = [];
        this.validation.formacion.institucion = [];
        this.validation.formacion.titulo = [];
        this.validation.formacion.fecha = [];
      }
    },

    addBeneficiario: function() {
      this.solicitud.entidad.beneficiarios.push(this.nuevo_beneficiario);
    },

    addSubsidiario: function() {
      this.solicitud.entidad.subsidiarios.push(this.nuevo_subsidiario);
    },

    submit: function() {
      console.log(JSON.stringify(this.solicitud));
      axios.post('http://localhost:3400/api/solicitudes', this.solicitud)
           .then(r => {
             if (r.status != 201) {
               this.submitError();
             }
             this.snackbar.msg = 'Nueva solicitud creada exitosamente!';
             this.snackbar.context = 'success';
             this.snackbar.show = true;
             this.solicitud = new Solicitud('profesional');
           })
           .catch(e => this.submitError());
    },

    submitError: function() {
      this.snackbar.msg = 'Ha ocurrido un error en la carga';
      this.snackbar.context = 'error';
      this.snackbar.show = true;
    },

    nextStep: function() {
      if (this.step == 1) {
        this.validation.solicitud.fecha = [ this.rules.required, this.rules.fecha ];
        this.validation.solicitud.delegacion = [ this.rules.required ];
        if ( utils.validObject(this.solicitud, this.validation.solicitud) ) this.step = +this.step + 1;
      }

      else if (this.step == 2) {
        this.validation.profesional.nombre = [ this.rules.required ];
        this.validation.profesional.apellido = [ this.rules.required ];
        this.validation.profesional.dni = [ this.rules.required, this.rules.number ];
        this.validation.profesional.fechaNacimiento = [ this.rules.required, this.rules.fecha ];
        let profesional = this.solicitud.entidad;
        if ( utils.validObject(profesional, this.validation.profesional)) this.step = +this.step + 1;
      }

      else if (this.step == 3) {
        this.validation.domicilioReal.calle = [ this.rules.required ];
        this.validation.domicilioReal.numero = [ this.rules.required, this.rules.number ];
        this.validation.domicilioReal.localidad = [ this.rules.required ];

        this.validation.domicilioLegal.calle = [ this.rules.required ];
        this.validation.domicilioLegal.numero = [ this.rules.required, this.rules.number ];
        this.validation.domicilioLegal.localidad = [ this.rules.required ];
        let domicilioR = this.solicitud.entidad.domicilioReal;
        let domicilioL = this.solicitud.entidad.domicilioReal;
        if ( utils.validObject(domicilioR, this.validation.domicilioReal)
          && validObject(domicilioL, this.validation.domicilioLegal)
        ) this.step = +this.step + 1;
      }

      else this.step = +this.step + 1;
    }
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
