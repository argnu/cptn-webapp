<template>
  <v-container row wrap v-if="solicitud">
    <v-card>
      <h2>
        <b>Solicitud de Matriculación</b>
      </h2>

      <v-layout row class="mt-4">
        <v-flex xs1></v-flex>
        <v-flex xs5>
          Fecha: {{ solicitud.fecha | fecha }}
        </v-flex>
        <v-flex xs5>
          Delegación: {{ solicitud.delegacion }}
        </v-flex>
        <v-flex xs1></v-flex>
      </v-layout>

      <hr class="my-3">

      <v-layout row v-if="solicitud.entidad.tipo==='profesional'">
        <!-- <h3 class="my-4">Datos del Profesional</h3> -->
        <v-flex xs1></v-flex>
        <v-flex xs5>
          <div class="mb-3">
            Nombre: {{ solicitud.entidad.nombre }}
          </div>
          <div class="mb-3">
            DNI: {{ solicitud.entidad.dni }}
          </div>
          <div class="mb-3">
            Estado Civil: {{ solicitud.entidad.estadoCivil }}
          </div>
          <div class="mb-3">
            Nacionalidad: {{ solicitud.entidad.nacionalidad }}
          </div>
          <div class="mb-3">
            Relacion Dependencia: {{ solicitud.entidad.relacionDependencia | boolean }}
          </div>
          <div class="mb-3">
            Empresa: {{ solicitud.entidad.empresa }}
          </div>
        </v-flex>

        <v-flex xs5>
          <div class="mb-3">
            Apellido: {{ solicitud.entidad.apellido }}
          </div>
          <div class="mb-3">
            Fecha Nacimiento: {{ solicitud.entidad.fechaNacimiento | fecha }}
          </div>
          <div class="mb-3">
            Sexo: {{ solicitud.entidad.sexo }}
          </div>
          <div class="mb-3">
            Observaciones: {{ solicitud.entidad.observaciones }}
          </div>
          <div class="mb-3">
            Autónomo: {{ solicitud.entidad.independiente | boolean }}
          </div>
          <div class="mb-3">
            Servicios Prestados: {{ solicitud.entidad.serviciosPrestados }}
          </div>
        </v-flex>

        <v-flex xs1></v-flex>
      </v-layout>

      <hr class="my-3">

      <h3 class="my-4">Domicilios</h3>
      <v-layout row>
        <v-flex xs1></v-flex>
        <v-flex xs10>
          <table>
            <thead>
              <tr>
                <th></th>
                <th>País</th>
                <th>Provincia</th>
                <th>Departamento</th>
                <th>Localidad</th>
                <th>Dirección</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <b>Domicilio Real</b>
                </td>
                <td>{{ solicitud.entidad.domicilioReal.pais }}</td>
                <td>{{ solicitud.entidad.domicilioReal.provincia }}</td>
                <td>{{ solicitud.entidad.domicilioReal.departamento }}</td>
                <td>{{ solicitud.entidad.domicilioReal.localidad }}</td>
                <td>{{ solicitud.entidad.domicilioReal.direccion }}</td>
              </tr>
              <tr v-if="solicitud.entidad.domicilioProfesional">
                <td>
                  <b>Domicilio Profesional</b>
                </td>
                <td>{{ solicitud.entidad.domicilioProfesional.pais }}</td>
                <td>{{ solicitud.entidad.domicilioProfesional.provincia }}</td>
                <td>{{ solicitud.entidad.domicilioProfesional.departamento }}</td>
                <td>{{ solicitud.entidad.domicilioProfesional.localidad }}</td>
                <td>{{ solicitud.entidad.domicilioProfesional.direccion }}</td>
              </tr>
              <tr v-if="solicitud.entidad.domicilioConstituido">
                <td>
                  <b>Domicilio Consituido</b>
                </td>
                <td>{{ solicitud.entidad.domicilioConstituido.pais }}</td>
                <td>{{ solicitud.entidad.domicilioConstituido.provincia }}</td>
                <td>{{ solicitud.entidad.domicilioConstituido.departamento }}</td>
                <td>{{ solicitud.entidad.domicilioConstituido.localidad }}</td>
                <td>{{ solicitud.entidad.domicilioConstituido.direccion }}</td>
              </tr>
            </tbody>
          </table>
        </v-flex>
        <v-flex xs1></v-flex>
      </v-layout>

      <hr class="my-3">

      <h3 class="my-4">Contactos</h3>
      <v-layout row>
        <v-flex xs1></v-flex>
        <v-flex xs10>
          <table>
            <tbody>
              <tr v-for="contacto of solicitud.entidad.contactos" :key="contacto.id">
                <td>{{ contacto.tipo }}</td>
                <td>{{ contacto.valor }}</td>
              </tr>
            </tbody>
          </table>
        </v-flex>
        <v-flex xs1></v-flex>
      </v-layout>

      <hr class="my-3">

      <h3 class="my-4">Formaciones</h3>
      <v-layout row>
        <v-flex xs1></v-flex>
        <v-flex xs10>
          <table>
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Título</th>
                <th>Fecha de Egreso</th>
                <th>Fecha de Emisión</th>
                <th>Institución Formadora</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="formacion of solicitud.entidad.formaciones" :key="formacion.id">
                <td>{{ formacion.tipo == 1 ? 'Grado' : 'Posgrado' }}</td>
                <td>{{ formacion.titulo }}</td>
                <td>{{ formacion.fechaEgreso | fecha }}</td>
                <td>{{ formacion.fechaEmision | fecha }}</td>
                <td>{{ formacion.institucion }}</td>
              </tr>
            </tbody>
          </table>
        </v-flex>
        <v-flex xs1></v-flex>
      </v-layout>

      <hr class="my-3">

      <h3 class="my-4">Caja Previsional</h3>
      <v-layout row>
        <v-flex xs1></v-flex>
        <v-flex xs4>
          Posee Caja Previsional: {{ solicitud.entidad.poseeCajaPrevisional | boolean }}
        </v-flex>
        <v-flex xs7>
          Nombre Caja Previsional: {{ solicitud.entidad.nombreCajaPrevisional }}
        </v-flex>
      </v-layout>

      <hr class="my-3">

      <h4 class="my-3">Beneficiarios</h4>
      <v-layout row v-if="solicitud.entidad.beneficiarios.length">
        <v-flex xs1>
        </v-flex>
        <v-flex xs10>
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>DNI</th>
                <th>Fecha de Nacimiento</th>
                <th>Vínculo</th>
                <th>Invalidez</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="beneficiario of beneficiarios" :key="beneficiario.id">
                <th>{{ beneficiario.nombre }}</th>
                <th>{{ beneficiario.apellido }}</th>
                <th>{{ beneficiario.dni }}</th>
                <th>{{ beneficiario.fechaNacimiento | fecha }}</th>
                <th>{{ beneficiario.vinculo }}</th>
                <th>{{ beneficiario.invalidez }}</th>
              </tr>
            </tbody>
          </table>
        </v-flex>
        <v-flex xs1></v-flex>
      </v-layout>
      <v-layout row v-if="!solicitud.entidad.beneficiarios.length">
        <v-flex xs1>
        </v-flex>
        <v-flex xs10>
          No hay datos de beneficiarios
        </v-flex>
      </v-layout>

      <h3 class="my-4">Subsidio por Fallecimiento</h3>
      <v-layout row v-if="solicitud.entidad.subsidiarios.length">
        <v-flex xs1>
        </v-flex>
        <v-flex xs10>
          <table>
            <thead>
              <tr>
                <th>DNI</th>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Porcentaje</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="subsidiario of subsidiarios" :key="subsidiario.id">
                <th>{{ subsidiario.dni }}</th>
                <th>{{ subsidiario.nombre }}</th>
                <th>{{ subsidiario.apellido }}</th>
                <th>{{ subsidiario.porcentaje }}</th>
              </tr>
            </tbody>
          </table>
        </v-flex>
        <v-flex xs1></v-flex>
      </v-layout>
      <v-layout row v-if="!solicitud.entidad.subsidiarios.length">
        <v-flex xs1>
        </v-flex>
        <v-flex xs10>
          No hay datos de subsidiarios
        </v-flex>
      </v-layout>
      <h3 class="my-4">Declaraciones</h3>
      <v-card-text>
        <blockquote>
          Declaro bajo juramento que no he desarrollado actividades dentro del territorio de la Provinca de Neuquén, previo a la fecha de inscripción. Se efectúa la presente Declaración Jurada a los fines de no abonar las multas y recargos impuestos por el Colegio Profesional de Técnicos de Neuquén. Nota: de comprobarse la falsedad de la presente Declaración Jurada el Consejo Profesional aplicará al profesional una sanción consistente en duplo de la matrículo anual vigente. Art 29, Ley 708
        </blockquote>

        <v-checkbox label="De Acuerdo" v-model="deAcuerdo">
        </v-checkbox>

        <v-checkbox class="ma-0 pa-0" label="Permitir la publicación de los datos" v-model="solicitud.entidad.publicar">
        </v-checkbox>

      </v-card-text>

    </v-card>

    </v-flex>
    <v-flex>
      <v-btn @click.native="imprimir" class="btnImprimir">Imprimir</v-btn>
    </v-flex>

  </v-container>
</template>

<script>
import axios from '@/axios'
import * as utils from '@/utils'
import * as headers from '@/model/Headers'

export default {
  name: 'ImprimirSolicitud',
  props: ['id'],

  data() {
    return {
      solicitud: null
    }
  },

  computed: {
    headers: function() {
      return headers;
    }
  },

  created: function() {
    axios.get(`/solicitudes/${this.id}`)
      .then(r => this.solicitud = r.data)
      .catch(e => console.error(e));
  },

  methods: {
    imprimir: function() {
      window.print();
    }

  },

}
</script>

<style>
table tr td,
th {
  padding: 10px;
}

@media print {


  @page {
    size: portrait;
    margin-top: 2cm;
    margin-right: 2cm;
    margin-bottom: 2cm;
    margin-left: 2cm
  }
  nav,
  hr,
  footer,
  .btnImprimir {
    display: none;
  }
  body {
    padding-top: 0;
    margin-bottom: 2.5cm;
    line-height: 1.3;
  }
  a[href]:after {
    content: none
  }
  /* table {
    page-break-after: always;
  } */
  th {
    font-size: 0.7rem;
  }
  tr {
    border-bottom: 2px solid rgba(0, 0, 0, .15);
  }
  /* .page-break {
    page-break-before: always;
  } */
  small {
    font-size: 0.7rem;
  }
  .content {
    margin: 0 !important;
  }
}
</style>