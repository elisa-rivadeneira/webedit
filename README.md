# Mi Negocio — Página web editable

Página web pública de un solo escaparate digital (header, sección principal, promociones, redes sociales, pie de página) con un panel `/admin` sencillo para que el dueño del negocio actualice su contenido sin conocimientos técnicos.

## Estructura

```
server/   API (Express + SQLite) — auth, contenido, subida de imágenes
client/   Frontend (React + Vite + Tailwind) — página pública + /admin
```

## Requisitos

- Node.js 18+ (probado con Node 20)

## Puesta en marcha

### 1. Backend

```bash
cd server
npm install
cp .env.example .env
npm run seed     # crea el usuario admin (ver credenciales abajo)
npm run dev      # http://localhost:4000
```

Credenciales por defecto (configurables en `.env` antes de correr `npm run seed`):

- Usuario: `admin`
- Contraseña: `admin123`

### 2. Frontend

En otra terminal:

```bash
cd client
npm install
npm run dev       # http://localhost:5173
```

Abre `http://localhost:5173` para la página pública y `http://localhost:5173/admin` para el panel de administración.

## Producción

```bash
cd client && npm run build   # genera client/dist
cd server && npm start       # sirve la API en el puerto configurado
```

Sirve `client/dist` con tu servidor web o proxy habitual, apuntando `/api` y `/uploads` al backend.

## Qué se puede editar desde /admin

- Logo
- Texto principal (título) y texto secundario (descripción) de la sección principal
- Imagen principal (fondo de la sección principal)
- Imagen de Promoción 1 y Promoción 2 (imágenes completas, ya diseñadas)
- Enlaces de WhatsApp, Instagram, Facebook y TikTok

Todos los cambios se aplican solo al presionar **Guardar cambios**.
