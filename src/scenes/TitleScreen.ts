import Phaser from 'phaser'

import PlayButton from '~/UI/PlayButton'
import { SceneKeys } from '~/consts/SceneKeys'

export default class TitleScreen extends Phaser.Scene
{
	preload()
	{
	
	}

	create()
	{
		const x = this.scale.width * 0.5
		const y = this.scale.height * 0.5

		const playButton = this.add.dom(x, y, PlayButton)
		playButton.addListener('click').on('click', () => {
			this.scene.start(SceneKeys.Game)
		})
	}
}
