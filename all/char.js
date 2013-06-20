_Char = (function() {
	function Char(opts) {
		this.current_action = false;
		this.anim = opts.anim || {};

		_Shape.call(this, opts);
	}

	Char.prototype = _Shape.prototype;

	Char.prototype.play = function(anim) {
		var _t = this.rsc;
		this.rsc = this.anim[anim];
	}

	return Char;
})();