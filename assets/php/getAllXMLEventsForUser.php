<?php
$email = $_POST['username'];


			$queryStr = "SELECT event_id, event_xml, event_guid, event_status, submitted_dt ".
                         "FROM EVENTS ".
                         "INNER JOIN USERS ".
                         "ON USERS.user_id=EVENTS.user_id " .
                         "WHERE user_email = '".$email."'".
    	                     "AND event_status != '2'";   // 2 is for deleted events... we don't want those.

   $errorMsgs = array();

   require_once("/afs/.usgs.gov/www/pr.water/private/config.php");

   $dbconnect = new mysqli($dbhost, $username, $password, $dbname);

   //didn't connect to database
   if (!$dbconnect) {
	$errorMsgs[] = "The database server is not available.";
   } else {
        $QueryResult = $dbconnect->query($queryStr);

	if ($QueryResult === FALSE) {
	  //echo "<p>Unable to execute the query. " . "Error code " . $dbconnect->errno . ": " .
	  }


	$retString = '';

	while ($row = mysqli_fetch_row($QueryResult)) {

		$eventNum = $row[0]; // event_id
		$eventXML = $row[1];  //event_xml
		$eventGUID = $row[2]; // event_guid
		$eventStatus = $row[3];
		$submittedDate = $row[4];
		// replace the saved event number with the event_id from the DB
		$explodedXMLStart = explode('<EventNumber>',$eventXML);
		$explodedXMLEnd = explode('</EventNumber>',$eventXML);
		$eventXML = $explodedXMLStart[0] . '<EventNumber>' . $eventNum . '</EventNumber><EventGUID>'.$eventGUID.'</EventGUID><EventStatus>'.$eventStatus.'</EventStatus><SubmittedDate>'.$submittedDate.'</SubmittedDate>' .$explodedXMLEnd[1];

		$retString .= $eventXML;



    }



    if($retString != null) {
    	$retString = str_replace('<?xml version="1.0" encoding="UTF-8"?>',' ',$retString); // we must string the XML declarations off each individual event to avoid duplication/mis-formatting when ingesting the XML....
    	$retString = str_replace('<?xml version="1.0" encoding="ISO-8859-1"?>','',$retString); // ... and then add it on to the event to define the string as XML
 		$retString = '<SedWE_XML>' . $retString . '</SedWE_XML>';  // we must wrap it in a parent XML object
      //  echo htmlspecialchars($retString);   // use this line for outputting to webpage for testing
        echo $retString;
	}

	$dbconnect->close();
   }


?>