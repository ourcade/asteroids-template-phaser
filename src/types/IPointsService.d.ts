import IAsteroid from './IAsteroid'

export default interface IPointsService
{
	addForAsteroid(asteroid: IAsteroid): number
	forAsteroid(asteroid: IAsteroid): number
}
