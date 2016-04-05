<?php
//echo "test";
//$queryStr = "select station_no, station_nm from STATIONS";

//$value = $_GET['option'];
$useremail = $_GET['email'];
//$queryStr = "select STATIONS.station_agcy, STATIONS.station_no, STATIONS.station_nm from USERS_STATIONS, STATIONS where USERS_STATIONS.user_email = '".$useremail."' and USERS_STATIONS.station_no = STATIONS.station_no";
$queryStr = "select STATIONS.station_agcy, STATIONS.station_no, STATIONS.station_nm from USERS_STATIONS, STATIONS, USERS where USERS.user_email = '".$useremail."' and USERS_STATIONS.station_no = STATIONS.station_no and USERS.user_id = USERS_STATIONS.user_id";
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
		if ($rowCounter == 0)
       		echo "<option value=\"".$row[1]."\" selected >".$row[0].' '.$row[1].' '.$row[2] . "</option>";
		else 
			echo "<option value=\"".$row[1]."\">".$row[0].' '.$row[1].' '.$row[2]. "</option>";
	   $rowCounter++;
//echo '<option value=\'valor\'>bla bla bla</option>';
//echo "<option value=\"10\">10 EQUAL WIDTH INCREMENT (EWI)</option>";
	}
	if ($rowCounter == 0) {
	    echo "<option></option>";
	}
	$dbconnect->close();

//	return $QueryResult;
   }
}

function getAllStations () {


   $counter=0;
   if (($handle = fopen($_SERVER['DOCUMENT_ROOT'] . "/granado/database/stations.txt", "r")) !== FALSE) {
      while (($data = fgetcsv($handle, 1000, "\t")) !== FALSE) {
		 if ($counter === 0) { 
            echo "<option value=".$data[0]." selected>".$data[0].' '.$data[1] . "</option>";
		 } else {
		    echo "<option value=".$data[0].">".$data[0].' '.$data[1] . "</option>";
		 }
      }
      fclose($handle);
   }
}


?>
 