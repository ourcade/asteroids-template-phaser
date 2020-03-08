import { AsteroidSize } from '~/game/AsteroidSize'

export default interface IAsteroid extends Phaser.Physics.Arcade.Sprite
{
	readonly asteroidSize: AsteroidSize

	setAsteroidSize(size: AsteroidSize): void

	useCircleCollider(radius?: number, scaleFactor?: number, offsetX?: number, offsetY?: number): IAsteroid
	useSquareCollider(width: number): IAsteroid
	useScaledCollider(scaleFactor: number): IAsteroid
}
