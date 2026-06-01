# Arte rupestre — Panel de herramientas (Frontend)

Aplicación React para **generar**, **restaurar**, **reconstruir** y **clasificar** imágenes de arte rupestre (pictogramas y petroglifos). Incluye el editor [IOPaint](https://github.com/Sanster/IOPaint) (`web_app_lama`) integrado como carpeta del proyecto.

## Pestañas

| Pestaña | Descripción |
|---------|-------------|
| **Imagen individual** | Genera un pictograma o petroglifo con seed, truncation PSI y noise mode. |
| **Múltiples imágenes** | Genera de 1 a 10 imágenes con seeds aleatorios. |
| **Restauración de pictogramas** | Editor IOPaint embebido (inpainting con LaMa). |
| **Reconstrucción** | Segmentación ONNX a 256×256 y 512×512 con simulación sobre roca. |
| **Clasificación** | Predice si la imagen es pictograma o petroglifo con nivel de confianza. |

### Generación GAN

- Tipo: **pictogramas** (`pictos512`) o **petroglifos** (`pictos512_2`).
- Seed configurable (con aleatorización).
- `truncation_psi` (0.0–1.0, por defecto 0.6).
- `noise_mode`: `random`, `const`, `none`.
- Descarga PNG con metadatos: `rock-art_seed{seed}_psi{psi}_{noiseMode}.png`.

### Reconstrucción y clasificación

- Carga de imagen por clic o arrastrar (PNG, JPG, JPEG, BMP, WEBP).
- Reconstrucción: elige pictogramas o petroglifos; compara cobertura, umbrales y simulaciones por resolución.
- Clasificación: muestra clase predicha, confianza y barras de probabilidad.

## Arquitectura y servicios

```
┌─────────────────────────────────────────────────────────────┐
│  pic-generator-front (este repo)                            │
│  ┌──────────────┐  ┌─────────────────────────────────────┐  │
│  │ App principal│  │ web_app_lama/                       │  │
│  │  :5174       │  │  Editor UI :5173  +  IOPaint :8080  │  │
│  └──────┬───────┘  └─────────────────────────────────────┘  │
└─────────┼───────────────────────────────────────────────────┘
          │ API REST
          ▼
┌─────────────────────┐
│ pic-generator-back  │  ← repositorio/servicio aparte
│ FastAPI  :8000      │
└─────────────────────┘
```

| Servicio | Puerto | Dónde corre |
|----------|--------|-------------|
| App principal | **5174** | Este proyecto |
| Editor IOPaint (UI) | **5173** | `web_app_lama/` |
| API IOPaint (inpainting) | **8080** | `web_app_lama/docker back-end` |
| API GAN / ONNX / clasificación | **8000** | `pic-generator-back` (externo) |

## Tecnologías

- **React 19** + **React Compiler**
- **Vite 7**
- **Tailwind CSS 4**
- **lucide-react**
- **IOPaint** (editor en `web_app_lama/`, basado en LaMa)

## Requisitos previos

### Desarrollo local

- Node.js LTS
- npm
- **pic-generator-back** en `http://localhost:8000` (generación, reconstrucción, clasificación)
- Para restauración: editor en `:5173` y API IOPaint en `:8080`

### Docker

- Docker y Docker Compose
- GPU NVIDIA recomendada (IOPaint con CUDA)
- [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) si usas `--gpus all`

## Configuración

Variables en `src/constants/config.js` (sobreescribibles en build con Vite):

```js
// Desarrollo (valores por defecto)
VITE_API_URL=http://localhost:8000      // pic-generator-back
VITE_EDITOR_URL=http://localhost:5173     // web_app_lama (UI)
```

En `web_app_lama/.env`:

```env
VITE_BACKEND=http://127.0.0.1:8080        // API IOPaint
```

## Desarrollo local

```bash
# 1. App principal
npm install
npm run dev          # http://localhost:5174

# 2. Editor IOPaint (otra terminal)
cd web_app_lama
npm install
npm run dev          # http://localhost:5173

# 3. API IOPaint (otra terminal, con GPU si está disponible)
iopaint start --model=lama --port=8080

# 4. Backend GAN (repositorio pic-generator-back)
uvicorn service:app --host 0.0.0.0 --port 8000
```

### Scripts (raíz)

```bash
npm install
npm run dev       # Servidor de desarrollo (:5174)
npm run build     # Build de producción
npm run preview   # Vista previa del build
npm run lint      # ESLint
```

## Docker (contenedor unificado)

Un solo contenedor incluye la app principal, el editor IOPaint y su API. **No incluye** `pic-generator-back` (:8000).

| Puerto | Servicio |
|--------|----------|
| **5174** | App principal |
| **5173** | Editor IOPaint (UI) |
| **8080** | API IOPaint |

```bash
docker compose up --build
```

Abre **http://localhost:5174**. Para generación, reconstrucción y clasificación, levanta **pic-generator-back** aparte en el puerto 8000.

### Build manual

```bash
docker build -t pic-generator-stack .
docker run --gpus all -p 5174:5174 -p 5173:5173 -p 8080:8080 pic-generator-stack
```

### Solución de problemas Docker

**`npm error Missing script: "start"`** — imagen antigua con `CMD ["npm","start"]`. Limpia y reconstruye:

```bash
docker compose down
docker rmi pic-generator-stack:latest -f
docker compose build --no-cache
docker compose up
```

Comprueba el comando de la imagen:

```bash
docker inspect pic-generator-stack:latest --format "{{.Config.Cmd}}"
# Debe ser: [/bin/bash /app/start.sh]
```

Al arrancar bien verás: `Iniciando API IOPaint en :8080...`, `Iniciando app principal en :5174...`, etc.

## API del backend externo (`pic-generator-back`)

El frontend consume estos endpoints en `API_URL` (por defecto `:8000`):

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/generateSingle` | Una imagen GAN. Body JSON: `seed`, `truncation_psi`, `noise_mode`, `model`. |
| `POST` | `/generateSeveral` | Varias imágenes. Body JSON: `number`, `truncation_psi`, `noise_mode`, `model`. |
| `POST` | `/comparar` | Multipart: `imagen`, `model`. ONNX 256×256 vs 512×512. |
| `POST` | `/clasificar` | Multipart: `imagen`. Clase pictograma/petroglifo + confianza. |

### Valores de `model`

| Uso | Valor API | Significado en UI |
|-----|-----------|-----------------|
| GAN | `pictos512` | Pictogramas |
| GAN | `pictos512_2` | Petroglifos |
| ONNX (`/comparar`) | `mejor_modelo_dinamico` | Pictogramas |
| ONNX (`/comparar`) | `modelo_dinamico_gab` | Petroglifos |

El backend debe tener CORS habilitado para `http://localhost:5174`.

## Estructura del proyecto

```text
pic-generator-front/
├── Dockerfile                 # Imagen unificada (app + IOPaint)
├── docker-compose.yml
├── docker/
│   └── start.sh               # Arranque de los 3 servicios en contenedor
├── public/
│   └── logo/
├── src/
│   ├── api/
│   │   └── imageApi.js        # Llamadas a pic-generator-back
│   ├── components/
│   │   ├── AppTopBar/
│   │   ├── ClassificationTab/
│   │   ├── GenerationControls/
│   │   ├── ImageCard/
│   │   ├── MultipleImagesResult/
│   │   ├── ReconstructionTab/
│   │   ├── RestorationEditor/ # iframe → EDITOR_URL
│   │   ├── SidebarNav/
│   │   ├── SingleImageResult/
│   │   ├── TabInstructions/
│   │   └── ui/
│   ├── constants/
│   │   ├── config.js          # URLs, modelos GAN/ONNX
│   │   └── navModes.js        # Etiquetas e instrucciones por pestaña
│   ├── hooks/
│   │   └── useImageGenerator.js
│   ├── utils/
│   │   └── imageUtils.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
└── web_app_lama/              # Editor IOPaint (parte del repo)
    ├── docker back-end/       # Definición original de la API IOPaint
    ├── src/
    └── package.json
```

## Créditos

- [StyleGAN2-ADA-PyTorch](https://github.com/dvschultz/stylegan2-ada-pytorch) — generación GAN
- [IOPaint](https://github.com/Sanster/IOPaint) — restauración/inpainting (`web_app_lama`)
