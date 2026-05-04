# Asme — Club de Lectura

Plataforma completa de club de lectura construida con React + TypeScript + Vite + Tailwind CSS + Framer Motion + Express + MongoDB.

---

## Tecnologías

### Frontend
| Paquete | Uso |
|---|---|
| React 19 + TypeScript | UI |
| Vite 8 | Bundler y dev server |
| Tailwind CSS 3 | Estilos utilitarios |
| Framer Motion | Animaciones de scroll |
| Lucide React | Iconos |
| React Router DOM | Navegación entre páginas |

### Backend
| Paquete | Uso |
|---|---|
| Express | Servidor API REST |
| Mongoose | ODM para MongoDB |
| bcryptjs | Hash de contraseñas |
| jsonwebtoken | Auth con JWT |
| multer | Subida de imágenes |

---

## Configuración inicial

### 1. Crear archivo `.env`
Copia `.env.example` a `.env` y rellena los valores:
```
MONGODB_URI=mongodb://localhost:27017/asme-club
JWT_SECRET=cambia-esta-clave-por-una-muy-segura
PORT=3001
CLIENT_URL=http://localhost:5173
```
Para usar MongoDB Atlas (nube) reemplaza `MONGODB_URI` con la cadena de conexión de tu cluster.

### 2. Crear el primer administrador
Ejecuta el script de seed **una sola vez**:
```bash
npm run seed
```
Crea el usuario `admin@asme.club` con contraseña `Admin123!`.
**Cambia la contraseña desde el panel Admin → Miembros después del primer login.**

### 3. Iniciar el proyecto
```bash
npm run dev:all   # Inicia frontend (5173) y backend (3001) juntos
```
O por separado:
```bash
npm run dev        # Solo frontend
npm run dev:server # Solo backend (con nodemon)
```

### 4. Agregar miembros
Desde el panel **Admin → Miembros → Crear miembro** puedes crear los participantes directamente. Defines usuario, correo y contraseña inicial.

---

## Comandos

```bash
npm run dev      # Inicia el servidor de desarrollo en http://localhost:5173
npm run build    # Compila para producción (tsc + vite build)
npm run preview  # Previsualiza el build de producción
npm run lint     # Ejecuta ESLint
npm run seed     # Crea el usuario administrador inicial (ejecutar una sola vez)
```

---

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Landing page principal |
| `/login` | Público | Inicio de sesión |
| `/blog` | Público | Listado del Blog Gastronómico |
| `/blog/:slug` | Público | Artículo individual |
| `/dashboard` | Miembro autenticado | Inicio del club — libro actual + historial |
| `/libro/:id` | Miembro autenticado | Foro de discusión del libro |
| `/admin` | Administrador | Panel de administración |

---

## Estructura de archivos

```
readingGroup/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── .env
├── server/
│   ├── index.js                      # Entrada Express + conexión MongoDB
│   ├── seed.js                       # Crea el primer admin (ejecutar una vez)
│   ├── uploads/                      # Imágenes subidas (portadas, artículos)
│   ├── middleware/
│   │   └── auth.js                   # JWT — authenticate + requireAdmin
│   ├── models/
│   │   ├── User.js                   # Usuario (admin | member)
│   │   ├── Book.js                   # Libro del club
│   │   ├── Post.js                   # Mensaje del foro
│   │   ├── Meeting.js                # Link de reunión semanal
│   │   └── Article.js                # Artículo del Blog Gastronómico
│   └── routes/
│       ├── auth.js                   # POST /login, GET /me
│       ├── books.js                  # CRUD libros + marcar como actual
│       ├── posts.js                  # CRUD mensajes del foro
│       ├── meeting.js                # GET / POST link de reunión
│       ├── users.js                  # CRUD miembros
│       └── articles.js               # CRUD artículos del blog
└── src/
    ├── main.tsx
    ├── index.css                     # Tailwind + .liquid-glass + scroll suave
    ├── App.tsx                       # Router + AuthProvider + todas las rutas
    ├── lib/
    │   └── api.ts                    # Fetch wrapper con JWT
    ├── types/
    │   └── index.ts                  # Interfaces TypeScript (Profile, Book, Post, MeetingLink, Article)
    ├── context/
    │   └── AuthContext.tsx           # Estado global de autenticación
    ├── components/
    │   ├── AppNav.tsx                # Navbar de páginas autenticadas
    │   ├── ProtectedRoute.tsx        # Guard de rutas privadas
    │   ├── PostCard.tsx              # Tarjeta de mensaje del foro
    │   ├── PostForm.tsx              # Formulario de nuevo mensaje
    │   ├── AboutSection.tsx          # Sección "Sobre Nosotros" (id="nosotros")
    │   ├── FeaturedVideoSection.tsx  # Sección video destacado
    │   ├── PhilosophySection.tsx     # Sección "Innovación x Visión"
    │   ├── ServicesSection.tsx       # Sección "Qué hacemos"
    │   ├── BlogSection.tsx           # Últimas 3 entradas del blog (landing)
    │   ├── EventsSection.tsx         # Sección "Próximos eventos" (id="eventos")
    │   └── ContactSection.tsx        # Sección "Contacto" (id="contacto")
    └── pages/
        ├── LandingPage.tsx           # Ensambla todas las secciones de la landing
        ├── Index.tsx                 # Hero + Navbar de la landing
        ├── Login.tsx                 # Página de inicio de sesión
        ├── Dashboard.tsx             # Inicio del club (libro actual + historial)
        ├── BookForum.tsx             # Foro de discusión de un libro
        ├── AdminPanel.tsx            # Panel admin (4 pestañas)
        ├── Blog.tsx                  # Listado público del blog
        └── ArticleDetail.tsx         # Artículo individual del blog
```

---

## API REST — Endpoints

### Autenticación (`/api/auth`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/login` | No | Iniciar sesión, devuelve JWT |
| GET | `/me` | JWT | Perfil del usuario autenticado |

### Libros (`/api/books`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | JWT | Listar todos los libros |
| GET | `/:id` | JWT | Obtener un libro por ID |
| POST | `/` | Admin | Crear libro (multipart con portada) |
| PATCH | `/:id/current` | Admin | Marcar como libro del mes |
| DELETE | `/:id` | Admin | Eliminar libro |

### Mensajes del foro (`/api/posts`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/book/:bookId` | JWT | Mensajes de un libro |
| POST | `/` | JWT | Crear mensaje (multipart con imagen opcional) |
| DELETE | `/:id` | JWT (propio) / Admin | Eliminar mensaje |

### Reunión semanal (`/api/meeting`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | JWT | Obtener link activo |
| POST | `/` | Admin | Publicar nuevo link |

### Miembros (`/api/users`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | Admin | Listar miembros |
| POST | `/` | Admin | Crear nuevo miembro |
| PATCH | `/:id/role` | Admin | Cambiar rol (admin/member) |
| DELETE | `/:id` | Admin | Eliminar miembro |

### Blog Gastronómico (`/api/articles`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/` | **Público** | Listar artículos publicados |
| GET | `/:slug` | **Público** | Obtener artículo por slug |
| POST | `/` | Admin | Crear artículo (multipart con portada) |
| DELETE | `/:id` | Admin | Eliminar artículo |

---

## Modelos de datos (MongoDB)

### `User`
```
username     String (único)
email        String (único)
passwordHash String
fullName     String
role         'admin' | 'member'
timestamps
```

### `Book`
```
title        String
author       String
coverUrl     String | null
description  String | null
month        Number (1–12)
year         Number
isCurrent    Boolean (solo uno puede ser true)
timestamps
```

### `Post`
```
bookId       ObjectId → Book
author       ObjectId → User (populated: username, fullName)
content      String
imageUrl     String | null
linkUrl      String | null
timestamps
```

### `Meeting`
```
url          String
label        String
createdBy    ObjectId → User
timestamps
```

### `Article`
```
title        String
slug         String (único, auto-generado desde el título)
excerpt      String
content      String
coverUrl     String | null
category     String
authorName   String (default: 'Asme Club')
published    Boolean (default: true)
timestamps
```

---

## Descripción de archivos clave

### `src/index.css`
- Importa la fuente **Instrument Serif** desde Google Fonts.
- Incluye `@tailwind base/components/utilities`.
- Activa `scroll-behavior: smooth` en `html` para que los anclas del navbar funcionen suavemente.
- Define la clase reutilizable **`.liquid-glass`**: `backdrop-filter: blur`, fondo casi transparente y borde degradado mediante `::before` con `mask-composite: exclude`.

### `src/App.tsx`
Router principal. Rutas públicas: `/`, `/login`, `/blog`, `/blog/:slug`. Rutas protegidas: `/dashboard`, `/libro/:id`, `/admin`.

### `src/lib/api.ts`
Wrapper de `fetch` con JWT automático desde `localStorage`. Métodos: `api.get`, `api.post`, `api.patch`, `api.delete`, `api.upload` (multipart).

### `src/context/AuthContext.tsx`
Provee `{ profile, loading, signIn, signOut }`. Al iniciar verifica el token almacenado en `localStorage` llamando a `GET /api/auth/me`.

### `server/middleware/auth.js`
- `authenticate` — verifica el JWT en el header `Authorization: Bearer <token>` y adjunta `req.user`.
- `requireAdmin` — verifica que `req.user.role === 'admin'`.

---

## Landing page — Secciones

| Componente | ID de ancla | Descripción |
|---|---|---|
| `Index.tsx` | — | Hero a pantalla completa con video de fondo y navbar |
| `AboutSection.tsx` | `#nosotros` | "Sobre Nosotros" con animación de entrada |
| `FeaturedVideoSection.tsx` | — | Video destacado con overlay |
| `PhilosophySection.tsx` | — | "Innovación x Visión" dos columnas |
| `ServicesSection.tsx` | — | "Qué hacemos" dos tarjetas con video |
| `BlogSection.tsx` | `#blog` | Últimas 3 entradas del Blog Gastronómico |
| `EventsSection.tsx` | `#eventos` | Próximos eventos del club |
| `ContactSection.tsx` | `#contacto` | Formulario de contacto |

### Navbar (landing)

| Enlace | Destino |
|---|---|
| Club de Lectura | `/dashboard` (página del club) |
| Nosotros | `#nosotros` (ancla en la misma página) |
| Blog Gastronómico | `/blog` (página del blog) |
| Próximos eventos | `#eventos` (ancla en la misma página) |
| Contacto | `#contacto` (ancla en la misma página) |
| Iniciar sesión | `/login` |

> El acceso al club es **solo por invitación**. El botón "Registrarse" fue eliminado del navbar. Los miembros son creados por el administrador desde **Admin → Miembros → Crear miembro**.

---

## Panel de administración — Pestañas

| Pestaña | Descripción |
|---|---|
| **Libros** | Registrar libros con portada, marcar el libro del mes actual, eliminar |
| **Reunión** | Publicar el link semanal de videollamada (Google Meet, Zoom, Teams…) |
| **Miembros** | Crear miembros, cambiar rol admin/member, eliminar |
| **Blog** | Crear y eliminar artículos del Blog Gastronómico con portada e imagen |

---

## Blog Gastronómico

### Flujo de publicación
1. Admin accede a **Panel Admin → Blog → Nuevo artículo**.
2. Rellena título, categoría, autor, extracto, contenido y portada (imagen).
3. El slug se genera automáticamente desde el título (sin tildes ni espacios).
4. El artículo aparece de inmediato en `/blog` y en la sección del blog de la landing.

### Acceso público
Los endpoints `GET /api/articles` y `GET /api/articles/:slug` son públicos y no requieren autenticación, por lo que el blog es visible para cualquier visitante de la web.

---

## Clase `.liquid-glass` — dónde se usa

| Elemento | Componente |
|---|---|
| Navbar (píldora) | `Index.tsx`, `Blog.tsx`, `ArticleDetail.tsx` |
| Botón "Iniciar sesión" | `Index.tsx` |
| Input de email (píldora) | `Index.tsx` |
| Botón "Lee nuestro manifiesto" | `Index.tsx` |
| Iconos sociales | `Index.tsx` |
| Tarjeta "Nuestro Enfoque" | `FeaturedVideoSection.tsx` |
| Botón "Explorar más" | `FeaturedVideoSection.tsx` |
| Tarjetas de servicios | `ServicesSection.tsx` |
| Tarjetas del blog | `BlogSection.tsx`, `Blog.tsx` |
| Tarjetas del panel admin | `AdminPanel.tsx` |
| Sección de contacto | `ContactSection.tsx` |

---

## Videos (CloudFront)

| Sección | Variable | Archivo |
|---|---|---|
| Hero (fondo) | `HERO_VIDEO` | `src/pages/Index.tsx` |
| Video Destacado | `FEATURED_VIDEO` | `src/components/FeaturedVideoSection.tsx` |
| Filosofía (columna izq.) | `PHILOSOPHY_VIDEO` | `src/components/PhilosophySection.tsx` |
| Servicios — Tarjeta 1 | `CARD_1_VIDEO` | `src/components/ServicesSection.tsx` |
| Servicios — Tarjeta 2 | `CARD_2_VIDEO` | `src/components/ServicesSection.tsx` |

---

## Fuente tipográfica

**Instrument Serif** cargada desde Google Fonts en `src/index.css`.
Se aplica con `style={{ fontFamily: "'Instrument Serif', serif" }}` en `<h1>`, `<h2>` y `<h3>`.
Para la versión **italic**, agregar `className="italic"` o usar `<em>`.
# moreperezmontemayor
