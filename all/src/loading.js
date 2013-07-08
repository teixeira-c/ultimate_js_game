var mainLoading = new Loader({
	name: 'main',
	initial: true,
	initialCanvas: document.getElementById("myCanvas"),
	files: {
		js: [
			'src/mario.js'
		],
		img: [
			['src/img/mario.png', 'mario'],
			['src/img/tiles.jpg', 'tiles'],
			['src/img/coin.png', 'coin']
		],
		lvl: [
			['src/map/lvl_3.json', 'lvl_3']
		]
	},
	onLoading: null,
	onSuccess: pre,
	onFail: function(load){
		console.log('faile', this);
	}
});

mainLoading.launch();

function pre(load)
{
	mainLoading.interval = null;

	// Create game
	__g = new Game({
		el: "myCanvas",
		debug: false
	});

	// Push everything loaded in the ressource library
	__g.rsc.mutiple(load.files);

	/************************ SPRITES *****************/
	__g.rsc.sprites('img.mario', {
		'mario_idle': {start: [0,0], size: [24,29], frames: 1},
		'mario_walking': {start: [0,30], size: [24,29], frames: 6},
		'mario_jumping': {start: [0,62], size: [24,29], frames: 3}
	});
	__g.rsc.sprites('img.tiles', {
		'tile_def': {start: [0,0], size: [36,36], frames: 1}
	});
	__g.rsc.sprites('img.coin', {
		'coin': {start: [0,0], size: [25,25], frames: 10, fps: 5}
	});

	// Create main char
	new Mario({x: 57, y: 475});


	// Create tile blueprint
	new Tile({
		name: 't#', blueprint: true,
		width: 36, height: 36,
	});

	// Create coin blueprint
	new Item({
		name: 'coin', blueprint: true,
		width: 20, height: 20,
		points: [
			new Vector(0, 0),
			new Vector(16, 0),
			new Vector(16, 16),
			new Vector(0, 16)
		],
		rsc: 'sprite.coin',
		onCollide: function(s, i){
			if (!this.picked)
			{
				this.picked = true;
				__g.rsc.list.shapes.all.splice(i, 1);
				__g.ui.coins++;
				if (__g.ui.coins == 5)
					__g.loop = __g.rsc.get('screen.win');
			}
		}
	});


	// Create map
	__g.map = new _Map();
	__g.map.add_view('lvl_3');
	__g.map.set_current_view('lvl_3');


	// Create ui
	__g.ui = new Ui();
	__g.ui.coins = 0;
	__g.ui.draw = function(){
		__g.ctx.fillStyle = "#444";
		__g.ctx.font = "normal 31px Arial";
		__g.ctx.fillText(this.coins + '/5', 15, 45);
	};

	// Register screen
	__g.rsc.set('screen', 'main', draw);
	__g.rsc.set('screen', 'win', win);
	__g.rsc.set('screen', 'loose', loose);

	// Launch main loop
	__g.loop = __g.rsc.get('screen.main');
	__g.play();

	console.log(__g.rsc.list.blueprint)
	console.log(__g.rsc.list.shapes)
}


var draw = function()
{
	__g.play();
	__g.time = new Date().getTime();
	__g.ctx.clearRect(0, 0, __g.size.x, __g.size.y);

	__g.input.onFrame();

	for (var i = 0, l = __g.rsc.list.shapes.active.length; i < l; ++i) {
		__g.rsc.list.shapes.active[i].compute();
	}

	for (var i = 0, l = __g.rsc.list.shapes.all.length; i < l; ++i) {
		__g.rsc.list.shapes.all[i].draw();
	}

	__g.ui.draw();
	//__g.stop();
}


var win = function()
{
	__g.play();
	__g.ctx.clearRect(0, 0, __g.size.x, __g.size.y);


	__g.ctx.fillStyle = "#444";
	__g.ctx.font = "normal 51px Arial";
	__g.ctx.fillText('You Win', 405, 405);
}

var loose = function()
{
	__g.play();
	__g.ctx.clearRect(0, 0, __g.size.x, __g.size.y);


	__g.ctx.fillStyle = "#444";
	__g.ctx.font = "normal 51px Arial";
	__g.ctx.fillText('You Loose', 405, 405);
}
