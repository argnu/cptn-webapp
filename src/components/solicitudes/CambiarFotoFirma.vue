<template>
<v-container ref="main">
    <v-layout row wrap class="mt-4">
        <v-flex md6 xs12>
            <profesional-add-foto
                ref="foto"
                edit
                :url="url_foto"
                @change="chgFoto"
            ></profesional-add-foto>           
        </v-flex>

        <v-flex md6 xs12>
            <profesional-add-firma
                ref="firma"
                edit
                :url="url_firma"
                @change="chgFirma"            
            ></profesional-add-firma>
        </v-flex>
    </v-layout>


    <v-layout row wrap class="mt-4">
        <v-flex xs12 class="ma-4">
            <v-btn
                dark
                class="green right"
                :loading="submitted"
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
import api from '@/services/api';
import Store from '@/stores/Global';
import ProfesionalAddFoto from '@/components/entidades/ProfesionalAddFoto';
import ProfesionalAddFirma from '@/components/entidades/ProfesionalAddFirma';

export default {
  name: 'CambiarFotoFirma',
  props: ['profesional'],

  components: {
    ProfesionalAddFoto,
    ProfesionalAddFirma
  },

  data() {
    return {
      global_state: Store.state,
      foto: null,
      firma: null,
      submitted: false
    };
  },

  computed: {
    url_foto: function() {
      return this.profesional.foto
        ? this.profesional.foto + '?' + new Date().getTime()
        : '';
    },

    url_firma: function() {
      return this.profesional.firma
        ? this.profesional.firma + '?' + new Date().getTime()
        : '';
    }
  },

  methods: {
    reset: function() {
      this.$refs.foto.reset();
      this.$refs.firma.reset();
    },

    cerrar: function() {
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
      this.submitted = true;

      if (this.foto) {
        proms.push(api.put(`/profesionales/${this.profesional.id}/foto`, { foto: this.foto }));
      }

      if (this.firma) {
        proms.push(api.put(`/profesionales/${this.profesional.id}/firma`, { firma: this.firma }));
      }

      Promise.all(proms)
        .then(r => {
          this.submitted = false;
          this.global_state.snackbar.msg = 'Imágenes modificadas exitosamente';
          this.global_state.snackbar.color = 'success';
          this.global_state.snackbar.show = true;
          this.$emit('cerrar');
        })
        .catch(e => {
          this.submitted = false;
          this.global_state.snackbar.msg = 'Error al modificar imágenes';
          this.global_state.snackbar.color = 'error';
          this.global_state.snackbar.show = true;
        });
    }
  }
};
</script>

<style>
</style>
