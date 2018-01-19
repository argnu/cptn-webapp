export { Beneficiario, Subsidiario, Formacion, Profesiona } from '@/model/Profesional';
export { Contacto, Telefono } from '@/model/Contacto';
export { Domicilio } from '@/model/Domicilio';
export { Empresa } from '@/model/Empresa';
export { Entidad } from '@/model/Entidad';
export { Solicitud } from '@/model/Solicitud';
export { Matricula } from '@/model/Matricula';
export { Comitente, Persona, PersonaJuridica, PersonaFisica } from '@/model/Persona';

export const Header = (text, value) => ({
    text, value, sortable: false
})
