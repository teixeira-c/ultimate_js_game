var _Map = (function() {
	function Map(shape_obj){
		this.type = "2d";

		this.tiles = {
			width: 36,
			height: 36
		};
		this.views = {};
		this.current_view = false;

		this.hero = shape_obj || false;
		this.camera = {
			rows: 10,
			cols: 10,
			x: 0,
			y: 0,
			follow: 'center'
		}
		this.cld_zone = {};
	}

	Map.prototype.add_view = function(name) {
		if (view = __g.rsc.get('lvl', name))
			this.views[name] = view;
		else
			throw 'No view for ' + name;
	}

	Map.prototype.set_current_view = function(name) {
		if (typeof this.views[name] == 'undefined')
			throw "Missing view in this map";

		this.current_view = name;

		if (this.views[this.current_view].inited == false)
			this.init_view();
	}

	Map.prototype.set_camera_center = function(x, y) {
		this.camera.x = x;
		this.camera.y = y;
	}

	Map.prototype.init_view = function() {
		var v = this.views[this.current_view];
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
				{
					if (tile = __g.rsc.get('blueprint', _cc)) {
						v.tiles.push(tile.clone(_cw, _ch));
					} else if (img = __g.rsc.get('img', _cc)) {
						v.tiles.push(new _Tile(_cw, _ch, _tw, _th, img));
					}
				}
			}
		}

		if (v.spec)
		{
			for (var i = 0, l = v.spec.length; i < l; i++) {
				if (bp = __g.rsc.get('blueprint', v.spec[i].blueprint)) {
					var t = bp.clone(v.spec[i].pos[0] * _tw, v.spec[i].pos[1]* _th);
				}
			};
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
		var v = this.views[this.current_view];
		var _l;

		for(var index in v.layers) {
			if (type == 'background' && index >= '0')
				break;
			else if (type == 'foreground' && index <= '0')
				continue;
			_l = v.layers[index];

			if (img = myRsc.get('img', _l.rsc))
				ctx.drawImage(img, 0, 0, img.width, img.height);
		}
	}

	Map.prototype.draw_tiles = function(name) {
		var v = this.views[this.current_view];

		for (var index in v.tiles) {
			v.tiles[index].draw();
			v.tiles[index].apply_old();
		}
	}
	return Map;
})();
