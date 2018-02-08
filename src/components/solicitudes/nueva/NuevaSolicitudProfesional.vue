<template>
<v-container fluid>
    <v-dialog v-model="show_imprimir" max-width="290">
      <v-card>
        <v-card-title class="headline">Nueva Solicitud</v-card-title>
        <v-card-text>
          Desea imprimir la solicitud creada?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat="flat" @click.native="imprimir">Sí</v-btn>
          <v-btn color="green darken-1" flat="flat" @click.native="cancelarImpresion">No</v-btn>
        </v-card-actions>
      </v-card>        
    </v-dialog>

  <v-layout row wrap>
    <v-flex xs10>
      <form v-on:submit.prevent="submit">
        <v-toolbar class="blue darken-3">
          <v-toolbar-title class="white--text">Solicitud de Matriculación de Profesionales</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-container>
          <v-progress-linear indeterminate v-show="show_cargando"></v-progress-linear>

          <v-stepper v-model="step" vertical>

            <!-- PASO 1: DATOS DE SOLICITUD -->
            <v-stepper-step step="1" edit-icon="check" editable :complete="valid.form_solicitud && step > 1" :rules="[() => step <= 1 || valid.form_solicitud]">
              Datos de la Solicitud
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-form ref="form_solicitud" v-model="valid.form_solicitud">
                    <v-layout row>
                      <v-flex xs6 class="ma-4">
                        <input-fecha
                          tabindex="1"
                          v-model="solicitud.fecha"
                          label="Fecha de Solicitud"
                          :rules="[rules.required, rules.fecha]"
                          :disabled="solicitud.estado && solicitud.estado != 'Pendiente'"
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
                          :rules="[rules.required]"
                          :disabled="solicitud.estado && solicitud.estado != 'Pendiente'"
                        >
                        </v-select>
                      </v-flex>
                    </v-layout>
                  </v-form>
                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="3">Continuar</v-btn>
            </v-stepper-content>
            <!-- FIN PASO 1 -->


            <!-- PASO 2: DATOS DE PROFESIONAL -->
            <v-stepper-step step="2" edit-icon="check" editable
              :complete="valid.form_profesional && step > 2"
              :rules="[() => step <= 2 || valid.form_profesional]"
            >
              Datos del Profesional
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>

                  <v-form ref="form_profesional" v-model="valid.form_profesional">

                  <v-layout row>
                    <v-flex xs6 class="ma-4">
                      <v-text-field
                        label="DNI"
                        v-model="solicitud.entidad.dni"
                        :rules="[rules.required, rules.integer]"
                        tabindex="3"
                        maxlength="10"
                        clearable
                        @blur="chgDni"
                        @keypress.enter="chgDni"
                      >
                      </v-text-field>

                      <v-text-field
                        label="Nombre"
                        v-model="solicitud.entidad.nombre"
                        tabindex="5"
                        maxlength="100"
                        :rules="[rules.required]"
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
                        :rules="[rules.required]"
                      >
                      </v-select>

                      <input-fecha
                        v-model="solicitud.entidad.fechaNacimiento"
                        label="Fecha de Nacimiento"
                        tabindex="9"
                        :rules="[rules.required, rules.fecha]"
                      >
                      </input-fecha>

                      <v-text-field
                        label="Nacionalidad"
                        v-model="solicitud.entidad.nacionalidad"
                        maxlength="45"
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
                        :rules="[rules.required]"
                        maxlength="100"
                        tabindex="4"
                      >
                      </v-text-field>

                      <v-text-field
                        label="CUIT"
                        v-model="solicitud.entidad.cuit"
                        :rules="[rules.integer]"
                        tabindex="6"
                        maxlength="20"
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
                        :rules="[rules.required]"
                      >
                      </v-select>

                      <v-text-field
                        label="Lugar Nacimiento"
                        v-model="solicitud.entidad.lugarNacimiento"
                        maxlength="100"
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
                        label="Condición Impositiva"
                        tabindex="12"
                        :rules="[rules.required]"
                      >
                      </v-select>
                    </v-flex>
                  </v-layout>

                  <v-layout row>
                    <v-flex xs12 class="mx-4">
                      <add-foto
                          edit
                          :url="solicitud.entidad.foto ? solicitud.entidad.foto : ''"
                          @change="chgFoto"
                      ></add-foto>
                    </v-flex>
                  </v-layout>

                  <v-layout row class="mx-4 mt-4">
                    <v-flex xs12 class="mt-4">
                      <add-firma
                        edit
                        :url="solicitud.entidad.firma ? solicitud.entidad.firma : ''"
                        @change="chgFirma"
                        ref="firma"
                      ></add-firma>
                    </v-flex>
                  </v-layout>

                  </v-form>
                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="14">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>


            <!-- PASO 3: DOMICILIOS -->
            <v-stepper-step step="3" edit-icon="check"
              editable
              :complete="valid_domicilios && step > 3"
              :rules="[() => step <= 3 || valid_domicilios]"
            >
              Domicilios del Profesional
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-card class="grey lighten-4 elevation-4 mb-2" ref="form">
                <v-card-text>
                  <v-form ref="form_domicilio" lazy-validation>
                        <v-layout row class="mx-4">
                          <v-flex xs8>
                            <v-select
                              :items="tipos_domicilio"
                              label="Tipo"
                              v-model="nuevo_domicilio.tipo"
                              autocomplete
                              :rules="domicilio_edit != null ? [] : [rules.required]"
                            >
                            </v-select>
                          </v-flex>

                          <v-flex xs3 class="mt-2 ml-4">
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
                              :rules="[rules.required]"
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
                              :rules="[rules.required]"
                            >
                            </v-select>

                            <v-text-field
                              tabindex="16"
                              maxlength="100"
                              label="Dirección"
                              v-model="nuevo_domicilio.domicilio.direccion"
                              :rules="[rules.required]"
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
                              :rules="[rules.required]"
                            >
                            </v-select>

                            <v-select
                              tabindex="15"
                              :items="localidades"
                              label="Localidad"
                              v-model="nuevo_domicilio.domicilio.localidad"
                              :rules="[rules.required]"
                              autocomplete single-line bottom
                              item-text="nombre"
                              item-value="id"
                            >
                            </v-select>
                          </v-flex>
                        </v-layout>

                        <v-layout class="mb-4">
                          <v-flex xs12>
                            <v-btn
                              class="right"
                              light
                              @click="addDomicilio"
                            >
                              {{ domicilio_edit != null ? 'Guardar' : 'Agregar' }}
                            </v-btn>

                          <v-btn class="right" light v-show="domicilio_edit != null" @click="cancelarEditDomicilio">
                            Cancelar
                          </v-btn>
                          </v-flex>
                        </v-layout>

                        <v-data-table
                            :headers="headers.domicilios"
                            :items="solicitud.entidad.domicilios"
                            hide-actions
                            class="elevation-1"
                            no-data-text="No hay domicilios"
                        >
                          <template slot="headers" slot-scope="props">
                            <th v-for="(header, i) of props.headers" :key="i" class="pa-3">
                              <b>{{ header.text }}</b>
                            </th>
                          </template>
                          <template slot="items" slot-scope="props">
                            <tr :active="props.index == domicilio_edit">
                              <td>
                                <v-btn fab small @click="editDomicilio(props.index)">
                                  <v-icon>mode_edit</v-icon>
                                </v-btn>
                                <v-btn fab small @click="removeElem('domicilios', props.index)">
                                  <v-icon>delete</v-icon>
                                </v-btn>
                              </td>

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

                              <td>{{ props.item.domicilio.direccion }}</td>
                            </tr>
                          </template>
                        </v-data-table>

                      <v-alert class="mt-4" color="error" icon="priority_high" :value="!valid_domicilios">
                        Debe ingresar al menos un domicilio
                      </v-alert>

                      </v-form>
                    </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="33">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>


            <!-- PASO 4: CONTACTOS -->
            <v-stepper-step step="4" edit-icon="check" editable :complete="step > 4">
              Datos de Contacto
            </v-stepper-step>
            <v-stepper-content step="4">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-form ref="form_contacto" lazy-validation>

                  <v-container>
                    <v-layout row>
                      <v-flex xs3 class="mx-2">
                        <v-select
                          single-line bottom
                          :items="opciones.contacto"
                          item-text="valor"
                          item-value="id"
                          label="Tipo"
                          v-model="nuevo_contacto.tipo"
                          :rules="[rules.required]"
                          @change="chgTipoContacto"
                        >
                        </v-select>
                      </v-flex>

                      <v-flex xs8 class="mx-2" v-if="nuevo_contacto.tipo > 0 && nuevo_contacto.tipo < 3">
                        <input-telefono
                          :type="(nuevo_contacto.tipo === 2) ? 'celular' : 'fijo'"
                          v-model="nuevo_telefono"
                        ></input-telefono>

                        <v-checkbox
                          v-show="nuevo_contacto.tipo === 2"
                          label="Whatsapp"
                          v-model="nuevo_contacto.whatsapp"
                          light
                        ></v-checkbox>
                      </v-flex>

                      <v-flex xs8 class="mx-2" v-else>
                        <v-text-field
                          v-model="nuevo_contacto.valor"
                          :rules="rules_contacto"
                          :placeholder="placeholder_contacto"
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>

                    <v-layout row wrap>
                      <v-flex xs12>
                        <v-btn class="right" light @click="addContacto">
                          {{ contacto_edit != null ? 'Guardar' : 'Agregar' }}
                        </v-btn>
                        <v-btn class="right" light v-show="contacto_edit != null" @click="cancelarEditContacto">
                          Cancelar
                        </v-btn>
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
                        <th></th>
                      </template>
                      <template slot="items" slot-scope="props">
                        <tr :active="props.index == contacto_edit">
                          <td>
                            <v-btn fab small @click="editContacto(props.index)">
                              <v-icon>mode_edit</v-icon>
                            </v-btn>
                            <v-btn fab small @click="removeElem('contactos', props.index)">
                              <v-icon>delete</v-icon>
                            </v-btn>
                          </td>
                          <td>{{ getTipoContacto(props.item.tipo) }}</td>
                          <td>{{ props.item.valor }}</td>
                          <td>
                            <span v-if="props.item.tipo == 2">
                              Whatsapp: {{ props.item.whatsapp | boolean }}
                            </span>
                          </td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-container>

                  </v-form>
                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>


            <!-- PASO 5: FORMACIONES -->
            <v-stepper-step step="5" edit-icon="check" editable :complete="step > 5">
              Datos de Formación Académica
            </v-stepper-step>
            <v-stepper-content step="5">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-form ref="form_formacion" lazy-validation>

                  <v-container>
                    <v-layout row>
                      <v-flex xs6 class="mx-4">
                        <v-select
                          :items="opciones.formacion"
                          item-text="valor"
                          item-value="id"
                          label="Tipo de Formación"
                          single-line bottom
                          v-model="nueva_formacion.tipo"
                          :rules="[rules.required]"
                        >
                        </v-select>

                        <v-select
                          autocomplete single-line bottom
                          item-text="nombre"
                          item-value="id"
                          :items="titulos_grado"
                          label="Título"
                          v-model="nueva_formacion.titulo"
                          :rules="[rules.required]"
                        >
                        </v-select>

                        <v-select
                          autocomplete
                          :items="instituciones"
                          item-text="nombre"
                          item-value="id"
                          label="Institución"
                          v-model="nueva_formacion.institucion"
                          :rules="[rules.required]"
                        >
                        </v-select>
                      </v-flex>

                      <v-flex xs6 class="mx-4">
                        <input-fecha
                          v-model="nueva_formacion.fechaEmision"
                          label="Fecha Emisión"
                          :rules="[rules.required, rules.fecha]"
                          @change="chgFechaEmision"
                        >
                        </input-fecha>
                        <input-fecha
                          v-model="nueva_formacion.fechaEgreso"
                          label="Fecha Egreso"
                          :rules="[rules.required, rules.fecha]"
                        >
                        </input-fecha>

                        <v-text-field
                          label="Lapso desde Emisión"
                          readonly
                          v-model="nueva_formacion.tiempoEmision"
                        ></v-text-field>
                      </v-flex>
                    </v-layout>

                    <v-layout class="mb-4">
                      <v-flex xs12>
                        <v-btn class="right" light @click="addFormacion">
                          {{ formacion_edit != null ? 'Guardar' : 'Agregar' }}
                        </v-btn>
                        <v-btn class="right" light v-show="formacion_edit != null" @click="cancelarEditFormacion">
                          Cancelar
                        </v-btn>
                      </v-flex>
                    </v-layout>

                    <v-data-table
                      :headers="headers.formacion"
                      :items="solicitud.entidad.formaciones"
                      hide-actions
                      class="elevation-1 mt-4"
                      no-data-text="No hay formaciones"
                      style="margin-top:30px"
                    >
                      <template slot="headers" slot-scope="props">
                          <th></th>
                          <th></th>
                          <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
                            <b>{{ header.text }}</b>
                          </th>
                          <th></th>
                      </template>
                      <template slot="items" slot-scope="props">
                        <tr :active="props.index == domicilio_edit">
                          <td>
                            <v-btn fab small @click="editFormacion(props.index)">
                              <v-icon>mode_edit</v-icon>
                            </v-btn>
                          </td>
                          <td>
                            <v-btn fab small @click="removeElem('formaciones', props.index)">
                              <v-icon>delete</v-icon>
                            </v-btn>
                          </td>
                          <td>{{ getTitulo(props.item.titulo) }}</td>
                          <td>{{ getInstitucion(props.item.institucion) }}</td>
                          <td>{{ props.item.fechaEgreso }}</td>
                          <td>{{ props.item.fechaEmision }}</td>
                          <td>{{ props.item.tiempoEmision }}</td>
                        </tr>
                      </template>
                    </v-data-table>
                  </v-container>

                  </v-form>
                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>


            <!-- PASO 6: DATOS ADICIONALES -->
            <v-stepper-step step="6" edit-icon="check" editable :complete="step > 6">
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
                        label="Profesional Independiente" class="mb-4" v-model="solicitud.entidad.independiente">
                      </v-checkbox>

                      <v-checkbox
                        tabindex="37"
                        label="Jubilado" class="mb-4" v-model="solicitud.entidad.jubilado">
                      </v-checkbox>
                    </v-flex>

                    <v-flex xs6 class="ma-4">
                      <v-text-field
                        tabindex="34"
                        maxlength="100"
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
              <v-btn blue darken-1 @click.native="nextStep" class="right" tabindex="38">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>



            <!-- PASO 7: CAJA PREVISIONAL -->
            <v-stepper-step step="7" edit-icon="check" editable :complete="step > 7">
              Caja Previsional
            </v-stepper-step>
            <v-stepper-content step="7">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-form lazy-validation ref="form_beneficiario" @submit.prevent>

                  <v-layout row>
                     <v-flex xs5 class="mx-4">
                      <typeahead
                        label="Nombre"
                        maxlength="100"
                        :items="cajas_previsionales"
                        item-text="nombre"
                        item-value="id"
                        v-model="nueva_caja"
                        :rules="[rules.required]"
                      ></typeahead>
                    </v-flex>
                     <v-flex xs3>
                      <v-btn @click="addCaja">Agregar</v-btn>
                    </v-flex>
                  </v-layout>

                    <v-data-table
                      :headers="headers.caja_previsional"
                      :items="solicitud.entidad.cajas_previsionales"
                      hide-actions
                      class="elevation-1"
                      no-data-text="No hay cajas agregadas"
                      style="margin-top:30px"
                    >
                      <template slot="headers" slot-scope="props">
                          <th></th>
                          <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
                            <b>{{ header.text }}</b>
                          </th>
                          </template>
                      <template slot="items" slot-scope="props">
                            <td style="max-width:30px">
                              <v-btn fab small @click="removeElem('cajas_previsionales', props.index)">
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </td>
                            <td v-if="props.item.caja">{{ props.item.caja.nombre }}</td>
                            <td v-else-if="props.item.nombre">{{ props.item.nombre }}</td>
                            <td v-else>{{ getNombreCaja(props.item) }}</td>
                          </template>
                    </v-data-table>
                  </v-form>
                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>



            <!-- PASO 8: SUBSIDIO POR FALLECIMIENTO -->
            <v-stepper-step step="8" edit-icon="check" editable
              :complete="valid_subsidiarios && step > 8"
              :rules="[() => step <= 8 || valid_subsidiarios]"
            >
              Subsidio Por Fallecimiento
            </v-stepper-step>
            <v-stepper-content step="8">
              <v-card class="grey lighten-4 elevation-4 mb-2">
                <v-card-text>
                  <v-form ref="form_subsidiario" lazy-validation>
                      <v-layout row>
                        <v-flex xs6 class="ma-4">
                          <v-text-field
                            label="DNI"
                            maxlength="20"
                            v-model="nuevo_subsidiario.dni"
                            :rules="[rules.required, rules.integer]"
                          >
                          </v-text-field>

                          <v-text-field
                            label="Apellido"
                            maxlength="100"
                            v-model="nuevo_subsidiario.apellido"
                            :rules="[rules.required]"
                          >
                          </v-text-field>
                        </v-flex>

                        <v-flex xs6 class="ma-4">
                          <v-text-field
                            label="Nombre"
                            maxlength="100"
                            v-model="nuevo_subsidiario.nombre"
                            :rules="[rules.required]"
                          >
                          </v-text-field>

                          <input-numero
                            label="Porcentaje"
                            decimal
                            v-model="nuevo_subsidiario.porcentaje"
                            :rules="[rules.required]"
                          >
                          </input-numero>
                        </v-flex>
                      </v-layout>

                      <v-btn class="right mb-4" light @click="addSubsidiario">
                        {{ subsidiario_edit != null ? 'Guardar' : 'Agregar' }}
                      </v-btn>
                      <v-btn class="right" light v-show="subsidiario_edit != null" @click="cancelarEditSubsidiario">
                        Cancelar
                      </v-btn>

                      <v-data-table
                        :headers="headers.subsidiarios"
                        :items="solicitud.entidad.subsidiarios"
                        hide-actions
                        class="elevation-1"
                        no-data-text="No hay subsidiarios"
                      >
                        <template slot="headers" slot-scope="props">
                          <th></th>
                          <th></th>
                          <th v-for="header of props.headers" :key="header.value" class="pa-3 text-xs-left">
                            <b>{{ header.text }}</b>
                          </th>
                        </template>
                        <template slot="items" slot-scope="props">
                          <tr :active="props.index == subsidiario_edit">
                            <td>
                              <v-btn fab small @click="editSubsidiario(props.index)">
                                <v-icon>mode_edit</v-icon>
                              </v-btn>
                              <v-btn fab small @click="removeElem('subsidiarios', props.index)">
                                <v-icon>delete</v-icon>
                              </v-btn>
                            </td>
                            <td>{{ props.item.dni }}</td>
                            <td>{{ props.item.apellido }}</td>
                            <td>{{ props.item.nombre }}</td>
                            <td>{{ props.item.porcentaje }}</td>
                          </tr>
                        </template>
                      </v-data-table>

                      <br>

                      <v-alert color="error" icon="priority_high" :value="!valid_subsidiarios">
                        Los porcentajes deben sumar 100%
                      </v-alert>

                  </v-form>

                </v-card-text>
              </v-card>
              <v-btn blue darken-1 @click.native="nextStep" class="right">Continuar</v-btn>
              <v-btn flat @click.native="prevStep" class="right">Volver</v-btn>
            </v-stepper-content>



            <!-- PASO 9: DECLARACION Y EXENCIONES -->
            <v-stepper-step step="9" edit-icon="check" editable :complete="step > 9">
              Declaración de Difusión de Datos y Recepción de Información
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

                  <v-checkbox
                    class="mt-4"
                    label="Todos"
                    @change="chgPublicarTodos"
                    v-model="publicar_todos"
                  >
                  </v-checkbox>

                  <v-layout row class="mt-2">
                    <v-flex xs6>
                      <v-checkbox
                        label="Email"
                        v-model="solicitud.entidad.publicarEmail"
                      >
                      </v-checkbox>
                      <v-checkbox
                        label="Celular"
                        v-model="solicitud.entidad.publicarCelular"
                      >
                      </v-checkbox>
                    </v-flex>
                    <v-flex xs6>
                      <v-checkbox
                        label="Dirección"
                        v-model="solicitud.entidad.publicarDireccion"
                      >
                      </v-checkbox>
                      <v-checkbox
                        label="Acervo"
                        v-model="solicitud.entidad.publicarAcervo"
                      >
                      </v-checkbox>
                    </v-flex>
                  </v-layout>

                  <br>

                  <v-checkbox class="ma-0 pa-0" label="Recibir Actualizaciones" v-model="solicitud.entidad.recibirActualizaciones">
                  </v-checkbox>
                </v-card-text>
              </v-card>

              <v-btn class="blue darken-1 white--text right" @click.native="submit" :disabled="!valid_form">
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
        <v-toolbar-title class="white--text">Profesional</v-toolbar-title>
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
import Vue from 'vue'
import axios from '@/axios'
import moment from 'moment'
import rules from '@/rules'
import * as utils from '@/utils'
import {
  Solicitud,
  Formacion,
  Beneficiario,
  Subsidiario,
  Header
} from '@/model';
import InputFecha from '@/components/base/InputFecha';
import InputTelefono from '@/components/base/InputTelefono';
import InputNumero from '@/components/base/InputNumero';
import Typeahead from '@/components/base/Typeahead';
import AddFoto from '@/components/solicitudes/AddFoto';
import AddFirma from '@/components/solicitudes/AddFirma';
import ValidatorMixin from '@/components/mixins/ValidatorMixin';
import NuevaSolicitud from '@/components/solicitudes/nueva/NuevaSolicitud';
import { impresionSolicitud } from '@/utils/PDFUtils'

export default {
  name: 'nueva-solicitud',
  mixins: [ValidatorMixin, NuevaSolicitud],
  props: ['id', 'dni'],

  data() {
    return {
      formacion_edit: null,
      subsidiario_edit: null,
      instituciones: [],
      titulos: [],
      cajas_previsionales: [],
      deAcuerdo: true,
      solicitud: new Solicitud('profesional'),
      nueva_formacion: new Formacion(),
      nuevo_beneficiario: new Beneficiario(),
      nuevo_subsidiario: new Subsidiario(),
      nueva_caja: '',
      publicar_todos: false,
      foto: null,
      firma: null,
      valid: {
        form_solicitud: false,
        form_profesional: false
      },
      show_imprimir: false,
      id_creada: null
    }
  },

  computed: {
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

    lapso_emision: function() {
      return '12';
      if (!this.nueva_formacion.fechaEmision) return '';
    },

    suma_subsidiarios: function() {
      if (!this.solicitud.entidad.subsidiarios.length) return 0;
      return this.solicitud.entidad.subsidiarios.reduce((prev, act) => prev + +act.porcentaje, 0);
    },

    valid_subsidiarios: function() {
      return this.suma_subsidiarios === 100 || this.solicitud.entidad.subsidiarios.length === 0;
    },

    valid_form: function() {
      return this.valid.form_solicitud && this.valid.form_profesional
        && this.valid_subsidiarios && this.valid_domicilios;
    }
  },

  watch: {
    '$route' (to, from) {
      if (this.datos_cargados) this.init();
    }
  },

  created: function() {
    Promise.all([
        axios.get('/paises'),
        axios.get('/opciones?sort=valor'),
        axios.get('/delegaciones'),
        axios.get('/instituciones'),
        axios.get('/titulos'),
        axios.get('/cajas-previsionales')
      ])
      .then(r => {
        this.paises = r[0].data;
        this.opciones = r[1].data;
        this.delegaciones = r[2].data;
        this.instituciones = r[3].data;
        this.titulos = r[4].data;
        this.cajas_previsionales = r[5].data;
        this.datos_cargados = true;
        this.nuevo_domicilio.domicilio.departamento = this.global_state.delegacion.domicilio.departamento.id;
        this.nuevo_domicilio.domicilio.localidad = this.global_state.delegacion.domicilio.localidad.id;
        this.init();
      })
      .catch(e => console.error(e));
  },


  methods: {
    init: function() {
      this.step = 1;
      this.initForm().then(reset => {
        this.show_cargando = false;
        if (reset) {
          this.$refs.firma.reset();
          this.$refs.form_profesional.reset();
        }
      });
    },

    initForm: function() {
      this.show_cargando = true;
      this.solicitud = new Solicitud('profesional');

      if (this.id) {
        return axios.get(`/solicitudes/${this.id}`)
        .then(r => {
            this.solicitud.fecha = utils.getFecha(r.data.fecha);
            this.solicitud.delegacion = this.delegaciones.find(d => d.nombre == r.data.delegacion).id;
            this.solicitud.estado = r.data.estado;
            this.fillProfesional(r.data.entidad);
            return false;
        });
      }
      else {
        this.solicitud.fecha = utils.getFecha();
        this.solicitud.delegacion = +this.global_state.delegacion.id;

        if (this.dni) {
          this.solicitud.entidad.dni = this.dni;
          return this.chgDni().then(() => false)
        }
        else {
          return this.changePais()
          .then(() => this.changeProvincia())
          .then(() => this.changeDepartamento())
          .then(() => true)
        }
      }
    },

    fillProfesional: function(entidad) {
      this.solicitud.entidad.foto = entidad.foto;
      this.solicitud.entidad.firma = entidad.firma;
      this.solicitud.entidad.publicarEmail = entidad.publicarEmail;
      this.solicitud.entidad.publicarDireccion = entidad.publicarDireccion;
      this.solicitud.entidad.publicarAcervo = entidad.publicarAcervo;
      this.solicitud.entidad.publicarCelular = entidad.publicarCelular;
      this.solicitud.entidad.id = entidad.id;
      this.solicitud.entidad.nombre = entidad.nombre;
      this.solicitud.entidad.apellido = entidad.apellido;
      this.solicitud.entidad.dni = entidad.dni;
      this.solicitud.entidad.cuit = entidad.cuit;
      let sexo = this.opciones.sexo.find(s => s.valor == entidad.sexo);
      this.solicitud.entidad.sexo = sexo ? sexo.id : '';
      this.solicitud.entidad.estadoCivil = this.opciones.estadocivil.find(s => s.valor == entidad.estadoCivil).id;
      this.solicitud.entidad.fechaNacimiento = utils.getFecha(entidad.fechaNacimiento)
      this.solicitud.entidad.nacionalidad = entidad.nacionalidad;
      this.solicitud.entidad.condafip = this.opciones.condicionafip.find(c => c.valor == entidad.condafip).id;
      this.solicitud.entidad.observaciones = entidad.observaciones;
      this.solicitud.entidad.lugarNacimiento = entidad.lugarNacimiento;

      this.solicitud.entidad.relacionDependencia = entidad.relacionDependencia;
      this.solicitud.entidad.empresa = entidad.empresa;
      this.solicitud.entidad.independiente = entidad.independiente;
      this.solicitud.entidad.serviciosPrestados = entidad.serviciosPrestados;
      this.solicitud.entidad.cajas_previsionales = entidad.cajas_previsionales;

      this.solicitud.entidad.domicilios = entidad.domicilios;

      this.solicitud.entidad.contactos = [];
      for(let contacto of entidad.contactos) {
        let contacto_nuevo = contacto;
        contacto_nuevo.tipo = this.opciones.contacto.find(i => i.valor == contacto.tipo).id;
        this.solicitud.entidad.contactos.push(contacto_nuevo);
      }

      this.solicitud.entidad.formaciones = [];
      for(let formacion of entidad.formaciones) {
        let formacion_nueva = { id: formacion.id };
        formacion_nueva.tipo = this.opciones.formacion.find(i => i.valor == formacion.tipo).id;
        formacion_nueva.fechaEmision = utils.getFecha(formacion.fechaEmision);
        formacion_nueva.fechaEgreso = utils.getFecha(formacion.fechaEgreso);
        formacion_nueva.tiempoEmision = utils.diffDatesStr(moment(formacion.fechaEmision), moment());
        formacion_nueva.titulo = this.titulos.find(i => i.tipo == formacion.tipo && i.nombre == formacion.titulo).id;
        formacion_nueva.institucion = this.instituciones.find(i => i.nombre == formacion.institucion).id;
        this.solicitud.entidad.formaciones.push(formacion_nueva);
      }

      this.solicitud.entidad.subsidiarios = [];
      for(let subsidiario of entidad.subsidiarios) {
        let subsidiario_nuevo = { id: subsidiario.id };
        subsidiario_nuevo.dni = subsidiario.dni;
        subsidiario_nuevo.apellido = subsidiario.apellido;
        subsidiario_nuevo.nombre = subsidiario.nombre;
        subsidiario_nuevo.porcentaje = subsidiario.porcentaje.toString();
        this.solicitud.entidad.subsidiarios.push(subsidiario_nuevo);
      }
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

    getNombreCaja: function(id) {
      return this.cajas_previsionales.find(i => id == i.id).nombre;
    },

    chgDni: function() {
      return axios.get(`/profesionales?dni=${this.solicitud.entidad.dni}`)
      .then(r => {
        if (r.data.length > 0) this.fillProfesional(r.data[0]);
        else this.solicitud.entidad.id = null;
        return;
      })
      .catch(e => console.error(e));
    },

    chgFechaEmision: function() {
      this.nueva_formacion.tiempoEmision = '';
      let fecha = moment(this.nueva_formacion.fechaEmision, 'DD/MM/YYYY', true);
      if (fecha.isValid()) {
          this.nueva_formacion.tiempoEmision = utils.diffDatesStr(fecha, moment());
      }
    },

    chgPublicarTodos: function() {
      this.solicitud.entidad.publicarEmail = this.publicar_todos;
      this.solicitud.entidad.publicarDireccion = this.publicar_todos;
      this.solicitud.entidad.publicarAcervo = this.publicar_todos;
      this.solicitud.entidad.publicarCelular = this.publicar_todos
    },

    chgFoto: function(foto) {
        this.foto = foto;
    },

    chgFirma: function(firma) {
        this.firma = firma;
    },

    addFormacion: function() {
      if (this.$refs.form_formacion.validate()) {
        if (this.formacion_edit == null) {
          this.solicitud.entidad.formaciones.push(this.nueva_formacion);
        }
        else {
          Vue.set(this.solicitud.entidad.formaciones, this.formacion_edit, this.nueva_formacion);
        }
        
        this.nueva_formacion = new Formacion();
        this.formacion_edit = null;
        Vue.nextTick().then(() => {
          this.$refs.form_formacion.reset();
        });
      }
    },

    editFormacion: function(index) {
      this.formacion_edit = index;
      this.nueva_formacion = this.solicitud.entidad.formaciones[index];
    },

    cancelarEditFormacion: function() {
      this.formacion_edit = null;
      this.nueva_formacion = new Formacion();
      this.$refs.form_formacion.reset();
    },

    addBeneficiario: function() {
      if (this.$refs.form_beneficiario.validate()) {
        this.solicitud.entidad.beneficiarios.push(this.nuevo_beneficiario);
        this.nuevo_beneficiario = new Beneficiario();
        this.$refs.form_beneficiario.reset();
      }
    },

    addSubsidiario: function() {
      if (this.$refs.form_subsidiario.validate()) {
        if (this.subsidiario_edit == null) {
          this.solicitud.entidad.subsidiarios.push(this.nuevo_subsidiario);
        }
        else {
          Vue.set(this.solicitud.entidad.subsidiarios, this.subsidiario_edit, this.nuevo_subsidiario);
        }

        this.nuevo_subsidiario = new Subsidiario();
        this.$refs.form_subsidiario.reset();
        this.subsidiario_edit = null;
      }
    },

    editSubsidiario: function(index) {
      this.subsidiario_edit = index;
      this.nuevo_subsidiario = this.solicitud.entidad.subsidiarios[index];
    },

    cancelarEditSubsidiario: function() {
      this.subsidiario_edit = null;
      this.nuevo_subsidiario = new Subsidiario();
      this.$refs.form_subsidiario.reset();
    },

    addCaja: function() {
      if (this.$refs.form_beneficiario.validate()) {
        let caja;
        if (typeof this.nueva_caja == 'number') caja = this.nueva_caja;
        if (typeof this.nueva_caja == 'string') caja = { nombre: this.nueva_caja };

        this.solicitud.entidad.cajas_previsionales.push(caja);
        this.nueva_caja = '';
        this.$refs.form_beneficiario.reset();
      }
    },

    nextStep: function() {
      let next = true;
      if (this.step == 1) next = this.$refs.form_solicitud.validate();
      else if (this.step == 2) next = this.$refs.form_profesional.validate();
      else if (this.step == 3) next = this.valid_domicilios;
      else if (this.step == 8) next = this.valid_subsidiarios;
      if (next) this.step = +this.step + 1;
    },

    makeFormData: function() {
      let form_data = new FormData();
      if (this.foto)
        form_data.append('foto', this.foto);
      if (this.firma)
        form_data.append('firma', this.firma);
      form_data.append('solicitud', JSON.stringify(this.solicitud));
      return form_data;
    },

    submit: function() {
      this.solicitud.operador = this.user.id;

      if (!this.id) {
        axios.post('/solicitudes', this.makeFormData())
          .then(r => {
            if (r.status != 201) {
              this.submitError();
            }
            this.id_creada = r.data.id;
            this.show_imprimir = true;
            this.$refs.firma.reset();
            this.global_state.snackbar.msg = 'Nueva solicitud creada exitosamente!';
            this.global_state.snackbar.color = 'success';
            this.global_state.snackbar.show = true;
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
      let id = this.id_creada;
      if (!id) id = this.id;
      axios.get(`/solicitudes/${id}`)
          .then(s => {
            let solicitud = s.data;
            let pdf = impresionSolicitud(solicitud);
            pdf.save(`Solicitud ${solicitud.entidad.nombre} ${solicitud.entidad.apellido}.pdf`)
            if (this.id_creada) this.$router.replace('/solicitudes/lista');
          })
          .catch(e => console.error(e));
    },

    cancelarImpresion: function() {
      this.$router.replace('/solicitudes/lista');
    }
  },

  components: {
    InputFecha,
    InputTelefono,
    InputNumero,
    Typeahead,
    AddFoto,
    AddFirma
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
  width: 15%;
  word-wrap: break-word;
}
</style>
