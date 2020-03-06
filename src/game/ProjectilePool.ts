import Phaser from 'phaser'

import IProjectile from '~/types/IProjectile'
import Laser from './projectiles/Laser'

export default class ProjectilePool extends Phaser.Physics.Arcade.Group implements IProjectilePool
{
	constructor(world: Phaser.Physics.Arcade.World, scene: Phaser.Scene, config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {})
	{
		const defaults: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {
			classType: Laser,
			maxSize: -1
		}

		super(world, scene, Object.assign(defaults, config))

		this.runChildUpdate = true
	}

	spawn(x: number, y: number, texture: string)
	{
		const spawnExisting = this.countActive(false) > 0

		const laser: IProjectile = this.get(x, y, texture)

		if (!laser)
		{
			return laser
		}

		laser.emit('on-spawned')

		if (spawnExisting)
		{
			laser.setVisible(true)
			laser.setActive(true)
			this.world.add(laser.physicsBody)
		}
		else
		{
			laser.setPool(this)
		}

		return laser
	}

	despawn(laser: IProjectile)
	{
		this.killAndHide(laser)

		this.world.remove(laser.physicsBody)

		laser.physicsBody.reset(0, 0)
	}
}

Phaser.GameObjects.GameObjectFactory.register('projectilePool', function (config: Phaser.Types.Physics.Arcade.PhysicsGroupConfig | Phaser.Types.GameObjects.Group.GroupCreateConfig = {}) {
	// @ts-ignore
	const pool = new ProjectilePool(this.scene.physics.world, this.scene, config)

	// @ts-ignore
	this.updateList.add(pool)

	return pool
})
