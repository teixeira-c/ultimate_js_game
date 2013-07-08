var Ressources = (function() {
	function Ressources(){}

	Ressources.prototype.list = {
		js: {},
		img: {},
		lvl: {},
		sprite: {},
		screen: {},
		shapes: {
			all: [],
			active: [],
			passive: []
		},
		blueprint: {}
	};

	Ressources.prototype.set = function(type, name, obj) {
		this.list[type][name] = obj;
	}

	Ressources.prototype.get = function(v1, v2) {
		if (!v2)
		{
			var p = v1.split('.');
			v1 = p[0]; v2 = p[1];
		}
		return this.list[v1][v2] || null;
	}

	Ressources.prototype.addShape = function(obj) {
		this.list.shapes.all.push(obj);
		this.list.shapes[obj.state].push(obj);
	}

	Ressources.prototype.mutiple = function(array) {
		for (var type in array)
		{
			if (!this.list[type])
				this.list[type] = {};
			for (var j = 0, jl = array[type].length; j < jl; j++)
			{
				this.list[type][array[type][j][1] || j] = array[type][j][2] || array[type][j][0];
			}
		}
	}

	Ressources.prototype.sprites = function(rsc, list) {
		if (!(ressource = this.get(rsc)))
		    throw 'bad ressource';

		for (var name in list)
		{
			var obj =  new Sprite(ressource, new Vector(list[name].start), new Vector(list[name].size), list[name].frames, list[name].fps, list[name].orientation);
			this.set('sprite', name, obj);
		}
	}

	Ressources.prototype.screen = function(name, loop) {
		return this.set('screen', name, loop);
	}

	return Ressources;
})();
