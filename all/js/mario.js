_Mario = (function() {
	function Mario(opts) {
		opts.restitution = 0.05;
		opts.constrain = false;
		opts.anim = {
			walking_right: myRsc.get('sprites', 'mario_walking'),
		}

		_Char.call(this, opts);
		console.log(this);
		that = this;
		__g.register('RIGHT', function() {
			that.position.x += 5;
			that.velocity.x += 1;
			that.play('walking_right');
		}, function(){
			that.rsc.index = 0;
			that.rsc = false;
		});

		__g.register('LEFT', function() {
			that.position.x -= 5;
			that.play('walking_right');
		});
	}

	Mario.prototype = _Char.prototype;

	return Mario;
})();