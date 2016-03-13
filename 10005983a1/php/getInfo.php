<?php
error_reporting (E_ALL ^ E_NOTICE);
session_start();

/*1. Connecting to database*/
	//include '/opt/lampp/htdocs/10005983a1/php/connect.php';
	include './connect.php';
/*2. Try to extract data from the database based on the subject_name*/
		 try {
			$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

			$stmt = $conn->prepare("SELECT *
									FROM score
									ORDER BY life DESC, percent DESC, attempts ASC
									LIMIT 5;"); 						
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
 
$lenght = sizeof($row1);
		
			for ($x = 0; $x < $lenght; $x++) {
				try {
				$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
				
				$tempID = $row1[$x]["userID"];

				$stmt = $conn->prepare("SELECT firstname, surname
										FROM user
										WHERE id = '$tempID';"); 						
				$stmt->execute();

				// set the resulting array to associative
				$result = $stmt->setFetchMode(PDO::FETCH_ASSOC); 

				$row2 = $stmt->fetchAll(); 
							
				$dsn = null;
				}
			catch(PDOException $e)
				{
				/*TO DO create error page*/
				//header('Location: error.php');
				}
				
				$row1[$x]['firstname'] = $row2[0]['firstname'];
				$row1[$x]['surname'] = $row2[0]['surname'];
				
			}
			
			
			
//$gameN = $row1[0]["gameN"];


//echo json_encode(array('id' => $id, 'gameN' => $gameN));

echo json_encode($row1);
//echo json_encode($gameN);

/*
SELECT gameN
FROM events
WHERE idperson = '$id'
ORDER BY gameN DESC
*/

/*
SELECT *
FROM score
ORDER BY life DESC, percent DESC, attempts ASC
LIMIT 5;
*/

?>
