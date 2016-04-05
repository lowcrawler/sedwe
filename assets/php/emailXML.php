
<?php
// note this php file removes duplicates from the email list
$str = " ";

//echo $_POST['to'];
if (isset($_POST['evtGUID'])) {
    $eventGUID = $_POST['evtGUID'];
}

if (isset($_POST['fileContent'])) {
    $str = $_POST['fileContent'];
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

// get event info from the DB
$errorMsgs = array();
require_once("/afs/.usgs.gov/www/pr.water/private/config.php");
$dbconnect = new mysqli($dbhost, $username, $password, $dbname);
$theQuery = "SELECT event_id FROM EVENTS where user_id=(SELECT user_id FROM USERS WHERE user_email = '".$eFrom."') and event_dt='".$eDate."' and created_dt='".$creationDate."'";
$QueryResult = $dbconnect->query($theQuery);
$row = mysqli_fetch_row($QueryResult);
//$eventID = $row[0];



   $content = chunk_split(base64_encode($str));
   
   //boundary
   $boundary= md5(date('r', time()));
   
  // $to = "dlopez@usgs.gov";
   $subject = "Sample data from station ".$siteid.", in XML format";
   $message .= "<h2>Sample data from station ".$siteid.", in XML format</h2>";
   $message .= "<p><span style=\"font-family: monospace;\">".$str."</p>";
   
   $loginID = explode("@", $eFrom);
   
   $nombreFile = $siteid."_".$loginID[0]."_".$eDate.".xml";


    $emailList = array_unique(array_map('trim',array_filter(explode(",",$to))));
//    var_dump($emailList);

	//send personalized emails
	
	foreach ($emailList as $aUser) {
// Email header
echo 'sending to: '.$aUser.'...';
     //   $header = "From:".$eFrom."\r\nCC:".$eFrom."\r\n";
        $header = "From:".$eFrom."\r\n";
        $header .= "MIME-Version: 1.0\r\n";
        
		// Multipart wraps the Email Content and Attachment
		$header .= "Content-Type: multipart/mixed; boundary=\"" . $boundary . "\"\r\n";
		$header .= "This is a multi-part message in MIME format.\r\n";
        $header .= "--".$boundary."\r\n";


		$header .= "Content-type:text/plain; charset=iso-8859-1\r\n";
        $header .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
		$header .= $aUser.",\r\n\r\n";
		$header .= $loginID[0]." has just submitted sediment data for station ".$siteid.", using the SedWE field application on ".$eDate.".\r\n\r\n";
		$header .= "The submitted data are in an XML file attached to this email, and they are also stored in the SedWE database.   The data should be reviewed for accuracy and completeness, and then uploaded into SedLOGIN.  You can review this XML data in SedWE, by using the following method:\r\n\r\n";
		$header .= "Save the attached XML file to your disk, and open it using SED_WE's 'Upload XML File into SedWE' on the main menu, and browse to the XML file saved to your disk.\r\n\r\n";
		//$header .= "or\r\n";
        //$header .= "2) If you have an internet connection, click on the following link, which will immediately import the XML data (from the SedWE database) into your SedWE 'Review' screens.  (SedWE will be started if you do this.)  This option can be used by mobile users when email attachments cannot be saved locally.  The link is:\r\nhttp://pr.water.usgs.gov/SedWE/#openXMLPage?eventID=".$eventGUID."&email=".$aUser."\r\n\r\n";
        $header .= "After data are reviewed, they should be imported into SedLOGIN by a registered SedLOGIN user. (SedLOGIN available as part of the QW Data Transfer (QWDX) system, here: https://qwdx.cr.usgs.gov/)  If the data are modified at all during review, the corrected data should be re-submitted to SedWE to create a new (corrected) XML file and update the SedWE database.  That corrected XML file must then be saved to a computer disk, to be uploaded into SedLOGIN.  A user must log into SedLOGIN, navigate to the desired Project, select the 'Import from SedWE' button, and specify the (corrected) XML file for importing.\r\n\r\n";
		$header .= "For questions: gs-w_sedwe@usgs.gov\r\n";
        $header .= "--".$boundary."\r\n";

		// Attachment
		// Edit content type for different file extensions
		$header .= "Content-type: application/xml; name=\"".$nombreFile."\"\r\n";
        $header .= "Content-Transfer-Encoding: base64\r\n";
		$header .= "Content-Disposition: attachment; filename=\"".$nombreFile."\"\r\n\r\n";
        $header .= $content."\r\n";
        $header .= "--".$boundary."--";



   		$retval = mail ($aUser,$subject,"",$header);
   		   if( $retval == true ) {
              echo "Message sent successfully to ".$aUser.".\r\n";
           } else {
              echo "Message could not be sent tp ".$aUser.".\r\n";

           }
	} //end foreach


  $dbconnect->close();
?>
