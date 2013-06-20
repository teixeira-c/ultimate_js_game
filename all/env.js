var Env = (function() {
	function Env(opts) {
		this.name = opts.name || "default";
		// Gaz resistance: air=1.22, water=0.33
		// kg / m^3
		this.rho = opts.rho || 1.22;

		// Gravitiy constant: earth=9.81
		// m / s^2
		this.ag = opts.ag || 9.81;

		// has wind, not used
		this.wind = opts.wind || false;

		this._l[opts.name] = this;
	}

	Env.prototype.get = function(name) {
		return this._l[name] || {};
	};
	Env.prototype._l = {}

	return Env;
})();
