<template>
    <v-card class="pa-4 mx-4 elevation-1">
        <v-icon>perm_identity</v-icon>
        <b>Firma:</b>

        <div>
            <img v-show="!show_dibujar" :src="url" ref="img" style="max-width:180px" alt="No hay firma asociada"/>
            <input style="display:none" type="file" ref="archivo" name="firma" id="firma" @change="showImage('firma')">
        </div>

        <div v-show="show_dibujar">
            <canvas ref="lienzo" width="426" height="320" style="border:1px solid #000000;padding:0;margin:0">
            </canvas>
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

        <v-layout row v-if="edit && !show_dibujar" class="mt-3">
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
import * as utils from '@/utils'

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
            pulsado: false,
            movimientos: []
        }
    },

    mounted: function() {
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

        showImage: function() {
            let input = this.$refs.archivo;
            if (input.files && input.files[0]) {
                var reader = new FileReader();
                reader.onload = (e) => {
                    this.$refs.img.setAttribute('src', e.target.result);
                };
                reader.readAsDataURL(input.files[0]);
                this.$emit('change', input.files[0])
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
            let dataURI = this.$refs.lienzo.toDataURL('image/png');
            this.$refs.img.setAttribute('src', dataURI);
            this.tipo_firma = 'imagen';
            this.$emit('change', utils.dataURItoBlob(dataURI));
            this.limpiarCanvas();
            this.show_dibujar = false;

        }

    }

}
</script>

<style>

</style>
