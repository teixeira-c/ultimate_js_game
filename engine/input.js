Input = (function() {
	function Input() {
	    document.addEventListener('keydown', function(e) {
	        var r = __g.input.setkey(e, true);
	        if (r)
	        {
		        e.preventDefault();
		        return false;
		    }
	    });
	    document.addEventListener('keyup', function(e) {
	        __g.input.setkey(e, false);
	        return false;
	    });
	}
	Input.prototype.key = {};
	Input.prototype.keyPushed = 0;
	Input.prototype.reg = {};

	Input.prototype.register = function(keys, on, off) {
		if (typeof on != 'function')
			throw "Register for "+ keys[i] +"need a function";

		var keys = keys.split(" ");

		for (var i = 0; i < keys.length; i++) {
			if(typeof this.reg[keys[i]] == 'undefined')
				this.reg[keys[i]] = {on: [], off:[]};

			this.reg[keys[i]].on.push(on);

			if (typeof off == 'function')
				this.reg[keys[i]].off.push(off);
		}
	}

	Input.prototype.publish = function(type, key) {
		if(typeof this.reg[key] == 'undefined'
			|| typeof this.reg[key][type] == 'undefined')
			return false;

		var r = this.reg[key][type];
		var l = r.length;
		for (var i = 0; i < l; i++) {
			if (typeof r[i] == 'function')
				r[i]();
		}
	}

	Input.prototype.setkey = function(e, status) {
		var code = e.keyCode;
        var key;
        var rs;

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
        }

        if (status === true && !this.key[key])
        {
        	rs = 'on';
        	this.key[key] = status;
        	this.keyPushed++;
        }  else if (status === false) {
        	rs = 'off';
        	this.keyPushed--;
        	delete this.key[key];
        }
        this.publish(rs, key);
        return key;
	}

	Input.prototype.isDown = function(name) {
		return this.key[name] || false;
	}

	Input.prototype.onFrame = function() {
		var k = this.key;

		if (this.keyPushed == 0)
			return false;

		for (var name in this.key) {
			this.publish('on', name);
		}
	}

	return Input;
})();
