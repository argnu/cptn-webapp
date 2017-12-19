<template>
<v-container>
  <v-layout row wrap>
    <v-flex xs8>
      <form v-on:submit.prevent="submit">
        <v-toolbar class="blue darken-3">
          <v-toolbar-title class="white--text">Solicitud de Matriculación de Profesionales</v-toolbar-title>
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
                      >
                      </input-fecha>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="2"
                        :items="delegaciones"
                        v-model="solicitud.delegacion"
                        label="Delegación"
                        :rules="validator.solicitud.delegacion">
                      </v-select>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="3">Continuar</v-btn>
            </v-stepper-content>
            <!-- FIN PASO 1 -->


            <!-- PASO 2: DATOS DE PROFESIONAL -->
            <v-stepper-step step="2" edit-icon="check" editable :complete="validStep(2) && step > 2" :rules="[() => step <= 2 || validStep(2)]">
              Datos del Profesional
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-layout row>
                    <v-flex xs6 class="ma-4">
                      <v-text-field
                        label="Nombre"
                        v-model="solicitud.entidad.nombre"
                        tabindex="3"
                        :rules="validator.profesional.nombre"
                      >
                      </v-text-field>

                      <v-text-field
                        label="DNI"
                        v-model="solicitud.entidad.dni"
                        :rules="validator.profesional.dni"
                      >
                      </v-text-field>

                      <v-select
                        tabindex="7"
                        :items="opciones.sexo"
                        item-text="valor"
                        item-value="id"
                        v-model="solicitud.entidad.sexo"
                        label="Sexo"
                        single-line bottom
                        :rules="validator.profesional.sexo"
                      >
                      </v-select>

                      <input-fecha
                        v-model="solicitud.entidad.fechaNacimiento"
                        label="Fecha de Nacimiento"
                        tabindex="9"
                        :rules="validator.profesional.fechaNacimiento"
                      >
                      </input-fecha>

                      <v-text-field
                        label="Nacionalidad"
                        v-model="solicitud.entidad.nacionalidad"
                        tabindex="11"
                      >
                      </v-text-field>

                      <v-select
                        single-line bottom
                        :items="opciones.condicionafip"
                        item-text="valor"
                        item-value="id"
                        v-model="solicitud.entidad.condafip"
                        label="Condición AFIP"
                        tabindex="13"
                        :rules="validator.profesional.condafip"
                      >
                      </v-select>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <v-text-field
                        label="Apellido"
                        v-model="solicitud.entidad.apellido"
                        :rules="validator.profesional.apellido"
                        tabindex="4"
                      >
                      </v-text-field>

                      <v-text-field
                        label="CUIT"
                        v-model="solicitud.entidad.cuit"
                        tabindex="6"
                      >
                      </v-text-field>

                      <v-select
                        tabindex="8"
                        :items="opciones.estadocivil"
                        item-text="valor"
                        item-value="id"
                        v-model="solicitud.entidad.estadoCivil"
                        label="Estado Civil"
                        single-line bottom
                        :rules="validator.profesional.estadoCivil"
                      >
                      </v-select>

                      <v-text-field label="Lugar Nacimiento" v-model="solicitud.entidad.localidadNacimiento" tabindex="10">
                      </v-text-field>
                      <v-text-field label="Observaciones" v-model="solicitud.entidad.observaciones" tabindex="12">
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="14">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>


            <!-- PASO 3: DOMICILIOS -->
            <v-stepper-step step="3" edit-icon="check" editable :complete="validStep(3) && step > 3" :rules="[() => step <= 3 || validStep(3)]">
              Domicilios del Profesional
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <span class="title ml-4">Domicilio Real</span>
                  <v-layout row>
                    <v-flex xs6 class="ma-4">
                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="15"
                        :items="paises"
                        label="País"
                        @input="changePais('real')"
                        v-model="solicitud.entidad.domicilioReal.pais"
                      >
                      </v-select>

                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="17"
                        :items="departamentos.real"
                        label="Departamento"
                        @input="changeDepartamento('real')"
                        v-model="solicitud.entidad.domicilioReal.departamento"
                      >
                      </v-select>

                      <v-text-field 
                        tabindex="19" 
                        label="Calle" 
                        v-model="solicitud.entidad.domicilioReal.calle" 
                        :rules="validator.domicilioReal.calle" 
                      >
                      </v-text-field>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="16"
                        :items="provincias.real"
                        label="Provincia"
                        @input="changeProvincia('real')"
                        v-model="solicitud.entidad.domicilioReal.provincia"
                      >
                      </v-select>

                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="18"
                        :items="localidades.real"
                        label="Localidad"
                        v-model="solicitud.entidad.domicilioReal.localidad"
                        :rules="validator.domicilioReal.localidad"
                      >
                      </v-select>

                      <v-text-field 
                        tabindex="20" 
                        label="Nro" 
                        v-model="solicitud.entidad.domicilioReal.numero" 
                        :rules="validator.domicilioReal.numero" 
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>

                  <br>

                  <span class="title ml-4">Domicilio Profesional</span>
                  <v-layout row>
                    <v-flex xs6 class="ma-4">
                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="21"
                        :items="paises"
                        label="País"
                        @input="changePais('profesional')"
                        v-model="solicitud.entidad.domicilioProfesional.pais"
                      >
                      </v-select>

                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="23"
                        :items="departamentos.profesional"
                        label="Departamento"
                        @input="changeDepartamento('profesional')"
                        v-model="solicitud.entidad.domicilioProfesional.departamento"
                      >
                      </v-select>

                      <v-text-field
                        tabindex="25"
                        label="Calle"
                        v-model="solicitud.entidad.domicilioProfesional.calle"
                      >
                      </v-text-field>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="22"
                        :items="provincias.profesional"
                        label="Provincia"
                        @input="changeProvincia('profesional')"
                        v-model="solicitud.entidad.domicilioProfesional.provincia"
                      >
                      </v-select>

                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="24"
                        :items="localidades.profesional"
                        label="Localidad"
                        v-model="solicitud.entidad.domicilioProfesional.localidad"
                      >
                      </v-select>

                      <v-text-field
                        tabindex="26"
                        label="Nro"
                        v-model="solicitud.entidad.domicilioProfesional.numero"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                  <br>

                  <span class="title ml-4">Domicilio Constituido</span>
                  <v-layout row>
                    <v-flex xs6 class="ma-4">
                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="27"
                        :items="paises"
                        label="País"
                        @input="changePais('constituido')"
                        v-model="solicitud.entidad.domicilioConstituido.pais"
                      >
                      </v-select>

                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="29"
                        :items="departamentos.constituido"
                        label="Departamento"
                        @input="changeDepartamento('constituido')"
                        v-model="solicitud.entidad.domicilioConstituido.departamento"
                      >
                      </v-select>

                      <v-text-field
                        tabindex="31"
                        label="Calle"
                        v-model="solicitud.entidad.domicilioConstituido.calle"
                      >
                      </v-text-field>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="28"
                        :items="provincias.constituido"
                        label="Provincia"
                        @input="changeProvincia('constituido')"
                        v-model="solicitud.entidad.domicilioConstituido.provincia"
                      >
                      </v-select>

                      <v-select
                        autocomplete single-line bottom
                        item-text="nombre"
                        item-value="id"
                        tabindex="30"
                        :items="localidades.constituido"
                        label="Localidad"
                        v-model="solicitud.entidad.domicilioConstituido.localidad"
                      >
                      </v-select>

                      <v-text-field
                        tabindex="32"
                        label="Nro"
                        v-model="solicitud.entidad.domicilioConstituido.numero"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="33">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
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
                      <v-flex xs6 class="mx-4">
                        <v-select
                          single-line bottom
                          :items="opciones.contacto"
                          item-text="valor"
                          item-value="id"
                          label="Tipo de Contacto"
                          v-model="nuevo_contacto.tipo"
                          :rules="validator.contacto.tipo"
                        >
                        </v-select>
                      </v-flex>

                      <v-flex xs6 class="mx-4">
                        <v-text-field 
                          label="Valor" 
                          v-model="nuevo_contacto.valor" 
                          :rules="validator.contacto.valor" 
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-btn class="right" light @click="addContacto">Agregar</v-btn>
                      </v-flex>
                    </v-layout>

                    <v-data-table
                      :headers="headers.contacto"
                      :items="solicitud.entidad.contactos"
                      hide-actions
                      class="elevation-1 mt-4"
                      no-data-text="No hay contactos"
                    >
                      <template slot="headers" slot-scope="props">
                            <th v-for="(header, i) of props.headers" class="pa-3 text-xs-left" :key="i">
                              {{ header }}
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


            <!-- PASO 5: FORMACIONES -->
            <v-stepper-step step="5" edit-icon="check" editable :complete="validStep(5) && step > 5" :rules="[() => step <= 5 || validStep(5)]">
              Datos de Formación Académica
            </v-stepper-step>
            <v-stepper-content step="5">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-container>
                    <v-layout row>
                      <v-flex xs6 class="ma-4">
                        <v-select
                          :items="opciones.formacion"
                          item-text="valor"
                          item-value="id"
                          label="Tipo de Formación"
                          single-line bottom
                          v-model="nueva_formacion.tipo"
                          @input="chgFormacion"
                        >
                        </v-select>

                        <v-select
                          autocomplete single-line bottom
                          item-text="nombre"
                          item-value="id"
                          :items="titulos"
                          label="Título"
                          v-model="nueva_formacion.titulo"
                          :rules="validator.formacion.titulo"
                        >
                        </v-select>
                      </v-flex>

                      <v-flex xs6 class="ma-4">
                        <input-fecha  
                          v-model="nueva_formacion.fecha" 
                          label="Fecha" 
                          :rules="validator.formacion.fecha" 
                        >
                        </input-fecha>

                        <v-select
                          :items="instituciones"
                          item-text="nombre"
                          item-value="id"
                          label="Institución"
                          v-model="nueva_formacion.institucion"
                          :rules="validator.formacion.institucion"
                        >
                        </v-select>
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
                      style="margin-top:30px"
                    >
                      <template slot="headers" slot-scope="props">
                            <th v-for="header of props.headers" class="pa-3 text-xs-left">
                              <b>{{ header.text }}</b>
                            </th>
                            <th></th>
                          </template>
                      <template slot="items" slot-scope="props">
                            <td>{{ props.item.titulo }}</td>
                            <td>{{ props.item.fecha }}</td>
                            <td>{{ getInstitucion(props.item.institucion) }}</td>
                            <td style="width:30px">
                              <v-btn fab dark small color="blue" @click="removeFormacion('formaciones', props.index)">
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


            <!-- PASO 6: DATOS ADICIONALES -->
            <v-stepper-step step="6" edit-icon="check" editable :complete="validStep(6) && step > 6" :rules="[() => step <= 6 || validStep(6)]">
              Datos Adicionales
            </v-stepper-step>
            <v-stepper-content step="6">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-layout row>
                    <v-flex xs6 class="ma-4">
                      <v-checkbox
                        tabindex="33"
                        label="Relación de Dependencia" class="mb-4" v-model="solicitud.entidad.relacionDependencia">
                      </v-checkbox>
                      <v-checkbox
                        tabindex="35"
                        label="Autonómo" class="mb-4" v-model="solicitud.entidad.independiente">
                      </v-checkbox>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <v-text-field
                        tabindex="34"
                        label="Empresa" :disabled="!solicitud.entidad.relacionDependencia" v-model="solicitud.entidad.empresa">
                      </v-text-field>
                      <v-text-field
                        tabindex="36"
                        label="Servicios Prestados" :disabled="!solicitud.entidad.independiente" v-model="solicitud.entidad.serviciosPrestados">
                      </v-text-field>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="37">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>



            <!-- PASO 7: CAJA PREVISIONAL -->
            <v-stepper-step step="7" edit-icon="check" editable :complete="validStep(7) && step > 7" :rules="[() => step <= 7 || validStep(7)]">
              Caja Previsional
            </v-stepper-step>
            <v-stepper-content step="7">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-layout row>
                    <v-flex xs3 class="ma-4">
                      <v-checkbox label="Ya poseo Caja Previsional" v-model="solicitud.entidad.poseeCajaPrevisional">
                      </v-checkbox>
                      </v-radio-group>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field label="Nombre" :disabled="!solicitud.entidad.poseeCajaPrevisional" v-model="solicitud.entidad.nombreCajaPrevisional">
                      </v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs6 class="ma-4">
                      <v-text-field 
                        label="DNI" 
                        v-model="nuevo_beneficiario.dni" 
                        :rules="validator.beneficiario.dni"
                      >
                      </v-text-field>

                      <v-text-field 
                        label="Apellido" 
                        v-model="nuevo_beneficiario.apellido" 
                        :rules="validator.beneficiario.apellido" 
                      >
                      </v-text-field>

                      <v-text-field 
                        label="Nombre" 
                        v-model="nuevo_beneficiario.nombre" 
                        :rules="validator.beneficiario.nombre"
                      >
                      </v-text-field>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <input-fecha v-model="nuevo_beneficiario.fechaNacimiento" label="Fecha de Nacimiento">
                      </input-fecha>
                      <v-text-field 
                        label="Vínculo" 
                        v-model="nuevo_beneficiario.vinculo" 
                        :rules="validator.beneficiario.vinculo"
                      >
                      </v-text-field>
                      <v-checkbox label="Invalidez" v-model="nuevo_beneficiario.invalidez">
                      </v-checkbox>
                    </v-flex>
                  </v-layout>

                  <v-layout row wrap class="mb-4">
                    <v-flex xs12>
                      <v-btn class="right" light @click="addBeneficiario">
                        Agregar
                      </v-btn>
                    </v-flex>
                  </v-layout>

                  <div>
                    <v-data-table
                      :headers="headers.beneficiarios"
                      :items="solicitud.entidad.beneficiarios"
                      hide-actions
                      class="elevation-1"
                      no-data-text="No hay beneficiarios"
                    >
                      <template slot="headers" slot-scope="props">
                               <th v-for="header of props.headers" class="pa-3 text-xs-left">
                                 <b>{{ header.text }}</b>
                               </th>
                               <th></th>
                             </template>
                      <template slot="items" slot-scope="props">
                               <td>{{ props.item.dni }}</td>
                               <td>{{ props.item.apellido }}</td>
                               <td>{{ props.item.nombre }}</td>
                               <td>{{ props.item.fechaNacimiento }}</td>
                               <td>{{ props.item.vinculo }}</td>
                               <td>{{ props.item.invalidez | boolean }}</td>
                               <td style="width:30px">
                                 <v-btn fab dark small color="blue" @click="removeElem('beneficiarios', props.index)">
                                   <v-icon>delete</v-icon>
                                 </v-btn>
                               </td>
                             </template>
                    </v-data-table>
                  </div>
                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>



            <!-- PASO 8: SUBSIDIO POR FALLECIMIENTO -->
            <v-stepper-step step="8" edit-icon="check" editable :complete="validStep(8) && step > 8" :rules="[() => step <= 8 || validStep(8)]">
              Subsidio Por Fallecimiento
            </v-stepper-step>
            <v-stepper-content step="8">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-layout row>
                    <v-flex xs6 class="ma-4">
                      <v-text-field 
                        label="DNI" 
                        v-model="nuevo_subsidiario.dni" 
                        :rules="validator.subsidiario.dni"
                      >
                      </v-text-field>

                      <v-text-field 
                        label="Apellido" 
                        v-model="nuevo_subsidiario.apellido" 
                        :rules="validator.subsidiario.apellido"
                      >
                      </v-text-field>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <v-text-field 
                        label="Nombre" 
                        v-model="nuevo_subsidiario.nombre" 
                        :rules="validator.subsidiario.nombre"
                      >
                      </v-text-field>

                      <v-text-field
                        type="number"
                        label="Porcentaje"
                        v-model="nuevo_subsidiario.porcentaje"
                        :rules="validator.subsidiario.porcentaje"
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
                    no-data-text="No hay subsidiarios"
                  >
                    <template slot="headers" slot-scope="props">
                             <th v-for="header of props.headers" class="pa-3 text-xs-left">
                               <b>{{ header.text }}</b>
                             </th>
                             <th></th>
                           </template>
                    <template slot="items" slot-scope="props">
                             <td>{{ props.item.dni }}</td>
                             <td>{{ props.item.apellido }}</td>
                             <td>{{ props.item.nombre }}</td>
                             <td>{{ props.item.porcentaje }}</td>
                             <td style="width:30px">
                               <v-btn fab dark small color="blue" @click="removeElem('subsidiarios', props.index)">
                                 <v-icon>delete</v-icon>
                               </v-btn>
                             </td>
                           </template>
                  </v-data-table>

                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>



            <!-- PASO 9: DECLARACION Y EXENCIONES -->
            <v-stepper-step step="9" edit-icon="check" editable :complete="validStep(9) && step > 9" :rules="[() => step <= 9 || validStep(9)]">
              Declaración y Exenciones
            </v-stepper-step>
            <v-stepper-content step="9">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <blockquote>
                    Declaro bajo juramento que no he desarrollado actividades dentro del teerritorio de la Provinca de Neuquén, previo a la fecha de inscripción. Se efectúa la presente Declaración Jurada a los fines de no abonar las multas y recargos impuestos por el Consejo
                    Profesional de Técnicos de Neuquén. Nota: de comprobarse la falsedad de la presente Declaración Jurada el Consejo Profesional aplicará al profesional una sanción consistente en duplo de la matrículo anual vigente. Art 29, Ley 708
                  </blockquote>

                  <v-checkbox label="De Acuerdo" v-model="deAcuerdo">
                  </v-checkbox>

                  <v-checkbox class="ma-0 pa-0" label="Solicitar Exención Art. 10" v-model="solicitud.exencionArt10">
                  </v-checkbox>

                  <v-checkbox class="ma-0 pa-0" label="Solicitar Exención Art. 6" v-model="solicitud.exencionArt6">
                  </v-checkbox>

                  <v-checkbox class="ma-0 pa-0" label="Permitir la publicación de los datos" v-model="solicitud.entidad.publicar">
                  </v-checkbox>

                </v-card-text>
              </v-card>
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
            <div><b>Sexo: </b> {{ sexo_selected }} </div>
            <div><b>Estado Civil: </b> {{ estado_civil_selected }} </div>
            <div><b>Fecha de Nacimiento: </b> {{ solicitud.entidad.fechaNacimiento }} </div>
            <div><b>Lugar de Nacimiento: </b> {{ solicitud.entidad.localidadNacimiento }} </div>
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
import axios from '@/axios'
import * as utils from '@/utils'
import rules from '@/rules'
import {
  Solicitud,
  Contacto,
  Formacion,
  Beneficiario,
  Subsidiario,
  Header
} from '@/model';
import InputFecha from '@/components/base/InputFecha';
import ValidatorMixin from '@/components/mixins/ValidatorMixin';
import NuevaSolicitud from '@/components/solicitudes/nueva/NuevaSolicitud';

const headers = {
  contactos: [
    Header('Tipo', 'tipo'),
    Header('Valor', 'valor'),
  ],

  formacion: [
    Header('Título', 'titulo'),
    Header('Fecha', 'fecha'),
    Header('Institución', 'institucion')
  ],

  beneficiarios: [
    Header('DNI', 'dni'),
    Header('Apellido', 'apellido'),
    Header('Nombre', 'nombre'),
    Header('Fecha de Nacimiento', 'fechaNacimiento'),
    Header('Vínculo', 'vinculo'),
    Header('Invalidez', 'invalidez')
  ],

  subsidiarios: [
    Header('DNI', 'dni'),
    Header('Apellido', 'apellido'),
    Header('Nombre', 'nombre'),
    Header('Porcentaje', 'porcentaje')
  ]

}

export default {
  name: 'nueva-solicitud',
  mixins: [ValidatorMixin, NuevaSolicitud],
  data() {
    return {
      instituciones: [],
      titulos: [],
      deAcuerdo: false,
      cajaPrevisional: '',
      solicitud: new Solicitud('profesional'),
      nuevo_contacto: new Contacto(),
      nueva_formacion: new Formacion(),
      nuevo_beneficiario: new Beneficiario(),
      nuevo_subsidiario: new Subsidiario(),

      steps: [
        { touched: false },
        { touched: false },
        { touched: false },
        { touched: false },
        { touched: false },
        { touched: false },
        { touched: false },
        { touched: false }
      ],

      validator: {
        profesional: {
          nombre: [rules.required],
          apellido: [rules.required],
          sexo: [rules.required],
          estadoCivil: [rules.required],
          dni: [rules.required, rules.number],
          fechaNacimiento: [rules.required, rules.fecha],
          condafip: [rules.required]
        },
        formacion: {
          institucion: [rules.required],
          titulo: [rules.required],
          fecha: [rules.required, rules.fecha]
        },
        beneficiario: {
          dni: [rules.required],
          nombre: [rules.required],
          apellido: [rules.required],
          vinculo: [rules.required]
        },
        subsidiario: {
          dni: [rules.required],
          nombre: [rules.required],
          apellido: [rules.required],
          porcentaje: [rules.required],
        }
      },
      
    }
  },

  computed: {
    headers: function() {
      return headers;
    },

    sexo_selected: function() {
      if (!this.solicitud.entidad.sexo) return '';
      return this.opciones.sexo.find(i => i.id == this.solicitud.entidad.sexo).valor;
    },

    estado_civil_selected: function() {
      if (!this.solicitud.entidad.estadoCivil) return '';
      return this.opciones.estadocivil.find(i => i.id == this.solicitud.entidad.estadoCivil).valor;
    }
  },

  created: function() {
    Promise.all([
        axios.get('/paises'),
        axios.get('/opciones?sort=valor'),
        axios.get('/delegaciones'),
        axios.get('/instituciones')
      ])
      .then(r => {
        this.paises = r[0].data;
        this.opciones = r[1].data;
        this.delegaciones = r[2].data;
        this.instituciones = r[3].data;
      })
      .catch(e => console.error(e));
  },


  methods: {
    chgFormacion: function(new_val) {
      axios.get(`/titulos?tipo=${new_val}`)
        .then(r => {          
          this.titulos = r.data;
        });
    },

    getInstitucion: function(id) {
      return this.instituciones.find(i => id == i.id).nombre;
    },

    getTipoContacto: function(id) {
      return this.opciones.contacto.find(i => id == i.id).valor;
    },

    addContacto: function() {
      if (utils.validObject(this.nuevo_contacto, this.validator.contacto)) {
        this.solicitud.entidad.contactos.push(this.nuevo_contacto);
        this.nuevo_contacto = new Contacto();
      }
    },

    addFormacion: function() {
      if (utils.validObject(this.nueva_formacion, this.validator.formacion)) {
        this.solicitud.entidad.formaciones.push(this.nueva_formacion);
        this.nueva_formacion = new Formacion();
      }
    },

    addBeneficiario: function() {
      if (utils.validObject(this.nuevo_beneficiario, this.validator.beneficiario)) {
        this.solicitud.entidad.beneficiarios.push(this.nuevo_beneficiario);
        this.nuevo_beneficiario = new Beneficiario();
      }
    },

    addSubsidiario: function() {
      if (utils.validObject(this.nuevo_subsidiario, this.validator.subsidiario)) {
        this.solicitud.entidad.subsidiarios.push(this.nuevo_subsidiario);
        this.nuevo_subsidiario = new Beneficiario();
      }
    },

    submit: function() {
      axios.post('/solicitudes', this.solicitud)
        .then(r => {
          if (r.status != 201) {
            this.submitError();
          }
          this.global_state.snackbar.msg = 'Nueva solicitud creada exitosamente!';
          this.global_state.snackbar.color = 'success';
          this.global_state.snackbar.show = true;
          this.$router.push('/solicitudes/lista');
        })
        .catch(e => this.submitError());
    },

    validStep: function(i) {
      if (i == 1) return utils.validObject(this.solicitud, this.validator.solicitud);
      else if (i == 2) {
        let profesional = this.solicitud.entidad;
        return utils.validObject(profesional, this.validator.profesional);
      } else if (i == 3) {
        return utils.validObject(this.solicitud.entidad.domicilioReal, this.validator.domicilioReal)
      } else return true;
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
