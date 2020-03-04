import Phaser from 'phaser'

export default class GameBackground extends Phaser.Scene
{
	preload()
	{
		// TODO: add stars
	}

	create()
	{
		this.cameras.main.setBackgroundColor('rgba(0,0,0,1)')
	}
}
