var Collisioner = (function() {
	function Collisioner() {}

	Collisioner.prototype.isCandidate = function(s1, s2) {
		return (((s1.rmin.x > s2.rmax.x) || (s1.rmax.x < s2.rmin.x))
				|| ((s1.rmin.y > s2.rmax.y) || (s1.rmax.y < s2.rmin.y)));
	}

	Collisioner.prototype.contrain = function(s1) {
		if (!s1.has.contrain)
			return;

		s1.compute_aabb();
		if (s1.aabb.rmax.y >= __g.size.y) { // ground
			s1.velocity.y *= -1 * s1.phy.restitution;
			s1.position.y = __g.size.y - s1.aabb.max.y;
			s1.colliding.y = true;
		} else if (s1.aabb.rmin.y < 0 ){
			s1.velocity.y *= -s1.phy.restitution;
			s1.colliding.y = true;
		}
		if (s1.aabb.rmax.x >=  __g.size.x) { // right
			//s1.velocity.x *= -1 * s1.phy.restitution;
			s1.position.x =  __g.size.x - s1.aabb.max.x;
			s1.colliding.x = true;
		} else if (s1.aabb.rmin.x <= 0) { // left
			s1.velocity.x *= s1.phy.restitution;
			s1.position.x = 0;
			s1.colliding.x = true;
		}

		if (s1.colliding.y || s1.colliding.x)
			s1.colliding.state = true;
	}

	Collisioner.prototype.compute = function(s1) {
		var sn = __g.rsc.list.shapes.all;
		for (var i in sn) {
			var s2 = sn[i];
			if (s2.id === s1.id)
				continue;

			if (this.isCandidate(s1.aabb, s2.aabb))
			{
				continue;
			}
			else{
				if (s2.has.collision)
					this.apply(s1, s2);

				if (typeof s1.__onCollide == 'function')
					s1.__onCollide(s2);
				if (typeof s2.__onCollide == 'function')
					s2.__onCollide(s1, i);

				s1.colliding.state = true;
				s2.colliding.state = true;
			}
		}
	}

	Collisioner.prototype.apply = function(s1, s2) {
		// vector center to center
		var c2c = new Vector(0,0);
		c2c.x = (s2.center.x + s2.position.x) - (s1.center.x + s1.position.x);
		c2c.y = (s2.center.y + s2.position.y) - (s1.center.y + s1.position.y);

		var overlap = new Vector(0,0);
		overlap.x = Math.abs(c2c.x) - (s1.width/2) - (s2.width/2);
		overlap.y = Math.abs(c2c.y) - (s1.height/2) - (s2.height/2);

		var diff = new Vector(0,0);
		diff.x = s1.position.x - s1.old.pos.x;
		diff.y = s1.position.y - s1.old.pos.y;

		if (overlap.x < 0 && Math.abs(c2c.y) < Math.abs(c2c.x) && s1.velocity.x) {
			if (c2c.x < 0) overlap.x *= -1;
			s1.position.x += overlap.x;
			s1.velocity.x *= s1.phy.restitution;
			s1.colliding.x = true;
		} else if (overlap.x != 0 && ((overlap.y < 0 && Math.abs(c2c.y) > Math.abs(c2c.x))
		           || (!diff.x && diff.y > 0))){
			if (c2c.y < 0) overlap.y *= -1;
			if (s1.velocity.y < 0){
				s1.position.y += overlap.y;
				if (c2c.y < 0)
					s1.velocity.y *= s1.phy.restitution;
			} else {
				s1.velocity.y = -1 * s1.phy.restitution;
				s1.position.y += overlap.y;
			}
			s1.colliding.y = true;
		} else {
/*			console.log('overlap', overlap.x, overlap.y,
			            'diff', diff.x, diff.y,
			            'pos', c2c.x, c2c.y,
			            'velocity', s1.velocity.x, s1.velocity.y,
			            'width', s1.width/2 + s2.width/2,
			            'height', s1.height/2 + s2.height/2,
			            'motion_v', s1.motion.dir.v,
			            'motion_h', s1.motion.dir.h);*/
		}
	}

	return Collisioner;
})();
