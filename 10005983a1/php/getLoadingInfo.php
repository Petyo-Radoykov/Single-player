<?php
error_reporting (E_ALL ^ E_NOTICE);
session_start();

/*1. Gets user's data*/
$id = $_SESSION['id']; 
//$id = 1; //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
/*2. Connecting to database*/
	 require 'connect.php';
/*3. Try to extract data from the database based on the subject_name*/
		 try {
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			$stmt = $conn->prepare("SELECT *
									FROM events
									WHERE idperson = '$id'
									ORDER BY id DESC
									LIMIT 1;"); 						
			$stmt->execute();

			// set the resulting array to associative
			$result = $stmt->setFetchMode(PDO::FETCH_ASSOC); 

			$row1 = $stmt->fetchAll(); 
						
			$dsn = null;
			}
		catch(PDOException $e)
			{
			/*TO DO create error page*/
			//header('Location: error.php');
			}

//echo json_encode(array('id' => $id, 'gameN' => $gameN));

//echo json_encode($id);
echo json_encode($row1);
//echo json_encode($id);

?>