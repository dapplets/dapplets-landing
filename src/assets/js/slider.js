// Slider
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

// Smooth scroll
document.querySelectorAll('a[href="#form"').forEach(smoothScrollOnElements);

function smoothScrollOnElements(links) {
  links.addEventListener('click', smoothScroll)
}

function smoothScroll(event) {
  event.preventDefault()

  const href = event.target.getAttribute('href').substr(1)

  document.getElementById(href)
    .scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })
}