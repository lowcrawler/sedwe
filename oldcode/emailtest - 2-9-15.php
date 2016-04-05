
<?php

$str = " ";

//echo $_POST['to'];
$eventID = "";

if (isset($_POST['etest'])) {
    $str = $_POST['etest'];   
 //   echo "got string message ".strlen($str);
 //   echo "The string: '<i>".$str."</i>' contains ". strlen($str). ' characters and '. str_word_count($str, 0). ' words.';
}
if (isset($_POST['to'])) {
    $to = $_POST['to'];    
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

 //---------------------------------------------------------
 // Save XML data into the database
   $creationDate = date('Y-m-d H:i:s');
   $creationDateTime = date('YmdHis', strtotime($creationDate));
   
   $theQuery = "INSERT INTO EVENTS (user_id,station_no,event_dt,created_dt) VALUES ((SELECT user_id FROM USERS WHERE user_email = '".$eFrom."'),'".$siteid."','".$eDate."','".$creationDate."')";

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
	
	
	$theQuery = "SELECT event_id FROM EVENTS where user_id=(SELECT user_id FROM USERS WHERE user_email = '".$eFrom."') and event_dt='".$eDate."' and created_dt='".$creationDate."'";
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
   
   $loginID = explode("@", $eFrom);
   
   $nombreFile = $siteid."_".$loginID[0]."_".$creationDateTime.".xml";


    $emailList = explode(",",$to);
	//send personalized emails
	
	foreach ($emailList as $aUser) {
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
		$header .= "This email includes a file in XML format with the data collected by ".$loginID." using the SED_WE application.\r\n";
		$header .= "\r\nThe file can be imported into SedLOGIN for further processing. However, if you want to display and review it prior to importing it to SedLOGIN, you can use SED_WE by using either of the following methods:\r\n";
		$header .= "\r\n1) Download the attachment and open it using SED_WE, \r\n2) Click on the link  provided for importing the data automatically\r\n";
        $header .= "pr.water.usgs.gov/SedWE/#openXMLPage?eventID=".$eventID."&email=".$aUser."\r\n\r\n";
		$header .= "Option 1:\r\n-Click on the 'Open XML' button\r\n-Click on the 'Browse' button and select the folder where you saved the file. By default, most browsers will save it in Downloads folder.\r\n";
		$header .= "-Select the file you saved\r\n-Click open\r\n\r\n";
		$header .= "Option 2: Note: This option should be used for mobile users for which email attachments can not be saved locally. This option requires an Internet connection.\r\n-Click on the link\r\n-Data will be retrieved from the online database\r\n\r\n";
		$header .= "For questions: gs-w_sedwe@usgs.gov\r\n\r\n";
        $header .= "--".$boundary."\r\n";
//end test        
		// Attachment
		// Edit content type for different file extensions
		$header .= "Content-type: application/xml; name=\"".$nombreFile."\"\r\n";
        $header .= "Content-Transfer-Encoding: base64\r\n";
		$header .= "Content-Disposition: attachment; filename=\"".$nombreFile."\"\r\n\r\n";
        $header .= $content."\r\n";
        $header .= "--".$boundary."--";



   		$retval = mail ($aUser,$subject,"",$header);
	} //end foreach
   if( $retval == true ) {
      echo "Message sent successfully to ".$to.".";
   } else {
      echo "Message could not be sent...";

   }

   $theQuery = "INSERT INTO EVENTS_XML (event_xml_id,event_xml_txt) VALUES ('".$eventID."','".$str."')";
   $dbconnect->query($theQuery);
   
   $dbconnect->close();
   }

?>
