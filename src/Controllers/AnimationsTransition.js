/*
 * This Module acts as a Facade to execute the animations.
 *
 * The transition of the animations is 200ms because of the CSS and the classes
 * So before a viewController.render(), we have to wait 200ms to make possible
 * the animation be executed.
 *
 * If we want to change the timing:
 *    - change the CONST in Events.js
 *    - change the CSS animations.sass timing transitions
 */
const AnimationsTransition = () => {
  const STYLE_BLOCK = 'block';
  const STYLE_NONE = 'none';

  function _fadeIn(_element) {
    _element.classList.remove('fadeOut');
    _element.classList.add('fadeIn');
  }

  function _fadeOut(_element) {
    _element.classList.remove('fadeIn');
    _element.classList.add('fadeOut');
  }

  function _slideToRight(_element) {
    _element.classList.remove('slideToLeft');
    _element.classList.add('slideToRight');
  }

  function _slideToLeft(_element) {
    _element.classList.remove('slideToRight');
    _element.classList.add('slideToLeft');
  }

  function _slideToRightAndFadeIn(_element) {
    _slideToRight(_element);
    _fadeIn(_element);
    setTimeout(() => {
      _element.style.display = STYLE_BLOCK;
    }, 200);
  }

  function _slideToRightAndFadeOut(_element) {
    _slideToRight(_element);
    _fadeOut(_element);
    setTimeout(() => {
			_element.style.display = STYLE_NONE;
    }, 200);
  }

  function _slideToLeftAndFadeIn(_element) {
    _slideToLeft(_element);
    _fadeIn(_element);
    setTimeout(() => {
      _element.style.display = STYLE_BLOCK;
    }, 200);
  }

  function _slideToLeftAndFadeOut(_element) {
    _slideToLeft(_element);
    _fadeOut(_element);
    setTimeout(() => {
			_element.style.display = STYLE_NONE;
    }, 200);
  }

  return {
    fadeIn: _fadeIn,
    fadeOut: _fadeOut,
    slideToRight: _slideToRight,
    slideToLeft: _slideToLeft,
    slideToRightAndFadeIn: _slideToRightAndFadeIn,
    slideToRightAndFadeOut: _slideToRightAndFadeOut,
    slideToLeftAndFadeIn: _slideToLeftAndFadeIn,
    slideToLeftAndFadeOut: _slideToLeftAndFadeOut,
  };
};

export default AnimationsTransition;
