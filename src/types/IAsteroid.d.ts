export default interface IAsteroid extends Phaser.Physics.Arcade.Sprite
{
	useCircleCollider(radius?: number, scaleFactor?: number, offsetX?: number, offsetY?: number): IAsteroid
	useSquareCollider(width: number): IAsteroid
	useScaledCollider(scaleFactor: number): IAsteroid
}
