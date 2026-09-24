# SKILL 3 — RECETA: PÁGINA EDITABLE EN VERCEL + SUPABASE

## AI BUILD LAB — Receta reutilizable para publicar rápido en un webinar/demo

---

# 1. PROPÓSITO

Esta skill documenta la receta completa para construir y publicar, en una sola sesión de demo, una página web pequeña con un panel `/admin` editable, usando **Vercel** (para mostrar la página) + **Supabase** (para guardar los datos y las fotos).

Está pensada para que, en un proyecto nuevo, baste con dar:

1. **El prompt de especificación** (como `PROJECT.md`);
2. **Una captura de referencia visual** (la imagen del diseño esperado);
3. **Esta skill** (`SKILL3.md`) + `SKILL1.md` (stack) + `SKILL2.md` (cómo hablarle al estudiante);

...para que Claude Code construya el proyecto completo, ya listo para Vercel + Supabase, sin tener que redescubrir esta arquitectura desde cero cada vez.

---

# 2. POR QUÉ ESTA COMBINACIÓN (resumen de las decisiones)

- **Vercel no tiene disco permanente.** Un archivo de base de datos de un solo archivo (tipo SQLite) no sirve ahí, porque se borra cada vez que Vercel apaga esa copia temporal del servidor. Ver [[feedback-vercel-sqlite-incompatibility]].
- **Supabase** resuelve dos problemas con un solo servicio gratuito: da una base de datos (Postgres) que vive siempre encendida en otro lugar, Y un almacén de archivos (Storage) para las fotos — así solo hay que explicar un servicio externo, no dos.
- **Las sesiones de login tampoco sobreviven en Vercel** (no hay memoria compartida entre una visita y otra), así que el login se hace con una "llave firmada" (JWT) guardada en una cookie, en vez de con `express-session`.
- El código de las rutas (`Express`) se reutiliza tal cual tanto en local como en Vercel: se separa la configuración de la app (`server/src/app.js`, sin `.listen()`) del arranque local (`server/src/index.js`, que sí llama `.listen()`), y se agrega un archivo mínimo `api/index.js` en la raíz que Vercel reconoce automáticamente.

---

# 3. ARQUITECTURA FINAL

```
Navegador
   │
   ▼
Vercel (dominio público)
   ├── / , /admin           → client/dist (React ya construido)
   └── /api/*               → api/index.js → server/src/app.js (Express)
                                     │
                                     ▼
                              Supabase (fuera de Vercel, siempre encendido)
                                ├── Postgres: site_content, social_links, admin_users
                                └── Storage (bucket "uploads", público): logo, hero, promo1, promo2
```

En desarrollo local, `client` (puerto 5173) y `server` (puerto 4000) corren por separado, y Vite redirige `/api` de uno al otro. En Vercel, todo vive bajo el mismo dominio: no hace falta esa redirección manual.

---

# 4. ESTRUCTURA DE ARCHIVOS QUE HABILITA ESTO

```
proyecto/
├── vercel.json              → le dice a Vercel cómo instalar, construir y enrutar /api
├── api/
│   └── index.js             → module.exports = require('../server/src/app')
├── client/                  → React + Vite (sin cambios por el deploy)
└── server/
    ├── supabase-schema.sql  → SQL para pegar UNA vez en Supabase (tablas + bucket)
    └── src/
        ├── app.js           → configuración de Express (SIN app.listen)
        ├── index.js         → arranque local (SÍ hace app.listen, solo para tu compu)
        ├── supabase.js      → cliente de Supabase (usa la llave service_role)
        ├── seed.js          → crea/actualiza el usuario administrador
        ├── upload.js        → multer en memoria + sube a Supabase Storage
        ├── middleware/requireAuth.js  → verifica el JWT de la cookie
        └── routes/
            ├── auth.js      → login/logout/me usando JWT en cookie
            └── content.js   → lee/escribe site_content y social_links en Supabase
```

---

# 5. `vercel.json` (plantilla)

```json
{
  "installCommand": "npm --prefix server install && npm --prefix client install",
  "buildCommand": "npm --prefix client run build",
  "outputDirectory": "client/dist",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api" }
  ]
}
```

---

# 6. PASOS PARA UN ESTUDIANTE (guion de webinar)

1. **Crear cuenta en Supabase** (con GitHub, sin tarjeta) → "New project" → elegir nombre, contraseña de base de datos (guardarla) y región.
2. **SQL Editor → New query** → pegar todo `server/supabase-schema.sql` → **Run**. Esto crea las tablas y el bucket de fotos en un solo paso.
3. **Settings → API** → copiar **Project URL** y la llave **`service_role`** (nunca la `anon public` para el backend, y nunca pegar esta llave en un chat o repositorio público).
4. Pegar esos dos valores en `server/.env` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`). El `JWT_SECRET` se puede generar una vez con:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
5. Correr `npm run seed` dentro de `server/` para crear el usuario administrador.
6. Probar todo en local (`npm run dev` en `server/` y en `client/`) antes de publicar.
7. **Subir el proyecto a GitHub** → en Vercel, "Add New Project" → importar ese repositorio (ya detecta `vercel.json` automáticamente).
8. En Vercel → **Settings → Environment Variables**, agregar las mismas variables que están en `server/.env` (`SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, y `CLIENT_ORIGIN` con la URL real que Vercel asigna).
9. Deploy. Probar `/` y `/admin` en la URL pública.

---

# 7. ERRORES COMUNES A EVITAR

- Usar la llave `anon public` en el servidor → las tablas tienen seguridad (RLS) activada y bloquean todo lo que no sea la llave `service_role`, así que con la llave equivocada todo falla con errores de permisos.
- Olvidar correr `supabase-schema.sql` antes de `npm run seed` → el seed falla porque las tablas no existen todavía.
- Pegar llaves de Supabase directamente en el chat o subirlas a GitHub → deben vivir solo en `.env` (local) o en las variables de entorno de Vercel (nube), nunca en el código.
- Olvidar agregar las variables de entorno también DENTRO de Vercel (no basta con tenerlas en tu `.env` local — Vercel no lo lee, cada entorno tiene las suyas).
