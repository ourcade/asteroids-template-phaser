import Phaser from 'phaser'

import { SceneKeys } from '~/consts/SceneKeys'
import PlayAgainButton from '~/UI/PlayAgainButton'

export default class GameOver extends Phaser.Scene
{
	preload()
	{
	}

	create()
	{
		this.cameras.main.setBackgroundColor('rgba(255,0,0,1)')
		
		const x = this.scale.width * 0.5
		const y = this.scale.height * 0.5

		const playButton = this.add.dom(x, y, PlayAgainButton())
		playButton.addListener('click').on('click', () => {
			this.scene.start(SceneKeys.Game)
		})
	}
}
