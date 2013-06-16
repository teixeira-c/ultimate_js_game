var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ctx_height = canvas.height;
var ctx_width = canvas.width;
var anime_state = true;
var request_id;

_Tile = (function() {
	function Tile(x, y, tw, th) {
		return new _Shape({
			x: x, y: y, fillColor: '#ddd',
			points: [
				new _Point(0,0),
				new _Point(tw,0),
				new _Point(tw,th),
				new _Point(0,th),
			],
			restitution: 0.1, pinned: true
		});
	}
	return Tile;
})();

_Map = (function() {
	function Map(map_id, shape_obj){
		this.type = "2d";

		this.tiles = {
			width: 36,
			height: 36
		};
		this.views = {};
		this.current_view_id = 0;

		this.hero = shape_obj;
		this.zoom = {
			rows: 10,
			cols: 10,
			x: 0,
			y: 0,
			follow: 'center'
		}
		this.cld_zone = {};
	}

	Map.prototype.add_view = function(name, json) {
		this.views[name] = json;
	}

	Map.prototype.set_current_view = function(id) {
		this.current_view_id = typeof this.views[id] != 'undefined' ? id : 0;
		if (this.views[this.current_view_id].inited == false)
			this.init_view();
	}

	Map.prototype.set_zoom_center = function(x, y) {
		this.zoom.x = x;
		this.zoom.y = y;
	}

	Map.prototype.init_view = function() {
		var v = this.views[this.current_view_id];
		var _ch, _cw, _cr, _cc, _cl;
		var _tw = this.tiles.width;
		var _th = this.tiles.height;

		v.tiles = [];

		for(var row in v.raw) {
			_cr = v.raw[row];
			_ch = row * _th;
			_cl = _cr.length
			for (var col = 0; col < _cl; col++) {
				_cc = _cr[col];
				_cw = col * _tw;
				if (_cc != "" && _cc != " ")
					v.tiles.push(new _Tile( _cw, _ch, _tw, _th));
			}
		}
		v.inited = true;
	}


/*
	Map.prototype.draw_tiles22 = function(name) {
		var v = this.views[this.current_view_id];
		var _ch, _cw;

		for (var row = 0; row < v.rows; row++) {
			_ch = row * this.tiles.height;
			for (var col = 0; col < v.cols; col++) {
				_cw = col * this.tiles.width;

				ctx.fillStyle = '#16b7b7';
				ctx.save();
				ctx.translate(_cw, _ch);
				ctx.fillRect(0, 0, this.tiles.width, this.tiles.height);
				ctx.restore();
			}
		}


		for(var col in v.tiles) {
			_cc = v.tiles[col];
			_cw = col * _tw;
			for(var row in _cc) {
				_cr = _cc[row];
				_ch = row * _th;
				ctx.fillStyle = this.defaultFill;
				ctx.save();
				ctx.translate(_cw, _ch);
				if (img = myRsc.get(_cr.rsc))
					ctx.drawImage(img, 0, 0, _tw, _th);
				else
					ctx.fillRect(0, 0, _tw, _th);
				ctx.restore();
			}
		}
	}*/

	Map.prototype.draw_layers = function(type) {
		var v = this.views[this.current_view_id];
		var _l;

		for(var index in v.layers) {
			if (type == 'background' && index >= '0')
				break;
			else if (type == 'foreground' && index <= '0')
				continue;
			_l = v.layers[index];

			if (img = myRsc.get(_l.rsc))
				ctx.drawImage(img, 0, 0, img.width, img.height);
		}

	}


	Map.prototype.draw_tiles = function(name) {
		var v = this.views[this.current_view_id];
		var _ch, _cw, _cr, _cc;
		var _tw = this.tiles.width;
		var _th = this.tiles.height;
		//console.log(v);

		for (var index in v.tiles) {
			v.tiles[index].draw();
		}
	}
	return Map;
})();
