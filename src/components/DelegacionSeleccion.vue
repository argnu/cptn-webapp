<template>
    <v-layout class="my-4">
        <v-flex xs10 offset-xs1 md4 offset-md4>
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
import * as Cookies from 'js-cookie'
import Store from '@/stores/Global'

export default {
    name: 'DelegacionSeleccion',
    data() {
        return {
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
            Cookies.set('CPTNDelegacion', delegacion);
            this.$router.push({ path: '/matriculas/lista' })
        }
    }
}
</script>

<style>

</style>
