 var content='';
 var $content; 
  
  
 function clearXMLContent() {
     content = "";
	 $content = null;
 }
    
 function createContent(initialStr,stringType) {
//    xmlContent  ='<root><Source></Source><Event><Set></Set></Event></root>';	  
   // content  =initialStr;	  
//	htmlContent ='<html><body></body></html>';


//  content = '<?xml version="1.0" encoding="UTF-8"?>';
//  content+='<Source></Source><Event></Event>';	  
	if (stringType === 0) {
       $content = $($.parseXML(initialStr));
	} else {
		
		
	   $content = $($.parseHTML(initialStr));
	}
 }


  function getHTMLString() {
// 	content = $content);

    var xmlString = $content.prop('outerHTML');
	//return xmlString;
//	alert (xmlString);
  }
      
  function getXMLString() {
 	content = $($content);    // TODO - what is this?  -- turns out $content is where we are storing the XML data, rather than just returning it as needed

    if (window.ActiveXObject){ 
       var xmlString = content.xml; 
    } else {
       var oSerializer = new XMLSerializer(); 
       var xmlString = oSerializer.serializeToString(content[0]);
    }      

	  var prettyXML = vkbeautify.xml(xmlString);
	
	return prettyXML;
  }