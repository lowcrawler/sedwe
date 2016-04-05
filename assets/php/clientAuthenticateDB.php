<?php
$debug = false;





   $errorMsgs = array();

   require_once("/afs/.usgs.gov/www/pr.water/private/config.php");
   $dbconnect = new mysqli($dbhost, $username, $password, $dbname);

   //didn't connect to database
   if (!$dbconnect) {
		$errorMsgs[] = "The database server is not available.";
   } else {


   if(isset($_POST["username"])) {
   	$email = strip_tags(trim($_POST["username"]));
   	$sanitizedEmail = mysqli_real_escape_string($dbconnect,$email);
   } else {
    	die("Username was not passed");
    }

   if ($debug) echo "Username: $email";
   if ($debug) echo "Sanitized: $sanitizedEmail";
   $code = $_POST['code'];
   if ($debug) echo "Code: $code";



   			$queryStr = "SELECT user_cd ".
                            "FROM USERS ".
                            "WHERE user_email = '".$email."'";


        $QueryResult = $dbconnect->query($queryStr);

		if ($QueryResult === FALSE) {
			echo "Unable to execute the query. " . "Error code " . $dbconnect->errno ;
	  	}

	$retString = '';

	while ($row = mysqli_fetch_row($QueryResult)) {
		$dbCode = $row[0];
		if($dbCode==$code) {
			echo 'true';
		} else {
			echo 'Code does not match';
		}
    }

	$dbconnect->close();
   }


?>