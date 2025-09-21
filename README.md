# 🎮 Web Juegos

¡Bienvenido a **Web Juegos**! Este proyecto es una galería web dinámica de juegos donde los usuarios pueden explorar y jugar a distintos juegos directamente desde el navegador.  

---

## 📂 Estructura del proyecto

```
Web-Juegos/
│
├─ Juegos/
│  ├─ Nombre del juego/
│  │  ├─ metadata.json
│  │  ├─ index.html 
│  │  ├─ styles.css 
│  │  ├─ logo.png
│  │  └─ main.js
│  ├─ ...
│
├─ index.html
├─ main.js
├─ styles.css
└─ logo.png
```

- **Juegos/**: Carpeta donde se almacenan los juegos. Cada juego tiene su propia carpeta y un archivo `metadata.json` con información del juego.
- **index.html**: Página principal que carga dinámicamente los juegos.
- **main.js**: Script que lee los archivos `metadata.json` y genera las tarjetas de juego.
- **styles.css**: Estilos para la galería y tarjetas de juegos.
- **logo.png**: Icono del sitio.

---

## 📝 Formato de `metadata.json`

Cada juego debe tener un archivo `metadata.json` con la siguiente estructura:

```json
{
  "nombre": "Nombre del juego",
  "descripcion": "Breve descripción del juego",
  "categoria": "Categoría del juego",
  "autor": "Nombre del autor (opcional)",
  "miniatura": "ruta/a/imagen-miniatura.png",
  "url": "ruta/al/juego/index.html",
  "tags": ["tag1", "tag2", "tag3", ...]
}
```

- `nombre`: Nombre visible del juego.
- `descripcion`: Descripción corta.
- `categoria`: Ejemplo: "Estrategia", "Arcade", "Puzzle", etc.
- `autor`: Autor del juego (opcional).
- `miniatura`: Imagen representativa del juego.
- `url`: Enlace al juego para poder jugarlo.
- `tags`: Palabras clave que describen el juego.

---

## 🚀 Cómo añadir un nuevo juego

1. Crear una nueva carpeta dentro de `Juegos/` con el nombre del juego.
2. Añadir los archivos del juego dentro de esa carpeta.
3. Crear un `metadata.json` siguiendo el formato mostrado arriba.
4. Añadir la ruta del `metadata.json` en el array `rutas` dentro de `main.js`:

```javascript
const rutas = [
  "Juegos/Ajedrez/metadata.json",
  "Juegos/3-en-raya/metadata.json",
  "Juegos/pac-man/metadata.json",
  "Juegos/Tetris/metadata.json",
  "Juegos/NuevoJuego/metadata.json" // Nueva ruta
];
```

5. Guardar y recargar la página para que aparezca el nuevo juego automáticamente.

---

## 🎨 Personalización de tags

Los tags de los juegos se colorean automáticamente usando la paleta definida en `main.js`. Puedes modificar los colores editando el array `coloresTags`.

---

## 📌 Tecnologías usadas

- HTML5
- CSS3
- JavaScript (ES6+)

---

## ⚠️ Notas

- Asegúrate de que las rutas a los archivos de miniaturas y juegos sean correctas.
- Cada juego debe tener su propio archivo `metadata.json`.
- Este proyecto está diseñado para ser escalable: ¡puedes añadir tantos juegos como quieras!

---

## 👾 Autor

Tu nombre o alias

---

## 🖥️ Vista previa

La página carga automáticamente las tarjetas de los juegos con:

- Imagen del juego
- Nombre y descripción
- Categoría y autor (si aplica)
- Tags con colores
- Botón “Jugar” que enlaza al juego