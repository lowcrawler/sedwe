<?php
$value = $_GET['option'];

if ($value === '1') {
	
  getAllStations();
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

function getStationsByUser($user) {
   $allStations = array();

   /*Get all station numbers assigned to an user*/	
   if (($handle = fopen($_SERVER['DOCUMENT_ROOT'] . "/granado/database/user_stations.txt", "r")) !== FALSE) {
      while (($data = fgetcsv($handle, 1000, "\t")) !== FALSE) {
		  if ($data[$col][0] == $user) {
	         $userStations = explode(",",$data[1]);   	 
		  }
      }
	  sort($userStations, SORT_NATURAL);
      fclose($handle);
   }
   
   if (($handle = fopen($_SERVER['DOCUMENT_ROOT'] . "/granado/database/stations.txt", "r")) !== FALSE) {
	  while (($data = fgetcsv($handle, 1000, "\t")) !== FALSE) {
	      
	  }

      fclose($handle);
	  $result = array_uintersect($allStations, $userStations, 'compareValue');

/*	  $result = array_intersect($allStations,$userStations);*/
	  
   	  foreach($result as $stn) {
         echo $stn.'<br/>';
      }
   }
}

function compareValue($val1, $val2) {
   return strcmp($val1[0], $val2);
}
?>
 