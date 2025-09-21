import { readdir, readFile, access } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default class Game {
    constructor() {
        this.games = []
        this.gamesPath = join(__dirname, '../../games')
    }

    async _scanGames() {
        const gameDirs = await readdir(this.gamesPath, { withFileTypes: true })
        const games = []

        for (const dir of gameDirs) {
            if (dir.isDirectory()) {
                const gameData = await this._loadGameMetadata(dir.name)
                if (gameData) games.push(gameData)
            }
        }

        this.games = games
        return games
    }

    async _loadGameMetadata(gameId) {
        try {
            const metadataPath = join(this.gamesPath, gameId, 'metadata.json')
            const metadataContent = await readFile(metadataPath, 'utf8')
            const metadata = JSON.parse(metadataContent)

            const indexPath = join(this.gamesPath, gameId, 'index.html')
            await access(indexPath)

            return metadata
        } catch {
            return null
        }
    }

    async getAllGames() {
        return await this._scanGames()
    }

    async getGameMetadata(gameId) {
        const games = await this._scanGames()
        return games.find(game => game.id === gameId)
    }

    async getGamesByCategory(category) {
        const games = await this._scanGames()
        return games.filter(game => game.category === category)
    }
}
