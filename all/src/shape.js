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
	Point.prototype.normalize = function() {
		var mag = Math.sqrt(this.x * this.x + this.y * this.y);
		if (mag !== 0) {
			this.x /= mag;
			this.y /= mag;
		}
	}
	Point.prototype.dotproduct = function(vector) {
		return this.x * vector.x + this.y * vector.y;
	}
	return Point;
})();

_Shape = (function() {
	function Shape(opts) {
		if (!opts || !opts.points)
			throw "no points given";

		this.id = o_id++;

		// Physics
		this.phy = {};
		this.phy.gravity = opts.gravity || true;
		this.phy.mass = opts.mass || 1; // kg
		this.phy.restitution = opts.restitution || 0.5; // Restitution
		this.phy.Cd = opts.cd || 1; // Drag force
		this.phy.friction = 1.25; // friction coef
		this.phy.A = 0;
		this.phy.env = __g.env.get('default');

		// shape
		this.points = opts.points;
		this.ptslen = this.points.length;
		this.fillColor = opts.fillColor || colors[Math.floor(Math.random()*colors.length)];
		this.height = 0;
		this.width = 0;
		this.center = new _Point();
		this.radius = 0;

		// state
		this.motion = {
			is: 'static',
			dir : {v: false, h: false}
		};
		this.size = {x: 0, y: 0};
		this.position = new _Point(opts.x, opts.y);
		this.velocity = new _Point(0, 0);
		this.colliding = {
			state: false, x: false, y: false
		};
		this.rsc = opts.rsc || false;
		this.old =  {
			pos: new _Point(opts.x, opts.y),
			motion: this.motion,
			cld: false,
			velocity: new _Point(0, 0)
		};

		// world options
		this.collision = opts.collision || true;
		this.constrain = opts.constrain || false;

		// bounds
		this.trueBounds = false; // Fit to shape or use only _bounds
		this.aabb = {
			min: new _Point(), max: new _Point(),
			rmin: new _Point(), rmax: new _Point()
		};

		this.compute_aabb();

		__g.shapes.push(this);
	}

	Shape.prototype.clsnr = Collisioner.prototype;

	Shape.prototype.apply_old = function() {
		this.old.pos.set(this.position.x, this.position.y);
		this.old.motion = this.motion;
		this.old.cld = this.colliding;
		this.old.velocity = this.velocity;
		this.colliding.state = this.colliding.x = this.colliding.y = false;
	}

	Shape.prototype.compute = function() {
		this.compute_aabb();

		if (this.__onframe)
			this.__onframe();

		if (this.phy.gravity)
			this.apply_gravity();

		if (this.collision)
			this.check_collision();

		if (this.constrain)
			this.clsnr.narrowToCanvas(this);

		if (this.colliding.y)
			this.apply_friction();

		this.motion_state();

		if (this.__outframe)
			this.__outframe();

		if (this.__onenter)
			this.__onenter();
	}

	Shape.prototype.compute_aabb = function() {
		var _i, rmin, rmax, _center;

		_center = {x:0, y:0};
		for (_i = 0; _i < this.ptslen; ++_i) {
			this.aabb.min.min(this.points[_i]);
			this.aabb.max.max(this.points[_i]);
			_center.x += this.points[_i].x;
			_center.y += this.points[_i].y;
		}

		this.aabb.rmin.set(this.position.x + this.aabb.min.x, this.position.y + this.aabb.min.y);
		this.aabb.rmax.set(this.position.x + this.aabb.max.x, this.position.y + this.aabb.max.y);

		this.height = Math.abs(this.aabb.min.y - this.aabb.max.y);
		this.width = Math.abs(this.aabb.min.x - this.aabb.max.x);
		this.radius = Math.sqrt(Math.pow(this.aabb.max.y,2) + Math.pow(this.aabb.max.x,2)) / 2;
		this.center.set(_center.x / this.ptslen, _center.y / this.ptslen);

		this.phy.A = (Math.PI * this.radius * this.radius / (10000)).toFixed(5)
	}

	Shape.prototype.draw = function() {
		var _i, c = __g.ctx;

		c.save();
		c.translate(this.position.x, this.position.y);

		// Draw box
		if (__g.debug)
			this.display_helpers();


		if (typeof this.rsc == 'object')
		{
			if (typeof this.rsc.render == 'function')
				this.rsc.render();
			else{
				c.drawImage(this.rsc,0, 0,36, 36);
			}
		}
		else{
			c.fillStyle = this.fillColor;
			// draw path
	      	c.beginPath();
			for (_i = 0; _i < this.ptslen; ++_i) {
				c.lineTo(this.points[_i].x, this.points[_i].y);
			}
	      	c.closePath();
			c.fill();
		}

		c.restore();

/*		if (this.colliding.state)
			__g.stop();*/

		this.apply_old();
	}

	Shape.prototype.display_helpers = function() {
		var c = __g.ctx;
		if (this.is_char === true)
		{
			c.fillStyle = "#444";
			c.font = "normal 11px Arial";
			c.fillText(this.motion.dir.v +'/'+this.motion.dir.h, -10, -5);
		}

		// bounds
		c.fillStyle = this.colorSpec ? this.colorSpec : this.colliding.state ? '#FF0000' : '#aaa';
		c.globalAlpha = 0.2;
		c.beginPath();
		c.moveTo(this.aabb.min.x, this.aabb.min.y);
		c.lineTo(this.aabb.max.x, this.aabb.min.y);
		c.lineTo(this.aabb.max.x, this.aabb.max.y);
		c.lineTo(this.aabb.min.x, this.aabb.max.y);
		c.closePath();
		c.fill();

		// center
		c.beginPath();
		c.arc(0, 0, 1, 0, 2*Math.PI);
		c.stroke();
		c.closePath();

		// circle
		c.beginPath();
		c.arc(this.center.x, this.center.y, 2, 0, 2*Math.PI);
		c.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
		c.stroke();
		c.closePath();

		c.globalAlpha = 0.5;
	}

	Shape.prototype.apply_gravity = function() {
		var _phy, Fx, Fy, ax, ay;
		_phy = this.phy;

		_Fx = -0.5 * _phy.Cd * _phy.A * _phy.env.rho * (this.velocity.x * this.velocity.x) * (this.velocity.x / Math.abs(this.velocity.x));
		_Fy = -0.5 * _phy.Cd * _phy.A * _phy.env.rho * (this.velocity.y * this.velocity.y) * (this.velocity.y / Math.abs(this.velocity.y));
		_Fx = (isNaN(_Fx) ? 0 : _Fx);
		_Fy = (isNaN(_Fy) ? 0 : _Fy);

		// Calculate acceleration ( F = ma )
		_ax = _Fx / _phy.mass;
		_ay = _phy.env.ag + (_Fy / _phy.mass);

		this.velocity.x += _ax * __g.fps;
		if (!this.colliding.y)
			this.velocity.y += _ay * __g.fps;

		this.position.x += Math.round(this.velocity.x * __g.fps * 100);
		this.position.y += Math.round(this.velocity.y * __g.fps * 100);
	}

	Shape.prototype.apply_friction = function() {
		this.velocity.x = this.velocity.x / this.phy.friction;
		this.velocity.y = this.velocity.y / this.phy.friction;
	}

	Shape.prototype.apply_constraint = function() {
	}

	Shape.prototype.check_collision = function() {
		var _i, _hit, _b, _o, _olen;

		_b = this.aabb;
		_o = __g.shapes;
		_olen = _o.length;

		for (var _i in _o) {
			var _oi = _o[_i];
			if (_oi.id === this.id)
				continue;

			var _oib =_oi.aabb;
			var cld = {x: null, y: null};

			if (this.clsnr.isCandidate(_b, _oib))
			{
			}
			else{
				//this.colliding.state = true;
				_oi.colliding.state = true;
				this.clsnr.compute(this, _oi);
				//__g.stop();
				//break;
			}
		}
	}
	Shape.prototype.compute_collision = function(fs) {
		//if (diff.x)
			//this.position.x -= Math.abs(overlap.x);

		//console.log(overlap.y, overlap.x, diff);

/*		// vector border to border
		console.log(b2b);


		var m1 = this.aabb.rmin.x + this.aabb.rmax.x;
		var m2 = fs.aabb.rmin.x + fs.aabb.rmax.x;

		if ((this.aabb.rmax.y == fs.aabb.rmin.y) && Math.abs(b2b.x) > 0)
		{
			this.colliding.y = true;
			if (c2c.y > 0)
				this.position.y -= Math.abs(b2b.y);
			else
				this.velocity.y = Math.abs(this.velocity.y);
		}
		else if (this.aabb.rmax.y > fs.aabb.rmin.y && Math.abs(b2b.y) > 0){
			//console.log(m1, m2, m2 - m1, fs.width + this.width, b2b.x);
			//__g.stop();
			//console.log(Math.abs(b2b.y), Math.abs(b2b.x))

			//console.log((fs.center.y + fs.position.y), (this.center.y + this.position.y))
			//console.log(c2c, b2b, this.aabb.rmax.y, fs.aabb.rmin.y, (this.height/2), (fs.height/2), ((this.height/2) + (fs.height/2)), c2c.y, b2b.y)
			this.colliding.x = true;
			//this.position.x = c2c.x > 0 ? fs.aabb.rmin.x - this.width : fs.aabb.rmax.x;

		}*/
/*		console.log(this.velocity, this.center, _oi.center);
		console.log(this.center.x + __g.ctxW, this.center.y + __g.ctxH)
		console.log(_oi.center.x + __g.ctxW, _oi.center.y + __g.ctxH)*/


/*		var v = new _Point(0,0);
		v.x = (this.center.x + this.position.x) - (fs.center.x + fs.position.x);
		v.y = (this.center.y + this.position.y) - (fs.center.y + fs.position.y);
		v.normalize();

		var overlap = new _Point(0,0);
		overlap.x = (this.aabb.rmax.x - this.aabb.rmin.x) - (fs.aabb.rmax.x - fs.aabb.rmin.x);
		overlap.y = (this.aabb.rmax.y - this.aabb.rmin.y) - (fs.aabb.rmax.y - fs.aabb.rmin.y);
		console.log(overlap);

		if (overlap.y)
		{
			this.colliding.y = true;
			if (v.y < 0){
				this.position.y = fs.aabb.rmin.y - this.height;
				this.velocity.y *= -1;
			}
			else if (v.y > 0){
				this.velocity.y = Math.abs(this.velocity.y);
			}
		} else {
			this.colliding.x = true;
			// Right
			if (v.x < 0){
				this.position.x = fs.aabb.rmin.x - this.width;
				this.velocity.x *= -1 * this.phy.restitution;
			}
			// Left
			else if (v.x > 0){
				this.position.x = fs.aabb.rmax.x;
				this.velocity.x *= -1 * this.phy.restitution;
			}
		}*/


/*
		var distance = fs.aabb.rmin.y - this.aabb.rmax.y;
		var time = Math.abs(distance / this.velocity.y);
		if (v.x < 0 && this.velocity.x)
			this.position.x = _oi.aabb.rmax.x - this.width;
		else if (v.x > 0 && this.velocity.x)
			this.position.x = _oi.aabb.rmin.x;
*/

/*		if(time > 0 && time < 2) {
			this.position.y = _oi.aabb.rmin.y - this.height;
			this.velocity.y *= -1 * this.phy.restitution;
		}
		else if (time <= 0 || distance < 0){
			this.position.y = _oi.aabb.rmin.y - this.height;
			this.velocity.y *= this.phy.restitution + _oi.phy.restitution;
		}
		if (this.aabb.rmax.x - _oi.aabb.rmin.x && this.aabb.rmax.y > _oi.aabb.rmin.y)
		{
			var nx = (this.aabb.rmax.x - _oi.aabb.rmin.x);
			console.log(nx);
			if (this.old.motion.dir.h == 'left')
				this.position.x += nx;
			else if (this.old.motion.dir.h == 'right')
				this.position.x -= nx;
		}*/
			//console.log(_oi._bounds.rmin.x, this.aabb.rmax.x, this.aabb.rmax.x - _oi._bounds.rmin.x)
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

	Shape.prototype.motion_state = function() {
		var _n, _o;
		_n = this.position;
		_o = this.old;

		if (_n.x != _o.pos.x)
			this.motion.dir.h = (_o.pos.x < _n.x) ? 'right' : 'left';
		else
			this.motion.dir.h = 'static';

		if (_n.y != _o.pos.y)
			this.motion.dir.v = (_o.pos.y < _n.y) ? 'down' : 'up';
		else if (_n.y == _o.pos.y && !this.colliding.y)
			this.motion.dir.v = 'up';
		else
			this.motion.dir.v = 'static';


		if (_n.y != _o.pos.y || _n.x != _o.pos.x || this.motion.dir.v || this.motion.dir.h){
			this.motion.is = true;
		} else {
			this.motion.is = false;
		}
	}

	Shape.prototype.set_rsc = function(obj) {
		this.rsc.index = 0;
		this.rsc = obj;
	}

	return Shape;
})();
