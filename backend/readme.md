## TODO

- [x] Servidor base
- [ ] Agregar .env
- [ ] Seguridad
- [ ] Cache
- [ ] Paginación
- [ ] Dockerfile - Dockercompose
- [ ] Tests

## Estructura de carpetas

```mardown
/juegos
  /tetris
    /assets
    metadata.json
    index.html
    .css
    .js
  /Ajedrez
    /assets
    metadata.json
    index.html
    .css
    .js
  
/server
  .js 

/front
  .html
```

## Metadata games

```json 
{
  "id": "1",
  "nombre": "tetris",
  "descripcion": "juego de tetris",
  "url": "./juegos/tetris/index.html",
  "categoria": "arcade",
  "tags": ["tetris", "oneplayer", "old"],
  "miniatura": "assets/tetris_miniatura.png",
  "screenshots": [
    "assets/tetris_screenshot1.png",
    "assets/tetris_screenshot2.png"
  ],
  "autor": "discord",
}
```
