const jsPDF = require('jspdf');

export function generarCredencial(imgsData, profesional, formacionGrado) {
  const doc = new jsPDF('p', 'mm', [217.5, 304.3]);
  doc.setFontSize(6);
  doc.setFontStyle('bold');
  return doc;
}

export function impresionVolante(volante) {
  const doc = new jsPDF('p', 'mm', 'a4');
  //doc.addImage(, 10, 10, 28, 28);
  doc.text('Colegio de Profesionales Técnicos', 120, 20, 'center');
  doc.text('de la Provincia del Neuquén', 120, 26, 'center');
  doc.setLineWidth(0.5);
  doc.setFontSize(12);
  doc.text(120, 45, 'Fecha de Emision');
  doc.text(160, 45, getSimpleFormatedDate(volante.fecha));
  doc.text(120, 50, 'Fecha Expiración ');
  doc.text(160, 50, getSimpleFormatedDate(volante.fecha_vencimiento));
  doc.setFontSize(10);
  // doc.text(20, 45, `N° Matricula ${volante.matricula.numero}`);
  // doc.text(20, 50, `Nombre ${volante.matricula.nombre}`);
  // doc.text(20, 55, `Apellido ${volante.matricula.apellido}`);
  return doc;
}

export function impresionSolicitud(solicitud) {
  const doc = new jsPDF('p', 'mm', 'a4');
  //doc.addImage(, 10, 10, 28, 28);
  doc.text('Colegio de Profesionales Técnicos', 120, 20, 'center');
  doc.text('de la Provincia del Neuquén', 120, 26, 'center');
  doc.setLineWidth(1);

  doc.line(20, 40, 190, 40);
  doc.setFontSize(12);
  doc.text(20, 45, 'Solicitud de alta de matricula');
  doc.text(155, 45, 'MATRICULACIÓN');
  doc.line(20, 47, 190, 47);
  doc.setFontSize(10);

  doc.text(20, 55, 'Fecha de Solicitud');
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

  // Domicilios Real 

  let offsetLoop = 0;
  doc.setFontSize(14);
  doc.text(20, 141 + offsetLoop, 'Domicilio Real');
  doc.line(20, 143 + offsetLoop, 190, 143 + offsetLoop);
  doc.setFontSize(12);
  doc.text(20, 148 + offsetLoop, 'Calle:');
  doc.text(20, 154 + offsetLoop, 'País:');
  doc.text(120, 154 + offsetLoop, 'Provincia:');
  doc.text(20, 160 + offsetLoop, 'Departamento:');
  doc.text(120, 160 + offsetLoop, 'Localidad:');
  doc.setLineWidth(0.5);
  doc.line(20, 162 + offsetLoop, 190, 162 + offsetLoop);
  offsetLoop += 26;

  // Domicilios Profesional
  doc.text(20, 141 + offsetLoop, 'Domicilio Profesional');
  doc.line(20, 143 + offsetLoop, 190, 143 + offsetLoop);
  doc.setFontSize(12);
  doc.text(20, 148 + offsetLoop, 'Calle:');
  doc.text(20, 154 + offsetLoop, 'País:');
  doc.text(120, 154 + offsetLoop, 'Provincia:');
  doc.text(20, 160 + offsetLoop, 'Departamento:');
  doc.text(120, 160 + offsetLoop, 'Localidad:');
  doc.setLineWidth(0.5);
  doc.line(20, 162 + offsetLoop, 190, 162 + offsetLoop);
  offsetLoop += 26;

  doc.text(20, 141 + offsetLoop, 'Domicilio Constituido');
  doc.line(20, 143 + offsetLoop, 190, 143 + offsetLoop);
  doc.setFontSize(12);
  doc.text(20, 148 + offsetLoop, 'Calle:');
  doc.text(20, 154 + offsetLoop, 'País:');
  doc.text(120, 154 + offsetLoop, 'Provincia:');
  doc.text(20, 160 + offsetLoop, 'Departamento:');
  doc.text(120, 160 + offsetLoop, 'Localidad:');
  doc.setLineWidth(0.5);
  doc.line(20, 162 + offsetLoop, 190, 162 + offsetLoop);
  offsetLoop += 26;
   

  //   // Contacto
  doc.setFontSize(14);
  doc.text(20, 220, 'Información de Contacto');
  doc.line(20, 221, 190, 221);
  doc.setFontSize(12);
  offsetLoop = 0;
  solicitud.entidad.contactos.forEach(contacto => {
      doc.text(20, 230 + offsetLoop, `${contacto.tipo}: ${contacto.valor}` );
      offsetLoop += 6;
    });

  // Firmas
  doc.text('..............................................', 50, 265, 'center');
  doc.text('Interesado', 50, 271, 'center');

  doc.text('..............................................', 160, 265, 'center');
  doc.text('Colegio Técnico', 160, 271, 'center');


  // Completado
  doc.setFont('courier');
  doc.text(65, 55, getSimpleFormatedDate(solicitud.fecha));
  doc.text(65, 65, solicitud.entidad.apellido);
  doc.text(65, 71, solicitud.entidad.nombre);
  doc.text(65, 77, 'DNI ' + solicitud.entidad.dni);
  doc.text(65, 83, getSimpleFormatedDate(solicitud.entidad.fechaNacimiento));
  // doc.text(65, 89, solicitud.entidad.lugarNacimiento);
  doc.text(65, 95, solicitud.entidad.sexo);
  doc.text(65, 101, solicitud.entidad.nacionalidad);

  //   doc.text(65, 111, solicitud.entidad.formacionGrado[0].profesion.nombre);
  //   doc.text(65, 117, solicitud.entidad.formacionGrado[0].titulo);
  //   doc.text(65, 123, solicitud.entidad.formacionGrado[0].entidadFormadora.nombre);
  //   doc.text(65, 129, this.getSimpleFormatedDate(solicitud.entidad.formacionGrado[0].fechaTitulo));

  //   // completado domicilios
  offsetLoop = 0;
  doc.setFontSize(12);
  doc.text(35, 148 + offsetLoop, `${solicitud.entidad.domicilioReal.calle} ${solicitud.entidad.domicilioReal.numero}`);
  doc.text(35, 154 + offsetLoop, solicitud.entidad.domicilioReal.pais);
  doc.text(140, 154 + offsetLoop, solicitud.entidad.domicilioReal.provincia);
  doc.text(50, 160 + offsetLoop, solicitud.entidad.domicilioReal.departamento);
  doc.text(140, 160 + offsetLoop, solicitud.entidad.domicilioReal.localidad);
  offsetLoop += 26;

  if (solicitud.entidad.domicilioProfesional) {
    doc.text(35, 148 + offsetLoop, `${solicitud.entidad.domicilioProfesional.calle} ${solicitud.entidad.domicilioProfesional.numero}`);
    doc.text(35, 154 + offsetLoop, solicitud.entidad.domicilioProfesional.pais);
    doc.text(140, 154 + offsetLoop, solicitud.entidad.domicilioProfesional.provincia);
    doc.text(50, 160 + offsetLoop, solicitud.entidad.domicilioProfesional.departamento);
    doc.text(140, 160 + offsetLoop, solicitud.entidad.domicilioProfesional.localidad);
    offsetLoop += 26;
  }

  if (solicitud.entidad.domicilioConstituido) {
    doc.text(35, 148 + offsetLoop, `${solicitud.entidad.domicilioConstituido.calle} ${solicitud.entidad.domicilioConstituido.numero}`);
    doc.text(35, 154 + offsetLoop, solicitud.entidad.domicilioConstituido.pais);
    doc.text(140, 154 + offsetLoop, solicitud.entidad.domicilioConstituido.provincia);
    doc.text(50, 160 + offsetLoop, solicitud.entidad.domicilioConstituido.departamento);
    doc.text(140, 160 + offsetLoop, solicitud.entidad.domicilioConstituido.localidad);
    offsetLoop += 26;
  }


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
