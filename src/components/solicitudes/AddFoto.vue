<template>
    <v-card class="pa-4 mx-4 elevation-1">
        <v-icon>photo_camera</v-icon>
        <b>Foto:</b>
        <br>
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
    </v-card>
</template>

<script>
export default {
    name: 'AddFoto',
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

    methods: {
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
    }

}
</script>

<style>

</style>
