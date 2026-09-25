# Recetas hogareñas modernizadas

Versión reformada del proyecto original, construida únicamente con HTML, CSS y JavaScript propios.

## Contenido

- 190 recetas migradas desde los documentos HTML originales.
- Buscador por nombre e ingredientes.
- Filtros por siete categorías.
- Ventana de lectura e impresión de cada receta.
- Navegación adaptable para móvil y escritorio.
- Formulario de contacto con validación accesible.
- Imágenes locales y carga diferida.
- Sin Bootstrap, jQuery ni dependencias externas.

## Estructura

- `index.html`: interfaz principal.
- `styles.css`: diseño completo y adaptable.
- `app.js`: buscador, filtros, recetas, navegación y formulario.
- `data/recipes.json`: catálogo centralizado.
- `assets/images/`: imágenes del proyecto original normalizadas.

## Uso local

El archivo de datos se carga con `fetch`, por lo que debe abrirse mediante un servidor web local.

Una opción sencilla desde esta carpeta es:

```bash
python3 -m http.server 8000
```

Después abre `http://localhost:8000` en el navegador.

## Conservación

Esta carpeta es una copia nueva. Los archivos originales no fueron sobrescritos.
