/*var b2Vec2 = Box2D.Common.Math.b2Vec2;
var b2BodyDef = Box2D.Dynamics.b2BodyDef;
var b2Body = Box2D.Dynamics.b2Body;
var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
var b2Fixture = Box2D.Dynamics.b2Fixture;
var b2World = Box2D.Dynamics.b2World;
var b2MassData = Box2D.Collision.Shapes.b2MassData;
var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;


var world = new b2World(new b2Vec2(0, 0), false);*/

function playLevel2(){
	var current_attempts = parseInt( window.localStorage.getItem("gameSTATSLevel2Attempts") );
	current_attempts++;
	window.localStorage.setItem("gameSTATSLevel2Attempts", current_attempts);
	
	$.post(url, {'event':3, 'value': "up", 'x':   parseInt(window.localStorage.getItem("x")), 'y':  parseInt(window.localStorage.getItem("y")), 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			
	
	
	this.world =  new b2World(new b2Vec2(0, 0), false);
	
	var box2dCanvas, box2dContext;
	var world;
	var SCALE = 30;
	var WIDTH = 900;
	var HEIGHT = 600;
	var destroy_list = [];
	//////////////////////////////////////
	var car1_list = [];
	var car1_list_IMG = [];
	
	var car2_list = [];
	var car2_list_IMG = [];
	
	var car3_list = [];
	var car3_list_IMG = [];
	
	var car4_list = [];
	var car4_list_IMG = [];
	
	
	var boat1_list = [];
	var boat1_list_IMG = [];
	
	var boat2_list = [];
	var boat2_list_IMG = [];
	
	var boat3_list = [];
	var boat3_list_IMG = [];
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
					{src: "ground1.png", id: "mud"},
					{src: "ground2.png", id: "asphalt"},
					{src: "ground3.png", id: "sand"},
					{src: "ground4.png", id: "grass"},
					{src: "water.png", id: "water"}
		];

		loader = new createjs.LoadQueue(false);
		loader.addEventListener("complete", handleComplete);
		loader.loadManifest(manifest, true, "assets/level2/");
		
		this.loaderOUT = loader;
		////console.log(this.loaderOUT);

		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(box2dContext);
		debugDraw.SetDrawScale(SCALE);
		debugDraw.SetFillAlpha(0.3);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		this.world.SetDebugDraw(debugDraw);
	}	

	function handleComplete(){
		var mudImg = loader.getResult("mud");
		mud = new createjs.Shape();
		mud.graphics.beginBitmapFill(mudImg).drawRect(0,0,w + mudImg.width, h + mudImg.height);
		mud.tileW = mudImg.width;
		mud.y = h /*- mudImg.height*/ - 72;
		
		var asphaltImg = loader.getResult("asphalt");
		asphalt = new createjs.Shape();
		asphalt.graphics.beginBitmapFill(asphaltImg).drawRect(0,0,w + asphaltImg.width, /*h + asphaltImg.height*/ 205);
		asphalt.tileW = asphaltImg.width;
		asphalt.y = h /*- asphaltImg.height*/ - 277;
		
		var sandImg = loader.getResult("sand");
		sand = new createjs.Shape();
		sand.graphics.beginBitmapFill(sandImg).drawRect(0,0,w + sandImg.width, /*h + sandImg.height*/ 70);
		sand.tileW = sandImg.width;
		sand.y = h /*- sandImg.height*/ - 347;
		
		var waterImg = loader.getResult("water");
		water = new createjs.Shape();
		water.graphics.beginBitmapFill(waterImg).drawRect(0,0,w + waterImg.width, /*h + waterImg.height*/ 156);
		water.tileW = waterImg.width;
		water.y = h - waterImg.height - 471;
		
		var grassImg = loader.getResult("grass");
		grass = new createjs.Shape();
		grass.graphics.beginBitmapFill(grassImg).drawRect(0,0,w + grassImg.width, /*h + grassImg.height*/ 110);
		grass.tileW = grassImg.width;
		grass.y = h - grassImg.height - 571;
		
		heroBMP = new createjs.Bitmap("assets/level2/spritesheet_grant.png");
		heroBMP.x = 250;
		heroBMP.y = 250;
		heroBMP.regX = 13;
		heroBMP.regY = 25;
		heroBMP.snapToPixel = true;
		heroBMP.mouseEnabled = false;
		

		
		stage.addChild(mud, asphalt, sand, grass, water, heroBMP, heroBMP, heroBMP, heroBMP);
		
		
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

		//waterSensor
		//////////////////////////////////////////////
		var waterSensorFixture = new b2FixtureDef;
		waterSensorFixture.density = 1;
		waterSensorFixture.restitution = 0;
		waterSensorFixture.friction = myFriction;
		waterSensorFixture.shape = new b2PolygonShape;
		waterSensorFixture.shape.SetAsBox(( (WIDTH-100) / SCALE), (70 / SCALE));
		var waterSensorBodyDef = new b2BodyDef;
		waterSensorBodyDef.type = b2Body.b2_staticBody;
		
		waterSensorFixture.isSensor = true;
		
		waterSensorBodyDef.position.x = WIDTH/2/SCALE;
		waterSensorBodyDef.position.y = 173/SCALE;
		
		waterSensor = this.world.CreateBody(waterSensorBodyDef);
		waterSensor.SetUserData({id: "waterSensor"});
		waterSensor.CreateFixture(waterSensorFixture);
		
		//topWall
		//////////////////////////////////////////////
		var topWallFixture = new b2FixtureDef;
		topWallFixture.density = 1;
		topWallFixture.restitution = 0;
		topWallFixture.friction = myFriction;
		topWallFixture.shape = new b2PolygonShape;
		topWallFixture.shape.SetAsBox((WIDTH / SCALE), (5 / SCALE));
		var topWallBodyDef = new b2BodyDef;
		topWallBodyDef.type = b2Body.b2_staticBody;
		
		topWallBodyDef.position.x = WIDTH/2/SCALE;
		topWallBodyDef.position.y = 5/SCALE;
		
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
		
		leftWallFixture.isSensor = true;
		
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

		rightWallFixture.isSensor = true;

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
		
		heroBodyDef.position.x = WIDTH/2/SCALE;
		heroBodyDef.position.y = (HEIGHT - 30)/SCALE;

		heroFixDef = new b2FixtureDef;
		heroFixDef.shape = new b2PolygonShape;
		heroFixDef.shape.SetAsBox((12 / SCALE), (25 / SCALE));
		//heroFixDef.shape = new b2CircleShape(0.5);

		heroFixDef.filter.groupIndex = -8;

		hero = this.world.CreateBody(heroBodyDef);
		hero.SetUserData({id: "hero"});
		hero.CreateFixture(heroFixDef);
		
		////console.log(hero);

		//wheel1.SetFixedRotation(false);
	}
		
	
	function spawnCar( width, speed, position , startPoint, carArray, carImageArray, img, x, y){	
		//car
		///////////////////////////////////////////////
		carFixDef = new b2FixtureDef;
		carFixDef.density = 1;
		carFixDef.restitution = 0;
		carFixDef.friction = 0;
		carFixDef.shape = new b2PolygonShape;
		carFixDef.shape.SetAsBox((width / SCALE), (20 / SCALE));
		
		//carFixDef.filter.groupIndex = -8;
		
		carBodyDef = new b2BodyDef;
		carBodyDef.type = b2Body.b2_dynamicBody;
		
		carBodyDef.position.x = (startPoint)/SCALE;
		carBodyDef.position.y = (HEIGHT - position)/SCALE;

		//carFixDef.isSensor = true;

		car = this.world.CreateBody(carBodyDef);
		car.SetUserData({id: "car", position: position});
		car.CreateFixture(carFixDef);
		
		car.SetLinearVelocity( new  b2Vec2(speed,0));
		
		index = carArray.length;
		
		//console.log("position " + position + " index " + index);
		
		carArray[index] = car;
		//////////////////////////////////////////////
		carImageArray[index] = new createjs.Bitmap("assets/level2/" + img);
		carImageArray[index].x = 250;
		carImageArray[index].y = 250;
		carImageArray[index].regX = x;
		carImageArray[index].regY = y;
		carImageArray[index].snapToPixel = true;
		carImageArray[index].mouseEnabled = false;
		
		stage.addChild(carImageArray[index]);
	} 
	
	function spawnBoat( width, speed, position , startPoint, boatArray, boatImageArray, img, x, y){	
		//boat
		///////////////////////////////////////////////
		boatFixDef = new b2FixtureDef;
		boatFixDef.density = 1;
		boatFixDef.restitution = 0;
		boatFixDef.friction = 0;
		boatFixDef.shape = new b2PolygonShape;
		boatFixDef.shape.SetAsBox((width / SCALE), (22/ SCALE));
		
		boatFixDef.isSensor = true;

		
		boatBodyDef = new b2BodyDef;
		boatBodyDef.type = b2Body.b2_dynamicBody;
		
		boatBodyDef.position.x = (startPoint)/SCALE;
		boatBodyDef.position.y = (HEIGHT - position)/SCALE;

		//boatFixDef.isSensor = true;

		boat = this.world.CreateBody(boatBodyDef);
		boat.SetUserData({id: "boat", position: position});
		boat.CreateFixture(boatFixDef);
		
		boat.SetLinearVelocity( new  b2Vec2(speed,0));
		
		index = boatArray.length;
		
		//console.log("position " + position + " index " + index);
		
		boatArray[index] = boat;
		//////////////////////////////////////////////
		boatImageArray[index] = new createjs.Bitmap("assets/level2/" + img);
		boatImageArray[index].x = 250;
		boatImageArray[index].y = 250;
		boatImageArray[index].regX = x;
		boatImageArray[index].regY = y;
		boatImageArray[index].snapToPixel = true;
		boatImageArray[index].mouseEnabled = false;
		
		stage.addChild(boatImageArray[index]);
	} 
	
	
	$(window).keydown(function(e) {
		if( window.localStorage.getItem("GAME_OVER") != "true" ){
			if(e.keyCode == 37){
				heroBMP.rotation = -90;
				hero.SetAngle(-90*(Math.PI/180));
				left();
				$.post(url, {'event':1, 'value': "left", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			}
			if(e.keyCode == 39){
				heroBMP.rotation = 0;
				hero.SetAngle(0*(Math.PI/180));
				heroBMP.rotation = 90;
				hero.SetAngle(90*(Math.PI/180));
				right();
				$.post(url, {'event':2, 'value': "right", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			}
			if(e.keyCode == 38){
				heroBMP.rotation = 0;
				hero.SetAngle(0*(Math.PI/180));
				up();
				$.post(url, {'event':3, 'value': "up", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			}
			if(e.keyCode == 40){
				heroBMP.rotation = 0;
				hero.SetAngle(0*(Math.PI/180));
				heroBMP.rotation = 180;
				hero.SetAngle(180*(Math.PI/180));
				down();
				$.post(url, {'event':4, 'value': "down", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			}
		}	
	});

	$(window).keyup(function(e) {
		if( window.localStorage.getItem("GAME_OVER") != "true" ){
			if(e.keyCode == 37){
				stop();
			}
			if(e.keyCode == 39){
				stop();
			}
			if(e.keyCode == 38){
				stopX();
			}
			if(e.keyCode == 40){
				stopX();
			}
		}	
	});
	
	//Control functions
	function up(){ 
		hero.ApplyImpulse(new b2Vec2(0, -10), hero.GetWorldCenter());
		//hero.SetLinearVelocity(new b2Vec2(hero.GetLinearVelocity().x, -10));
	}

	function down(){ 
		hero.ApplyImpulse(new b2Vec2(0, 10), hero.GetWorldCenter());
		//hero.SetLinearVelocity(new b2Vec2(hero.GetLinearVelocity().x, 10));
	}

	function left(){ 
		hero.ApplyImpulse(new b2Vec2(-10, 0), hero.GetWorldCenter());
		//hero.SetLinearVelocity(new b2Vec2(-10, hero.GetLinearVelocity().y));
	}

	function right(){ 
		hero.ApplyImpulse(new b2Vec2(10, 0), hero.GetWorldCenter());
		//hero.SetLinearVelocity(new b2Vec2(10, hero.GetLinearVelocity().y));
	}

	function stop(){
		if(beginContact > endContact){
			hero.SetLinearVelocity(new b2Vec2(0,0 ));
			hero.SetLinearVelocity(new b2Vec2(boatSpeed, hero.GetLinearVelocity().y ));
		} else {
			hero.SetLinearVelocity(new b2Vec2(0, hero.GetLinearVelocity().y ));
			//hero.SetLinearVelocity(new b2Vec2(hero.GetLinearVelocity().x, 0));
		}	
		
	}

	function stopX(){ 
		hero.SetLinearVelocity(new b2Vec2(hero.GetLinearVelocity().x, 0));
	}

	
	
	 
	 
	function tick(event){
		if( (window.localStorage.getItem("GAME_OVER") == "true") && (window.localStorage.getItem("GAME_OVER_CHECK") == "false") ){
			$("#gameover").show();
			if( $("#gameover").is(":visible") ){
				$.post(url, {'event':5, 'value': "GAMEOVER", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});	
			}
			//window.localStorage.setItem("GAME_OVER", "false");
			window.localStorage.setItem("GAME_OVER_CHECK", "true");
		}
		
		if(win){
			clearInterval(refreshIntervalId1);
			clearInterval(refreshIntervalId2);
			clearInterval(refreshIntervalId3);
			clearInterval(refreshIntervalId4);
			clearInterval(refreshIntervalId5);
			clearInterval(refreshIntervalId6);
			clearInterval(refreshIntervalId7);
			
			window.localStorage.setItem("gameLevel1END", false);
			window.localStorage.setItem("gameLevel2END", true);
			window.localStorage.setItem("gameLevel3END", false);
			
			if( window.localStorage.getItem("GAME_OVER") != "true" ){
				location.reload();
			} 
			return;
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
		
		/*birdBMP.rotation = hero.GetAngle()*(180/Math.PI);	
		birdBMP.x = hero.GetPosition().x*SCALE;
		birdBMP.y = hero.GetPosition().y*SCALE;	*/
		
		heroBMP.x = hero.GetPosition().x*SCALE;
		heroBMP.y = hero.GetPosition().y*SCALE;
				
		//CARS
		////////////////////////////////////////////////////////////////////////
		for(var i = 0; i < car1_list.length; i++){
			car1_list_IMG[i].rotation = car1_list[i].GetAngle()*(180/Math.PI);	
			car1_list_IMG[i].x = car1_list[i].GetPosition().x*SCALE;
			car1_list_IMG[i].y = car1_list[i].GetPosition().y*SCALE;	
		}
		
		for(var i = 0; i < car2_list.length; i++){
			car2_list_IMG[i].rotation = car2_list[i].GetAngle()*(180/Math.PI);	
			car2_list_IMG[i].x = car2_list[i].GetPosition().x*SCALE;
			car2_list_IMG[i].y = car2_list[i].GetPosition().y*SCALE;	
		}
		
		for(var i = 0; i < car3_list.length; i++){
			car3_list_IMG[i].rotation = car3_list[i].GetAngle()*(180/Math.PI);	
			car3_list_IMG[i].x = car3_list[i].GetPosition().x*SCALE;
			car3_list_IMG[i].y = car3_list[i].GetPosition().y*SCALE;	
		}
		
		for(var i = 0; i < car4_list.length; i++){
			car4_list_IMG[i].rotation = car4_list[i].GetAngle()*(180/Math.PI);	
			car4_list_IMG[i].x = car4_list[i].GetPosition().x*SCALE;
			car4_list_IMG[i].y = car4_list[i].GetPosition().y*SCALE;	
		}
		////////////////////////////////////////////////////////////////////////

		//BOATS
		////////////////////////////////////////////////////////////////////////
		for(var i = 0; i < boat1_list.length; i++){
			//boat1_list_IMG[i].rotation = boat1_list[i].GetAngle()*(180/Math.PI);	
			boat1_list_IMG[i].x = boat1_list[i].GetPosition().x*SCALE;
			boat1_list_IMG[i].y = boat1_list[i].GetPosition().y*SCALE;	
		}
		
		for(var i = 0; i < boat2_list.length; i++){
			//boat2_list_IMG[i].rotation = boat2_list[i].GetAngle()*(180/Math.PI);	
			boat2_list_IMG[i].x = boat2_list[i].GetPosition().x*SCALE;
			boat2_list_IMG[i].y = boat2_list[i].GetPosition().y*SCALE;	
		}
		
		for(var i = 0; i < boat3_list.length; i++){
			//boat3_list_IMG[i].rotation = boat3_list[i].GetAngle()*(180/Math.PI);	
			boat3_list_IMG[i].x = boat3_list[i].GetPosition().x*SCALE;
			boat3_list_IMG[i].y = boat3_list[i].GetPosition().y*SCALE;	
		}
		////////////////////////////////////////////////////////////////////////

		if(waterEndContact){
			stop();
		} else if( (beginContact > 0) && (beginContact == endContact) ){
			destroy_list.push( hero );
			if( window.localStorage.getItem("GAME_OVER") != "true" ){
				window.location.reload();
			} 
			//TODO take life
			//set localStorage hero int coordinates to default overiding poissible data from DB from prev game 
		}
		
		
		
		if( (hero.GetPosition().x <= 0.5 ) || (hero.GetPosition().x >= 30)){
			destroy_list.push( hero );
			if( window.localStorage.getItem("GAME_OVER") != "true" ){
				window.location.reload();
			} 
			//TODO take life
			//set localStorage hero int coordinates to default overiding poissible data from DB from prev game 
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

	init();
	

	
	//CARS
	var timer = 500;
	//spawnCar( width, speed, position , startPoint, carArray, carImageArray, img, x, y)
	setTimeout(function(){
		spawnCar(60, -3, 100, WIDTH, car1_list, car1_list_IMG, "truck2.png", 65, 22);
	}, timer);
	var refreshIntervalId1 = setInterval(function(){
		spawnCar(60, -3, 100, WIDTH, car1_list, car1_list_IMG, "truck2.png", 65, 22);
	}, 3000);
	
	
	setTimeout(function(){
		spawnCar(80, 4, 150, 0, car2_list, car2_list_IMG, "truck3.png", 82, 22);
	}, timer);
	var refreshIntervalId2 = setInterval(function(){
		spawnCar(80, 4, 150, 0, car2_list, car2_list_IMG, "truck3.png", 82, 22);
	}, 5000);
	
	
	setTimeout(function(){
		spawnCar(30, -6, 200, WIDTH, car3_list, car3_list_IMG, "car1.png", 33, 19);
	}, timer);
	var refreshIntervalId3 = setInterval(function(){
		spawnCar(30, -6, 200, WIDTH, car3_list, car3_list_IMG, "car1.png", 33, 19);
	}, 4000);
	

	setTimeout(function(){
		spawnCar(96, 5, 250, 0, car4_list, car4_list_IMG, "truck1.png", 96, 25);
	}, timer);
	var refreshIntervalId4 = setInterval(function(){
		spawnCar(96, 5, 250, 0, car4_list, car4_list_IMG, "truck1.png", 96, 25);
	}, 2500);
	
	//BOATS
	
	setTimeout(function(){
		spawnBoat(70, -2, 375, WIDTH, boat1_list, boat1_list_IMG, "boat3.png", 80, 23);
	}, timer);
	var refreshIntervalId5 = setInterval(function(){
		spawnBoat(70, -2, 375, WIDTH, boat1_list, boat1_list_IMG, "boat3.png", 80, 23);
	}, 3500);
	
	
	setTimeout(function(){
		spawnBoat(40, 2, 425, 0, boat2_list, boat2_list_IMG, "ship1.png", 40, 21.5);
	}, timer);
	var refreshIntervalId6 = setInterval(function(){
		spawnBoat(40, 2, 425, 0, boat2_list, boat2_list_IMG, "ship1.png", 40, 21.5);
	}, 2500);
	
	
	setTimeout(function(){
		spawnBoat(50, -4, 475, WIDTH, boat3_list, boat3_list_IMG, "boat2.png", 60, 23);
	}, timer);
	var refreshIntervalId7 = setInterval(function(){
		spawnBoat(50, -4, 475, WIDTH, boat3_list, boat3_list_IMG, "boat2.png", 60, 23);
	}, 4000);


	var listener = new Box2D.Dynamics.b2ContactListener;

	listener.BeginContact = function(contact) {
		if (contact.GetFixtureA().GetBody().GetUserData() != null && contact.GetFixtureB().GetBody().GetUserData() != null) {
			if (contact.GetFixtureA().GetBody().GetUserData().id == "hero" && contact.GetFixtureB().GetBody().GetUserData().id == "boat") {
				contact.GetFixtureA().GetBody().SetLinearVelocity( new b2Vec2(contact.GetFixtureB().GetBody().GetLinearVelocity().x, 0));
				beginContact++; 
				//console.log("Boat Contact " + beginContact);
				boatSpeed = contact.GetFixtureB().GetBody().GetLinearVelocity().x;
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "boat" && contact.GetFixtureB().GetBody().GetUserData().id == "hero" ) {
				contact.GetFixtureB().GetBody().SetLinearVelocity( new b2Vec2(contact.GetFixtureA().GetBody().GetLinearVelocity().x, 0));
				beginContact++; 
				//console.log("Boat Contact " + beginContact);
				boatSpeed = contact.GetFixtureA().GetBody().GetLinearVelocity().x;
			}
			
			
			
			
			if (contact.GetFixtureA().GetBody().GetUserData().id == "hero" && contact.GetFixtureB().GetBody().GetUserData().id == "waterSensor" && ( (beginContact - endContact) <= 0 ) ) {
				inContact = true;
				destroy_list.push(contact.GetFixtureA().GetBody());
				setLife(1000);
				//TODO take life
				//set localStorage hero int coordinates to default overiding poissible data from DB from prev game 
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "waterSensor" && contact.GetFixtureB().GetBody().GetUserData().id == "hero" && ( (beginContact - endContact) <= 0 ) ) {
				inContact = true;
				destroy_list.push(contact.GetFixtureB().GetBody());
				setLife(1000);
				//TODO take life
				//set localStorage hero int coordinates to default overiding poissible data from DB from prev game 
			}
			
			
			
			
			
			
			
			
			
			
			
			
			/////////////////////////////////////////////////////////////	
			if (contact.GetFixtureA().GetBody().GetUserData().id == "hero" && contact.GetFixtureB().GetBody().GetUserData().id == "car"  ) {
				setLife(1000);
				//TODO take life
				//set localStorage hero int coordinates to default overiding poissible data from DB from prev game 
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "car" && contact.GetFixtureB().GetBody().GetUserData().id == "hero"  ) {
				setLife(1000);
				//TODO take life
				//set localStorage hero int coordinates to default overiding poissible data from DB from prev game 
			}
		}
	}
	
	function checkCarArrays(object){
		if(object.position == "100"){
			car1_list.splice(0, 1);
			car1_list_IMG.splice(0, 1);
		}  else if (object.position == "150"){
			car2_list.splice(0, 1);
			car2_list_IMG.splice(0, 1);
		} else if (object.position == "200"){
			car3_list.splice(0, 1);
			car3_list_IMG.splice(0, 1);
		} else if (object.position == "250"){
			car4_list.splice(0, 1);
			car4_list_IMG.splice(0, 1);
		}	
	}
	
	function checkBoatsArrays(object){
		if(object.position == "375"){
			boat1_list.splice(0, 1);
			boat1_list_IMG.splice(0, 1);
		}  else if (object.position == "425"){
			boat2_list.splice(0, 1);
			boat2_list_IMG.splice(0, 1);
		} else if (object.position == "475"){
			boat3_list.splice(0, 1);
			boat3_list_IMG.splice(0, 1);
		} 	
	}

	listener.EndContact = function(contact) {
		if (contact.GetFixtureA().GetBody().GetUserData() != null && contact.GetFixtureB().GetBody().GetUserData() != null) {
			//Car
			if (contact.GetFixtureA().GetBody().GetUserData().id == "car" && contact.GetFixtureB().GetBody().GetUserData().id == "rightWall" && contact.GetFixtureA().GetBody().GetLinearVelocity().x > 0) {
				checkCarArrays(contact.GetFixtureA().GetBody().GetUserData());	
				destroy_list.push(contact.GetFixtureA().GetBody());
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "rightWall" && contact.GetFixtureB().GetBody().GetUserData().id == "car" && contact.GetFixtureB().GetBody().GetLinearVelocity().x > 0) {
				checkCarArrays(contact.GetFixtureB().GetBody().GetUserData());		
				destroy_list.push(contact.GetFixtureB().GetBody());
			}
		
			if (contact.GetFixtureA().GetBody().GetUserData().id == "car" && contact.GetFixtureB().GetBody().GetUserData().id == "leftWall" && contact.GetFixtureA().GetBody().GetLinearVelocity().x < 0) {
				checkCarArrays(contact.GetFixtureA().GetBody().GetUserData());	
				destroy_list.push(contact.GetFixtureA().GetBody());
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "leftWall" && contact.GetFixtureB().GetBody().GetUserData().id == "car" && contact.GetFixtureB().GetBody().GetLinearVelocity().x < 0) {
				checkCarArrays(contact.GetFixtureB().GetBody().GetUserData());	
				destroy_list.push(contact.GetFixtureB().GetBody());
			}		
			
			//Boat
			if (contact.GetFixtureA().GetBody().GetUserData().id == "boat" && contact.GetFixtureB().GetBody().GetUserData().id == "rightWall" && contact.GetFixtureA().GetBody().GetLinearVelocity().x > 0) {
				checkBoatsArrays(contact.GetFixtureA().GetBody().GetUserData());	
				destroy_list.push(contact.GetFixtureA().GetBody());
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "rightWall" && contact.GetFixtureB().GetBody().GetUserData().id == "boat" && contact.GetFixtureB().GetBody().GetLinearVelocity().x > 0) {
				checkBoatsArrays(contact.GetFixtureB().GetBody().GetUserData());
				destroy_list.push(contact.GetFixtureB().GetBody());
			}

			if (contact.GetFixtureA().GetBody().GetUserData().id == "boat" && contact.GetFixtureB().GetBody().GetUserData().id == "leftWall" && contact.GetFixtureA().GetBody().GetLinearVelocity().x < 0) {
				checkBoatsArrays(contact.GetFixtureA().GetBody().GetUserData());	
				destroy_list.push(contact.GetFixtureA().GetBody());
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "leftWall" && contact.GetFixtureB().GetBody().GetUserData().id == "boat" && contact.GetFixtureB().GetBody().GetLinearVelocity().x < 0) {
				checkBoatsArrays(contact.GetFixtureB().GetBody().GetUserData());
				destroy_list.push(contact.GetFixtureB().GetBody());
			}		
			////////////////////////////////////////////////////////////////////////////////////////////////////
			
			if (contact.GetFixtureA().GetBody().GetUserData().id == "hero" && contact.GetFixtureB().GetBody().GetUserData().id == "boat") {
				endContact++;
				//console.log("Boat END Contact " + endContact);
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "boat" && contact.GetFixtureB().GetBody().GetUserData().id == "hero" ) {
				endContact++;
				//console.log("Boat END Contact " + endContact);
			}
			
			if (contact.GetFixtureA().GetBody().GetUserData().id == "hero" && contact.GetFixtureB().GetBody().GetUserData().id == "waterSensor" && (!inContact) ) {
				//contact.GetFixtureA().GetBody().SetLinearVelocity( new b2Vec2(contact.GetFixtureB().GetBody().GetLinearVelocity().x, 0));
				//console.log("Water END Contact");
				waterEndContact = true;
				win = true;
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "waterSensor" && contact.GetFixtureB().GetBody().GetUserData().id == "hero" && (!inContact) ) {
				//contact.GetFixtureB().GetBody().SetLinearVelocity( new b2Vec2(contact.GetFixtureA().GetBody().GetLinearVelocity().x, 0));
				//console.log("Water END Contact");
				waterEndContact = true;
				win = true;
			}
			
		}
	}

	this.world.SetContactListener(listener);
		
}	
