<template>
<v-container class="grey lighten-3">

  
  <v-dialog v-model="show_cambio" persistent max-width="70%">
    <v-toolbar class="darken-3" color="primary">
      <v-toolbar-title class="white--text">Cambio de Estado de Matrícula</v-toolbar-title>
    </v-toolbar>
    <v-card>
      <v-card-text class="grey lighten-4">
        <v-container>
          <v-form lazy-validation ref="form_cambioestado">

            <v-layout row>
              <v-flex xs4 class="mx-4">
                <v-select
                  label="Estado:"
                  :items="select_items.estados"
                  v-model="cambio_estado.estado"
                  item-text="valor"
                  item-value="id"
                >
                </v-select>
              </v-flex>
            </v-layout>

            <v-layout row class="mt-4">
              <v-flex xs3 class="mx-4">
                <v-select
                  label="Tipo de Documento:"
                  :items="select_items.t_documento"
                  v-model="cambio_estado.documento.tipo"
                  item-text="valor"
                  item-value="id"
                >
                </v-select>
              </v-flex>

              <v-flex xs4 class="mx-4">
                <input-fecha
                  v-model="cambio_estado.documento.fecha"
                  label="Fecha de Resolución/Acta"
                  :rules="[rules.required, rules.fecha]"

                >
                </input-fecha>
              </v-flex>

              <v-flex xs3 class="mx-4">
                <input-numero
                  v-model="cambio_estado.documento.numero"
                  label="N° Resolución/Acta"
                  :rules="[rules.required, rules.integer]"
                >
                </input-numero>
              </v-flex>
            </v-layout>

            <v-layout row class="mt-5">
              <v-flex xs12>
                <v-btn 
                  class="right green white--text" 
                  @click.native="cambiarEstado"
                  :disabled="submit_cambio"
                  :loading="submit_cambio"
                >
                  Guardar
                  <v-icon dark right>check_circle</v-icon>
                </v-btn>
                <v-btn class="right red white--text" @click.native="show_cambio = false">
                  Cancelar
                  <v-icon dark right>block</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>

          </v-form>
        </v-container>
      </v-card-text>
    </v-card>
  </v-dialog>


  <v-toolbar class="darken-3" color="primary">
    <v-toolbar-title class="white--text">Matriculados</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <v-card class="mt-4">
    <v-expansion-panel expand title="Filtros de Búsqueda">
      <v-expansion-panel-content v-model="expand.filtros" class="lighten-4" color="primary">
        <div slot="header"><b></b></div>
        <v-container class="white black--text">
          <v-layout row wrap>
            <v-flex xs12 md3 class="mx-2">
              <v-select
                :items="select_items.tipo"
                label="Tipo de Entidad"
                single-line bottom
                v-model="filtros.tipoEntidad"
              ></v-select>
            </v-flex>

            <v-flex xs12 md3 class="mx-2">
              <v-select
                :items="select_items.estados"
                item-value="id"
                item-text="valor"
                label="Estado"
                single-line bottom
                autocomplete
                clearable
                v-model="filtros.estado"
              >
              </v-select>

              <div v-show="filtros.tipoEntidad == 'profesional'">
                <v-text-field 
                  v-model="filtros.profesional.dni" 
                  label="DNI" 
                  @input="updateList"
                  clearable
                ></v-text-field>
              </div>

              <div v-show="filtros.tipoEntidad == 'empresa'">
                <v-text-field 
                  clearable
                  v-model="filtros.empresa.cuit" 
                  label="CUIT" 
                  @input="updateList"
                ></v-text-field>
              </div>
            </v-flex>

            <v-flex xs12 md3 class="mx-2">
              <v-text-field 
                clearable
                v-model="filtros.numero" 
                label="N° Matrícula" 
                @input="updateList"
              ></v-text-field>

              <div v-show="filtros.tipoEntidad == 'profesional'">
                <v-text-field 
                  clearable
                  v-model="filtros.profesional.apellido" 
                  label="Apellido" 
                  @input="updateList"
                ></v-text-field>
              </div>

              <div v-show="filtros.tipoEntidad == 'empresa'">
                <v-text-field 
                  clearable
                  v-model="filtros.empresa.nombre" 
                  label="Nombre" 
                  @input="updateList"
                ></v-text-field>
              </div>
            </v-flex>
          </v-layout>

          <v-layout row wrap>
            <v-flex xs12>
              <v-btn                
                @click="limpiarFiltros"
              >Limpiar Filtros</v-btn>              
            </v-flex>            
          </v-layout>
        </v-container>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-card>

  <br>

    <v-data-table
      :headers="$options.headers[filtros.tipoEntidad]"
      :items="matriculas"
      class="elevation-1"
      no-data-text="No se encontraron matriculados"
      no-results-text="No se encontraron matriculados"
      :pagination.sync="pagination"
      :total-items="totalItems"
      :loading="loading"
      :rows-per-page-items="[25,30,35]"
    >

      <template slot="items" slot-scope="props">
        <td class="justify-center layout px-0">
          <v-btn small icon class="mx-0"  @click="verMatricula(props.item.id)" title="Ver Matrícula">
            <v-icon color="primary">assignment_ind</v-icon>
          </v-btn>
        </td>     

        <td>{{ props.item.numeroMatricula }}</td>
        <td>{{ props.item.numero_solicitud ? props.item.numero_solicitud : props.item.idMigracion }}</td>
          <template v-if="filtros.tipoEntidad == 'profesional'">
            <td>{{ props.item.entidad.apellido }}</td>
            <td>{{ props.item.entidad.nombre }}</td>
            <td>{{ props.item.entidad.dni }}</td>
          </template>
          <template v-if="filtros.tipoEntidad == 'empresa'">
            <td>{{ props.item.entidad.nombre }}</td>
            <td>{{ props.item.entidad.cuit }}</td>
          </template>
        <td>{{ props.item.estado.valor }}</td>
        <td>
          <v-menu>
            <v-btn icon slot="activator">
              <v-icon class="blue--text">more_vert</v-icon>
            </v-btn>
            
            <v-list>
              <v-list-tile v-if="props.item.estado.id == 13">
                <v-list-tile-title>
                  <v-menu open-on-hover top offset-x left>
                    <div slot="activator">
                      <v-icon class="text--darken-2">print</v-icon>
                      <span class="ml-2">Imprimir</span>
                    </div>
                    <v-list>
                      <v-list-tile
                        @click="imprimirCredencial(props.item)"
                      >
                        <v-icon class="text--darken-2 mr-2">print</v-icon>
                        <v-list-tile-title>Credencial</v-list-tile-title>
                      </v-list-tile>
                      
                      <v-list-tile
                        @click="imprimirCertificado(props.item)"
                      >
                        <v-icon class="text--darken-2 mr-2">print</v-icon>
                        <v-list-tile-title>Certificado de Habilitación</v-list-tile-title>
                      </v-list-tile>
                      
                    </v-list>
                  </v-menu>
                </v-list-tile-title>
              </v-list-tile>

              <v-list-tile
                @click="showCambioEstado(props.item.id)"
              >
                <v-icon class="primary--text mr-2">gavel</v-icon>
                <v-list-tile-title>Cambiar Estado</v-list-tile-title>
              </v-list-tile>

              <v-list-tile
                v-if="filtros.tipoEntidad == 'profesional' && props.item.numeroMatricula.length < 8"
                @click="rematricular(props.item.entidad.dni)"
              >
                <v-icon class="blue--text mr-2">note_add</v-icon>
                <v-list-tile-title>Rematricular</v-list-tile-title>
              </v-list-tile>

              <v-list-tile
                v-if="filtros.tipoEntidad == 'profesional'"
                @click="modificarProfesional(props.item.entidad.id)"
              >
                <v-icon class="blue--text mr-2">edit</v-icon>
                <v-list-tile-title>Modificar Datos Prof.</v-list-tile-title>
              </v-list-tile>
            </v-list>
          </v-menu>
        </td>
      </template>
    </v-data-table>

</v-container>
</template>

<script>
import * as utils from '@/utils'
import api from '@/services/api'
import reports from '@/services/reports'
import * as _ from 'lodash'
import InputFecha from '@/components/base/InputFecha'
import InputNumero from '@/components/base/InputNumero'
import { Matricula, Header} from '@/model'
import ListaStore from '@/stores/listados/Matriculas'
import MixinValidator from '@/components/mixins/MixinValidator'

class CambioEstado {
  constructor() {
    this.estado = '';
    this.matricula = '';
    this.documento = {
      tipo: '',
      numero: '',
      fecha: ''
    }
  }
}

export default {
  name: 'MatriculaLista',
  mixins: [MixinValidator],

  components: {
    InputNumero,
    InputFecha
  },  

  headers: {
    empresa: [
      Header('', 'ver'),
      Header('N° Matrícula', 'numeroMatricula', true),
      Header('N° Solicitud', 'numeroSolicitud', true),
      Header('Nombre', 'nombreEmpresa', true),
      Header('CUIT', 'cuit', true),
      Header('Estado', 'estado', true),
      Header('Menú', 'acciones')
    ],

    profesional: [
      Header('', 'ver'),
      Header('N° Matrícula', 'numeroMatricula', true),
      Header('N° Solicitud', 'numeroSolicitud'),
      Header('Apellido', 'apellido', true),
      Header('Nombre', 'nombre', true),
      Header('DNI', 'dni', true),
      Header('Estado', 'estado', true),
      Header('Menú', 'acciones')
    ]
  },

  data() {
    return {
      pagination: ListaStore.state.pagination,
      filtros: ListaStore.state.filtros,
      totalItems: 0,
      loading: false,

      select_items: {
        tipo: [{
            text: 'Profesionales',
            value: 'profesional'
          },
          {
            text: 'Empresas',
            value: 'empresa'
          }
        ],

        estados: [],
        t_documento: []
      },

      expand: {
        filtros: true
      },

      matriculas: [],
      debouncedUpdate: null,

      show_cambio: false,
      submit_cambio: false,
      cambio_estado: new CambioEstado()
    }
  },

  watch: {
    filtros: {
      handler() {
        this.pagination.page = 1;
        this.updateMatriculas();
      },
      deep: true
    },

    pagination: {
      handler() {
        this.updateMatriculas();
      },
      deep: true
    }
  },

  created: function() {
    this.debouncedUpdate = _.debounce(this.updateMatriculas, 600, {
      'maxWait': 1000
    });
    
    api.get('/opciones?sort=+valor')
      .then(r => {
        this.select_items.estados = r.data.estadoMatricula;
        this.select_items.t_documento = r.data.documento;
      })
      .catch(e => console.error(e));
  },

  methods: {
    limpiarFiltros: function() {
      ListaStore.limpiarFiltros();
    },

    updateList: function() {
      this.debouncedUpdate();
    },

    updateMatriculas: function() {
      if (this.filtros.tipoEntidad.length) {
        this.loading = true;
        this.matriculas = [];
        let offset = (this.pagination.page - 1) * this.pagination.rowsPerPage;
        let limit = this.pagination.rowsPerPage;

        let url = `/matriculas?tipoEntidad=${this.filtros.tipoEntidad}&limit=${limit}&offset=${offset}`;

        if (this.filtros.estado) url += `&estado=${this.filtros.estado}`;
        if (this.filtros.numero) url += `&numeroMatricula=${this.filtros.numero}`;
        if (this.filtros.profesional.dni) url += `&dni=${this.filtros.profesional.dni}`;
        if (this.filtros.profesional.apellido) url += `&apellido=${this.filtros.profesional.apellido}`;
        if (this.filtros.empresa.cuit) url += `&cuit=${this.filtros.empresa.cuit}`;
        if (this.filtros.empresa.nombre) url += `&nombreEmpresa=${this.filtros.empresa.nombre}`;

        if (this.pagination.sortBy) url+=`&sort=${this.pagination.descending ? '-' : '+'}${this.pagination.sortBy}`;

        api.get(url)
          .then(r => {
            this.matriculas = r.data.resultados;
            this.totalItems = r.data.totalQuery;
            this.loading = false;
          })
          .catch(e => console.error(e));
      }
    },

    verMatricula: function(id) {
      this.$router.push(`/matriculas/${id}`);
    },

    showCambioEstado: function(id) {
      this.cambio_estado.matricula = id;
      this.show_cambio = true;
    },

    cambiarEstado: function() {
      if (this.$refs.form_cambioestado.validate()) {
        this.submit_cambio = true;

        api.post('/matriculas/cambiar-estado', this.cambio_estado)
        .then(r => {
          this.submit_cambio = false;
          this.updateMatriculas();
          this.cambio_estado = new CambioEstado();
          this.$refs.form_cambioestado.reset();
          this.show_cambio = false;
          this.global_state.snackbar.msg = 'Estado de matrícula modificado exitosamente!';
          this.global_state.snackbar.color = 'success';
          this.global_state.snackbar.show = true;
        })
        .catch(e => {
          this.submit_cambio = false;
          let msg = (!e.response || e.response.status == 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.msg;
          this.global_state.snackbar.msg = msg;
          this.global_state.snackbar.color = 'error';
          this.global_state.snackbar.show = true;
          console.error(e)
        });        
      }
    },

    rematricular: function(dni) {
      this.$router.push(`/solicitudes/profesionales/nueva?dni=${dni}`);
    },

    imprimirCredencial: function(item) {
      reports.open({
        'jsp-source': 'credencial-v4.3-dorso.jasper',
        'jsp-format': 'PDF',
        'jsp-output-file': `Credencial (Dorso) ${item.numeroMatricula} - ${Date.now()}`,
        'jsp-only-gen': false,
        'numeroMatricula': item.numeroMatricula
      });

      reports.open({
        'jsp-source': 'credencial-v4.3-frente.jasper',
        'jsp-format': 'PDF',
        'jsp-output-file': `Credencial (Frente) ${item.numeroMatricula} - ${Date.now()}`,
        'jsp-only-gen': false,
        'numeroMatricula': item.numeroMatricula
      });      
    },

    imprimirCertificado: function(item) {
      reports.open({
        'jsp-source': 'certificado_matriculado_habilitado.jasper',
        'jsp-format': 'PDF',
        'jsp-output-file': `Cert. Habilitación Matrícula ${item.numeroMatricula} - ${Date.now()}`,
        'jsp-only-gen': false,
        'id_matricula': item.id
      });      
    },

    modificarProfesional: function(id) {
      this.$router.push(`/profesionales/${id}/modificar`);
    }

  }

}
</script>

<style>
</style>
