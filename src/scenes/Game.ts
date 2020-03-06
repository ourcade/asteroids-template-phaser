import Phaser from 'phaser'

import { SceneKeys } from '~/consts/SceneKeys'
import { TextureKeys } from '~/consts/GameKeys'

import LaserModule from '~/game/LaserModule'
import AsteroidField from '~/game/AsteroidField'

import IProjectile from '~/types/IProjectile'

import wrapBounds from '~/utils/wrapBounds'

import '~/game/PlayerShip'
import '~/game/LaserPool'
import '~/game/AsteroidPool'

export default class Game extends Phaser.Scene
{
	private playerShip?: IPlayerShip
	private asteroidField?: AsteroidField

	preload()
    {
		this.load.setPath('assets/game/')
		this.load.image(TextureKeys.PlayerShip, 'playerShip3_blue.png')
		this.load.image(TextureKeys.PlayerLaser, 'laserBlue16.png')

		this.load.image(TextureKeys.AsteroidBig1, 'meteorBrown_big1.png')
		this.load.image(TextureKeys.AsteroidBig2, 'meteorBrown_big2.png')
		this.load.image(TextureKeys.AsteroidBig3, 'meteorBrown_big3.png')
		this.load.image(TextureKeys.AsteroidBig4, 'meteorBrown_big4.png')
    }

    create()
    {
		const origin = new Phaser.Geom.Point(
			this.scale.width * 0.5,
			this.scale.height * 0.5
		)

		this.scene.run(SceneKeys.GameBackground)
		this.scene.sendToBack(SceneKeys.GameBackground)

		const asteroidPool = this.add.asteroidPool()
		this.asteroidField = new AsteroidField(asteroidPool, this)
		this.asteroidField.create()

		this.playerShip = this.add.playerShip(origin.x, origin.y, TextureKeys.PlayerShip)
			.useScaledCollider(0.7)
			.setOrigin(0.5, 0.5)
			.setDepth(1000)

		const laserPool = this.add.laserPool()
		this.playerShip.setLaserModule(
			new LaserModule(laserPool, TextureKeys.PlayerLaser)
		)

		this.physics.add.collider(asteroidPool, this.playerShip)
		this.physics.add.collider(asteroidPool, laserPool, this.laserHitAsteroid, undefined, this)
	}
	
	update(t: number, dt: number)
	{
		this.updatePlayerShip(dt, this.scale.canvasBounds)

		if (this.asteroidField)
		{
			this.asteroidField.update(dt)
		}
	}

	private laserHitAsteroid(asteroid: Phaser.GameObjects.GameObject, laser: Phaser.GameObjects.GameObject)
	{
		(laser as IProjectile).returnToPool()

		// TODO: break up asteroid
	}

	private updatePlayerShip(dt: number, bounds: Phaser.Geom.Rectangle)
	{
		if (!this.playerShip)
		{
			return
		}

		this.playerShip.update(dt)
		wrapBounds(this.playerShip, bounds)
	}
}
