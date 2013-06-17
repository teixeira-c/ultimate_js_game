_Ressources = (function() {
	function Ressources(){
		this.dir = {
			img: 'img',
			map: 'map',
		}
		this.list = {
			img: {},
			map: {},
			sprites: {}
		};
		this.loaded = 0;
		this.onload = 0;
		this.callback;
	}

	Ressources.prototype.add = function(type, name, obj) {
        this.loaded++;
        this.onload--;
		this.list[type][name] = obj;
		this.check();
		return true;
	}

	Ressources.prototype.get = function(type, name) {
		return this.list[type][name] ? this.list[type][name] : null;
	}

	Ressources.prototype.load = function(v1, v2, v3) {
		if (typeof v2 == 'function')
			this.callback = v2;

		if(v1 instanceof Object) {
			for (var index in v1) {
                this._dispatchs(index, v1[index]);
			};
        }
        else {
        	this._dispatch(v1, v2);
        }
    }

	Ressources.prototype._dispatchs = function(type, array) {
		for (var index in array) {
        	this.onload++;
            this._dispatch(type, array[index][0], array[index][1]);
		};
		return true;
	}

	Ressources.prototype._dispatch = function(type, file, name) {
        if (this.get(type, name))
        	return true;

		if (type == 'map')
			return this._map(file);
		else if (type == 'img')
			return this._img(name, file);

		return false;
	}

	Ressources.prototype._map = function(name) {
		var that = this;
		var filename = this.dir.map +'/'+ name +'.json';
		return that._xhr(filename, 'json', function(data){
			return that.add('map', name, JSON.parse(data));
		});
	}

	Ressources.prototype._img = function(name, src) {
		var img = new Image();
		var that = this;
		img.onload = function() {
			return that.add('img', name, img);
		}
		img.src = this.dir.img +'/'+ src;
	}

	Ressources.prototype.sprites = function(name, ressource, start, size,
	                                        frames, fps, orientation) {
		ressource = this.get('img',ressource);
		var obj =  new _Sprite(ressource, start, size, frames, fps, orientation);
		return this.add('sprites', name, obj);
	}


	Ressources.prototype._xhr = function(file, _type, callback) {
		var type = _type ? _type : 'json';
		var xhr = new XMLHttpRequest();

		xhr.open("GET", file, false);
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4 && xhr.status == 200)
			{
				if (typeof callback == 'function')
					callback(xhr.responseText);
			}
		}
		xhr.send();
	}

	Ressources.prototype.check = function() {
        if (this.onload == 0)
        	this.callback();
	}

	return Ressources;
})();

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
		console.log(this.frames);
	}

	Sprite.prototype.precompile = function(f) {
		var _a = [], _t = [], _x, _y;
		console.log(f);
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
		return Math.floor(this.index) % this.frames.length;
	}

	Sprite.prototype.render = function() {
		var _i = this.onframe();

		var _f = this.frames[_i];
		ctx.drawImage(this.rsc,
		    _f.x, _f.y,
		    this.size.x, this.size.y,
		    0, 0,
		    this.size.x, this.size.y
		);
	}

	return Sprite;
})();