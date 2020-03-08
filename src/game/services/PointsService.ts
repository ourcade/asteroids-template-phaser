import IPointsService from '~/types/IPointsService'
import IAsteroid from '~/types/IAsteroid'

import { AsteroidSize } from '~/game/AsteroidSize'

export default class PointsService implements IPointsService
{
	private totalPoints = 0

	get total()
	{
		return this.totalPoints
	}

	addForAsteroid(asteroid: IAsteroid)
	{
		const points = this.forAsteroid(asteroid)
		this.totalPoints += points

		return points
	}

	forAsteroid(asteroid: IAsteroid)
	{
		switch (asteroid.asteroidSize)
		{
			default:
			case AsteroidSize.Dust:
				return 0

			case AsteroidSize.Large:
				return 20

			case AsteroidSize.Medium:
				return 40

			case AsteroidSize.Small:
				return 100
		}
	}

	reset()
	{
		this.totalPoints = 0
	}
}