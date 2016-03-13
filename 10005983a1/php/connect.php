<?php 
/*Connecting to database*/
			$servername = "localhost";
			$username = "root";
			$dbname = "10005983a1DB";
			//$myPassword = $myUniPassword;
			$myPassword = "";
			
			//Linux
			//$uniformPassword="petyor";

			try {
				$conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $myPassword);
				$dsn = null;
				}
			catch(PDOException $e)
				{
				/*TO DO create an error page*/
				header('Location: error.php');
				}
						
?>
