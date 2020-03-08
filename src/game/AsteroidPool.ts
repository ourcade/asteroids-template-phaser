import Phaser from 'phaser'

import IAsteroid from '~/types/IAsteroid'
import Asteroid from './Asteroid'

import { AsteroidSize } from './AsteroidSize'

declare global
{
	interface IAsteroidPool extends Phaser.Physics.Arcade.Group
	{
		readonly asteroidSize: AsteroidSize
		setAsteroidSize(size: AsteroidSize): IAsteroidPool

		spawn(x: number, y: number, texture: string): IAsteroid
		despawn(laser: IAsteroid): void
	}
}

export default class AsteroidPool extends Phaser.Physics.Arcade.Group implements IAsteroidPool
{
	private _size: AsteroidSize

	get asteroidSize()
	{
		return this._size
	}

	constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {})
	{
		const defaults: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {
			classType: Asteroid,
			maxSize: -1
		}

		super(world, scene, Object.assign(defaults, config))

		this._size = AsteroidSize.Large
	}

	setAsteroidSize(size: AsteroidSize)
	{
		this._size = size

		return this
	}

	spawn(x: number, y: number, texture: string)
	{
		const spawnExisting = this.countActive(false) > 0

		const asteroid: IAsteroid = this.get(x, y, texture)

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
			asteroid.setAsteroidSize(this._size)
			asteroid.setMass(1000)
		}

		asteroid.setAngularVelocity(Phaser.Math.Between(-50, 50))

		return asteroid
	}

	despawn(asteroid: IAsteroid)
	{
		this.killAndHide(asteroid)

		this.world.remove(asteroid.body)

		asteroid.body.reset(0, 0)
	}
}

Phaser.GameObjects.GameObjectFactory.register('asteroidPool', function (config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {}) {
	// @ts-ignore
	const pool = new AsteroidPool(this.scene.physics.world, this.scene, config)

	// @ts-ignore
	this.updateList.add(pool)

	return pool
})
