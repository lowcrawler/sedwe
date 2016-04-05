<?php
//$queryStr = "select station_no, station_nm from STATIONS";

$useremail = $_GET['email'];

//echo "station ". $userstation."  lkjsdlsd";
//$queryStr = "select s.email_recipients from STATIONS s, USERS_STATIONS u where u.user_email = '".$useremail."' and s.station_no = '".$userstation."' and s.station_no = u.station_no";
$queryStr = "select ROLE.role_nm from USERS, ROLE where USERS.user_email = '".$useremail."' and USERS.role_id = ROLE.role_id";
//if ($value === '1') {
	querySEDWE($queryStr);
//  getAllStations();
//}
function querySEDWE($theQuery){
//echo "en funciones";
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
	if ($rowCounter == 0) {
	    echo "no_user";
	}
	$dbconnect->close();

//	return $QueryResult;
   }
}

?>
 