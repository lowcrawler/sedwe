<?php

// note, ldap required PHP to have LDAP installed, read: http://stackoverflow.com/questions/8826379/unable-to-enable-php-ldap-even-though-i-have-edited-php-ini-and-php-ldap-dll-is
// note, USGS domain connection settings are in  '/lib/adLDAP/src/adLDAP.php'
//TODO: IMPORTANT! force the browser to use ssl

$debug = false;
//$debug = true;


// ensure variables are being transfered correctly and do basic sanitation - START
if(isset($_POST["username"])) {
	$usrname = strip_tags(trim($_POST["username"]));

} else {
 	die("Username was not passed");
 }

if(isset($_POST["password"])) {
	$password = $_POST["password"];
} else {
	die("Password was not passed");
}


$parts = explode('@',$usrname);
$usrname = $parts[0];
if(strlen($usrname) > 100) {
	die ("Username exceeds 100 characters");
}
if(strlen($password) > 100) {
	die("Password exceeds 100 characters");
}

if($debug)echo "<b>Username:</b> ".$usrname.'<br>';
if($debug)echo "<b>Password</b>: ".$password;
// ensure variables are being transfered correctly and do basic sanitation - START




// initiate LDAP session - START
if($debug) echo "<br>Attempting to create adLDAP connection:";
if($debug) echo dirname(__FILE__). '/../../lib/adLDAP/src/adLDAP.php';

require_once(dirname(__FILE__) . '/../../lib/adLDAP/src/adLDAP.php');

if($debug)echo " trying...<br>";
try {
    $adldap = new adLDAP();
    if($debug)echo "success!!";
}
catch (adLDAPException $e) {
    if($debug)echo $e;
    echo "Unable to connect to AD";
    exit();
}
/// initiate LDAP session - END





/// attempt to authenticate user against AD - START
if($debug)echo "<br>Attempting to authenticate user against AD...";
$authUser = $adldap->user()->authenticate($usrname, $password);
if ($authUser != true) {
  // getLastError is not needed, but may be helpful for finding out why:
	if($debug)echo $adldap->getLastError() . "... User AD authentication unsuccessful.<br>";
	if($debug)echo "Unsetting cookies ...<br>";
	setcookie ("sedwemgmtuser", "", time() - 3600, '/'); //unset cookie by setting expiry date to past
	setcookie ("sedwemgmt_user_name", "", time() - 3600, '/'); //unset cookie by setting expiry date to past
	setcookie ("sedwemgmtrole", "", time() - 3600, '/'); //unset cookie by setting expiry date to past
	echo "Username/password incorrect";
	exit();
  }

if($debug)echo "User authenticated successfully.<br>";
if($debug)echo "Setting cookie 'sedwemgmtuser' to '".$usrname."'<br>";
setcookie("sedwemgmtuser", $usrname, time() + 43200, '/');

// disconnect the LDAP connection todo: unsure this is correct
$adldap->__destruct();
/// attempt to authenticate user against AD - END


//// attempt to authenticate against SEDWE DB -- START
if($debug)echo "<br>Attempting to authenticate user against SEDWE...<br>";
//array of userRecord objects
$userRecords = array();
//userRecord objects (for debugging and potential future use)
class userRecord{
	var $uREmail, $uRName, $uRRole;
}

if($debug)echo "Attempting to connect to SEDWE DB...<br>";
require_once("/afs/.usgs.gov/www/caribbean-florida.water/private/config.php");

$dbconnect = new mysqli($dbhost, $username, $password, $dbname); // these variables defined in config.php file.
if($debug)echo "Creating dbconnect object...";

if (!$dbconnect) {
	die('Could not connect: ' . mysqli_error($con));
	echo "Unable to connect to SEDWE DB for authorization.";
	exit();
} else {
	if($debug)echo "Success!<br><hr>";
}


// assumption that all users are usgs.gov employees
$email = $usrname."@usgs.gov";
$user_name = $username;  // this should get overwritten, but just in case it doesn't.... it's at least set to the ad username

if($debug)echo "Checking for email: ".$email." using SQL statement:<br>";
$sql="SELECT DISTINCT * FROM USERS WHERE USERS.user_email='".$email."'";
if ($debug)	echo "$sql<br>";

$result = mysqli_query($dbconnect,$sql);

if ($debug)	echo "Results: <br>";

// Finding highest-privilege role
$highestRole = 3;
$roleValues = array(
   	1=> "Administrator",
   	2=>"Technician",
	3=>"Observer"
);

while($aRow = mysqli_fetch_array($result, MYSQLI_ASSOC)){
	if ($debug) {
		$userRecordObject = new userRecord();
		$userRecordObject->uREmail = $aRow["user_email"];
		$userRecordObject->uRName = $aRow["user_nm"];
		$userRecordObject->uRRole = $aRow["role_id"];
		$userRecords[$i] = $userRecordObject;//maybe use associative array in the future
		$rowEmail = $aRow["user_email"];
		$rowUsername = $aRow["user_nm"];
		$rowUserRole = $aRow["role_id"];
		echo "<hr>";
		echo "Email: " . $rowEmail . "<br>";
		echo "Username: ".$rowUsername."<br>";
		echo "Role: ".$rowUserRole."<br>";
  	}

	if($aRow["role_id"]<$highestRole) {
		if ($debug) echo "Higher Role Found: ".$roleValues[$aRow["role_id"]]." with value of ".$aRow['role_id']."<br>";
		$highestRole = $aRow["role_id"];
	 }
	if($debug)echo "<hr><br>";
	// get human-friendly user name
	$user_name = $aRow["user_nm"];
} // end while that moves through sql results
if ($debug) echo "Highest Level Role: ".$highestRole."<br>";
if ($debug) echo "Setting 'sedwemgmtrole' Cookie to ".$highestRole."<br>";
if ($debug) echo "Setting 'sedwemgmt_user_name' Cookie to ".$user_name."<br>";

if ($highestRole>2) {
	if($debug)echo "Role value too low. Unsetting cookies ...<br>";
	setcookie ("sedwemgmtuser", "", time() - 3600, '/'); //unset cookie by setting expiry date to past
	setcookie ("sedwemgmtrole", "", time() - 3600, '/'); //unset cookie by setting expiry date to past
	setcookie ("sedwemgmt_user_name", "", time() - 3600, '/'); //unset cookie by setting expiry date to past
	echo "Access level too low - Denied";
} else {
	setcookie("sedwemgmtrole", $highestRole, time() + 43200, '/');
	setcookie("sedwemgmt_user_name", $user_name, time() + 43200, '/');
  	// if authenticated against both AD and SEDWE, and both cookies set, return true.
  	if($debug)echo "<br> Both authentications worked and appropriate roll found.  In non-debug mode this would return now return 'true'.";
	echo "true";
}
//// attempt to authenticate against SEDWE DB -- END   //TODO: clean this up for the client side.


if($debug) {
	echo '<br><br><br><hr><hr><br><b>Full _POST data:</b><br>';
	foreach ( $_POST as $key=>$value )    {
		echo htmlspecialchars(' _POST['.$key.']=['.$value.']').'<br>';
  	}
	echo '<br><hr><br><b>Full COOKIE data:</b><br>';
	foreach ( $_COOKIE as $key=>$value )    {
    	echo htmlspecialchars(' _COOKIE['.$key.']=['.$value.']').'<br>';
  	}
	echo '<br><hr><br><b>Full _SESSION data:</b><br>';
	foreach ( $_SESSION as $key=>$value )    {
    	echo htmlspecialchars(' _SESSION['.$key.']=['.$value.']').'<br>';
  	}
}
?>