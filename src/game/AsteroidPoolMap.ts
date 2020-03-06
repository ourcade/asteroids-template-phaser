import IAsteroid from '~/types/IAsteroid'

declare global
{
	interface IAsteroidPoolMap
	{
		readonly values: IAsteroidPool[]

		get(textureKey: string): IAsteroidPool | null
		set(textureKey: string, pool: IAsteroidPool): void

		spawn(x: number, y: number, textureKey: string): IAsteroid | null
		despawn(asteroid: IAsteroid, textureKey: string): void
	}
}

export default class AsteroidPoolMap implements IAsteroidPoolMap
{
	private poolByTextureKey: { [key: string]: IAsteroidPool } = {}
	private pools: IAsteroidPool[] = []

	get values()
	{
		return this.pools
	}

	get(textureKey: string)
	{
		if (!( textureKey in this.poolByTextureKey))
		{
			return null
		}

		return this.poolByTextureKey[textureKey]
	}

	set(textureKey: string, pool: IAsteroidPool)
	{
		if (textureKey in this.poolByTextureKey)
		{
			// already exists so delete previous
			const oldPool = this.poolByTextureKey[textureKey]
			const idx = this.pools.indexOf(oldPool)
			if (idx > -1)
			{
				this.pools.splice(idx, 1)
			}
		}

		this.poolByTextureKey[textureKey] = pool
		this.pools.push(pool)
	}

	spawn(x, y, textureKey: string)
	{
		const pool = this.get(textureKey)
		if (!pool)
		{
			return null
		}

		return pool.spawn(x, y, textureKey)
	}

	despawn(asteroid: IAsteroid, textureKey: string)
	{
		const pool = this.get(textureKey)
		if (!pool)
		{
			return
		}

		pool.despawn(asteroid)
	}
}
