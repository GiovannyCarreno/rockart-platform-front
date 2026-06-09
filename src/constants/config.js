/** API GAN externa (pic-generator-back, fuera de este repo). */
export const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';
/** Editor frontend embebido (incluido en el contenedor unificado, :5173). */
export const EDITOR_URL = import.meta.env.VITE_EDITOR_URL ?? 'http://localhost:5173';

/** Logo estático servido desde `public/logo/` (Vite). */
export const LOGO_SRC = '/logo/logo.png';

/**
 * Modelos GAN del backend (`pictos512` → pictogramas, `pictos512_2` → petroglifos).
 * `value` es el identificador técnico enviado en la API; el resto es texto para el usuario.
 */
export const GAN_MODELS = [
  {
    value: 'pictos512',
    label: 'Pictogramas',
    optionLabel: 'Pictogramas — pinturas rupestres',
    description:
      'Genera pictogramas: figuras y símbolos pintados sobre la roca (arte rupestre pictográfico).',
    generateVerb: { single: 'pictograma', multiple: 'pictogramas' },
  },
  {
    value: 'pictos512_2',
    label: 'Petroglifos',
    optionLabel: 'Petroglifos — figuras grabadas en roca',
    description:
      'Genera petroglifos: figuras incisas o talladas en la superficie rocosa (arte rupestre grabado).',
    generateVerb: { single: 'petroglifo', multiple: 'petroglifos' },
  },
];

export const DEFAULT_GAN_MODEL = 'pictos512';

export function getGanModelMeta(modelValue) {
  return GAN_MODELS.find((m) => m.value === modelValue);
}

export function getGanModelLabel(modelValue) {
  return getGanModelMeta(modelValue)?.label ?? modelValue;
}

export function getGanModelDescription(modelValue) {
  return getGanModelMeta(modelValue)?.description ?? '';
}

export function getGanModelGenerateLabel(modelValue, mode = 'single') {
  const meta = getGanModelMeta(modelValue);
  if (!meta) return mode === 'multiple' ? 'Generar imágenes' : 'Generar imagen';
  const key = mode === 'multiple' ? 'multiple' : 'single';
  return `Generar ${meta.generateVerb[key]}`;
}

export function getGanModelResultHeading(count, modelValue) {
  const meta = getGanModelMeta(modelValue);
  if (!meta || !count) return `${count ?? 0} imágenes generadas`;
  const noun = count === 1 ? meta.generateVerb.single : meta.generateVerb.multiple;
  const verb = count === 1 ? 'generado' : 'generados';
  return `${count} ${noun} ${verb}`;
}

/**
 * Modelos ONNX para `/comparar`
 * (`mejor_modelo_dinamico` → pictogramas, `modelo_dinamico_gab` → petroglifos).
 */
export const ONNX_MODELS = [
  {
    value: 'mejor_modelo_dinamico',
    label: 'Pictogramas',
    optionLabel: 'Pictogramas — pinturas rupestres',
    description:
      'Segmenta pictogramas con ONNX y compara la reconstrucción a 256×256 y 512×512 sobre roca.',
  },
  {
    value: 'modelo_dinamico_gab',
    label: 'Petroglifos',
    optionLabel: 'Petroglifos — figuras grabadas en roca',
    description:
      'Segmenta petroglifos con ONNX y compara la reconstrucción a 256×256 y 512×512 sobre roca.',
  },
];

export const DEFAULT_ONNX_MODEL = 'mejor_modelo_dinamico';

export function getOnnxModelMeta(modelValue) {
  return ONNX_MODELS.find((m) => m.value === modelValue);
}

export function getOnnxModelLabel(modelValue) {
  return getOnnxModelMeta(modelValue)?.label ?? modelValue;
}

export function getOnnxModelDescription(modelValue) {
  return getOnnxModelMeta(modelValue)?.description ?? '';
}
