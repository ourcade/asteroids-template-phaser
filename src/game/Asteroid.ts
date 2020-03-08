import IAsteroid from '~/types/IAsteroid'
import { AsteroidSize } from './AsteroidSize'

export default class Asteroid extends Phaser.Physics.Arcade.Sprite implements IAsteroid
{
	private _asteroidSize = AsteroidSize.Large

	get asteroidSize()
	{
		return this._asteroidSize
	}

	setAsteroidSize(size: AsteroidSize)
	{
		this._asteroidSize = size
	}

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
