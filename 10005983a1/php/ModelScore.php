<?php
session_start();
//for Linux
//include '/opt/lampp/htdocs/HomerGame/php/config.php';
//for windows
include './config.php';

$personId = null;

$attempts = $_POST['attempts'];
$bonus = $_POST['bonus'];
$percent = $_POST['percent'];
$life = $_POST['life'];

if (isset($_SESSION['id'])) {
	$personId = $_SESSION['id'];
}

if (mysqli_connect_errno()) {
	printf("Connect failed: s%\n", mysqli_connect_errno());
	exit();
}

function addEvent($attempts, $bonus, $percent, $life, $personId, $mysqli){
	$stmt = $mysqli->prepare('INSERT INTO score (attempts, bonus, percent, life, userID) VALUES (?, ?, ?, ?, ?)');
	$stmt->bind_param('isiii', $attempts, $bonus, $percent, $life, $personId);
	$stmt->execute();
	$stmt->close();
	
	$mysqli->close();
}

addEvent($attempts, $bonus, $percent, $life, $personId, $mysqli);
?>