<template>
    <v-layout class="my-4">
        <v-flex xs4></v-flex>
        <v-flex xs4>
            <v-card>
                <v-toolbar color="light-blue" dark>
                <v-toolbar-title>Seleccionar Delegación</v-toolbar-title>
                </v-toolbar>
                <v-list>
                <v-list-tile avatar v-for="delegacion in delegaciones" :key="delegacion.id" @click="select(delegacion.id)">
                    <v-list-tile-avatar>
                    <v-icon>location_city</v-icon>
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                    <v-list-tile-title>{{ delegacion.nombre }}</v-list-tile-title>
                    </v-list-tile-content>
                    <v-list-tile-action>
                    <v-btn icon ripple>
                        <v-icon color="grey lighten-1">account_circle</v-icon>
                    </v-btn>
                    </v-list-tile-action>
                </v-list-tile>
                </v-list>
            </v-card>                        
        </v-flex>
        <v-flex xs4></v-flex>
    </v-layout>
</template>

<script>
import axios from '@/axios'
import Store from '@/Store'

export default {
    name: 'DelegacionSeleccion',
    data() {
        return {
            global_state: Store.state,
            delegaciones: []
        }
    },

    created: function() {
        axios.get(`/usuarios/${this.global_state.user.id}/delegaciones`)
        .then(r => this.delegaciones = r.data)
        .catch(e => console.error(e));
    },

    methods: {
        select: function(delegacion) {
            Store.setDelegacion(delegacion);
            this.$router.push({ path: '/matriculas/lista' })
        }
    }
}
</script>

<style>

</style>
