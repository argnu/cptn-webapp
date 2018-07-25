<template>
    <v-card class="pa-4 mx-4 elevation-1">
        <v-icon>perm_identity</v-icon>
        <b>Firma:</b>

        <div>
            <img v-show="!show_dibujar  && !show_crop && !show_cargandofoto" :src="url" ref="img" style="max-width:180px" alt="No hay firma asociada"/>
            <input style="display:none" type="file" ref="archivo" name="firma" id="firma" @change="selectImage">

            <v-progress-circular
              v-show="show_cargandofoto"
              indeterminate
              color="primary"
              class="ma-5"
            ></v-progress-circular>

            <div v-show="show_crop">
              <img ref="img_crop" style="height:315px; width:420"/>
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
        </div>        

        <div v-show="show_dibujar">
            <canvas 
                ref="lienzo" 
                width="420" 
                height="315" 
                style="border:1px solid #000000;padding:0;margin:0;max-width:100%"
            ></canvas>
            <br>
                <v-btn
                    color="primary" outline dark
                    @click.native="limpiarCanvas"
                >
                    <v-icon>clear</v-icon>
                    Limpiar
                </v-btn>
                <v-btn
                    color="error" outline dark
                    @click.native="show_dibujar = false"
                >
                    <v-icon>block</v-icon>
                    Cancelar
                </v-btn>
                <v-btn
                    color="success" outline dark
                    @click.native="guardar"
                >
                    <v-icon>save</v-icon>
                    Guardar
                </v-btn>
        </div>

        <v-layout row wrap v-if="edit && !show_dibujar" class="mt-3">
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

            <v-flex md4 xs12>
                <v-btn
                    color="primary"
                    @click.native="show_dibujar = true"
                >
                    <v-icon>border_color</v-icon>
                    Dibujar
                </v-btn>
            </v-flex>
        </v-layout>
    </v-card>
</template>

<script>
import axios from 'axios'
import * as utils from '@/utils'
import Cropper from 'cropperjs'

let cropper;

function isCanvasBlank(canvas) {
    let blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() == blank.toDataURL();
}

export default {
    name: 'AddFirma',
    props: {
        edit: {
            type: Boolean,
            default: false
        },

        url: {
            type: String,
            default: ''
        }
    },

    data() {
        return {
            show_dibujar: false,
            show_recortar: true,
            show_crop: false,
            show_cargandofoto: false,
            cropper: null,            
            pulsado: false,
            movimientos: []
        }
    },

    created: function() {
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
            initialAspectRatio: 4/3,
            aspectRatio: 4/3
        });

        let canvas = this.$refs.lienzo;

        canvas.onmousedown = e => {
            let rect = canvas.getBoundingClientRect(),
                scaleX = canvas.width / rect.width,
                scaleY = canvas.height / rect.height;

            let x =  (e.clientX - rect.left) * scaleX,
                y = (e.clientY - rect.top) * scaleY;

            this.pulsado = true;
            this.movimientos.push([x, y,false]);
            this.repinta();
        };

        canvas.ontouchstart = e => {
            let rect = canvas.getBoundingClientRect(),
                scaleX = canvas.width / rect.width,
                scaleY = canvas.height / rect.height;

            let x =  (e.targetTouches[0].clientX - rect.left) * scaleX,
                y = (e.targetTouches[0].clientY - rect.top) * scaleY;

            e.preventDefault();
            this.pulsado = true;

            this.movimientos.push([x, y, false]);
            this.repinta();
        };

        canvas.onmousemove = e => {
          if (this.pulsado) {
            let rect = canvas.getBoundingClientRect(),
                scaleX = canvas.width / rect.width,
                scaleY = canvas.height / rect.height;

            let x =  (e.clientX - rect.left) * scaleX,
                y = (e.clientY - rect.top) * scaleY;

              this.movimientos.push([x, y, true]);
            this.repinta();
          }
        };

        canvas.ontouchmove = e => {
            let rect = canvas.getBoundingClientRect(),
                scaleX = canvas.width / rect.width,
                scaleY = canvas.height / rect.height;

            let x =  (e.targetTouches[0].clientX - rect.left) * scaleX,
                y = (e.targetTouches[0].clientY - rect.top) * scaleY;

            if (this.pulsado) {
                this.movimientos.push([x, y, true]);
                this.repinta();
            }
        };

        canvas.onmouseup = e => this.pulsado = false;
        canvas.onmouseleave = e => this.pulsado = false;
        canvas.ontouchend = e => this.pulsado = false;
    },

    methods: {
        limpiarCanvas: function() {
            let context = this.$refs.lienzo.getContext("2d");
            context.clearRect(0, 0, this.$refs.lienzo.width, this.$refs.lienzo.height);
            this.movimientos = [];
        },

        reset: function() {
            this.tipo_firma = 'imagen';
            this.limpiarCanvas();
            this.$refs.archivo.value = null;
            this.$refs.img.setAttribute('src', '');
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

        repinta: function() {
            let context = this.$refs.lienzo.getContext("2d");
            context.clearRect(0, 0, this.$refs.lienzo.width, this.$refs.lienzo.height);
            context.strokeStyle = "#000000";
            context.lineJoin = "round";
            context.lineWidth = 2;

            for(var i=0; i < this.movimientos.length; i++) {
                context.beginPath();
                if(this.movimientos[i][2] && i){
                    context.moveTo(this.movimientos[i-1][0], this.movimientos[i-1][1]);
                }else{
                    context.moveTo(this.movimientos[i][0], this.movimientos[i][1]);
                }
                context.lineTo(this.movimientos[i][0], this.movimientos[i][1]);
                context.closePath();
                context.stroke();
            }
        },

        seleccionarArchivo: function() {
            this.$refs.archivo.click();
        },

        guardar: function() {
            let data_uri = this.$refs.lienzo.toDataURL('image/png');
            this.$refs.img.setAttribute('src', data_uri);
            this.tipo_firma = 'imagen';
            this.$emit('change', data_uri);
            this.limpiarCanvas();
            this.show_dibujar = false;

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
            let self = this;
            this.show_cargandofoto = true;
            let input = this.$refs.archivo;

            cropper.getCroppedCanvas().toBlob(blob => {
                let reader = new FileReader();
                reader.readAsDataURL(blob);
                reader.onloadend = function() {
                    let base64data = reader.result;
                    self.$refs.img.setAttribute('src', base64data);
                    self.show_cargandofoto = false;
                    self.show_crop = false;
                    utils.resizeBase64Img(base64data, 420, 315)
                    .then(base64 => self.$emit('change', base64));
                };
            });

            this.show_crop = false;
        },        

    }

}
</script>

<style>

</style>
