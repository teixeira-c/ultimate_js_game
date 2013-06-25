
/************************ New Game *****************/
var __g = new Game({
	el: "myCanvas",
	debug: true,
	map: new _Map()
});


// Main Loading Screen
__g.rsc.screen('load_main', function(e){
	__g.ctx.globalAlpha = 0.4;
	__g.ctx.clearRect(0, 0, __g.size.x, __g.size.y);

	__g.ctx.fillStyle = "#444";
	__g.ctx.font = "normal 45px Segoe UI";
	__g.ctx.fillText('LOADING', __g.size.x/2 - 100, __g.size.y/2);

	__g.ctx.fillStyle = "#aaa";
	__g.ctx.font = "normal 11px Segoe UI";
	__g.ctx.fillText(e.pct +'%', __g.size.x/2 - 30, __g.size.y/2 + 30);

	__g.ctx.fillStyle = '#ccc';
	__g.ctx.beginPath();
	__g.ctx.moveTo(0, __g.size.y/2 + 10);
	__g.ctx.lineTo(__g.size.x, __g.size.y/2 + 10);
	__g.ctx.stroke();

	__g.ctx.globalAlpha = 0.7;
	__g.ctx.fillStyle = '#FF0000';
	__g.ctx.beginPath();
	__g.ctx.moveTo(0, __g.size.y/2 + 10);
	__g.ctx.lineTo((__g.size.x /100 ) * e.pct, __g.size.y/2 + 10);
	__g.ctx.stroke();
});

// Load ressources
__g.rsc.load({
	img: [
		['mario.png', 'sprt_mario'],
		['tiles.jpg', '#']
	],
	map: [
		['lvl_2']
	]
}, function(){
	setTimeout(onReady, 500);
}, 'load_main');

/************************ READY *****************/
function onReady() {

	/************************ SPRITES *****************/
	__g.rsc.sprites('mario_idle', 'sprt_mario', new _Point(0,0), new _Point(24,29), 1);
	__g.rsc.sprites('mario_walking', 'sprt_mario', new _Point(0,30), new _Point(24,29), 6);
	__g.rsc.sprites('mario_jumping', 'sprt_mario', new _Point(0,62), new _Point(24,29), 3);

	/************************ MAP *****************/
	__g.map = new _Map();
	__g.map.add_view('lvl_2', __g.rsc.get('map','lvl_2'));
	__g.map.set_current_view('lvl_2');


	/************************ SHAPE *****************/
	/*var obj1 = new _Shape({
		x: 250, y: 250, fillColor: '#0DB2AC',
		points: [
			new _Point(0,0),
			new _Point(23,18),
			new _Point(35,55),
			new _Point(41,9),
			new _Point(45,-17),
			new _Point(33,-25),
			new _Point(28,-13)
		],
		mass: 0.05, restitution: 1, constrain: true
	});*/
	//myObjects.push(obj1);

	var char2 = new _Mario({
		x: 190, y: 515,
		points: [
			new _Point(0,0),
			new _Point(35,0),
			new _Point(35,35),
			new _Point(0,35),
		],
	});
	__g.myShapes.push(char2);

/*	var char1 = new _Char({
		x: 205, y: 185, fillColor: '#fff',
		mass: 5, restitution: 0.5, constrain: true,
		rsc: myRsc.get('sprites', 'mario_walking'),
		points: [
			new _Point(0,0),
			new _Point(24,0),
			new _Point(24,29),
			new _Point(0,29),
		],
	});
	myObjects.push(char1);

	var obj2 = new _Shape({
		x: 275, y: 185, fillColor: '#fff',
		mass: 5, restitution: 0, constrain: true,
		rsc: myRsc.get('sprites', 'mario_walking'),
		points: [
			new _Point(0,0),
			new _Point(24,0),
			new _Point(24,29),
			new _Point(0,29),
		],
	});
	myObjects.push(obj2);

	var obj3 = new _Shape({
		x: 375, y: 185, fillColor: '#57d68d',
		mass: 5, restitution: 0.3, constrain: true,
		points: [
			new _Point(0,0),
			new _Point(30,0),
			new _Point(30,50),
			new _Point(0,50),
		],
	});
	myObjects.push(obj3);*/
	__g.loop = draw;
	__g.play();
}



/************************ DRAW *****************/
var draw = function()
{
	__g.play();
	__g.time = new Date().getTime();
	__g.ctx.clearRect(0, 0, __g.size.x, __g.size.y);

	//myMap.draw_layers('background');

	__g.input.onFrame();

	var length = __g.myShapes.length;

	for (var index = 0; index < length; ++index) {
		__g.myShapes[index].compute();
	}
	__g.map.draw_tiles();

	for (var index = 0; index < length; ++index) {
		__g.myShapes[index].draw();
	}

	//myMap.draw_layers('foreground');

	//__g.stop();
}