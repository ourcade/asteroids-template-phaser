import IProjectile from '~/types/IProjectile'

export default class Laser extends Phaser.GameObjects.Container implements IProjectile
{
	private sprite: Phaser.GameObjects.Sprite // Phaser.GameObjects.Arc

	private speed = 500

	get physicsBody()
	{
		return this.body as Phaser.Physics.Arcade.Body
	}

	get display()
	{
		return this.sprite
	}

	private get radius()
	{
		return this.sprite.height * 0.5
	}

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
	{
		super(scene, x, y)

		this.sprite = scene.add.sprite(0, 0, texture)
		this.sprite.setOrigin(0.85, 0.5)
		this.add(this.sprite)

		scene.physics.add.existing(this)

		this.physicsBody.setCircle(this.radius)
		this.sprite.y += this.radius
		this.sprite.x += this.radius

		this.on('on-spawned', this.handleOnSpawned, this)
	}

	fireAt(x: number, y: number)
	{
		const targetAngle = Phaser.Math.Angle.Between(
			this.x + this.radius, this.y + this.radius,
			x, y
		)

		this.sprite.setRotation(targetAngle)

		const offset = this.scene.physics.velocityFromRotation(targetAngle, this.sprite.width * 0.5)
		this.x += offset.x
		this.y += offset.y

		const vel = this.scene.physics.velocityFromRotation(targetAngle, this.speed)
		this.physicsBody.velocity = vel
	}

	private handleOnSpawned()
	{
		// offset for container origin of 0,0
		this.x -= this.radius
		this.y -= this.radius
	}
}