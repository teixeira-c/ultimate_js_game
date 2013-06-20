
function AerialEnvironment(){
	this.SpriteList = new Array(defaultSprite = new Hero());
	
	
	this.display = function(sprite){
		sprite.draw();		
	}

}
function refreshLoop(env){
		context.clearRect(0, 0, canvas.width, canvas.height); 
		for (var i = 0; i < env.SpriteList.length; i++) {
			env.display(env.SpriteList[i]);
		}
	}	

var CurrentKey = 0;
var CurrentSpeed = 0;

function keyUp(e) {
	CurrentKey = 0;
	CurrentSpeed = 0;
}
function keyPress(e){
	keyCode = (e.keyCode ? e.keyCode : e.which);  
	if(keyCode === 37){
		CurrentKey = 'L';
		defaultSprite.direction('L');
	}
	if(keyCode === 38){
		CurrentKey = 'U';
		defaultSprite.direction('U');
	}
	if(keyCode === 39){
		CurrentKey = 'R';
		defaultSprite.direction('R');
	}
	if(keyCode === 40){
		CurrentKey = 'D';
		defaultSprite.direction('D');
	}
	cords = moveSprite(defaultSprite.x,defaultSprite.y,CurrentKey,CurrentSpeed);
	if(cords){
		defaultSprite.pos(cords);
	}
}

function Hero(){
	//cords and speed
	this.x = 25;
	this.y = 25;
	this.s = 0;
	
	// NORMAL STATE
	this.leftSpriteNormal = new Image();
	this.rightSpriteNormal = new Image();
	this.leftSpriteNormal.src = "./js/images/left_stand_up_0.png";
	this.rightSpriteNormal.src = "./js/images/right_stand_up_0.png";
	// WALK STATE 1
	this.leftSpriteOne = new Image();
	this.rightSpriteOne = new Image();
	this.leftSpriteOne.src = "./js/images/left_stand_up_1.png";
	this.rightSpriteOne.src = "./js/images/right_stand_up_1.png";
	
	// WALK STATE 2
	this.leftSpriteTwo = new Image();
	this.rightSpriteTwo = new Image();
	this.leftSpriteTwo.src = "./js/images/left_stand_up_2.png";
	this.rightSpriteTwo.src = "./js/images/right_stand_up_2.png";
	
	
	this.left = 'gauche';
	this.right = 'droite';
	this.center = 'centre';
	this.up = 'haut';
	this.down = 'bas';
	this.defaultState = this.center;
	this.defaultSpriteState = this.rightSpriteNormal;
	this.state = this.defaultState;
	this.spriteState = this.defaultSpriteState;
	this.spriteStateOne = this.rightSpriteOne;
	this.spriteStateTwo = this.rightSpriteTwo;
	this.lastStateChange = 0;
	this.defaultResetInterval = 30;
	
	//update function for relocating a sprite.
	//this will literaly teleport a sprite!
	//use movement for collision and speed algorithims
	//to evaluate where to put sprite and set it with this function
	this.pos = function(arrayCords){		
		this.x = arrayCords[0];
		this.y = arrayCords[1];
		this.lastStateChange = 0;
	}
	this.draw = function(){
		this.lastStateChange = this.lastStateChange + 1;
		if(this.lastStateChange >= this.defaultResetInterval){
			this.state = this.defaultState;
			this.spriteState = this.defaultSpriteState;
		}
		context.font="30px Arial";
		//context.fillText(this.state, this.x , this.y);
		
		context.drawImage(this.spriteStateOne, this.x , this.y, 40, 66);
		
	
		context.clearRect(this.x , this.y, 40, 66)
		
		//context.drawImage(this.spriteStateTwo, this.x , this.y, 40, 66);;
		//context.clearRect(this.x , this.y, 40, 66)
		
		context.drawImage(this.spriteState, this.x , this.y, 40, 66);
	}
	this.speed = function(){
		
	}
	//changes the direction of the sprite
	this.direction = function(dir){
		switch(dir){
			case 'U':
				this.state = this.up;
			  break;
			case 'D':
				this.state = this.down;
			  break;
			case 'R':
				this.spriteState = this.rightSpriteNormal;
				this.spriteStateOne = this.rightSpriteOne;
				this.spriteStateTwo = this.rightSpriteTwo;
				this.state = this.right;
			  break;
			case 'L':
				this.spriteState = this.leftSpriteNormal;
				this.spriteStateOne = this.leftSpriteOne;
				this.spriteStateTwo = this.leftSpriteTwo;
				this.state = this.left;
			  break;
			}
		}
	this.debug = function(){
		console.log('SPRITE| x,y,s = ' +  this.x + ',' + this.y + ',' + this.s + '| lastStateChange ' + this.lastStateChange);
	}
}


//moveSprit will return the location of where a sprite is being moved to, will also handle speed and clipping 
function moveSprite(x, y, direction, speed){

	//Speed is integer of how many tiles to move at a time
	//speed = speed - 1;
	console.log(speed);
	switch(direction)
	{
		case 'U':
			y = y - TileSize - speed; 
		  break;
		case 'D':
			y = y + TileSize + speed; 
		  break;
		case 'R':
			x = x + TileSize + speed; 
		  break;
		case 'L':
			x = x - TileSize - speed; 
		  break;
	}
	if(!clip(x,y)){
		return(new Array(x,y));
	}
}

function clip(x, y){
	if(x>750 || x < 0){
		return true;
	}
	if(y > 452 || y < 0){
		return true;
	}
	return false;
}