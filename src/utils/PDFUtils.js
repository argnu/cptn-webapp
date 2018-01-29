import * as jsPDF from 'jspdf'
import * as moment from 'moment'
import {
  getTipoLegajo
} from '@/utils/legajo'

const img = new Image();
img.src = "/static/logoImpresion.jpg";

const emptyIfNull = x => x ? x : '';

export function impresionVolante(volante) {
  const doc = new jsPDF('p', 'mm', 'a4');
  doc.addImage(img, 'JPG', 10, 10, 60, 13);
  // doc.text('Colegio de Profesionales Técnicos', 120, 20, 'center');
  // doc.text('de la Provincia del Neuquén', 120, 26, 'center');
  doc.setLineWidth(0.5);
  doc.line(20, 43, 190, 43);
  doc.setFontSize(12);
  doc.text(24, 40, `Volante de Pago N° ${volante.id}`);
  doc.text(120, 50, 'Fecha de Emision');
  doc.text(160, 50, moment(volante.fecha).format('DD/MM/YYYY'));
  doc.text(120, 55, 'Fecha Expiración ');
  doc.text(160, 55, moment(volante.fecha_vencimiento).format('DD/MM/YYYY'));
  doc.setFontSize(10);
  doc.text(24, 50, `N° Matricula  ${volante.matricula.numeroMatricula}`);
  doc.text(24, 55, `Nombre   ${volante.matricula.entidad.nombre}`);
  doc.text(24, 60, `Apellido  ${volante.matricula.entidad.apellido}`);
  doc.setLineWidth(0.5);

  // Se suman los intereses de las boletas
  let offsetLoop = 0;
  volante.boletas.forEach(b => {
    if (b.items && b.items.length) {
      b.items.forEach(item => {
        doc.text(24, 75 + offsetLoop, `${item.descripcion}`);
        doc.text(160, 75 + offsetLoop, `${item.importe}`);
        offsetLoop += 2;
      })
    }
    offsetLoop += 2;
  })

  let indice = 75 + offsetLoop;
  // Se imprime el interes
  if (volante.interes_total) {
    doc.text(24, indice, `Intereses`);
    doc.text(160, indice, `${volante.interes_total}`);
  }
  indice += 10;
  doc.line(20, indice, 190, indice);
  doc.setFontSize(12);
  indice += 5;
  doc.text(110, indice, `TOTAL A PAGAR`);
  doc.text(160, indice, `${volante.importe_total}`);
  doc.line(20, indice + 5, 190, indice + 5);




  return doc;
}



export function impresionSolicitud(solicitud) {
  const doc = new jsPDF('p', 'mm', 'a4');
  doc.addImage(img, 'JPG', 10, 10, 60, 13);
  doc.setLineWidth(1);

  doc.line(20, 25, 190, 25);
  doc.setFontSize(12);
  doc.text(20, 30,  `Solicitud de alta de matricula N° ${solicitud.numero}` );
  doc.line(20, 32, 190, 32);
  doc.setFontSize(10);

  let eje_y = 40;

  doc.setFontSize(12);

  if (solicitud.entidad.tipo == 'profesional') {
    doc.text(20, eje_y, 'Apellido/s y Nombre/s:');
    eje_y += 6;
    doc.text(20, eje_y, 'DNI:');
    doc.text(60, eje_y, 'Sexo:');
    eje_y += 6;
    doc.text(20, eje_y, 'Fecha de Nacimiento:');
    eje_y += 6;
    doc.text(20, eje_y, `Lugar de Nacimiento: ${solicitud.entidad.lugarNacimiento ? solicitud.entidad.lugarNacimiento: ''}   Nacionalidad: ${solicitud.entidad.nacionalidad ? solicitud.entidad.nacionalidad : ''}`);
    // doc.text(65, eje_y, solicitud.entidad.lugarNacimiento ? solicitud.entidad.lugarNacimiento: '');
    // doc.text(65, eje_y, solicitud.entidad.nacionalidad ? solicitud.entidad.nacionalidad : '');

    //doc.text(20, eje_y, 'Nacionalidad:');
    eje_y += 6;

    doc.line(20, eje_y, 190, eje_y);
    eje_y += 6;
    // doc.text(20, 111, 'Profesión:');
    doc.text(20, eje_y, 'Título:');
    doc.text(20, eje_y + 6, 'Expedido por:');
    doc.text(20, eje_y + 12, 'Fecha:');
    let formacion_grado = solicitud.entidad.formaciones.find(f => f.tipo == 'Grado');
    if (formacion_grado) {
      // doc.text(65, 111, solicitud.entidad.formaciones[0].profesion);
      doc.text(60, eje_y, formacion_grado.titulo);
      doc.text(60, eje_y + 6, formacion_grado.institucion);
      doc.text(60, eje_y + 12, formacion_grado.fecha ? moment(formacion_grado.fecha).format('DD/MM/YYYY') : '');
    }
    eje_y += 18;
  }


  if (solicitud.entidad.tipo == 'empresa') {
    doc.text(20, eje_y, 'Nombre:');
    eje_y += 6;
    doc.text(20, eje_y, 'CUIT:');
    eje_y += 6;
    doc.text(20, eje_y, 'Tipo de Empresa:');
    eje_y += 6;
    doc.text(20, eje_y, 'Tipo de Sociedad:');
    eje_y += 6;
    doc.text(20, eje_y, 'Fecha de Constitución:');
    eje_y += 6;
    doc.text(20, eje_y, 'Fecha de Inicio de Act.:');
    eje_y += 6;
    doc.text(20, eje_y, 'Situación AFIP:');
    eje_y += 6;

  }
  doc.line(20, eje_y, 190, eje_y);
  eje_y += 6;

  // Domicilios Real
  doc.setFontSize(12);
  doc.text(20, eje_y, 'Domicilio Real');
  eje_y += 6;

  let eje_y_domicilio = eje_y;
  doc.text(20, eje_y, 'País:');
  doc.text(100, eje_y, 'Provincia:');
  eje_y += 6;
  doc.text(20, eje_y, 'Departamento:');
  doc.text(100, eje_y, 'Localidad:');
  eje_y += 6;

  doc.setLineWidth(0.5);
  doc.line(20, eje_y, 190, eje_y);

  eje_y += 6;


  // Domicilios Profesional
  doc.text(20, eje_y, 'Domicilio Legal');
  eje_y += 6;
  doc.text(20, eje_y, 'País:');
  doc.text(100, eje_y, 'Provincia:');
  eje_y += 6;
  doc.text(20, eje_y, 'Departamento:');
  doc.text(100, eje_y, 'Localidad:');
  eje_y += 6;

  doc.setLineWidth(0.2);
  doc.line(20, eje_y, 190, eje_y);

  eje_y += 6;

  doc.text(20, eje_y, 'Domicilio Especial');
  eje_y += 6;
  doc.text(20, eje_y, 'País:');
  doc.text(100, eje_y, 'Provincia:');
  eje_y += 6;
  doc.text(20, eje_y, 'Departamento:');
  doc.text(100, eje_y, 'Localidad:');
  eje_y += 4;

  doc.setLineWidth(0.2);
  doc.line(20, eje_y, 190, eje_y);
  eje_y += 6;


  // Contacto
  doc.setFontSize(12);
  doc.text(20, eje_y, 'Información de Contacto');
  eje_y += 4;
  doc.line(20, eje_y, 190, eje_y);
  eje_y += 4;
  doc.setFontSize(10);  
  solicitud.entidad.contactos.forEach(contacto => {
    doc.text(20, eje_y, `${contacto.tipo}: ${contacto.valor}`);
    eje_y += 5;
  });
  doc.setFontSize(12);  


  if (solicitud.entidad.tipo == 'empresa') {
    eje_y += 6;
    // RESPONSABLES
    doc.setFontSize(14);
    doc.text(20, eje_y, 'Representantes Técnicos');
    eje_y += 6;
    doc.line(20, eje_y, 190, eje_y);
    eje_y += 6;
    doc.setFontSize(12);
    solicitud.entidad.representantes.forEach(representante => {
      doc.text(20, eje_y, `${representante.numeroMatricula} - ${representante.nombre} ${representante.apellido}`);
      eje_y += 6;
    });
  }

  if (solicitud.entidad.tipo == 'profesional') {
    doc.line(20, eje_y, 190, eje_y);
    eje_y += 6;
    doc.text(20, eje_y, 'Situación AFIP: ');
    doc.text(50, eje_y, solicitud.entidad.condafip);
    doc.text(120, eje_y, 'CUIT/CUIL: ');
    doc.text(145, eje_y, solicitud.entidad.cuit);
    //Se muestran los datos de los subsidiarios
    eje_y += 3;
    doc.line(20, eje_y, 190, eje_y);
    eje_y += 6;
    doc.text(20, eje_y, 'Beneficiarios del subsidio');
    eje_y += 6;
    doc.text(20, eje_y, 'Apellido');
    doc.text(80, eje_y, 'Nombre');
    doc.text(150, eje_y, 'Dni');
    doc.text(170, eje_y, 'Porcentaje');
    eje_y += 6;
    doc.setFontSize(10);
    solicitud.entidad.subsidiarios.forEach(subsidiario => {
      doc.text(20, eje_y, `${subsidiario.apellido}`);
      doc.text(80, eje_y, `${subsidiario.nombre}`);
      doc.text(150, eje_y, `${subsidiario.dni}`);
      doc.text(180, eje_y, `${subsidiario.porcentaje} %`);
      eje_y += 6;
    });
    doc.setFontSize(12);
  }

  eje_y += 5;
  doc.setFontSize(14);
  doc.text(20, eje_y, 'Declaración Jurada');
  doc.setFontSize(10);
  eje_y += 5;
  doc.text(20, eje_y, 'Declaro bajo juramento que no he desarrollado actividades dentro del territorio de la Provincia de Neuquén,');
  eje_y += 3;  
  doc.text(20,eje_y,'previo a la fecha de inscripción. Se efectúa la presente Declaración Jurada a los fines de no abonar las multas');
  eje_y += 3;  
  doc.text(20, eje_y, 'y recargos impuestos por el Colegio Profesional de Técnicos de Neuquén.')
  // Firmas
  eje_y += 8;
  doc.text(20, eje_y,'A ser completados únicamente por el personal del Colegio Profesional');
  eje_y += 5;
  doc.text(20, eje_y,'Número de Acta: ');
  doc.text(110, eje_y,'Fecha de Acta: ');
  eje_y += 5;
  doc.text(20, eje_y,'Matricula: ');
  doc.text(110, eje_y,'Fecha: ');
  eje_y += 15;
  doc.text(20, eje_y, '............................................................',);
  doc.text(25, eje_y + 6, 'Firma y aclaración del solicitante');
  doc.text(95, eje_y, '.....................................');
  doc.text(100, eje_y + 6 ,'Verificó originales');
  doc.text('..................................', 180, eje_y, 'center');
  doc.text('Firma del autorizante', 180, eje_y + 6, 'center');



  // Completado
  doc.setFont('courier');
  doc.text(155, 30, moment(solicitud.fecha).format('DD/MM/YYYY'));

  eje_y = 40;

  if (solicitud.entidad.tipo == 'profesional') {
    doc.text(65, eje_y, `${solicitud.entidad.apellido} ${solicitud.entidad.nombre}`);
    eje_y += 6;
    doc.text(30, eje_y, solicitud.entidad.dni);
    doc.text(75, eje_y, solicitud.entidad.sexo);
    eje_y += 6;
    doc.text(65, eje_y, moment(solicitud.entidad.fechaNacimiento).format('DD/MM/YYYY'));
    eje_y += 6;
    //doc.text(65, eje_y, solicitud.entidad.lugarNacimiento ? solicitud.entidad.lugarNacimiento: '');
    //doc.text(65, eje_y, solicitud.entidad.nacionalidad ? solicitud.entidad.nacionalidad : '');
    // eje_y += 6;
  }

  if (solicitud.entidad.tipo == 'empresa') {
    doc.text(65, eje_y, solicitud.entidad.nombre);
    eje_y += 6;
    doc.text(65, eje_y, solicitud.entidad.cuit);
    eje_y += 6;
    doc.text(65, eje_y, solicitud.entidad.tipoEmpresa);
    eje_y += 6;
    doc.text(65, eje_y, solicitud.entidad.tipoSociedad);
    eje_y += 6;
    doc.text(65, eje_y, solicitud.entidad.fechaConstitucion ? moment(solicitud.entidad.fechaConstitucion).format('DD/MM/YYYY') : '');
    eje_y += 6;
    doc.text(65, eje_y, solicitud.entidad.fechaInicio ? moment(solicitud.entidad.fechaInicio).format('DD/MM/YYYY') : '');
    eje_y += 6;
    doc.text(65, eje_y, solicitud.entidad.condafip);
    eje_y += 6;
  }

  // completado domicilios
  let domicilioReal = solicitud.entidad.domicilios.find(d => d.tipo == 'real');
  let domicilioLegal = solicitud.entidad.domicilios.find(d => d.tipo == 'legal');
  let domicilioEspecial = solicitud.entidad.domicilios.find(d => d.tipo == 'especial');

  doc.setFontSize(12);

  if (domicilioReal) {
    doc.text(50, eje_y_domicilio - 6, `${domicilioReal.domicilio.calle} ${domicilioReal.domicilio.numero ? domicilioReal.domicilio.numero:'' }`);
    doc.text(35, eje_y_domicilio, domicilioReal.domicilio.pais);
    doc.text(120, eje_y_domicilio, domicilioReal.domicilio.provincia);
    eje_y_domicilio += 6;
    doc.text(50, eje_y_domicilio, domicilioReal.domicilio.departamento);
    doc.text(120, eje_y_domicilio, domicilioReal.domicilio.localidad);
    eje_y_domicilio += 6;
  }
  else eje_y_domicilio += 12;

  if (domicilioLegal) {
    eje_y_domicilio += 12;
    doc.text(50, eje_y_domicilio - 6, `${domicilioLegal.domicilio.calle} ${domicilioLegal.domicilio.numero ? domicilioLegal.domicilio.numero: ''}`);
    doc.text(35, eje_y_domicilio, domicilioLegal.domicilio.pais);
    doc.text(120, eje_y_domicilio, domicilioLegal.domicilio.provincia);
    eje_y_domicilio += 6;
    doc.text(50, eje_y_domicilio, domicilioLegal.domicilio.departamento);
    doc.text(120, eje_y_domicilio, domicilioLegal.domicilio.localidad);
    eje_y_domicilio += 6;
  }
  else eje_y_domicilio += 24;
  
  if (domicilioEspecial) {
    eje_y_domicilio += 12;
    doc.text(57, eje_y_domicilio - 6, `${domicilioEspecial.domicilio.calle} ${domicilioEspecial.domicilio.numero ? domicilioEspecial.domicilio.numero: ''} `);
    doc.text(35, eje_y_domicilio, domicilioEspecial.domicilio.pais);
    doc.text(120, eje_y_domicilio, domicilioEspecial.domicilio.provincia);
    eje_y_domicilio += 6;
    doc.text(50, eje_y_domicilio, domicilioEspecial.domicilio.departamento);
    doc.text(120, eje_y_domicilio, domicilioEspecial.domicilio.localidad);
  }

  return doc;

}



export function impresionLegajo(legajo, categoria) {
  const encabezado = (str) => {
    doc.line(20, eje_y, 190, eje_y);
    eje_y += 5;
    doc.setFontSize(12);
    doc.text(25, eje_y, str);
    eje_y += 3;
    doc.line(20, eje_y, 190, eje_y);
    eje_y += 5;
    doc.setFontSize(10);
  }

  const comitenteFisico = (comitente) => {
    doc.text(25, eje_y, `Apellido: ${comitente.persona.apellido}`);
    doc.text(100, eje_y, `Nombre: ${comitente.persona.nombre}`);
    eje_y += 5;
    doc.text(25, eje_y, `Teléfono: ${emptyIfNull(comitente.persona.telefono)}`);
    doc.text(100, eje_y, `DNI: ${comitente.persona.dni}`);
    eje_y += 5;
    doc.text(25, eje_y, `Porcentaje: ${comitente.porcentaje}`);
  }

  const comitenteJuridico = (comitente) => {
    doc.text(25, eje_y, `Nombre: ${comitente.persona.nombre}`);
    doc.text(100, eje_y, `CUIT: ${comitente.persona.cuit}`);
    eje_y += 5;
    doc.text(25, eje_y, `Teléfono: ${emptyIfNull(comitente.persona.telefono)}`);
    doc.text(100, eje_y, `Porcentaje: ${comitente.porcentaje}`);
  }


  const doc = new jsPDF('p', 'mm', 'a4');
  doc.addImage(img, 'JPG', 10, 10, 60, 13);
  doc.setLineWidth(1);
  doc.line(20, 38, 190, 38);
  doc.setFontSize(14);
  doc.text(25, 45, getTipoLegajo(legajo.tipo));
  doc.line(20, 50, 190, 50);

  let eje_y = 57;
  doc.setFontSize(10);
  doc.text(25, eje_y, `N° ${legajo.numero_legajo}`);
  doc.text(50, eje_y, `Fecha: ${moment(legajo.fecha_solicitud).format('DD/MM/YYYY')}`);
  eje_y += 5
  doc.setLineWidth(0.5);

  encabezado('Comitentes');

  for (let comitente of legajo.comitentes) {
    if (comitente.persona.tipo == 'fisica') comitenteFisico(comitente);
    else if (comitente.persona.tipo == 'juridica') comitenteJuridico(comitente);
    eje_y += 5;
  }

  encabezado('Ubicación del Trabajo');

  doc.text(25, eje_y, `Nomenclatura: ${legajo.nomenclatura}`);
  eje_y += 5;
  doc.text(25, eje_y, `País: ${legajo.domicilio ? legajo.domicilio.pais : ''}`);
  doc.text(100, eje_y, `Provincia: ${legajo.domicilio ? legajo.domicilio.provincia : ''}`);
  eje_y += 5;
  doc.text(25, eje_y, `Departamento: ${legajo.domicilio ? legajo.domicilio.departamento : ''}`);
  doc.text(100, eje_y, `Localidad: ${legajo.domicilio ? legajo.domicilio.localidad : ''}`);
  eje_y += 5;
  doc.text(25, eje_y, `Calle: ${legajo.domicilio ? legajo.domicilio.calle : ''}`);
  doc.text(100, eje_y, `N°: ${legajo.domicilio &&  legajo.domicilio.numero ? legajo.domicilio.numero: ''}`);
  eje_y += 5;

  let subcategoria = categoria.subcategorias.find(s => s.id == legajo.subcategoria)
  encabezado('Tareas');
  doc.text(25, eje_y, `${categoria.descripcion} - ${subcategoria.descripcion}`);
  eje_y += 5;

  for (let item of legajo.items) {
    doc.text(25, eje_y, `${item.item.descripcion}: ${item.valor}`);
    eje_y += 5;
  }

  // SI ES ORDEN DE TRABAJO
  if (legajo.tipo == 2) {
    encabezado('Honorarios');
    doc.text(25, eje_y, `Plazo Cumplimiento: ${legajo.plazo_cumplimiento ? moment(legajo.plazo_cumplimiento).format('DD/MM/YYYY') : ''}`);
    eje_y += 5;
    doc.text(25, eje_y, `Honorarios Presupuestados: ${legajo.honorarios_presupuestados ? '$ '+legajo.honorarios_presupuestados : ''}`);
    eje_y += 5;
    doc.text(25, eje_y, `Forma de Pago: ${legajo.forma_pago}`);
    eje_y += 5;
  }

  // SI ES LEGAJO TÉCNICO
  else if (legajo.tipo == 3) {
    encabezado('Honorarios');
    doc.text(25, eje_y, `Honorarios Reales: ${legajo.honorarios_reales ? '$ '+legajo.honorarios_reales : ''}`);
    eje_y += 5;
    doc.text(25, eje_y, `Finalización Tarea: ${legajo.finalizacion_tarea ? moment(legajo.finalizacion_tarea).format('DD/MM/YYYY') : ''}`);
    eje_y += 5;
    doc.text(25, eje_y, `Porcentaje Cumplimiento: ${legajo.porcentaje_cumplimiento}%`);
    eje_y += 5;
    doc.text(25, eje_y, `Tarea Pública: ${legajo.tarea_publica ? 'Sí' : 'No'}`);
    eje_y += 5;
    doc.text(25, eje_y, `Relación de Dependencia: ${legajo.relacion_dependencia ? 'Sí' : 'No'}`);
    eje_y += 5;

    encabezado('Aportes')
    doc.text(25, eje_y, `Aporte Neto: ${legajo.aporte_neto ? '$ '+legajo.aporte_neto : ''}`);
    eje_y += 5;
    doc.text(25, eje_y, `Aporte Bruto: ${legajo.aporte_bruto ? '$ '+legajo.aporte_bruto : ''}`);
    eje_y += 5;
    doc.text(25, eje_y, `Aporte Neto Bonificación: ${legajo.aporte_neto_bonificacion ? '$ '+legajo.aporte_neto_bonificacion : ''}`);
    eje_y += 5;
    doc.text(25, eje_y, `Cantidad de Planos: ${legajo.cantidad_planos ? legajo.cantidad_planos : ''}`);
    eje_y += 5;
  }

  return doc;
}
