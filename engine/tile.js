var Tile = (function() {
	function Tile(opts) {
		opts.is = 'tile';
		opts.points = [
			new Vector(0, 0),
			new Vector(opts.width, 0),
			new Vector(opts.width, opts.height),
			new Vector(0, opts.height)
		];
		opts.restitution = opts.restitution || 0.1;
		opts.pinned = true;

		this.__onCollide = opts.onCollide;

		Shape.call(this, opts);

		this.clone = function(x, y) {
			return new Tile({
				x: x, y: y,
				width: this.width, height: this.height,
				rsc: this.rsc,
				points: this.points
			});
		}
	}

	Tile.prototype = Shape.prototype;
	return Tile;
})();
