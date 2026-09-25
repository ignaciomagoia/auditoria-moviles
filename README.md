# Auditoría 2026

Dashboard web en React + Vite para importar y analizar el Excel oficial de auditorías.

## Ejecutar

```bash
npm install
npm run dev
```

Abrí la dirección indicada por Vite. El resumen está en `/` y la actualización de datos en `/admin`.

## Actualizar el Excel

1. Abrí `/admin`.
2. Seleccioná el Excel actualizado (`.xlsx`).
3. El dashboard procesa las hojas Turno A-F, normaliza los encabezados y guarda el resultado en el navegador.

El archivo entregado queda como carga inicial en `public/auditoria-2026.xlsx`. Una importación nueva reemplaza esos datos locales; no se usa base de datos.

## Verificación

```bash
npm run lint
npm run build
```
