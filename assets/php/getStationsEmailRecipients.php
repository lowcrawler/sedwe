<?php
$userstation = $_GET['station_no'];
$queryStr = "select email_recipients from STATIONS where station_no = '".$userstation."'";
	querySEDWE($queryStr);

function querySEDWE($theQuery){
   $errorMsgs = array();

   require_once("/afs/.usgs.gov/www/pr.water/private/config.php");	

   $dbconnect = new mysqli($dbhost, $username, $password, $dbname);
	
   //didn't connect to database
   if (!$dbconnect) {
	$errorMsgs[] = "The database server is not available.";
	//echo "no connection";
   }
   //connected to database, output basic MySql info
   else {	
  	//echo "<p>Successfully connected to the database.</p>";
  	//echo "<p>MySQL server version: " . $dbconnect->server_info . "</p>";
		
        $QueryResult = $dbconnect->query($theQuery);

	if ($QueryResult === FALSE) {
	  //echo "<p>Unable to execute the query. " . "Error code " . $dbconnect->errno . ": " . $dbconnect->error . "</p>\n";
	}
    $rowCounter = 0;
	while($row = mysqli_fetch_row($QueryResult)) {
		// echo "<option value=".$row[0]." selected>".$row[0].' '.$row[1] . 
		echo $row[0];
	   	$rowCounter++;
	}
//	if ($rowCounter == 0) {
//	    echo $useremail;
//	}
	$dbconnect->close();

   }
}

?>


