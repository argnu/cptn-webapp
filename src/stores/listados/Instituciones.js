export default {
  state: {
      pagination: {
        page: 1,
        rowsPerPage: 25,
        descending: null,
        sortBy: null
      },

      filtros: {
        nombre: '',
        cue: ''
      }
  },

  setPagination(pagination){
    this.state.pagination = pagination;
  },

  setFiltros(filtros) {
    this.state.filtros = filtros;
  },

  limpiarFiltros() {
    this.state.filtros.nombre = '';
    this.state.filtros.cue = '';
  }
}


