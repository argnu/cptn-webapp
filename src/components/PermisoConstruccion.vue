<template>
  <v-container>

    <v-layout row>
      <v-flex xs12>
        <!-- DATOS GENERALES -->
        <v-card>
          <v-card-title>
            <span class="title">Datos Generales</span>
          </v-card-title>
          <v-card-text>
            <v-layout>
              <v-flex xs4 class="ma-4">
                Número de Matrícula:
              </v-flex>
              <v-flex xs4 class="ma-4" v-show="matricula.tipoEntidad == 'profesional'">
                Apellido: <br><br>
                Nombre:
              </v-flex>
              <v-flex xs6 class="ma-4" v-show="matricula.tipoEntidad == 'empresa'">
                Nombre: <br><br>
                CUIT:
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <br>

    <v-layout row>
      <v-flex xs12>
        <v-card>
          <v-card-text>
            <v-layout>
              <v-flex xs6>
                <!-- DATOS DEL COMITENTE -->
                  <v-container fluid>
                    <span class="title">Datos del Comitente</span>
                    <v-layout class="mt-5">
                      <v-flex xs6>
                        <v-radio label="Persona" value="persona" v-model="permiso.tipoComitente"></v-radio>
                      </v-flex>
                      <v-flex xs6>
                        <v-radio label="Empresa" value="empresa" v-model="permiso.tipoComitente"></v-radio>
                      </v-flex>
                    </v-layout>
                    <v-layout v-show="permiso.tipoComitente == 'persona'">
                      <v-flex xs6 class="mr-5">
                        <v-text-field label="Nombre">
                        </v-text-field>
                        <v-text-field label="Apellido">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs6 class="mr-5">
                        <v-text-field label="DNI">
                        </v-text-field>
                        <v-text-field label="Teléfono">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                    <v-layout v-show="permiso.tipoComitente == 'empresa'">
                      <v-flex xs6 class="mr-5">
                        <v-text-field label="Nombre">
                        </v-text-field>
                        <v-text-field label="Teléfono">
                        </v-text-field>
                      </v-flex>
                      <v-flex xs6 class="mr-5">
                        <v-text-field label="CUIT">
                        </v-text-field>
                      </v-flex>
                    </v-layout>
                  </v-container>
              </v-flex>

              <v-flex xs6>
                <!-- DATOS DE LA UBICACIÓN -->
                  <v-container fluid>
                    <span class="title">Ubicación</span>
                    <v-layout row class="mt-3">
                      <v-flex xs6>
                        <v-select
                          autocomplete
                          label="País"
                        >
                        </v-select>
                        <v-select
                          autocomplete
                          label="Departamento"
                        >
                        </v-select>
                        <v-text-field
                          label="Calle"
                        >
                        </v-text-field>
                      </v-flex>
                      <v-flex xs6>
                        <v-select
                          autocomplete
                          label="Provincia"
                        >
                        </v-select>
                        <v-select
                          autocomplete
                          label="Localidad"
                        >
                        </v-select>
                        <v-text-field
                          label="Nro"
                        >
                        </v-text-field>
                      </v-flex>
                    </v-layout>

                    <v-layout row>
                      <v-text-field label="Nomenclatura"></v-text-field>
                    </v-layout>
                  </v-container fluid>
              </v-flex>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <br>

    <v-layout row>
      <v-flex xs12>
        <!-- DATOS DE LAS TAREAS -->
        <v-card>
          <v-card-title>
            <span class="title">Tareas</span>
          </v-card-title>
          <v-card-text>
            <v-layout row>
              <v-flex xs6>
                <v-select
                  autocomplete
                  label="Tarea Principal"
                >
                </v-select>
              </v-flex>
              <v-flex xs6>
                <v-select
                  autocomplete
                  label="Tareas Asociadas"
                >
                </v-select>
              </v-flex>
            </v-layout>

            <span class="subheading ml-5">Items</span>
            <v-layout row v-for="item of items_tarea" class="mx-5" key="item.texto">
                <v-text-field
                  :label="item.texto"
                >
                </v-text-field>
            </v-layout>

            <v-layout row class="mx-5">
              <v-flex xs5>
                <v-text-field
                  label="Descripción"
                  v-model="nuevo_item.descripcion"
                >
                </v-text-field>
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  label="Valor"
                  v-model="nuevo_item.valor"
                >
                </v-text-field>
              </v-flex>
              <v-flex xs2>
                <v-btn light @click="addItem">Agregar</v-btn>
              </v-flex>
            </v-layout>

            <v-layout row class="mx-5">
                <v-data-table
                    :headers="headers.items"
                    :items="items_extra"
                    hide-actions
                    class="elevation-1"
                    no-data-text="No hay items nuevos">
                  <template slot="headers" scope="props">
                    <th v-for="header of props.headers" style="padding: 20px">
                      {{ header.text }}
                    </th>
                    <th></th>
                  </template>
                  <template slot="items" scope="props">
                    <td>{{ props.item.descripcion }}</td>
                    <td>{{ props.item.valor }}</td>
                    <td style="width:30px">
                      <v-btn icon @click="removeItemExtra(props.index)">
                        <v-icon>delete</v-icon>
                      </v-btn>
                    </td>
                  </template>
                </v-data-table>
            </v-layout>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>

    <br>

    <v-layout row>
      <v-flex xs12>
        <v-btn class="primary white--text right" @click.native="">
          Guardar
          <v-icon dark right></v-icon>
        </v-btn>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
class Item {
  constructor() {
    this.descripcion = '';
    this.valor = '';
  }

  isValid() {
    return this.descripcion.length
      && this.valor.length;
  }
}


export default {
  name: 'permiso-construccion',
  data () {
    return {
      matricula: {
          tipoEntidad: 'profesional'
      },

      permiso: {
        tipoComitente: 'persona'
      },

      headers: {
          items: [
            { text: 'Descripción', value: 'descripcion' },
            { text: 'Valor', value: 'valor' }
          ]
      },

      items_tarea: [
          {
            texto: 'Cantidad de m2'
          },
          {
            texto: 'Tipo de X'
          }
      ],

      items_extra: [],

      nuevo_item: new Item(),
    }
  },

  created: function() {
  },

  methods: {
    addItem: function() {
      if (this.nuevo_item.isValid()) {
        this.items_extra.push(this.nuevo_item);
        this.nuevo_item = new Item();
      }
    },

    removeItemExtra: function(i) {
      this.items_extra.splice(i, 1);
    }
  },

}
</script>

<style>
</style>
