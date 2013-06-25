var _Tile = (function() {
	function Tile(x, y, tw, th, rsc) {
		return new _Shape({
			x: x, y: y, fillColor: '#ddd',
			points: [
				new _Point(0,0),
				new _Point(tw,0),
				new _Point(tw,th),
				new _Point(0,th),
			],
			restitution: 0.1, pinned: true, rsc: rsc
		});
	}
	return Tile;
})();
