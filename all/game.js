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
		this.ctx  = canvas.getContext("2d");
		this.ctxH = canvas.height;
		this.ctxW = canvas.width;
		this.rId;

		_Input.call(this);
	}

	Game.prototype = _Input.prototype;

	return Game;
})();
