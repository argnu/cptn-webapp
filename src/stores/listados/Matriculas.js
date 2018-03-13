import { StoreLista } from './Lista'

class StoreListaMatricula extends StoreLista {
  constructor(filtros) {
    super(filtros);
  }

  limpiarFiltros() {
    super.limpiarFiltros();
    this.state.filtros.tipoEntidad = 'profesional';
  }  
}

export default new StoreListaMatricula({
  tipoEntidad: 'profesional',
  estado: '',
  numero: '',
  profesional: {
    dni: '',
    apellido: ''
  },
  empresa: {
    nombre: ''
  }
});