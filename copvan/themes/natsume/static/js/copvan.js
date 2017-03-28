window.$ = function(selector) {
  var selectorType = 'querySelectorAll';

  if (selector.indexOf('#') === 0) {
    selectorType = 'getElementById';
    selector = selector.substr(1, selector.length);
  }

  return document[selectorType](selector);
};

/*
var $toggle = $('#nav-toggle');
var $menu = $('#nav-menu');
$toggle.onclick(function(e) {
  $toggle.classList.toggle('is-active')
})
*/
new Clipboard('.color-droplet')
