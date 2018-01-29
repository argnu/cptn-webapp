export default {
  state: {
      pagination: {
        page: 1,
        rowsPerPage: 25,
        descending: null,
        sortBy: null        
      },

      filtros: {
        estado: null,
        tipoEntidad: 'profesional',
        numero: '',
        profesional: {
          dni: '',
          apellido: ''
        },
        empresa: {
          nombre: ''
        }
      },
  },

  setPagination(pagination){
    this.state.pagination = pagination;
  },

  setFiltros(filtros) {
    this.state.filtros = filtros;
  },

  limpiarFiltros() {
    this.state.filtros.estado = null;
    this.state.filtros.tipoEntidad = 'profesional';
    this.state.filtros.numero = '';
    this.state.filtros.profesional.dni = '';
    this.state.filtros.profesional.apellido = '';
    this.state.filtros.empresa.nombre = '';
  }  
}

