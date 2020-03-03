import Phaser from 'phaser'

declare global
{
	interface IPlayerShip extends Phaser.Physics.Arcade.Sprite
	{
		update(dt: number): void
	}
}

export interface IPlayerShipConfig
{
	acceleration?: number
	speed?: number
	turnSpeed?: number
}

export default class PlayerShip extends Phaser.Physics.Arcade.Sprite implements IPlayerShip
{
	private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys

	private acceleration = 5
	private speed = 100
	private turnSpeed = 2

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
	{
		super(scene, x, y, texture)

		this.cursorKeys = scene.input.keyboard.createCursorKeys()
	}

	configure(config: IPlayerShipConfig)
	{
		this.speed = config.speed || this.speed
		this.turnSpeed = config.turnSpeed || this.turnSpeed
	}

	update(dt: number)
	{
		const angle = this.angle
		if (this.cursorKeys.left?.isDown)
		{
			this.setAngle(angle - 2)
		}
		else if (this.cursorKeys.right?.isDown)
		{
			this.setAngle(angle + 2)
		}

		if (this.cursorKeys.up?.isDown)
		{
			const dir = this.scene.physics.velocityFromRotation(this.rotation, 1)
			const vel = this.body.velocity

			vel.x += dir.x * this.acceleration
			vel.y += dir.y * this.acceleration

			this.setVelocity(vel.x, vel.y)
		}
	}
}

Phaser.GameObjects.GameObjectFactory.register('playerShip', function (x: number, y: number, key: string) {
	// @ts-ignore
	var ship = new PlayerShip(this.scene, x, y, key)

	// @ts-ignore
	this.displayList.add(ship)
	// @ts-ignore
	this.updateList.add(ship)

	// @ts-ignore
	this.scene.physics.world.enableBody(ship, Phaser.Physics.Arcade.DYNAMIC_BODY)

	return ship
})
