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


var world = new b2World(new b2Vec2(0, 9.81), false);

 var url = 'http://localhost/10005983a1/php/setevent.php';

//localStorage
///////////////////////////////////////////
function setScreenStats(currentHelth, currentLifes){	
	var percent = Math.floor((currentHelth/10));
	
	$("#count").text(percent + "% + " + currentLifes + "x");
}

setScreenStats( parseInt(window.localStorage.getItem("lifePercent")),  parseInt(window.localStorage.getItem("life")) );

function setLife(pointsTaken){
	var currentLifes = parseInt(window.localStorage.getItem("life"));
	
	var currentHelth = parseInt(window.localStorage.getItem("lifePercent"));
	var newHealthPoints = currentHelth - pointsTaken;
	
	console.log("currentLifes " + currentLifes);
	console.log("currentHelth " + currentHelth);
	console.log("newHealthPoints " + newHealthPoints);
	console.log();
	
	if(newHealthPoints <= 0){
		currentLifes = currentLifes - 1;
		window.localStorage.setItem("lifePercent", "1000");
		window.localStorage.setItem("life", currentLifes);
		setScreenStats(1000, currentLifes);
		if(currentLifes <= -1){
			window.localStorage.setItem("lifePercent", "0");
			window.localStorage.setItem("life", "0");
			setScreenStats(0, 0);
			window.localStorage.setItem("GAME_OVER", "true");
			console.log("Game Over");
			//window.location.reload();
		} else {
			window.location.reload();
		}
	} else {
		window.localStorage.setItem("lifePercent", newHealthPoints);
		setScreenStats(newHealthPoints, currentLifes);
	}
}

///////////////////////////////////////////

function playLevel1(){
	/*var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2MassData = Box2D.Collision.Shapes.b2MassData;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;*/

	var circlesLeft = [];
	var circlesRight = [];
	var circleFixture = [];
	var box2dCanvas, box2dContext;
	var world;
	var SCALE = 30;
	var WIDTH = 900;
	var HEIGHT = 600;
	var passedLeft = false;
	var destroy_list = [];

	var STEP = 60;
	var TIMESTEP = 1/STEP;

	var easleCanvas, easelContext, box2dCanvas, box2dContext;
	var lastTimestamp = Date.now();
	var fixedTimestepAccumulator;
	var grant, grantb2w, deltaS;
	//var world;

	var stageOUT;

	var angel, daisy, leftWall, rightWall, floor, box, slide, point, carRight, carLeft, base, wheel2, wheel1, sensor, sensorJump;

	var pointRemoved = false;
	
	var frontWheelPassed = false;
	var backWheelPassed = false;
	
	

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
					{src: "ground1.png", id: "ground"},
					{src: "base.png", id: "base"},
					{src: "back.png", id: "back"},
					{src: "front.png", id: "front"},
					{src: "leftWall.png", id: "leftWall"},
					{src: "rightWall.png", id: "rightWall"},
					{src: "bird.png", id: "bird"},
					{src: "wheel.png", id: "wheel"},
					{src: "daisyspreadsheet.png", id: "daisy"},
					{src: "sun.png", id: "sun"},
					{src: "oliviaspritesheet.png", id: "olivia"},
					{src: "bg.png", id: "bg"}
		];

		loader = new createjs.LoadQueue(false);
		loader.addEventListener("complete", handleComplete);
		loader.loadManifest(manifest, true, "assets/level1/");
		
		//world = new b2World(new b2Vec2(0, 9.81), false);

		var debugDraw = new b2DebugDraw();
		debugDraw.SetSprite(box2dContext);
		debugDraw.SetDrawScale(SCALE);
		debugDraw.SetFillAlpha(0.3);
		debugDraw.SetLineThickness(1.0);
		debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
		this.world.SetDebugDraw(debugDraw);
	}	

	function handleComplete(){
		background = new createjs.Shape();
		background.graphics.beginBitmapFill(loader.getResult("bg")).drawRect(0,0,w,h);
		
		var groundImg = loader.getResult("ground");
		ground = new createjs.Shape();
		ground.graphics.beginBitmapFill(groundImg).drawRect(0,21,w + groundImg.width, h + groundImg.height);
		ground.tileW = groundImg.width;
		ground.y = h - groundImg.height;

		birdBMP = new createjs.Bitmap(loader.getResult("bird"));
		birdBMP.x = 250;
		birdBMP.y = 250;
		birdBMP.regX = 25;
		birdBMP.regY = 34;
		birdBMP.snapToPixel = true;
		birdBMP.mouseEnabled = false;

		birdBMP1 = new createjs.Bitmap(loader.getResult("bird"));
		birdBMP1.x = 250;
		birdBMP1.y = 250;
		birdBMP1.regX = 25;
		birdBMP1.regY = 34;
		birdBMP1.snapToPixel = true;
		birdBMP1.mouseEnabled = false;
		
		wheelBMP = new createjs.Bitmap(loader.getResult("wheel"));
		wheelBMP.x = 150;
		wheelBMP.y = 150;
		wheelBMP.regX = 18;
		wheelBMP.regY = 18;
		wheelBMP.snapToPixel = true;
		wheelBMP.mouseEnabled = false;
		
		wheelBMP1 = new createjs.Bitmap(loader.getResult("wheel"));
		wheelBMP1.x = 150;
		wheelBMP1.y = 150;
		wheelBMP1.regX = 18;
		wheelBMP1.regY = 18;
		wheelBMP1.snapToPixel = true;
		wheelBMP1.mouseEnabled = false;
		
		sunBMP1 = new createjs.Bitmap(loader.getResult("sun"));
		sunBMP1.x = 150;
		sunBMP1.y = 150;
		sunBMP1.regX = 35;
		sunBMP1.regY = 35;
		sunBMP1.snapToPixel = true;
		sunBMP1.mouseEnabled = false;
		
		baseBMP = new createjs.Bitmap(loader.getResult("base"));
		baseBMP.x = 150;
		baseBMP.y = 150;
		baseBMP.regX = 25;
		baseBMP.regY = -1;
		baseBMP.snapToPixel = true;
		baseBMP.mouseEnabled = false;
		
		backBMP = new createjs.Bitmap(loader.getResult("back"));
		backBMP.x = 150;
		backBMP.y = 150;
		backBMP.regX = 8;
		backBMP.regY = 30;
		backBMP.snapToPixel = true;
		backBMP.mouseEnabled = false;
		
		frontBMP = new createjs.Bitmap(loader.getResult("front"));
		frontBMP.x = 150;
		frontBMP.y = 150;
		frontBMP.regX = 10;
		frontBMP.regY = 30;
		frontBMP.snapToPixel = true;
		frontBMP.mouseEnabled = false;
		
		leftWallBMP = new createjs.Bitmap(loader.getResult("leftWall"));
		leftWallBMP.rotation = (0) *(180/Math.PI);
		leftWallBMP.x = 443;
		leftWallBMP.y = 462;
		leftWallBMP.regX = 0;
		leftWallBMP.regY = 0;
		leftWallBMP.snapToPixel = true;
		leftWallBMP.mouseEnabled = false;
		
		rightWallBMP = new createjs.Bitmap(loader.getResult("rightWall"));
		rightWallBMP.x = 661;
		rightWallBMP.y = 462;
		rightWallBMP.regX = 0;
		rightWallBMP.regY = 0;
		rightWallBMP.snapToPixel = true;
		rightWallBMP.mouseEnabled = false;



		stage.addChild(background, rightWallBMP, ground, wheelBMP, wheelBMP1, sunBMP1, baseBMP, backBMP, frontBMP);
		
		var spriteSheet = new createjs.SpriteSheet({
			framerate: 7,
			"images": [loader.getResult("daisy")],
			"frames": {"regX": 34, "height": 64, "count": 16, "regY": 35, "width": 80},
			"animations": {
					"stand": [8, 11, "stand", 1],
					"run": [8, 11, "run", 1.5],
					"jump": [5, 8, "stand"]
			}
		});
		
		grant = new createjs.Sprite(spriteSheet, "stand");
		grant.snapToPixel = true;
		
		stage.addChild(grant);
		
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
		
		grant1 = new createjs.Sprite(spriteSheet, "stand");
		grant1.snapToPixel = true;
		
		stage.addChild(grant1);
		
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

		//floor
		//////////////////////////////////////////////
		var floorFixture = new b2FixtureDef;
		floorFixture.density = 1;
		floorFixture.restitution = 0;
		floorFixture.friction = myFriction;
		floorFixture.shape = new b2PolygonShape;
		floorFixture.shape.SetAsBox((WIDTH / SCALE), (10 / SCALE));
		var floorBodyDef = new b2BodyDef;
		floorBodyDef.type = b2Body.b2_staticBody;
		floorBodyDef.position.x = WIDTH/2/SCALE;
		floorBodyDef.position.y = (HEIGHT-10)/SCALE;
		
		floor = this.world.CreateBody(floorBodyDef);
		floor.SetUserData({id: "floor"});
		floor.CreateFixture(floorFixture);
		
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

		//box
		//////////////////////////////////////////////
		var boxFixture = new b2FixtureDef;
		boxFixture.density = 1;
		boxFixture.restitution = 0;
		boxFixture.friction = myFriction;
		boxFixture.shape = new b2PolygonShape;
		boxFixture.shape.SetAsBox((100 / SCALE), (HEIGHT/12 / SCALE));
		var boxBodyDef = new b2BodyDef;
		boxBodyDef.type = b2Body.b2_staticBody;
		boxBodyDef.position.x = 100/SCALE;
		boxBodyDef.position.y = (HEIGHT/1.13)/SCALE;

		box = this.world.CreateBody(boxBodyDef);
		box.SetUserData({id: "box"});
		box.CreateFixture(boxFixture);

		//slide
		//////////////////////////////////////////////
		var slideFixture = new b2FixtureDef;
		slideFixture.density = 1;
		slideFixture.restitution = 0;
		slideFixture.friction = myFriction;
		slideFixture.shape = new b2PolygonShape;
		slideFixture.shape.SetAsBox((5 / SCALE), (HEIGHT/3.4 / SCALE));
		var slideBodyDef = new b2BodyDef;
		slideBodyDef.type = b2Body.b2_staticBody;
		slideBodyDef.position.x = 365/SCALE;
		slideBodyDef.position.y = (HEIGHT/1.12)/SCALE;

		slideBodyDef.angle = -1.283;

		slide = this.world.CreateBody(slideBodyDef);
		slide.SetUserData({id: "slide"});
		slide.CreateFixture(slideFixture);

		//acceleration sensor
		//////////////////////////////////////////////
		var sensorFixture = new b2FixtureDef;
		sensorFixture.density = 1;
		sensorFixture.restitution = 0;
		sensorFixture.friction = 0;
		sensorFixture.shape = new b2PolygonShape;
		sensorFixture.shape.SetAsBox((1 / SCALE), (1/ SCALE));
		var sensorBodyDef = new b2BodyDef;
		sensorBodyDef.type = b2Body.b2_staticBody;
		sensorBodyDef.position.x = 290/SCALE;
		sensorBodyDef.position.y = (HEIGHT-110)/SCALE;

		sensorFixture.isSensor = true;

		sensorBodyDef.angle = -1.283;

		sensor = this.world.CreateBody(sensorBodyDef);
		sensor.SetUserData({id: "sensor"});
		sensor.CreateFixture(sensorFixture);
		
		//asensorJump
		//////////////////////////////////////////////
		var ssensorJumpFixture = new b2FixtureDef;
		ssensorJumpFixture.density = 1;
		ssensorJumpFixture.restitution = 0;
		ssensorJumpFixture.friction = 0;
		ssensorJumpFixture.shape = new b2PolygonShape;
		ssensorJumpFixture.shape.SetAsBox((1 / SCALE), (1/ SCALE));
		var sensorJumpBodyDef = new b2BodyDef;
		sensorJumpBodyDef.type = b2Body.b2_staticBody;
		sensorJumpBodyDef.position.x = 810/SCALE;
		sensorJumpBodyDef.position.y = (HEIGHT-205)/SCALE;

		ssensorJumpFixture.isSensor = true;

		sensorJump = this.world.CreateBody(sensorJumpBodyDef);
		sensorJump.SetUserData({id: "sensorJump"});
		sensorJump.CreateFixture(ssensorJumpFixture);


		//wheel1
		////////////////////////////////////////////////
		wheel1BodyDef = new b2BodyDef;
		wheel1BodyDef.type = b2Body.b2_dynamicBody;
		wheel1BodyDef.position.x = 170/SCALE;
		wheel1BodyDef.position.y = (HEIGHT-135)/SCALE;

		wheel1BodyDef.density = 1;
		wheel1BodyDef.friction = 0;
		wheel1BodyDef.restitution = 0;

		wheel1FixDef = new b2FixtureDef;
		wheel1FixDef.shape = new b2CircleShape(0.5);

		wheel1FixDef.filter.groupIndex = -8;

		wheel1 = this.world.CreateBody(wheel1BodyDef);
		wheel1.SetUserData({id: "wheel1"});
		wheel1.CreateFixture(wheel1FixDef);

		//wheel1.SetFixedRotation(false);


		//wheel2
		////////////////////////////////////////////////
		wheel2BodyDef = new b2BodyDef;
		wheel2BodyDef.type = b2Body.b2_dynamicBody;
		wheel2BodyDef.position.x = 100/SCALE;
		wheel2BodyDef.position.y = (HEIGHT-135)/SCALE;

		wheel2BodyDef.density = 1;
		wheel2BodyDef.friction = 0;
		wheel2BodyDef.restitution = 0;

		wheel2FixDef = new b2FixtureDef;
		wheel2FixDef.shape = new b2CircleShape(0.5);

		wheel2FixDef.filter.groupIndex = -8;

		wheel2 = this.world.CreateBody(wheel2BodyDef);
		wheel2.SetUserData({id: "wheel2"});
		wheel2.CreateFixture(wheel2FixDef);

		//wheel2.SetFixedRotation(false);

		//wheel2.SetLinearVelocity(new b2Vec2(5, 0));


		//car base
		////////////////////////////////////////////////
		var baseFixture = new b2FixtureDef;
		baseFixture.density = 1;
		baseFixture.restitution = 0;
		baseFixture.friction = 0;
		baseFixture.shape = new b2PolygonShape;
		baseFixture.shape.SetAsBox((35 / SCALE), (2/ SCALE));
		var baseBodyDef = new b2BodyDef;
		baseBodyDef.type = b2Body.b2_dynamicBody;
		baseBodyDef.position.x = 135/SCALE;
		baseBodyDef.position.y = (HEIGHT-135)/SCALE;

		base = this.world.CreateBody(baseBodyDef);
		base.SetUserData({id: "base"});
		base.CreateFixture(baseFixture);

		//car left wall
		////////////////////////////////////////////////
		var carLeftFixture = new b2FixtureDef;
		carLeftFixture.density = 1;
		carLeftFixture.restitution = 0;
		carLeftFixture.friction = 1;
		carLeftFixture.shape = new b2PolygonShape;
		carLeftFixture.shape.SetAsBox((2 / SCALE), (20/ SCALE));
		var carLeftBodyDef = new b2BodyDef;
		carLeftBodyDef.type = b2Body.b2_dynamicBody;
		carLeftBodyDef.position.x = 100/SCALE;
		carLeftBodyDef.position.y = (HEIGHT-155)/SCALE;

		carLeft = this.world.CreateBody(carLeftBodyDef);
		carLeft.SetUserData({id: "carLeft"});
		carLeft.CreateFixture(carLeftFixture);

		//car right wall
		////////////////////////////////////////////////
		var carRightFixture = new b2FixtureDef;
		carRightFixture.density = 1;
		carRightFixture.restitution = 0;
		carRightFixture.friction = 1;
		carRightFixture.shape = new b2PolygonShape;
		carRightFixture.shape.SetAsBox((2 / SCALE), (20/ SCALE));
		var carRightBodyDef = new b2BodyDef;
		carRightBodyDef.type = b2Body.b2_dynamicBody;
		carRightBodyDef.position.x = 170/SCALE;
		carRightBodyDef.position.y = (HEIGHT-155)/SCALE;

		carRight = this.world.CreateBody(carRightBodyDef);
		carRight.SetUserData({id: "carRight"});
		carRight.CreateFixture(carRightFixture);

		//point
		////////////////////////////////////////////////
		pointBodyDef = new b2BodyDef;
		pointBodyDef.type = b2Body.b2_staticBody;
		pointBodyDef.position.x = 650/SCALE + (200/SCALE *  Math.cos(2*Math.PI*75/100));
		pointBodyDef.position.y = (396/SCALE + (200/SCALE *  Math.sin(2*Math.PI*75/100))) + 30/SCALE;

		pointBodyDef.density = 1;
		pointBodyDef.friction = 0;
		pointBodyDef.restitution = 0;

		pointFixDef = new b2FixtureDef;
		pointFixDef.shape = new b2CircleShape(0.8);

		pointFixDef.isSensor = true;

		point = this.world.CreateBody(pointBodyDef);
		point.SetUserData({id: "point"});
		point.CreateFixture(pointFixDef);

		//angel
		////////////////////////////////////////////////
		angelBodyDef = new b2BodyDef;
		angelBodyDef.type = b2Body.b2_dynamicBody;
		angelBodyDef.position.x = 50/SCALE;
		angelBodyDef.position.y = (HEIGHT-137)/SCALE;

		angelBodyDef.density = 1;
		angelBodyDef.friction = 10;
		angelBodyDef.restitution = 0;

		angelFixDef = new b2FixtureDef;
		angelFixDef.shape = new b2CircleShape(0.8);

		angel = this.world.CreateBody(angelBodyDef);
		angel.SetUserData({id: "angel"});
		angel.CreateFixture(angelFixDef);

		//daisy
		////////////////////////////////////////////////
		daisyBodyDef = new b2BodyDef;
		daisyBodyDef.type = b2Body.b2_dynamicBody;

		daisyBodyDef.position.x = 135/SCALE;
		daisyBodyDef.position.y = (HEIGHT-162)/SCALE;

		daisyBodyDef.density = 0;
		daisyBodyDef.friction = 0;
		daisyBodyDef.restitution = 0;

		daisyFixDef = new b2FixtureDef;
		daisyFixDef.shape = new b2CircleShape(0.8);

		daisyFixDef.filter.groupIndex = -8;

		daisy = this.world.CreateBody(daisyBodyDef);
		daisy.SetUserData({id: "daisy"});
		daisy.CreateFixture(daisyFixDef);

		//joint
		////////////////////////////////////////////////
		/*def = new Box2D.Dynamics.Joints.b2DistanceJointDef();
		def.Initialize(wheel1, wheel2, wheel1.GetWorldCenter(), wheel2.GetWorldCenter());
		var joint = world.CreateJoint(def);*/

		def1 = new Box2D.Dynamics.Joints.b2DistanceJointDef();
		def1.Initialize(base, wheel1,new b2Vec2( (wheel1.GetPosition().x - (0.3/SCALE)) , wheel1.GetPosition().y), wheel1.GetWorldCenter());
		var joint1 = this.world.CreateJoint(def1);

		def2 = new Box2D.Dynamics.Joints.b2DistanceJointDef();
		def2.Initialize(base, wheel2, new b2Vec2( (wheel2.GetPosition().x - (0.3/SCALE)) , wheel2.GetPosition().y), wheel2.GetWorldCenter());
		var joint2 =this.world.CreateJoint(def2);

		var joint = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
		joint.Initialize(carLeft, wheel2,  wheel2.GetWorldCenter());
		RevJoint = this.world.CreateJoint(joint);

		var joint1 = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
		joint1.Initialize(carLeft, base,  base.GetWorldCenter());
		RevJoint1 = this.world.CreateJoint(joint1);

		var joint2 = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
		joint2.Initialize(carRight, wheel1,  wheel1.GetWorldCenter());
		RevJoint2 = this.world.CreateJoint(joint2);

		var joint3 = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
		joint3.Initialize(carRight, base,  base.GetWorldCenter());
		RevJoint3 = this.world.CreateJoint(joint3);

		/*var joint4 = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
		joint4.Initialize(daisy, base,  base.GetWorldCenter());
		RevJoint4 = world.CreateJoint(joint4);*/

		def = new Box2D.Dynamics.Joints.b2DistanceJointDef();
		def.Initialize(daisy, base, daisy.GetWorldCenter(), base.GetWorldCenter());
		var joint = this.world.CreateJoint(def);








		var x0 = 650/SCALE;
		var y0 = 396/SCALE;
		var r = 200/SCALE;
		var items = 100;


		for (var i = 0; i < items; i++) {
			if( (i >= 62) && (i <= 88) ){
				continue;
			}	
			
			var x = x0 + r * Math.cos(2*Math.PI*i/items);
			var y = y0 + r * Math.sin(2*Math.PI*i/items);
			circleFixture[i] = new b2FixtureDef;
			circleFixture[i].density = 1;
			circleFixture[i].restitution = 0;
			circleFixture[i].friction = 0;
			var circleBodyDef = new b2BodyDef;
			circleBodyDef.type = b2Body.b2_staticBody;
			circleFixture[i].shape = new b2CircleShape(0.5);
			circleBodyDef.position.x = x;
			circleBodyDef.position.y = y;
			if (y*SCALE > 430 && x*SCALE < (x0*SCALE - 10)) {
				circleFixture[i].isSensor = true;
				circle = this.world.CreateBody(circleBodyDef);
				circle.SetUserData({id: "leftcircle"});
				circle.CreateFixture(circleFixture[i]);
				circlesLeft.push(circle);
			} else if (y*SCALE > 430 && x*SCALE >= (x0*SCALE - 10)) { 
				circle = this.world.CreateBody(circleBodyDef);
				circle.SetUserData({id: "rightcircle"});
				circle.CreateFixture(circleFixture[i]);
				circlesRight.push(circle);
			} else {
				circle = this.world.CreateBody(circleBodyDef);
				circle.CreateFixture(circleFixture[i]);
			}
		}

	}


	function tick(event){	
		if(window.localStorage.getItem("GAME_OVER") == "true"){
			$.post(url, {'event':5, 'value': "GAMEOVER", 'x':  hero.GetPosition().x, 'y':  hero.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			$("#gameover").show();
			//window.localStorage.setItem("GAME_OVER", "false");
		}

		if(	(frontWheelPassed == true) && (backWheelPassed == true) ){
			window.localStorage.setItem("gameLevel1END", true);
			window.localStorage.setItem("gameLevel2END", false);
			window.localStorage.setItem("gameLevel3END", false);
			
			if( window.localStorage.getItem("GAME_OVER") != "true" ){
				location.reload();
			} 
			
			if( pointRemoved ){
				window.localStorage.setItem("gameSTATSLevel1Bonus", "true");
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
		
		grant1.rotation = daisy.GetAngle()*(180/Math.PI);
		grant1.x = daisy.GetPosition().x*SCALE;
		grant1.y = daisy.GetPosition().y*SCALE;
		
		grant.x = angel.GetPosition().x*SCALE;
		grant.y = angel.GetPosition().y*SCALE;	
		
		wheelBMP.rotation = wheel1.GetAngle()*(180/Math.PI);
		wheelBMP.x = wheel1.GetPosition().x*SCALE;
		wheelBMP.y = wheel1.GetPosition().y*SCALE;
		
		wheelBMP1.rotation = wheel2.GetAngle()*(180/Math.PI);
		wheelBMP1.x = wheel2.GetPosition().x*SCALE;
		wheelBMP1.y = wheel2.GetPosition().y*SCALE;
		
		sunBMP1.x = point.GetPosition().x*SCALE;
		sunBMP1.y = point.GetPosition().y*SCALE;
			if(pointRemoved){
				stageOUT.removeChild(sunBMP1);
			}
		
		baseBMP.rotation = base.GetAngle()*(180/Math.PI);	
		baseBMP.x = base.GetPosition().x*SCALE;
		baseBMP.y = base.GetPosition().y*SCALE;	
		
		backBMP.rotation = carLeft.GetAngle()*(180/Math.PI);	
		backBMP.x = carLeft.GetPosition().x*SCALE;
		backBMP.y = carLeft.GetPosition().y*SCALE;	
		
		frontBMP.rotation = carRight.GetAngle()*(180/Math.PI);	
		frontBMP.x = carRight.GetPosition().x*SCALE;
		frontBMP.y = carRight.GetPosition().y*SCALE;	
			
		this.world.ClearForces();
		this.world.m_debugDraw.m_sprite.graphics.clear();
		this.world.DrawDebugData();
		
		for (var i in destroy_list) {
			this.world.DestroyBody(destroy_list[i]);
		}
		//Reset the array
		destroy_list.length = 0;

		vX = wheel1.GetPosition().x*SCALE;
		vY = wheel1.GetPosition().y*SCALE;
			//console.log(vX + " - " + vY)
		if (vX > 600 && passedLeft == true && vY < 400) {
			for (var i = 0; i < circlesLeft.length; i++) {
				circlesLeft[i].GetFixtureList().SetSensor(false);
			}
			//console.log(circlesRight.length);
			for (var j = 0; j < circlesRight.length; j++) {
				
				circlesRight[j].GetFixtureList().SetSensor(true);
				//console.log(circlesRight[j]);
			}
			passedLeft = false;
		}

		//window.requestAnimationFrame(update);
	}

	//window.requestAnimationFrame(update);

	init();


	var listener = new Box2D.Dynamics.b2ContactListener;

	listener.BeginContact = function(contact) {
		if (contact.GetFixtureA().GetBody().GetUserData() != null && contact.GetFixtureB().GetBody().GetUserData() != null) {
			if (contact.GetFixtureA().GetBody().GetUserData().id == "leftcircle" && contact.GetFixtureB().GetBody().GetUserData().id == "wheel1") {
				passedLeft = true;
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "wheel1" && contact.GetFixtureB().GetBody().GetUserData().id == "leftcircle") {
				passedLeft = true;
			}
			////////////////////////////
			if (contact.GetFixtureA().GetBody().GetUserData().id == "rightWall" && contact.GetFixtureB().GetBody().GetUserData().id == "wheel1") {
				frontWheelPassed = true;
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "wheel1" && contact.GetFixtureB().GetBody().GetUserData().id == "rightWall") {
				frontWheelPassed = true;
			}
			
			if (contact.GetFixtureA().GetBody().GetUserData().id == "rightWall" && contact.GetFixtureB().GetBody().GetUserData().id == "wheel2") {
				backWheelPassed = true;
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "wheel2" && contact.GetFixtureB().GetBody().GetUserData().id == "rightWall") {
				backWheelPassed = true;
			}
			/////////////////////////
			if (contact.GetFixtureA().GetBody().GetUserData().id == "sensorJump" && contact.GetFixtureB().GetBody().GetUserData().id == "wheel1") {
				stageOUT.removeChild(rightWallBMP);
				stageOUT.addChildAt(leftWallBMP, 1);
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "wheel1" && contact.GetFixtureB().GetBody().GetUserData().id == "sensorJump") {
				stageOUT.removeChild(rightWallBMP);
				stageOUT.addChildAt(leftWallBMP, 1);
			}
			
			
			
			var acceleration = 8;
			if (contact.GetFixtureA().GetBody().GetUserData().id == "sensor" && contact.GetFixtureB().GetBody().GetUserData().id == "wheel2") {
				if(  wheel2.GetLinearVelocity().x  >  0){
					wheel2.SetLinearVelocity( new b2Vec2(  acceleration * wheel2.GetLinearVelocity().x, acceleration * wheel2.GetLinearVelocity().y) );
					//wheel2.ApplyImpulse(new b2Vec2(  5 * wheel2.GetLinearVelocity().x, 5 * wheel2.GetLinearVelocity().y  ), wheel2.GetWorldCenter());
				}
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "wheel2" && contact.GetFixtureB().GetBody().GetUserData().id == "sensor") {
				if(  wheel2.GetLinearVelocity().x  >  0){
					wheel2.SetLinearVelocity( new b2Vec2(  acceleration * wheel2.GetLinearVelocity().x, acceleration * wheel2.GetLinearVelocity().y) );
					//wheel2.ApplyImpulse(new b2Vec2(  5 * wheel2.GetLinearVelocity().x, 5 * wheel2.GetLinearVelocity().y  ), wheel2.GetWorldCenter());
				}
			}
			
			if (contact.GetFixtureA().GetBody().GetUserData().id == "point") {
				destroy_list.push(contact.GetFixtureA().GetBody());
				pointRemoved = true;
			} else if (contact.GetFixtureB().GetBody().GetUserData().id == "point") {
				destroy_list.push(contact.GetFixtureB().GetBody());
				pointRemoved = true;
			}
			
			if (contact.GetFixtureA().GetBody().GetUserData().id == "wheel2" && contact.GetFixtureB().GetBody().GetUserData().id == "angel") {
				object = contact.GetFixtureB().GetBody();
				wheel2.SetLinearVelocity(new b2Vec2(object.GetLinearVelocity().x, 0));
				object.SetLinearVelocity( new  b2Vec2(0,0));
			} else if (contact.GetFixtureA().GetBody().GetUserData().id == "angel" && contact.GetFixtureB().GetBody().GetUserData().id == "wheel2") {
				object = contact.GetFixtureA().GetBody();
				wheel2.SetLinearVelocity(new b2Vec2(object.GetLinearVelocity().x, 0));
				object.SetLinearVelocity( new  b2Vec2(0,0));
			}
		}
	}

	listener.EndContact = function(contact) {
	}
	
	//hitPoints
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////
	//////////////////////////////////////////////////
	listener.PostSolve = function(contact, impulse) {
		idA = contact.GetFixtureA().GetBody().GetUserData().id;
		idB = "none";
		
		if(contact.GetFixtureB().GetBody().GetUserData() != null){
			idB = contact.GetFixtureB().GetBody().GetUserData().id;
			//console.log(idB);
		}
		
		if ( (idA == "daisy") || (idB == "daisy") ){
			pointsTaken = impulse.normalImpulses[0];
			if( pointsTaken > 3){
				console.log("pointsTaken " + pointsTaken);
				setLife(pointsTaken);
			}	
		}	
	}

	this.world.SetContactListener(listener);



	///////////////////////////////////////////
	///////////////////////////////////////////
	///////////////////////////////////////////
	///////////////////////////////////////////
	///////////////////////////////////////////

	var startX;	
	var startY;	
	var fireBird = false;	
	var endX;	
	var endY;	
		
	$('canvas').mousedown(function(e){
		circleX = angel.GetPosition().x*SCALE;
		circleY = angel.GetPosition().y*SCALE;
		radius = 25;
		
		pointX = e.offsetX;
		pointY = e.offsetY;
		
		insideCircle = ( ((pointX - circleX) * (pointX - circleX)) + ((pointY - circleY) * (pointY - circleY)));
		
		if (insideCircle <= (radius*radius)) {
			startX = pointX;
			startY = pointY;
			fireBird = true;
		}
	});

	$('canvas').mouseup(function(e){
		if(fireBird == true) {
			endX = e.offsetX;	
			endY = e.offsetY;
			magnitude = Math.sqrt( ((endX - startX)*(endX - startX)) + ((endY - startY)*(endY - startY))); 
			direction = Math.atan((endY - startY)/(endX - startX));	
			

			if( magnitude > 40){
				magnitude = 40;
			}
			var X =/* Math.cos(direction)**/ magnitude;
			var Y = 0 /*Math.sin(direction)*magnitude*/;
			
			if ( endX > startX) {
				console.log("endX = " + endX);
				console.log("startX = " + startX);
				
				fire(0,-10);
			} else {
				fire(X,Y);
				fired = true;
				grant.gotoAndPlay("run");
				grant.scaleX = 1;
				
				var current_attempts = parseInt( window.localStorage.getItem("gameSTATSLevel1Attempts") );
				current_attempts++;
				window.localStorage.setItem("gameSTATSLevel1Attempts", current_attempts);
			}
			fireBird = false;
			
			$.post(url, {'event':5, 'value': "mouseUp", 'x':  angel.GetPosition().x, 'y':  angel.GetPosition().y, 'gameSTATSLevel1Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel1Attempts")), 'gameSTATSLevel1Bonus': window.localStorage.getItem("gameSTATSLevel1Bonus"), 'gameSTATSLevel2Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel2Attempts")), 'gameSTATSLevel3Attempts': parseInt(window.localStorage.getItem("gameSTATSLevel3Attempts")), 'life': parseInt(window.localStorage.getItem("life")), 'lifePercent': parseInt(window.localStorage.getItem("lifePercent")), 'timer': parseInt(window.localStorage.getItem("timer"))});
			
		}	
	});

	function fire(X,Y) {
		angel.ApplyImpulse(new b2Vec2(X,Y), angel.GetWorldCenter());
		////console.log(angel.GetWorldCenter())
	}

	///////////////////////////////////////////
	///////////////////////////////////////////
	///////////////////////////////////////////
	///////////////////////////////////////////
	///////////////////////////////////////////

	var fired = false;
	var ballRemoved = false;
	var values = [];

	function test(){
		if( fired == true ){
			values.push(this.world.GetContactCount());
			console.log(this.world.GetContactCount());
			
			if( (values[values.length-1] == values[values.length-2]) /*&& (values[values.length-1] == values[values.length-3]) && (values[values.length-1] == values[values.length-4])*/ ){
				console.log("BALL REMOVED");
				ballRemoved = true;
				fired = false;
				if( window.localStorage.getItem("GAME_OVER") != "true" ){
					window.location.reload();
				} 
			}
		} 
	}

	setInterval(test, 1000);
	
	
}	