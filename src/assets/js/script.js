const slider = tns({
	container: '.slider-wrapper',
	items: 1,

	controls: false,
	nav: false,
	mouseDrag: true,
	autoHeight: true,
});

sliderButton('.slider-left', 'prev');
sliderButton('.slider-right', 'next');

function sliderButton(buttonSelector, direction) {
	const button = document.querySelector(buttonSelector);
	button.addEventListener('click', () => slider.goTo(direction));
}