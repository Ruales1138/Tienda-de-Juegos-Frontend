# Pixel Forge — Frontend

Frontend de Pixel Forge, reconstruido con Next.js App Router, TypeScript y
Tailwind CSS a partir de la identidad visual de la Entrega 1.

## Despliegues

- Frontend en Vercel: https://tienda-de-juegos-frontend-c9y4.vercel.app
- API en Render: https://pixel-forge-api-333z.onrender.com
- Catálogo de la API: https://pixel-forge-api-333z.onrender.com/api/videojuegos

## Configuración local

Instala las dependencias y ejecuta el servidor:

```bash
npm install
npm run dev
```

La aplicación queda disponible en [http://localhost:3000](http://localhost:3000).

La URL de la API se configurará mediante `NEXT_PUBLIC_API_HOST` en los
siguientes commits. No se deben guardar secretos en variables `NEXT_PUBLIC_*`.

## Funcionalidades

- Catálogo conectado a la API con filtros, estados de carga/error/vacío y
  paginación mediante `?page=2`.
- Registro, login, logout y sesión persistente en el navegador.
- Solicitudes autenticadas en `/mis-solicitudes`.
- Vista administrativa en `/admin` para usuarios con rol `ADMIN`.
- Página propia para rutas inexistentes.

Para producción, configura `NEXT_PUBLIC_API_HOST` con la URL pública de la API
antes de desplegar en Vercel. El backend debe permitir esa URL en `FRONTEND_URL`.

El login envía las credenciales al backend, guarda el JWT en `localStorage` y
lo agrega a cada petición protegida. Esto permite conservar la sesión al
recargar, pero un ataque XSS podría robar el token; para producción con mayor
exigencia se preferirían cookies `HttpOnly`.

En producción, el frontend usa:

```text
NEXT_PUBLIC_API_HOST=https://pixel-forge-api-333z.onrender.com/api
```

El backend debe permitir la URL de Vercel en `FRONTEND_URL`. No se deben
guardar secretos en el repositorio ni en variables `NEXT_PUBLIC_*`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
