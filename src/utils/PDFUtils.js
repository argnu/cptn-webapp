const jsPDF = require('jspdf');

export function generarCredencial(imgsData, profesional, formacionGrado) {

  const doc = new jsPDF('p', 'mm', [217.5, 304.3]);
  doc.setFontSize(6);
  doc.setFontStyle('bold');

  return doc;
}

export function impresionSolicitud(solicitud) {
  const fechaSolcitud = new Date(solicitud.fecha);

  const doc = new jsPDF('p', 'mm', 'a4');
  const hoy = new Date();

  doc.text('Colegio de Profesionales Técnicos', 120, 20, 'center');
  doc.text('de la Provincia del Neuquén', 120, 26, 'center');
  doc.setLineWidth(1);
  doc.line(20, 40, 190, 40);
  doc.setFontSize(12);
  doc.text(20, 45, 'Solicitud de alta de matricula');
  doc.text(155, 45, 'MATRICULACIÓN');
  doc.line(20, 47, 190, 47);
  doc.setFontSize(10);

  doc.setLineWidth(0.5);
  doc.line(20, 59, 190, 59);

  doc.setFontSize(12);
  doc.text(20, 65, 'Apellido/s:');
  doc.text(20, 71, 'Nombre/s:');
  doc.text(20, 77, 'Documento:');
  doc.text(20, 83, 'Fecha de Nacimiento:');
  doc.text(20, 89, 'Lugar de Nacimiento:');
  doc.text(20, 95, 'Sexo:');
  doc.text(20, 101, 'Nacionalidad:');

  doc.line(20, 105, 190, 105);

  doc.text(20, 111, 'Profesión:');
  doc.text(20, 117, 'Título:');
  doc.text(20, 123, 'Ent. Formadora:');
  doc.text(20, 129, 'Fecha de Egreso:');

  doc.line(20, 135, 190, 135);

  // Domicilios
//   let offsetLoop = 0;
//   solicitud.profesional.domicilios.forEach(domicilio => {
//     doc.setFontSize(14);
//     doc.text(20, 141 + offsetLoop, 'Domicilio ' + domicilio.tipo);
//     doc.line(20, 143 + offsetLoop, 190, 143 + offsetLoop);
//     doc.setFontSize(12);
//     doc.text(20, 148 + offsetLoop, 'Calle:');
//     doc.text(20, 154 + offsetLoop, 'C.P.:');
//     doc.text(20, 160 + offsetLoop, 'País:');
//     doc.text(70, 160 + offsetLoop, 'Provincia:');
//     doc.text(130, 160 + offsetLoop, 'Localidad:');
//     doc.setLineWidth(0.5);
//     doc.line(20, 162 + offsetLoop, 190, 162 + offsetLoop);
//     offsetLoop += 26;
//   });

//   // Contacto
//   doc.setFontSize(14);
//   doc.text(20, 219, 'Información de Contacto');
//   doc.line(20, 220, 190, 220);
//   doc.setFontSize(12);
//   offsetLoop = 0;
//   solicitud.profesional.contactos.forEach(contacto => {
//     doc.text(20, 225 + offsetLoop, contacto.tipo + ':');
//     offsetLoop += 6;
//   });

  // Firmas
  doc.text('..............................................', 50, 265, 'center');
  doc.text('Interesado', 50, 271, 'center');

  doc.text('..............................................', 160, 265, 'center');
  doc.text('Colegio Técnico', 160, 271, 'center');


  // Completado
  doc.setFont('courier');
  doc.text(65, 65, solicitud.entidad.apellido);
  doc.text(65, 71, solicitud.entidad.nombre);
  doc.text(65, 77, 'DNI ' + solicitud.entidad.dni);
  doc.text(65, 83, this.getSimpleFormatedDate(solicitud.entidad.fechaNacimiento));
  doc.text(65, 89, solicitud.entidad.localidadNacimiento);
  doc.text(65, 95, solicitud.entidad.sexo);
  doc.text(65, 101, solicitud.entidad.nacionalidad);

//   doc.text(65, 111, solicitud.entidad.formacionGrado[0].profesion.nombre);
//   doc.text(65, 117, solicitud.entidad.formacionGrado[0].titulo);
//   doc.text(65, 123, solicitud.entidad.formacionGrado[0].entidadFormadora.nombre);
//   doc.text(65, 129, this.getSimpleFormatedDate(solicitud.entidad.formacionGrado[0].fechaTitulo));

//   // completado domicilios
//   offsetLoop = 0;
//   solicitud.entidad.domicilios.forEach(domicilio => {
//     doc.setFontSize(12);
//     doc.text(35, 148 + offsetLoop, domicilio.valor);
//     doc.text(35, 154 + offsetLoop, domicilio.codigoPostal);
//     doc.text(35, 160 + offsetLoop, domicilio.ubicacion.pais.nombre);
//     doc.text(90, 160 + offsetLoop, domicilio.ubicacion.provincia.nombre);
//     doc.text(150, 160 + offsetLoop, domicilio.ubicacion.localidad.nombre);
//     offsetLoop += 26;
//   });

//   // Completado contactos
//   offsetLoop = 0;
//   solicitud.entidad.contactos.forEach(contacto => {
//     doc.text(50, 225 + offsetLoop, contacto.valor);
//     offsetLoop += 6;
//   });

  return doc;

}

function getSimpleFormatedDate(date) {
  const fecha = new Date(date);
  return fecha.getDate() + '/' + (fecha.getMonth() + 1) + '/' + fecha.getFullYear();
}

