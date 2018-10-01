export class Usuario {
    constructor() {
        this.username = '';
        this.nombre = '';
        this.apellido = '';
        this.email = '';
        this.password = '';
        this.password_re = '';
        this.delegaciones = [];
        this.rol = '';
    }
}

export const roles = [
    { text: 'Administrador', value: 'admin' },
    { text: 'Usuario Sistema CPTN', value: 'usuario_cptn' },
    { text: 'Moderador Títulos', value: 'moderador_titulos' }
]