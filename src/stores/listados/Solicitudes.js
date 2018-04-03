import { StoreLista } from './Lista'

class StoreListaSolicitud extends StoreLista {
  constructor(filtros) {
    super(filtros);
  }

  limpiarFiltros() {
    super.limpiarFiltros();
    this.state.filtros.tipoEntidad = 'profesional';
  }  
}

export default new StoreListaSolicitud({
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