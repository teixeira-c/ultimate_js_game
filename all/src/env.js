var Env = (function() {
	function Env() {}

	Env.prototype.new = function(opts) {
		opts.name = opts.name || "default";
		// Gaz resistance: air=1.22, water=0.33
		// kg / m^3
		opts.rho = opts.rho || 1.22;

		// Gravitiy constant: earth=9.81
		// m / s^2
		opts.ag = opts.ag || 9.81;

		// has wind, not used
		opts.wind = opts.wind || false;

		this.list[opts.name] = opts;
	}

	Env.prototype.get = function(name) {
		return this.list[name] || {};
	}

	Env.prototype.list = {}

	return Env;
})();
