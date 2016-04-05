<?php

	$passkey=$_GET['passkey'];
	$send_email = false;
	require_once("/afs/.usgs.gov/www/pr.water/private/config.php");
	$dbconnect = new mysqli($dbhost, $username, $password, $dbname);
	if (!$dbconnect) {
	  die('Could not connect: ' . mysqli_error($con));
	}

	echo "<html><head><title>SedWE User Activation</title></head><body>";

	if(isset($passkey)){
		//$sql="INSERT INTO USERS (user_email,user_nm,role_id) VALUES ('$email','$name','$role')";
		$sql="SELECT * FROM TEMP_USERS where confirm_cd = '$passkey'";
	}

	$result = $dbconnect->query($sql);
	if ($result) {
	   $user_code = rand(1000,9998);
	   
	   $row_cnt = $result->num_rows;
	   if ($row_cnt == 1) {
          $rows = mysqli_fetch_array($result);
	      $name = $rows['user_nm'];
	      $role = $rows['role_id'];
	      $email = $rows['user_email'];
	//echo "<p><b>Name:</b> $name";
	//echo "<br><b>Role:</b> $role";
	//echo "<br><b>Email:</b> $email</p>";
		  $sql2="INSERT INTO USERS (user_email,user_nm,role_id, user_cd) VALUES ('$email','$name','$role','$user_code')";
		  $result2 = $dbconnect->query($sql2);
	   } else {
	   echo "<H1>Invalid activation code</H1><p>It is possible this code is either incorrect, has been used before, or is expired.</p><p>Please contact <a href='mailto:gs-w_sedwe@usgs.gov'>gs-w_sedwe@usgs.gov</a></p>";
	   }
	} else {
	  echo "<H1>Unable to connect to activation database.</H1><p>Please contact <a href='mailto:gs-w_sedwe@usgs.gov'>gs-w_sedwe@usgs.gov</a></p>";

	}
	
	if ($result2) {
	  echo "<hr><h2> $name,<br>Your SedWE account, $email, has been activated.</h2>\n";
      $sql3="DELETE FROM TEMP_USERS where confirm_cd = '$passkey'";
	  $result3 = $dbconnect->query($sql3);
	  $send_email = true;
	}
	mysqli_close($dbconnect);
	
	if ($send_email) {
		   $to = $email;
		   $subject="SedWE - Account activation";
		   $header = "from:gs-w_sedwe@usgs.gov";
		   $message="Your account has been activated.\r\n";
		   $message.="You can login with the following email:\r\n\r\n-----------------------\r\n";
		   $message.="email: $email\r\n";//Code: $user_code\r\n\n";
   		   $message.="-----------------------\r\n\r\n";
   		   //$message.="Note: The code will be used when sending data (XML file) from the SedWE client\r\n\r\n";
   		   $message.="The SedWE client can be found here: http://pr.water.usgs.gov/SedWE \r\n";
		   $message.="\r\n\r\nIf you need help, please contact us by email at gs-w_sedwe@usgs.gov";
		   
		   $sentmail = mail($to,$subject,$message,$header);
		
		if ($sentmail) {
		  echo "<p>Information of your account has been sent to your email address.</p><p>Your activation is complete. You may close this window</p>";
		} else {
		  echo "<p>Can not send Activation email.</p>";
		}	
	
	
	}
	echo "</body></html>";
?>