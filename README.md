# Web-juegos
Distintos juegos en html y css unidos en una misma web

---

## Requisitos mínimos de cada juego

Para que un juego sea aceptado, debe cumplir con la siguiente estructura:

- `index.html` → Página principal del juego.
- `metadata.json` → Archivo JSON que contenga los campos obligatorios:

```json 
{
    "name": "tetris",
    "description": "juego de tetris",
    "url": "./games/tetris/index.html",
    "category": "arcade",
    "tags": [
        "tetris",
        "oneplayer",
        "old"
    ],
    "thumbnail": "./games/tetris/assets/tetris_miniatura.png",
    "screenshots": [
        "./games/tetris/assets/tetris_screenshot1.png",
        "./games/tetris/assets/tetris_screenshot2.png"
    ],
    "author": "tetris"
}
```

---

## 🤝 Contribuir

1. Haz un fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request