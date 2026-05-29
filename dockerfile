# Stack unificado (pic-generator-front):
#   App principal :5174 | Editor IOPaint :5173 | API IOPaint :8080
#
#   docker compose up --build
#   docker run --gpus all -p 5174:5174 -p 5173:5173 -p 8080:8080 pic-generator-front-stack

# ── App principal ───────────────────────────────────────────────────────────
FROM node:22-alpine AS main-front
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.js eslint.config.js LICENSE.txt ./
COPY src ./src/
COPY public ./public/

ARG VITE_EDITOR_URL=http://localhost:5173
ENV VITE_EDITOR_URL=$VITE_EDITOR_URL

RUN test -f src/main.jsx
RUN npm run build

# ── Editor IOPaint (UI) ─────────────────────────────────────────────────────
FROM node:22-alpine AS editor-front
WORKDIR /app

COPY web_app_lama/package.json web_app_lama/package-lock.json ./
RUN npm ci

COPY web_app_lama/ ./

ARG VITE_BACKEND=http://localhost:8080
ENV VITE_BACKEND=$VITE_BACKEND

RUN npm run build

# ── Runtime: IOPaint (CUDA) + estáticos ───────────────────────────────────────
# Ubuntu 22.04 → Python 3.10+ (requerido por torch/iopaint actuales)
FROM nvidia/cuda:11.8.0-runtime-ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive \
    PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    libsm6 libxext6 ffmpeg libfontconfig1 libxrender1 libgl1 \
    curl ca-certificates python3 python3-pip \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && npm install -g serve \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

RUN pip3 install --upgrade pip setuptools wheel && \
    pip3 install torch==2.1.2 torchvision==0.16.2 \
      --index-url https://download.pytorch.org/whl/cu118 && \
    pip3 install iopaint

COPY --from=main-front /app/dist /app/main/dist
COPY --from=editor-front /app/dist /app/editor/dist

COPY docker/start.sh /app/start.sh
RUN sed -i 's/\r$//' /app/start.sh && chmod +x /app/start.sh

VOLUME ["/root/.cache"]

EXPOSE 5174 5173 8080

HEALTHCHECK --interval=30s --timeout=10s \
  CMD curl -f http://localhost:8080/ || exit 1

# Sin ENTRYPOINT heredado; no usar npm start (no existe en package.json)
ENTRYPOINT []
CMD ["/bin/bash", "/app/start.sh"]

# Comprobar que la imagen final es la unificada (no node:18-alpine antigua)
RUN test -f /app/start.sh && test -f /app/main/dist/index.html && test -f /app/editor/dist/index.html
