# moreperezmontemayor — Club de Lectura

Plataforma completa de club de lectura construida con React + TypeScript + Vite + Tailwind CSS + Framer Motion + Express + MongoDB.

## URLs en producción

| Servicio | URL |
|---|---|
| Landing page | https://moreperezmontemayor.vercel.app |
| Login | https://moreperezmontemayor.vercel.app/login |
| Blog | https://moreperezmontemayor.vercel.app/blog |
| API (backend) | https://moreperezmontemayor.onrender.com |
| Health check | https://moreperezmontemayor.onrender.com/api/health |

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

### Infraestructura (gratuita)
| Servicio | Uso |
|---|---|
| Vercel | Frontend (React/Vite) |
| Render | Backend (Express/Node.js) |
| MongoDB Atlas M0 | Base de datos |
| UptimeRobot | Monitor cada 5 min para evitar que Render se duerma |

---

## Configuración local

### 1. Crear archivo `.env`
```
MONGODB_URI=mongodb://localhost:27017/moreperezmontemayor
JWT_SECRET=cambia-esta-clave-por-una-muy-segura
PORT=3001
CLIENT_URL=http://localhost:5173
```
Para producción usar la URI de MongoDB Atlas.

### 2. Crear el primer administrador
Ejecutar **una sola vez**:
```bash
npm run seed
```
Crea el usuario `admin@moreperezmontemayor.com` con contraseña `Admin123!`.
**Cambiar la contraseña desde Admin → Miembros → botón Contraseña.**

### 3. Iniciar el proyecto
```bash
npm run dev:all   # Frontend (5173) + backend (3001) juntos
```
O por separado:
```bash
npm run dev        # Solo frontend
npm run dev:server # Solo backend (con nodemon)
```

---

## Comandos

```bash
npm run dev:all  # Inicia frontend y backend juntos
npm run dev      # Solo frontend en http://localhost:5173
npm run build    # Compila para producción (tsc + vite build)
npm run preview  # Previsualiza el build de producción
npm run lint     # Ejecuta ESLint
npm run seed     # Crea el usuario administrador inicial (una sola vez)
```

---

## Rutas de la aplicación

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Landing page principal |
| `/login` | Público | Inicio de sesión |
| `/blog` | Público | Listado del Blog Gastronómico |
| `/blog/:slug` | Público | Artículo individual del blog |
| `/dashboard` | Miembro autenticado | Inicio del club — libro actual + historial |
| `/libro/:id` | Miembro autenticado | Foro de discusión + exportar PDF |
| `/admin` | Administrador | Panel de administración |

---

## Estructura de archivos

```
moreperezmontemayor/
├── index.html
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── .env                              # No incluido en el repo
├── .env.example                      # Plantilla vacía de variables
├── server/
│   ├── index.js                      # Entrada Express + conexión MongoDB
│   ├── seed.js                       # Crea el primer admin (ejecutar una vez)
│   ├── uploads/                      # Imágenes subidas (excluidas del repo)
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
│       ├── users.js                  # CRUD miembros + cambio de contraseña
│       └── articles.js               # CRUD artículos del blog
└── src/
    ├── main.tsx
    ├── index.css                     # Tailwind + .liquid-glass + scroll suave
    ├── App.tsx                       # Router + AuthProvider + todas las rutas
    ├── lib/
    │   └── api.ts                    # Fetch wrapper con JWT (soporta VITE_API_URL)
    ├── types/
    │   └── index.ts                  # Interfaces: Profile, Book, Post, MeetingLink, Article
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
        ├── BookForum.tsx             # Foro de discusión + botón exportar PDF
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
| PATCH | `/:id/password` | Admin | Cambiar contraseña de un miembro |
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
isCurrent    Boolean (solo uno puede ser true a la vez)
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
authorName   String (default: 'moreperezmontemayor')
published    Boolean (default: true)
timestamps
```

---

## Funcionalidades principales

### Foro de discusión — Exportar PDF
Cada foro de libro tiene un botón **Exportar PDF** (visible cuando hay al menos una aportación). Al hacer clic abre una nueva pestaña con el documento formateado y lanza el diálogo de impresión del navegador para guardar como PDF.

El PDF incluye:
- Título del libro, autor y mes/año
- Total de aportaciones y fecha de generación
- Cada post con nombre completo, usuario, fecha y contenido
- Imágenes y links si los hay
- Pie de página con el nombre del club

### Panel de administración — 4 pestañas

| Pestaña | Funciones |
|---|---|
| **Libros** | Registrar con portada, marcar libro del mes, eliminar |
| **Reunión** | Publicar link semanal de videollamada |
| **Miembros** | Crear, cambiar rol, cambiar contraseña, eliminar |
| **Blog** | Crear y eliminar artículos con portada |

### Blog Gastronómico
- El admin crea artículos desde **Admin → Blog → Nuevo artículo**
- El slug se genera automáticamente desde el título
- Visible públicamente en `/blog` y en la landing page (últimas 3 entradas)
- No requiere autenticación para leer

### Acceso por invitación
El registro público está deshabilitado. Los miembros los crea el administrador desde **Admin → Miembros → Crear miembro**, definiendo usuario, correo y contraseña inicial. La contraseña se puede cambiar desde el mismo panel.

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
| Club de Lectura | `/dashboard` |
| Nosotros | `#nosotros` |
| Blog Gastronómico | `/blog` |
| Próximos eventos | `#eventos` |
| Contacto | `#contacto` |
| Iniciar sesión | `/login` |

---

## Despliegue en producción

Ver guía completa en `DEPLOY.md`.

### Variables de entorno — Render (backend)
| Variable | Descripción |
|---|---|
| `MONGODB_URI` | URI de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para firmar tokens |
| `PORT` | Puerto del servidor (3001) |
| `CLIENT_URL` | URL del frontend en Vercel |

### Variables de entorno — Vercel (frontend)
| Variable | Descripción |
|---|---|
| `VITE_API_URL` | URL del backend en Render |

### Publicar cambios
```bash
git add .
git commit -m "descripción del cambio"
git push
```
Render y Vercel redesplegan automáticamente en 2–3 minutos.

---

## Videos (CloudFront)

| Sección | Variable | Archivo |
|---|---|---|
| Hero (fondo) | `HERO_VIDEO` | `src/pages/Index.tsx` |
| Video Destacado | `FEATURED_VIDEO` | `src/components/FeaturedVideoSection.tsx` |
| Filosofía (columna izq.) | `PHILOSOPHY_VIDEO` | `src/components/PhilosophySection.tsx` |
| Servicios — Tarjeta 1 | `CARD_1_VIDEO` | `src/components/ServicesSection.tsx` |
| Servicios — Tarjeta 2 | `CARD_2_VIDEO` | `src/components/ServicesSection.tsx` |

Para cambiar un video, edita la URL de la constante correspondiente en cada archivo.

---

## Fuente tipográfica

**Instrument Serif** cargada desde Google Fonts en `src/index.css`.
Se aplica con `style={{ fontFamily: "'Instrument Serif', serif" }}` en títulos.
Para la versión italic, agregar `className="italic"` o usar `<em>`.
