// --- CONFIGURACIÓN GENERAL  ---
const ID_HOJA_ORIGEN = 'TU_ID_HOJA_ORIGEN'
const NOMBRE_HOJA_CONFIGURACION = 'CONFIGURACION';

let ID_HOJA_DESTINO; // que vendrá configurada en CONFIGURACION
let ID_CARPETA_DRIVE_COPIAS; //Carpeta donde guardará las copias de tus datos antes de borrarlos
let EMPLEADOS = [];

// Esta función se llamará al inicio de ejecutarProcesoMensual para cargar la configuración
function cargarConfiguracion() {
  const hojaConfiguracionMaestra = SpreadsheetApp.openById(ID_HOJA_ORIGEN);
  const pestanaConfiguracion = hojaConfiguracionMaestra.getSheetByName(NOMBRE_HOJA_CONFIGURACION);

  if (!pestanaConfiguracion) {
    throw new Error(`¡Error! No se encontró la pestaña '${NOMBRE_HOJA_CONFIGURACION}'. Por favor, créala para configurar el script.`);
  }

  try {
    // Leer IDs
    ID_HOJA_DESTINO = pestanaConfiguracion.getRange('B3').getValue(); // para ID Hoja DESTINO
    ID_CARPETA_DRIVE_COPIAS = pestanaConfiguracion.getRange('B4').getValue(); // para ID Carpeta Drive donde se copiarán los datos

    // Lee la lista de empleados (va desde B6 de tu pestaña CONFIGURACION, hacia abajo por si luego quieres añadir más empleados)
    // getLastRow() lee todas las entradas de empleados hasta la última fila con contenido
    const ultimaFilaEmpleados = pestanaConfiguracion.getLastRow();
    const rangoEmpleados = pestanaConfiguracion.getRange('B6:B' + ultimaFilaEmpleados);
    const valoresEmpleados = rangoEmpleados.getValues();

    // Filtra filas vacías y aplanarlas en un array de nombres de empleados
    EMPLEADOS = valoresEmpleados.filter(fila => fila[0] !== '').map(fila => fila[0].toString());

    // Validaciones básicas
    if (!ID_HOJA_ORIGEN || !ID_HOJA_DESTINO || !ID_CARPETA_DRIVE_COPIAS) {
      throw new Error('Faltan IDs de configuración. Por favor, revisa la pestaña "Configuración".');
    }
    if (EMPLEADOS.length === 0) {
      throw new Error('No se han configurado empleados. Por favor, revisa la pestaña "Configuración".');
    }

    Logger.log('Configuración cargada exitosamente.');
    Logger.log('Empleados cargados: ' + EMPLEADOS.join(', '));

  } catch (e) {
    Logger.log(`Error al cargar la configuración: ${e.message}`);
    throw new Error(`Fallo al cargar la configuración desde la hoja '${NOMBRE_HOJA_CONFIGURACION}': ${e.message}. Asegúrate de que los IDs y nombres de empleados estén en las celdas correctas.`);
  }
}

function ejecutarProcesoMensual() {
  let procesoExitoso = true;

  try {
    cargarConfiguracion();
    // 1. Crea una copia de seguridad de la hoja ORIGEN completa
    Logger.log('Paso 1/3: Creando copia de seguridad de la hoja de origen...'); 
    hacerCopiaDeSeguridadDB();
    Logger.log('Copia de seguridad de la base de datos de origen creada exitosamente.');

    // 2. Copia los datos de los empleados de ORIGEN a DESTINO
    Logger.log('Paso 2/3: Copiando datos de empleados de origen a destino...');
    copiarDatosEmpleados();
    Logger.log('Datos de empleados copiados exitosamente.');

    // 3. Limpia los datos en las pestañas de ORIGEN
    Logger.log('Paso 3/3: Limpiando datos en las pestañas de origen...');
    limpiarDatosOrigen();
    Logger.log('Datos de origen limpiados exitosamente.');

  } catch (e) {
    procesoExitoso = false;
    Logger.log(`Error crítico durante el proceso: ${e.message}`);
    Logger.log(`Proceso Fallido: Ha ocurrido un error inesperado: ${e.message}. Revisa los registros para más detalles.`); 
  }

  if (procesoExitoso) {
    Logger.log('Proceso Completado: El proceso de copia, respaldo y limpieza se ha realizado con éxito.'); 
  }
}

// --- FUNCIÓN 1: COPIA DATOS DE EMPLEADOS DE ORIGEN A DESTINO ---
function copiarDatosEmpleados() {
  const hojaOrigen = SpreadsheetApp.openById(ID_HOJA_ORIGEN);
  const hojaDestino = SpreadsheetApp.openById(ID_HOJA_DESTINO);

  EMPLEADOS.forEach(empleado => {
    try {
      const pestanaOrigen = hojaOrigen.getSheetByName(empleado);
      const pestanaDestino = hojaDestino.getSheetByName(empleado);

      if (!pestanaOrigen) {
        throw new Error(`Pestaña '${empleado}' no encontrada en la hoja ORIGEN.`);
      }
      if (!pestanaDestino) {
        throw new Error(`Pestaña '${empleado}' no encontrada en la hoja DESTINO.`);
      }

      // Rango de datos a copiar en ORIGEN (del 21 al 31)
      // B27 es el día 21, y H37 es el último día de datos relevantes en ORIGEN
      const rangoOrigen = pestanaOrigen.getRange('B27:H37');
      const datosOrigen = rangoOrigen.getValues();

      // Prepara los datos para DESTINO, ajustando las columnas.
      // Si en ORIGEN las columnas son B, C, D, E, F, G, H
      // y en DESTINO se pegan en C, D, E, F, G, H (saltando la B de origen porque es la que contendria nuestra columna de referencia con los dias del mes)
      // En un array de datos de getValues(): B=index 0, C=index 1, etc.
      const datosParaDestino = datosOrigen.map(fila => {
          return [fila[1], fila[2], fila[3], fila[4], fila[5], fila[6]]; // Corresponde a C,D,E,F,G,H de ORIGEN
      });

      // Rango de destino en la hoja DESTINO (C8:H18)
      // C8:H18 tiene 11 filas (18-8+1) y 6 columnas.
      const rangoDestino = pestanaDestino.getRange('C8:H18');

      // Valida que las dimensiones de los datos y el rango de destino coincidan
      if (datosParaDestino.length === 0 || datosParaDestino[0].length !== rangoDestino.getWidth()) {
          throw new Error(`Dimensiones de datos no coinciden para ${empleado}. Datos: ${datosParaDestino.length}x${datosParaDestino.length > 0 ? datosParaDestino[0].length : 0}. Rango Destino: ${rangoDestino.getNumRows()}x${rangoDestino.getWidth()}.`);
      }

      rangoDestino.setValues(datosParaDestino);
      Logger.log(`Datos copiados de ${empleado} (ORIGEN) a ${empleado} (DESTINO).`);

    } catch (e) {
      Logger.log(`Error copiando datos de ${empleado}: ${e.message}`);
      throw new Error(`Fallo al copiar datos para ${empleado}: ${e.message}`); // Relanzar para que la función principal lo capture
    }
  });
}

// --- FUNCIÓN 2: HACE COPIA DE SEGURIDAD DE LA HOJA ORIGEN COMPLETA ---
function hacerCopiaDeSeguridadDB() {
  const hojaOrigen = SpreadsheetApp.openById(ID_HOJA_ORIGEN);
  const carpetaDestino = DriveApp.getFolderById(ID_CARPETA_DRIVE_COPIAS);

  // Generar el nombre del archivo: "DB" + Mes_Año 
  const fechaActual = new Date();
  const nombreMes = Utilities.formatDate(fechaActual, Session.getScriptTimeZone(), 'MMM').toUpperCase(); // Ej: JUN
  const anio = Utilities.formatDate(fechaActual, Session.getScriptTimeZone(), 'yyyy');
  const nombreArchivo = `DB_${nombreMes}_${anio}`;

  try {
    // Duplicar la hoja de cálculo completa
    const archivoCopia = DriveApp.getFileById(hojaOrigen.getId()).makeCopy(nombreArchivo, carpetaDestino);
    Logger.log(`Copia de seguridad '${nombreArchivo}' creada en Drive: ${archivoCopia.getUrl()}`);
  } catch (e) {
    Logger.log(`Error al crear la copia de seguridad de la DB: ${e.message}`);
    throw new Error(`Fallo al crear la copia de seguridad de la base de datos: ${e.message}`); // Relanzar
  }
}

// --- FUNCIÓN 3: LIMPIAR DATOS DE ORIGEN ---
function limpiarDatosOrigen() {
  const hojaOrigen = SpreadsheetApp.openById(ID_HOJA_ORIGEN);
  const nombrePestanaCentralizada = "Datos Centralizados"; // Nombre exacto de la pestaña a limpiar

  try {
    const pestanaCentralizada = hojaOrigen.getSheetByName(nombrePestanaCentralizada);
    if (!pestanaCentralizada) {
      throw new Error(`Pestaña '${nombrePestanaCentralizada}' no encontrada en la hoja ORIGEN.`);
    }

    // El rango a limpiar es de la columna B a G, excluyendo la primera fila (encabezados)
    // getRange(filaInicial, columnaInicial, numFilas, numColumnas)
    // La columna B es la 2da columna, la G es la 7ma.
    const numFilas = pestanaCentralizada.getLastRow(); // Obtener la última fila con contenido
    // Aseguramos que solo limpiamos desde la fila 2 hasta la última fila con datos,
    // y solo si hay datos más allá de la primera fila.
    if (numFilas > 1) {
      const rangoALimpiar = pestanaCentralizada.getRange(2, 2, numFilas - 1, 6); // Desde la fila 2, columna B, 6 columnas (B,C,D,E,F,G)
      rangoALimpiar.clearContent();
      Logger.log(`Datos eliminados en la pestaña Datos Centralizados'${nombrePestanaCentralizada}' de ORIGEN.`);
    } else {
      Logger.log(`La pestaña '${nombrePestanaCentralizada}' de ORIGEN no tiene datos más allá de los encabezados para limpiar.`);
    }

  } catch (e) {
    Logger.log(`Error limpiando datos de la pestaña centralizada: ${e.message}`);
    throw new Error(`Fallo al limpiar datos en '${nombrePestanaCentralizada}': ${e.message}`); // Relanzar
  }
}
