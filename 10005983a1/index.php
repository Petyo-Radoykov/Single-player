<?php
	session_start();
	$sessionId = session_id();
	//$loggedin = false;
	
	if(empty($sessionId)) {
		$_SESSION['firstname'] = NULL;
		$_SESSION['surname'] = NULL;
		$_SESSION['email'] = NULL;
		$_SESSION['loggedin'] = false;	
	} else {
		$_SESSION['sess'] = $sessionId;	
		
		//TODO: Add session
		
		$email = isset($_SESSION['email']) ? $_SESSION['email'] : NULL;
		$loggedin = isset($_SESSION['email']) ? true : false;
		$firstname = isset($_SESSION['firstname']) ? $_SESSION['firstname'] : NULL;
		$surname = isset($_SESSION['surname']) ? $_SESSION['surname'] : NULL;

		if($email != NULL && $loggedin== true){
			//echo($firstname . " - " . $surname . " - " . $email);
		}
	}

?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Assessment 1</title>
    <script src='plugins/easeljs-0.8.1.combined.js'></script>
	<script src='plugins/preloadjs-0.6.1.combined.js'></script>
	<script src='plugins/Box2dWeb-2.1.a.3.min.js'></script>
	<script src="plugins/jquery-1.11.3.min.js"></script>
  <link rel="stylesheet" type="text/css" href="css/mystyle.css">
  <link rel="stylesheet" type="text/css" href="css/menu.css">
</head>
<body onload="playMusic();">

<audio  id="beep" preload="auto">
	<source src="assets/splashScreen/hoverBtn.mp3"></source>
	<source src="assets/splashScreen/hoverBtn.ogg" controls></source>
	Your browser isn't invited for super fun audio time.
</audio>

<div id="login" hidden>
	<div id="loading"><img src="assets/splashScreen/loading.gif" alt="Be patient..." /></div>
	
	<div id="splashPlayBtn">
		<a id="playBtn" href="https://facebook.com/dialog/oauth?client_id=465135800332998&redirect_uri=http://localhost/10005983a1/facebooklogin.php&scope=email">Click to Play</a>
	</div>
</div>





<!-- TheCANVASES-->
<div id="game" hidden>
	<div id="gameover" hidden><div class="text">Game Over</div><div class="playAgain">Play Again</div></div>
	
	<div id="gamewin" hidden>
		<div class="text">You Win</div>
		<div id="row1"><div class="yourStatsLeft">Attempts: </div> <div class="yourStatsRight" id="att"></div>  </div>
		<div id="row2"><div class="yourStatsLeft">Bonus Point:</div> <div class="yourStatsRight" id="bonus"></div>  </div>
		<div id="row3"><div class="yourStatsLeft">Percent Left:</div> <div class="yourStatsRight" id="percent"></div>  </div>
		<div id="row4"><div class="yourStatsLeft">Lifes:</div> <div class="yourStatsRight" id="lifeStat"></div>  </div>
		
		<div class="playAgain">Play Again</div>
	</div>
	
	
	
	<canvas id="easelCanvas" width='900' height='600' ></canvas>
	<canvas id="box2dCanvas" width='900' height='600' hidden ></canvas>
	
	<div id="life">
		<img src="assets/life.png" alt="life">
		<div id="count" ></div>
	</div>
	<div id="clock" hidden><div id="timer" ></div></div>
</div>	

<script src='js/level1.js'></script>
<script src='js/level2.js'></script>
<script src='js/level3.js'></script>
<script src='js/splash.js'></script>
<script src='js/menu.js'></script>

<script>
window.localStorage.setItem("GAME_OVER_CHECK", "false");
 //var urlOne = 'http://localhost/10005983a1/php/setevent.php';
//window.localStorage.clear();
//After all content is loaded
$(window).load(function() { 
	//N.B. setTimeout just for demonstration
	setTimeout(function(){
		$('#loading').hide();
		$('#playBtn').show();
	}, 1000); 
});

//on click applyed to the splash div	
$(document).click(function(e) {
	if ($(e.target).is('#playBtn')) {
		return;
	}
	if($(e.target).is('#login')){
		loginLink();
	}
});

//Button hover sound
var beepOne = $("#beep")[0];
$("#playBtn")
	.mouseenter(function() {
		beepOne.play();
	});
	
//Div appearance Logic	
var loggedin = '<?=$loggedin;?>'

if (loggedin){
	$('#login').hide();
	$('#game').show();
	
	$.ajax({ 
		  method: 'POST',	
		  url: './php/getLoadingInfo.php',              
		  data: { pass: "hi" },              
		  dataType: 'json',                        
		  success: function(data)            
		  {	
		   //alert(data.length );
			 if((data.length > 0 && window.localStorage.getItem("init") != "true")){
				 // alert(1);
				 // alert(data[0]["value"]);
				  
				if( (data[0]["value"] != "GAMEWON") && (data[0]["value"] != "GAMEOVER")/* && (data[0]["value"] != "GAMESTART")*/){ 
				//	 alert("1.1");
					window.localStorage.setItem("gameSTATSLevel1Attempts", data[0]["gameSTATSLevel1Attempts"]);
					window.localStorage.setItem("gameSTATSLevel1Bonus", data[0]["gameSTATSLevel1Bonus"]);
					window.localStorage.setItem("gameSTATSLevel2Attempts", data[0]["gameSTATSLevel2Attempts"]);
					window.localStorage.setItem("gameSTATSLevel3Attempts", data[0]["gameSTATSLevel3Attempts"]);
					window.localStorage.setItem("life", data[0]["life"]);
					window.localStorage.setItem("lifePercent", data[0]["lifePercent"]);
					window.localStorage.setItem("timer", data[0]["timer"]);
					
					window.localStorage.setItem("GAME_OVER", "false");
					
					if(data[0]["gameSTATSLevel2Attempts"] > 0){
						window.localStorage.setItem("gameLevel1END", "true" );
						window.localStorage.setItem("gameLevel2END", "false");
					}
					if(data[0]["gameSTATSLevel3Attempts"] > 0){
						window.localStorage.setItem("gameLevel1END", "false");
						window.localStorage.setItem("gameLevel2END", "true" );
					}
					
					
					window.localStorage.setItem("init", "true");
				} else {
				//	alert(1.2);
					$.post(url, {'event':7, 'value': "GAMESTART", 'x':  0, 'y':  0, 'gameSTATSLevel1Attempts': 0, 'gameSTATSLevel1Bonus': "false", 'gameSTATSLevel2Attempts': 0, 'gameSTATSLevel3Attempts': 0, 'life': 2, 'lifePercent': 1000, 'timer': 12});
	
					window.localStorage.setItem("gameSTATSLevel1Attempts", 0);
					window.localStorage.setItem("gameSTATSLevel1Bonus", "false");
					window.localStorage.setItem("gameSTATSLevel2Attempts", 0);
					window.localStorage.setItem("gameSTATSLevel3Attempts", 0); 
					window.localStorage.setItem("life", "2");
					window.localStorage.setItem("lifePercent", "1000");
					
					window.localStorage.setItem("GAME_OVER", "false");
					
					window.localStorage.setItem("gameLevel1END", "false");
					window.localStorage.setItem("gameLevel2END", "false");
					window.localStorage.setItem("timer", "12");
					
					//playLevel1();
					location.reload();
					//window.location.href='https://facebook.com/dialog/oauth?client_id=465135800332998&redirect_uri=http://localhost/10005983a1/facebooklogin.php&scope=email';
				} 
			} else if(data.length <= 0) {
				//	 alert(2);
					$.post(url, {'event':7, 'value': "GAMESTART", 'x':  0, 'y':  0, 'gameSTATSLevel1Attempts': 0, 'gameSTATSLevel1Bonus': "false", 'gameSTATSLevel2Attempts': 0, 'gameSTATSLevel3Attempts': 0, 'life': 2, 'lifePercent': 1000, 'timer': 12});
	
					window.localStorage.setItem("gameSTATSLevel1Attempts", 0);
					window.localStorage.setItem("gameSTATSLevel1Bonus", "false");
					window.localStorage.setItem("gameSTATSLevel2Attempts", 0);
					window.localStorage.setItem("gameSTATSLevel3Attempts", 0); 
					window.localStorage.setItem("life", "2");
					window.localStorage.setItem("lifePercent", "1000");
					
					window.localStorage.setItem("GAME_OVER", "false");
					
					window.localStorage.setItem("gameLevel1END", "false");
					window.localStorage.setItem("gameLevel2END", "false");
					window.localStorage.setItem("timer", "12");
			}	
		  }	
	});

	if( (window.localStorage.getItem("gameLevel1END") == "true")){
		 playLevel2();
	} else if( (window.localStorage.getItem("gameLevel2END") == "true") ){
		 playLevel3();
	} else if( window.localStorage.getItem("GAME_OVER") == "true" ){
		alert("GAME OVER");
	} else {
		playLevel1();
	}
} else {
	$('#login').show();
	$('#game').hide();	
	
	window.localStorage.setItem("init", "false");
	//window.localStorage.clear();
	//Extracting data from DB
}

$(".playAgain").on( "click", function(){
	$("gameover").hide();
	$("gamewin").hide();
	//window.localStorage.clear();
	$.post(url, {'event':7, 'value': "GAMESTART", 'x':  0, 'y':  0, 'gameSTATSLevel1Attempts': 0, 'gameSTATSLevel1Bonus': "false", 'gameSTATSLevel2Attempts': 0, 'gameSTATSLevel3Attempts': 0, 'life': 2, 'lifePercent': 1000, 'timer': 12});
			
	window.localStorage.setItem("life", "2");
	window.localStorage.setItem("lifePercent", "1000");
	
	window.localStorage.setItem("GAME_OVER", "false");
	
	//clear data
	window.localStorage.setItem("gameLevel1END", "false");
	window.localStorage.setItem("gameLevel2END", "false");
	
	// clear stats
	window.localStorage.setItem("gameSTATSLevel1Attempts", "0");
	window.localStorage.setItem("gameSTATSLevel1Bonus", "false");
	window.localStorage.setItem("gameSTATSLevel2Attempts", "0");
	window.localStorage.setItem("gameSTATSLevel3Attempts", "0");
	window.localStorage.setItem("timer", "12");
	
	window.location.href='https://facebook.com/dialog/oauth?client_id=465135800332998&redirect_uri=http://localhost/10005983a1/facebooklogin.php&scope=email';
});


</script>

</body>
</html>
