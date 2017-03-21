window.Player = (function() {
	'use strict';

	var Controls = window.Controls;

	// All these constants are in em's, multiply by 10 pixels
	// for 1024x576px canvas.
	var SPEED = 0; // * 10 pixels per second
	var MAX_SPEED = 65;
	var GRAVITY = 200;
	var FLAP_SPEED = 70;
	var CAP_FLIGH_SPEED = -60;
	var WIDTH = 5;
	var HEIGHT = 5;
	var INITIAL_POSITION_X = 30;
	var INITIAL_POSITION_Y = 10;
	var MAX_ROTATION = 90;

	var Player = function(el, game) {
		this.el = el;
		this.playerModel = this.el.find('.Player-model');
		this.game = game;
		this.pos = { x: 0, y: 0 };
		this.angle = 0;
	};

	/**
	 * Resets the state of the player for a new game.
	 */
	Player.prototype.reset = function() {
		this.pos.x = INITIAL_POSITION_X;
		this.pos.y = INITIAL_POSITION_Y;
		this.SPEED = 0;
	};

	Player.prototype.onFrame = function(delta) {
		
		if(SPEED + (GRAVITY * delta) < MAX_SPEED) { // IF SPEED EXCEEDS MAX SPEEDS then cap it at the limit
			SPEED += GRAVITY * delta;
		} else {
			SPEED = MAX_SPEED;
		}
		this.pos.y += SPEED * delta;
		
		this.flap();
		
		//console.log("Speed: " + SPEED);
		this.rotatePlayer();
		//console.log("ANGLE: " + this.angle);

		this.checkCollisionWithBounds();

		// Update UI
		this.el.css('transform', 'translateZ(0) translate(' + this.pos.x + 'em, ' + this.pos.y + 'em)');
	};

	Player.prototype.checkCollisionWithBounds = function() {
		if (this.pos.y + HEIGHT > (this.game.WORLD_HEIGHT - 5)) {	// -5 since the ground is 60px high
			return this.game.gameover();
		}
	};

	Player.prototype.flap = function () {
		document.getElementById("geme").onmousedown = function() {
			//var pModel = document.getElementById("model");
			if(SPEED >= -MAX_SPEED) {
				SPEED = CAP_FLIGH_SPEED;
				//console.log("speed is now: " + SPEED);
			} else {
				SPEED -= FLAP_SPEED;
			}
			/*
			pModel.classList.remove("fly-up-animation");
			void pModel.offsetWidth;
			pModel.classList.add("fly-up-animation");
			*/
			this.angle = 0; // Reset angle speed
		};
	}

	Player.prototype.rotatePlayer = function() {
		if(SPEED > 20 && this.angle < MAX_ROTATION) {	// If bird is falling down rotate down
			this.angle += 4;
			this.playerModel.css('transform', 'rotate('+ this.angle + 'deg)');
		} else if(SPEED <= 0) {							// If bird going up look up
			this.angle = -25;
			this.playerModel.css('transform', 'rotate('+ this.angle + 'deg)');
		}
	}

	return Player;

})();
