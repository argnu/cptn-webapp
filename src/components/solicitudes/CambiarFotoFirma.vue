<template>
<v-container ref="main">
    <v-layout row wrap class="mt-4">
        <v-flex md6 xs12>
            <v-card class="pa-4 mx-4 elevation-1">
                <v-icon>photo_camera</v-icon>
                <b>Foto:</b>
                <br>
                <img 
                    ref="img_foto" 
                    :src="url_foto" 
                    alt="" 
                    style="max-width:180px"
                />
                <br><br>
                <v-icon>add_a_photo</v-icon>
                <b>Cambiar:</b> 
                <input type="file" ref="archivo_foto" name="foto" id="foto" @change="showImage('foto')">
            </v-card>            
        </v-flex>

        <v-flex md6 xs12>
            <v-card class="pa-4 mx-4 elevation-1">
                <v-icon>perm_identity</v-icon>
                <b>Firma:</b>                

                <v-radio-group v-model="tipo_firma" row>
                    <v-radio label="Imagen" value="imagen" ></v-radio>
                    <v-radio label="Dibujar" value="dibujar"></v-radio>
                </v-radio-group>

                <div v-show="tipo_firma == 'imagen'">
                        <img
                            :src="url_firma"  
                            ref="img_firma" 
                            alt="" 
                            style="max-width:180px"
                        />
                        <br><br>
                        <v-icon>person_add</v-icon>
                        <b>Cambiar:</b> 
                        <input type="file" ref="archivo_firma" name="firma" id="firma" @change="showImage('firma')">
                </div>

                <div v-show="tipo_firma == 'dibujar'">
                    <canvas ref="lienzo" width="300" height="200" style="border:1px solid #000000;padding:0;margin:0">
                    </canvas>
                    <br>
                        <v-btn
                        outline
                        color="blue-grey"
                        dark
                        @click.native="limpiarCanvas"
                        >
                            <v-icon>clear</v-icon>
                            Limpiar
                        </v-btn>
                </div>
            </v-card>
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
import * as utils from '@/utils'
import Store from '@/stores/Global'

let pulsado = false;
let movimientos = [];

function repinta(canvas) {
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#000000";
    context.lineJoin = "round";
    context.lineWidth = 2;

    for(var i=0; i < movimientos.length; i++) {
        context.beginPath();
        if(movimientos[i][2] && i){
        context.moveTo(movimientos[i-1][0], movimientos[i-1][1]);
        }else{
        context.moveTo(movimientos[i][0], movimientos[i][1]);
        }
        context.lineTo(movimientos[i][0], movimientos[i][1]);
        context.closePath();
        context.stroke();
    }
}

function clearCanvas(canvas) {
    let context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    movimientos = [];
}

function isCanvasBlank(canvas) {
    let blank = document.createElement('canvas');
    blank.width = canvas.width;
    blank.height = canvas.height;
    return canvas.toDataURL() == blank.toDataURL();
}

export default {
    name: 'CambiarFotoFirma',
    props: ['profesional'],

    data() {
        return {
            global_state: Store.state,
            tipo_firma: 'imagen',
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

    mounted: function() {
        let canvas = this.$refs.lienzo;

        canvas.onmousedown = e => {
          let rect = canvas.getBoundingClientRect();
          pulsado = true;
          movimientos.push([e.pageX - rect.left,
              e.pageY - rect.top,
              false]);

          repinta(canvas);
        };

        canvas.ontouchstart = e => {
            let rect = canvas.getBoundingClientRect(), 
                scaleX = canvas.width / rect.width,    
                scaleY = canvas.height / rect.height;

            let x =  (e.targetTouches[0].clientX - rect.left) * scaleX,   
                y = (e.targetTouches[0].clientY - rect.top) * scaleY;

            e.preventDefault();
            pulsado = true;

            movimientos.push([x, y, false]);
            repinta(canvas);
        };

        canvas.onmousemove = e => {
          if (pulsado) {
            let rect = canvas.getBoundingClientRect();
              movimientos.push([e.pageX - rect.left,
                  e.pageY - rect.top,
                  true]);
            repinta(canvas);
          }
        };

        canvas.ontouchmove = e => {
            let rect = canvas.getBoundingClientRect(), 
                scaleX = canvas.width / rect.width,    
                scaleY = canvas.height / rect.height;

            let x =  (e.targetTouches[0].clientX - rect.left) * scaleX,   
                y = (e.targetTouches[0].clientY - rect.top) * scaleY;
                
            if (pulsado) {
                movimientos.push([x, y, true]);
                repinta(canvas);
            }
        };

        canvas.onmouseup = e => pulsado = false;
        canvas.onmouseleave = e => pulsado = false;
        canvas.ontouchend = e => pulsado = false;
    },

    methods: {
        limpiarCanvas: function() {
            clearCanvas(this.$refs.lienzo);
        },

        reset: function() {
            clearCanvas(this.$refs.lienzo);
            this.tipo_firma = 'imagen';
            this.$refs.archivo_foto.value = null;
            this.$refs.archivo_firma.value = null;
            this.$refs.img_foto.setAttribute('src', '');
            this.$refs.img_firma.setAttribute('src', '');
        },

        cerrar: function () {
            this.$emit('cerrar');
        },

        guardar: function() {
            let proms = [];
            let form_data;
            if (this.$refs.archivo_foto.files[0]) {
                form_data = new FormData();
                form_data.append('foto', this.$refs.archivo_foto.files[0]);
                proms.push(axios.put(`/profesionales/${this.profesional.id}/foto`, form_data));
            }

            if (this.tipo_firma == 'imagen' && this.$refs.archivo_firma.files[0]) {
                form_data = new FormData();
                form_data.append('firma', this.$refs.archivo_firma.files[0]);
                proms.push(axios.put(`/profesionales/${this.profesional.id}/firma`, form_data));
            }
            else if (this.tipo_firma == 'dibujar' && !isCanvasBlank(this.$refs.lienzo)){
                form_data = new FormData();
                form_data.append('firma', utils.dataURItoBlob(this.$refs.lienzo.toDataURL()));
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

        showImage: function(tipo) {
            let ref = `archivo_${tipo}`;
            let input = this.$refs[ref];
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    let ref = `img_${tipo}`;
                    this.$refs[ref].setAttribute('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
            }
        },
    }

}
</script>

<style>

</style>
