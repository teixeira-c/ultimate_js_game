

_Sprite = (function() {
	function Sprite(ressource, start, size, frames, fps, orientation) {
		this.rsc = ressource;
		this.start = start;
		this.size = size;
		this.frames = this.precompile(frames);
		this.fps = fps ? fps : frames;
		this.orientation = orientation ? orientation : 'horizontal';

		this.index = 0;
		this.speed = 0;
		this.loop = 0;
	}

	Sprite.prototype.precompile = function(f) {
		var _a = [], _t = [], _x, _y;
		if (typeof f === 'number')
		{
			for (var i = 0; i < f; i++) { _t.push(i) };
			f = _t;
		}

		_x = this.start.x;
		_y = this.start.y;

		for (var index in f) {
			if (_a[index])
				continue;

			if (this.orientation == 'vertical')
				_y = this.start.y + (this.size.y * f[index]);
			else
				_x = this.start.x + (this.size.x * f[index]);

			var _f = new _Point(_x, _y);
			_a.push(_f);
		};
		return _a;
	}

	Sprite.prototype.onframe = function() {
		this.index += this.fps * 0.025;
		var i = Math.floor(this.index) % this.frames.length;
		if (i == 0 && this.index > this.fps)
		{
			this.index = 0;
			this.loop++;
		}
		return i;
	}

	Sprite.prototype.render = function() {
		var _i = this.onframe();

		var _f = this.frames[_i];
		__g.ctx.drawImage(this.rsc,
		    _f.x, _f.y,
		    this.size.x, this.size.y,
		    0, 0,
		    this.size.x, this.size.y
		);
	}

	return Sprite;
})();