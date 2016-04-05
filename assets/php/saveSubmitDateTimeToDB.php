<?php

if (isset($_POST['guid'])) {
    $guid = $_POST['guid'];
}
if (isset($_POST['submittedDateTime'])) {
    $submittedDateTime = $_POST['submittedDateTime'];
}

$errorMsgs = array();
require_once("/afs/.usgs.gov/www/pr.water/private/config.php");
$dbconnect = new mysqli($dbhost, $username, $password, $dbname);


$creationDate = date('Y-m-d H:i:s');
$creationDateTime = date('YmdHis', strtotime($creationDate));



	if (!$dbconnect) {
    	//didn't connect to database
		echo "The database server is not available.";
	} else {
		$guidQuery = "SELECT event_guid ".
    				"FROM EVENTS ".
    				"WHERE event_guid='".$guid."'";
    	//connected to database, output basic MySql info
        $QueryResult = $dbconnect->query($guidQuery);
        if ($QueryResult === FALSE) {
        	echo "<p>Unable to execute the query to see if Quid is equal. " . "Error code " . $dbconnect->errno . ": " . $dbconnect->error . "</p>\n";
		}
    //    $dbconnect->close();
	} // end if DB connect

	$row = mysqli_fetch_row($QueryResult);
	if($row[0]==$guid) {
		$theQuery = "UPDATE EVENTS ".
						"SET ".
						"submitted_dt='".$submittedDateTime."'".
					"WHERE event_guid='".$guid."'";


		if (!$dbconnect) {
			//didn't connect to database
			echo "The database server is not available.";
		} else {
			//connected to database, output basic MySql info
			$QueryResult = $dbconnect->query($theQuery);
		if ($QueryResult === FALSE) {
	    	echo "<p>Unable to execute the query. " . "Error code " . $dbconnect->errno . ": " . $dbconnect->error . "</p>\n";
		} else {
			echo $QueryResult;
		}
   $dbconnect->close();
   }
}
?>