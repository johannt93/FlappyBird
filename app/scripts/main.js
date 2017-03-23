
/**
 * Bootstrap and start the game.
 */
$(function() {
    'use strict';
    var Controls = window.Controls;
    var game = new window.Game($('.GameCanvas'));
    document.getElementById("geme").onmousedown = function() {
        game.start();
    };
});
