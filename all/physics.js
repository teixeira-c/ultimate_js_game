var _Env = (function() {
	function Env() {
		// Gaz resistance: air=1.22, water=0.33
		// kg / m^3
		this.rho = 1.22,

		// Gravitiy constant: earth=9.81
		// m / s^2
		this.ag = 9.81,

		// To run physics
		this.fps = 0.025,

		this.wind = 0
	}

	return Env;
})();

var myEnv = new _Env();
