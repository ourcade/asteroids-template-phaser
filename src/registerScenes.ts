import { SceneKeys } from './consts/SceneKeys'

import TitleScreen from './scenes/TitleScreen'

import GameBackground from './scenes/GameBackground'
import Game from './scenes/Game'

const registerScenes = (game: Phaser.Game) => {
	game.scene.add(SceneKeys.TitleScreen, TitleScreen)

	game.scene.add(SceneKeys.GameBackground, GameBackground)
	game.scene.add(SceneKeys.Game, Game)
}

export default registerScenes
