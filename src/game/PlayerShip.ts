import Phaser from 'phaser'
import LaserModule from './LaserModule'

import throttle from '~/decorators/throttle'
import IProjectile from '~/types/IProjectile'

declare global
{
	interface IPlayerShip extends Phaser.Physics.Arcade.Sprite
	{
		configure(config: IPlayerShipConfig): IPlayerShip
		useCircleCollider(radius?: number, offsetX?: number, offsetY?: number): IPlayerShip
		useSquareCollider(width: number): IPlayerShip
		useScaledCollider(scaleFactor: number): IPlayerShip

		setLaserModule(laserModule: LaserModule): void

		fire(): IProjectile | null

		update(dt: number): void
	}
}

export interface IPlayerShipConfig
{
	acceleration?: number
	turnSpeed?: number
	colliderRadius?: number
	drag?: number
}

const DefaultAcceleration = 5
const DefaultTurnSpeed = 2
const DefaultColliderRadius = 50
const DefaultDrag = 0.995

export default class PlayerShip extends Phaser.Physics.Arcade.Sprite implements IPlayerShip
{
	private cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys
	private fireKey: Phaser.Input.Keyboard.Key

	private acceleration = DefaultAcceleration
	private turnSpeed = DefaultTurnSpeed
	private colliderRadius = DefaultColliderRadius

	private laserModule?: LaserModule

	constructor(scene: Phaser.Scene, x: number, y: number, texture: string)
	{
		super(scene, x, y, texture)

		this.cursorKeys = scene.input.keyboard.createCursorKeys()
		this.fireKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
	}

	configure(config: IPlayerShipConfig)
	{
		this.turnSpeed = config.turnSpeed || DefaultTurnSpeed
		this.acceleration = config.acceleration || DefaultAcceleration
		this.colliderRadius = config.colliderRadius || DefaultColliderRadius
		const body = this.body as Phaser.Physics.Arcade.Body

		const drag = config.drag || DefaultDrag
		body.setDrag(drag, drag)

		return this
	}

	useCircleCollider(radius: number | undefined, offsetX = 0, offsetY = 0)
	{
		const r = radius || this.colliderRadius
		this.body.setCircle(r, offsetX, offsetY)

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

	setLaserModule(laserModule: LaserModule)
	{
		this.laserModule = laserModule
	}

	fire(): IProjectile | null
	{
		if (!this.laserModule)
		{
			return null
		}

		// distance to nose of ship
		const noseOffset = this.scene.physics.velocityFromRotation(this.rotation, this.width * 0.5)

		const laser = this.laserModule.fireFrom(
			this.x + noseOffset.x,
			this.y + noseOffset.y,
			noseOffset.normalize()
		)

		const len = this.body.velocity.length()
		if (len)
		{
			const v = laser.physicsBody.velocity.clone().normalize()
			v.x *= len
			v.y *= len
			laser.physicsBody.velocity.x += v.x
			laser.physicsBody.velocity.y += v.y
		}

		return laser
	}

	update(dt: number)
	{
		const angle = this.angle
		if (this.cursorKeys.left?.isDown)
		{
			this.setAngle(angle - this.turnSpeed)
		}
		else if (this.cursorKeys.right?.isDown)
		{
			this.setAngle(angle + this.turnSpeed)
		}

		if (this.cursorKeys.up?.isDown)
		{
			const dir = this.scene.physics.velocityFromRotation(this.rotation, 1)
			const vel = this.body.velocity

			vel.x += dir.x * this.acceleration
			vel.y += dir.y * this.acceleration

			this.setVelocity(vel.x, vel.y)
		}

		if (this.fireKey.isDown)
		{
			this.throttledFire()
		}
	}

	@throttle(150, { leading: true, trailing: false })
	private throttledFire()
	{
		this.fire()
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

	const body = ship.body as Phaser.Physics.Arcade.Body
	body.useDamping = true
	body.setDrag(DefaultDrag, DefaultDrag)
	body.allowDrag = true

	return ship
})
