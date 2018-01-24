<template>
    <v-card class="pa-4 mx-4 elevation-1">
        <v-icon>perm_identity</v-icon>
        <b>Firma:</b>                

        <v-radio-group v-model="tipo_firma" row>
            <v-radio label="Imagen" value="imagen" ></v-radio>
            <v-radio label="Dibujar" value="dibujar"></v-radio>
        </v-radio-group>

        <div v-show="tipo_firma == 'imagen'">
                <img
                    :src="url"  
                    ref="img" 
                    alt="" 
                    style="max-width:180px"
                />
                <br><br>
                <v-icon>person_add</v-icon>
                <b>Cambiar:</b> 
                <input type="file" ref="archivo" name="firma" id="firma" @change="showImage('firma')">
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
</template>

<script>
import * as utils from '@/utils'

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
            tipo_firma: 'imagen',
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

            pulsado = true;
            movimientos.push([x, y,false]);
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
            let rect = canvas.getBoundingClientRect(), 
                scaleX = canvas.width / rect.width,    
                scaleY = canvas.height / rect.height;

            let x =  (e.clientX - rect.left) * scaleX,   
                y = (e.clientY - rect.top) * scaleY;

              movimientos.push([x, y, true]);
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

        canvas.onmouseup = e => {
            pulsado = false;
            this.$emit('change', utils.dataURItoBlob(this.$refs.lienzo.toDataURL()))
        };

        canvas.onmouseleave = e => {
            pulsado = false;
            this.$emit('change', utils.dataURItoBlob(this.$refs.lienzo.toDataURL()))
        };

        canvas.ontouchend = e => {
            pulsado = false;
            this.$emit('change', utils.dataURItoBlob(this.$refs.lienzo.toDataURL()))
        };
    },        

    methods: {
        limpiarCanvas: function() {
            clearCanvas(this.$refs.lienzo);
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
    }

}
</script>

<style>

</style>
