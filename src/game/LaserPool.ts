import Phaser from 'phaser'

declare global
{
	interface ILaserPool extends Phaser.Physics.Arcade.Group
	{
		spawn(x: number, y: number, texture: string): Laser
		despawn(laser: Laser): void
	}

	interface ILaser extends Phaser.Physics.Arcade.Sprite
	{

	}
}

class Laser extends Phaser.Physics.Arcade.Sprite implements ILaser
{
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
	{
		super(scene, x, y, texture)
	}
}

export default class LaserPool extends Phaser.Physics.Arcade.Group implements ILaserPool
{
	constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene)
	{
		const defaults: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {
			classType: Laser,
			maxSize: -1
		}

		super(world, scene, defaults)
	}

	spawn(x: number, y: number, texture: string)
	{
		const spawnExisting = this.countActive(false) > 0

		const laser: Laser = this.get(x, y, texture)

		if (!laser)
		{
			return laser
		}

		if (spawnExisting)
		{
			laser.setVisible(true)
			laser.setActive(true)
			this.world.add(laser.body)
		}

		return laser
	}

	despawn(laser: Laser)
	{
		this.killAndHide(laser)

		this.world.remove(laser.body)
	}
}

Phaser.GameObjects.GameObjectFactory.register('laserPool', function () {
	// @ts-ignore
	const pool = new LaserPool(this.scene.physics.world, this.scene)

	// @ts-ignore
	this.updateList.add(pool)

	return pool
})
