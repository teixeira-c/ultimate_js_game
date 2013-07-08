var Mario = (function() {
	function Mario(opts) {
		opts.restitution = 0;
		opts.sprites = {
			default: __g.rsc.get('sprite.mario_idle'),
			walking_right: __g.rsc.get('sprite.mario_walking'),
			jumping: __g.rsc.get('sprite.mario_jumping'),
		};

		opts.fillColor = '#69D2E7';
		opts.frictionY = false;
		opts.points = [
			new Vector(0,0),
			new Vector(24,0),
			new Vector(24,29),
			new Vector(0,29),
		];
		this.jump = {
			double: true,
			min: 500,
			last: 0
		}

		_Char.call(this, opts);
		this.__sprite('default');

		that = this;

		__g.input.register('RIGHT', function() {
			if (!that.actions.jumping)
				that.__action('walking', 'walking_right');
			that.velocity.x = 1;
		}, function(){
			if (!that.actions.jumping)
				that.__sprite('default');
		});

		__g.input.register('LEFT', function() {
			if (!that.actions.jumping)
				that.__action('walking', 'walking_right');
			that.velocity.x = -1;
		}, function(){
			if (!that.actions.jumping)
				that.__sprite('default');
		});

		__g.input.register('SPACE UP', function() {
			if (that.motion.y == 'static' && ((__g.time - that.jump.last) > that.jump.min))
			{
				that.__action('jumping', 'jumping');
				that.position.y -= 1;
				that.velocity.y = -4.2;
				that.jump.last = new Date().getTime();
			}
		});
	}

	Mario.prototype = _Char.prototype;

	Mario.prototype.__onEnter = function() {

		if (this.actions.jumping && this.motion.y == 'static'){
			this.actions.jumping = false;
			this.__sprite('default');
		}

		if (this.motion.is == false)
		{
			this.actions = {};
			this.__sprite('default');
			return;
		}
		if (this.position.y >= __g.size.y)
			__g.loop = __g.rsc.get('screen.loose');
	}

	return Mario;
})();
