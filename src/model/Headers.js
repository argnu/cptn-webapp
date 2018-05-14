import { Header } from './index'

export const Contactos = [
    Header('Tipo', 'tipo'),
    Header('Valor', 'valor'),
];

export const Formaciones = [
      { text: 'Tipo', value: 'tipo' , sortable: false },
      { text: 'Título', value: 'titulo' , sortable: false },
      { text: 'Institución', value: 'institucion' , sortable: false },
      { text: 'Fecha Egreso', value: 'fechaEgreso' , sortable: false },
      { text: 'Fecha Emisión', value: 'fechaEmision' , sortable: false }
  ];

export const Subsidiarios = [
    { text: 'Nombre', value: 'nombre' , sortable: false },
    { text: 'Apellido', value: 'apellido' , sortable: false },
    { text: 'DNI', value: 'dni' , sortable: false },
    { text: 'Porcentaje', value: 'porcentaje' , sortable: false }
  ];

export const Incumbencias = [
    { text: 'Nombre', value: 'nombre' , sortable: false }
  ];

export const Representantes = [
    { text: 'N° Matrícula', value: 'numero_matricula' , sortable: false },
    { text: 'DNI', value: 'dni' , sortable: false },
    { text: 'Apellido', value: 'apellido' , sortable: false },
    { text: 'Nombre', value: 'nombre' , sortable: false },
    { text: 'Fecha Inicio', value: 'fecha_inicio' , sortable: false },
    { text: 'Fecha Fin', value: 'fecha_fin' , sortable: false }
  ];

export const CondicionesAfip = [
    Header('Tipo', 'tipo'),
    Header('Descripción', 'descripcion')
  ];
