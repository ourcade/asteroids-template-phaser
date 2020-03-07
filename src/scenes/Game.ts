import Phaser from 'phaser'

import { SceneKeys } from '~/consts/SceneKeys'
import { TextureKeys } from '~/consts/GameKeys'

import ProjectileModule from '~/game/ProjectileModule'
import AsteroidField from '~/game/AsteroidField'
import AsteroidPoolMap from '~/game/AsteroidPoolMap'

import IProjectile from '~/types/IProjectile'
import IAsteroid from '~/types/IAsteroid'

import wrapBounds from '~/utils/wrapBounds'

import { AsteroidSize } from '~/game/AsteroidPool'
import '~/game/PlayerShip'
import '~/game/ProjectilePool'

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

		this.load.image(TextureKeys.AsteroidMedium1, 'meteorBrown_med1.png')
		this.load.image(TextureKeys.AsteroidMedium2, 'meteorBrown_med2.png')

		this.load.image(TextureKeys.AsteroidSmall1, 'meteorBrown_small1.png')
		this.load.image(TextureKeys.AsteroidSmall2, 'meteorBrown_small2.png')

		this.load.image(TextureKeys.Particles1, 'star_04.png')
    }

    create()
    {
		const origin = new Phaser.Geom.Point(
			this.scale.width * 0.5,
			this.scale.height * 0.5
		)

		this.scene.run(SceneKeys.GameBackground)
		this.scene.sendToBack(SceneKeys.GameBackground)

		const asteroidPoolMap = new AsteroidPoolMap()
		asteroidPoolMap.set(TextureKeys.AsteroidBig1, this.add.asteroidPool().setAsteroidSize(AsteroidSize.Large))
		asteroidPoolMap.set(TextureKeys.AsteroidBig2, this.add.asteroidPool().setAsteroidSize(AsteroidSize.Large))
		asteroidPoolMap.set(TextureKeys.AsteroidBig3, this.add.asteroidPool().setAsteroidSize(AsteroidSize.Large))
		asteroidPoolMap.set(TextureKeys.AsteroidBig4, this.add.asteroidPool().setAsteroidSize(AsteroidSize.Large))
		asteroidPoolMap.set(TextureKeys.AsteroidMedium1, this.add.asteroidPool().setAsteroidSize(AsteroidSize.Medium))
		asteroidPoolMap.set(TextureKeys.AsteroidMedium2, this.add.asteroidPool().setAsteroidSize(AsteroidSize.Medium))
		asteroidPoolMap.set(TextureKeys.AsteroidSmall1, this.add.asteroidPool().setAsteroidSize(AsteroidSize.Small))
		asteroidPoolMap.set(TextureKeys.AsteroidSmall2, this.add.asteroidPool().setAsteroidSize(AsteroidSize.Small))

		this.asteroidField = new AsteroidField(asteroidPoolMap, this)
		this.asteroidField.create()

		this.playerShip = this.add.playerShip(origin.x, origin.y, TextureKeys.PlayerShip)
			.useScaledCollider(0.7)
			.setOrigin(0.5, 0.5)
			.setDepth(1000)

		const projectilePool = this.add.projectilePool()
		this.playerShip.setProjectileModule(
			new ProjectileModule(projectilePool, TextureKeys.PlayerLaser)
		)

		asteroidPoolMap.values.forEach(asteroidPool => {
			this.physics.add.collider(asteroidPool, this.playerShip!, this.asteroidHitPlayerShip, obj => obj.active, this)
			this.physics.add.collider(asteroidPool, projectilePool, this.laserHitAsteroid, obj => obj.active, this)
		})
	}
	
	update(t: number, dt: number)
	{
		this.updatePlayerShip(dt, this.scale.canvasBounds)

		if (this.asteroidField)
		{
			this.asteroidField.update(dt)
		}
	}

	private asteroidHitPlayerShip(asteroid: Phaser.GameObjects.GameObject)
	{
		if (!this.playerShip)
		{
			return
		
		}
		const x = this.playerShip.x
		const y = this.playerShip.y

		this.playerShip.destroy()
		this.playerShip = undefined

		const lifespan = 1000

		// TODO: explosion or something and then go to gameover
		const particles = this.add.particles(TextureKeys.Particles1)
		particles.setDepth(2000)
		particles.createEmitter({
			speed: { min: -100, max: 100 },
			angle: { min: 0, max: 360 },
			scale: { start: 0.3, end: 0 },
			blendMode: 'SCREEN',
			// tint: 0xff0000,
			lifespan
		})
		.explode(50, x, y)
		
		this.time.delayedCall(lifespan, () => {
			this.scene.start(SceneKeys.GameOver)
		})
	}

	private laserHitAsteroid(asteroid: Phaser.GameObjects.GameObject, laser: Phaser.GameObjects.GameObject)
	{
		const projectile = (laser as IProjectile)
		const direction = projectile.physicsBody.newVelocity.clone().normalize()
		projectile.returnToPool()

		this.asteroidField?.breakAsteroid(asteroid as IAsteroid, direction)
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
