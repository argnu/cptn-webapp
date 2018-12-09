export const SelectItem = (text, value) => ({
    text, 
    value: value ? value : text
})

export const roles = [
    SelectItem('Administrador', 'admin'),
    SelectItem('Usuario Sistema CPTN', 'usuario_cptn'),
    SelectItem('Moderador Títulos', 'moderador_titulos')
]

export const tipos_matricula = [
    SelectItem('TECA'),
    SelectItem('TEC-'),
    SelectItem('IDO')
]

export const tipo_entidad = [
    SelectItem('Profesional', 'profesional'),
    SelectItem('Empresa', 'empresa')
]

export const tipo_persona = [
    SelectItem('Física', 'fisica'),
    SelectItem('Jurídica', 'juridica')
]

export const estado_solicitud = [
    SelectItem('Pendiente'),
    SelectItem('Aprobada'),
    SelectItem('Rechazada')
]