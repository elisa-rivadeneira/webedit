# Mi Negocio — Página web editable

Página web pública de un solo escaparate digital (header, sección principal, promociones, redes sociales, pie de página) con un panel `/admin` sencillo para que el dueño del negocio actualice su contenido sin conocimientos técnicos.

## Estructura

```
server/   API (Express) — auth, contenido, subida de imágenes
client/   Frontend (React + Vite + Tailwind) — página pública + /admin
api/      Punto de entrada para publicar el backend en Vercel
```

Datos e imágenes se guardan en **Supabase** (Postgres + Storage), no en archivos locales — necesario para poder publicar en Vercel. Ver `SKILL1.md` para el detalle del stack y `SKILL3.md` para la receta completa de despliegue.

## Requisitos

- Node.js 18+ (probado con Node 20)
- Una cuenta gratuita en [Supabase](https://supabase.com)

## Puesta en marcha

### 1. Crear el proyecto en Supabase

1. Crea una cuenta/proyecto en supabase.com.
2. Ve a **SQL Editor** → **New query**, pega todo el contenido de `server/supabase-schema.sql` y dale **Run**. Esto crea las tablas y el bucket de fotos.
3. Ve a **Settings → API** y copia el **Project URL** y la llave **`service_role`**.

### 2. Backend

```bash
cd server
npm install
cp .env.example .env
# Edita .env y pega SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY
npm run seed     # crea el usuario admin (ver credenciales abajo)
npm run dev      # http://localhost:4000
```

Credenciales por defecto (configurables en `.env` antes de correr `npm run seed`):

- Usuario: `admin`
- Contraseña: `admin123`

### 3. Frontend

En otra terminal:

```bash
cd client
npm install
npm run dev       # http://localhost:5173
```

Abre `http://localhost:5173` para la página pública y `http://localhost:5173/admin` para el panel de administración.

## Publicar (deploy)

Receta completa paso a paso en **`SKILL3.md`**. En resumen: subir el repositorio a GitHub, importarlo en Vercel (ya trae `vercel.json` configurado), y agregar en Vercel las mismas variables de entorno que tienes en `server/.env`.

## Qué se puede editar desde /admin

- Logo
- Texto principal (título) y texto secundario (descripción) de la sección principal
- Imagen principal (fondo de la sección principal)
- Imagen de Promoción 1 y Promoción 2 (imágenes completas, ya diseñadas)
- Enlaces de WhatsApp, Instagram, Facebook y TikTok

Todos los cambios se aplican solo al presionar **Guardar cambios**.
