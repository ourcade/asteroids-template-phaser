import Phaser from 'phaser'

declare global
{
	interface IAsteroidPool extends Phaser.Physics.Arcade.Group
	{
		spawn(x: number, y: number, texture: string): Asteroid
		despawn(laser: Asteroid): void
	}
}

class Asteroid extends Phaser.Physics.Arcade.Sprite
{
	useCircleCollider(radius: number | undefined = undefined, scaleFactor = 1, offsetX = 0, offsetY = 0)
	{
		const r = radius || this.width * 0.5
		const diff = r - (r * scaleFactor)
		this.body.setCircle(r * scaleFactor, offsetX + diff, offsetY + diff)

		return this
	}

	useSquareCollider(width: number)
	{
		this.body.setSize(width, width)

		return this
	}

	useScaledCollider(scaleFactor: number)
	{
		const w = this.width * scaleFactor
		const h = this.height * scaleFactor

		this.body.setSize(w, h)
		
		return this
	}
}

export default class AsteroidPool extends Phaser.Physics.Arcade.Group
{
	constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {})
	{
		const defaults: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {
			classType: Asteroid,
			maxSize: -1
		}

		super(world, scene, Object.assign(defaults, config))
	}

	spawn(x: number, y: number, texture: string)
	{
		const spawnExisting = this.countActive(false) > 0

		const asteroid: Asteroid = this.get(x, y, texture)

		if (!asteroid)
		{
			return asteroid
		}

		asteroid.emit('on-spawned')

		if (spawnExisting)
		{
			asteroid.setVisible(true)
			asteroid.setActive(true)
			this.world.add(asteroid.body)
		}
		else
		{
			asteroid.setBounce(1)
		}

		asteroid.setAngularVelocity(Phaser.Math.Between(-50, 50))

		return asteroid
	}

	despawn(asteroid: Asteroid)
	{
		this.killAndHide(asteroid)

		this.world.remove(asteroid.body)
	}
}

Phaser.GameObjects.GameObjectFactory.register('asteroidPool', function (config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {}) {
	// @ts-ignore
	const pool = new AsteroidPool(this.scene.physics.world, this.scene, config)

	// @ts-ignore
	this.updateList.add(pool)

	return pool
})
