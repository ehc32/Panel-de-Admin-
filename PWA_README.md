# 📱 Tu aplicación Next.js ahora es una PWA

## ✅ Configuración completada

Tu aplicación Next.js ha sido configurada como una Progressive Web App (PWA) y ahora puede instalarse en dispositivos móviles como una aplicación nativa.

### Cambios realizados:

1. **next.config.ts** - Configurado con `next-pwa`
2. **manifest.json** - Creado con metadatos de la aplicación
3. **layout.tsx** - Agregados metadatos PWA
4. **Iconos PWA** - Generados `icon-192x192.png` e `icon-512x512.png`
5. **.gitignore** - Actualizado para excluir archivos generados por PWA

## 🚀 Cómo usar tu PWA

### 1. Compilar y ejecutar en producción

```bash
npm run build
npm start
```

La aplicación estará disponible en `http://localhost:3000`

### 2. Instalar en tu celular

#### **Android (Chrome/Edge):**
1. Abre la app en Chrome desde tu celular
2. Verás un banner "Agregar a pantalla de inicio" o en el menú (⋮) selecciona "Instalar app"
3. Toca "Instalar"
4. La app aparecerá en tu pantalla de inicio como una app nativa

#### **iOS (Safari):**
1. Abre la app en Safari desde tu iPhone
2. Toca el botón de compartir (📤)
3. Desplázate y selecciona "Agregar a pantalla de inicio"
4. Toca "Agregar"
5. La app aparecerá en tu pantalla de inicio

### 3. Desplegar en producción

Para que la PWA funcione en dispositivos móviles, necesitas desplegarla con HTTPS. Opciones:

- **Vercel** (recomendado para Next.js):
  ```bash
  npm install -g vercel
  vercel
  ```

- **Netlify**
- **Railway**
- **Cualquier hosting con HTTPS**

## 🎨 Personalización

### Cambiar colores de la app

Edita `public/manifest.json`:

```json
{
  "theme_color": "#3b82f6",        // Color de la barra de estado
  "background_color": "#ffffff"     // Color de fondo al abrir
}
```

### Cambiar nombre de la app

Edita `public/manifest.json`:

```json
{
  "name": "Mi Aplicación Completa",
  "short_name": "MiApp"
}
```

### Cambiar iconos

Reemplaza los archivos en `public/`:
- `icon-192x192.png`
- `icon-512x512.png`

O ejecuta `node generate-icons.js` después de actualizar `public/Icono.jpg`

## 🔍 Verificar que funciona

### Características de una PWA instalada:

✅ Se abre en pantalla completa (sin barra del navegador)
✅ Funciona offline después de la primera carga
✅ Se puede agregar a la pantalla de inicio
✅ Tiene su propio icono
✅ Aparece en el menú de aplicaciones del dispositivo

### Herramientas de desarrollo:

1. **Chrome DevTools** → Pestaña "Application" → "Manifest" y "Service Workers"
2. **Lighthouse** → Ejecuta una auditoría PWA

## 📝 Notas importantes

- La PWA solo funciona con **HTTPS** (o localhost en desarrollo)
- En desarrollo, la PWA está **deshabilitada** por defecto
- Los Service Workers se actualizan automáticamente en cada build
- Los archivos `sw.js` y `workbox-*.js` se generan automáticamente

## 🐛 Solución de problemas

### La app no se puede instalar:
- Verifica que estés usando HTTPS
- Asegúrate de que los iconos existan en `public/`
- Revisa la consola del navegador para errores

### Los cambios no se reflejan:
```bash
# Limpia el caché y reconstruye
rm -rf .next
npm run build
npm start
```

### Service Worker no se actualiza:
- En Chrome DevTools → Application → Service Workers → "Update on reload"
- O desregistra el Service Worker y recarga la página

## 📚 Recursos adicionales

- [Next PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [PWA Builder](https://www.pwabuilder.com/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)

---

¡Tu aplicación está lista para ser instalada en cualquier dispositivo! 🎉
