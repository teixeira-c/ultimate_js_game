var Ressources = (function() {
	function Ressources(){}

	Ressources.prototype.dir = {
		img: 'img',
		map: 'map',
	}
	Ressources.prototype.list = {
		img: {},
		map: {},
		sprites: {},
		screen: {}
	};
	Ressources.prototype.loaded = 0;
	Ressources.prototype._now = {
		count: 0,
		onload: 0,
		loaded: 0,
		pct: 0,
		last: [],
		files: [],
		loadscreen: false,
		callback: false
	};
	Ressources.prototype.now = {};

	Ressources.prototype.add = function(type, name, obj) {
        this.now.loaded++;
        this.now.onload--;
		this.list[type][name] = obj;
        this.now.current = name;
        this.loadscreen_callback();
		this.check();
		return true;
	}

	Ressources.prototype.get = function(type, name) {
		return this.list[type][name] ? this.list[type][name] : null;
	}

	Ressources.prototype.load = function(v1, v2, v3) {
		if (typeof v2 == 'function')
			this.callback = v2;

		this.now = JSON.parse(JSON.stringify(this._now));
		if (v3)
			this.now.loadscreen = v3;

		if(v1 instanceof Object) {
			for (var index in v1) {
				this.now.count += v1[index].length;
			};
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
        	this.now.onload++;
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

	Ressources.prototype.screen = function(name, loop) {
		return this.add('screen', name, loop);
	}

	Ressources.prototype.loadscreen_callback = function() {
		this.now.pct = ((this.now.loaded / this.now.count) * 100).toFixed(1);

		if (!this.now.loadscreen)
			return false;

		this.list['screen'][this.now.loadscreen](this.now);
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
        if (this.now.onload == 0){
        	this.now = {};
        	this.callback();
        }
	}

	return Ressources;
})();