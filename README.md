# Arte rupestre - Frontends

Aplicacion React para generar, restaurar, reconstruir y clasificar imagenes de arte rupestre. Este repositorio contiene dos proyectos frontend:

- App principal en la raiz del repo.
- Editor frontend en `web_app_lama/`.

El backend de generacion, reconstruccion y clasificacion corre aparte, por defecto en `http://localhost:8000`.

## Pestañas

| Pestaña | Descripcion |
|---------|-------------|
| Imagen individual | Genera un pictograma o petroglifo con seed, truncation PSI y noise mode. |
| Multiples imagenes | Genera de 1 a 10 imagenes con seeds aleatorios. |
| Restauracion de pictogramas | Abre el editor frontend embebido. |
| Reconstruccion | Segmentacion ONNX a 256x256 y 512x512 con simulacion sobre roca. |
| Clasificacion | Predice si la imagen es pictograma o petroglifo con nivel de confianza. |

## Servicios

| Servicio | Puerto | Ubicacion |
|----------|--------|-----------|
| App principal | `5174` | Raiz del proyecto |
| Editor frontend | `5173` | `web_app_lama/` |
| API GAN / ONNX / clasificacion | `8000` | `rockart-platform-back` externo |

## Tecnologias

- React
- Vite
- Tailwind CSS
- lucide-react

## Configuracion

La app principal usa estas variables de Vite:

```env
VITE_API_URL=http://localhost:8000
VITE_EDITOR_URL=http://localhost:5173
```

`VITE_API_URL` apunta al backend externo. `VITE_EDITOR_URL` apunta al segundo frontend.

## Desarrollo local

Ejecuta la app principal:

```bash
npm install
npm run dev
```

La app principal queda disponible en:

```text
http://localhost:5174
```

Ejecuta el editor frontend:

```bash
cd web_app_lama
npm install
npm run dev
```

El editor frontend queda disponible en:

```text
http://localhost:5173
```

Levanta el backend externo en su propio repositorio:

```bash
uvicorn service:app --host 0.0.0.0 --port 8000
```

Servicios necesarios por pestaña:

| Pestaña | Servicios requeridos |
|---------|----------------------|
| Imagen individual / Multiples imagenes | `:5174` + `:8000` |
| Restauracion | `:5174` + `:5173` |
| Reconstruccion / Clasificacion | `:5174` + `:8000` |

## Scripts

En la raiz:

```bash
npm run dev       # Servidor de desarrollo en :5174
npm run build     # Build de produccion
npm run preview   # Vista previa del build
npm run lint      # ESLint
```

En `web_app_lama/`:

```bash
npm run dev       # Servidor de desarrollo en :5173
npm run build     # Build de produccion
npm run preview   # Vista previa del build
npm run lint      # ESLint
```

## Docker

Docker construye e instala solo los dos proyectos frontend. La imagen final es Node Alpine y sirve los builds estaticos en los puertos `5174` y `5173`.

Build manual:

```bash
docker build -f Dockerfile -t pic-generator-front-stack --build-arg VITE_EDITOR_URL=http://localhost:5173 --build-arg VITE_BACKEND=http://127.0.0.1:8080 .
docker run -p 5174:5174 -p 5173:5173 pic-generator-front-stack
```

Puertos publicados:

| Puerto | Servicio |
|--------|----------|
| `5174` | App principal |
| `5173` | Editor frontend |

## API del backend externo

El frontend consume estos endpoints en `VITE_API_URL`, por defecto `http://localhost:8000`:

| Metodo | Ruta | Descripcion |
|--------|------|-------------|
| `POST` | `/generateSingle` | Genera una imagen GAN. Body JSON: `seed`, `truncation_psi`, `noise_mode`, `model`. |
| `POST` | `/generateSeveral` | Genera varias imagenes. Body JSON: `number`, `truncation_psi`, `noise_mode`, `model`. |
| `POST` | `/comparar` | Compara segmentacion ONNX 256x256 vs 512x512. Multipart: `imagen`, `model`. |
| `POST` | `/clasificar` | Clasifica una imagen. Multipart: `imagen`. |

Valores de `model`:

| Uso | Valor API | Significado en UI |
|-----|-----------|-------------------|
| GAN | `pictos512` | Pictogramas |
| GAN | `pictos512_2` | Petroglifos |
| ONNX (`/comparar`) | `mejor_modelo_dinamico` | Pictogramas |
| ONNX (`/comparar`) | `modelo_dinamico_gab` | Petroglifos |

El backend externo debe tener CORS habilitado para `http://localhost:5174`.

## Estructura del proyecto

```text
rockart-platform-front/
├── dockerfile
├── docker-compose.yml
├── docker/
│   └── start.sh
├── public/
├── src/
│   ├── api/
│   ├── components/
│   ├── constants/
│   ├── hooks/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
└── web_app_lama/
    ├── public/
    ├── src/
    ├── package.json
    └── vite.config.ts
```

## Creditos

- StyleGAN2-ADA-PyTorch: generacion GAN.

## Link repositorio del backend

- https://github.com/GiovannyCarreno/rockart-platform-back