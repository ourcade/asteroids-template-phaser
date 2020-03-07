import Phaser from 'phaser'

import { SceneKeys } from '~/consts/SceneKeys'
import PlayAgainButton from '~/UI/PlayAgainButton'
import BackToTitleButton from '~/UI/BackToTitleButton'

export default class GameOver extends Phaser.Scene
{
	preload()
	{
	}

	create()
	{
		this.cameras.main.setBackgroundColor('rgba(255,0,0,1)')
		
		const width = this.scale.width
		const height = this.scale.height
		const x = this.scale.width * 0.5

		const fontSize = Math.min(width * 0.18, 150)
		const title = this.add.text(x, height * 0.3, 'Game Over', {
			fontFamily: 'Righteous',
			fontSize: `${fontSize}px`,
			align: 'center'
		})
		title.setOrigin(0.5, 0.5)
		title.alpha = 0
		title.scale = 0

		const y = this.scale.height * 0.7

		const playAgainButton = this.add.dom(x, y - 30, PlayAgainButton())
			.addListener('click').on('click', () => {
				this.scene.start(SceneKeys.Game)
			})
		playAgainButton.alpha = 0

		const backToTitleButton = this.add.dom(x, y + 30, BackToTitleButton())
			.addListener('click').on('click', () => {
				this.scene.start(SceneKeys.TitleScreen)
			})
		backToTitleButton.alpha = 0

		const timeline = this.tweens.createTimeline()

		timeline.add({
			targets: title,
			alpha: 1,
			scale: 1,
			ease: 'Sine.easeOut',
			duration: 300
		})

		timeline.add({
			targets: playAgainButton,
			alpha: 1,
			ease: 'Sine.easeOut',
			duration: 700,
			offset: 100
		})

		timeline.add({
			targets: backToTitleButton,
			alpha: 1,
			ease: 'Sine.easeOut',
			duration: 700,
			offset: 300
		})

		timeline.play()
	}
}
