# Web App LaMa (Frontend)

Frontend en **React + TypeScript + Vite** para una herramienta de *inpainting/outpainting* que consume un backend HTTP (por ejemplo, IOPaint u otro servicio compatible).

## Requisitos

- **Node.js**: recomendado **v18+** (el `Dockerfile` usa `node:22-alpine`)
- **npm**
- Un **backend** accesible que exponga los endpoints REST esperados (p. ej. `/api/v1/server-config`, `/api/v1/inpaint`, etc.)

## Configuración

### Variable de entorno `VITE_BACKEND`

Este proyecto usa la variable **`VITE_BACKEND`** para apuntar al backend en desarrollo.

- Crea un archivo `.env` en la raíz (o ajusta el existente) con algo como:

```bash
VITE_BACKEND=http://127.0.0.1:8080
```

> Nota: si ejecutas el frontend en Docker y el backend corre en tu máquina host, en Windows suele funcionar `http://host.docker.internal:8080`.

## Desarrollo local

Instala dependencias y levanta el servidor de desarrollo:

```bash
npm install
npm run dev
```

Luego abre `http://localhost:5173`.

## Build de producción

```bash
npm run build
npm run preview
```

## Docker

### Build de la imagen

`VITE_BACKEND` se inyecta en tiempo de build como `--build-arg`.

```bash
docker build --no-cache ^
  --build-arg VITE_BACKEND=http://127.0.0.1:8080 ^
  -t iopaint_front .
```

### Ejecutar el contenedor

```bash
docker run -d -p 5173:5173 --name iopaint_front_container iopaint_front
```

Abre `http://localhost:5173`.

## Back-End

En la carpeta docker back-end se encuentra un archivo Dockerfile, el cual se utiliza para construir la imagen mínima del backend. Esta imagen incluye el servicio de inpainting implementado con el modelo Big-Lama.

## Troubleshooting

### Error en producción/Docker (ej. `Cannot read properties of undefined (reading 'some')`)

Si en desarrollo funciona pero en Docker/producción falla, casi siempre es porque el frontend **no está apuntando al backend correcto**.

- Verifica que construiste la imagen con `--build-arg VITE_BACKEND=...`
- Verifica conectividad desde el navegador hacia el backend (CORS, URL y puertos)
- Si el backend está en el host, usa `host.docker.internal` (Windows/macOS) o configura una red/servicio en `docker-compose`.

## Créditos / Referencias

Este frontend incluye implementaciones/ideas basadas en:

- **IOPaint**: `https://github.com/Sanster/IOPaint?tab=readme-ov-file`

## Contacto

- **Nombre**: Giovanny Carreño  
- **Correo**: `hernan.carreno@uptc.edu.co`  
- **Institución**: Universidad Pedagógica y Tecnológica de Colombia  
- **Semillero**: Semillero de investigación GALASH