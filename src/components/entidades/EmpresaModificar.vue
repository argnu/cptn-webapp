<template>
  <v-container v-if="empresa">
    <v-dialog
      persistent
      fullscreen
      v-model="show_persona"
    >
      <persona-nueva
          dialog
          :dni="rep_legal.dni"
          @cancelar="show_persona = false"
          @created="nuevaPersona"
      ></persona-nueva>
    </v-dialog>

    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">Modificación de Datos de la Empresa</v-toolbar-title>
    </v-toolbar>

    <v-card>
        <br>
        <span class="subheading blue--text text--darken-4 ml-4"><b>Datos Básicos</b></span>

        <v-form ref="form_empresa" v-model="valid.form_empresa">

            <v-layout row>
            <v-flex xs6 class="ma-4">
                <input-texto
                tabindex="4"
                maxlength="100"
                label="Nombre"
                uppercase
                v-model="empresa.nombre"
                :rules="[rules.required]"
                ></input-texto>

                <v-select
                autocomplete
                tabindex="5"
                item-text="valor"
                item-value="id"
                return-object
                :items="global_state.opciones.empresa"
                v-model="empresa.tipoEmpresa"
                label="Tipo de Empresa" single-line bottom
                :rules="[rules.required]"
                >
                </v-select>

                <input-fecha
                    tabindex="6"
                    v-model="empresa.fechaConstitucion"
                    label="Fecha de Constitución"
                >
                </input-fecha>

                <v-select
                    label="Incumbencias"
                    max-height="400"
                    hint="Seleccione las incumbencias"
                    persistent-hint
                    multiple
                    :items="global_state.opciones.incumbencia"
                    item-text="valor"
                    item-value="id"
                    v-model="empresa.incumbencias"
                ></v-select>
            </v-flex>

            <v-flex xs6 class="ma-4">
                <input-numero
                tabindex="8"
                maxlength="11"
                label="CUIT"
                v-model="empresa.cuit"
                :rules="[rules.required, rules.cuit]"
                ></input-numero>

                <input-fecha
                    tabindex="9"
                    v-model="empresa.fechaInicio"
                    label="Fecha de Inicio de Actividades"
                >
                </input-fecha>

                <v-select
                autocomplete
                single-line
                bottom
                tabindex="10"
                item-text="valor"
                item-value="id"
                return-object
                :items="global_state.opciones.sociedad"
                v-model="empresa.tipoSociedad"
                label="Tipo de Sociedad"
                >
                </v-select>
            </v-flex>
            </v-layout>

        </v-form>

        <br>
        <v-divider></v-divider>
        <br>

        <span class="subheading blue--text text--darken-4 ml-4"><b>Domicilios</b></span>

        <v-layout row class="my-4">
            <v-flex x12>
                <entidad-domicilios
                    tabindex="13"
                    v-model="empresa.domicilios"
                ></entidad-domicilios>
            </v-flex>
        </v-layout>

        <v-divider></v-divider>
        <br>


        <span class="subheading blue--text text--darken-4 ml-4"><b>Contactos</b></span>
        <v-layout row class="my-4">
            <v-flex x12>
                <entidad-contactos
                    tabindex="13"
                    :opciones="global_state.opciones.contacto"
                    v-model="empresa.contactos"
                ></entidad-contactos>
            </v-flex>
        </v-layout>

        <br>
        <v-divider></v-divider>
        <br>


        <span class="subheading blue--text text--darken-4 ml-4"><b>Condición Impositiva</b></span>
        <v-layout row class="my-4">
            <v-flex x12>
                <entidad-condicion-afip
                    tabindex="18"
                    :opciones="global_state.opciones.condicionafip"
                    v-model="empresa.condiciones_afip"
                ></entidad-condicion-afip>
            </v-flex>
        </v-layout>

        <br>
        <v-divider></v-divider>
        <br>

        <span class="subheading blue--text text--darken-4 ml-4"><b>Representantes Técnicos</b></span>

        <v-layout row wrap class="mt-4 ml-2">
            <v-flex xs3  class="mx-3">
                <v-text-field
                    label="N°"
                    maxlength="30"
                    @input="updateList"
                    v-model="filtros.numero"
                >
                </v-text-field>
            </v-flex>

            <v-flex xs3>
                <v-text-field
                    label="Apellido"
                    maxlength="50"
                    @input="updateList"
                    v-model="filtros.apellido"
                >
                </v-text-field>
                </v-flex>
                <v-flex xs3  class="mx-3">
                <v-text-field
                    label="DNI"
                    maxlength="8"
                    @input="updateList"
                    v-model="filtros.dni"
                >
                </v-text-field>
            </v-flex>
        </v-layout>

        <v-layout row>
            <v-flex xs12 class="ma-3">
            <v-data-table
                :rows-per-page-items="[10, 15, 20]"
                :headers="$options.headers.matriculados"
                :items="matriculados"
                class="elevation-1"
                no-data-text="No se encontraron matriculados"
                no-results-text="No se encontraron matriculados"
                :pagination.sync="pagination"
                :total-items="totalItems"
                :loading="loading"
            >
                <template slot="items" slot-scope="props">
                <tr>
                    <td class="justify-center layout px-0">
                    <v-btn icon small class="mx-0" @click="addRepresentanteTecnico(props.item)">
                        <v-icon color="primary">playlist_add</v-icon>
                    </v-btn>
                    </td>
                    <td>{{ props.item.numeroMatricula }}</td>
                    <td>{{ props.item.entidad.nombre }}</td>
                    <td>{{ props.item.entidad.apellido }}</td>
                    <td>{{ props.item.entidad.dni }}</td>
                </tr>
                </template>
            </v-data-table>
            </v-flex>
        </v-layout>

        <br>
        <template v-if="representantes_tecnicos.length > 0">
            <v-layout row wrap>
            <v-flex xs12 class="mx-3">
                <v-data-table
                    hide-actions
                    :headers="$options.headers.rep_tecnico"
                    :items="representantes_tecnicos"
                    class="elevation-1"
                    no-data-text="No se agregaron representates"
                    no-results-text="No se agregaron representates"
                    >
                <template slot="items" slot-scope="props">
                    <tr>
                    <td class="justify-center layout px-0">
                        <v-btn icon small class="mx-0" @click="borrarRepresentanteTecnico(props.item.matricula.id)">
                        <v-icon color="red">delete</v-icon>
                        </v-btn>
                    </td>
                    <td>{{ props.item.matricula.numeroMatricula }}</td>
                    <td>{{ props.item.matricula.entidad.nombre }} {{ props.item.matricula.entidad.apellido }}</td>
                    <td>{{ props.item.matricula.entidad.dni }}</td>
                    <td>
                        <input-fecha
                        v-model="props.item.fechaInicio"
                        ></input-fecha>
                    </td>
                    <td>
                        <input-fecha
                        v-model="props.item.fechaFin"
                        ></input-fecha>
                    </td>
                    </tr>
                </template>
                </v-data-table>
            </v-flex>
            </v-layout>
        </template>

        <br>
        <v-divider></v-divider>
        <br><br>

        <span class="subheading blue--text text--darken-4 ml-4"><b>Representantes Legales</b></span>
        <v-layout row wrap class="mt-4 ml-2">
            <v-flex xs3  class="mx-3">
            <input-numero
                label="Buscar DNI"
                maxlength="8"
                append-icon="search"
                v-model="rep_legal.dni"
                @change="chgDni"
                :append-icon-cb="chgDni"
            ></input-numero>
            </v-flex>

            <v-flex xs3>
            <v-text-field
                disabled
                label="Apellido"
                v-model="rep_legal.apellido"
            >
            </v-text-field>
            </v-flex>

            <v-flex xs3  class="mx-3">
            <v-text-field
                disabled
                label="Nombre"
                v-model="rep_legal.nombre"
            >
            </v-text-field>
            </v-flex>

            <v-flex xs1  class="mx-3">
            <v-btn class="right mb-4" light @click="addRepresentanteLegal">
                Guardar
            </v-btn>
            </v-flex>
        </v-layout>

        <v-layout row wrap>
            <v-flex xs12 class="mx-3">
            <v-data-table
                hide-actions
                :headers="$options.headers.matriculados"
                :items="representantes_legales"
                class="elevation-1"
                no-data-text="No se agregaron representates"
                no-results-text="No se agregaron representates"
                >
                <template slot="items" slot-scope="props">
                <tr>
                    <td class="justify-center layout px-0">
                    <v-btn icon small class="mx-0" @click="borrarRepresentanteLegal(props.item)">
                        <v-icon color="red">delete</v-icon>
                    </v-btn>
                    </td>

                    <template v-if="props.item.id && props.item.matricula">
                    <td>{{ props.item.matricula.numeroMatricula }}</td>
                    <td>{{ props.item.matricula.entidad.dni }}</td>
                    <td>{{ props.item.matricula.entidad.nombre }}</td>
                    <td>{{ props.item.matricula.entidad.apellido }}</td>
                    </template>

                    <template v-else-if="props.item.id && props.item.persona">
                    <td></td>
                    <td>{{ props.item.persona.dni }}</td>
                    <td>{{ props.item.persona.nombre }}</td>
                    <td>{{ props.item.persona.apellido }}</td>
                    </template>

                    <template v-else>
                    <td>{{ props.item.numero }}</td>
                    <td>{{ props.item.dni }}</td>
                    <td>{{ props.item.nombre }}</td>
                    <td>{{ props.item.apellido }}</td>
                    </template>
                </tr>
                </template>
            </v-data-table>
            </v-flex>
        </v-layout>


        <v-layout row wrap>
          <v-flex xs12 class="ma-4">
            <v-btn
              :dark="!guardando"
              class="green right"
              :disabled="guardando"
              :loading="guardando"
              @click="submit"
            >
              Guardar
              <v-icon right>check_circle</v-icon>
            </v-btn>

            <v-btn dark class="red right" @click="$router.go(-1)">
              Cancelar
              <v-icon dark right>block</v-icon>
            </v-btn>
          </v-flex>
        </v-layout>

    </v-card>
</v-container>
</template>

<script>
import { debounce } from 'lodash'
import moment from 'moment'
import api from '@/services/api'
import { diffDatesStr, getFecha, clone } from '@/utils'
import rules from '@/validation/rules.js'
import MixinValidator from '@/components/mixins/MixinValidator';
import MixinGlobalState from '@/components/mixins/MixinGlobalState'
import { Empresa, ColumnHeader } from '@/model';
import InputTexto from '@/components/base/InputTexto'
import InputFecha from '@/components/base/InputFecha'
import InputNumero from '@/components/base/InputNumero'
import EntidadDomicilios from '@/components/entidades/EntidadDomicilios'
import EntidadContactos from '@/components/entidades/EntidadContactos'
import EntidadCondicionAfip from '@/components/entidades/EntidadCondicionAfip'
import PersonaNueva from '@/components/personas/PersonaNueva'

export default {
    name: 'EmpresaModificar',

    props: ['id'],

    mixins: [MixinGlobalState, MixinValidator],

    components: {
        InputTexto,
        InputFecha,
        InputNumero,
        EntidadDomicilios,
        EntidadContactos,
        EntidadCondicionAfip,
        PersonaNueva
    },

    headers: {
        matriculados: [
        ColumnHeader('', 'acciones'),
        ColumnHeader('N°', 'numero'),
        ColumnHeader('Nombre', 'nombre'),
        ColumnHeader('Apellido', 'nombre'),
        ColumnHeader('DNI', 'dni')
        ],

        rep_tecnico: [
        ColumnHeader('', 'acciones'),
        ColumnHeader('N°', 'numero'),
        ColumnHeader('Nombre', 'nombre'),
        ColumnHeader('DNI', 'dni'),
        ColumnHeader('Fecha Inicio', 'fini'),
        ColumnHeader('Fecha Cese', 'ffin')
        ]
    },

    watch: {
        filtros: {
            handler () {
                this.pagination.page = 1;
                this.updateMatriculas();
            },
            deep: true
        },

        pagination: {
            handler () {
                this.updateMatriculas();
            },
            deep: true
        }
    },

    data() {
        return {
            empresa: null,
            delegaciones: [],
            guardando: false,
            valid: {
                form_empresa: true
            },

            tipo_representante: 'tec',

            matriculados: [],
            debouncedUpdate: null,

            totalItems: 0,
            loading: false,
            pagination: {
                page: 1,
                rowsPerPage: 10,
            },

            filtros: {
                numero: '',
                dni: '',
                apellido: ''
            },

            matricula_selected: {},
            guardando: false,
            expand_add: false,
            show_persona: false,
            rep_legal: {
                persona: null,
                dni: null,
                nombre: null,
                apellido: null
            }
        }
    },

    computed: {
        representantes_legales: function() {
            return this.empresa.representantes.filter(r => r.tipo == 'legal');
        },

        representantes_tecnicos: function() {
            return this.empresa.representantes.filter(r => r.tipo == 'tecnico');
        },

        valid_representante: function() {
            return this.empresa.representantes.length > 0;
        },

        valid_domicilios: function() {
            return this.empresa.domicilios.length > 0;
        },

        valid_form: function() {
            return this.valid.form_empresa
                && this.valid_domicilios
                && this.valid_representante;
        },

        condiciones_afip: function() {
            return this.global_state.opciones.condicionafip.filter(c => c.t_entidad != 'profesional');
        }
    },

    created: function() {
        this.debouncedUpdate = debounce(this.updateMatriculas, 600, { 'maxWait': 1000 });

        Promise.all([
            api.get(`/empresas/${this.id}`),
            api.get('/delegaciones')
        ])
        .then(r => {
            this.empresa = clone(r[0].data);
            this.empresa.fechaInicio = getFecha(r[0].data.fechaInicio)
            this.empresa.fechaConstitucion = getFecha(r[0].data.fechaConstitucion);
            this.empresa.incumbencias = r[0].data.incumbencias.map(i => i.id);

            this.delegaciones = r[1].data;
            this.show_cargando = false;
        })
        .catch(e => console.error(e));
    },

    methods: {
        updateMatriculas: function() {
            this.loading = true;
            this.matriculados = [];
            let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
            let limit = this.pagination.rowsPerPage;

            // El estado '13' es 'Habilitado'
            let url = `/matriculas?entidad[tipo]=profesional&estado=13&limit=${limit}&offset=${offset}`;

            if (this.filtros.numero) url += `&filtros[numeroMatricula]=${this.filtros.numero}`;
            if (this.filtros.dni) url+=`&filtros[profesional.dni]=${this.filtros.dni}`;
            if (this.filtros.apellido) url+=`&filtros[profesional.apellido]=${this.filtros.apellido}`;

            api.get(url)
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

        addRepresentanteTecnico: function(matricula) {
            let representante = {
                tipo: 'tecnico',
                matricula: matricula,
                fechaInicio: '',
                fechaFin: ''
            };
            this.empresa.representantes.push(representante);
        },

        addRepresentanteLegal: function() {
            let representante = this.rep_legal;
            representante.tipo = 'legal';
            this.empresa.representantes.push(clone(representante));
        },

        borrarRepresentanteLegal: function(representante) {
        if (representante.persona)
            this.empresa.representantes = this.empresa.representantes
                                                    .filter(r => r.tipo != 'legal' || r.persona != representante.persona);
        else
            this.empresa.representantes = this.empresa.representantes
                                                    .filter(r => r.tipo != 'legal' || r.matricula != representante.matricula);
        },

        borrarRepresentanteTecnico: function(id) {
        this.empresa.representantes = this.empresa.representantes
                                                .filter(r => r.tipo != 'tecnico' || r.matricula.id != id);
        },


        chgDni: function() {
            this.rep_legal.persona = null;
            this.rep_legal.matricula = null;
            this.rep_legal.numero = null;
            this.rep_legal.nombre = null;
            this.rep_legal.apellido = null;

            api.get(`/matriculas?filtros[profesional.dni]=${this.rep_legal.dni}`)
            .then(r => {
                if (r.data.resultados.length > 0) {
                let matricula = r.data.resultados[0];
                    this.rep_legal.matricula = matricula;
                    this.rep_legal.numero = matricula.numeroMatricula;
                    this.rep_legal.nombre = matricula.entidad.nombre;
                    this.rep_legal.apellido = matricula.entidad.apellido;
                }
                else {
                    return api.get(`/personas?tipo=fisica&dni=${this.rep_legal.dni}`)
                    .then(r => {
                        if (r.data.resultados.length > 0) {
                            let persona = r.data.resultados[0];
                            this.rep_legal.persona = persona.id;
                            this.rep_legal.nombre = persona.nombre;
                            this.rep_legal.apellido = persona.apellido;
                        }
                        else if (rules.dni(this.rep_legal.dni) === true) {
                            if (confirm('No existe ninguna persona registrada con dicho dni. Desea cargarla?')) {
                                this.show_persona = true;
                            }
                        }
                    })
                }
            })
            .catch(e => console.error(e));
        },

        nuevaPersona: function(persona) {
            this.rep_legal.persona = persona.id;
            this.rep_legal.dni = persona.dni;
            this.rep_legal.nombre = persona.nombre;
            this.rep_legal.apellido = persona.apellido;
            this.show_persona = false;
        },

        prepare: function() {
            let empresa = clone(this.empresa);
            empresa.nombre = empresa.nombre.toUpperCase();
            empresa.tipoEmpresa = empresa.tipoEmpresa.id;
            empresa.tipoSociedad = empresa.tipoSociedad ? empresa.tipoSociedad.id : null;

            empresa.domicilios.forEach(d => {
                d.domicilio.pais = d.domicilio.pais.id;
                d.domicilio.provincia = d.domicilio.provincia.id;
                d.domicilio.departamento = d.domicilio.departamento.id;
                d.domicilio.localidad = d.domicilio.localidad.id;
            });

            empresa.contactos.forEach(c => {
                c.tipo = c.tipo.id;
            });

            empresa.condiciones_afip.forEach(c => {
                c.condicion_afip = c.condicion_afip.id;
            });

            empresa.representantes.forEach(r => {
                if (r.matricula) r.matricula = r.matricula.id;
                if (r.persona) r.persona = r.persona.id;
            })

            return empresa;
        },

        submit: function() {
            if (this.$refs.form_empresa.validate()) {
                if (this.valid_form) {
                    this.guardando = true;
                    api.put(`/empresas/${this.id}`, this.prepare())
                    .then(r => {
                        this.snackOk('Empresa actualizada exitosamente!');
                        this.guardando = false;
                        this.$router.go(-1);
                    })
                    .catch(e => {
                        this.snackError(e);
                        this.guardando = false;
                    });
                }
                else alert("El formulario es inválido. Por favor revise los datos ingresados")
            }
            else alert("El formulario es inválido. Por favor revise los datos ingresados")
        },
    }

}
</script>

<style>

</style>
