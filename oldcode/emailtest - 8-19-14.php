
<?php

$str = " ";

//echo $_POST['etest'];

if (isset($_POST['etest'])) {
    $str = $_POST['etest'];   
    echo "got string message ".strlen($str);
    echo "The string: '<i>".$str."</i>' contains ". strlen($str). ' characters and '. str_word_count($str, 0). ' words.';
}
if (isset($_POST['to'])) {
    $to = $_POST['to'];    
    //echo "got string message ".strlen($str);
    //echo "The string: '<i>".$str."</i>' contains ". strlen($str). ' characters and '. str_word_count($str, 0). ' words.';
}
if (isset($_POST['siteid'])) {
    $siteid = $_POST['site'];    
    //echo "got string message ".strlen($str);
    //echo "The string: '<i>".$str."</i>' contains ". strlen($str). ' characters and '. str_word_count($str, 0). ' words.';
}
if (isset($_POST['from'])) {
    $eFrom = $_POST['from'];    
    //echo "got string message ".strlen($str);
    //echo "The string: '<i>".$str."</i>' contains ". strlen($str). ' characters and '. str_word_count($str, 0). ' words.';
}

  // $to = "dlopez@usgs.gov";
   $subject = "Sample data from station ".$siteid.", in XML format";
  // $emailBody .= "<html><body>".$str."</body></html>";
  // $message = "<b>This is HTML message.</b>";
   $message .= "<h2>Sample data from station ".$siteid.", in XML format</h2>";
   $message .= "<p><span style=\"font-family: monospace;\">".$str."</p>";

   //boundary
   $boundary = md5(time());

   $header = "From:".$eFrom."\r\n";
   //$header = "Cc:diannepr@google.com \r\n";
   $header .= "MIME-Version: 1.0\r\n";
   $header .= "Content-Type: multipart/mixed;boundary=\"" . $boundary . "\"\r\n"; 
   
   //$file_path_name = "xmlfile.xml";
   
   $output = "--".$boundary."\r\n".

        //$output .= "Content-Type: text/csv; name=\"result.csv\";\r\n";\
		$output .= "Content-Type: application/xml; name=\"result.xml\";\r\n";
        $output .= "Content-Disposition: attachment;\r\n\r\n";
        $output .= $str."\r\n\r\n";
		$output .= "--".$boundary."\r\n";
        $output .= "Content-type: text/html; charset=\"utf-8\"\r\n";
        $output .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
		$output .= $message."\r\n\r\n";
		$output .= "--".$boundary."--\r\n\r\n";



/*
        "Content-Type: text/plain; charset=\"iso-8859-1\"\n".
        "Content-Transfer-Encoding: 7bit\n\n".
        "$str\n\n".
        "--$div\n".
        "Content-Type: application/octet-stream; name=\"$base\"\n".
        "Content-Description: $base\n".
        "Content-Disposition: attachment;\n".
        " filename=\"$base\"; size=$size;\n".
        "Content-Transfer-Encoding: base64\n\n".
        "$attachment\n\n".
        "--$div\n";
		*/



   $retval = mail ($to,$subject,$output,$header);
   if( $retval == true ) {
      echo "Message sent successfully...characters: ".strlen($str);
   } else {
      echo "Message could not be sent...";

   }
   

?>
