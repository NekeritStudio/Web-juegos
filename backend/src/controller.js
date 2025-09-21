import Game from './game.js'

const game = new Game()

export const getAllGames = async (req, res) => {
    const games = await game.getAllGames()
    console.log("All games:", games)
    res.json(games)
}

export const getGameMetadata = (req, res) => {
    const { gameId } = req.params
    const game = game.getGameMetadata(gameId)

    if (game) {
        res.json(game)
    } else {
        res.status(404).json({ error: 'Game not found' })
    }
}

export const getGamesByCategory = (req, res) => {
    const { category } = req.params
    const games = game.getGamesByCategory(category)
    res.json(games)
}
