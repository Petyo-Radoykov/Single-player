<?php
session_start();
//for Linux
//include '/opt/lampp/htdocs/10005983a1/php/config.php';
//for windows
include './php/config.php';


function fetchUrl($url){
	$ch = curl_init();
	
	curl_setopt($ch, CURLOPT_URL, $url);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
	curl_setopt($ch, CURLOPT_TIMEOUT, 20);
	
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	
	if(curl_errno($ch)){
		//echo 'Curl error: ' . curl_error($ch);
	}
	
	$feedData = curl_exec($ch);
	curl_close($ch);
	
	return $feedData;
}



$fbcode = $_GET["code"];

$app_id = "465135800332998";
$app_secret = "ffdad44d1409ddc9e6de3bdb3be8fc58";
$redirect = "http://localhost/10005983a1/facebooklogin.php";
$authToken = fetchUrl("https://graph.facebook.com/v2.4/oauth/access_token?client_id={$app_id}&redirect_uri={$redirect}&client_secret={$app_secret}&code={$fbcode}");


$atObj = json_decode($authToken);
$authToken = $atObj->access_token;

$json_object = fetchUrl("https://graph.facebook.com/me?access_token={$authToken}&fields=email,first_name,last_name,name");

$obj = json_decode($json_object);


$email = $obj->email;
$first_name = $obj->first_name;
$last_name = $obj->last_name;

$_SESSION['firstname'] = $first_name;
$_SESSION['surname'] = $last_name;
$_SESSION['email'] = $email;

if(mysqli_connect_errno()){
	printf("Connect failed: %s\n", mysqli_connect_errno());
	exit();
}

$select_stmt = $mysqli->prepare('SELECT * FROM user where email = ?');
$select_stmt->bind_param('s',$email);
$select_stmt->execute();

$exists = $select_stmt->fetch();

printf($exists);

$select_stmt->close();

if(!$exists){
	$stmt = $mysqli->prepare('INSERT INTO user (firstname, surname, email) VALUES (?, ?, ?)');
	echo $first_name . " - " . $last_name . " - " . $email;
	$stmt->bind_param('sss', $first_name, $last_name, $email);
	$stmt->execute();
	$stmt->close();
	
	$sel_stmt = $mysqli->prepare('SELECT id FROM user where email = ?');
	$sel_stmt->bind_param('s',$email);
	$sel_stmt->execute();
	
	$id = null;
	$result = $sel_stmt->get_result();
	while ($row = $result->fetch_array(MYSQLI_NUM)){
		foreach ( $row as $r) {
			$id = $r;
		}
	}
	
	//$id = $sel_stmt->fetch();
	$_SESSION['id'] = $id;
	$sel_stmt->close();	
} else {
	echo $first_name . " - " . $last_name . " - " . $email;
	
	$sel2_stmt = $mysqli->prepare('SELECT id FROM user where email = ?');
	$sel2_stmt->bind_param('s',$email);
	$sel2_stmt->execute();
	
	$id = null;
	$result = $sel2_stmt->get_result();
	while ($row = $result->fetch_array(MYSQLI_NUM)){
		foreach ( $row as $r) {
			$id = $r;
		}
	}
	//$id = $sel2_stmt->fetch();
	$_SESSION['id'] = $id;
	$sel2_stmt->close();	
}

$mysqli->close();

header('Location: http://localhost/10005983a1/');

exit();

?>
