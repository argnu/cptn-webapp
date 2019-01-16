import { ColumnHeader } from './index'

export const Contactos = [
    ColumnHeader('Tipo', 'tipo'),
    ColumnHeader('Valor', 'valor'),
];

export const Formaciones = [
      ColumnHeader('Tipo', 'tipo'),
      ColumnHeader('Título', 'titulo'),
      ColumnHeader('Institución', 'institucion'),
      ColumnHeader('Fecha Egreso', 'fechaEgreso'),
      ColumnHeader('Fecha Emisión', 'fechaEmision')
  ];

export const Subsidiarios = [
    ColumnHeader('Nombre', 'nombre'),
    ColumnHeader('Apellido', 'apellido'),
    ColumnHeader('DNI', 'dni'),
    ColumnHeader('Porcentaje', 'porcentaje')
  ];

export const Incumbencias = [
    ColumnHeader('Nombre', 'nombre')
  ];

export const Representantes = [
    ColumnHeader('N° Matrícula', 'numero_matricula'),
    ColumnHeader('DNI', 'dni'),
    ColumnHeader('Apellido', 'apellido'),
    ColumnHeader('Nombre', 'nombre'),
    ColumnHeader('Fecha Inicio', 'fecha_inicio'),
    ColumnHeader('Fecha Fin', 'fecha_fin')
  ];

export const RepresentantesLegales = [
    ColumnHeader('N° Matrícula', 'numero_matricula'),
    ColumnHeader('DNI', 'dni'),
    ColumnHeader('Apellido', 'apellido'),
    ColumnHeader('Nombre', 'nombre')
  ];

export const CondicionesAfip = [
    ColumnHeader('Tipo', 'tipo'),
    ColumnHeader('Descripción', 'descripcion')
  ];
