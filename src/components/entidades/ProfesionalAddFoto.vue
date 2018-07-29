<template>
    <v-card class="pa-4 mx-4 elevation-1">
        <v-icon>photo_camera</v-icon>
        <b>Foto:</b>

        <div>
            <img v-show="!show_capturar && !show_crop" ref="img" :src="url"
              style="max-height:480px; width: 360px; max-width:100%"
              alt="No hay foto asociada"
            />

            <div v-show="show_crop">
              <img ref="img_crop" style="height:480px; width:360px"/>
              <br>
              <v-btn
                  outline dark
                  color="error"
                  @click.native="show_crop = false"
              >
                  <v-icon class="mr-2">block</v-icon>
                  Cancelar
              </v-btn>

              <v-btn
                  otuline dark
                  ref="aplicar"
                  color="green"
                  @click.native="aplicarCrop"
              >
                  Aplicar recorte
              </v-btn>
            </div>

            <input
              style="display:none"
              type="file"
              ref="archivo"
              name="foto"
              id="foto"
              @change="selectImage"
            />
        </div>

        <div v-show="show_capturar">
            <video autoplay="true" ref="video_elem" id="video-elem"></video>
            <br>
            <v-btn
                outline
                color="error"
                dark
                @click.native="show_capturar = false"
            >
                <v-icon class="mr-2">block</v-icon>
                Cancelar
            </v-btn>
            <v-btn
                outline
                color="primary"
                dark
                @click.native="capturarFoto"
            >
                <v-icon class="mr-2">add_a_photo</v-icon>
                Capturar
            </v-btn>
        </div>

        <v-layout row wrap v-if="edit && !show_capturar && !show_crop" class="mt-3">
            <v-flex md4 xs12 v-if="url && show_recortar">
                <v-btn
                    color="primary"
                    @click.native="recortarActual"
                >
                    <v-icon>crop_free</v-icon>
                    Recortar
                </v-btn>
            </v-flex>

            <v-flex md4 xs12>
                <v-btn
                    color="primary"
                    @click.native="seleccionarArchivo"
                >
                    <v-icon>attach_file</v-icon>
                    Archivo
                </v-btn>
            </v-flex>

            <v-flex md4 xs12 v-if="!$options.isMobile()">
                <v-btn
                    color="primary"
                    @click.native="show_capturar = true"
                >
                    <v-icon>camera</v-icon>
                    Capturar
                </v-btn>
            </v-flex>
        </v-layout>

        <canvas ref="canvas_convert" style="display:none"/>
    </v-card>
</template>

<style lang="scss">
@import "node_modules/cropper/dist/cropper.min";
</style>

<script>
import * as utils from '@/utils'
import Cropper from 'cropperjs'
import axios from 'axios'

let cropper;

export default {
  name: 'AddFoto',
  props: {
    edit: {
      type: Boolean,
      default: false,
      note: 'Si se permite cargar nueva foto'
    },

    url: {
      type: String,
      default: '',
      note: 'Url de la foto'
    }
  },

  isMobile: utils.isMobile,

  data() {
    return {
      show_recortar: true,
      show_error: false,
      show_capturar: false,
      show_crop: false,
      cropper: null
    };
  },

  watch: {
    show_capturar: function(new_val) {
      if (new_val) {
        if (navigator.getUserMedia)
          navigator.getUserMedia(
            { video: true },
            this.handleVideo,
            this.videoError
          );
      }
    }
  },

  created: function() {
    navigator.getUserMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia ||
      navigator.oGetUserMedia;

      if (this.url) {
        axios.get(this.url)
        .then(r => {
          this.show_recortar = true;
        })
        .catch(e => {
          this.show_recortar = false;
        })
      }
  },

  mounted: function() {
    let self = this;
    cropper = new Cropper(this.$refs.img_crop, {
      initialAspectRatio: 3 / 4,
      aspectRatio: 3 / 4
    });
  },

  methods: {
    handleVideo: function(stream) {
      window.mediaStream = stream;
      window.mediaStream.stop = function() {
        this.getAudioTracks().forEach(function(track) {
          track.stop();
        });
        this.getVideoTracks().forEach(function(track) {
          track.stop();
        });
      };
      this.$refs.video_elem.src = window.URL.createObjectURL(stream);
    },

    videoError: function() {
      this.show_error = true;
    },

    selectImage: function() {
      let input = this.$refs.archivo;
      if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = e => {
          cropper.replace(e.target.result);
          this.show_crop = true;
        };
      }
    },

    aplicarCrop: function() {
      let input = this.$refs.archivo;
      let base64data = cropper.getCroppedCanvas({
        fillColor: 'white',
        maxWidth: 540,
        maxHeight: 720
      })
      .toDataURL('image/jpeg');

      this.$refs.img.setAttribute('src', base64data);
      this.show_crop = false;
      this.$emit('change', base64data)
    },

    reset: function() {
      this.$refs.archivo.value = null;
      this.$refs.img.setAttribute('src', '');
    },

    capturarFoto: function() {
      this.show_capturar = false;
      this.show_crop = true;
      let self = this;
      let canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 360;

      let context = canvas.getContext('2d');
      context.drawImage(this.$refs.video_elem, 0, 0, canvas.width, canvas.height);

      let data_uri = canvas.toDataURL('image/jpeg');
      cropper.replace(data_uri);
    },

    recortarActual: function() {
      let src = this.$refs.img.getAttribute('src');
      //Si la img actual es la que está guardada
      if (src.includes('http://')) {
        axios.get(src, { responseType: "blob" })
        .then(r => {
          let reader = new FileReader();
          reader.readAsDataURL(r.data);
          reader.onload = () => {
              cropper.replace(reader.result);
              this.show_crop = true;
          }
        })
      }
      //Sino la imagen fue cargada ahora
      else {
        cropper.replace(src);
        this.show_crop = true;
      }
    },

    seleccionarArchivo: function() {
      this.$refs.archivo.click();
    },
  }
};
</script>

<style scoped>
#video-elem {
  max-width: 100%;
  max-height: 350px;
  background-color: #666;
}
</style>
