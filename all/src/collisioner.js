var Collisioner = (function() {
	function Collisioner() {}

	Collisioner.prototype.isCandidate = function(s1, s2) {
		return (((s1.rmin.x > s2.rmax.x) || (s1.rmax.x < s2.rmin.x))
				|| ((s1.rmin.y > s2.rmax.y) || (s1.rmax.y < s2.rmin.y)));
	}

	Collisioner.prototype.compute = function(s1, s2) {
		// vector center to center
		var c = s1.center.x + s1.position.x;
		var c2c = new _Point(0,0);
		c2c.x = (s2.center.x + s2.position.x) - (s1.center.x + s1.position.x);
		c2c.y = (s2.center.y + s2.position.y) - (s1.center.y + s1.position.y);

		var overlap = new _Point(0,0);
		overlap.x = Math.abs(c2c.x) - (s1.width/2) - (s2.width/2);
		overlap.y = Math.abs(c2c.y) - (s1.height/2) - (s2.height/2);


		var diff = new _Point(0,0);
		diff.x = s1.position.x - s1.old.pos.x;
		diff.y = s1.position.y - s1.old.pos.y;




		if (overlap.x < 0 && Math.abs(c2c.y) < Math.abs(c2c.x)) {
			if (c2c.x < 0) overlap.x *= -1;
			s1.position.x += overlap.x;
			s1.velocity.x *= s1.phy.restitution;
		}
		else if (overlap.x != 0 && overlap.y < 0 && Math.abs(c2c.y) > Math.abs(c2c.x)){
			console.log('overlap', overlap.x, overlap.y, 'diff', diff.x, diff.y, 'pos', c2c.x, c2c.y);
			s1.position.y += overlap.y;
			s1.velocity.y *= s1.phy.restitution;
			s1.colliding.y = true;
		}
/*		if (diff.y && Math.abs(c2c.y) > Math.abs(c2c.x) && overlap.y && overlap.x){
			if (c2c.y < 0) overlap.y *= -1;
			//this.position.y += overlap.y;
			s1.velocity.y *= -1 * s1.phy.restitution;
			//this.velocity.y = 0;
			//console.log('overlap', overlap.x, overlap.y, 'diff', diff.x, diff.y, 'pos', c2c.x, c2c.y);
			//__g.stop();
			s1.colliding.y = true;
		}*/
		//s1.old.pos = s1.position;
	}

	return Collisioner;
})();