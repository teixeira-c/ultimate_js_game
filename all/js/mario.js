_Mario = (function() {
	function Mario(opts) {
		opts.restitution = 0;
		opts.contrain = true;
		opts.sprites = {
			default: __g.rsc.get('sprites', 'mario_idle'),
			walking_right: __g.rsc.get('sprites', 'mario_walking'),
			jumping: __g.rsc.get('sprites', 'mario_jumping'),
		};
		opts.fillColor = '#69D2E7';
		opts.frictionY = false;
		this.jump = {
			double: true,
			min: 300,
			last: 0
		}

		_Char.call(this, opts);
		this.__sprite('default');

		that = this;
		__g.input.register('RIGHT', function() {
			if (!that.actions.jumping)
				that.__action('walking', 'walking_right');
			that.velocity.x = 0.9;
		}, function(){
			if (!that.actions.jumping)
				that.__sprite('default');
		});

		__g.input.register('LEFT', function() {
			if (!that.actions.jumping)
				that.__action('walking', 'walking_right');
			that.velocity.x = -0.9;
		}, function(){
			if (!that.actions.jumping)
				that.__sprite('default');
		});

		__g.input.register('SPACE UP', function() {
			if (that.motion.y == 'static' && ((__g.time - that.jump.last) > that.jump.min))
			{
				that.__action('jumping', 'jumping');
				that.position.y -= 1;
				that.velocity.y = -4;
				that.jump.last = new Date().getTime();
			}
		});
	}

	Mario.prototype = _Char.prototype;

	Mario.prototype.__onenter = function() {

		if (this.actions.jumping && this.motion.y == 'static'){
			this.actions.jumping = false;
			that.__sprite('default');
		}

		if (this.motion.is == false)
		{
			this.actions = {};
			that.__sprite('default');
			return;
		}
	}

	return Mario;
})();