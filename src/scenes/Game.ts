import Phaser from 'phaser'

import { SceneKeys } from '~/consts/SceneKeys'

import '~/game/PlayerShip'

export default class Game extends Phaser.Scene
{
	private playerShip?: IPlayerShip

	preload()
    {
        this.load.image('ship', 'assets/game/playerShip3_blue.png')
    }

    create()
    {
		const origin = new Phaser.Geom.Point(
			this.scale.width * 0.5,
			this.scale.height * 0.5
		)

		this.scene.run(SceneKeys.GameBackground)
		this.scene.sendToBack(SceneKeys.GameBackground)

		this.playerShip = this.add.playerShip(origin.x, origin.y, 'ship')
		this.playerShip.setOrigin(0.5, 0.5)
	}
	
	update(t: number, dt: number)
	{
		this.updatePlayerShip(dt)
	}

	private updatePlayerShip(dt: number)
	{
		if (!this.playerShip)
		{
			return
		}

		this.playerShip.update(dt)

		const px = this.playerShip.x
		const py = this.playerShip.y

		const length = Math.max(this.playerShip.width, this.playerShip.height)
		const halfLength = length * 0.5

		if (px < -halfLength)
		{
			this.playerShip.x = this.scale.width + halfLength
		}
		else if (px > this.scale.width + halfLength)
		{
			this.playerShip.x = -halfLength
		}

		if (py < -halfLength)
		{
			this.playerShip.y = this.scale.height + halfLength
		}
		else if (py > this.scale.height + halfLength)
		{
			this.playerShip.y = -halfLength
		}
	}
}
