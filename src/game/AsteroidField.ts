import { TextureKeys } from '~/consts/GameKeys'

import IAsteroid from '~/types/IAsteroid'

import wrapBounds from '~/utils/wrapBounds'
import { AsteroidSize } from './AsteroidSize'

const BigAsteroidTextureKeys = [
	TextureKeys.AsteroidBig1,
	TextureKeys.AsteroidBig2,
	TextureKeys.AsteroidBig3,
	TextureKeys.AsteroidBig4
]

const MediumAsteroidTextureKeys = [
	TextureKeys.AsteroidMedium1,
	TextureKeys.AsteroidMedium2
]

const SmallAsteroidTextureKeys = [
	TextureKeys.AsteroidSmall1,
	TextureKeys.AsteroidSmall2
]

const textureKeysForSize = (size: AsteroidSize) => {
	switch (size)
	{
		case AsteroidSize.Large:
			return BigAsteroidTextureKeys

		case AsteroidSize.Medium:
			return MediumAsteroidTextureKeys

		default:
		case AsteroidSize.Small:
			return SmallAsteroidTextureKeys
	}
}

export enum FieldLayout
{
	Random
}

export default class AsteroidField
{
	private poolMap: IAsteroidPoolMap
	private scene: Phaser.Scene

	constructor(poolMap: IAsteroidPoolMap, scene: Phaser.Scene)
	{
		this.poolMap = poolMap
		this.scene = scene
	}

	create(count = 5, layout = FieldLayout.Random)
	{
		switch (layout)
		{
			default:
			case FieldLayout.Random:
				return this.setupRandomAsteroids(count)
		}
	}

	breakAsteroid(asteroid: IAsteroid, forceDirection: Phaser.Math.Vector2, count = 3)
	{
		const radius = (asteroid.width + asteroid.height) * 0.5
		const origin = new Phaser.Math.Vector2(asteroid.x, asteroid.y)

		const key = asteroid.texture.key
		this.poolMap.despawn(asteroid, key)

		const pool = this.poolMap.get(key)
		if (!pool)
		{
			return
		}

		const nextSize = this.getNextSmallerSize(pool.asteroidSize)
		if (nextSize === AsteroidSize.Dust)
		{
			return
		}

		const keys = textureKeysForSize(nextSize)
		if (keys.length <= 0)
		{
			return
		}

		let angle = Phaser.Math.Between(0, 359)
		const angleIncrement = 360 / count
		for (let i = 0; i < count; ++i)
		{
			const texIdx = Phaser.Math.Between(0, keys.length - 1)
			const vec = this.scene.physics.velocityFromAngle(angle, radius * 0.5)

			this.poolMap.spawn(
				origin.x + vec.x,
				origin.y + vec.y,
				keys[texIdx]
			)
			?.useCircleCollider(undefined, 0.8)
			.setVelocity(vec.x + (forceDirection.x * radius * 0.5), vec.y + (forceDirection.y * radius * 0.5))

			angle += Phaser.Math.Between(angleIncrement - 10, angleIncrement + 10)
		}
	}

	update(dt: number)
	{
		if (!this.poolMap)
		{
			return
		}

		const canvasBounds = this.scene.scale.canvasBounds
		const pools = this.poolMap.values

		pools.forEach(pool => {
			const asteroids = pool.getChildren() as Phaser.Physics.Arcade.Sprite[]
			asteroids.forEach(asteroid => wrapBounds(asteroid, canvasBounds))
		})
	}

	private setupRandomAsteroids(count = 10)
	{
		const width = this.scene.scale.width
		const height = this.scene.scale.height

		const ret: IAsteroid[] = []
		for (let i = 0; i < count; ++i)
		{
			const x = Phaser.Math.Between(0, width)
			const y = Phaser.Math.Between(0, height)
			const texIdx = Phaser.Math.Between(0, BigAsteroidTextureKeys.length - 1)

			const asteroid = this.poolMap.spawn(x, y, BigAsteroidTextureKeys[texIdx])

			if (!asteroid)
			{
				continue
			}

			ret.push(asteroid.useCircleCollider(undefined, 0.8))
		}
				
		return ret
	}

	private getNextSmallerSize(size: AsteroidSize)
	{
		switch (size)
		{
			case AsteroidSize.Large:
				return AsteroidSize.Medium
			case AsteroidSize.Medium:
				return AsteroidSize.Small

			default:
			case AsteroidSize.Small:
				return AsteroidSize.Dust
		}
	}
}
