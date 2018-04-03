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
                style="max-width:180px"
            />
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

<script>
import * as utils from '@/utils'

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
            show_error: false
        }
    },

    created: function() {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia 
            || navigator.msGetUserMedia || navigator.oGetUserMedia;
        
        if (navigator.getUserMedia) navigator.getUserMedia({video: true}, this.handleVideo, this.videoError);
    },

    methods: {
        handleVideo: function(stream) {
            this.$refs.video_elem.src = window.URL.createObjectURL(stream);
        },

        videoError: function() {
            this.show_error = true;
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

        reset: function() {
            this.$refs.archivo.value = null;
            this.$refs.img.setAttribute('src', '');
        },

        capturarFoto: function() {
            let canvas = document.createElement('canvas');
            canvas.width = 480;
            canvas.height = 480;

            let context = canvas.getContext('2d');      
            context.drawImage(this.$refs.video_elem, 0, 0, canvas.width, canvas.height);

            let dataURI = canvas.toDataURL('image/png');
            this.$refs.img.setAttribute('src', dataURI);     
            this.tipo_foto = 'imagen';
            this.$emit('change', utils.dataURItoBlob(dataURI));
        }
    }

}
</script>

<style scoped>
#video-elem {
    max-width: 100%;
    height: 350px;
    background-color: #666;
}
</style>
