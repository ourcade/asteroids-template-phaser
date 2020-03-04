export default class LaserModule
{
	private pool: ILaserPool
	private textureKey: string

	constructor(pool: ILaserPool, textureKey: string)
	{
		this.pool = pool
		this.textureKey = textureKey
	}

	fireFrom(x: number, y: number, direction: Phaser.Math.Vector2)
	{
		return this.pool.spawn(x, y, this.textureKey)
	}

	update(dt: number)
	{
		const activeChildren = this.pool.getChildren()
			.filter(child => child.active) as ILaser[]

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
