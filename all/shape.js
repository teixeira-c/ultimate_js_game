var o_id = 0;
var colors = ['#0DB2AC', '#F5DD7E', '#FC8D4D', '#FC694D', '#69D2E7', '#A7DBD8', '#E0E4CC'];

_Point = (function() {
	function Point(x, y) {
		this.set(x, y);
	}
	Point.prototype.set = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
	Point.prototype.min = function(point) {
		this.x = Math.min(this.x, point.x);
      	this.y = Math.min(this.y, point.y);
	}
	Point.prototype.max = function(point) {
		this.x = Math.max(this.x, point.x);
      	this.y = Math.max(this.y, point.y);
	}
	return Point;
})();

_Shape = (function() {
	function Shape(opts) {
		if (!opts || !opts.points)
			return false;

		this.id = o_id++;

		// Physics
		this.phy = {};
		this.phy.gravity = opts.gravity || true;
		this.phy.mass = opts.mass || 1; // kg
		this.phy.restitution = opts.restitution || 0.5; // Restitution
		this.phy.Cd = opts.cd || 1; // Drag force
		this.phy.friction = 1.05; // friction coef
		this.phy.A = 0;

		// shape
		this.points = opts.points;
		this.ptslen = this.points.length;
		this.fillColor = opts.fillColor || colors[Math.floor(Math.random()*colors.length)];
		this.height = 0;
		this.width = 0;
		this.center = new _Point();
		this.radius = 0;

		// state
		this.state = 'static';
		this.size = {x: 0, y: 0};
		this.old =  new _Point(opts.x, opts.y);
		this.oldState = this.state;
		this.position = new _Point(opts.x, opts.y);
		this.velocity = {x: 0, y: 0};
		this.colliding = false;
		this.is_decor = false;

		// world options
		this.collision = opts.collision || true;
		this.constrain = opts.constrain || false;

		// bounds
		this.helpers = opts.helpers || true 
		this.trueBounds = false; // Fit to shape or use only _bounds
		this.bounds = opts.bounds || false;
		this._bounds = {
			min: new _Point(), max: new _Point(),
			rmin: new _Point(), rmax: new _Point()
		};

		this.apply_bounds();

		this._sl.push(this);
	}

	Shape.prototype.do = function() {
		this.old.set(this.position.x, this.position.y);
		this.oldState = this.state;
		this.oldCollide = this.colliding;

		this.apply_bounds();

		if (this.constrain)
			this.apply_constraint();

		if (this.collision)
			this.check_collision();

		if (this.phy.gravity)
			this.apply_gravity();

		this.check_state();
		//console.log(this.position.y, ' + ', this._bounds.max.y, ' == ', this._bounds.rmax.y)
		this.draw();
	}

	Shape.prototype.draw = function() {
		var _i;

		ctx.save();
		ctx.translate(this.position.x, this.position.y);

		// Draw box
		if (this.helpers)
			this.display_helpers();

		ctx.fillStyle = this.fillColor;
		// draw path
      	ctx.beginPath();
		for (_i = 0; _i < this.ptslen; ++_i) {
			ctx.lineTo(this.points[_i].x, this.points[_i].y);
		}
      	ctx.closePath();
		ctx.fill();

		ctx.restore();
	}

	Shape.prototype.apply_bounds = function() {
		var _i, rmin, rmax, _center;

		_center = {x:0, y:0};
		for (_i = 0; _i < this.ptslen; ++_i) {
			this._bounds.min.min(this.points[_i]);
			this._bounds.max.max(this.points[_i]);
			_center.x += this.points[_i].x;
			_center.y += this.points[_i].y;
		}

		this._bounds.rmin.set(this.position.x + this._bounds.min.x, this.position.y + this._bounds.min.y);
		this._bounds.rmax.set(this.position.x + this._bounds.max.x, this.position.y + this._bounds.max.y);

		this.height = Math.abs(this._bounds.min.y - this._bounds.max.y);
		this.width = Math.abs(this._bounds.min.x - this._bounds.max.x);
		this.radius = Math.sqrt(Math.pow(this._bounds.max.y,2) + Math.pow(this._bounds.max.x,2)) / 2;
		this.center.set(_center.x / this.ptslen, _center.y / this.ptslen);

		this.phy.A = (Math.PI * this.radius * this.radius / (10000)).toFixed(5)
	}

	Shape.prototype.display_helpers = function() {
		// bounds
		ctx.fillStyle = this.colliding ? '#FF0000' : '#aaa';
		ctx.globalAlpha = 0.2;
		ctx.beginPath();
		ctx.moveTo(this._bounds.min.x, this._bounds.min.y);
		ctx.lineTo(this._bounds.max.x, this._bounds.min.y);
		ctx.lineTo(this._bounds.max.x, this._bounds.max.y);
		ctx.lineTo(this._bounds.min.x, this._bounds.max.y);
		ctx.closePath();
		ctx.fill();

		// draw start
		ctx.beginPath();
		ctx.arc(0, 0, 1, 0, 2*Math.PI);
		ctx.stroke();
		ctx.closePath();

		// draw start
		ctx.beginPath();
		ctx.arc(this.center.x, this.center.y, 2, 0, 2*Math.PI);
		ctx.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
		ctx.stroke();
		ctx.closePath();

		ctx.globalAlpha = 0.5;
	}

	Shape.prototype.apply_gravity = function() {
		var _phy, Fx, Fy, ax, ay;
		_phy = this.phy;

		_Fx = -0.5 * _phy.Cd * _phy.A * this.env.rho * (this.velocity.x * this.velocity.x) * (this.velocity.x / Math.abs(this.velocity.x));
		_Fy = -0.5 * _phy.Cd * _phy.A * this.env.rho * (this.velocity.y * this.velocity.y) * (this.velocity.y / Math.abs(this.velocity.y));
		_Fx = (isNaN(_Fx) ? 0 : _Fx);
		_Fy = (isNaN(_Fy) ? 0 : _Fy);

		// Calculate acceleration ( F = ma )
		_ax = _Fx / _phy.mass;
		_ay = this.env.ag + (_Fy / _phy.mass);

		this.velocity.x += _ax * this.env.fps;
		this.velocity.y += _ay * this.env.fps;

		this.position.x += Math.round(this.velocity.x * this.env.fps * 100);
		this.position.y += Math.round(this.velocity.y * this.env.fps * 100);
	}

	Shape.prototype.apply_friction = function() {
		this.velocity.x = this.velocity.x / this.phy.friction;
		this.velocity.y = this.velocity.y / this.phy.friction;
	}

	Shape.prototype.apply_constraint = function() {
		if (this._bounds.rmax.y >= ctx_height) { // ground
			this.velocity.y *= -1 * this.phy.restitution;
			this.apply_friction();
			this.position.y = ctx_height - this._bounds.max.y;
		} else if (this._bounds.rmin.y < 0 ){
			this.velocity.y *= -this.phy.restitution;
		}
		if (this._bounds.rmax.x >= ctx_width) { // right
			this.velocity.x *= -1 * this.phy.restitution;
			this.position.x = ctx_width - this._bounds.max.x;
		} else if (this._bounds.rmin.x <= 0) { // left
			this.velocity.x *= -1 * this.phy.restitution;
			this.position.x = 0;
		}
	}

	Shape.prototype.check_collision = function() {
		var _i, _hit, _b, _o, _olen;

		_b = this._bounds;
		_o = this._sl;
		_olen = _o.length;

		this.colliding = false;
		for (var _i in _o) {
			var _oi = _o[_i];
			if (_oi.id === this.id)
				continue;

			var _oib =_oi._bounds;
			var cld = {x: null, y: null};

			if (((_b.rmin.x > _oib.rmax.x) || (_b.rmax.x < _oib.rmin.x))
				|| ((_b.rmin.y > _oib.rmax.y) || (_b.rmax.y < _oib.rmin.y)))
			{
				
			}
			else{
				this.colliding = true;
				_oi.colliding = true;
				this.compute_collision(_oi);
			}

		}
	}
	Shape.prototype.compute_collision = function(_oi) {
		var vX, vY;

		var distance = _oi._bounds.rmin.y - this._bounds.rmax.y;
		var time = Math.abs(distance / this.velocity.y);
		if(time > 0 && time < 3) {
			this.position.y = _oi._bounds.rmin.y - this.height - 1;
			this.velocity.y *= -1 * this.phy.restitution;
		}
		else if (time <= 0 || distance < 0){
			this.position.y = _oi._bounds.rmin.y - this.height - 1;
			this.velocity.y *= this.phy.restitution + _oi.phy.restitution;
		}
		/*
		vX = (this.velocity.x || this.phy.restitution);
		vY = (this.velocity.y || this.phy.restitution);

		vY = vY * (this.phy.restitution * this.phy.mass);
		this.velocity.y *= -vY;
		console.log(this.velocity.y, this.position.y)
		//console.log(this.velocity.y);

		vX = (vX + ((vX * this.phy.restitution)*-1) / (this.phy.restitution * this.phy.mass) * -1);
		vY = (vY + ((vY * this.phy.restitution)*-1) / (this.phy.restitution * this.phy.mass) * -1);
		
		vY -= vY;

		//this.velocity.x = vX;
		this.velocity.y = vY;*/

		//window.cancelAnimationFrame(request_id);
	}

	Shape.prototype.check_state = function() {
		var _n, _o;
		_n = this.position;
		_o = this.old;
		if (_n.y === _o.y && this._bounds.rmax.y === ctx_height)
			this.state = 'grounded';
		else if(_n.y > _o.y)
			this.state = 'falling';
		else if(_n.y < _o.y)
			this.state = 'jumping';

/*
		this.state = (Math.abs(_phy.velocity.x) > 0.1 || Math.abs(_phy.velocity.y) > 0.1) ? 'moving' : 'static';

		//console.log(this.state, this.Cd, _phy.velocity.y);
		if (this.state === 'static')
			return;*/
	}

	Shape.prototype.env = myEnv;
	Shape.prototype._sl = [];
	return Shape;
})();
