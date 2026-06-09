# Stack frontend-only:
#   App principal :5174 | Editor frontend :5173
#
#   docker build -f Dockerfile -t pic-generator-front-stack .
#   docker run -p 5174:5174 -p 5173:5173 pic-generator-front-stack

# Main frontend
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

# Editor frontend
FROM node:22-alpine AS editor-front
WORKDIR /app

COPY web_app_lama/package.json web_app_lama/package-lock.json ./
RUN npm ci

COPY web_app_lama/ ./
ARG VITE_BACKEND=http://127.0.0.1:8080
ENV VITE_BACKEND=$VITE_BACKEND
RUN npm run build

# Runtime: static frontend assets only
FROM node:22-alpine
WORKDIR /app

COPY --from=main-front /app/dist /app/main/dist
COPY --from=editor-front /app/dist /app/editor/dist

COPY docker/server.mjs /app/server.mjs
COPY docker/start.sh /app/start.sh
RUN sed -i 's/\r$//' /app/start.sh && chmod +x /app/start.sh

EXPOSE 5174 5173

HEALTHCHECK --interval=30s --timeout=10s \
  CMD wget -qO- http://localhost:5174/ >/dev/null || exit 1

ENTRYPOINT []
CMD ["/bin/sh", "/app/start.sh"]

RUN test -f /app/start.sh && test -f /app/server.mjs && test -f /app/main/dist/index.html && test -f /app/editor/dist/index.html
