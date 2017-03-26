window.Pipes = (function() {
    'use strict';

    var pipeHeights = [-15, -5, 0, 5, 8, 10, 12, 15, 18, 20, 25];

    var Pipes = function(el, game, initialPosX) {
        this.el = el;
        this.game = game;
        this.posX = initialPosX;
        this.initPos = initialPosX;
    };

    Pipes.prototype.reset = function() {
        this.posX = this.initPos;
    };

    Pipes.prototype.onFrame = function(delta) {
        this.posX -= 0.2;
        this.moveLeft(this.posX);
	};
    
    Pipes.prototype.moveLeft = function(xMovement) {
        if(this.game.player.isAlive) {
            if(this.posX > (0 - 8.5)) {
                this.el.css('transform', 'translateZ(0) translateX('+ this.posX + 'em)');
            } else {
                this.posX = 102.4;
                this.changeHeight();
            }
        }
    };

    Pipes.prototype.changeHeight = function() {
        var rand = pipeHeights[Math.floor(Math.random() * pipeHeights.length)];
        this.el.css('bottom', rand + '%');                     // bottom max 25 min -15
    };

    return Pipes;
})();