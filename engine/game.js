var Game = (function() {
	function Game(opts) {
		opts = opts || {};

		// Canvas
		this.cnv = document.getElementById(opts.el);
		if (!this.cnv)
			throw "No canvas found";

		this.ctx  = this.cnv.getContext("2d");
		this.size = new Vector(this.cnv.width, this.cnv.height);
		this.raf;
		this.time;
		this.loop;
		this.map;

		// To run physics
		this.fps = 0.025;

		// Debug
		this.debug = opts.debug || false;

		this.shapes = [];
		this.myShapes = [];

		this.polyfillRAF();

		Input.call(this);
		this.env.new();
	}

	Game.prototype.input = Input.prototype;
	Game.prototype.env = Env.prototype;
	Game.prototype.rsc = Ressources.prototype;

	Game.prototype.polyfillRAF = function() {
		var vendors = ['ms', 'moz', 'webkit', 'o'];
	    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
	        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
	        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
	                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
	    }
	}
	Game.prototype.play = function() {
		this.raf = window.requestAnimationFrame(this.loop, this.cnvs);
	}

	Game.prototype.stop = function() {
		window.cancelAnimationFrame(this.raf);
	}

	return Game;
})();
