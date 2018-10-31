export { Subsidiario, Formacion, Profesional } from '@/model/Profesional';
export { Contacto, Telefono } from '@/model/Contacto';
export { Domicilio } from '@/model/Domicilio';
export { Empresa } from '@/model/Empresa';
export { Entidad, EntidadCondicionAfip } from '@/model/Entidad';
export { Solicitud } from '@/model/Solicitud';
export { Matricula } from '@/model/Matricula';
export { Comitente, Persona, PersonaJuridica, PersonaFisica } from '@/model/Persona';

export const ColumnHeader = (text, value, sortable, align, width) => ({
    text, 
    value, 
    sortable: sortable === true, 
    align: align || 'left',
    width: width || null
})