 var content='';
 var $content; 
 var xml='';  
  
// var ls1 = window.localStorage;
  
// console.log(ls1.getItem("#brokenContainer"));
 function clearXMLContent() {
     content = "";
	 $content = null;
 }
    
 function inputXMLContent(inputXML) {
	 console.log("InputXMLContent");
    var localS = window.localStorage;
	setEventCounter();
	
	var eventC = parseInt(ls.getItem("!EC"));
	xml = inputXML;
	//console.log("processing XML... this is a test");
	//console.log(xml);

	content = $.parseXML(xml),
	$xml = $(content),
	$evento = $xml.find("Event");
	$('#openXMLMessageToUser').empty();
	$xml.find("Event").each(function(index, element) {
		var eventString;
		//COMONO TENGO USERTYPE, ASUMIR TECHNICIAN (COGER EL DEL USUARIO CORRIENTE)
		//SINGLE OR MULTI, SACARLO DEL NOMBRE DEL SET
		//EVENT, sacarlo del primer set
		var eventID = $(this).find("EventNumber").text();
		var siteID = $(this).find("SiteId").text();
		$('#openXMLMessageToUser').append("<p>Processing XML data for "+siteID+" station</p>");
		var agencyCd = $(this).find("AgencyCd").text();
		var siteNm = $(this).find("SiteNm").text();
		var sedT = $(this).find("SedTranspMode").text(); //sampleType
		var SampleM = $(this).find("SmplMediumCode").text(); //sampleMedium
		var Ave = $(this).find("AvgRepMeasures").text();
		var singleOrMulti = '';
		var EVENT = '';
		var userType = ls.getItem('userType');
		var collectedVia = $(this).find("CollectedVia").text();


		eventString = "userType=" + userType + "&station=" + siteID + "&sampleType=" + sedT + "&sampleMedium=" + SampleM + "&averageRep=" + Ave + "&agencyCd=" + agencyCd + "&stationNm=" + siteNm + "&CollectedVia=" + collectedVia;
		var eventFieldComments = $(this).find("EventFieldComments").text();
		if (eventFieldComments.length!=0) {
			eventString += "&EventFieldComments="+eventFieldComments;
		}

		$(this).find("Set").each(function(indexS, element) {
			//console.log("En SET: index="+indexS);
			var setString = "";
            var setName = $(this).children("Name").text();
			
			var numSamples = $(this).children("NumberOfSamples").text(); //containersQuantity
			$('#openXMLMessageToUser').append("<p>Found Set "+setName+" with "+numSamples+" of samples</p>");
			var aSamples = $(this).children("AnalyzeIndSamples").text(); //compositeOrIndividual
			var analiz = $(this).children("Analyses").text();			 //analysis
			var setType = $(this).children("SetType").text();			 //????
			var setFieldComments = $(this).children("SetFieldComments").text(); //SetFieldComments


			var singleOrMulti='';
			
			setString = "containersQuantity="+numSamples+"&analyzeIndSamples="+aSamples+"&analysis="+analiz;
			if (setFieldComments.length!=0) {
				setString += "&SetFieldComments" + setFieldComments;
			}
			if (setType != '') {
				setString = setString + "&setType="+setType;
			}
			if (setName == 'Sngl') {        /////VERIFY (USE Sngl)
				singleOrMulti = 'single';
				setName = 'A'; 
			} else {
				singleOrMulti = 'multi';
			}
			if (indexS == 0) {
				eventString = eventString+"&singleOrMulti="+singleOrMulti;
				saveToLocalStorage('!E&'+eventC,eventString);
			}
			//console.log("S!: "+setString);
		    saveToLocalStorage('!S&'+eventC + '&'+setName, setString);

				
			$(this).find("Sample").each(function(index, element) {
				var sampleString = "";
				var sNum = $(this).find("SampleNumber").text();//containerNum
				var bDate = $(this).find("BeginDate").text(); //beginDate
				var containerFieldComments = $(this).find("ContainerFieldComments").text();//containerFieldComments
				var bTime = $(this).find("BeginTime").text(); //beginTime
				var eDate = $(this).find("EndDate").text();   //endDate
				var eTime = $(this).find("EndTime").text();   //endTime
				var v1 = $(this).find("TimeDatum").text();    //timeDatum
				var v2 = $(this).find("AddOnAnalyses").text();//trabajar esto!!!!!!!!!!
				var v3 = $(this).find("Broken").text();       //brokenContainer
				var v4 = $(this).find("CollecAgency").text(); //collectingAgency
				var v5 = $(this).find("Initials").text();     //collectorInitials
				var v6 = $(this).find("Hstat").text(); //HSTAT
				var v7 = $(this).find("HydEvent").text(); //EVENT
				var v8 = $(this).find("Stype").text(); //STYPE
				
				var v9 = $(this).find("Astat").text(); //ASTAT //><P71999>10</P71999><P82398>40</P82398><P84164>
				var v10 = $(this).find("P71999").text();
				var v11 = $(this).find("P82398").text();
				var v12 = $(this).find("P84164").text();
				
				
				var v13 = $(this).find("M2Lab").text(); //M2Lab
				var v14 = $(this).find("ContainerNumber").text(); //ContainerNum
				
				if(indexS == 0 && index == 0) {
					eventString = eventString+"&evtDate="+bDate+"&EVENT="+v7;
					saveToLocalStorage('!E&'+eventC,eventString);
				}
								
				sampleString = "beginDate="+bDate+"&beginTime="+bTime;
				if (eDate != "") sampleString = sampleString+"&endDate="+eDate;
				if (eTime != "") sampleString = sampleString+"&endTime="+eTime;
				sampleString = sampleString+"&timeDatum="+v1;
				if (v3 != "") sampleString = sampleString+"&brokenContainer="+v3;
				sampleString = sampleString+"&collectingAgency="+v4;
				if (v5 != "") sampleString = sampleString+"&collectorInitials="+v5;
				sampleString = sampleString+"&HSTAT="+v6+"&EVENT="+v7+"&STYPE="+v8+"&ASTAT="+v9;
				
				if (v10 != "") sampleString = sampleString+"&P71999="+v10;
				sampleString = sampleString+"&P82398="+v11+"&P84164="+v12;
				
				if (v13 != "") sampleString = sampleString+"&M2Lab="+v13;
				if (v14 != "") sampleString = sampleString+"&containerNum="+v14;
				
				console.log("C!: "+sampleString);
				$(this).find("Param").each(function(index, element) {
					var paramString = "";
					var p1 = $(this).find("Name").text();
					var p2 = $(this).find("Value").text();
					var p3 = $(this).find("Rmrk").text();
					var p4 = $(this).find("NullQlfr").text();
					var p5 = $(this).find("Method").text();
					paramString = p1+"="+p2;
					if (p3 != "") paramString = paramString+"&"+p1+"R="+p3;
					if (p4 != "") paramString = paramString+"&"+p1+"N="+p4;
					if (p5 != "") paramString = paramString+"&"+p1+"M="+p5;
					console.log("Param: "+paramString);
					sampleString = sampleString+"&"+paramString;
				});
				if(containerFieldComments.length!=0) {
					sampleString += "&ContainerFieldComments" + containerFieldComments;
				}
				saveToLocalStorage('!C&'+eventC + '&' + setName + '&' + sNum,sampleString);
			});
			//console.log("end set");
        });
       // console.log("end set");
    });
	 //  console.log("end");
	   $('#openXMLMessageToUser').append("<p><strong>To review this Event, please go to Users menu and click on Current Shipment</strong></p>");
	
    //  $content = $($.parseXML(initialStr));
 }
  
//ADDNODE: insert a node within the XML to be sent by email  
//option 0: append, 1: after
//StringType 0:xml, 1:html   s
 function addNode(searchTag, nodeStr,nodeTag,option,searchValue,stringType) {
//console.log('addNode('+searchTag+', '+nodeStr+', '+nodeTag+', '+option+', '+searchValue+', '+stringType + ')');
	//if (option == 1)  alert("adding node: "+targetKeyStr+" "+newValueStr+" "+sourceKeyStr);
  var $nodeStr;
//console.log("adding 0....last get "+nodeStr);
  try {
	
	if (stringType === 0) {
		$nodeStr = $($.parseXML(nodeStr));
		var newNode = $nodeStr.find(nodeTag).get(0);
   	    if (option === 0) {
		   //$content.find(searchTag).get(0).appendChild(newNode);
		   var elements =  $content.find(searchTag).length;
		   $content.find(searchTag).get(elements-1).appendChild(newNode);
	    } else if (option == 1) {
			var elements =  $content.find(searchTag+":Contains('"+searchValue+"')").length;
	       //$content.find(searchTag+":Contains('"+searchValue+"')").get(0).parentNode.appendChild(newNode);
		   $content.find(searchTag+":Contains('"+searchValue+"')").get(elements-1).parentNode.appendChild(newNode);
	    } else {
			$content.find(searchTag).get(0).after(newNode);
		}

	} else {
	  if (option === 0) {
		 $nodeStr = $(nodeStr);
		 alert("xxxx "+$(content).find("tr")[0]);
		 $(content).find("tr")[0].append($nodeStr);
		 // $(content).find(searchTag).get(0).appendChild(newNode);
	  } else {
	      $content.find(searchTag+":Contains('"+searchValue+"')").get(0).parentNode.appendChild(newNode);
	  }
		//$nodeStr = $($.parseHTML(nodeStr));
	}
   } catch (e) {
   }
 }

  function getHTMLString() {
// 	content = $content);

    var xmlString = $content.prop('outerHTML');
	//return xmlString;
//	alert (xmlString);
  }


	function saveContainerXMLtoLS(key,isFirst) {
		console.log("saveContainerXMLtoLS(" + key + ", "+isFirst+")");
		alert("Here: xmlToLocalStorage.js - getContainerXML");
	var xmlc = "";
    var query = ls.getItem(key);
    var data = query.split("&");
	var analyses= [];

    var node = "";
	
    for (var i = 0; i < data.length; i++) {
		
        var item = data[i].split("=");
		
		if(item[1] === '+' || item[1] ===''){
		
		}else{
		switch(item[0]){
			
			case 'beginDate':
				//xmlc=xmlc+'<beginDate>' + decodeURIComponent(item[1]) + '</beginDate>';
				node='<Sample><BeginDate>' + decodeURIComponent(item[1]) + '</BeginDate></Sample>';
				//if (isFirst)
				    addNode("Set",node,"Sample",0,null,0);
				//else 
				//addNode('Sample',node,"Sample",2,null,0);
				
				break;
				
			case 'beginTime':
				//xmlc=xmlc+'<beginTime>'+ item[1].replace('%3A',':') + '</beginTime>';
				node  = '<BeginTime>'+ item[1].replace('%3A',':') + '</BeginTime>';
				addNode("Sample",node,"BeginTime",0,null,0);
				break;
			case 'timeDatum':
				node='<TimeDatum>' + item[1] + '</TimeDatum>';
				addNode('Sample',node,"TimeDatum",0,null,0);
				break;
			case 'brokenContainer':
				node='<Broken>' + item[1] + '</Broken>';
				addNode('Sample',node,"Broken",0,null,0);
				break;
			case 'collectingAgency':
				node='<CollecAgency>' + item[1] + '</CollecAgency>';
				addNode('Sample',node,"CollecAgency",0,null,0);
				break;
			case 'collectorsInitials':
				node='<Initials>' + item[1] + '</Initials>'; 
				addNode('Sample',node,"Initials",0,null,0);
				break;
			case 'containerNum':
				node='<ContainerNumber>' + item[1] + '</ContainerNumber>'; 
				addNode('Sample',node,"ContainerNumber",0,null,0);
				break;
			case 'HSTAT':
				node='<Hstat>' + item[1] + '</Hstat>'; 
				addNode('Sample',node,"Hstat",0,null,0);break;
			case 'EVENT':
				node='<HydEvent>' + item[1] + '</HydEvent>'; 
				addNode('Sample',node,"HydEvent",0,null,0);break;
			case 'STYPE':
				node='<Stype>' + item[1] + '</Stype>'; 
				addNode('Sample',node,"Stype",0,null,0);break;
			case 'ASTAT':
				node='<Astat>' + item[1] + '</Astat>';
				addNode('Sample',node,"Astat",0,null,0);
				break;
			case 'P71999':
			case 'P82398':
			case 'P84164':
				node='<'+item[0]+'>' + item[1] + '</'+item[0]+'>';
				addNode("Sample",node,item[0],0,null,0);
				break;
			case 'P00009':
			case 'P72103':
			case 'P00003':
			case 'P00004':
			case 'P00064':
			case 'P00061':
			case 'P00010':
			case 'P00063':
			case 'P00020':
			case 'P04117':
			case 'P04118':
			case 'P00095':
			case 'P00065':
			case 'P63675':
			case 'P63680':
			case 'P65225':
			case 'P63676':

			case 'P04121':
			case 'P30333':
			case 'P04120':
				node='<Param><Name>' + item[0] + '</Name><Value>'+item[1]+'</Value></Param>';
				addNode("Sample",node,"Param",0,null,0);
				break;
			case 'P82073':
			case 'P82074':
				alert('P82073/4: ' + item[1]);
				node='<Param><Name>' + item[0] + '</Name><Value>'+item[1]+'</Value></Param>';
				addNode("Sample",node,"Param",0,null,0);
				break;
			case 'P00009R':
			case 'P72103R':
			case 'P00003R':
			case 'P04120R':
			case 'P04121R':
			case 'P30333R':
			case 'P00004R':
			case 'P00010R':
			case 'P00020R':
			case 'P63675R':
			case 'P63676R':
			case 'P00063R':
			case 'P63680R':
			case 'P00095R':
			case 'P65225R':
			case 'P00065R':
			case 'P00061R':
			case 'P00064R':
				node='<Rmrk>' + item[1] + '</Rmrk>';
				addNode("Name", node,"Rmrk",1,item[0].substring(0,item[0].length - 1),0);
				break;
			case 'P82073R':
			case 'P82074R':
				alert('P82073R/4R: ' + item[0]);
				node='<Rmrk>' + item[1] + '</Rmrk>';
				addNode("Name", node,"Rmrk",1,item[0].substring(0,item[0].length - 1),0);
				break;
			case 'M2Lab':
				node='<M2Lab>' + item[1].replace(/\+/g, ' ') + '</M2Lab>';
				addNode("Sample",node,item[0],0,null,0);
				break;
			case 'P00061M':
			case 'P65225M':
			case 'P00010M':
			case 'P00020M':
			case 'P00065M':
			case 'P63676M':
			case 'P63680M':
			case 'P00095M':
			case 'P63675M':
				node='<Method>' + item[1] + '</Method>';
				addNode("Name",node,"Method",1,item[0].substring(0,item[0].length - 1),0);
				break;
			case 'P00095N':
			case 'P63680N':
			case 'P00010N':
			case 'P65225N':
			case 'P00020N':
			case 'P63675N':
			case 'P63676N':
				node='<NullQlfr>' + item[1] + '</NullQlfr>';
				addNode("Name",node,'NullQlfr',1,item[0].substring(0,item[0].length - 1),0);
				break;
			case 'P04119':
				node='<Param><Name>' + item[1] + ' s</Name></Param>';
				addNode("Sample",node,"Param",0,null,0);
				break;
			
        }

    }

 }
   //      alert(xmlc);
		// return getXMLString();
}


