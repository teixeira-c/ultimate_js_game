var Item = (function() {
	function Item(opts){
		opts.is = 'item';
        opts.hasCollision = false;

        this.__onCollide = opts.onCollide || null;

        this.clone = function(x, y) {
            return new Item({
                x: x, y: y,
                width: this.width, height: this.height,
                rsc: this.rsc,
                points: this.points,
                onCollide: this.__onCollide,
                blueprint: false
            });
        }

		Shape.call(this, opts);
	}

	Item.prototype = Shape.prototype;

	return Item;
})();
