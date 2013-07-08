var __g;
var Loader = (function() {
	function Loader(opts){
		if (!opts.name || !opts.files || !(opts.files instanceof Object))
			throw "Loader not filled correctly";

		this.name = opts.name;
		this.files = opts.files;
		this.onLoading = opts.onLoading || defaultScreen;
		this.onSuccess = opts.onSuccess || null;
		this.onFail = opts.onFail || null;
		this.initial = opts.initial || false;

		this.now = JSON.parse(JSON.stringify(this._now));

		if (this.initial === true)
		{
			if (opts.initialCanvas){
				this.cnv = opts.initialCanvas;
				this.ctx = this.cnv.getContext("2d");
			}

			if (!this.files.js)
				this.files.js = [];
			if (!this.func)
				this.func = [];
			var n = initialLoad();
			this.files.js = n.concat(this.files.js);

			var that = this;
			this.interval = setInterval(function(){
				that.onLoading(that.now, that.ctx, that.cnv);
			}, 30);
		} else {
			this.cnv = __g.cnv;
			this.ctx = __g.ctx;
		}

		// Count
		for (var index in this.files) {
			this.now.totalFiles += this.files[index].length;
		}
		this.now.totalFuncs += this.func.length;

		this.now.total = this.now.totalFiles + this.now.totalFuncs;
	}

	Loader.prototype.loadedCount = 0;
	Loader.prototype._now = {
			total: 0,
			totalFiles: 0,
			totalFuncs: 0,

			onload: 0,
			tried: 0,
			loaded: 0,
			pct: 0,

			files: {}
	}

	Loader.prototype.launch = function() {
		this.loadFiles();
    }

	Loader.prototype.loadFiles = function() {
		for (var type in this.files) {
            for (var j in this.files[type]) {
	        	this.now.onload++;
	        	this.now.tried++;
	        	if (type === 'js') {
	        		this.load_js([this.files[type][j]]);
	        	} else if (type === 'img') {
	        		this.load_img(this.files[type][j]);
	        	} else {
	            	this.xhr(this.files[type][j], type);
	        	}
			}
		}
    }

	Loader.prototype.loadFunc = function() {
		var f;
		for (var i = 0, l = this.func.length; i < l; i++) {
	        this.now.onload++;
	        this.now.tried++;

    		f = this.func[i]();
    		if (f === true)
    		{
    			this.func[i] = false;
	        	this.now.onload--;
    			this.now.loaded++;
    		}
    		this.check();
		}
    }

	Loader.prototype.check = function() {
		this.now.pct = Math.round((this.now.loaded / this.now.total) * 100);
		if ((this.now.onload > 0 || this.now.tried < this.now.total) && this.now.tried < (this.now.total *2))
		{
			if (this.now.loaded == this.now.totalFiles)
				this.loadFunc();
			return;
		}

        if (this.now.loaded == this.now.total) {
            clearInterval(this.interval);
        	if (typeof this.onSuccess == 'function')
        		this.onSuccess(this.now);
        } else {
            clearInterval(this.interval);
        	if (typeof this.onFail == 'function')
        		this.onFail(this.now);
        }
	}

	Loader.prototype.xhr = function(file, type) {
		var xhr = new XMLHttpRequest();
		var that = this;

		xhr.open("GET", file[0], true);
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState == 4)
			{
				that.xhr_res(xhr, xhr.status, file, type, JSON.parse(xhr.responseText));
			}
		}
		xhr.send();
	}

    Loader.prototype.xhr_res = function(xhr, status, file, type, res) {
        this.now.last = name;
    	if (status == 200) {
    		this.now.onload--;
	        this.now.loaded++;
	        this.push(file, type, res);
    	} else {
    		console.log('fail', file);
    	}
    	this.check();
    }


	Loader.prototype.load_js = function(file) {
		var that = this;
		var script = document.createElement("script");
		script.type = "text/javascript";
		if (script.readyState) {
            script.onreadystatechange = function () {
                if (script.readyState == "loaded" || script.readyState == "complete") {
                    script.onreadystatechange = null;
					that.xhr_res(null, 200, file, 'js');
                }
            };
        } else {
            script.onload = function () {
				that.xhr_res(null, 200, file, 'js');
            }
        }
		script.src = file;
		document.body.appendChild(script);
	}

	Loader.prototype.load_img = function(src) {
		var that = this;
		var img = new Image();
		img.onload = function() {
			that.xhr_res(null, 200, src, 'img', img);
		}
		img.src = src[0];
	}

	Loader.prototype.push = function(file, type, res) {
        if (!this.now.files[type])
        	this.now.files[type] = [];

        if (res)
        	file.push(res);

        this.now.files[type].push(file);
	}

	Loader.prototype.onLoading = null;
	Loader.prototype.onSuccess = null;
	Loader.prototype.onFail = null;

	return Loader;
})();


function initialLoad() {
	return [
		'engine/vector.js',
		'engine/collisioner.js',
		'engine/input.js',
		'engine/env.js',
		'engine/map.js',
        'engine/ui.js',
		'engine/ressources.js',
        'engine/shape.js',
        'engine/item.js',
        'engine/tile.js',
		'engine/sprite.js',
		'engine/char.js',
		'engine/game.js'
	];
}

var pct = 0;
var speed = 5;
function defaultScreen(e, ctx, el) {
	pct += pct <= e.pct ? (pct + speed <= e.pct ? speed : e.pct - pct) : 0;
	ctx.globalAlpha = 0.4;
	ctx.clearRect(0, 0, el.width, el.height);

	ctx.fillStyle = "#444";
	ctx.font = "normal 45px Segoe UI";
	ctx.fillText('LOADING', el.width/2 - 100, el.height/2);

	ctx.fillStyle = "#aaa";
	ctx.font = "normal 11px Segoe UI";
	ctx.fillText(e.pct +'%' + ' - '+ e.loaded +'files', el.width/2 - 30, el.height/2 + 30);

	ctx.fillStyle = '#ccc';
	ctx.beginPath();
	ctx.moveTo(0, el.height/2 + 10);
	ctx.lineTo(el.width, el.height/2 + 10);
	ctx.stroke();

	ctx.globalAlpha = 0.7;
	ctx.fillStyle = '#FF0000';
	ctx.beginPath();
	ctx.moveTo(0, el.height/2 + 10);
	ctx.lineTo((el.width /100 ) * pct, el.height/2 + 10);
	ctx.stroke();
}
