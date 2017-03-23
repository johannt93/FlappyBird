
window.Game = (function() {
	'use strict';
	
	var frontOfPipe = true;

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */
	var Game = function(el) {
		this.el = el;
		
		this.playerEl = this.el.find('.Player');

		this.pipeSetEl1 = this.el.find('.Pipe-set-1');
		this.pipeSetEl2 = this.el.find('.Pipe-set-2');
		this.pipeSetEl3 = this.el.find('.Pipe-set-3');
		this.pipeSetEl4 = this.el.find('.Pipe-set-4');

		// EVERY SINGLE PIPE ELEMENT:
		this.pipeTop1 = this.el.find('.Pipe-Top1');
		this.pipeBot1 = this.el.find('.Pipe-Bottom1');
		this.pipeTop2 = this.el.find('.Pipe-Top2');
		this.pipeBot2 = this.el.find('.Pipe-Bottom2');
		this.pipeTop3 = this.el.find('.Pipe-Top3');
		this.pipeBot3 = this.el.find('.Pipe-Bottom3');
		this.pipeTop4 = this.el.find('.Pipe-Top4');
		this.pipeBot4 = this.el.find('.Pipe-Bottom4');

		this.player = new window.Player(this.playerEl, this);
		this.pipeSet1 = new window.Pipes(this.pipeSetEl1, this, 102.4);	// 27.6 between
		this.pipeSet2 = new window.Pipes(this.pipeSetEl2, this, 130.0);
		this.pipeSet3 = new window.Pipes(this.pipeSetEl3, this, 157.6);
		this.pipeSet4 = new window.Pipes(this.pipeSetEl4, this, 185.2);
		this.scoreboard = new window.Score(this.el.find('.Scoreboard'), this);
		this.isPlaying = false;

		// Cache a bound onFrame since we need it each frame.
		this.onFrame = this.onFrame.bind(this);
	};

	/**
	 * Runs every frame. Calculates a delta and allows each game
	 * entity to update itself.
	 */
	Game.prototype.onFrame = function() {
		// Check if the game loop should stop.
		if (!this.isPlaying) {
			return;
		}
		// Calculate how long since last frame in seconds.
		var now = +new Date() / 1000,
				delta = now - this.lastFrame;
		this.lastFrame = now;

		// Update game entities.
		this.player.onFrame(delta);
		this.pipeSet1.onFrame(delta);
		this.pipeSet2.onFrame(delta);
		this.pipeSet3.onFrame(delta);
		this.pipeSet4.onFrame(delta);
		//this.pipeSet1.moveLeft(this.xMovement);
		// Request next frame.

		if( this.checkPlayerPipeCollision(this.pipeTop1) ||
			this.checkPlayerPipeCollision(this.pipeBot1) ||
			this.checkPlayerPipeCollision(this.pipeTop2) ||
			this.checkPlayerPipeCollision(this.pipeBot2) ||
			this.checkPlayerPipeCollision(this.pipeTop3) ||
			this.checkPlayerPipeCollision(this.pipeBot3) ||
			this.checkPlayerPipeCollision(this.pipeTop4) ||
			this.checkPlayerPipeCollision(this.pipeBot4) ) {
			this.gameover();
		}

		this.scoreboard.calcScore(this.pipeSetEl1, this.pipeSetEl2, this.pipeSetEl3, this.pipeSetEl4);
		
		window.requestAnimationFrame(this.onFrame);
	};

	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		this.reset();
		this.pipeSetEl1.css('visibility', 'visible');
		this.pipeSetEl2.css('visibility', 'visible');
		this.pipeSetEl3.css('visibility', 'visible');
		this.pipeSetEl4.css('visibility', 'visible');
		this.scoreboard.showCounter();

		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	Game.prototype.reset = function() {
		this.player.reset();
		this.scoreboard.reset();
		this.pipeSet1.reset();
		this.pipeSet2.reset();
		this.pipeSet3.reset();
		this.pipeSet4.reset();
		$('.Ground-loop').css('animation-play-state', 'running');
	};

	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		this.isPlaying = false;
		$('.Ground-loop').css('animation-play-state', 'paused');
		
		this.scoreboard.showBoard();
	};

	Game.prototype.checkPlayerPipeCollision = function(pipeEl) {	// Lanad af http://stackoverflow.com/questions/14012766/detecting-whether-two-divs-overlap 
		var playerEl = this.playerEl;
		var playerX = playerEl.offset().left;
		var playerY = playerEl.offset().top;
		var playerHeight = playerEl.outerHeight(true);
		var playerWidth = playerEl.outerWidth(true);
		var b1 = playerY + playerHeight;
		var r1 = playerX + playerWidth;
		
		var pipeX = pipeEl.offset().left;
		var pipeY = pipeEl.offset().top;
		var pipeHeight = pipeEl.outerHeight(true);
		var pipeWidth = pipeEl.outerWidth(true);
		var b2 = pipeY + pipeHeight;
		var r2 = pipeX + pipeWidth;
		
		if(b1 < pipeY || playerY > b2 || r1 < pipeX || playerX > r2) {
			return false;
		} else {
			return true;
		}
	}

	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;
})();