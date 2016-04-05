/**
 * Created by jfederer on 3/4/2015.
 * These are stand-alone helper functions that do not read or write to local storage, but instead do all their work on what is passed to them.
 * They are allowed to modify the DOM.
 */
//Checks cache status
function checkCache() {
	if (window.applicationCache) {

		var appCache = window.applicationCache;
		//appCache.update();
		//console.log(appCache.status);

		switch (appCache.status) {
			case appCache.UNCACHED:
				// UNCACHED == 0
				return 'UNCACHED';
				break;
			case appCache.IDLE:
				// IDLE == 1
				return 'IDLE';
				break;
			case appCache.CHECKING:
				// CHECKING == 2
				return 'CHECKING';
				break;
			case appCache.DOWNLOADING:
				// DOWNLOADING == 3
				return 'DOWNLOADING';
				break;
			case appCache.UPDATEREADY:
				// UPDATEREADY == 4
				return 'UPDATEREADY';
				break;
			case appCache.OBSOLETE:
				// OBSOLETE == 5
				return 'OBSOLETE';
				break;
			default:
				return 'UKNOWN CACHE STATUS';
				break;
		}
		;
	}
	return 'NOT SUPPORTED';
}

function checkVersion() {
	// check the version if online
	if (navigator.onLine) {
		var thisVersion = '1.0.0';  // increment this every time an update is made to SedWE along with the php file and the about page.
		getCurrentVersionNumber(function(currentVersion) {
			if(thisVersion!=currentVersion) {
				alert("You are using an old version of SedWE (" + thisVersion +")... please refresh your browser.");
			}
		});
	}
}

function checkBrowser() {
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf("MSIE ");

	if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) {
		alert("WARNING!!!\n\nYou are using Internet Explorer.  SedWE is incompatible with IE and use of IE will corrupt your events.\n\nUse a different browser to access SedWE.");
	}


}

function changeParamByName(href, newVal) {
	var reExp = /containersQuantity=\d+/;
	var newUrl = href.replace(reExp, "containersQuantity=" + newVal);
	return newUrl;
}

function getCurrentContainerKey() {
	return '!C&'+ls.getItem('#currentEventNumber')+'&'+ls.getItem('#set')+'&'+ls.getItem('#currentContainerNumber');
}

function isEven(n)
{
	if(n%2==0) {

		return true;
	} else {

		return false;
	}
}

// provide an event, set, or container key or guid and this funtion will tell you if it's in a single or multi event
function isMulti(eventSetOrContainerKeyOrGUID) {
	if (eventSetOrContainerKeyOrGUID.indexOf('!E&')==0) { // was passed and eventKey
		return getURIItem(eventSetOrContainerKeyOrGUID,'singleOrMulti')=='multi';
	} else // is either a container, set, or guid... all of which have the event number after the first ampersand
		return isMulti('!E&'+eventSetOrContainerKeyOrGUID.split('&')[1]);    //todo: build a 'get event number' function rather than hard coding the array.  This is all over the place.
}

function getEventSummary(eventNumberOrEventKeyOrGUID, htmlIncluded) {
	//console.log('getEventSummary('+eventNumberOrEventKeyOrGUID+','+htmlIncluded+')');
	var eventID = eventNumberOrEventKeyOrGUID;  // assume we are passed an event number
	if(eventNumberOrEventKeyOrGUID.indexOf('!E')==0) { // it is an event key
		eventID=eventNumberOrEventKeyOrGUID.split('&')[1];
	} else if (isNaN(eventNumberOrEventKeyOrGUID)) { // it is the event guid
		eventID=getEventIDFromLS(eventNumberOrEventKeyOrGUID);
	}
	var eKey = '!E&'+eventID;

	if(htmlIncluded) { //todo: make responsive
		var ret =
			'<div class="ui-grid-a">'+
				'<div class="ui-block-a">' +
					'<div class="ui-bar">' +
						'<dl>' +
							'<dt>Event Default Date</dt><dd>' + getURIItem(eKey, 'evtDate') + '</dd>' +
							'<dt>Station ID</dt><dd>'+getURIItem(eKey, 'station')+'</dd>' +
							'<dt>Station Name</dt><dd>' + getURIItem(eKey, 'stationNm') + '</dd>' +
						'</dl>' +
					'</div>' +
				'</div>' +
				'<div class="ui-block-b">' +
					'<div class="ui-bar">' +
						'<dl>' +
							'<dt>Sediment Family</dt><dd>' + getURIItem(eKey, 'sampleType') + '</dd>' +
							'<dt>Sample Medium</dt><dd>' + getURIItem(eKey, 'sampleMedium') + '</dd>' +
							'<dt>Total Number of Containers</dt><dd>' + getNumberOfContainersForEvent(eKey) + '</dd>' +
						'</dl>' +
					'</div>'+
				'</div>'+
			'</div>';
	} else {
		var ret =
			'Event Date: ' + getURIItem(eKey, 'evtDate') + ' | ' +
			'Station ID'+ getURIItem(eKey, 'station')+' | ' +
			'Station Name' + getURIItem(eKey, 'stationNm') + ' | ' +
			'Sediment Family' + getURIItem(eKey, 'sampleType') + ' | ' +
			'Sample Medium' + getURIItem(eKey, 'sampleMedium') + ' | ' +
			'Total Number of Containers' + getNumberOfContainersForEvent(eKey);
	}
	return ret;

}

function getNumberOfContainersForEvent(eventNumberOrEventKeyOrGUID) {
	//console.log('getNumberOfContainersForEvent('+eventNumberOrEventKeyOrGUID+')');
	var totalNumberOfContainers = 0;
	var eventID = eventNumberOrEventKeyOrGUID;  // assume we are passed an event number
	if(eventNumberOrEventKeyOrGUID.indexOf('!E')==0) { // it is an event key
		eventID=eventNumberOrEventKeyOrGUID.split('&')[1];
	} else if (isNaN(eventNumberOrEventKeyOrGUID)) { // it is the event guid
		eventID=getEventIDFromLS(eventNumberOrEventKeyOrGUID);
	}

	loop1:
	for (var key in localStorage) {
		if(key.indexOf('!S&'+eventID)==0) {
			var setArray = ls.getItem(key).split('&');
			for (var i = 0; i < setArray.length; i++) {
				if (setArray[i].indexOf('containersQuantity')==0) {
					totalNumberOfContainers += parseInt(setArray[i].split('=')[1]);
					continue loop1;
				}
			}
		}
	}
	return totalNumberOfContainers
}


function emailEvent(eKey, callbackFunction) { /// todo return or callback?  right now just provides an alert of the results.
	console.log('emailEvent('+eKey+',callbackFunc)');
	getEventXML(eKey); // this sets up the getXMLString function (I think)

	var eventArray = getURIArray(eKey);
	var eKeyArr = eKey.split('&');
	var eventID = eKeyArr[1];
	var guid = getEventGUIDFromLS(eventID);
	var listOfEmailRecipients = ls.getItem('login_username') + "," + getStationsEmailRecipientsFnc(eventArray['station']);
	console.log('listOfEmailRecipients:' + listOfEmailRecipients);

	// note that sendEmailContent is a blocking syncronous ajax function.
	var emailMessage = sendEmailContent(getXMLString(), eventArray['station'], ls.getItem('login_username'), listOfEmailRecipients.replace('%2C', ','), eventArray['evtDate'], guid);

	if (emailMessage.indexOf('sent successfully')!=-1) {
		emailSuccess = true;
	} else {
		emailSuccess = false;
	}
	//alert('emailSuccess1:'+emailSuccess);
	if(emailSuccess) {   // it got emailed successfully, mark it into history.
		markAsHistoryLite(guid);
	}

	// we are submitting to email, thus this is now a historical event and can overwrite what was there is we want.
	saveEventToDB(getXMLString(), eventArray['station'], ls.getItem('login_username'), eventArray['evtDate'], 1, guid, true, function(successGUID) {
	//	success function
		if(emailSuccess) {
			saveSubmitDateTimeToDB(guid,getCurrentDateTime() );  // notes saveSubmitDateTimeToDB is async... so it won't block, but we don't get any response back.  It's only worth calling this if the DB save wortked and the email(submit) worked
			alert("Success!\n\nEvent ID: " + eKey.split('&')[1] + "\n\t (Station Number: " + getURIItem(eKey, 'station') + ", Station Name: " + getURIItem(eKey, 'stationNm') + ")\n\n has been emailed to " + ls.getItem('login_username') + " in a SedLOGIN-compatible XML file\n\n This event has also been saved to the SedWE database.");
		} else {
			alert("Partial Success!\n\nEvent ID: " + eKey.split('&')[1] + "\n\t (Station Number: " + getURIItem(eKey, 'station') + ", Station Name: " + getURIItem(eKey, 'stationNm') + ")\n\n has been written to the SedWE database.\n\nIf FAILED, however, to be emailed.  Please contact the SedWE team with this error and this code: " + guid);
		}
	}, function (failureGUID) {
		//failure function
		if(emailSuccess) {
			alert("Partial Success!\n\nEvent ID: " + eKey.split('&')[1] + "\n\t (Station Number: " + getURIItem(eKey, 'station') + ", Station Name: " + getURIItem(eKey, 'stationNm') + ")\n\n has been emailed to " + ls.getItem('login_username') + " in a SedLOGIN-compatible XML file\n\n This event FAILED to upload to the SedWE database.  Please contact the SedWE team with this error and this code: " + failureGUID);
		} else {
			alert("The event failed to email or save to the DB.  The most likely cause is lack of internet connection.  Please check your connection and try again.");
		}
	});
}

function attemptEventSubmit(eKey, callbackFunction) {
	console.log("attemptEventSubmit(" + eKey + ", callback)");
	setEventAsCurrentInLS(eKey.split('&')[1]);
	authenticate(
		function() {
			emailEvent(eKey, callbackFunction);
			callbackFunction()
			//attemptToSyncLSAndDB(SyncCompleteCallback, SyncFailCallback);
		},
		function (errorMessage) {
			alert(errorMessage);
			callbackFunction();
			//attemptToSyncLSAndDB(SyncCompleteCallback, SyncFailCallback);
	});
}


function getEventFromKey(key) {
	return key.split('&')[1];
}

function getSetFromKey(key) {
	if(key.indexOf('!C') == 0) {
		return key.split('&')[2];
	} else if (key.indexOf('!S')==0) {
		return key.substring(key.lastIndexOf('&')+1);
	} else {
		throw {
			name: "Invalid Parameter Exception",
			message: "Passed key (" + key + ") was not a set or container key"
		};
	}
}

function getContainerFromKey(key) {
	if(key.indexOf('!C')==0) {
		return key.substring(key.lastIndexOf('&')+1);
	} else {
		throw {
			name: "Invalid Parameter Exception",
			message: "Passed key (" + key + ") was not a container key"
		};
	}
}


// TODO:  CAn remove???
function clearXMLContent() {
	xmlDoc = "";
	$content = null;
}


function replaceAll(find, replace, str) {
	return str.replace(new RegExp(find, 'g'), replace);
}

/**
 * Traverse an XML Document
 *
 * @param xmlDoc The XML Document
 * @param idOfContainerDomElement The id of the DOM element to output the processed XML tags and values to
 * @initialMarginLeft The initial left margin in pixels: every time an element has childs (which means the function gets called recursively), we increase the indentation (the left margin) to keep it well-formatted and and follow the XML document's structure
 *
 * @author Sk8erPeter
 */
function traverseXmlDoc(xmlDoc, idOfContainerDomElement, initialMarginLeft) {
	var $xmlDocObj, $xmlDocObjChildren, $contentDiv;

	$contentDiv = $('#' + idOfContainerDomElement);
	if ($contentDiv.length === 0) {
		throw new Error('There are no DOM elements with this id: "' + idOfContainerDomElement + '"');
	}

	$xmlDocObj = $(xmlDoc);
	$xmlDocObjChildren = $(xmlDoc).children();

	if (!is_numeric(initialMarginLeft)) {
		initialMarginLeft = 0;
	}
	else {
		initialMarginLeft += 20;
	}

	$xmlDocObjChildren.each(function(index, Element) {
		var
			$currentObject = $(this),
		// does it have child elements? (if yes, we should call the function recursively)
			childElementCount = Element.childElementCount,
	//		currentNodeType = $currentObject.prop('nodeType'),
	//		currentNodeName = $currentObject.prop('nodeName'),
			currentTagName = $currentObject.prop('tagName'),
			currentTagText = $currentObject.text();

		$contentDiv.append($('<p>', {
			'class': 'tagname',
			'css': {
				'margin-left': initialMarginLeft
			},
			'html': 'Tagname: ' + currentTagName
		}));

		// if it has child nodes, then we call this function recursively
		if (childElementCount > 0) {
			traverseXmlDoc($currentObject, idOfContainerDomElement, initialMarginLeft);
		}
		else {
			// if it doesn't have child nodes, we
			$contentDiv.append($('<p>', {
				'class': 'tagvalue',
				'css': {
					'margin-left': initialMarginLeft+initialMarginLeft
				},
				'html': 'Tagvalue: ' + currentTagText
			}));
		}
	});
}

function generateGUID() {
	var emailadd = ls.getItem('login_username');
	var ind =  emailadd.indexOf('@');
	var username = emailadd.slice(0,ind);
	var uuidTemplate = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'; // start with the base of a standard guid;
	while(username.length + uuidTemplate.length < 63) { /// add characters to it to fill the full char(64) space int he DB) (noting the understcore added later)
		uuidTemplate += 'x';
	}
Math.uuid
	var uuid = uuidTemplate.replace(/[xy]/g, function(c) {
		var r = Math.random()*35|0, v = c == 'x' ? r : (r&0x3|0x8);  // added complexity out to 35 types of characters instead of 16
		return v.toString(35);
	});
	return uuid+"_"+username;
}

/**
 * Finds whether a variable is a number or a numeric string
 *
 * @see http://phpjs.org/functions/is_numeric
 *
 * @param mixed_var The variable being evaluated.
 */
function is_numeric(mixed_var) {
	return (typeof(mixed_var) === 'number' || typeof(mixed_var) === 'string') && mixed_var !== '' && !isNaN(mixed_var);
}


//ADDNODE: insert a node within the XML to be sent by email
//option 0: append, 1: after
//StringType 0:xml, 1:html
/*
function addNode(searchTag, nodeStr,nodeTag,option,searchValue,stringType) {
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
				alert("xxxx "+$(xmlDoc).find("tr")[0]);
				$(xmlDoc).find("tr")[0].append($nodeStr);
				// $(content).find(searchTag).get(0).appendChild(newNode);
			} else {
				$content.find(searchTag+":Contains('"+searchValue+"')").get(0).parentNode.appendChild(newNode);
			}
			//$nodeStr = $($.parseHTML(nodeStr));
		}
		//console.log("adding 1.... "+nodeStr);
		//var newNode = $nodeStr.find(nodeTag).get(0);
		//var newNode = $nodeStr.find(nodeTag).get(0);
		//alert("nodeStr: "+newNode);

		// alert("text "+	$content.find("root > Event > beginDate").text());
/*	} catch (e) {
		//alert(e);
		// console.log("addNode error: "+e);
	}
} */

function getHTMLString() { //TODO -- is this ever called??
	alert("getHTMLString - PLEASE NOTIFY JFEDERER@USGS.GOV if you see this message");
// 	content = $content);

	var xmlString = $content.prop('outerHTML');
	//return xmlString;
//	alert (xmlString);
}

function saveContainerXMLtoLS(key,isFirst) { //TODO -- is this ever called??
	alert("saveContainerXMLtoLS in helperFunctions.js - PLEASE NOTIFY JFEDERER@USGS.GOV if you see this message");
	var xmlc = "";
	//saveToLocalStorage('!C&'+eventCounter + '&' + setStr + '&' + i,'');
	var query = ls.getItem(key);
	var data = query.split("&");
	var analyses= [];

	var node = "";
	//console.log("CONTAINERXML");
	//createContent('<root><Source></Source><Event><Set><Sample></Sample></Set></Event></root>',0);
	//createContent('<Sample></Sample>',0);
	//addNode("Set","<Sample></Sample>","Sample",0,null,0);

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
				case 'P82074':
				case 'P04121':
				case 'P82073':
				case 'P30333':
				case 'P04120':
					node='<Param><Name>' + item[0] + '</Name><Value>'+item[1]+'</Value></Param>';
					addNode("Sample",node,"Param",0,null,0);
					break;
				case 'P00009R':
				case 'P72103R':
				case 'P00003R':
				case 'P04120R':
				case 'P04121R':
				case 'P30333R':
				case 'P82073R':
				case 'P82074R':
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

//Update icon if user added data in the dialog window. Otherwise the icon will be
//minus, indicating that nothing has been entered in the dialog.
function anyChangeInPopupData(objName, anyNull) {
	var partial = false;
	var tempObj = "#" + objName + "R";

	if ($(tempObj).val() !== " ") {
		partial = true;
	}
	tempObj = "#" + objName + "M";
	if ($(tempObj).val() !== " ") {
		partial = true;
	}

	if (anyNull === 1) {
		tempObj = "#" + objName + "N";
		if ($(tempObj).val() !== " ") {
			partial = true;
		}
	}

	if (partial === false) {
		$('#popup' + objName).attr('data-icon', 'minus');
		$('#popup' + objName).removeClass('ui-icon-plus').addClass('ui-icon-minus');
	}
	else {
		$('#popup' + objName).attr('data-icon', 'plus');
		$('#popup' + objName).removeClass('ui-icon-minus').addClass('ui-icon-plus');
	}
}

function setHeaderText(obj, txt) {
	$(obj).text(txt);
}

function chkBoxbyName(targetName) {
	var groupVals = [];
	//$.each($('input[id^="addOnAnalysis"]:checked'), function(){
	$.each($('input[id^="' + targetName + '"]:checked'), function () {
		groupVals.push($(this).val());
	});

	if (groupVals.length > 0) save_data(targetName, groupVals.join(","));
	else save_data(targetName, '');
}

