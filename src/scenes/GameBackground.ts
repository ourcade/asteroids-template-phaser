import Phaser from 'phaser'

export default class GameBackground extends Phaser.Scene
{
	preload()
	{

	}

	create()
	{
		this.cameras.main.setBackgroundColor('rgba(255,0,0,1)')
	}
}
