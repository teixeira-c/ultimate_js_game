var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var height = canvas.height;
var width = canvas.width;


var env = {
	// Gaz resistance: air=1.22, water=0.33
	// kg / m^3
	rho: 1.22,

	// Gravitiy constant: earth=9.81
	// m / s^2
	ag: 9.81,

	// To run physics
	fps: 0.025,
};

var ball = {
	position: {x: 0, y: 0},
	velocity: {x: 0, y: 0},
	mass: 0, // kg
	radius: 0, // 1px = 1cm
	restitution: -0.7, // Restitution
	A: 0,
	Cd: 0.47, // Drag force 

	init: function(_x, _y, _mass, _radius, _restitution)
	{
		this.position.x = _x;
		this.position.y = _y;
		this.mass = _mass;
		this.radius = _radius;
		this.restitution = _restitution;
		this.A = Math.PI * ball.radius * ball.radius / (10000);
	},

	draw: function()
	{
		ctx.save();

		ctx.translate(this.position.x, this.position.y);
		ctx.beginPath();
		ctx.arc(0, 0, this.radius, 0, Math.PI*2, true);
		ctx.fill();
		ctx.closePath();

		ctx.restore();
	}
};

ball.init(width/2, 50, 0.1, 15, -0.7);
// Acceleration for a given object
// m^2
// var A = Math.PI * ball.radius * ball.radius / (10000);


function draw()
{
	requestAnimationFrame(draw);
	ctx.clearRect(0,0,width,height);

	var Fx = -0.5 * ball.Cd * ball.A * env.rho * (ball.velocity.x * ball.velocity.x) * (ball.velocity.x / Math.abs(ball.velocity.x));
	var Fy = -0.5 * ball.Cd * ball.A * env.rho * (ball.velocity.y * ball.velocity.y) * (ball.velocity.y / Math.abs(ball.velocity.y));
	Fx = (isNaN(Fx) ? 0 : Fx);
	Fy = (isNaN(Fy) ? 0 : Fy);

	// Calculate acceleration ( F = ma )
	var ax = Fx / ball.mass;
	var ay = env.ag + (Fy / ball.mass);

	ball.velocity.x += ax * env.fps;
	ball.velocity.y += ay * env.fps;

	ball.position.x += ball.velocity.x * env.fps * 100;
	ball.position.y += ball.velocity.y * env.fps * 100;

	if(ball.position.x > (width - ball.radius))
	{
		ball.velocity.x *= ball.restitution;
		ball.position.x = width - ball.radius;
	}
	else if(ball.position.x < ball.radius)
	{
		ball.velocity.x *= ball.restitution;
		ball.position.x = ball.radius;
	}

	if (ball.position.y > (height - ball.radius))
	{
		ball.velocity.y *= ball.restitution;
		ball.position.y = height - ball.radius;
	}
	ball.draw();
}

draw();