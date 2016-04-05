
<?php

$str = " ";

echo $_GET['to'];
$eventID = "";

if (isset($_GET['etest'])) {
    $str = $_GET['etest'];   
    echo "got string message ".strlen($str);
    echo "The string: '<i>".$str."</i>' contains ". strlen($str). ' characters and '. str_word_count($str, 0). ' words.';
}
if (isset($_GET['to'])) {
    $to = $_GET['to'];    
}
if (isset($_GET['siteid'])) {
    $siteid = $_GET['siteid'];    
}
if (isset($_GET['from'])) {
    $eFrom = $_GET['from'];    
}
if (isset($_GET['evtDate'])) {
    $eDate = $_GET['evtDate'];    
}

 //---------------------------------------------------------
 // Save XML data into the database
   $creationDate = date('Y-m-d H:i:s');

   $theQuery = "INSERT INTO EVENTS (user_id,event_dt,created_dt) VALUES ((SELECT user_id FROM USERS WHERE user_email = '".$eFrom."'),'".$eDate."','".$creationDate."')";

   $errorMsgs = array();
   require_once("/afs/.usgs.gov/www/pr.water/private/config.php");	
   $dbconnect = new mysqli($dbhost, $username, $password, $dbname);
	
   //didn't connect to database
   if (!$dbconnect) {
	$errorMsgs[] = "The database server is not available.";
   }
   //connected to database, output basic MySql info
   else {			
        $QueryResult = $dbconnect->query($theQuery);

	    if ($QueryResult === FALSE) {
	    //echo "<p>Unable to execute the query. " . "Error code " . $dbconnect->errno . ": " . $dbconnect->error . "</p>\n";
	    }
        $rowCounter = 0;
	    while($row = mysqli_fetch_row($QueryResult)) {
//		   echo $row[0];
	   	   $rowCounter++;
	    }
	//    if ($rowCounter == 0) {
	//       echo $useremail;
	//    }
	
	
	$theQuery = "SELECT event_id FROM EVENTS where user_id='(SELECT user_id FROM USERS WHERE user_email = '".$eFrom."')'"." and event_dt='".$eDate."' and created_dt='".$creationDate."')";
    $QueryResult = $dbconnect->query($theQuery);
	$row = mysqli_fetch_row($QueryResult);
	$eventID = $row[0];
	
//	$dbconnect->close();
//   }
   
// END SAVE INFO IN DATABSE

   $content = chunk_split(base64_encode($str));
   
   //boundary
   $boundary= md5(date('r', time()));
   
  // $to = "dlopez@usgs.gov";
   $subject = "Sample data from station ".$siteid.", in XML format";
   $message .= "<h2>Sample data from station ".$siteid.", in XML format</h2>";
   $message .= "<p><span style=\"font-family: monospace;\">".$str."</p>";

   $nombreFile = $siteid.".xml";
// Email header
        $header = "From:".$eFrom."\r\nCC:".$eFrom."\r\n";
        $header .= "MIME-Version: 1.0\r\n";
        
		// Multipart wraps the Email Content and Attachment
		$header .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";
		$header .= "This is a multi-part message in MIME format.\r\n";
        $header .= "--".$boundary."\r\n";
		
		// Email content
		// Content-type can be text/plain or text/html
        //GOOD
		//$header .= "Content-type:text/plain; charset=iso-8859-1\r\n";
        //$header .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        //$header .= $str."\r\n";
        //$header .= "--".$boundary."\r\n";

//test
		$header .= "Content-type:text/plain; charset=iso-8859-1\r\n";
        $header .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $header .= $str."\r\n";
        $header .= "--".$boundary."\r\n";
//end test        
		// Attachment
		// Edit content type for different file extensions
		$header .= "Content-type: application/xml; name=\"".$nombreFile."\"\r\n";
        $header .= "Content-Transfer-Encoding: base64\r\n";
		$header .= "Content-Disposition: attachment; filename=\"".$nombreFile."\"\r\n\r\n";
        $header .= $content."\r\n";
        $header .= "--".$boundary."--";



   $retval = mail ($to,$subject,"",$header);
   if( $retval == true ) {
      echo "Message sent successfully...characters: ".strlen($str);
   } else {
      echo "Message could not be sent...";

   }

   $theQuery = "INSERT INTO EVENTS_XML (event_xml_id,event_xml_txt) VALUES ('".$eventID."','".$str."')";
   $dbconnect->query($theQuery);
   
   $dbconnect->close();
   }

?>
