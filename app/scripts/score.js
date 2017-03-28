window.Score = (function() {
    'use strict';

    var Score = function(el, game) {
        this.el = el;
        this.game = game;
        this.score = 0;
        this.highScore = 0;
		this.scoredSound = "../sounds/score.wav";
    };

    Score.prototype.reset = function() {
        this.score = 0;
    }

    Score.prototype.showBoard = function() {
        var that = this.game;
		var scoreboardEl = this.el;
		scoreboardEl
			.find('.Mute-button')
			.on('click', function() {
				that.muteSounds();
			});
		scoreboardEl
			.addClass('is-visible')
			.find('.Scoreboard-restart')
				.one('click', function() {
					scoreboardEl.find('.Mute-button').off('click');
					scoreboardEl.removeClass('is-visible');
					that.start();
				});
        document.querySelector('.Scoreboard h1').innerHTML = "Score: " + this.score + "<br>High score: " + this.highScore;
    }

    Score.prototype.showCounter = function() {
        var that = this;
		var scoreCountEl = this.game.el.find('.Score-count');
		scoreCountEl
			.addClass('is-visible')
        document.querySelector('.Score-count h1').innerHTML = this.score;
    }

    Score.prototype.calcScore = function(pipeSetEl1, pipeSetEl2, pipeSetEl3, pipeSetEl4) {
		var playerX = this.game.playerEl.offset().left;
		var pipeSetX1 = pipeSetEl1.offset().left;
		var pipeSetX2 = pipeSetEl2.offset().left;
		var pipeSetX3 = pipeSetEl3.offset().left;
		var pipeSetX4 = pipeSetEl4.offset().left;

		if(playerX == pipeSetX1 || playerX == pipeSetX2 || playerX == pipeSetX3 || playerX == pipeSetX4) {
			if(this.game.player.isAlive) {
				this.score += 1;
				this.playScoreSound();
				document.querySelector('.Score-count h1').innerHTML = this.score;
				if(this.score > this.highScore) {
					this.highScore = this.score;
				}
			}
		}
	}

	Score.prototype.playScoreSound = function() {
		if(!this.game.soundsMuted) {
			var audio = new Audio();
			audio.src = this.scoredSound;
			audio.loop = false;
			audio.play();
		}
	}

    return Score;
})();