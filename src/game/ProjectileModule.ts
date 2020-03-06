import IProjectile from '~/types/IProjectile'

export default class ProjectileModule
{
	private pool: IProjectilePool
	private textureKey: string

	constructor(pool: IProjectilePool, textureKey: string)
	{
		this.pool = pool
		this.textureKey = textureKey
	}

	fireFrom(x: number, y: number, direction: Phaser.Math.Vector2)
	{
		const laser = this.pool.spawn(x, y, this.textureKey)

		laser.fireAt(
			x + (direction.x * 100),
			y + (direction.y * 100)
		)

		return laser
	}

	update(dt: number)
	{
		const activeChildren = this.pool.getChildren()
			.filter(child => child.active) as IProjectile[]

		const scale = this.pool.scene.scale
		
		for (let i = 0; i < activeChildren.length; ++i)
		{
			const child = activeChildren[i]

			const rect = scale.canvasBounds

			if (rect.contains(child.x, child.y))
			{
				continue
			}

			const w = child.width
			const h = child.height

			if (child.x < -w)
			{
				this.pool.despawn(child)
				continue
			}

			if (child.x > scale.width + w)
			{
				this.pool.despawn(child)
				continue
			}

			if (child.y < -h)
			{
				this.pool.despawn(child)
				continue
			}

			if (child.y > scale.height + h)
			{
				this.pool.despawn(child)
				continue
			}
		}
	}
}
