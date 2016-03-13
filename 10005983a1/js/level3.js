var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;


var FLIGHT_TIME = 12;

var spawnBallFlag = false;
var localCount = 1;

var removeHero = false;
var removeCloud = false;

var healthTakingTimer;

var cloudIndex = -1;

var time_interval;

var GAME_WIN = false;
var stopControl = false;
//timer
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////
/*if(window.localStorage.length == 0){
	window.localStorage.setItem("timer", FLIGHT_TIME);
} else if (parseInt(window.localStorage.getItem("timer")) < 0){
	window.localStorage.clear();
	window.localStorage.setItem("timer", FLIGHT_TIME);
}*/
///////////////////////////////////////////////
///////////////////////////////////////////////
///////////////////////////////////////////////


var flightModeOn = true;

var SPEED_FLIGHT = 5;
var SPEED_RUN = 9;
var heroSpeed = SPEED_FLIGHT;

var btnUpReleased = true;
var btnDownReleased = true;
var btnLeftReleased = true;
var btnRightReleased = true;

function playLevel3(){
	var current_attempts = parseInt( window.localStorage.getItem("gameSTATSLevel3Attempts") );
	current_attempts++;
	window.localStorage.setItem("gameSTATSLevel3Attempts", current_attempts);
	

	window.localStorage.setItem("timer", FLIGHT_TIME);
	
	$.post(url, {'event':3, 'value': "up", 'x':   parseInt(window.localStorage.getItem("x")), 'y':  parseInt(window.localStorage.getItem("y")), 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
	
	

	
	this.world = new b2World(new b2Vec2(0, 0), false);
	var box2dCanvas, box2dContext;
	//var world;
	var SCALE = 30;
	var WIDTH = 900;
	var HEIGHT = 600;
	var destroy_list = [];
	//////////////////////////////////////
	var ballArray = [];
	var ballImageArray = [];
	
	var cloudArray = [];
	var cloudImageArray = [];
	
	//////////////////////////////////////

	var STEP = 60;
	var TIMESTEP = 1/STEP;

	var easleCanvas, easelContext, box2dCanvas, box2dContext;
	var lastTimestamp = Date.now();
	var fixedTimestepAccumulator;

	var stageOUT;
	var loaderOUT;

	var  leftWall, rightWall, topWall, bottomWall, hero;
	
	var inContact = false;
	var boatSpeed = 0;
	
	var beginContact = 0;
	var endContact = 0;
	
	var waterEndContact = false;
	var win = false;

	function init(){
		easleCanvas = document.getElementById('easelCanvas');
		box2dCanvas  = document.getElementById('box2dCanvas');
		easelContext = easleCanvas.getContext('2d');
		box2dContext = box2dCanvas.getContext('2d');
		stage = new createjs.Stage(easelCanvas);
		stage.snapPixelsEnabled = true;

		stageOUT = stage;


		//////////////////////////////////////////////
		//////////////////////////////////////////////,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
		//////////////////////////////////////////////
		w = stage.canvas.width;
		h = stage.canvas.height;
		
		 

		manifest = [
					{src: "bg.png", id: "bg"},
					//{src: "daisyspreadsheet.png", id: "olivia"},
					{src: "oliviaspritesheet.png", id: "olivia"}
		];

		loader = new createjs.LoadQueue(false);
		loader.addEventListener("complete", handleComplete);
		loader.loadManifest(manifest, true, "assets/level3/");
		
		this.loaderOUT = loader;
		//console.log(this.loaderOUT);

		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(box2dContext);
		debugDraw.SetDrawScale(SCALE);
		debugDraw.SetFillAlpha(0.1);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		this.world.SetDebugDraw(debugDraw);
	}

	init();	

	function createCloud(x, y, cloudImageArray){
		cloudBMP = new createjs.Bitmap("assets/level3/cloud.png");
		cloudBMP.x = 584 + x;
		cloudBMP.y = 297 + y;
		cloudBMP.regX = 13;
		cloudBMP.regY = 25;
		cloudBMP.snapToPixel = true;
		cloudBMP.mouseEnabled = false;
		
		cloudImageArray[cloudImageArray.length] = cloudBMP;
		
		stage.addChild(cloudBMP);
	}
	
	function handleComplete(){
		background = new createjs.Shape();
		background.graphics.beginBitmapFill(loader.getResult("bg")).drawRect(0,0,w,h);
		background.x = w - 902;
		background.y = h - 594;
		
		/*var mudImg = loader.getResult("mud");
		mud = new createjs.Shape();
		mud.graphics.beginBitmapFill(mudImg).drawRect(0,0,w + mudImg.width, h + mudImg.height);
		mud.tileW = mudImg.width;
		mud.y = h /*- mudImg.height*/ /*- 72;*/
		
		
		
		
		heroBMP = new createjs.Bitmap("assets/level3/airHotBalloon.png");
		heroBMP.x = 250;
		heroBMP.y = 250;
		heroBMP.regX = 25;
		heroBMP.regY = 27;
		heroBMP.snapToPixel = true;
		heroBMP.mouseEnabled = false;
		
		stage.addChild(background);
		
		
		
		
		/*var spriteSheet = new createjs.SpriteSheet({
			framerate: 7,
			"images": [loader.getResult("olivia")],
			"frames": {"regX": 34, "height": 64, "count": 16, "regY": 35, "width": 80},
			"animations": {
					"stand": [8, 11, "stand", 1],
					"run": [8, 11, "run", 1.5],
					"jump": [5, 8, "stand"]
			}
		});
		
		grant = new createjs.Sprite(spriteSheet, "stand");
		grant.snapToPixel = true;*/
		
		var spriteSheet = new createjs.SpriteSheet({
			framerate: 7,
			"images": [loader.getResult("olivia")],
			"frames": {"regX": 30, "height": 56, "count": 12, "regY": 27, "width": 60},
			"animations": {
					"stand": [7, 7, "stand", 1],
					"run": [6, 8, "run", 1.5],
					"jump": [0, 2, "stand"]
			}
		});
		
		grant = new createjs.Sprite(spriteSheet, "stand");
		grant.snapToPixel = true;
		
		
		
		
		
		stage.addChild(/*grant,*/ heroBMP);
		
		for(var i = 0; i < 5; i++){
			createCloud(i*(-40), 0, cloudImageArray);
		}
		
		for(var i = 0; i < 5; i++){
			createCloud(i*(-40) - 300, 0, cloudImageArray);
		}
		
		for(var i = 0; i < 3; i++){
			createCloud(i*(-40) + 180, -132, cloudImageArray);
		}
				
		/////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////
		createjs.Ticker.setFPS(30);
		createjs.Ticker.timingMode = createjs.Ticker.RAF;
		createjs.Ticker.addEventListener("tick", tick);
		/////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////
		/////////////////////////////////////////////////////////
		/*****Box2d*****/
		var myFriction = 0.1;
		
		function createBlock(id, type, index, width, height, posX, posY, isSensor){
			var blockFixture = new b2FixtureDef;
			blockFixture.density = 1;
			blockFixture.restitution = 0;
			blockFixture.friction = myFriction;
			blockFixture.shape = new b2PolygonShape;
			blockFixture.shape.SetAsBox((width / SCALE), (height / SCALE));
			var blockBodyDef = new b2BodyDef;
			blockBodyDef.type = b2Body.b2_staticBody;
			
			blockBodyDef.position.x = posX/SCALE;
			blockBodyDef.position.y = posY/SCALE;
			
			if(isSensor){
				blockFixture.isSensor = true;
			}
			
			block = this.world.CreateBody(blockBodyDef);
			block.SetUserData({id: id, type: type, index: index});
			block.CreateFixture(blockFixture);
			//////////////////////////
			return block;
		}
		
		
		// createBlock(id, type, height, width, posX, posY, isSensor)
		block1 = createBlock("block1", "red", 0, 110, 24, 270, 575, false);
		block2 = createBlock("block2", "red", 0, 230, 8, 667, 592, false);
		block3 = createBlock("block3", "blue", 0, 40, 8, 700, 510, false);
		block4 = createBlock("block4", "blue", 0, 40, 8, 857, 460, false);
		block5 = createBlock("block5", "red", 0, 80, 8, 81, 410, false);
		block6 = createBlock("block6", "blue", 0, 8, 30, 170, 432, false);
		block7 = createBlock("block7", "red", 0, 94, 8, 271, 454, false);
		block8 = createBlock("block8", "blue", 0, 8, 30, 372, 432, false);
		block9 = createBlock("block9", "red", 0, 120, 8, 500, 410, false);
		block10 = createBlock("block10", "blue", 0, 610, 8, 81, 395, false);
		block11 = createBlock("block11", "red", 0, 510, 8, 110, 380, false);
		
		cloudArray[0] = createBlock("block12", "green", 0, 18, 8, 590, 282, false);
	    cloudArray[1] = createBlock("block13", "green", 1, 18, 8, 550, 282, false);
		cloudArray[2] = createBlock("block14", "green", 2, 18, 8, 510, 282, false);
		cloudArray[3] = createBlock("block15", "green", 3, 18, 8, 470, 282, false);
		cloudArray[4] = createBlock("block16", "green", 4, 18, 8, 430, 282, false);
		
		block17 = createBlock("block17", "blue", 0, 45, 8, 360, 242, false);
		
		cloudArray[5] = createBlock("block18", "green", 5, 18, 8, 290, 282, false);
	    cloudArray[6] = createBlock("block19", "green", 6, 18, 8, 250, 282, false);
		cloudArray[7] = createBlock("block20", "green", 7, 18, 8, 210, 282, false);
		cloudArray[8] = createBlock("block21", "green", 8, 18, 8, 170, 282, false);
		cloudArray[9] = createBlock("block22", "green", 9, 18, 8, 130, 282, false);
		
		block23 = createBlock("block23_REPLENISH", "blue", 0, 75, 8, 78, 190, false);
		block24 = createBlock("block24", "red", 0, 125, 8, 775, 190, false);
		
		cloudArray[10] = createBlock("block27", "green", 10, 18, 8, 770, 150, false);
	    cloudArray[11] = createBlock("block26", "green", 11, 18, 8, 730, 150, false);
		cloudArray[12] = createBlock("block25", "green", 12, 18, 8, 690, 150, false);
		
		block28 = createBlock("block28_WIN", "blue", 0, 65, 8, 835, 100, false);
		
		
			
		//topWall
		//////////////////////////////////////////////
		var topWallFixture = new b2FixtureDef;
		topWallFixture.density = 1;
		topWallFixture.restitution = 0;
		topWallFixture.friction = myFriction;
		topWallFixture.shape = new b2PolygonShape;
		topWallFixture.shape.SetAsBox((WIDTH / SCALE), (1 / SCALE));
		var topWallBodyDef = new b2BodyDef;
		topWallBodyDef.type = b2Body.b2_staticBody;
		
		topWallBodyDef.position.x = WIDTH/2/SCALE;
		topWallBodyDef.position.y = 1/SCALE;
		
		//topWallFixture.isSensor = true;
		
		topWall = this.world.CreateBody(topWallBodyDef);
		topWall.SetUserData({id: "topWall"});
		topWall.CreateFixture(topWallFixture);
		
		//topWall
		//////////////////////////////////////////////
		var topWallFixture = new b2FixtureDef;
		topWallFixture.density = 1;
		topWallFixture.restitution = 0;
		topWallFixture.friction = myFriction;
		topWallFixture.shape = new b2PolygonShape;
		topWallFixture.shape.SetAsBox((WIDTH / SCALE), (1 / SCALE));
		var topWallBodyDef = new b2BodyDef;
		topWallBodyDef.type = b2Body.b2_staticBody;
		
		topWallBodyDef.position.x = WIDTH/2/SCALE;
		topWallBodyDef.position.y = 1/SCALE;
		
		//topWallFixture.isSensor = true;
		
		topWall = this.world.CreateBody(topWallBodyDef);
		topWall.SetUserData({id: "topWall"});
		topWall.CreateFixture(topWallFixture);
		
		//bottomWall
		//////////////////////////////////////////////
		var bottomWallFixture = new b2FixtureDef;
		bottomWallFixture.density = 1;
		bottomWallFixture.restitution = 0;
		bottomWallFixture.friction = myFriction;
		bottomWallFixture.shape = new b2PolygonShape;
		bottomWallFixture.shape.SetAsBox((WIDTH / SCALE), (5 / SCALE));
		var bottomWallBodyDef = new b2BodyDef;
		bottomWallBodyDef.type = b2Body.b2_staticBody;
		
		bottomWallBodyDef.position.x = WIDTH/2/SCALE;
		bottomWallBodyDef.position.y = (HEIGHT-5)/SCALE;
		
		bottomWall = this.world.CreateBody(bottomWallBodyDef);
		bottomWall.SetUserData({id: "bottomWall"});
		bottomWall.CreateFixture(bottomWallFixture);
		
		//leftWall
		//////////////////////////////////////////////
		var leftWallFixture = new b2FixtureDef;
		leftWallFixture.density = 1;
		leftWallFixture.restitution = 0;
		leftWallFixture.friction = 0;
		leftWallFixture.shape = new b2PolygonShape;
		leftWallFixture.shape.SetAsBox((1 / SCALE), (HEIGHT / SCALE));
		var leftWallBodyDef = new b2BodyDef;
		leftWallBodyDef.type = b2Body.b2_staticBody;
		leftWallBodyDef.position.x = 1/SCALE;
		leftWallBodyDef.position.y = (HEIGHT)/2/SCALE;
		
		//leftWallFixture.isSensor = true;
		
		leftWall = this.world.CreateBody(leftWallBodyDef);
		leftWall.SetUserData({id: "leftWall"});
		leftWall.CreateFixture(leftWallFixture);

		//rightWall
		//////////////////////////////////////////////
		var rightWallFixture = new b2FixtureDef;
		rightWallFixture.density = 1;
		rightWallFixture.restitution = 0;
		rightWallFixture.friction = 0;
		rightWallFixture.shape = new b2PolygonShape;
		rightWallFixture.shape.SetAsBox((1 / SCALE), (HEIGHT / SCALE));
		var rightWallBodyDef = new b2BodyDef;
		rightWallBodyDef.type = b2Body.b2_staticBody;
		rightWallBodyDef.position.x = WIDTH/SCALE;
		rightWallBodyDef.position.y = (HEIGHT)/2/SCALE;

		//rightWallFixture.isSensor = true;

		rightWall = this.world.CreateBody(rightWallBodyDef);
		rightWall.SetUserData({id: "rightWall"});
		rightWall.CreateFixture(rightWallFixture);

		//hero
		////////////////////////////////////////////////
		heroBodyDef = new b2BodyDef;
		heroBodyDef.type = b2Body.b2_dynamicBody;
		heroBodyDef.density = 1;
		heroBodyDef.friction = 0;
		heroBodyDef.restitution = 0;
		
		heroBodyDef.position.x =80/SCALE;
		heroBodyDef.position.y = (HEIGHT - 30)/SCALE;

		heroFixDef = new b2FixtureDef;

		/*heroFixDef.shape = new b2PolygonShape;
		heroFixDef.shape.SetAsBox((25 / SCALE), (30/ SCALE));*/
		
		heroFixDef.shape = new b2CircleShape(0.8);

		heroFixDef.filter.groupIndex = -8;

		hero = this.world.CreateBody(heroBodyDef);
		hero.SetUserData({id: "hero"});
		hero.CreateFixture(heroFixDef);

		//wheel1.SetFixedRotation(false);
	}
	
	//////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////
	function startFlightTime(){
		var timer = parseInt(window.localStorage.getItem("timer"));
		
		
		if( timer < 0){
			return;
		}
		
		if (timer < 10) {
			timeStr = "0" + timer;
		} else {
			timeStr = timer;
		}

		var text = "00:" + timeStr;
		//$("#timer").html(text);
		
		timer--;
		window.localStorage.setItem("timer", timer);
		
		if(removeHero){
			return;
		}
		
		 
		if(timer != -1){
			console.log("FLIGHT TIME");
			world.SetGravity(new b2Vec2(0, 0));
			heroSpeed = SPEED_FLIGHT;
			if( (window.localStorage.getItem("GAME_OVER") != "true") && (GAME_WIN != true) ){
				stage.addChild(/*grant,*/ heroBMP);
				stage.removeChild(grant/*, heroBMP*/);
			}	
			$("#clock").show();	
			$("#timer").text(text);
			time_interval = setTimeout(startFlightTime, 1000);
		} else{
			world.SetGravity(new b2Vec2(0, 9.81));
			heroSpeed = SPEED_RUN;
			if( (window.localStorage.getItem("GAME_OVER") != "true") && (GAME_WIN != true) ){
				stage.addChild(grant);
				stage.removeChild(heroBMP);
			}	
			console.log("RUN TIME");
			$("#clock").hide();
			/*$("#timer").hide();
			$("#gameover").show();
			$("#stats").show();
			$("#userID").text(parseInt(window.localStorage.getItem("id")));
			$("#count").text(parseInt(window.localStorage.getItem("countOver25")));
			keepTicking = false;*/
		}
	}
	//////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////
	//////////////////////////////////////////////////////////////
	
	function spawnBall( radius, speed, d2X , d2Y, ballArray, ballImageArray, img, x, y, heroSpeed){	
		//
		///////////////////////////////////////////////
		ballFixDef = new b2FixtureDef;
		ballFixDef.density = 1;
		ballFixDef.restitution = 0;
		ballFixDef.friction = 0;
		
		
		ballFixDef = new b2FixtureDef;
		ballFixDef.shape = new b2CircleShape(radius);
		
		//ballFixDef.filter.groupIndex = -8;
		
		ballBodyDef = new b2BodyDef;
		ballBodyDef.type = b2Body.b2_dynamicBody;
		
		ballBodyDef.position.x = (d2X)/SCALE;
		ballBodyDef.position.y = (HEIGHT - d2Y)/SCALE;

		ballFixDef.isSensor = true;

		var myBall = world.CreateBody(ballBodyDef);
		
		index = ballArray.length;
		
		myBall.SetUserData({id: "ball", index: index});
		myBall.CreateFixture(ballFixDef);
		
		//myBall.gravityFactor =0;
		
		myBall.SetLinearVelocity( new  b2Vec2(0, speed));

		//console.log(myBall.GetUserData());
		
		ballArray[index] = myBall;
		//////////////////////////////////////////////
		ballImageArray[index] = new createjs.Bitmap("assets/level3/" + img);
		ballImageArray[index].x = 1250;
		ballImageArray[index].y = 1250;
		ballImageArray[index].regX = x;
		ballImageArray[index].regY = y;
		ballImageArray[index].snapToPixel = true;
		ballImageArray[index].mouseEnabled = false;
		
		this.stage.addChild(ballImageArray[index]);
	} 
		
	$(window).keydown(function(e) {
		if( (window.localStorage.getItem("GAME_OVER") != "true") && (stopControl != true) ){
			if(e.keyCode == 37){
				
				if(btnLeftReleased){
					left();
					btnLeftReleased = false;
					grant.gotoAndPlay("run");
					grant.scaleX = -1;
				}
				//heroBMP.rotation = -90;
				$.post(url, {'event':1, 'value': "left", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			
			}
			if(e.keyCode == 39){
				//heroBMP.rotation = 0;
				//heroBMP.rotation = 90;
				if(btnRightReleased ){
					right();
					btnRightReleased = false;
				}
				grant.gotoAndPlay("run");
				grant.scaleX = 1;
				$.post(url, {'event':2, 'value': "right", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			
			}
			if(e.keyCode == 38){
				if(heroSpeed == SPEED_FLIGHT && flightModeOn){
					startFlightTime();
					flightModeOn = false;
				}
				//heroBMP.rotation = 0;
				if(btnUpReleased){
					up();
					btnUpReleased = false;
				}
				grant.gotoAndPlay("jump");
				$.post(url, {'event':3, 'value': "up", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			
			}
			if(e.keyCode == 40){
				//heroBMP.rotation = 0;
				//heroBMP.rotation = 180;
				if(btnDownReleased){
					down();
					btnDownReleased = false;
				}
				$.post(url, {'event':4, 'value': "down", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			
			}
		}	
	});

	$(window).keyup(function(e) {
		if( (window.localStorage.getItem("GAME_OVER") != "true") && (stopControl != true) ){
			if(e.keyCode == 37){
				stop();
				btnLeftReleased = true;
				grant.gotoAndPlay("stand");
			}
			if(e.keyCode == 39){
				stop();
				btnRightReleased = true;
				grant.gotoAndPlay("stand");
			}
			if(e.keyCode == 38){
				stopX();
				btnUpReleased = true;
			}
			if(e.keyCode == 40){
				stopX();
				btnDownReleased = true;
			}
		}	
	});
	
	//Control functions
	function up(){ 
		hero.ApplyImpulse(new b2Vec2(0, -heroSpeed), hero.GetWorldCenter());
		//hero.SetLinearVelocity(new b2Vec2(hero.GetLinearVelocity().x, -10));
	}

	function down(){ 
		hero.ApplyImpulse(new b2Vec2(0, heroSpeed), hero.GetWorldCenter());
		//hero.SetLinearVelocity(new b2Vec2(hero.GetLinearVelocity().x, 10));
	}

	function left(){ 
		hero.ApplyImpulse(new b2Vec2(-heroSpeed, 0), hero.GetWorldCenter());
		//hero.SetLinearVelocity(new b2Vec2(-10, hero.GetLinearVelocity().y));
	}

	function right(){ 
		hero.ApplyImpulse(new b2Vec2(heroSpeed, 0), hero.GetWorldCenter());
		//hero.SetLinearVelocity(new b2Vec2(10, hero.GetLinearVelocity().y));
	}

	function stop(){
		hero.SetLinearVelocity(new b2Vec2(0, hero.GetLinearVelocity().y ));
		//hero.SetLinearVelocity(new b2Vec2(hero.GetLinearVelocity().x, 0))	
	}

	function stopX(){ 
		if(heroSpeed == SPEED_FLIGHT){
			hero.SetLinearVelocity(new b2Vec2(hero.GetLinearVelocity().x, 2));
		} else if(heroSpeed == SPEED_RUN){
			hero.SetLinearVelocity(new b2Vec2(hero.GetLinearVelocity().x, 5));
		}	
	}

	
	
	 
	 
	function tick(event){
		if((window.localStorage.getItem("GAME_OVER") == "true") && (window.localStorage.getItem("GAME_OVER_CHECK") == "false")){
			$("#gameover").show();
			if( $("#gameover").is(":visible") ){
				$.post(url, {'event':5, 'value': "GAMEOVER", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});	
			}
			window.localStorage.setItem("GAME_OVER_CHECK", "true");
			//window.localStorage.setItem("GAME_OVER", "false");
		}
		
		/*if(GAME_WIN == true){
			
		}*/
		
		if(win){
			clearInterval(refreshIntervalId1);
			window.localStorage.setItem("gameLevel1END", false);
			window.localStorage.setItem("gameLevel2END", false);
			window.localStorage.setItem("gameLevel3END", true);
			//TODO set global var ENDofLEVEL2 >>>>>>>>>>>>>>>>> 3? <<<<<<<<<<<<<<<= true;
			//return;
		}
		
		update();
		stage.update(event);
	} 




	////////////////////////////////////////////////
	////////////////////////////////////////////////
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	////////////////////////////////////////////////
	////////////////////////////////////////////////
	////////////////////////////////////////////////



	function update() {
		this.world.Step(TIMESTEP, 10, 10);
		
		//heroBMP.rotation = hero.GetAngle()*(180/Math.PI);	
		grant.x = hero.GetPosition().x*SCALE;
		grant.y = hero.GetPosition().y*SCALE;	
		
		heroBMP.rotation = hero.GetAngle()*(180/Math.PI);	
		heroBMP.x = hero.GetPosition().x*SCALE;
		heroBMP.y = hero.GetPosition().y*SCALE;	
				
		if(removeHero){
			this.stage.removeChild(grant);
			this.stage.removeChild(heroBMP);
			removeHero = false;
			clearTimeout(time_interval);
			//TODO taka one life
			if( window.localStorage.getItem("GAME_OVER") != "true" ){
				window.location.reload();
			} 
		}
		
		if(removeCloud){
			this.stage.removeChild(cloudImageArray[cloudIndex]);
			removeCloud = false;
		}
					
		//FIREBALLS
		////////////////////////////////////////////////////////////////////////
		for(var i = 0; i < ballArray.length; i++){
			//ballImageArray[i].rotation = ballArray[i].GetAngle()*(180/Math.PI);	
			ballImageArray[i].x = ballArray[i].GetPosition().x*SCALE;
			ballImageArray[i].y = ballArray[i].GetPosition().y*SCALE;	
		}
		////////////////////////////////////////////////////////////////////////

		if(spawnBallFlag && (localCount >= 0)){
			 setInterval(function(){ 
				positionX = 180 + (Math.floor((Math.random()*11)+1))*40;
				//spawnBall( radius, speed, d2X , d2Y, ballArray, ballImageArray, img, x, y, heroSpeed)
				spawnBall( 0.5, 2, positionX , 570, ballArray, ballImageArray, "ball.png", 19, 88, heroSpeed);		 /*40*/ 		
			 }, 1800);
			 
			 setInterval(function(){ 
				positionX = 180 + (Math.floor((Math.random()*11)+1))*40;
				//spawnBall( radius, speed, d2X , d2Y, ballArray, ballImageArray, img, x, y)
				spawnBall( 0.5, 1.8, positionX , 570, ballArray, ballImageArray, "ball.png", 19, 88, heroSpeed);		 /*40*/ 		
			 }, 2600);
			 
			 setInterval(function(){ 
				positionX = 180 + (Math.floor((Math.random()*11)+1))*40;
				//spawnBall( radius, speed, d2X , d2Y, ballArray, ballImageArray, img, x, y)
				spawnBall( 0.5, 2.3, positionX , 570, ballArray, ballImageArray, "ball.png", 19, 88, heroSpeed);		 /*40*/ 		
			 }, 3200);
			 
			spawnBallFlag = false;
		}
			
		if(heroSpeed == SPEED_RUN) {
			//console.log(ballArray.length);
			for(var i = 0; i < ballArray.length; i++){	
				//ballArray[i].ApplyForce( new b2Vec2(0, -15), ballArray[i].GetWorldCenter() );
				ballArray[i].ApplyImpulse( new b2Vec2(0, -0.16), ballArray[i].GetWorldCenter() );
			}
		}
			
		this.world.ClearForces();
		this.world.m_debugDraw.m_sprite.graphics.clear();
		this.world.DrawDebugData();
		
		for (var i in destroy_list) {
			this.world.DestroyBody(destroy_list[i]);
		}
		//Reset the array
		destroy_list.length = 0;
		//window.requestAnimationFrame(update);
	}

	//window.requestAnimationFrame(update);

	
	//CARS
	/*var timer = 50;
	
	setTimeout(function(){
		spawnCar(60, -3, 100, WIDTH, car1_list, car1_list_IMG, "truck2.png", 90, 23);
	}, timer);
	var refreshIntervalId1 = setInterval(function(){
		spawnCar(60, -3, 100, WIDTH, car1_list, car1_list_IMG, "truck2.png", 90, 23);
	}, 3000);*/
		
	function checkBallsArrays(object){
		index = object.index;
		
		//console.log(index);
		this.stage.removeChild(ballImageArray[index]);
		/*ballArray.splice(index, 1);
		ballImageArray.splice(index, 1);*/	
	}
	
	function winProsedure(){
		att1 = parseInt( window.localStorage.getItem("gameSTATSLevel1Attempts") );
		att2 = parseInt( window.localStorage.getItem("gameSTATSLevel2Attempts") );
		att3 = parseInt( window.localStorage.getItem("gameSTATSLevel3Attempts") );
		attTotal = att1 + att2 + att3;
		
		bonus = window.localStorage.getItem("gameSTATSLevel1Bonus");
		percent = parseInt( window.localStorage.getItem("lifePercent") );
		lifes = parseInt( window.localStorage.getItem("life") );
		
		var url = 'http://localhost/10005983a1/php/ModelScore.php';
		$.post(url, {'attempts':attTotal, 'bonus': bonus, 'percent':  percent, 'life':  lifes});
		
		$("#att").html(attTotal);
		$("#bonus").html(bonus);
		$("#percent").html(Math.floor((percent/10)) + "%");
		$("#lifeStat").html(lifes);
		
		$("#gamewin").show();
		
		stopControl = true;
	}

	var listener = new Box2D.Dynamics.b2ContactListener;

	listener.BeginContact = function(contact) {
		if (contact.GetFixtureA().GetBody().GetUserData() != null && contact.GetFixtureB().GetBody().GetUserData() != null) {
			if (contact.GetFixtureA().GetBody().GetUserData().id == "hero" && contact.GetFixtureB().GetBody().GetUserData().type == "green") {
				setTimeout(function(){ 
					destroy_list.push(contact.GetFixtureB().GetBody()); 
					removeCloud = true;
					cloudIndex = contact.GetFixtureB().GetBody().GetUserData().index;
				}, 1000);
			} else if (contact.GetFixtureA().GetBody().GetUserData().type == "green" && contact.GetFixtureB().GetBody().GetUserData().id == "hero" ) {
				setTimeout(function(){ 
					destroy_list.push(contact.GetFixtureA().GetBody()); 
					removeCloud = true;
					cloudIndex = contact.GetFixtureA().GetBody().GetUserData().index;
				}, 1000);
			}
			
			if (contact.GetFixtureA().GetBody().GetUserData().id == "hero" && contact.GetFixtureB().GetBody().GetUserData().type == "red") {
				healthTakingTimer = setInterval(function(){ setLife(5); }, 100);
			} else if (contact.GetFixtureA().GetBody().GetUserData().type == "red" && contact.GetFixtureB().GetBody().GetUserData().id == "hero" ) {
				healthTakingTimer = setInterval(function(){ setLife(5); }, 100);
			}
			
			if (contact.GetFixtureA().GetBody().GetUserData().id == "hero" && contact.GetFixtureB().GetBody().GetUserData().id == "block23_REPLENISH") {
				window.localStorage.setItem("timer", FLIGHT_TIME);
				flightModeOn = true;
				/*//spawnBall( radius, speed, d2X , d2Y, ballArray, ballImageArray, img, x, y)
				spawnBall( 0.5, 3, 180 , 570, ballArray, ballImageArray, "bird.png", 0, 0);
				spawnBall( 0.5, 3, 220 , 570, ballArray, ballImageArray, "bird.png", 0, 0);*/
				spawnBallFlag = true;
				localCount--;
				
				if( flightModeOn ){
					startFlightTime();
					flightModeOn = false;
				}
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "block23_REPLENISH" && contact.GetFixtureB().GetBody().GetUserData().id == "hero" ) {
				window.localStorage.setItem("timer", FLIGHT_TIME);
				flightModeOn = true;
				/*//spawnBall( radius, speed, d2X , d2Y, ballArray, ballImageArray, img, x, y)
				spawnBall( 0.5, 3, 180 , 570, ballArray, ballImageArray, "bird.png", 0, 0);
				spawnBall( 0.5, 3, 220 , 570, ballArray, ballImageArray, "bird.png", 0, 0); */
				spawnBallFlag = true;
				localCount--;
				
				if( flightModeOn ){
					startFlightTime();
					flightModeOn = false;
				}
			}
			
			if (contact.GetFixtureA().GetBody().GetUserData().id == "hero" && contact.GetFixtureB().GetBody().GetUserData().id == "block28_WIN") {
				GAME_WIN = true;
				winProsedure();
				console.log("GAME_WIN");
				$.post(url, {'event':6, 'value': "GAMEWON", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "block28_WIN" && contact.GetFixtureB().GetBody().GetUserData().id == "hero" ) {
				GAME_WIN = true;
				winProsedure()
				console.log("GAME_WIN");
				$.post(url, {'event':6, 'value': "GAMEWON", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			}
			

			if (contact.GetFixtureA().GetBody().GetUserData().type == "blue" && contact.GetFixtureB().GetBody().GetUserData().id == "ball") {
				checkBallsArrays(contact.GetFixtureB().GetBody().GetUserData());
				destroy_list.push(contact.GetFixtureB().GetBody());
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "ball" && contact.GetFixtureB().GetBody().GetUserData().type == "blue" ) {
				checkBallsArrays(contact.GetFixtureA().GetBody().GetUserData());
				destroy_list.push(contact.GetFixtureA().GetBody());
			}
			
			if (contact.GetFixtureA().GetBody().GetUserData().type == "green" && contact.GetFixtureB().GetBody().GetUserData().id == "ball") {
				checkBallsArrays(contact.GetFixtureB().GetBody().GetUserData());
				destroy_list.push(contact.GetFixtureB().GetBody());
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "ball" && contact.GetFixtureB().GetBody().GetUserData().type == "green" ) {
				checkBallsArrays(contact.GetFixtureA().GetBody().GetUserData());
				destroy_list.push(contact.GetFixtureA().GetBody());
			}
			
			if (contact.GetFixtureA().GetBody().GetUserData().id == "hero" && contact.GetFixtureB().GetBody().GetUserData().id == "ball") {
				destroy_list.push(contact.GetFixtureA().GetBody());
				 setLife(1000);
				 removeHero = true;
				//TODO RELOAD
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "ball" && contact.GetFixtureB().GetBody().GetUserData().id == "hero" ) {
				destroy_list.push(contact.GetFixtureB().GetBody());
				setLife(1000);
				removeHero = true;
				//TODO RELOAD
			}
		}
	}
	
	

	listener.EndContact = function(contact) {
		if (contact.GetFixtureA().GetBody().GetUserData() != null && contact.GetFixtureB().GetBody().GetUserData() != null) {
			if (contact.GetFixtureA().GetBody().GetUserData().id == "hero" && contact.GetFixtureB().GetBody().GetUserData().type == "red") {
				clearInterval(healthTakingTimer);
			} else if (contact.GetFixtureA().GetBody().GetUserData().type == "red" && contact.GetFixtureB().GetBody().GetUserData().id == "hero" ) {
				clearInterval(healthTakingTimer);
			}
		}
	}

	this.world.SetContactListener(listener);
		
}	
