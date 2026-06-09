# Web App LaMa - Frontend

Frontend React + TypeScript + Vite para el editor embebido de restauracion.

## Requisitos

- Node.js 18 o superior
- npm

## Desarrollo local

```bash
npm install
npm run dev
```

Abre:

```text
http://localhost:5173
```

## Build de produccion

```bash
npm run build
npm run preview
```

## Docker

Este proyecto no se construye como imagen independiente. El `dockerfile` de la raiz del repositorio construye la app principal y este frontend en una sola imagen.

Desde la raiz:

```bash
docker compose up --build
```

El frontend queda publicado en:

```text
http://localhost:5173
```
