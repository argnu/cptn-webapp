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
  doc.text(25, eje_y, `Dirección: ${legajo.domicilio ? legajo.domicilio.direccion : ''}`);
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
