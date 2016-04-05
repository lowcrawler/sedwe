<?php


if (isset($_POST['guid'])) {
    $guid = $_POST['guid'];
} else {
	echo "GUID not passed to markEventForDeletionInDB.php";
}


// Save XML data into the database

$theQuery = "UPDATE EVENTS ".
			"SET event_status = 2 ".
			"WHERE event_guid = '".$guid."'";



$errorMsgs = array();
require_once("/afs/.usgs.gov/www/pr.water/private/config.php");
$dbconnect = new mysqli($dbhost, $username, $password, $dbname);


if (!$dbconnect) {
//didn't connect to database
	echo "The database server is not available.";
} else {
//connected to database, output basic MySql info
	$QueryResult = $dbconnect->query($theQuery);
	if ($QueryResult === FALSE) {
	    echo "Unable to execute the query. " . "Error code " . $dbconnect->errno . ": " . $dbconnect->error . "\n";
	} else {
		echo 'The deletions were successful in the DB.';
	}
//TODO: check to see if the guid exists and if not throw an error message;
   $dbconnect->close();
   }
/**/


?>


