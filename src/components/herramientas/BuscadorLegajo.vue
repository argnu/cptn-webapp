<template>
<v-container class="grey lighten-3">
  <v-toolbar class="darken-3" color="primary">
    <v-toolbar-title class="white--text">Búsqueda de Legajos</v-toolbar-title>
    <v-spacer></v-spacer>
  </v-toolbar>

  <legajo-lista
    :show-add="false"
    all-filters
  ></legajo-lista>

</v-container>    
</template>

<script>
import LegajoLista from '@/components/matriculas/legajos/LegajoLista'

export default {
    name: 'BuscadorLegajo',

    components: {
        LegajoLista
    }

}
</script>

<style>

</style>
