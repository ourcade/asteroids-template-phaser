export default interface IProjectile extends Phaser.GameObjects.GameObject, Phaser.GameObjects.Components.ComputedSize, Phaser.GameObjects.Components.Transform, Phaser.GameObjects.Components.Visible
{
	physicsBody: Phaser.Physics.Arcade.Body

	width: number
	height: number

	fireAt(x: number, y: number)

	setPool(pool: IProjectilePool)
	returnToPool()
}
