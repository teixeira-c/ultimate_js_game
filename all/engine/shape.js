var o_id = 0;
var colors = ['#0DB2AC', '#F5DD7E', '#FC8D4D', '#FC694D', '#69D2E7', '#A7DBD8', '#E0E4CC'];

var Shape = (function() {
	function Shape(opts) {
		if (!opts || !opts.points)
			throw "no points given";

		if (!opts.blueprint)
			this.id = o_id++;
		else
			this.opts = opts;
		this.is = opts.is || false;

		this.has = {
			gravity: opts.gravity || true,
			friction: {x: true, y: true},
			collision: (opts.hasCollision !== undefined) ? opts.hasCollision : true,
			contrain: opts.contrain || false
		}
		if (opts.frictionY !== undefined) this.has.friction.y = opts.frictionY;
		if (opts.frictionX !== undefined) this.has.friction.x = opts.frictionX;

		// Physics
		this.phy = {};
		this.phy.mass = opts.mass || 1; // kg
		this.phy.restitution = opts.restitution < 0 ? 0.5 : opts.restitution; // Restitution
		this.phy.Cd = opts.cd || 1; // Drag force
		this.phy.friction = 1.25; // friction coef
		this.phy.A = 0;
		this.phy.env = __g.env.get('default');

		// shape
		this.points = opts.points;
		this.ptslen = this.points.length;
		this.fillColor = opts.fillColor || colors[Math.floor(Math.random()*colors.length)];
		this.height = opts.height || 0;
		this.width = opts.width || 0;
		this.center = new Vector();
		this.radius = 0;

		// state
		this.state = opts.state || 'passive';
		this.motion = {
			state: 'static', x: false, y: false
		};
		this.size = {x: 0, y: 0};
		this.position = new Vector(opts.x, opts.y);
		this.velocity = new Vector(0, 0);
		this.colliding = {
			state: false, x: false, y: false
		};

		this.rsc = opts.rsc ? ((opts.rsc instanceof Sprite) ? opts.rsc : __g.rsc.get(opts.rsc)) : false;
		this.old =  {
			pos: new Vector(opts.x, opts.y),
			motion: this.motion,
			cld: false,
			velocity: new Vector(0, 0)
		};

		// bounds
		this.trueBounds = false; // Fit to shape or use only _bounds
		this.aabb = {
			min: new Vector(), max: new Vector(),
			rmin: new Vector(), rmax: new Vector()
		};

		this.compute_aabb();

		if (!opts.OOTL) {
			if (!opts.blueprint)
				__g.rsc.addShape(this);
			else
				__g.rsc.set('blueprint', opts.name, this);
		}
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
		// Execute an user function, before everything.
		if (this.__onFrame)
			this.__onFrame();

		// Apply gravity to shapes
		if (this.has.gravity)
			this.apply_gravity();

		// PreCompute minimum boundary box
		this.compute_aabb();

		// Apply collision
		this.clsnr.compute(this);

		// Apply canvas constrain
		this.clsnr.contrain(this);

		// Apply friction if shape colliding on a surface
		this.apply_friction();

		// Compute an user readable motion status
		this.motion_state();

		// Execute an user function, after all calculation
		if (this.__outFrame)
			this.__outFrame();

		if (this.__onEnter)
			this.__onEnter();
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


		if (this.rsc && !__g.debug)
		{
			if (typeof this.rsc.render == 'function') {
				this.rsc.render();
			} else {
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

		this.apply_old();
	}

	Shape.prototype.display_helpers = function() {
		var c = __g.ctx;
		if (this.is === 'char')
		{
			c.fillStyle = "#444";
			c.font = "normal 11px Arial";
			c.fillText(this.motion.y +'/'+this.motion.x, -10, -5);
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

		c.beginPath();
		c.arc(this.center.x, this.center.y, 2, 0, 2*Math.PI);
		c.stroke();
		c.closePath();

		// circle
/*		c.beginPath();
		c.arc(this.center.x, this.center.y, 2, 0, 2*Math.PI);
		c.arc(this.center.x, this.center.y, this.radius, 0, 2*Math.PI);
		c.stroke();
		c.closePath();*/

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
		if (!this.colliding.state)
			return;

		if (this.has.friction.x && this.colliding.y) {
			this.velocity.x = this.velocity.x / this.phy.friction;
		}

		if (this.has.friction.y && this.colliding.x) {
			this.velocity.y = this.velocity.y / this.phy.friction;
		}
	}

	Shape.prototype.motion_state = function() {
		var _n, _o;
		_n = this.position;
		_o = this.old;

		if (_n.x != _o.pos.x)
			this.motion.x = (_o.pos.x < _n.x) ? 'right' : 'left';
		else
			this.motion.x = 'static';

		if (_n.y != _o.pos.y)
			this.motion.y = (_o.pos.y < _n.y) ? 'down' : 'up';
		else if (_n.y == _o.pos.y && !this.colliding.y)
			this.motion.y = 'up';
		else
			this.motion.y = 'static';


		if (_n.y != _o.pos.y || _n.x != _o.pos.x || this.motionx || this.motion.y){
			this.motion.state = true;
		} else {
			this.motion.state = false;
		}
	}

	Shape.prototype.set_rsc = function(obj) {
		this.rsc.index = 0;
		this.rsc = obj;
	}

	return Shape;
})();
