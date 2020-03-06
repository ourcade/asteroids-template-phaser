import Phaser from 'phaser'

import { SceneKeys } from '~/consts/SceneKeys'
import { TextureKeys } from '~/consts/GameKeys'

import LaserModule from '~/game/LaserModule'
import IProjectile from '~/types/IProjectile'

import '~/game/PlayerShip'
import '~/game/LaserPool'
import '~/game/AsteroidPool'

export default class Game extends Phaser.Scene
{
	private playerShip?: IPlayerShip
	private asteroidPool?: IAsteroidPool

	preload()
    {
		this.load.setPath('assets/game/')
		this.load.image(TextureKeys.PlayerShip, 'playerShip3_blue.png')
		this.load.image(TextureKeys.PlayerLaser, 'laserBlue16.png')

		this.load.image(TextureKeys.AsteroidBig3, 'meteorBrown_big3.png')
    }

    create()
    {
		const origin = new Phaser.Geom.Point(
			this.scale.width * 0.5,
			this.scale.height * 0.5
		)

		this.scene.run(SceneKeys.GameBackground)
		this.scene.sendToBack(SceneKeys.GameBackground)

		const laserPool = this.add.laserPool()

		this.asteroidPool = this.add.asteroidPool()
		this.asteroidPool.spawn(origin.x, 100, TextureKeys.AsteroidBig3)
			.useCircleCollider()

		// console.dir(a.body)

		this.playerShip = this.add.playerShip(origin.x, origin.y, TextureKeys.PlayerShip)
			.useScaledCollider(0.7)
			.setOrigin(0.5, 0.5)
		
		this.playerShip.setDepth(1000)

		this.playerShip.setLaserModule(
			new LaserModule(laserPool, TextureKeys.PlayerLaser)
		)

		this.physics.add.collider(this.asteroidPool, this.playerShip)
		this.physics.add.collider(this.asteroidPool, laserPool, this.laserHitAsteroid, undefined, this)
	}
	
	update(t: number, dt: number)
	{
		this.updatePlayerShip(dt)

		if (this.asteroidPool)
		{
			const asteroids = this.asteroidPool.getChildren() as Phaser.Physics.Arcade.Sprite[]
			asteroids.forEach(asteroid => this.wrap(asteroid))
		}
	}

	private laserHitAsteroid(asteroid: Phaser.GameObjects.GameObject, laser: Phaser.GameObjects.GameObject)
	{
		(laser as IProjectile).returnToPool()

		// TODO: break up asteroid
	}

	private updatePlayerShip(dt: number)
	{
		if (!this.playerShip)
		{
			return
		}

		this.playerShip.update(dt)
		this.wrap(this.playerShip)
	}

	private wrap(object: Phaser.GameObjects.Components.Transform & Phaser.GameObjects.Components.ComputedSize)
	{
		if (!object)
		{
			return
		}

		const x = object.x
		const y = object.y

		const length = Math.max(object.width, object.height)
		const halfLength = length * 0.5

		if (x < -halfLength)
		{
			object.x = this.scale.width + halfLength
		}
		else if (x > this.scale.width + halfLength)
		{
			object.x = -halfLength
		}

		if (y < -halfLength)
		{
			object.y = this.scale.height + halfLength
		}
		else if (y > this.scale.height + halfLength)
		{
			object.y = -halfLength
		}
	}
}
