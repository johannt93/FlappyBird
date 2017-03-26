
/**
 * Bootstrap and start the game.
 */
$(function() {
    'use strict';
    var Controls = window.Controls;
    var game = new window.Game($('.GameCanvas'));
    
    game.start();
});
