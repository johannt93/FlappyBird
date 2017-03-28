
window.Game = (function() {
	'use strict';

	var Controls = window.Controls;
	var startInput = false;

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

		// EVERY PIPE ELEMENT:
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
		this.hitSound = "../sounds/hit.wav";
		this.music = "../sounds/superfatman.wav";
		this.backgroundTrack = new Audio();
		this.backgroundTrack.src = "../sounds/superfatman.wav";
		this.backgroundTrack.loop = true;
		this.isPlaying = false;
		this.muteBtn = document.getElementById('mutebtn');
		this.soundsMuted = false;
		this.run = false;

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
		this.waitForInput();
		if(this.run) {
			// Update game entities.
			this.player.onFrame(delta);
			this.pipeSet1.onFrame(delta);
			this.pipeSet2.onFrame(delta);
			this.pipeSet3.onFrame(delta);
			this.pipeSet4.onFrame(delta);
			//this.pipeSet1.moveLeft(this.xMovement);
			// Request next frame.
			
			if(this.hasImpactedPipe()) {
				this.player.isAlive = false;
			}
			this.scoreboard.calcScore(this.pipeSetEl1, this.pipeSetEl2, this.pipeSetEl3, this.pipeSetEl4);
		}
		window.requestAnimationFrame(this.onFrame);
	};

	Game.prototype.waitForInput = function() {
		if(Controls.keys.space) {
			this.run = true;
			this.showPipes();
			this.scoreboard.showCounter();
			this.hideStartMsg();
			this.hideLogo();
		}
	}

	/**
	 * Starts a new game.
	 */
	Game.prototype.start = function() {
		this.reset();
		if(!this.soundsMuted) {
			this.backgroundTrack.play();
		}
		// Restart the onFrame loop
		this.lastFrame = +new Date() / 1000;
		window.requestAnimationFrame(this.onFrame);
		this.isPlaying = true;	
		//this.muteBtn.addEventListener("click", this.muteSounds());	
	};

	/**
	 * Resets the state of the game so a new game can be started.
	 */
	Game.prototype.reset = function() {
		this.hidePipes();
		this.resetInterface();
		this.showStartMsg();
		this.showLogo();
		this.player.reset();
		this.scoreboard.reset();
		this.pipeSet1.reset();
		this.pipeSet2.reset();
		this.pipeSet3.reset();
		this.pipeSet4.reset();
		this.playerAlive = true;
		this.run = false;
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

	// Lanad af http://stackoverflow.com/questions/14012766/detecting-whether-two-divs-overlap
	Game.prototype.checkPlayerPipeCollision = function(pipeEl) {
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
	};

	Game.prototype.hasImpactedPipe = function() {
		if( this.checkPlayerPipeCollision(this.pipeTop1) ||
			this.checkPlayerPipeCollision(this.pipeBot1) ||
			this.checkPlayerPipeCollision(this.pipeTop2) ||
			this.checkPlayerPipeCollision(this.pipeBot2) ||
			this.checkPlayerPipeCollision(this.pipeTop3) ||
			this.checkPlayerPipeCollision(this.pipeBot3) ||
			this.checkPlayerPipeCollision(this.pipeTop4) ||
			this.checkPlayerPipeCollision(this.pipeBot4) ) {
				this.playHitSound();
				return true;
		} else {
			return false;
		}
	};

	Game.prototype.playBackgroundMusic = function() {
		if(this.backgroundTrack.currentTime == 0) {
			this.backgroundTrack.play();
		}
	}

	Game.prototype.togglePause = function(track) {
		if(this.backgroundTrack.paused) {
			this.backgroundTrack.play();
		} else {
			this.backgroundTrack.pause();
		}
	}

	Game.prototype.playHitSound = function() {
		if(!this.soundsMuted) {
			var audio = new Audio();
			if(this.player.isAlive) {
				audio.src = this.hitSound;
				audio.loop = false;
				audio.play();
			}
		}
	};

	Game.prototype.muteSounds = function() {
		if(this.soundsMuted) {
			this.soundsMuted = false;
			this.muteBtn.style.backgroundImage = "url(../images/sound-on.png";
			this.togglePause();
		} else {
			this.soundsMuted = true;
			this.muteBtn.style.backgroundImage = "url(../images/sound-off.png";
			this.togglePause();
		}
	};

	Game.prototype.hidePipes = function() {
		this.pipeSetEl1.css('visibility', 'hidden');
		this.pipeSetEl2.css('visibility', 'hidden');
		this.pipeSetEl3.css('visibility', 'hidden');
		this.pipeSetEl4.css('visibility', 'hidden');
	};

	Game.prototype.showPipes = function() {
		this.pipeSetEl1.css('visibility', 'visible');
		this.pipeSetEl2.css('visibility', 'visible');
		this.pipeSetEl3.css('visibility', 'visible');
		this.pipeSetEl4.css('visibility', 'visible');
	};

	Game.prototype.resetInterface = function() {
		this.playerEl.css('transform', 'translateZ(0) translate(30em, 10em)');
		this.player.playerModel.css('transform', 'translateZ(0) rotate(0deg)');
		var that = this;
		var scoreCountEl = this.el.find('.Score-count');
		scoreCountEl
			.removeClass('is-visible')
	};

	Game.prototype.hideStartMsg = function() {
		var that = this;
		var msgEl = this.el.find('.Start-message');
		msgEl
			.addClass('is-visible')
	}

	Game.prototype.showStartMsg = function() {
		var that = this;
		var msgEl = this.el.find('.Start-message');
		msgEl
			.removeClass('is-visible')
	}

	Game.prototype.hideLogo = function() {
		var that = this;
		var logoEl = this.el.find('.Logo-text');
		logoEl
			.addClass('is-visible')
	}

	Game.prototype.showLogo = function() {
		var that = this;
		var logoEl = this.el.find('.Logo-text');
		logoEl
			.removeClass('is-visible')
	}
	
	/**
	 * Some shared constants.
	 */
	Game.prototype.WORLD_WIDTH = 102.4;
	Game.prototype.WORLD_HEIGHT = 57.6;

	return Game;
})();