var Vector = (function() {
	function Vector(x, y) {
		if (typeof x == 'object')
		{
			y = x[1]; x = x[0];
		}
		this.set(x, y);
	}
	Vector.prototype.set = function(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}
	Vector.prototype.min = function(point) {
		this.x = Math.min(this.x, point.x);
      	this.y = Math.min(this.y, point.y);
	}
	Vector.prototype.max = function(point) {
		this.x = Math.max(this.x, point.x);
      	this.y = Math.max(this.y, point.y);
	}
	Vector.prototype.normalize = function() {
		var mag = Math.sqrt(this.x * this.x + this.y * this.y);
		if (mag !== 0) {
			this.x /= mag;
			this.y /= mag;
		}
	}
	Vector.prototype.dotproduct = function(vector) {
		return this.x * vector.x + this.y * vector.y;
	}
	return Vector;
})();
