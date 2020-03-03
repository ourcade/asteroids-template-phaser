declare namespace Phaser.GameObjects
{
	interface GameObjectFactory
	{
		playerShip(x: number, y: number, texture: string): IPlayerShip
	}
}