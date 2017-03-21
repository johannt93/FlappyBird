window.Pipes = (function() {
    'use strict';


    var Pipes = function(el, game, initialPosX) {
        this.el = el;
        this.game = game;
        this.posX = initialPosX;
        this.initPos = initialPosX;
    };

    Pipes.prototype.reset = function() {
        this.posX = this.initPos;
    }

    Pipes.prototype.onFrame = function(delta) {
        this.posX -= 0.2;
        this.moveLeft(this.posX);
	};

    Pipes.prototype.moveLeft = function(xMovement) {
        if(this.posX > (0 - 8.5)) {
            this.el.css('transform', 'translateZ(0) translateX('+ this.posX + 'em)');
        } else {
            this.posX = 102.4;
        }
    }

    return Pipes;
})();