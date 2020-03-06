import { TextureKeys } from '~/consts/GameKeys'

import wrapBounds from '~/utils/wrapBounds'

const BigAsteroidTextureKeys = [
	TextureKeys.AsteroidBig1,
	TextureKeys.AsteroidBig2,
	TextureKeys.AsteroidBig3,
	TextureKeys.AsteroidBig4
]

export enum FieldLayout
{
	Random
}

export default class AsteroidField
{
	private pool: IAsteroidPool
	private scene: Phaser.Scene

	constructor(pool: IAsteroidPool, scene: Phaser.Scene)
	{
		this.pool = pool
		this.scene = scene
	}

	create(layout = FieldLayout.Random)
	{
		// TODO: create asteroid field with given layout
		const width = this.scene.scale.width
		const height = this.scene.scale.height

		const x = Phaser.Math.Between(0, width)
		const y = Phaser.Math.Between(0, height)
		const texIdx = Phaser.Math.Between(0, BigAsteroidTextureKeys.length - 1)
		
		return [
			this.pool.spawn(x, y, BigAsteroidTextureKeys[texIdx]).useCircleCollider(undefined, 0.8)
		]
	}

	update(dt: number)
	{
		if (!this.pool)
		{
			return
		}

		const canvasBounds = this.scene.scale.canvasBounds
		const asteroids = this.pool.getChildren() as Phaser.Physics.Arcade.Sprite[]
		asteroids.forEach(asteroid => wrapBounds(asteroid, canvasBounds))
	}
}