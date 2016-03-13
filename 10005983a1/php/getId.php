<?php
error_reporting (E_ALL ^ E_NOTICE);
session_start();

/*1. Gets user's data*/
$id = $_SESSION['id']; 

echo json_encode($id);

?>