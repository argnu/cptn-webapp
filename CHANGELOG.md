# 1.4.1 (2018-02-19)

## Solucionado
    - Fix en script de deploy.

# 1.4.0 (2018-02-19)

## Modificado

- **NuevoProfesional**: 
    - Cambios de títulos, CUIT -> CUIT/CUIL, Datos Adicionales -> Relación Laboral.
    - Nuevo campo de formación: fecha de emisión del titulo.
    - Lapso desde emisión de título.
    - Diálogo para imprimir solicitud apenas creada.

# 1.3.1 (2018-02-15)

## Modificado

- **NuevoLegajo**: 
    - Comitentes: ya no es obligatorio el CUIT/CUIL.

# 1.3.0 (2018-02-05)

## Solucionado

- **NuevaSolicitud**: 
    - reiniciar form cuando cambio de ruta pero el componente es el mismo.
    - ajustes de interfaz, mayor ancho a componente principal.

## Agregado

- **NuevaSolicitud**: 
    - barra de progreso superior de carga de datos del profesional.
    - seteo automático de la localidad y departamento en base a la delegación del usuario.
    
- **NuevoProfesional**: 
    - formaciones, fechaEmision, fechaEgreso y tiempo transcurrido desde fechaEmision.
    - diálogo de impresión de solicitud al guardar una nueva.


# 1.3.0 (2018-02-05)

## Solucionado

- **AddFirma**: reseteo de canvas, no reseteaba el array movimientos.
- **InputFecha**: luego de seleccionar fecha por diálogo no te permitía editar, se borraba toda.
- **NuevoProfesional**: 
    - form de caja previsional, refresecaba la pagina cuando se apreta enter.
    - repetición de contactos, formaciones y subsidiarios en edición.
- **NuevaBoleta**: no se podía cargar un importe decimal.
- **InputNumero**: cuando es fijo se borraba el cero del prefijo provincial.

## Agregado

- **Modificar Profesional**: habilitación de edición de elementos individuales de contacto, domicilio, formación y subsidiarios.
- **Delegacion**: mensaje que indica la delegación en la que se encuentra el usuario.
- **AddFoto**: posibilidad de tomar la foto con una webcam.
- **InputTelefono**: por defecto provincia 0299 (fijo) o 299 (celular).

## Modificado

- Script `deploy`, agregado un pull del repositorio antes de empaquetar.
- Domicilio ya no tiene calle y numero, sino `direccion`.


# 1.2.2 (2018-01-29)

## Solucionado

- Impresión de Solicitud sin domicilio real.

# 1.2.1 (2018-01-28)

## Solucionado

- **ListaSolicitud**: 
    - Orden de columnas.
    - Paginacion por servidor.

# 1.2.0 (2018-01-28)

## Agregado

- **Nuevo Profesional**: posibilidad de firmar con canvas.
- **Aprobar Matrícula**: nuevo tipo de matrícula posible, `IDO`.
- **ListaSolicitud** y **ListaMatriculas**:
    - Posibilidad de ordenar datos por columna.
    - Guardo el estado de los filtros y paginación cuando cambio de ruta.
    - Posibilidad de limpiar filtros.
- **Lista Solicitudes**: botón para rechazar solicitud.
- **Lista Matrículas**: botón para rematricular.
- **ResumenCuenta**: posibilidad de ordenar datos por columna.
- **DeudasPendientes**: 
    - Nuevo botón para *Nueva Boleta*.
    - Nuevo diálogo para generar *Nueva Boleta*.
    - Posibilidad de ordenar datos por columna.
- **Lista Legajos**: Posibilidad de ordenar datos por columna.    

## Modificado

- **Cobranza**: no se permite agregar pago si el importe a ingresar excede el límite.    

## Solucionado
- Filtro *round* reemplaza la coma por punto en números decimales.



# 1.1.1 (2018-01-22)

## Modificado
- **Nueva Solicitud Profesional**: autcompletado en selección de Institución.
- Paginación de tablas: modificación en la cantidad de elementos por página.

# 1.1.0 (2018-01-21)

## Agregado

- **Nueva Solicitud**:
    * Búsqueda del profesional al apretar tecla `Enter` en DNI.
    * Observaciones en Domicilios para mejorar entendimiento.
    * Validadores de formato para campos de contacto: `Web` y `Email`.
    * Nuevo Checkbox `Jubilado`.
    * Posibilidad de agregar una o más Cajas Previsionales.
    * Checkbox `Todos` para selección/deselección de publicación de todos   los datos.
    * Previsualización de las imágenes para la foto y la firma.
    * Deshabilitación de campos de datos de solicitud en modificación de una solicitud aprobada.

- **Lista de Solicitudes**:
    * Nueva columna `N° Solicitud`.
    * Nuevo filtro de búsqueda `N° Solicitud`.

- Nuevo Diálogo de modificación sólamente de foto y firma para una solicitud cargada.
- Funcionalidad para dibujar la firma con el mouse y/o el touchpad de un dispositivo táctil (celular, tablet).


## Modificado
- **Nueva Solicitud**:
    * Condición AFIP -> Condición Impositiva.
    * Cambio de títulos en pasos de formulario.

- **Lista de Solicitudes**:
    * Item de menú `Modificar Solicitud` habilitado para solicitudes aprobadas.

## Eliminado
- **Nueva Solicitud**:
    * Checkbox's de exenciones (art6, art10).
    * Checkbox's de caja previsional (posee, solicita).
