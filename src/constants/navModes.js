/**
 * Definición de pantallas/modos para la navegación lateral (solo datos; los iconos viven en SidebarNav).
 */
export const MODE_LABELS = {
  single: 'Imagen individual',
  multiple: 'Múltiples imágenes',
  restoration: 'Restauración de pictogramas',
  reconstruction: 'Reconstrucción',
};

export function getModeLabel(mode) {
  return MODE_LABELS[mode] ?? mode;
}

/** Pasos breves para orientar al usuario en cada pestaña (orden sugerido de uso). */
export const MODE_INSTRUCTIONS = {
  single: [
    'En pantallas pequeñas, abre el menú lateral con el botón de menú arriba a la izquierda; en escritorio puedes colapsar la barra con la flecha del panel.',
    'Introduce un seed o usa el botón de aleatorizar para fijar la variación que quieres generar.',
    'Elige si quieres generar pictogramas (pinturas rupestres) o petroglifos (figuras grabadas en roca), ajusta truncation PSI y noise mode, y pulsa Generar.',
    'Cuando termine la generación, revisa el resultado debajo de los controles; desde ahí puedes copiar el seed o descargar la imagen.',
  ],
  multiple: [
    'Usa el menú lateral para moverte entre pestañas (en móvil, icono de menú arriba a la izquierda).',
    'Elige cuántas imágenes quieres, el tipo (pictogramas o petroglifos), truncation PSI y noise mode.',
    'Pulsa Generar imágenes y espera a que finalice la petición.',
    'Las imágenes generadas aparecen en la zona inferior; puedes descargarlas o copiar seeds desde cada tarjeta.',
  ],
  restoration: [
    'El área principal carga el editor de restauración embebido: interactúa con él como en la herramienta original (pinceles, zoom, etc., según lo que ofrezca el editor).',
    'Si no ves el contenido, comprueba la conexión o recarga la página; el iframe puede tardar unos segundos en cargar.',
    'Para ir a otra función de la app, elige otra opción en el menú lateral sin cerrar el navegador.',
  ],
  reconstruction: [
    'Indica si la imagen contiene pictogramas (pinturas rupestres) o petroglifos (figuras grabadas en roca).',
    'Sube la imagen en el área punteada o arrástrala (PNG, JPG, JPEG, BMP o WEBP) y pulsa Reconstruir.',
    'El backend segmenta con el modelo ONNX correspondiente a 256×256 y 512×512; revisa métricas, simulaciones y descarga los PNG.',
  ],
};

export function getModeInstructions(mode) {
  return MODE_INSTRUCTIONS[mode] ?? [];
}

