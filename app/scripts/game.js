
window.Game = (function() {
	'use strict';

	/**
	 * Main game class.
	 * @param {Element} el jQuery element containing the game.
	 * @constructor
	 */
	var Game = function(el) {
		this.el = el;
		this.player = new window.Player(this.el.find('.Player'), this);
		this.pipeSet1 = new window.Pipes(this.el.find('.Pipe-set-1'), this, 102.4);	// 27.6 between
		this.pipeSet2 = new window.Pipes(this.el.find('.Pipe-set-2'), this, 130.0);
		this.pipeSet3 = new window.Pipes(this.el.find('.Pipe-set-3'), this, 157.6);
		this.pipeSet4 = new window.Pipes(this.el.find('.Pipe-set-4'), this, 185.2);
		this.isPlaying = false;
		this.xMovement = 0;

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
		this.xMovement -= 0.21;
		//this.pipeSet1.moveLeft(this.xMovement);
		// Request next frame.
		window.requestAnimationFrame(this.onFrame);
	};

	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		this.reset();
		$('.Pipe-set-1').css('visibility', 'visible');
		$('.Pipe-set-2').css('visibility', 'visible');
		$('.Pipe-set-3').css('visibility', 'visible');
		$('.Pipe-set-4').css('visibility', 'visible');

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
		this.pipeSet1.reset();
		this.pipeSet2.reset();
		this.pipeSet3.reset();
		this.pipeSet4.reset();
	};

	/**
	 * Signals that the game is over.
	 */
	Game.prototype.gameover = function() {
		this.isPlaying = false;
		$('.Ground-loop').css('animation-play-state', 'paused');
		// Should be refactored into a Scoreboard class.
		var that = this;
		var scoreboardEl = this.el.find('.Scoreboard');
		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
				.one('click', function() {
					scoreboardEl.removeClass('is-visible');
					that.start();
				});
	};

	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;
})();


