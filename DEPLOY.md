# Guía de despliegue — moreperezmontemayor

Plataformas utilizadas: **GitHub · MongoDB Atlas · Render · Vercel · UptimeRobot**
Costo total: **$0/mes**

---

## Requisitos previos

- Tener Node.js instalado localmente
- El proyecto funcionando en local (`npm run dev:all`)
- Una cuenta de correo electrónico (sirve la misma para registrarse en todos los servicios)

---

## Paso 1 — GitHub

### 1.1 Crear el repositorio

1. Ve a **github.com** e inicia sesión (o crea una cuenta gratuita).
2. Haz clic en el botón verde **New** (esquina superior izquierda).
3. Configura el repositorio:
   - **Repository name:** `moreperezmontemayor`
   - **Visibility:** Private ✓
   - **No** marques ningún checkbox adicional (sin README, sin .gitignore, sin licencia).
4. Haz clic en **Create repository**.
5. GitHub mostrará una página con la URL del repo. Cópiala, se ve así:
   ```
   https://github.com/tu-usuario/moreperezmontemayor.git
   ```

### 1.2 Subir el proyecto

Abre una terminal dentro de la carpeta del proyecto y ejecuta los siguientes comandos **uno por uno**:

```bash
git init
```
```bash
git add .
```
```bash
git commit -m "primer commit"
```
```bash
git remote add origin https://github.com/tu-usuario/moreperezmontemayor.git
```
```bash
git push -u origin main
```

> Si el último comando pide usuario y contraseña, usa tu usuario de GitHub y como contraseña un **Personal Access Token** (GitHub → Settings → Developer settings → Personal access tokens → Generate new token → marca el permiso `repo`).

### 1.3 Verificar

Recarga la página del repositorio en GitHub. Debes ver todos los archivos del proyecto. Si los ves, el paso 1 está completo.

---

## Paso 2 — MongoDB Atlas (base de datos)

### 2.1 Crear cuenta y cluster

1. Ve a **mongodb.com/atlas** y crea una cuenta gratuita.
2. Al entrar por primera vez, Atlas te guía para crear un proyecto. Acepta los valores por defecto.
3. En la pantalla **Deploy your cluster**, elige:
   - Plan: **M0 Free** (gratis para siempre)
   - Proveedor: cualquiera (AWS, Google Cloud o Azure)
   - Región: la más cercana a México (por ejemplo **US East - N. Virginia**)
4. Nombre del cluster: déjalo como `Cluster0`.
5. Haz clic en **Create Deployment**.

### 2.2 Crear usuario de base de datos

1. En el panel izquierdo ve a **Security → Database Access**.
2. Haz clic en **Add New Database User**.
3. Método de autenticación: **Password**.
4. Usuario: `admin`
5. Contraseña: genera una segura o escribe una. **Guárdala, la necesitas más adelante.**
6. Role: **Atlas admin**.
7. Haz clic en **Add User**.

### 2.3 Permitir acceso desde cualquier IP

1. En el panel izquierdo ve a **Security → Network Access**.
2. Haz clic en **Add IP Address**.
3. Selecciona **Allow Access from Anywhere** (agrega `0.0.0.0/0`).
4. Haz clic en **Confirm**.

> Esto es necesario porque Render usa IPs dinámicas y no se puede restringir a una IP fija en el plan gratuito.

### 2.4 Obtener la cadena de conexión

1. En el panel izquierdo ve a **Database → Connect**.
2. Elige **Drivers**.
3. Driver: **Node.js**, versión: **5.5 or later**.
4. Copia la URI que aparece, se ve así:
   ```
   mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Reemplaza `<password>` con la contraseña que creaste y agrega el nombre de la base de datos antes del `?`:
   ```
   mongodb+srv://admin:TU_CONTRASEÑA@cluster0.xxxxx.mongodb.net/moreperezmontemayor?retryWrites=true&w=majority
   ```
6. **Guarda esta URI completa.** La usarás en el siguiente paso.

---

## Paso 3 — Render (backend Express)

### 3.1 Crear cuenta

1. Ve a **render.com**.
2. Haz clic en **Get Started for Free**.
3. Regístrate con tu cuenta de **GitHub** (más fácil, conecta los repos automáticamente).

### 3.2 Crear el Web Service

1. En el dashboard de Render, haz clic en **New → Web Service**.
2. Selecciona **Build and deploy from a Git repository**.
3. Conecta tu cuenta de GitHub si es la primera vez.
4. Busca y selecciona el repositorio `moreperezmontemayor`.
5. Haz clic en **Connect**.

### 3.3 Configurar el servicio

Rellena los campos con estos valores exactos:

| Campo | Valor |
|---|---|
| Name | `moreperezmontemayor-api` |
| Region | Oregon (US West) o la más cercana |
| Branch | `main` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `node server/index.js` |
| Instance Type | **Free** |

### 3.4 Variables de entorno

Desplázate hasta la sección **Environment Variables** y agrega las siguientes:

| Variable | Valor |
|---|---|
| `MONGODB_URI` | La URI completa de Atlas del paso 2.4 |
| `JWT_SECRET` | Una cadena larga y aleatoria, por ejemplo: `moreperezmontemayor-jwt-2024-clave-muy-segura` |
| `PORT` | `3001` |
| `CLIENT_URL` | `http://localhost:5173` (temporal, se actualiza en el paso 4) |

### 3.5 Desplegar

1. Haz clic en **Create Web Service**.
2. Render tardará entre 2 y 5 minutos en el primer despliegue.
3. Cuando el estado cambie a **Live**, copia la URL del servicio. Se ve así:
   ```
   https://moreperezmontemayor-api.onrender.com
   ```
4. Verifica que funciona abriendo en el navegador:
   ```
   https://moreperezmontemayor-api.onrender.com/api/health
   ```
   Debes ver: `{"ok":true}`

### 3.6 Crear el primer administrador

Una vez que el backend esté activo, necesitas crear el usuario admin inicial. Desde tu terminal local (el proyecto debe tener el `.env` apuntando a Atlas):

1. Edita tu archivo `.env` local y cambia `MONGODB_URI` por la URI de Atlas.
2. Ejecuta:
   ```bash
   npm run seed
   ```
3. Esto crea el usuario `admin@moreperezmontemayor.com` con contraseña `Admin123!`.
4. **Cambia la contraseña desde el panel Admin → Miembros en cuanto entres.**

---

## Paso 4 — Vercel (frontend React)

### 4.1 Crear cuenta

1. Ve a **vercel.com**.
2. Haz clic en **Start Deploying**.
3. Regístrate con tu cuenta de **GitHub**.

### 4.2 Importar el proyecto

1. En el dashboard de Vercel, haz clic en **Add New → Project**.
2. Busca y selecciona el repositorio `moreperezmontemayor`.
3. Haz clic en **Import**.

### 4.3 Configurar el proyecto

Vercel detecta automáticamente que es un proyecto Vite. Solo agrega la variable de entorno:

1. Despliega la sección **Environment Variables**.
2. Agrega:

| Variable | Valor |
|---|---|
| `VITE_API_URL` | `https://moreperezmontemayor-api.onrender.com` |

3. Haz clic en **Deploy**.
4. Vercel tarda entre 1 y 2 minutos.
5. Cuando termine, copia la URL del proyecto. Se ve así:
   ```
   https://moreperezmontemayor.vercel.app
   ```

### 4.4 Actualizar CORS en Render

Ahora que tienes la URL de Vercel, actualiza la variable de entorno en Render:

1. Ve al dashboard de Render → tu servicio `moreperezmontemayor-api`.
2. En el panel izquierdo, **Environment**.
3. Cambia el valor de `CLIENT_URL`:
   ```
   https://moreperezmontemayor.vercel.app
   ```
4. Haz clic en **Save Changes**. Render reiniciará el servicio automáticamente (~1 min).

### 4.5 Verificar

1. Abre `https://moreperezmontemayor.vercel.app` en el navegador.
2. Debes ver la landing page completa.
3. Ve a `/login` e inicia sesión con `admin@moreperezmontemayor.com` / `Admin123!`.

---

## Paso 5 — UptimeRobot (evitar que Render se duerma)

El plan gratuito de Render apaga el servidor tras 15 minutos sin visitas. UptimeRobot lo mantiene activo enviando un ping cada 5 minutos.

### 5.1 Crear cuenta

1. Ve a **uptimerobot.com**.
2. Haz clic en **Register for FREE**.
3. Crea la cuenta con tu correo.

### 5.2 Crear el monitor

1. En el dashboard, haz clic en **+ Add New Monitor**.
2. Configura:

| Campo | Valor |
|---|---|
| Monitor Type | HTTP(s) |
| Friendly Name | `moreperezmontemayor API` |
| URL | `https://moreperezmontemayor-api.onrender.com/api/health` |
| Monitoring Interval | **5 minutes** |

3. Haz clic en **Create Monitor**.

A partir de ese momento UptimeRobot pings el servidor cada 5 minutos y Render nunca lo apaga.

---

## Despliegues futuros (actualizaciones)

Cada vez que hagas cambios en el código y quieras publicarlos:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Tanto Render como Vercel detectan el push automáticamente y redesplegan en 2–3 minutos.

> **Nota sobre las imágenes:** Las imágenes subidas (portadas de libros y artículos) se guardan en `server/uploads/` dentro de Render. Cada vez que Render redespliega, esa carpeta se **borra**. Para una solución definitiva, migrar el almacenamiento a Cloudflare R2 (gratuito hasta 10 GB). Por ahora es funcional para empezar.

---

## Resumen de URLs y credenciales

| Servicio | URL |
|---|---|
| Landing page | `https://moreperezmontemayor.vercel.app` |
| API (backend) | `https://moreperezmontemayor-api.onrender.com` |
| Health check | `https://moreperezmontemayor-api.onrender.com/api/health` |
| Admin login | `https://moreperezmontemayor.vercel.app/login` |
| Admin email | `admin@moreperezmontemayor.com` |
| Admin contraseña inicial | `Admin123!` (cambiar inmediatamente) |

---

## Costo mensual

| Servicio | Plan | Costo |
|---|---|---|
| GitHub | Free | $0 |
| MongoDB Atlas | M0 Free | $0 |
| Render | Free | $0 |
| Vercel | Hobby (Free) | $0 |
| UptimeRobot | Free | $0 |
| **Total** | | **$0/mes** |
