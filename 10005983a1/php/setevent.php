<?php
session_start();
//for Linux
//include '/opt/lampp/htdocs/HomerGame/php/config.php';
//for windows
include './config.php';

$personId = null;

$event = $_POST['event'];
$value = $_POST['value'];
$x = $_POST['x'];
$y = $_POST['y'];
$gameSTATSLevel1Attempts = $_POST['gameSTATSLevel1Attempts'];
$gameSTATSLevel1Bonus = $_POST['gameSTATSLevel1Bonus'];
$gameSTATSLevel2Attempts = $_POST['gameSTATSLevel2Attempts'];
$gameSTATSLevel3Attempts = $_POST['gameSTATSLevel3Attempts'];
$life = $_POST['life'];
$lifePercent = $_POST['lifePercent'];
$timer = $_POST['timer'];

if (isset($_SESSION['id'])) {
	$personId = $_SESSION['id'];
}

if (mysqli_connect_errno()) {
	printf("Connect failed: s%\n", mysqli_connect_errno());
	exit();
}

function addEvent($personId, $event, $value, $mysqli, $x, $y, $gameSTATSLevel1Attempts, $gameSTATSLevel1Bonus, $gameSTATSLevel2Attempts, $gameSTATSLevel3Attempts, $life, $lifePercent, $timer){
	$stmt = $mysqli->prepare('INSERT INTO events (idperson, event, value, x, y, gameSTATSLevel1Attempts, gameSTATSLevel1Bonus, gameSTATSLevel2Attempts, gameSTATSLevel3Attempts, life, lifePercent, timer) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
	$stmt->bind_param('iisiiisiiiii', $personId, $event, $value, $x, $y, $gameSTATSLevel1Attempts, $gameSTATSLevel1Bonus, $gameSTATSLevel2Attempts, $gameSTATSLevel3Attempts, $life, $lifePercent, $timer);
	$stmt->execute();
	$stmt->close();
	
	$mysqli->close();
}

addEvent($personId, $event, $value, $mysqli, $x, $y, $gameSTATSLevel1Attempts, $gameSTATSLevel1Bonus, $gameSTATSLevel2Attempts, $gameSTATSLevel3Attempts, $life, $lifePercent, $timer);
?>
