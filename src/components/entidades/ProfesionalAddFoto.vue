<template>
    <v-card class="pa-4 mx-4 elevation-1">
        <v-icon>photo_camera</v-icon>
        <b>Foto:</b>


        <v-radio-group v-model="tipo_foto" row>
            <v-radio label="Imagen" value="imagen" ></v-radio>
            <v-radio label="Capturar" value="capturar"></v-radio>
        </v-radio-group>

        <div v-show="tipo_foto == 'imagen'">
            <img
                ref="img"
                :src="url"
                alt=""
            />
            <v-btn
                v-show="crop_ready"
                dark
                ref="aplicar"
                class="green"
                @click.native="aplicarCrop"
            >
                Aplicar recorte
            </v-btn>
            <v-icon v-show="crop_done" color="success">check_circle</v-icon>
            <template v-if="edit">
                <br><br>
                <v-icon>add_a_photo</v-icon>
                <b>Cambiar:</b>
                <input type="file" ref="archivo" name="foto" id="foto" @change="showImage('foto')">
            </template>            
        </div>

        <div v-show="tipo_foto == 'capturar'">
            <video autoplay="true" ref="video_elem" id="video-elem">
            </video>   
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
    </v-card>
</template>

<style lang="scss">
@import "node_modules/cropper/dist/cropper.min";
</style>

<script>
import * as utils from '@/utils';
import Cropper from 'cropperjs';

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

  data() {
    return {
      tipo_foto: 'imagen',
      show_error: false,
      crop_ready: false,
      crop_done: false
    };
  },

  watch: {
    tipo_foto: function(new_val) {
      if (new_val == 'capturar') {
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
  },

  methods: {
    handleVideo: function(stream) {
      window.mediaStream = stream;
      window.mediaStream.stop = function() {
        this.getAudioTracks().forEach(function(track) {
          track.stop();
        });
        this.getVideoTracks().forEach(function(track) {
          //in case... :)
          track.stop();
        });
      };
      this.$refs.video_elem.src = window.URL.createObjectURL(stream);
    },

    videoError: function() {
      this.show_error = true;
    },

    showImage: function() {
      let self = this;

      let input = this.$refs.archivo;
      if (input.files && input.files[0]) {
        let reader = new FileReader();
        reader.readAsDataURL(input.files[0]);
        reader.onload = e => {
          let imgTag = this.$refs.img;
          imgTag.setAttribute('src', e.target.result);
          imgTag.onload = function() {
            window.cropper = new Cropper(imgTag, {
              initialAspectRatio: 3 / 4,
              aspectRatio: 3 / 4,
              crop(event) {
                self.crop_done = false;
                self.crop_ready = true;
              }
            });
          };
        };
      }
    },

    aplicarCrop: function() {
      let self = this;
      let input = this.$refs.archivo;

      window.cropper.getCroppedCanvas().toBlob(blob => {
        let reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = function() {
          let base64data = reader.result;
          let filename =
            input && input.files.length
              ? input.files[0].name
              : 'foto-' + new Date().getTime() + '.png';
          self.$emit('change', [base64data, filename]);
        };
      });
      this.crop_done = true;
    },

    reset: function() {
      this.$refs.archivo.value = null;
      this.$refs.img.setAttribute('src', '');
    },

    capturarFoto: function() {
      let self = this;
      let canvas = document.createElement('canvas');
      canvas.width = 480;
      canvas.height = 360;

      let context = canvas.getContext('2d');
      context.drawImage(
        this.$refs.video_elem,
        0,
        0,
        canvas.width,
        canvas.height
      );

      let dataURI = canvas.toDataURL('image/png');
      let imgTag = this.$refs.img;
      imgTag.setAttribute('src', dataURI);
      imgTag.onload = function() {
        window.cropper = new Cropper(imgTag, {
          initialAspectRatio: 3 / 4,
          aspectRatio: 3 / 4,
          crop(event) {
            self.crop_done = false;
            self.crop_ready = true;
          }
        });
        window.mediaStream.stop();
      };
      this.tipo_foto = 'imagen';
    }
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
