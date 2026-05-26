import { API_URL } from '../constants/config';

function parseErrorDetail(detail) {
  if (!detail) return null;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((entry) => (typeof entry === 'object' && entry?.msg ? entry.msg : String(entry)))
      .join('; ');
  }
  return String(detail);
}

async function parseErrorResponse(response, fallbackMessage) {
  try {
    const errorData = await response.json();
    return parseErrorDetail(errorData?.detail) || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export async function generateSingleImage({ seed, truncation_psi, noise_mode, model }) {
  const response = await fetch(`${API_URL}/generateSingle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ seed, truncation_psi, noise_mode, model }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Error al generar la imagen'));
  }

  return response.json();
}

export async function generateMultipleImages({ truncation_psi, noise_mode, number, model }) {
  const response = await fetch(`${API_URL}/generateSeveral`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ truncation_psi, noise_mode, number, model }),
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Error al generar las imágenes'));
  }

  return response.json();
}

/** Compara segmentación ONNX a 256×256 y 512×512 (`POST /comparar`). */
export async function compareSegmentationResolutions(imageFile, model) {
  const formData = new FormData();
  formData.append('imagen', imageFile);
  formData.append('model', model);

  const response = await fetch(`${API_URL}/comparar`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response, 'Error al comparar resoluciones'));
  }

  return response.json();
}

/** @deprecated Usa compareSegmentationResolutions */
export const compareModels = compareSegmentationResolutions;
