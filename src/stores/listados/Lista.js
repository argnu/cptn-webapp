import Pagination from '@/model/Pagination'

export class StoreLista {
    constructor(filtros) {
        this.state = {
            pagination: Pagination(25),
            filtros: filtros ? filtros : {}
        };
    }

    setPagination(pagination) {
        this.state.pagination = pagination;
    }

    setFiltros(filtros) {
        this.state.filtros = filtros;
    }

    limpiarFiltros() {
        for(let filtro in this.state.filtros) {
            if (typeof this.state.filtros[filtro] == 'object') {
                for(let att in this.state.filtros[filtro]) {
                    this.state.filtros[filtro][att] = '';
                }
            }
            else
                this.state.filtros[filtro] = '';
        }
    }
}