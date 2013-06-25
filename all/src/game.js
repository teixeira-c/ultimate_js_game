var Game = (function() {
	function Game(opts) {

		// To run physics
		this.fps = 0.025;

		// Debug
		this.debug = opts.debug || false;

		// Canvas
		this.cnvs = document.getElementById(opts.el);
		if (!this.cnvs)
			throw "No canvas found";

		this.ctx  = this.cnvs.getContext("2d");
		this.size = new _Point(this.cnvs.width, this.cnvs.height);
		this.raf;
		this.time;
		this.loop;
		this.map;

		this.shapes = [];
		this.myShapes = [];

		Input.call(this);
		this.env.new({});
	}

	Game.prototype.input = Input.prototype;
	Game.prototype.env = Env.prototype;
	Game.prototype.rsc = Ressources.prototype;

	Game.prototype.play = function() {
		this.raf = window.requestAnimationFrame(this.loop, this.cnvs);
	}
	Game.prototype.stop = function() {
		window.cancelAnimationFrame(this.raf);
	}

	return Game;
})();
