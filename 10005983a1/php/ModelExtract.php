<?php
error_reporting (E_ALL ^ E_NOTICE);
session_start();

/*1. Gets user's data*/
$id = $_SESSION['id']; 
/*2. Connecting to database*/
	//include '/opt/lampp/htdocs/10005983a1/php/connect.php';
	 include './connect.php';
/*3. Try to extract data from the database based on the subject_name*/
		 try {
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
			/*$stmt = $conn->prepare("SELECT subject_id
									FROM subject
									WHERE title = '$value'"); 
									*/
			$stmt = $conn->prepare("SELECT x, y, gameN
									FROM events
									WHERE idperson = '$id'
									ORDER BY t DESC"); 						
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

$row1[$row1.length] = $id;	
 /*6. echo the resulting array*/ 
echo json_encode($row1);
 /***********|End of connection|*************************/
$conn = null;	

/*
SELECT x, y
FROM events
WHERE idperson = 1
ORDER BY t ASC

*/
?>

