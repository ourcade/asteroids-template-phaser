import IProjectile from '~/types/IProjectile'

export default class Bullet extends Phaser.GameObjects.Arc implements IProjectile
{
	private speed = 500

	get physicsBody()
	{
		return this.body as Phaser.Physics.Arcade.Body
	}

	constructor(scene: Phaser.Scene, x: number, y: number)
	{
		super(scene, x, y, 5, 0, 360, false, 0xffffff, 1)

		scene.physics.add.existing(this)
	}

	fireAt(x: number, y: number)
	{
		const targetAngle = Phaser.Math.Angle.Between(
			this.x, this.y,
			x, y
		)

		const vel = this.scene.physics.velocityFromRotation(targetAngle, this.speed)
		this.physicsBody.velocity = vel
	}
}