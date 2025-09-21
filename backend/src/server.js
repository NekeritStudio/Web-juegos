import express from 'express'
import cors from 'cors'
import { getAllGames, getGameMetadata, getGamesByCategory } from './controller.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/games', getAllGames)
app.get('/api/games/:id', getGameMetadata)
app.get('/api/games/category/:category', getGamesByCategory)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`)
})