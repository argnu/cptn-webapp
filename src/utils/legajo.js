export function getTipoLegajo(i) {
    const tipos_legajos = ['Permiso de Construcción', 'Orden de Trabajo', 'Legajo Técnico'];
    return i ? tipos_legajos[i-1] : '';
}