const wrapBounds = (object: Phaser.GameObjects.Components.Transform & Phaser.GameObjects.Components.ComputedSize, bounds: Phaser.Geom.Rectangle) => {
	if (!object)
	{
		return
	}

	const x = object.x
	const y = object.y

	const length = Math.max(object.width, object.height)
	const halfLength = length * 0.5

	if (x <  bounds.x - halfLength)
	{
		object.x = bounds.x + bounds.width + halfLength
	}
	else if (x > bounds.x + bounds.width + halfLength)
	{
		object.x = bounds.x - halfLength
	}

	if (y < bounds.y - halfLength)
	{
		object.y = bounds.y + bounds.height + halfLength
	}
	else if (y > bounds.y + bounds.height + halfLength)
	{
		object.y = bounds.y - halfLength
	}
}

export default wrapBounds
