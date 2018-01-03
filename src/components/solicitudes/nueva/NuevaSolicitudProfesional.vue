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
                        :error="submitted.steps[0] && !validControl(validator.solicitud.fecha, solicitud.fecha)"
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
                        label="DNI"
                        v-model="solicitud.entidad.dni"
                        :rules="validator.profesional.dni"
                        tabindex="3"
                        @change="chgDni"
                      >
                      </v-text-field>

                      <v-text-field
                        label="Nombre"
                        v-model="solicitud.entidad.nombre"
                        tabindex="5"
                        :rules="validator.profesional.nombre"
                        :error="submitted.steps[1] && !validControl(validator.profesional.nombre, solicitud.entidad.nombre)"
                      >
                      </v-text-field>

                      <v-select
                        autocomplete
                        tabindex="7"
                        :items="opciones.sexo"
                        item-text="valor"
                        item-value="id"
                        v-model="solicitud.entidad.sexo"
                        label="Sexo"
                        single-line bottom
                        :rules="validator.profesional.sexo"
                        :error="submitted.steps[1] && !validControl(validator.profesional.sexo, solicitud.entidad.sexo)"
                      >
                      </v-select>

                      <input-fecha
                        v-model="solicitud.entidad.fechaNacimiento"
                        label="Fecha de Nacimiento"
                        tabindex="9"
                        :rules="validator.profesional.fechaNacimiento"
                        :error="submitted.steps[1] && !validControl(validator.profesional.fechaNacimiento, solicitud.entidad.fechaNacimiento)"
                      >
                      </input-fecha>

                      <v-text-field
                        label="Nacionalidad"
                        v-model="solicitud.entidad.nacionalidad"
                        tabindex="11"
                      >
                      </v-text-field>

                      <v-text-field 
                        label="Observaciones" 
                        v-model="solicitud.entidad.observaciones" 
                        tabindex="13"
                      >
                      </v-text-field>                      
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <v-text-field
                        label="Apellido"
                        v-model="solicitud.entidad.apellido"
                        :rules="validator.profesional.apellido"
                        :error="submitted.steps[1] && !validControl(validator.profesional.apellido, solicitud.entidad.apellido)"
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
                        autocomplete
                        tabindex="8"
                        :items="opciones.estadocivil"
                        item-text="valor"
                        item-value="id"
                        v-model="solicitud.entidad.estadoCivil"
                        label="Estado Civil"
                        single-line bottom
                        :rules="validator.profesional.estadoCivil"
                        :error="submitted.steps[1] && !validControl(validator.profesional.estadoCivil, solicitud.entidad.estadoCivil)"
                      >
                      </v-select>

                      <v-text-field 
                        label="Lugar Nacimiento" 
                        v-model="solicitud.entidad.lugarNacimiento" 
                        tabindex="10"
                      >
                      </v-text-field>

                      <v-select
                        autocomplete
                        single-line bottom
                        :items="opciones.condicionafip"
                        item-text="valor"
                        item-value="id"
                        v-model="solicitud.entidad.condafip"
                        label="Condición AFIP"
                        tabindex="12"
                        :rules="validator.profesional.condafip"
                        :error="submitted.steps[1] && !validControl(validator.profesional.condafip, solicitud.entidad.condafip)"
                      >
                      </v-select>                      
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12 class="mx-4">
                      <table>
                        <tbody>
                          <tr>
                            <td style="padding-right:10px;padding-bottom:20px">
                              Foto:
                            </td>
                            <td style="padding-bottom:20px">
                              <input type="file" ref="archivo_foto" name="foto"> 
                            </td>
                          </tr>
                          <tr>
                            <td style="padding-right:10px">
                              Firma:
                            </td>
                            <td>
                              <input type="file" ref="archivo_firma" name="firma"> 
                            </td>
                          </tr>
                        </tbody> 
                      </table>
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
                        :rules="validator.domicilio.pais"
                        :error="submitted.steps[2] && !validControl(validator.domicilio.pais, solicitud.entidad.domicilioReal.pais)"
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
                        :rules="validator.domicilio.departamento"
                        :error="submitted.steps[2] && !validControl(validator.domicilio.departamento, solicitud.entidad.domicilioReal.departamento)"
                      >
                      </v-select>

                      <v-text-field 
                        tabindex="19" 
                        label="Calle" 
                        v-model="solicitud.entidad.domicilioReal.calle" 
                        :rules="validator.domicilio.calle" 
                        :error="submitted.steps[2] && !validControl(validator.domicilio.calle, solicitud.entidad.domicilioReal.calle)"
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
                        :rules="validator.domicilio.departamento"
                        :error="submitted.steps[2] && !validControl(validator.domicilio.provincia, solicitud.entidad.domicilioReal.provincia)"
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
                        :rules="validator.domicilio.localidad"
                        :error="submitted.steps[2] && !validControl(validator.domicilio.localidad, solicitud.entidad.domicilioReal.localidad)"
                      >
                      </v-select>


                      <v-text-field 
                        tabindex="20" 
                        label="Nro" 
                        v-model="solicitud.entidad.domicilioReal.numero" 
                        :rules="validator.domicilio.numero" 
                        :error="submitted.steps[2] && !validControl(validator.domicilio.numero, solicitud.entidad.domicilioReal.numero)"
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
                      <v-flex xs5 class="mx-2">
                        <v-select
                          single-line bottom
                          :items="opciones.contacto"
                          item-text="valor"
                          item-value="id"
                          label="Tipo de Contacto"
                          v-model="nuevo_contacto.tipo"
                          :rules="submitted.contacto ? validator.contacto.tipo : []"
                          :error="submitted.contacto && !validControl(validator.contacto.tipo, nuevo_contacto.tipo)"
                        >
                        </v-select>
                      </v-flex>

                      <v-flex xs5 class="mx-2">
                        <v-text-field 
                          :prefix="nuevo_contacto.tipo === 2 ? '+54 9' : ''"
                          v-model="nuevo_contacto.valor" 
                          :rules="submitted.contacto ? validator.contacto.valor : []"
                          :error="submitted.contacto && !validControl(validator.contacto.valor, nuevo_contacto.valor)"
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
                      :headers="headers.contactos"
                      :items="solicitud.entidad.contactos"
                      hide-actions
                      class="elevation-1 mt-4"
                      no-data-text="No hay contactos"
                    >
                      <template slot="headers" slot-scope="props">
                            <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
                              {{ header.text }}
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
                          :rules="submitted.formacion ? validator.formacion.tipo : []"
                          :error="submitted.formacion && !validControl(validator.formacion.tipo, nueva_formacion.tipo)"
                        >
                        </v-select>

                        <v-select
                          autocomplete single-line bottom
                          item-text="nombre"
                          item-value="id"
                          :items="titulos_grado"
                          label="Título"
                          v-model="nueva_formacion.titulo"
                          :rules="submitted.formacion ? validator.formacion.titulo : []"
                          :error="submitted.formacion && !validControl(validator.formacion.titulo, nueva_formacion.titulo)"
                        >
                        </v-select>
                      </v-flex>

                      <v-flex xs6 class="ma-4">
                        <input-fecha  
                          v-model="nueva_formacion.fecha" 
                          label="Fecha" 
                          :rules="submitted.formacion ? validator.formacion.fecha : []" 
                          :error="submitted.formacion && !validControl(validator.formacion.fecha, nueva_formacion.fecha)"
                        >
                        </input-fecha>

                        <v-select
                          :items="instituciones"
                          item-text="nombre"
                          item-value="id"
                          label="Institución"
                          v-model="nueva_formacion.institucion"
                          :rules="submitted.formacion ? validator.formacion.institucion : []"
                          :error="submitted.formacion && !validControl(validator.formacion.institucion, nueva_formacion.institucion)"
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
                            <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
                              <b>{{ header.text }}</b>
                            </th>
                            <th></th>
                          </template>
                      <template slot="items" slot-scope="props">
                            <td>{{ getTitulo(props.item.titulo) }}</td>
                            <td>{{ props.item.fecha }}</td>
                            <td>{{ getInstitucion(props.item.institucion) }}</td>
                            <td style="width:30px">
                              <v-btn fab dark small color="blue" @click="removeElem('formaciones', props.index)">
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
                    <v-flex xs5 class="ma-4">
                      <v-checkbox 
                        label="Ya poseo Caja Previsional" 
                        v-model="solicitud.entidad.poseeCajaPrevisional"
                      >
                      </v-checkbox>
                    </v-flex>

                    <v-flex xs5>
                      <v-text-field 
                        label="Nombre" 
                        :disabled="!solicitud.entidad.poseeCajaPrevisional" 
                        v-model="solicitud.entidad.nombreCajaPrevisional"
                      >
                      </v-text-field>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12 class="ml-4">
                      <v-checkbox 
                        label="Solicitar Caja Previsional de Profesionales" 
                        v-model="solicitud.entidad.solicitaCajaPrevisional"
                      >
                      </v-checkbox>

                      <v-checkbox class="ma-0 pa-0" label="Solicitar Exención Art. 10" v-model="solicitud.exencionArt10">
                      </v-checkbox>

                      <v-checkbox class="ma-0 pa-0" label="Solicitar Exención Art. 6" v-model="solicitud.exencionArt6">
                      </v-checkbox>

                    </v-flex>
                  </v-layout>                  

                  <!-- <v-layout row>
                    <v-flex xs6 class="ma-4">
                      <v-text-field 
                        label="DNI" 
                        v-model="nuevo_beneficiario.dni" 
                        :rules="submitted.beneficiario ? validator.beneficiario.dni : []"
                        :error="submitted.beneficiario && !validControl(validator.beneficiario.dni, nuevo_beneficiario.dni)"
                      >
                      </v-text-field>

                      <v-text-field 
                        label="Apellido" 
                        v-model="nuevo_beneficiario.apellido" 
                        :rules="submitted.beneficiario ? validator.beneficiario.apellido : []" 
                        :error="submitted.beneficiario && !validControl(validator.beneficiario.apellido, nuevo_beneficiario.apellido)"
                      >
                      </v-text-field>

                      <v-text-field 
                        label="Nombre" 
                        v-model="nuevo_beneficiario.nombre" 
                        :rules="submitted.beneficiario ? validator.beneficiario.nombre : []"
                        :error="submitted.beneficiario && !validControl(validator.beneficiario.nombre, nuevo_beneficiario.nombre)"
                      >
                      </v-text-field>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <input-fecha v-model="nuevo_beneficiario.fechaNacimiento" label="Fecha de Nacimiento">
                      </input-fecha>
                      <v-select
                        autocomplete single-line bottom
                        label="Vínculo"
                        :items="opciones.vinculo"
                        item-text="valor"
                        item-value="id"
                        v-model="nuevo_beneficiario.vinculo" 
                        :rules="submitted.beneficiario ? validator.beneficiario.vinculo : []"
                        :error="submitted.beneficiario && !validControl(validator.beneficiario.vinculo, nuevo_beneficiario.vinculo)"
                      >
                      </v-select>
                      <v-checkbox label="Invalidez" v-model="nuevo_beneficiario.invalidez">
                      </v-checkbox>
                    </v-flex>
                  </v-layout> -->

                  <!-- <v-layout row wrap class="mb-4">
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
                               <td>{{ getVinculo(props.item.vinculo) }}</td>
                               <td>{{ props.item.invalidez | boolean }}</td>
                               <td style="width:30px">
                                 <v-btn fab dark small color="blue" @click="removeElem('beneficiarios', props.index)">
                                   <v-icon>delete</v-icon>
                                 </v-btn>
                               </td>
                             </template>
                    </v-data-table>
                  </div> -->

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
                        :rules="submitted.subsidiario ? validator.subsidiario.dni : []"
                        :error="submitted.subsidiario && !validControl(validator.subsidiario.dni, nuevo_subsidiario.dni)"
                      >
                      </v-text-field>

                      <v-text-field 
                        label="Apellido" 
                        v-model="nuevo_subsidiario.apellido" 
                        :rules="submitted.subsidiario ? validator.subsidiario.apellido : []"
                        :error="submitted.subsidiario && !validControl(validator.subsidiario.apellido, nuevo_subsidiario.apellido)"
                      >
                      </v-text-field>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <v-text-field 
                        label="Nombre" 
                        v-model="nuevo_subsidiario.nombre" 
                        :rules="submitted.subsidiario ? validator.subsidiario.nombre : []"
                        :error="submitted.subsidiario && !validControl(validator.subsidiario.nombre, nuevo_subsidiario.nombre)"
                      >
                      </v-text-field>

                      <v-text-field
                        type="number"
                        label="Porcentaje"
                        v-model="nuevo_subsidiario.porcentaje"
                        :rules="submitted.subsidiario ? validator.subsidiario.porcentaje : []"
                        :error="submitted.subsidiario && !validControl(validator.subsidiario.porcentaje, nuevo_subsidiario.porcentaje)"
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
                             <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
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

                  <br>

              <v-alert color="error" icon="priority_high" :value="!valid_subsidiarios">
                Los porcentajes deben sumar 100%
              </v-alert>                  

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
                  <!-- <blockquote>
                    Declaro bajo juramento que no he desarrollado actividades dentro del territorio de la Provinca de Neuquén, previo a la fecha de inscripción. Se efectúa la presente Declaración Jurada a los fines de no abonar las multas y recargos impuestos por el Consejo
                    Profesional de Técnicos de Neuquén. Nota: de comprobarse la falsedad de la presente Declaración Jurada el Consejo Profesional aplicará al profesional una sanción consistente en duplo de la matrículo anual vigente. Art 29, Ley 708
                  </blockquote>
                  <br> -->

                  <v-checkbox label="De Acuerdo" v-model="deAcuerdo">
                  </v-checkbox>

                  <h3>Permitir la publicación de los datos:</h3>

                  <v-layout row class="mt-2">
                    <v-flex xs6>
                      <v-checkbox 
                        class="ma-0 pa-0" 
                        label="Email" 
                        v-model="solicitud.entidad.publicarEmail"
                      >
                      </v-checkbox>
                      <v-checkbox 
                        class="ma-0 pa-0" 
                        label="Celular" 
                        v-model="solicitud.entidad.publicarCelular"
                      >
                      </v-checkbox>
                    </v-flex>
                    <v-flex xs6>
                      <v-checkbox 
                        class="ma-0 pa-0" 
                        label="Dirección" 
                        v-model="solicitud.entidad.publicarDireccion"
                      >
                      </v-checkbox>
                      <v-checkbox 
                        class="ma-0 pa-0" 
                        label="Acervo" 
                        v-model="solicitud.entidad.publicarAcervo"
                      >
                      </v-checkbox>
                    </v-flex>

                  </v-layout>

                </v-card-text>
              </v-card>

              <v-btn class="blue darken-1 white--text right" @click.native="submit" :disabled="!validForm()">
                Guardar Solicitud
                <v-icon dark right>check_circle</v-icon>
              </v-btn>

              <v-btn class="blue darken-1 white--text right" @click.native="imprimir" v-if="this.id">
                Imprimir
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
import axios from '@/axios'
import moment from 'moment'
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
import { impresionSolicitud } from '@/utils/PDFUtils'

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
  props: ['id'],

  data() {
    return {
      instituciones: [],
      titulos: [],
      deAcuerdo: true,
      cajaPrevisional: '',
      solicitud: new Solicitud('profesional'),
      nuevo_contacto: new Contacto(),
      nueva_formacion: new Formacion(),
      nuevo_beneficiario: new Beneficiario(),
      nuevo_subsidiario: new Subsidiario(),

      submitted: {
        steps: [ 
          false, false, false, false, false,
          false, false, false, false, 
        ],
        contacto: false,
        formacion: false,
        beneficiario: false,
        subsidiario: false
      },

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
          tipo: [rules.required],
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
    },

    titulos_grado: function() {
      const getTipo = () => {
        if (this.nueva_formacion.tipo == 1) return 'Grado';
        if (this.nueva_formacion.tipo == 2) return 'Posgrado';
        else return null;
      }

      if (!this.nueva_formacion.tipo) return [];
      return this.titulos.filter(t => t.tipo == getTipo());
    },

    suma_subsidiarios: function() {
      if (!this.solicitud.entidad.subsidiarios.length) return 0;
      return this.solicitud.entidad.subsidiarios.reduce((prev, act) => prev + +act.porcentaje, 0);
    },

    valid_subsidiarios: function() {
      return this.suma_subsidiarios === 100 || this.solicitud.entidad.subsidiarios.length === 0;   
    }
  },

  created: function() {    
    Promise.all([
        axios.get('/paises'),
        axios.get('/opciones?sort=valor'),
        axios.get('/delegaciones'),
        axios.get('/instituciones'),
        axios.get('/titulos')
      ])
      .then(r => {
        this.paises = r[0].data;
        this.opciones = r[1].data;
        this.delegaciones = r[2].data;
        this.instituciones = r[3].data;
        this.titulos = r[4].data;

        if (this.id) { 
          axios.get(`/solicitudes/${this.id}`)
          .then(r => {
              this.solicitud = new Solicitud('profesional');
              this.solicitud.fecha = moment(r.data.fecha).format('DD/MM/YYYY');
              this.solicitud.delegacion = this.delegaciones.find(d => d.nombre == r.data.delegacion).id;
              this.solicitud.exencionArt10 = r.data.exencionArt10;
              this.solicitud.exencionArt6 = r.data.exencionArt6;        
              this.fillProfesional(r.data.entidad);
          });
        }
      })
      .catch(e => console.error(e));
  },


  methods: {
    fillProfesional: function(entidad) {
      this.solicitud.entidad.publicarEmail = entidad.publicarEmail;
      this.solicitud.entidad.publicarDireccion = entidad.publicarDireccion;
      this.solicitud.entidad.publicarAcervo = entidad.publicarAcervo;
      this.solicitud.entidad.publicarCelular = entidad.publicarCelular;
      this.solicitud.entidad.id = entidad.id;
      this.solicitud.entidad.nombre = entidad.nombre;
      this.solicitud.entidad.apellido = entidad.apellido;
      this.solicitud.entidad.dni = entidad.dni;
      this.solicitud.entidad.cuit = entidad.cuit;
      this.solicitud.entidad.sexo = this.opciones.sexo.find(s => s.valor == entidad.sexo).id;
      this.solicitud.entidad.estadoCivil = this.opciones.estadocivil.find(s => s.valor == entidad.estadoCivil).id;
      this.solicitud.entidad.fechaNacimiento = moment(entidad.fechaNacimiento).format('DD/MM/YYYY');
      this.solicitud.entidad.nacionalidad = entidad.nacionalidad;
      this.solicitud.entidad.condafip = this.opciones.condicionafip.find(c => c.valor == entidad.condafip).id;
      this.solicitud.entidad.observaciones = entidad.observaciones;
      this.solicitud.entidad.lugarNacimiento = entidad.lugarNacimiento;
      
      this.solicitud.entidad.domicilioReal.id = entidad.domicilioReal.id;
      this.solicitud.entidad.domicilioReal.pais = this.paises.find(p => p.nombre == entidad.domicilioReal.pais).id;
      this.changePais('real', entidad.domicilioReal);
      this.solicitud.entidad.domicilioReal.calle = entidad.domicilioReal.calle;
      this.solicitud.entidad.domicilioReal.numero = entidad.domicilioReal.numero;

      if (entidad.domicilioProfesional) {
        this.solicitud.entidad.domicilioProfesional.id = entidad.domicilioProfesional.id;
        this.solicitud.entidad.domicilioProfesional.pais = this.paises.find(p => p.nombre == entidad.domicilioProfesional.pais).id;
        this.changePais('profesional', entidad.domicilioProfesional);
        this.solicitud.entidad.domicilioProfesional.calle = entidad.domicilioProfesional.calle;
        this.solicitud.entidad.domicilioProfesional.numero = entidad.domicilioProfesional.numero;                
      }

      if (entidad.domicilioConstituido) {
        this.solicitud.entidad.domicilioConstituido.id = entidad.domicilioConstituido.id;
        this.solicitud.entidad.domicilioConstituido.pais = this.paises.find(p => p.nombre == entidad.domicilioConstituido.pais).id;
        this.changePais('constituido', entidad.domicilioConstituido);
        this.solicitud.entidad.domicilioConstituido.calle = entidad.domicilioConstituido.calle;
        this.solicitud.entidad.domicilioConstituido.numero = entidad.domicilioConstituido.numero;                
      }

      for(let contacto of entidad.contactos) {
        let contacto_nuevo = contacto;
        contacto_nuevo.tipo = this.opciones.contacto.find(i => i.valor == contacto.tipo).id;
        this.solicitud.entidad.contactos.push(contacto_nuevo);
      }

      for(let formacion of entidad.formaciones) {
        let formacion_nueva = { id: formacion.id };
        formacion_nueva.tipo = this.opciones.formacion.find(i => i.valor == formacion.tipo).id;
        formacion_nueva.fecha = moment(formacion.fecha).format('DD/MM/YYYY');
        formacion_nueva.titulo = this.titulos.find(i => i.tipo == formacion.tipo && i.nombre == formacion.titulo).id;
        formacion_nueva.institucion = this.instituciones.find(i => i.nombre == formacion.institucion).id;
        this.solicitud.entidad.formaciones.push(formacion_nueva);
      }

      this.solicitud.entidad.relacionDependencia = entidad.relacionDependencia;
      this.solicitud.entidad.empresa = entidad.empresa;
      this.solicitud.entidad.independiente = entidad.independiente;
      this.solicitud.entidad.serviciosPrestados = entidad.serviciosPrestados;
      this.solicitud.entidad.poseeCajaPrevisional = entidad.poseeCajaPrevisional;
      this.solicitud.entidad.nombreCajaPrevisional = entidad.nombreCajaPrevisional;


      for(let beneficiario of entidad.beneficiarios) {
        let beneficiario_nuevo = { id: beneficiario.id };
        beneficiario_nuevo.dni = beneficiario.dni;
        beneficiario_nuevo.apellido = beneficiario.apellido;
        beneficiario_nuevo.nombre = beneficiario.nombre;
        beneficiario_nuevo.vinculo = beneficiario.vinculo;
        beneficiario_nuevo.invalidez = beneficiario.invalidez;
        beneficiario_nuevo.fechaNacimiento = moment(beneficiario.fechaNacimiento).format('DD/MM/YYYY');
        this.solicitud.entidad.beneficiarios.push(beneficiario_nuevo);
      }              

      for(let subsidiario of entidad.subsidiarios) {
        let subsidiario_nuevo = { id: subsidiario.id };
        subsidiario_nuevo.dni = subsidiario.dni;
        subsidiario_nuevo.apellido = subsidiario.apellido;
        subsidiario_nuevo.nombre = subsidiario.nombre;
        subsidiario_nuevo.porcentaje = subsidiario.porcentaje;
        this.solicitud.entidad.subsidiarios.push(subsidiario_nuevo);
      }
    },

    chgDni: function() {
      axios.get(`/profesionales?dni=${this.solicitud.entidad.dni}`)
      .then(r => {
        if (r.data.length == 1) this.fillProfesional(r.data[0]);
        else this.solicitud.entidad.id = null;
      })
      .catch(e => console.error(e));
    },

    getInstitucion: function(id) {
      return this.instituciones.find(i => id == i.id).nombre;
    },

    getVinculo: function(id) {
      return this.opciones.vinculo.find(i => id == i.id).valor;
    },

    getTitulo: function(id) {
      return this.titulos.find(i => id == i.id).nombre;
    },

    getTipoContacto: function(id) {
      return this.opciones.contacto.find(i => id == i.id).valor;
    },

    addContacto: function() {
      this.submitted.contacto = true;
      if (utils.validObject(this.nuevo_contacto, this.validator.contacto)) {
        this.solicitud.entidad.contactos.push(this.nuevo_contacto);
        this.submitted.contacto = false;
        this.nuevo_contacto = new Contacto();
      }
    },

    addFormacion: function() {
      this.submitted.formacion = true;
      if (utils.validObject(this.nueva_formacion, this.validator.formacion)) {
        this.solicitud.entidad.formaciones.push(this.nueva_formacion);
        this.submitted.formacion = false;
        this.nueva_formacion = new Formacion();
      }
    },

    addBeneficiario: function() {
      this.submitted.beneficiario = true;
      if (utils.validObject(this.nuevo_beneficiario, this.validator.beneficiario)) {
        this.solicitud.entidad.beneficiarios.push(this.nuevo_beneficiario);
        this.submitted.beneficiario = false;
        this.nuevo_beneficiario = new Beneficiario();
      }
    },

    addSubsidiario: function() {
      this.submitted.subsidiario = true;
      if (utils.validObject(this.nuevo_subsidiario, this.validator.subsidiario)) {
        this.solicitud.entidad.subsidiarios.push(this.nuevo_subsidiario);
        this.submitted.subsidiario = false;
        this.nuevo_subsidiario = new Beneficiario();
      }
    },

    makeFormData: function() {
      let form_data = new FormData();
      if (this.$refs.archivo_foto.files[0]) 
        form_data.append('foto', this.$refs.archivo_foto.files[0]);      
      if (this.$refs.archivo_firma.files[0]) 
        form_data.append('firma', this.$refs.archivo_firma.files[0]);      
      form_data.append('solicitud', JSON.stringify(this.solicitud));
      return form_data;
    },

    submit: function() {
      if (!this.id) {
        axios.post('/solicitudes', this.makeFormData())
          .then(r => {
            if (r.status != 201) {
              this.submitError();
            }
            this.global_state.snackbar.msg = 'Nueva solicitud creada exitosamente!';
            this.global_state.snackbar.color = 'success';
            this.global_state.snackbar.show = true;
            this.$router.replace('/solicitudes/lista');
          })
          .catch(e => this.submitError());
      }
      else {
        axios.put(`/solicitudes/${this.id}`, this.makeFormData())
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

    imprimir: function() {
      axios.get(`/solicitudes/${this.id}`)
          .then(s => {
            let solicitud = s.data;
            let pdf = impresionSolicitud(solicitud);
            pdf.save(`Solicitud ${solicitud.entidad.nombre} ${solicitud.entidad.apellido}.pdf`)
          })
          .catch(e => console.error(e));
    },

    validStep: function(i) {
      if (i == 1) return utils.validObject(this.solicitud, this.validator.solicitud);
      else if (i == 2) {
        let profesional = this.solicitud.entidad;
        return utils.validObject(profesional, this.validator.profesional);
      } else if (i == 3) {
        return utils.validObject(this.solicitud.entidad.domicilioReal, this.validator.domicilio)
      } else if (i == 8) {
        return this.valid_subsidiarios;
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
