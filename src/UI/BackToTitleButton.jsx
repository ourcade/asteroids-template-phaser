function button(text = 'Back to Title') {
	return (
		<button class="button is-info is-large"
			style="width: 300px"
		>
			<span style="font-family: 'Fredoka One'; font-size: 1em">
				{ text }
			</span>
		</button>
	)
}

export default button
