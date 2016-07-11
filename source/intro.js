/* Copyright © 2011-2015 by Neil Jenkins. MIT Licensed. */
/*jshint ignore:start */

( function ( doc, undefined ) {

"use strict";

/**
 * The requestAnimationFrame polyfill
 * Paul Irish.
 * {@link http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/}
 */
window._rAF = (function() {
  return window.requestAnimationFrame ||
     window.webkitRequestAnimationFrame ||
     window.mozRequestAnimationFrame ||
     function(callback) {
       window.setTimeout(callback, 16);
     };
})();
