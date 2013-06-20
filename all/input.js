_Input = (function() {
	function Input() {

		this.key = [];
		this.reg = {};


	    document.addEventListener('keydown', function(e) {
	        __g.setkey(e, true);
	    });
	    document.addEventListener('keyup', function(e) {
	        __g.setkey(e, false);
	    });
	}

	Input.prototype.register = function(key, onfunc, offfunc) {
		if(typeof this.reg[key] == 'undefined')
			this.reg[key] = {on: [], off:[]};

		this.reg[key].on.push(onfunc);

		if (typeof offfunc == 'function')
			this.reg[key].off.push(offfunc);
	}

	Input.prototype.publish = function(type, key) {
		if(typeof this.reg[key] == 'undefined'
			|| typeof this.reg[key][type] == 'undefined')
			return false;

		var r = this.reg[key][type]
		var l = r.length;
		for (var i = 0; i < l; i++) {
			if (typeof r[i] == 'function')
				r[i]();
		}
	}

	Input.prototype.setkey = function(e, status) {
		var code = e.keyCode;
        var key;

        switch(code) {
	        case 32:
	            key = 'SPACE'; break;
	        case 37:
	            key = 'LEFT'; break;
	        case 38:
	            key = 'UP'; break;
	        case 39:
	            key = 'RIGHT'; break;
	        case 40:
	            key = 'DOWN'; break;
	        default:
	            key = String.fromCharCode(code);
        }

        this.key[key] = status;
        if (status === true)
        	this.publish('on', key);
        else
        	this.publish('off', key);
	}

	Input.prototype.isDown = function(name) {
		return this.key[name] || false;
	}

	return Input;
})();