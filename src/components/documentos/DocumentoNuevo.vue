<template>
  <v-container>

    <v-toolbar color="primary">
      <v-toolbar-title class="white--text">Nuevo Documento</v-toolbar-title>
    </v-toolbar>

    <v-card>
        <v-form ref="form">

        <v-layout row>
            <v-flex xs12 md3 class="mx-5 mb-3 mt-4">
                <v-select
                  label="Tipo:"
                  :items="tipos_doc"
                  v-model="documento.tipo"
                  item-text="valor"
                  item-value="id"
                  :rules="[rules.required]"
                ></v-select>
            </v-flex>

            <v-flex xs12 md3 class="mx-5 mb-3" mt-4>
                <input-fecha
                    label="Fecha"
                    v-model="documento.fecha"
                    :rules="[rules.required, rules.fecha]"
                ></input-fecha>
            </v-flex>

            <v-flex xs12 md3 class="mx-5 mb-3" mt-4>
                <input-numero
                    label="N°"
                    v-model="documento.numero"
                    :rules="[rules.required, rules.number]"
                ></input-numero>
            </v-flex>
        </v-layout>
        </v-form>

        <v-layout>
            <v-flex xs12 md6 class="mx-5">
                <span class="mr-4">Archivo:</span>
                <input type="file" name="archivo" id="archivo" ref="archivo">
            </v-flex>
        </v-layout>

        <v-layout>
            <v-flex xs12 class="ma-5">
                <v-btn
                    class="green darken-1 white--text right"
                    @click.native="submit"
                    :disabled="submitted"
                    :loading="submitted"
                >
                    Guardar
                    <v-icon dark right>check_circle</v-icon>
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
import api from '@/services/api'
import * as utils from '@/utils'
import MixinValidator from '@/components/mixins/MixinValidator'
import Documento from '@/model/Documento'
import InputNumero from '@/components/base/InputNumero'
import InputFecha from '@/components/base/InputFecha'


export default {
    name: 'DocumentoNuevo',
    props: ['id'],

    mixins: [MixinValidator],

    components: {
        InputNumero,
        InputFecha
    },

    data() {
        return {
            documento: new Documento(),
            submitted: false,
            tipos_doc: []
        }
    },

    watch: {
        '$route' (to, from) {
            if (!this.id) { 
                this.documento = new Documento();
                this.$refs.form.reset();
            }
            else this.initDocumento();
        }
    },    

    created: function() {
        api.get('/opciones')
        .then(r => { 
            this.tipos_doc = r.data.documento
            if (this.id) {
                return this.initDocumento()
            }
        })
        .catch(e => console.error(e));
    },

    methods: {
        initDocumento: function() {
            return api.get(`/documentos/${this.id}`)
            .then(r => {
                this.documento.tipo = r.data.tipo.id;
                this.documento.numero = r.data.numero;
                this.documento.fecha = utils.getFecha(r.data.fecha);
            });
        },
        submit: function() {            
            if (this.$refs.form.validate()) {
                this.submitted = true;
                let fd = new FormData();
                for(let att in this.documento) fd.append(att, this.documento[att]);
                fd.append('archivo', this.$refs.archivo.files[0]);

                if (this.id) {
                    api.put(`/documentos/${this.id}`, fd)
                    .then(r => {
                        this.submitted = false;
                        this.documento = new Documento();
                        this.global_state.snackbar.msg = 'Documento modificado exitosamente!';
                        this.global_state.snackbar.color = 'success';
                        this.global_state.snackbar.show = true;
                        this.$router.go(-1);
                    })
                    .catch(e => {
                        this.submitted = false;
                        let msg = (!e.response || e.response.status == 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.msg;
                        this.global_state.snackbar.msg = msg;
                        this.global_state.snackbar.color = 'error';
                        this.global_state.snackbar.show = true;
                        console.error(e);
                    })
                }
                else {
                    api.post('/documentos', fd)
                    .then(r => {
                        this.submitted = false;
                        this.documento = new Documento();
                        this.global_state.snackbar.msg = 'Nuevo documento creado exitosamente!';
                        this.global_state.snackbar.color = 'success';
                        this.global_state.snackbar.show = true;
                        this.$router.replace('/documentos/lista');
                    })
                    .catch(e => {
                        this.submitted = false;
                        let msg = (!e.response || e.response.status == 500) ? 'Ha ocurrido un error en la conexión' : e.response.data.msg;
                        this.global_state.snackbar.msg = msg;
                        this.global_state.snackbar.color = 'error';
                        this.global_state.snackbar.show = true;
                        console.error(e);
                    })
                }
            }
        }
    }

}
</script>

<style>

</style>
