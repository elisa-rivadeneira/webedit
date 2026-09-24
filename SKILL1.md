# SKILL 1 — STACK TECNOLÓGICO DEL PROYECTO

## AI BUILD LAB — Proyecto "Mi Negocio" (página web editable + panel /admin)

---

# 1. RESUMEN

Este proyecto tiene dos partes que funcionan juntas pero por separado:

- **`client/`** → lo que se ve (la página web y el panel `/admin`).
- **`server/`** → el motor que guarda la información y las imágenes.

Cuando trabajamos en el proyecto, siempre deben estar las dos partes encendidas al mismo tiempo.

---

# 2. FRONTEND — `client/` (lo que se ve)

| Tecnología | Para qué sirve |
|---|---|
| **React 19** | Construye la interfaz (los botones, textos, imágenes) como piezas reutilizables llamadas "componentes". |
| **Vite 5** | Es el motor que enciende la página mientras la construimos y la convierte en archivos listos para publicar. |
| **React Router 7** | Decide qué se muestra según la dirección del navegador: `/` → página pública, `/admin` → panel de edición. |
| **Tailwind CSS 4** | Da estilo (colores, tamaños, espacios) escribiendo clases directamente en el código, sin archivos CSS separados. |
| **Axios** | Es el mensajero que le pide datos al servidor (por ejemplo, "tráeme el contenido actual del sitio"). |

**Dirección local:** http://localhost:5173

---

# 3. BACKEND — `server/` (el motor de datos)

| Tecnología | Para qué sirve |
|---|---|
| **Node.js 20** | El programa que ejecuta el servidor. |
| **Express 5** | Organiza las "rutas" del servidor: qué hacer cuando alguien pide iniciar sesión, guardar cambios, etc. |
| **Supabase (Postgres)** | La base de datos, pero **fuera** de nuestro servidor: vive siempre encendida en la nube, así que sobrevive aunque el servidor se apague y prenda (necesario para publicar en Vercel — ver sección 9). |
| **Supabase Storage** | El almacén de las imágenes que subes (logo, foto principal, promociones) — igual que la base de datos, vive fuera de nuestro servidor. |
| **jsonwebtoken + cookie-parser** | Reemplazan a las sesiones de toda la vida: crean una "llave firmada" (JWT) que se guarda en una cookie del navegador para recordar que iniciaste sesión en `/admin`, sin depender de la memoria del servidor. |
| **bcryptjs** | Guarda la contraseña del administrador de forma encriptada (nadie puede leerla directamente, ni mirando la base de datos). |
| **multer** | Recibe las imágenes que subes desde el formulario, en memoria, y se las pasa a Supabase Storage. |
| **dotenv** | Lee la configuración secreta del archivo `.env` (usuario admin, clave, llaves de Supabase). |
| **cors** | Permite que la página y el servidor se hablen entre sí de forma segura cuando corren en direcciones distintas (en desarrollo local). |

**Dirección local:** http://localhost:4000

> Antes usábamos SQLite (un solo archivo) y guardábamos las fotos en una carpeta del propio servidor. Eso cambió al decidir publicar en Vercel — ver sección 9.

---

# 4. CÓMO SE CONECTAN

```
Navegador
   │
   ▼
http://localhost:5173  (client — lo que ves)
   │
   │  pide datos / guarda cambios
   ▼
http://localhost:4000  (server — el motor)
   │
   ▼
Supabase (fuera de nuestro servidor, siempre encendido)
   ├── Postgres        → textos, enlaces, usuario
   └── Storage         → logo, foto principal, promociones
```

Mientras estamos construyendo, Vite redirige automáticamente todo lo que empieza con `/api` hacia el servidor (puerto 4000), así que en el navegador todo se ve como una sola dirección: `localhost:5173`. Las fotos ya no pasan por nuestro servidor — se ven directo desde la dirección pública de Supabase.

---

# 5. ESTRUCTURA DE CARPETAS

```
webedit/
├── client/                   → la página web y el panel /admin
│   └── src/
│       ├── pages/            → PublicPage, AdminLogin, AdminPanel
│       ├── components/       → header, hero, promociones, sidebar, etc.
│       ├── context/          → maneja si hay sesión iniciada o no
│       └── hooks/            → funciones reutilizables (traer datos, vista previa de imágenes)
│
└── server/                   → el motor de datos
    ├── supabase-schema.sql   → se pega UNA vez en Supabase para crear todo
    └── src/
        ├── app.js            → configuración de Express (se reusa en Vercel)
        ├── index.js          → enciende el servidor solo en tu computadora
        ├── routes/           → auth (login) y content (guardar/leer el sitio)
        ├── supabase.js       → conexión a Supabase
        ├── upload.js         → manejo de imágenes subidas
        └── seed.js           → crea el usuario administrador inicial

api/
└── index.js                  → "cable" que conecta server/src/app.js con Vercel

vercel.json                   → instrucciones para que Vercel publique el proyecto
```

---

# 6. AUTENTICACIÓN (cómo funciona el login de /admin)

1. El administrador escribe usuario y contraseña en `/admin`.
2. El servidor compara la contraseña (encriptada) con la guardada en Supabase.
3. Si es correcta, el servidor firma una "llave" (JWT) con esos datos y se la entrega al navegador dentro de una cookie.
4. En cada visita, el servidor revisa que esa llave sea válida y no haya expirado (dura 8 horas).

No hay niveles de permisos ni usuarios múltiples, es intencionalmente simple.

---

# 7. POR QUÉ ESTE STACK (y no otro)

- Es un proyecto **pequeño y de un solo negocio**, así que no se usó nada pensado para sistemas grandes (no hay Next.js, no hay microservicios).
- **Vite + React** es rápido de construir y de mantener, ideal para una página con pocas secciones.
- **Vercel + Supabase** se eligieron porque es la combinación más simple y más enseñada para publicar gratis un proyecto así, con solo dos servicios externos que configurar (uno para mostrar la página, otro para los datos y las fotos).
- Todo se puede probar en la misma computadora mientras se construye (`localhost`) antes de publicarlo — ver sección 9.

---

# 8. VARIABLES DE CONFIGURACIÓN (`server/.env`)

| Variable | Para qué es |
|---|---|
| `PORT` | En qué puerto corre el servidor en tu computadora (4000 por defecto). |
| `CLIENT_ORIGIN` | Desde qué dirección se permite pedir datos (la página). |
| `SUPABASE_URL` | La dirección de tu proyecto de Supabase. |
| `SUPABASE_SERVICE_ROLE_KEY` | La llave que le da permiso a tu servidor (nunca al navegador) de leer y escribir en Supabase. |
| `JWT_SECRET` | Un texto secreto y aleatorio usado para firmar la llave de sesión del login. |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Usuario y clave inicial del administrador (se usan solo al crear el usuario con `npm run seed`). |

Este archivo nunca se sube a Git ni se comparte — es privado del proyecto. Cuando se publica en Vercel, estas mismas variables se vuelven a escribir (no se copian solas) en **Vercel → Settings → Environment Variables**.

---

# 9. PUBLICAR EL PROYECTO (deploy)

El destino elegido es **Vercel** (para la página) + **Supabase** (para los datos y las fotos). La receta completa, paso a paso, está en **`SKILL3.md`**.

En corto: Vercel no mantiene un servidor prendido con disco propio como sí lo hace tu computadora — por eso la base de datos y las fotos no pueden vivir en un archivo local, y se movieron a Supabase, que sí está siempre encendido y vive aparte de Vercel.
