<?php
$eventString = "";
$debug = false;
$eventID = "";

if (isset($_POST['eventXML'])) {
    $eventString = $_POST['eventXML'];
}
if (isset($_POST['siteid'])) {
    $siteid = $_POST['siteid'];
}
if (isset($_POST['from'])) {
    $eFrom = $_POST['from'];
}
if (isset($_POST['evtDate'])) {
    $eDate = $_POST['evtDate'];
}
if (isset($_POST['status'])) {
    $status = $_POST['status'];
}
if (isset($_POST['guid'])) {
    $guid = $_POST['guid'];
}
if (isset($_POST['submittedDateTime'])) {
    $submittedDate = $_POST['submittedDateTime'];
}
if (isset($_POST['overwrite'])) {
    $overwrite = $_POST['overwrite'];
}

$errorMsgs = array();
require_once("/afs/.usgs.gov/www/pr.water/private/config.php");
$dbconnect = new mysqli($dbhost, $username, $password, $dbname);


$creationDate = date('Y-m-d H:i:s');
$creationDateTime = date('YmdHis', strtotime($creationDate));
$theQuery = "INSERT INTO EVENTS (user_id,station_no,event_dt,created_dt,event_xml,event_status,event_guid) ".
			"VALUES ".
				"((SELECT user_id FROM USERS WHERE user_email = '".$eFrom."'),".
				"'".$siteid."',".
				"'".$eDate."',".
				"'".$creationDate."',".
				"'".$eventString."',".
				"'".$status."',".
				"'".$guid."')";
// Note we will overwrite the above query if we end up doing an update.


if($overwrite=='true') {
if($debug)echo 'overwriting...\n';
	$guidQuery = "SELECT event_guid ".
				"FROM EVENTS ".
				"WHERE event_guid='".$guid."'";
	if (!$dbconnect) {
    	//didn't connect to database
		echo "The database server is not available.";
	} else {
    	//connected to database, output basic MySql info
        $QueryResult = $dbconnect->query($guidQuery);
        if ($QueryResult === FALSE) {
        	echo "<p>Unable to execute the query. " . "Error code " . $dbconnect->errno . ": " . $dbconnect->error . "</p>\n";
		} else {
			if($debug)echo 'query to check for matching guid did did not return false...';
		}
    //    $dbconnect->close();
	} // end if DB connect

	$row = mysqli_fetch_row($QueryResult);
	if($row[0]==$guid) {
	if($debug)echo 'Setting update events, row[0] value is '.$row[0] .'...\n';
			$theQuery = "UPDATE EVENTS ".
						"SET ".
						"station_no='".$siteid."',".
						"event_dt='".$eDate."',".
						"event_xml='".$eventString."',".
						"event_status='".$status."' ".
				"WHERE event_guid='".$guid."'";
	} else {
	$row = mysqli_fetch_row($QueryResult);
	if($debug)echo 'GUID '.$guid .' NOT found in DB...new row[0] value is '.$row[0];
	}

}



// Save XML data into the database


if (!$dbconnect) {
//didn't connect to database
	echo "The database server is not available.";
} else {
//connected to database, output basic MySql info
if($debug)echo 'executing ' . $theQuery;
	$QueryResult = $dbconnect->query($theQuery);
	if ($QueryResult === FALSE) {
	    echo "<p>Unable to execute the query. " . "Error code " . $dbconnect->errno . ": " . $dbconnect->error . "</p>\n";
	} else {
	echo "success";
	}


   $dbconnect->close();
   }

?>