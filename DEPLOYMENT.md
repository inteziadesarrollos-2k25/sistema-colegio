# Guía de Despliegue Web (Deployment)

Esta guía te ayudará a poner el sistema "Unidad Educativa Romualdo Delfín Gómez" en internet para que sea accesible desde cualquier lugar.

## Requisitos Previos

1.  **Cuenta en Vercel**: [https://vercel.com/signup](https://vercel.com/signup) (Gratis para proyectos personales/demo).
2.  **Cuenta en GitHub/GitLab/Bitbucket**: Para alojar el código.
3.  **Base de Datos en la Nube**:
    *   **IMPORTANTE**: `SQLite` (el archivo `dev.db` actual) **NO FUNCIONA BIEN** en entornos serverless como Vercel porque los archivos se borran con cada despliegue.
    *   Necesitas una base de datos PostgreSQL o MySQL.
    *   Recomendación Gratis: **Neon (PostgreSQL)** [https://neon.tech](https://neon.tech) o **Supabase** [https://supabase.com](https://supabase.com).

## Paso 1: Mover a Base de Datos de Producción (PostgreSQL)

Para salir a la web, debes cambiar de SQLite a PostgreSQL.

1.  **Crea una base de datos en Neon/Supabase**.
2.  Obtén la `Connection String` (ej. `postgres://user:password@host/neondb...`).
3.  **Actualiza `prisma/schema.prisma`**:

```prisma
// prisma/schema.prisma

datasource db {
  provider = "postgresql" // Cambiar de "sqlite" a "postgresql"
  url      = env("DATABASE_URL")
}
```

4.  **Actualiza `.env` localmente (para probar)**:
    ```env
    DATABASE_URL="tu_url_de_postgres_aqui"
    ```
5.  **Migra la base de datos**:
    ```bash
    npx prisma migrate dev --name init_postgres
    npx prisma db seed
    ```

## Paso 2: Subir código a GitHub

1.  Crea un nuevo repositorio en GitHub.
2.  Sube tu proyecto:
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git remote add origin <TU_URL_DEL_REPO>
    git push -u origin master
    ```

## Paso 3: Desplegar en Vercel

1.  Ve a tu dashboard de Vercel y haz clic en "Add New Project".
2.  Importa tu repositorio de GitHub.
3.  **Configuración del Proyecto**:
    *   **Framework Preset**: Next.js
    *   **Environment Variables**: Añade las variables de tu archivo `.env`.
        *   `DATABASE_URL`: La URL de tu base de datos Neon/Supabase.
        *   `NEXTAUTH_SECRET`: Un texto largo y aleatorio.
        *   `NEXTAUTH_URL`: La URL que te dará Vercel (ej. `https://mi-colegio.vercel.app`).
4.  Haz clic en **Deploy**.

## Paso 4: Post-Despliegue

1.  Una vez desplegado, Vercel construirá tu aplicación.
2.  Si usaste Prisma, asegúrate de que el "Build Command" en Vercel sea: `npx prisma generate && next build`.
3.  Para inicializar la base de datos en producción (si no lo hiciste antes):
    *   Puedes conectar Vercel con tu repo para que corra migraciones, o
    *   Desde tu PC local, apunta el `.env` a la base de datos de producción y corre `npx prisma migrate deploy`.

## Notas Adicionales

*   **Rendimiento**: PostgreSQL en la nube es más robusto que SQLite.
*   **Dominios**: Vercel te da un dominio `.vercel.app` gratis. Puedes comprar un dominio `.com` o `.edu` y configurarlo en Vercel.
*   **Costos**:
    *   Vercel Hobby: Gratis.
    *   Neon Free Tier: Gratis (suficiente para iniciar).
    *   GitHub: Gratis.

¡Tu sistema estará online y listo para usarse desde cualquier lugar!
