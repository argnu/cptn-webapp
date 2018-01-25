<template>
<v-container ref="main">
    <v-layout row wrap class="mt-4">
        <v-flex md6 xs12>
            <add-foto
                ref="foto"
                edit
                :url="url_foto"
                @change="chgFoto"
            ></add-foto>           
        </v-flex>

        <v-flex md6 xs12>
            <add-firma
                ref="firma"
                edit
                :url="url_firma"
                @change="chgFirma"            
            ></add-firma>
        </v-flex>
    </v-layout>


    <v-layout row wrap class="mt-4">
        <v-flex xs12 class="ma-4">
            <v-btn
                dark
                class="green right"
                @click="guardar"
            >
                Guardar Cambios
                <v-icon dark right>check_circle</v-icon>
            </v-btn>

            <v-btn dark class="red right" @click="cerrar">
                Cancelar
                 <v-icon dark right>block</v-icon>
            </v-btn>
        </v-flex>
    </v-layout>
</v-container>
</template>

<script>
import axios from '@/axios'
import Store from '@/stores/Global'
import AddFoto from '@/components/solicitudes/AddFoto'
import AddFirma from '@/components/solicitudes/AddFirma'


export default {
    name: 'CambiarFotoFirma',
    props: ['profesional'],

    components: {
        AddFoto,
        AddFirma
    },

    data() {
        return {
            global_state: Store.state,
            foto: null,
            firma: null
        }
    },

    computed: {
        url_foto: function() {
            return this.profesional.foto ? 
                this.profesional.foto + '?' + new Date().getTime()
            : '';
        },

        url_firma: function() {
            return this.profesional.firma ? 
                this.profesional.firma + '?' + new Date().getTime()
            : '';
        }
    },

    methods: {
        reset: function() {
            this.$refs.foto.reset();
            this.$refs.firma.reset();
        },

        cerrar: function () {
            this.$emit('cerrar');
        },

        chgFoto: function(foto) {
            this.foto = foto;
        },

        chgFirma: function(firma) {
            this.firma = firma;
        },

        guardar: function() {
            let proms = [];
            let form_data;
            
            if (this.foto) {
                form_data = new FormData();
                form_data.append('foto', this.foto);
                proms.push(axios.put(`/profesionales/${this.profesional.id}/foto`, form_data));
            }

            if (this.firma) {
                form_data = new FormData();
                form_data.append('firma', this.firma);
                proms.push(axios.put(`/profesionales/${this.profesional.id}/firma`, form_data));
            }

            Promise.all(proms)
            .then(r => {
                this.global_state.snackbar.msg = 'Imagenes modificadas exitosamente!';
                this.global_state.snackbar.color = 'success';
                this.global_state.snackbar.show = true;
                this.$emit('cerrar');
            })
            .catch(e => {
                this.global_state.snackbar.msg = 'Error al modificar imágenes';
                this.global_state.snackbar.color = 'error';
                this.global_state.snackbar.show = true;
            });
        },
    }

}
</script>

<style>

</style>
