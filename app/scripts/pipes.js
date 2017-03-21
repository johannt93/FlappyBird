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
    }

    Pipes.prototype.onFrame = function(delta) {
        this.posX -= 0.2;
        //this.changeHeight();
        this.moveLeft(this.posX);
	};

    Pipes.prototype.moveLeft = function(xMovement) {
        if(this.posX > (0 - 8.5)) {
            this.el.css('transform', 'translateZ(0) translateX('+ this.posX + 'em)');
        } else {
            this.posX = 102.4;
            this.changeHeight();
        }
    }

    Pipes.prototype.changeHeight = function() {
        var rand = pipeHeights[Math.floor(Math.random() * pipeHeights.length)];
        this.el.css('bottom', rand + '%');                     // bottom max 25 min -15
    }

    return Pipes;
})();


/*Pipes.prototype.changeHeight = function() {
        var topEl = this.el.find('.Pipe-Top1');
        var bottomEl = this.el.find('.Pipe-Bottom1');
        this.height = 50;
        topEl.css('bottom', (100 - this.height + 30) + '%');    // Tek Hæðina í prosentum frá toppnum, mínusa með 100 til að fá reverse % og + 30 fyrir bilið
        bottomEl.css('top', this.height + '%');                 // 100 - 65 = 35 + 30 = 65
    }*/