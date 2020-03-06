import IProjectile from './IProjectile'

declare global
{
	interface IProjectilePool extends Phaser.Physics.Arcade.Group
	{
		spawn(x: number, y: number, texture: string): IProjectile
		despawn(laser: IProjectile): void
	}
}
