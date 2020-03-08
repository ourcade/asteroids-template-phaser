import Phaser from 'phaser'

import { GameEvents } from '~/consts/GameEvents'
import PointsService from '~/game/services/PointsService'
import IAsteroid from '~/types/IAsteroid'

export default class GameUI extends Phaser.Scene
{
	private pointsService = new PointsService()

	private scoreLabel?: Phaser.GameObjects.Text

	preload()
	{
		this.pointsService.reset()
	}

	create()
	{
		this.scoreLabel = this.add.text(10, 10, '')
		this.updatePoints()

		this.game.events.on(GameEvents.AsteroidBroken, (asteroid: IAsteroid) => {
			this.pointsService.addForAsteroid(asteroid)

			this.updatePoints()
		})

		this.events.on(Phaser.Scenes.Events.SHUTDOWN, () => {
			this.game.events.off(GameEvents.AsteroidBroken)
		})
	}

	private updatePoints()
	{
		if (!this.scoreLabel)
		{
			return
		}

		this.scoreLabel.text = `${this.pointsService.total}`
	}
}
