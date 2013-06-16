_Ressources = (function() {
	function Ressources(){
		this.list = {};
	}

	Ressources.prototype.xhr = function(file, _type, callback) {
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

	Ressources.prototype.map = function(name) {
		var that = this;
		var filename = 'map/'+ name +'.json';
		this.xhr(filename, 'json', function(data){
			that.add(name, JSON.parse(data));
		});
	}

	Ressources.prototype.img = function(name, src) {
		var img = new Image();
		var that = this;
		img.onload = function() {
			that.add(name, img);
		}
		img.src = src;
	}

	Ressources.prototype.add = function(name, obj) {
		this.list[name] = obj;
	}

	Ressources.prototype.get = function(name) {
		return this.list[name] ? this.list[name] : null;
	}

	return Ressources;
})();