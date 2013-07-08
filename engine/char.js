_Char = (function() {
	function Char(opts) {
		opts.is = 'char';
		opts.state = 'active';
		this.actions = {};
		this.sprites = opts.sprites || {};
		this.douple_jump = opts.douple_jump || false;

		Shape.call(this, opts);
	}

	Char.prototype = Shape.prototype;

	Char.prototype.__action = function(name, sprite) {
		this.actions[name] = true;

		if (sprite)
			this.__sprite(sprite);
	}

	Char.prototype.__sprite = function(name) {
		if (this.sprites[name] != this.rsc)
			this.set_rsc(this.sprites[name]);
	}

	Char.prototype.__idle = function() {
		this.idle = true;
	}

	Char.prototype.__onFrame = null;
	Char.prototype.__outFrame = null;
	Char.prototype.__onEnter = null;
	Char.prototype.__onCollide = null;

	return Char;
})();
