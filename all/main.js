var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var ctx_height = canvas.height;
var ctx_width = canvas.width;
var request_id;


/************************ RESSOURCES *****************/
var myRsc = new _Ressources();
myRsc.img('#', 'img/tiles.jpg');
myRsc.map('map_lvl_2');


/************************ MAP *****************/
var myMap = new _Map(0, 0);
myMap.add_view('lvl_2', myRsc.get('map_lvl_2'));
myMap.set_current_view('lvl_2');


/************************ SHAPE *****************/
var myObjects = [];
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

var obj2 = new _Shape({
	x: 275, y: 185, fillColor: '#57d68d',
	points: [
		new _Point(0,0),
		new _Point(30,0),
		new _Point(30,50),
		new _Point(0,50),
	],
	mass: 5, restitution: 0.5, constrain: true
});
myObjects.push(obj2);

var obj2 = new _Shape({
	x: 375, y: 185, fillColor: '#57d68d',
	points: [
		new _Point(0,0),
		new _Point(30,0),
		new _Point(30,50),
		new _Point(0,50),
	],
	mass: 5, restitution: 0.5, constrain: true
});
myObjects.push(obj2);



/************************ DRAW *****************/
var length = myObjects.length;
function draw()
{
	request_id =  requestAnimationFrame(draw, ctx);
	ctx.clearRect(0, 0, ctx_width, ctx_height);


	myMap.draw_layers('background');
	myMap.draw_tiles();
	for (var index = 0; index < length; ++index) {
		myObjects[index].do();
	}

	myMap.draw_layers('foreground');

	//window.cancelAnimationFrame(request_id);
}
draw();