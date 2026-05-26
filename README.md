# Rock Art Image Generator (Frontend)

Aplicación React para generar imágenes de **pinturas rupestres** usando un backend GAN, visualizar los resultados y trabajar con un **editor de restauración de pictogramas** embebido en una pestaña adicional.

## Características principales

- **Generación de imagen individual**
  - Seed configurable (con botón de seed aleatoria).
  - Tipo de generación: **pictogramas** (`pictos512`) o **petroglifos** (`pictos512_2`).
  - `truncation_psi` ajustable con slider (0.0–1.0, por defecto 0.6).
  - `noise_mode` seleccionable (`random`, `const`, `none`).

- **Generación de múltiples imágenes**
  - Número de imágenes entre 1 y 10.
  - Vista en cuadrícula con cada imagen y su seed.
  - Copia rápida de seed al portapapeles.

- **Descarga de imágenes**
  - Descarga en PNG.
  - Nombre de archivo con metadatos:
    - `rock-art_seed{seed}_psi{truncationPsi}_{noiseMode}.png`
    - Ejemplo: `rock-art_seed123456_psi0_60_random.png`.

- **Pestañas de trabajo**
  - **Imagen individual**
  - **Múltiples imágenes**
  - **Restauración de pictogramas**: iframe a pantalla casi completa que embebe un editor de imágenes externo.
  - **Reconstrucción**: sube una imagen, elige pictogramas o petroglifos, y compara segmentación ONNX a 256×256 y 512×512 (`POST /comparar`).

## Tecnologías

- **React 19**
- **Vite** como bundler.
- **lucide-react** para iconos.
- CSS puro (`App.css`, `index.css`).

## Requisitos previos

- Node.js (versión recomendada LTS).
- npm o pnpm (el proyecto está configurado con npm en los scripts).
- Backend GAN corriendo en `http://localhost:8000` (o ajusta la URL).

## Configuración del entorno

La configuración principal está en:

- `src/constants/config.js`

```js
export const API_URL = 'http://localhost:8000';    // Backend de generación
export const EDITOR_URL = 'http://localhost:5173'; // Editor de imágenes embebido
```

Ajusta `API_URL` y `EDITOR_URL` según tus servicios:

- **API_URL**: URL del backend Python/GAN.
- **EDITOR_URL**: URL donde corre tu editor de imágenes (por ejemplo otro frontend en Vite).

Si el editor de imágenes corre en otro puerto, simplemente modifica `EDITOR_URL`.

## Scripts disponibles

En la raíz del proyecto:

```bash
# Instalación
npm install

# Desarrollo
npm run dev

# Build de producción
npm run build

# Vista previa del build
npm run preview

# Linter
npm run lint
```

## Estructura del proyecto

```text
src/
├── api/
│   └── imageApi.js          # Llamadas a la API (GAN + comparación ONNX /comparar)
├── components/
│   ├── Header/
│   │   └── Header.jsx
│   ├── ModeSelector/
│   │   └── ModeSelector.jsx
│   ├── GenerationControls/
│   │   └── GenerationControls.jsx
│   ├── SingleImageResult/
│   │   └── SingleImageResult.jsx
│   ├── MultipleImagesResult/
│   │   └── MultipleImagesResult.jsx
│   ├── ImageCard/
│   │   └── ImageCard.jsx
│   └── RestorationEditor/
│       └── RestorationEditor.jsx  # Pestaña de “Restauración de pictogramas” (iframe)
├── constants/
│   └── config.js            # API_URL, EDITOR_URL
├── hooks/
│   └── useImageGenerator.js # Lógica de estado y generación
├── utils/
│   └── imageUtils.js        # downloadImage, copySeed, generateRandomSeed
├── App.jsx                  # Orquestación de componentes
├── App.css                  # Estilos principales (paleta azul, layout)
├── main.jsx
└── index.css
```

### Comportamiento de las pestañas

El estado de la pestaña activa se maneja con `mode` en el hook `useImageGenerator`:

- `'single'`: imagen individual.
- `'multiple'`: múltiples imágenes.
- `'restoration'`: muestra solo el editor de restauración en un iframe a máximo tamaño posible, manteniendo el mismo diseño del resto (header, card, fondo).

## Uso con Docker

Puedes construir y ejecutar este frontend en un contenedor Docker:

```bash
# Build de la imagen
docker build -t generator_front .

# Ejecutar el contenedor
docker run -d -p 5174:5174 --name generator_front_container generator_front
```

Asegúrate de que:

- El puerto expuesto dentro del contenedor (en la imagen) coincida con el que sirve Vite/tu servidor de producción.
- `EDITOR_URL` apunte a un host accesible desde el navegador (por ejemplo `http://localhost:5173` si el editor corre fuera del contenedor).

## Notas adicionales

- El frontend asume que el backend FastAPI (puerto 8000) expone:
  - `POST /generateSingle` y `POST /generateSeveral` con campo `model`: `pictos512` (pictogramas) o `pictos512_2` (petroglifos).
  - `POST /comparar` (multipart: `imagen` + `model`): `mejor_modelo_dinamico` (pictogramas) o `modelo_dinamico_gab` (petroglifos); responde con métricas y PNG en base64.
- El dev server de Vite corre en el puerto **5174** (CORS del backend).
- La paleta de colores está basada en tonos de azul (`#1e40af`, `#2563eb`, `#3b82f6`, `#60a5fa`).