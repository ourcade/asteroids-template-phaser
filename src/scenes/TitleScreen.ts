import Phaser from 'phaser'

import PlayButton from '~/UI/PlayButton'
import { SceneKeys } from '~/consts/SceneKeys'

import WebFontFile from '~/UI/WebFontFile'

export default class TitleScreen extends Phaser.Scene
{
	preload()
	{
		this.cameras.main.setBackgroundColor('rgba(32,44,64,1)')
		
		const file = new WebFontFile(this.load, [
			'Righteous',
			'Fredoka One'
		])
		this.load.addFile(file)
	}

	create()
	{
		const width = this.scale.width
		const height = this.scale.height
		const x = width * 0.5

		const fontSize = Math.min(width * 0.2, 225)
		const title = this.add.text(x, height * -0.3, 'Asteroids\nTemplate', {
			fontFamily: 'Righteous',
			fontSize: `${fontSize}px`,
			align: 'center'
		})
		title.setOrigin(0.5, 0.5)
		title.alpha = 0

		const y = height * 0.7

		const playButton = this.add.dom(x, height + 50, PlayButton)
		playButton.addListener('click').on('click', () => {
			this.scene.start(SceneKeys.Game)
		})

		const timeline = this.tweens.createTimeline()

		// https://github.com/photonstorm/phaser/blob/v3.22.0/src/math/easing/EaseMap.js
		timeline.add({
			targets: title,
			alpha: 1,
			y: height * 0.3,
			ease: 'Sine.easeInOut',
			duration: 700
		})

		timeline.add({
			targets: playButton,
			y,
			ease: 'Quad.easeOut',
			duration: 400,
			offset: 350
		})

		timeline.play()
	}
}
