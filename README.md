# Auditoría 2026

Dashboard web en React + Vite para visualizar y analizar el Excel oficial de auditorías.

## Ejecutar

```bash
npm install
npm run dev
```

Abrí la dirección indicada por Vite. El resumen está en `/`.

## Actualizar el Excel publicado

1. Reemplazá `public/auditoria-2026.xlsx` por el Excel actualizado, conservando exactamente ese nombre.
2. Ejecutá `npm run build` para comprobarlo localmente.
3. Hacé commit y push al repositorio conectado a Vercel. Vercel creará el nuevo deploy automáticamente.

El sitio es sólo de lectura: no hay ruta ni interfaz pública para subir archivos. Cada deploy sirve el Excel incluido en `public/auditoria-2026.xlsx`, por lo que todos los visitantes ven los mismos datos. El historial de versiones queda en los commits de Git; el historial operativo mostrado depende de las filas que el Excel conserve.

## Verificación

```bash
npm run lint
npm run build
```
