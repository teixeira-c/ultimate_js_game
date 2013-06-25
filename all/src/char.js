_Char = (function() {
	function Char(opts) {
		this.is_char = true;
		this.actions = {};
		this.sprites = opts.sprites || {};
		this.douple_jump = opts.douple_jump || false;

		_Shape.call(this, opts);
	}

	Char.prototype = _Shape.prototype;

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

	Char.prototype.__onframe = null;
	Char.prototype.__outframe = null;
	Char.prototype.__onenter = null;

	return Char;
})();