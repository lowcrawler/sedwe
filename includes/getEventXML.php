<?php

$eventID = $_GET['eventID'];

$queryStr = "select event_xml from EVENTS where event_guid = '".$eventID."'";

   $errorMsgs = array();

   require_once("/afs/.usgs.gov/www/pr.water/private/config.php");	

   $dbconnect = new mysqli($dbhost, $username, $password, $dbname);
	
   //didn't connect to database
   if (!$dbconnect) {
	$errorMsgs[] = "The database server is not available.";
	//echo "no connection";

   } else {		
        $QueryResult = $dbconnect->query($queryStr);

	if ($QueryResult === FALSE) {
	  //echo "<p>Unable to execute the query. " . "Error code " . $dbconnect->errno . ": " . 	
	  }
	$row = mysqli_fetch_row($QueryResult);
	echo $row[0];

	$dbconnect->close();
   }

?>