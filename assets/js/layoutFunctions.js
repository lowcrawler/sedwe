/**
 * Created by jfederer on 3/2/2015.
 *
 * Functions in this file will lay out and fill content pages.  They will not directly make changes to the DB or local storage but likely rely on LS values being set in order to lay out correctly.
 */



function addSampleButtons(eventID, letter, counter, xxx) { // todo: what the heck is XXX

	//todo:  perhaps delete entire function?

	var keyStr = '!C&' + eventID + '&' + letter + '&' + counter;
	var eventStr = '!E&' + eventID;
	//console.log("addsamplecounter -> "+eventArray['singleOrMulti']);
	if (xxx === 0)
		if (eventArray['singleOrMulti'] === 'single') {  // todo: surely this can be written with less duplication
			$('#set').append('<p id="sampleLabel' + eventID + letter + counter + '"><strong>Sample ' + counter + '&nbsp;&nbsp;</strong>' +
				createButton('Edit', '#sampleParametersPage', "setContainerAsCurrentInLS('" + eventID + "','" + letter + "','" + counter + "');saveToLocalStorage('createOrEdit','edit')", 'edit' + counter) +
				createButton('View', '#viewSamplePage', "save_data('currentContainerKey','" + keyStr + "');", 'view' + counter) +
					//createButton('View', '#viewSamplePage', "getContainerHTML('" + keyStr + "',\'" + eventArray['station'] + "\',\'" + letter + "\',\'" + counter + "\');", 'view' + counter) +
				createButton('Delete', '#deleteDialog', 'deleteDialog(\'0\',\'0\',\'' + eventID + '\',\'' + letter + '\',\'' + counter + '\');', 'delete' + counter) + '</p>').enhanceWithin();
		} else {
			$('#set' + letter).append('<p id="sampleLabel' + eventID + letter + counter + '"><strong>Sample ' + counter + '&nbsp;&nbsp;</strong>' +
				createButton('Edit', '#sampleParametersPage', "setContainerAsCurrentInLS('" + eventID + "','" + letter + "','" + counter + "');saveToLocalStorage('createOrEdit','edit')", 'edit' + counter) +
				createButton('View', '#viewSamplePage', "save_data('currentContainerKey','" + keyStr + "');", 'view' + counter) +
					//createButton('View', '#viewSamplePage', "getContainerHTML('" + keyStr + "',\'" + eventArray['station'] + "\',\'" + letter + "\',\'" + counter + "\');", 'view' + counter) +
				createButton('Delete', '#deleteDialog', 'deleteDialog(\'0\',\'1\',\'' + eventID + '\',\'' + letter + '\',\'' + counter + '\');', 'delete' + counter) + '</p>').enhanceWithin();
		}

	else if (eventArray['singleOrMulti'] === 'single') {
		$('#sampleLabel' + eventID + letter + (parseInt(counter) - 1)).after('<p id="sampleLabel' + eventID + letter + counter + '"><strong>Sample ' + counter + '&nbsp;&nbsp;</strong>' +
			createButton('Edit', '#sampleParametersPage', "setContainerAsCurrentInLS('" + eventID + "','" + letter + "','" + counter + "');saveToLocalStorage('createOrEdit','edit')", 'edit' + counter) +
			createButton('View', '#viewSamplePage', "save_data('currentContainerKey','" + keyStr + "');", 'view' + counter) +
				//createButton('View', '#viewSamplePage', "getContainerHTML('" + keyStr + "',\'" + eventArray['station'] + "\',\'" + letter + "\',\'" + counter + "\');", 'view' + counter) +
			createButton('Delete', '#deleteDialog', 'deleteDialog(\'0\',\'0\',\'' + eventID + '\',\'' + letter + '\',\'' + counter + '\');', 'delete' + counter) + '</p>').enhanceWithin();
	} else {
		$('#sampleLabel' + eventID + letter + (parseInt(counter) - 1)).after('<p id="sampleLabel' + eventID + letter + counter + '"><strong>Sample ' + counter + '&nbsp;&nbsp;</strong>' +
			createButton('Edit', '#sampleParametersPage', "setContainerAsCurrentInLS('" + eventID + "','" + letter + "','" + counter + "');saveToLocalStorage('createOrEdit','edit')", 'edit' + counter) +
			createButton('View', '#viewSamplePage', "save_data('currentContainerKey','" + keyStr + "');", 'view' + counter) +
				//createButton('View', '#viewSamplePage', "getContainerHTML('" + keyStr + "',\'" + eventArray['station'] + "\',\'" + letter + "\',\'" + counter + "\');", 'view' + counter) +
			createButton('Delete', '#deleteDialog', 'deleteDialog(\'0\',\'1\',\'' + eventID + '\',\'' + letter + '\',\'' + counter + '\');', 'delete' + counter) + '</p>').enhanceWithin();
	}
}


function viewSamplePageLayout() {


	console.log("viewSamplePageLayout()");
	var containerKey = ls.getItem('#currentContainerKey');
	var eventNum = getEventFromKey(containerKey);
	var setLetter = getSetFromKey(containerKey);
	var containerNum = getContainerFromKey(containerKey);
	getEventXML('!E&' + eventNum); // note, this 'getter' doesn't actually get anything, which makes no sense but that's how they were programmed
	var xmlString = getXMLString();
	var xmlDoc = loadXMLString(xmlString);
	console.log(xmlString);

	var eventInfoToAppend = "<h4 style='margin-bottom:-10px'>Event Summary:</h4>";
	var eventSummary = getEventSummary(eventNum, true);
	var addToFirstColumn = '<dt>Collected Via</dt><dd>'+getURIItem("!E&"+eventNum, "CollectedVia")+'</dd>';
	var addToSecondColumn = '<dt>Agency Code</dt><dd>'+getURIItem("!E&"+eventNum, "agencyCd")+'</dd>';
	var rawEventComments = getURIItem("!E&"+eventNum, "EventFieldComments");
	var eventComments = "";
	if(rawEventComments!="") {
		eventComments = '<div style="margin-top:-10px;"><dt>Event Comments</dt><dd>'+getURIItem("!E&"+eventNum, "EventFieldComments")+'</dd>';
	}

	eventSummary = [eventSummary.slice(0,eventSummary.indexOf('</dl>')), addToFirstColumn,  eventSummary.slice(eventSummary.indexOf('</dl>'))].join('') ;
	eventSummary = [eventSummary.slice(0,eventSummary.lastIndexOf('</dl>')), addToSecondColumn,  eventSummary.slice(eventSummary.lastIndexOf('</dl>'))].join('') ;

	eventInfoToAppend += eventSummary + eventComments;


	var setInfoToAppend = "<h4 style='margin-bottom:-10px'>Set \'" + setLetter + "\' Summary:</h4>" +
	'<div class="ui-grid-a">'+
		'<div class="ui-block-a">' +
			'<div class="ui-bar">' +
				'<dl>' +
					'<dt>Number of Samples</dt><dd>'+getURIItem("!S&"+eventNum+"&"+setLetter, 'containersQuantity')+'</dd>' +
					'<dt>Analysed Individually</dt><dd>' + getURIItem("!S&"+eventNum+"&"+setLetter, 'analyzeIndSamples') + '</dd>' +
				'</dl>' +
			'</div>' +
		'</div>' +
		'<div class="ui-block-b">' +
			'<div class="ui-bar">' +
				'<dl>' +
					'<dt>Analyses</dt><dd>' + getURIItem("!S&"+eventNum+"&"+setLetter, 'analysis') + '</dd>' +
					'<dt>Set Type</dt><dd>' + getURIItem("!S&"+eventNum+"&"+setLetter, 'setType') + '</dd>' +
				'</dl>' +
			'</div>'+
		'</div>'+
	'</div>';

	var rawSetComments = getURIItem("!S&"+eventNum+"&"+setLetter, "SetFieldComments");
	var setComments = "";
	if(rawSetComments!="") {
		setComments = '<div style="margin-top:-10px;"><dt>Set \'' + setLetter + '\' Comments</dt><dd>'+getURIItem("!S&"+eventNum+"&"+setLetter, "SetFieldComments")+'</dd>';
	}

	setInfoToAppend += setComments;

	$('#EventAndSetInfo').empty();
	$('#EventAndSetInfo').append(eventInfoToAppend + "<hr>" + setInfoToAppend);


	containerNode = getContainerAsXMLNode();

	var containerInfoToAppend = "<h3>Sample Information:</h3>";
	containerInfoToAppend += parseContainerNodeForDisplay(containerNode);
	$('#ContainerInfo').empty();
	$('#ContainerInfo').append(containerInfoToAppend);




	function parseContainerNodeForDisplay(xmlNode) {
		function getNodeString(node) {
			return "<dt>" + node.nodeName + "</dt><dd>" + node.childNodes[0].nodeValue + "</dd>";
		}


		var rowCounter = 0;
		var tdStr = "<table class='containerTable'>\n";
			for(var i = 0; i<xmlNode.childNodes.length;i++) {
				//console.log(xmlNode.childNodes[i].nodeName);
				var curNode = xmlNode.childNodes[i];
				if( curNode.nodeType !=3 && curNode.nodeName != "ContainerFieldComments") {
					rowCounter++;

					if( curNode.nodeName != "Param") {
						if(isEven(rowCounter)) {tdStr += "<tr>";}
						tdStr += "<td  class='containerTable'>" + getNodeString(curNode) + "</td>\n";
						if(!isEven(rowCounter)) {tdStr += "</tr>"; }
					} else { // is a param node
						if(isEven(rowCounter)) {tdStr += "<tr>";}
						tdStr += "<td class='containerTable'><dt>" + curNode.getElementsByTagName('Name')[0].childNodes[0].nodeValue + "</dt><table class='paramTable'>";
						for (var j = 0; j < curNode.childNodes.length; j++) {
						//	console.log('paraNode.childNode['+j+']: ' + curNode.childNodes[j].nodeName);
							if(curNode.childNodes[j].nodeType!=3 && curNode.childNodes[j].nodeName !="Name" ) {
								tdStr += "<tr class='paramTable'><td class='paramTable'>"+ getNodeString(curNode.childNodes[j]) + "</td></tr>";
							}
						}
						tdStr += "</tr></table></td>\n";
						if(!isEven(rowCounter)) {tdStr += "</tr>";}
					}
				}
			}

		retStr = tdStr ;

		var rawSampComments = getURIItem(ls.getItem('#currentContainerKey'), "ContainerFieldComments");
		var sampComments = "";
		if(rawSampComments!="") {
			sampComments = '<tr><td class="containerTable" colspan="2"><div style="margin-top:0px;"><dt>Container Comments</dt><dd>'+getURIItem(ls.getItem('#currentContainerKey'), "ContainerFieldComments")+'</dd></td></tr>';
		}

		retStr += sampComments + "</table>";
		return retStr;
	}

	function getSetAsXMLNode(xmlDoc) {
		var xmlDoc = loadXMLString(xmlString);

		// find the set in the xml
		var theSet;
		var sets = xmlDoc.getElementsByTagName('Set');
		if (sets.length = 1) {
			theSet = sets[0];
		}
		for (var i = 0; i < sets.length; i++) {
			console.log("Checking Sets: " + sets[i].getElementsByTagName('Name')[0].childNodes[0].nodeValue);
			if (sets[i].getElementsByTagName('Name')[0].childNodes[0].nodeValue == setLetter || sets[i].getElementsByTagName('Name')[0].childNodes[0].nodeValue == 'Sngl') {
				theSet = sets[i];
			}
		}
		return theSet;
	}


	function getContainerAsXMLNode(xmlDoc) {
		// find the sample in the set
		var theSet = getSetAsXMLNode(xmlDoc);
		var theSamp;
		var samps = theSet.getElementsByTagName('Sample');
		if (samps.length = 1) {
			theSamp = samps[0];
		}
		for (var i = 0; i < samps.length; i++) {
			console.log("Checking Samps: " + samps[i].getElementsByTagName('SampleNumber')[0].childNodes[0].nodeValue);
			if (samps[i].getElementsByTagName('SampleNumber')[0].childNodes[0].nodeValue == containerNum) {
				theSamp = samps[i];
			}
		}

		return theSamp;
	}


}

function authenticateDialog(eKey, type, username) {
	//TODO: SSL!!!  passwords over normal connection are a security risk
	console.log("authenticateDialog(" + eKey + ", " + type + ", " + username + ")");

	$('#dialogAuthenticate').empty();
	$('#dialogAuthenticateHist').empty();

	//$('#dialogAuthenticate').html('<P>HI</P>');
	//			'<div data-role="fieldcontain">

	var dialogHTML = '<h3 class="ui-title">Authenticate</h3>' +
		'<p>You must authenticate in order to submit event.</p>' +
		'<p id="numTriesText"></p>' +
		'<form>' +
		'<label for="usernameInput">Username/Email:</label>' +
		'<input type="text" name="usernameInput" id="usernameInput" value="' + username + '" />' +
		'<label for="passwordInput">Password:</label>' +
		'<input type="password" name="passwordInput" id="passwordInput" placeholder="AD Password or Code" value="" />' +
		'<br>' +
		'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="" onclick="attemptEventSubmit(\'' + eKey + '\',';

	if (type == 'history') { // these are the callback functions to the attemptEventSubmit
		dialogHTML += 'historyLayout';
	} else {
		dialogHTML += 'currentShipmentLayout';
	}

	dialogHTML += ');" data-transition="flow" data-rel="back">Submit</a>' +
		'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="#" data-rel="back">Cancel</a>' +
		'</form>';

	if (type == 'history') {
		console.log("Appending to dialogAuthenticateHist");
		$('#dialogAuthenticateHist').append(dialogHTML);
		//alert($('#dialogAuthenticateHist').visible());

	} else {
		console.log("Appending to dialogAuthenticate");
		$('#dialogAuthenticate').append(dialogHTML);
	}


}

//Create button elements and appends it to the div block
function createButton(buttonText, hrefLink, onclk, id) {
	var button = "";
	switch (buttonText) {
		case "View":
		case "Info":
			button = '<a href="../../' + hrefLink + '" onClick="' + onclk + '"  data-role="button" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-eye ui-btn-icon-notext ui-btn-inline" id="' + id + '"' + '>' +
				buttonText + '</a>';
			break;
		case "Edit":
			button = '<a href="../../' + hrefLink + '" onClick="' + onclk + '" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-edit ui-btn-icon-notext ui-btn-inline" id="' + id + '"' + '>' +
				buttonText + '</a>';
			break;
		case "Delete":
			button = '<a href="../../' + hrefLink + '" onClick="' + onclk + '" class="xxx ui-btn-corner-all ui-shadow ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-inline" data-role="button" data-theme="d" data-transition="pop" data-rel="popup" data-position-to="window" id="' + id + '"' + '>' +
				buttonText + '</a>';
			break;
		case "Delete event":
			button = '<a href="../../' + hrefLink + '" onClick="' + onclk + '" class="ui-btn ui-btn-corner-all ui-shadow ui-btn-up-c" data-role="button" data-theme="d" data-transition="pop" data-rel="popup" data-position-to="window"  data-inline="true" id="' + id + '"' + '>' +
				buttonText + '</a>';
			break;
		default:
			button = '<a href="../../' + hrefLink + '" onClick="' + onclk + '" class="ui-btn ui-btn-corner-all ui-shadow ui-btn-up-c" data-role="button" data-theme="d" id="' + id + '"' + '>' +
				buttonText + '</a>';
	}
	return button;
}

//create the list of current events, based on what is stored in local storage
function currentShipmentLayout() {
	console.log('currentShipmentLayout');
	$('#currentSamples').empty();
	var station = 0;
	var eventID = 0;
	var tempStation = "";

	$('#currentSamples').append('<dl>');
	for (i = 0; i < ls.length; i++) { //for every element in localstorage
		if (ls.key(i).indexOf("!E&") !== -1) {  // is this an event?
			if (!inHistory(ls.key(i))) {
				var query = ls.key(i);
				if (ls.getItem('userType') === getURIItem(query, 'userType')) {
					eventID = query.split('&')[1]; //event counter for this event
					tempStation = getURIItem(query, 'station');
					$('#currentSamples').append(
						getEventSummary(query, true) +
						'<a href="#viewModifyEventPage" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-eye ui-btn-icon-notext ui-btn-inline" data-mini="true" ' +
						'onclick="saveViewModifySetup(\'' + eventID + '\',\'' + getURIItem(query, 'singleOrMulti') + '\')">View/Modify event</a>' +
						'<a href="#authenticateDialog" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-mail ui-btn-icon-notext ui-btn-inline" data-inline="true" data-mini="true" data-role="button" data-transition="pop" data-rel="popup" data-position-to="window" ' +
						'onClick="authenticateDialog(\'' + query + '\',\'current\',\'' + ls.getItem('login_username') + '\');">Submit event</a>' +
						'<a href="#deleteEventDialog" class="xxx ui-btn  ui-btn-corner-all ui-shadow ui-icon-delete ui-btn-icon-notext ui-btn-inline" data-inline="true" data-mini="true" data-role="button" data-transition="pop" data-rel="popup" data-position-to="window" ' +
						'onClick="deleteDialog(\'2\',\'2\',\'' + eventID + '\',\'\',\'1\');">Delete event</a>' +
						'</dd><hr><br>');
				}
			}
		}
	}

	if (tempStation === "")
		$('#currentSamples').append('<span> There are no samples </span></dl>');
	else {
		$('#currentSamples').append('</dl>');
	}
	$(window).trigger("resize");
}



function deleteDialog(dialogType, delType, evCounter, letter, containerCounter) {  // TODO: break up into display only and provide a callback rather than a switch statement   ... perhaps simply making a 'dialog' function with "message" and "okayCallback" and "cancelCallback"?
	console.log("deleteDialog(" + dialogType + ", " + delType + ", " + evCounter + ", " + letter + ", " + ls.getItem('#currentContainerNumber') + ")");
	$('#dialogDeleteSamples').empty();
	$('#dialogDeleteEvent').empty();

	switch (dialogType) {
		case '0':
			$('#dialogDeleteSamples').append('<h3 class="ui-title">Are you sure you want to delete sample ' + containerCounter + '?</h3><p>This action cannot be undone.</p>' +
				'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="#" data-rel="back">Cancel</a>' +
				'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="" onclick="deleteSamples(\'' + delType + '\',\'' + evCounter + '\',\'' + letter + '\',\'' + containerCounter + '\');viewModifyEventPageLayout();" data-transition="flow" data-rel="back">Delete</a>');
			break;
		case '1':
			$('#dialogDeleteSamples').append('<h3 class="ui-title">Are you sure you want to delete this set?</h3><p>This action cannot be undone.</p>' +
				'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="#" data-rel="back">Cancel</a>' +
				'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="" onclick="deleteSamples(\'' + delType + '\',\'' + evCounter + '\',\'' + letter + '\',\'' + containerCounter + '\');" data-transition="flow" data-rel="back">Delete</a>');
			break;
		case '2':
			$('#dialogDeleteEvent').append('<h3 class="ui-title">Are you sure you want to delete event #' + evCounter + '?</h3><p>This action cannot be undone.</p>' +
				'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="#" data-rel="back">Cancel</a>' +
				'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="" onclick="deleteSamples(\'' + delType + '\',\'' + evCounter + '\',\'\',\'' + containerCounter + '\');" data-transition="flow" data-rel="back">Delete</a>');
			break;
	}
}

//create the list of history events, based on what is stored in local storage
function historyLayout() {    //todo: consider an 'event layout' page that is more general for history and current shipment... and review, etc.
	console.log('historyLayout');
	$('#historySortStatement').html("(Events sorted by original submittal date/time");
	addOrEdit = 1; //todo: global
	$('#historySamples').empty();
	var station = 0;
	var eventID = 0;
	var tempStation = "";
	var hl = ls.getItem("HistoryList");
	if (hl == null) {
		$('#historySamples').append('<span> There are no samples in the history </span></dl>');
		return;
	}

	//ingest the history list and sort it
	var historyArr = hl.split(",");
	var dateTime = "";
	var historySort = [];
	for (var i = 0; i < historyArr.length; i++) {
		histGUID = historyArr[i].split("%")[0].substring(3);
		submitDateTime = historyArr[i].split("%")[1];
		historySort.push({GUID: histGUID, dateTime: submitDateTime});
	}
	historySort.sort(function (a, b) {
		return a.dateTime.localeCompare(b.dateTime);
	});
	// at this point, historySort is ordered by dateTime from newest to oldest...

	$('#historySamples').append('<dl>');

	//build output for each item in historySort
	for (var i = 0; i < historySort.length; i++) {
		eventID = getEventIDFromLS(historySort[i].GUID);
		var eKey = "!E&" + eventID;
		var eventSummary = getEventSummary(eKey, true);
		var originalSubmitString = '<dt>Originally Submitted:</dt><dd>' + historySort[i].dateTime + '</dd>';
		eventSummary = eventSummary.substring(0, eventSummary.indexOf('<dl>') + 4) + originalSubmitString + eventSummary.substr(eventSummary.indexOf('<dl>') + 4);
		$('#historySamples').append(eventSummary +
			'<a href="#viewModifyEventPage" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-eye ui-btn-icon-notext ui-btn-inline" data-mini="true" ' +
			'onclick="saveViewModifySetup(\'' + eventID + '\',\'' + getURIItem(eKey, 'singleOrMulti') + '\')">View/Modify event</a>' +
			'<a href="#authenticateDialogHist" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-mail ui-btn-icon-notext ui-btn-inline" data-inline="true" data-mini="true" data-role="button" data-transition="pop" data-rel="popup" data-position-to="window" ' +
			'onClick="authenticateDialog(\'' + eKey + '\',\'history\',\'' + ls.getItem('login_username') + '\');">Resubmit event</a>' +

				//'<a href="#authenticateDialog" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-mail ui-btn-icon-notext ui-btn-inline" data-inline="true" data-mini="true" data-role="button" data-transition="pop" data-rel="popup" data-position-to="window" ' +
				//'onClick="authenticateDialog(\'' + query + '\',\'history\',\'' + ls.getItem('login_username') + '\');">Resubmit event</a>' +
			'</dd><hr><br>');
	}
	$('#historySamples').append('</dl>');
	$(window).trigger("resize");
}

function multiSetLayout() {
	// relies on MultiSetViewedArray being set correctly in local storage for setup.
	console.log("multiSetLayout");
	$('#sampleSets').empty();


	//create buttons for sample sets, and creates empty set (!S) tag for every one
	if ($('#singleOrMulti').val() == 'multi') {
		var setLetter = 65; //'A'
		var numSets = ls.getItem('#setQuantity');
		var curEventNum = ls.getItem('#currentEventNumber');
		var anyMoreToLookAt = false;
		for (i = 0; i < numSets; i++) {
			var buttonLabel = 'Set' + ' ' + String.fromCharCode(setLetter);
			//console.log('!S&'+curEventNum+'&'+String.fromCharCode(setLetter) + ' => ' + ls.getItem('!S&'+curEventNum+'&'+String.fromCharCode(setLetter)));
			if (!ls.getItem('!S&' + curEventNum + '&' + String.fromCharCode(setLetter))) {
				buttonLabel += "*";
				anyMoreToLookAt = true;
			}
			$('#sampleSets').append(createButton(buttonLabel, '#setProperties', "changeSet(this.id)", String.fromCharCode(setLetter)));

			setLetter++;
		}
		if (!anyMoreToLookAt) {
			$('#sampleSets').append('<hr>');
			$('#sampleSets').append(createButton("Back to Main Menu", '#MainMenu', null, 'MultiSetHomeButton'));
		}

	} else { //if single, create one set only and its empty containers
		alert("You have reached this page in error. Starting the application over should fix the problem. Please alert the SedWE team if your problems persist.");
		//	window.location.href = "https://pr.water.usgs.gov/SedWE/";
	}


}

function page2Layout() {

	console.log('page2Layout()');

	// define stations
	$('#station').empty();
	$('#station').append(ls.getItem("StationOptions")).enhanceWithin();
	$('#station').change();
}

function sampleParametersPageLayout() {
	console.log('sampleParametersPageLayout()');

	// function variables
	var containerString = '!C&' + ls.getItem("#currentEventNumber") + "&" + ls.getItem("#set") + "&" + ls.getItem("#currentContainerNumber");

	// Set header
	if (ls.getItem('#singleOrMulti') == 'multi') {
		if (ls.getItem('#analyzeIndSamples') == 'N') {
			$('#sampleParametersPageHeader').text('Set' + ' ' + ls.getItem('#set') + ', Composite of ' + ls.getItem('#containersQuantity') + ' containers');
		} else {
			$('#sampleParametersPageHeader').text('Set' + ' ' + ls.getItem('#set') + ', Container ' + ls.getItem('#currentContainerNumber') + ' of ' + ls.getItem('#containersQuantity'));
		}
	} else if (ls.getItem('#singleOrMulti') == 'single') {
		if (ls.getItem('#analyzeIndSamples') == 'N') {
			$('#sampleParametersPageHeader').text('Single, composite set of ' + ls.getItem('#containersQuantity') + ' containers');
		} else {
			$('#sampleParametersPageHeader').text('Single, container ' + ls.getItem('#currentContainerNumber') + ' of ' + ls.getItem('#containersQuantity') + ' containers');
		}
	}
	else { //single or multi is not defined
		alert("You have reached this page in error.  Please start over.  If this problem persists, contact the SedWE team with the following messsage: 'sampleParametersPageLayout'");
	}


	// set values common to both editing and creating
	setAddOnOptions('sampleType', 'analysis');
	fillSelect(ls.getItem('#sampleType'));  // note we set the value of the items set in FillSelect if we are editing.... we do that later in this function.

	$('#beginDate').val(ls.getItem('#evtDate'));
	var tempBeginTimeGuess = getURIItem(containerString, 'beginTime');
	$('#beginTime').val(tempBeginTimeGuess);  //TODO: this doesn't get entered as a time for some reason...


	if (ls.getItem('createOrEdit') == 'edit') {// we are looking at editing an event here
		var containerArray = getURIArray(containerString);
		for (var key in containerArray) {
			if (!containerArray.hasOwnProperty(key)) {
				continue;
			}
			$('#' + key).val(containerArray[key]);
			$('#' + key).change();
		}

		// set footer buttons for when editing a sample
		$('#nextSampleButton').hide();
		$('#priorSampleButton').hide();
		$('#backToEventButton').show();
		$('#saveModifySampleButton').show();
		$('#cancelModifySampleButton').show();
	} else { // we are creating a new event here
		// set footer buttons for when creating a new sample.
		$('#nextSampleButton').show();  //todo: change nextSample button to 'finished' when on last container
		$('#saveModifySampleButton').hide();
		$('#cancelModifySampleButton').hide();
		// set footer buttons based on number of containers
		if (ls.getItem("#currentContainerNumber") <= 1) {
			$('#priorSampleButton').hide();
			$('#backToEventButton').show();
		} else {
			$('#priorSampleButton').show();
			$('#backToEventButton').hide();
		}
	}


	$('#sampleParameters').validate({
		rules: {
			beginDate: {
				date: true,
				required: true
			},
			beginTime: {
				required: true
			},
			containerNum: {
				required: 'true',
				custom_number: true, //for strings
				range: [1, 40],
				digits: true
			},
			P71999: 'required',
			P82398: 'required',
			P84164: 'required'
		},
		onfocusout: false,
		invalidHandler: function (form, validator) {
			var errors = validator.numberOfInvalids();
			//console.log("ERRORS: "+errors);
			if (errors) {
				validator.errorList[0].element.focus();
			}
		}
	});

	$('#sampleParameters2').validate({
		rules: {
			P00003: {
				custom_float: true,
				positive: true
			},
			P00004: {
				custom_float: true,
				positive: true
			},
			P00009: {custom_float: true},
			P00010: {custom_float: true},
			P00020: {custom_float: true},
			P00061: {custom_float: true},
			P00063: {
				custom_float: true,
				positive: true
			},
			P00064: {
				custom_float: true,
				positive: true
			},
			P00065: {
				custom_float: true,
				positive: true
			},
			P00095: {
				custom_float: true,
				positive: true
			},
			P04121: {custom_float: true},
			P04120: {custom_float: true},
			P04119: {
				custom_float: true,
				positive: true
			},
			P04118: {
				custom_float: true,
				positive: true
			},
			P04117: {custom_float: true},
			P30333: {custom_float: true},
			P63675: {
				custom_float: true,
				positive: true
			},
			P63676: {
				custom_float: true,
				positive: true
			},
			P63680: {
				custom_float: true,
				positive: true
			},
			P65225: {
				custom_float: true,
				positive: true
			},
			M2Lab: {},
			P71999: {required: true},
			P72103: {custom_float: true},
			P72217: {
				custom_float: true,
				positive: true
			},
			P72218: {
				custom_float: true,
				positive: true
			} /*,
			 P82073: {
			 custom_float: true,
			 positive: true
			 },
			 P82074: {
			 custom_float: true,
			 positive: true
			 }
			 P82073: {
			 time
			 },
			 P82074: {
			 custom_float: true,
			 positive: true
			 }*/
		},
		submitHandler: function (form) {
			console.log('sampleParameters2.validate->submitHandler');
			var containerString = $($('#sampleParameters')[0].elements).not('#addOnAnalysisZ,#addOnAnalysisSF,#addOnAnalysisLOI,#addOnAnalysisSA').serialize();


			if ('#addOnAnalysis' in ls) {
				containerString += '&addOnAnalysis=' + ls.getItem('#addOnAnalysis') + '&';
			}

			containerString += '&' + $('#sampleParameters2').serialize() + '&' + $('#bagSamplers').serialize();
			console.log('DATA: ' + containerString);


			// add in parameters in local storage that aren't in the serialized versions

			var tempEventString = ls.getItem('!E&' + ls.getItem('#currentEventNumber'));
			var tempSetString = ls.getItem('!S&' + ls.getItem('#currentEventNumber') + '&' + ls.getItem('#set'));
			containerString += serializeFromLS(tempEventString + tempSetString + containerString);

			// done adding in parameters in local storage that aren't in the serialized versions


			containerString = decodeURIComponent(containerString);

			var withoutEmpties = containerString.replace(/[^&]+=\.?(?:&|$)/g, ''); //todo: sanitize (but it still should be done in the php)

			saveToLocalStorage('!C&' + ls.getItem('#currentEventNumber') + '&' + ls.getItem('#set') + '&' + ls.getItem('#currentContainerNumber'), containerString);
			//return false;
			console.log("end of submit handler");


		},
		onfocusout: false,
		invalidHandler: function (form, validator) {
			var errors = validator.numberOfInvalids();
			console.log("SampleParamters2 validate ERRORS: " + errors);
			if (errors) {
				validator.errorList[0].element.focus();
			}
		}
	});

}

function serializeFromLS(exclusionString) {
	// exclusion string should contain every key we don't want to include in the return string.

	retStr = "";

	for (var i = 0; i < ls.length; i++) {
		var lsKey = ls.key(i);

		if (lsKey.indexOf('#') == 0 &&
			lsKey.indexOf('#currentEventNumber') != 0 &&
			lsKey.indexOf('#set') != 0 &&
			lsKey.indexOf('#currentContainerNumber') != 0 &&
			lsKey.indexOf('#analyses') != 0 &&
			lsKey.indexOf('#stationName') != 0 &&
			exclusionString.indexOf(lsKey.replace('#', '')) == -1) { // not in the already-serialized form string

			retStr += '&' + lsKey.replace('#', '') + '=' + ls.getItem(lsKey);
		}
	}

	return retStr;
}

function setPropertiesLayout() {
	// note the layout for setProperties is tied in with 'setCorrespondingOptions'.  //todo: split up that function so each function does one thing.

	if (ls.getItem('#singleOrMulti') == 'multi') {
		$('#multiAtributes').show();
		$('.Multi_only').show();
	} else {
		$('#multiAtributes').show(); //TODO: Ask Ken what needs to be asked when...
		$('.Multi_only').hide();  //TODO: Ask Ken what needs to be asked when...
		//$('.Multi_only').show();
		changeSet('A');

	}


}

//Sets the title of the header page on page2
function setTitle(id, value) {
	$('#page2SubHeader').text(value);
	if (value === 'Suspended Sediment') {
		save_data(id, 'SuspSed');
	}
	if (value === 'Bottom Material') {
		save_data(id, 'Bottom');
	}
	if (value === 'Bedload') {
		save_data(id, 'Bedload');
	}
}

function showHideAverage() {
	if ($('#singleOrMulti').val() === 'single') {
		$('.multiMoreThanOne').hide("slow");
	} else {
		$('.multiMoreThanOne').show("slow");
	/*	if (parseInt($('#setQuantity').val()) > 1) {
			$('.multiMoreThanOne').show("slow");
		} else {
			$('.multiMoreThanOne').hide("slow");
		}*/
	}
}

function updateLabel(id) {
	if ($('#' + id).val() === 'single') {
		$('.containerLabel').show();
		$('.setLabel').hide();
	} else {
		$('.containerLabel').hide();
		$('.setLabel').show();
	}
}

function viewModifyEventPageLayout() {
	console.log('viewModifyEventPageLayout');
	$('#currentShipmentSamples').empty();
	$('#viewModifyEventInformation').empty();
	var eventNumber = ls.getItem('#currentEventNumber');

	if (!'!E&' + eventNumber in ls) {
		alert("Error:  Unable to find event string (" + eventStr + ") in local storage.\n\n Error Code: viewModifyEventPageLayout");
	}

	// provide event information and editing options for the event
	var eventInfoToAppend = '<h4>Review event information, and Modify if needed</h4>';
	eventInfoToAppend += getEventSummary(eventNumber, true);
	eventInfoToAppend +=
		'<div>' +
		'<form id="updateEvent">' +
		'<div class="ui-field-contain">' +
		'<label for="bDate">Modify Event Date:</label>' +
		'<input type="text" data-mini="true" name="defaultDate" id="defaultDate"/>' +
		'</div>' +
		'<div class="ui-field-contain">' +
		'<label for="dEvent">Modify Hyd Event:</label>' +
		'<select name="dEvent" id="dEvent" data-mini="true">' + fillSelect("DD", ls.getItem('#EVENT')) + '</select>' +
		'</div>' +
		'</form>' +
		'<div align="right"><a href="#" id="saveViewModifyPage" data-inline="true" data-icon="check" data-mini="true" data-role="button" onclick="saveChangesToEventFromModifyEventPage()">Save Event Changes</a></div>' +

		'</div>';

	$('#viewModifyEventInformation').append(eventInfoToAppend);
	$('#defaultDate').datetimepicker({
		timepicker: false,
		maxDate: 0,
		minDate: new Date(2000, 1 - 1, 1),
		formatDate: 'Y-m-d',
		format: 'Y-m-d',
		mask: false, // '9999/19/39 29:59' - digit is the maximum possible for a cell
	});
	//todo: grey out this button until an oncharge event occurs on the appropriate fields
	$('#viewModifyEventInformation').append('<hr>');
	$('#viewModifyEventInformation').enhanceWithin();

	$('#defaultDate').val(ls.getItem('#evtDate'));

	// provide group or set information
	if (ls.getItem('#singleOrMulti') == 'multi') {
		var gosInfoToAppend = "<h4>Review or Modify Sets from this Event</strong></h4>";
	} else {
		var gosInfoToAppend = "<h4>Review or Modify Group for this Event</strong></h4>";
	}
	$('#currentShipmentSamples').append(gosInfoToAppend);

	for (key in ls) { //todo: creates teh collapsibles out of order
		if (key.indexOf('!S&' + eventNumber) == 0) {
			$('#currentShipmentSamples').append(viewModifyPage_collapsibleLayout(key)).enhanceWithin();
			fillSelect(ls.getItem('sampleType'));  // todo: I believe this sets all checkboxes visibility the same for all sets...
			setCorrespondingOptions('sampleType');
			setGroupCheckboxValues('checkbox' + key.split('&')[2], getURIItem(key, 'analysis'), 0);

		}

	}
	$('currentShipmentSamples').enhanceWithin();

	//set footer back button to the right text and link reference
	if (ls.getItem('currentOrHistory') == 'current') {
		$('#backToEventsListButton').attr('href', '#currentShipmentPage');
		$('#backToEventsListButton').text('Back to Current Events List');
		//$('#backToEventsListButton').text('Back to Current Events List').button('refresh');
	} else {
		$('#backToEventsListButton').attr('href', '#historyPage');
		$('#backToEventsListButton').text('Back to History & Review');
		//$('#backToEventsListButton').text('Back to History & Review').button('refresh');
	}


}


function viewModifyPage_collapsibleLayout(setKey) {  //todo: lots of work still here to clean up
	console.log('viewModifyPage_collapsibleLayout(' + setKey + ')');
	var setID = setKey.split('&')[2];
	var eventID = setKey.split('&')[1];
	var stationNumber = getURIItem('!E&' + eventID, 'station');
	var stationName = getURIItem('!E&' + eventID, 'stationNm');


	eventKey = '!E&' + eventID;
	collapsibleText = 'multi';

	var collapsible =
		"<div data-role='collapsible' data-collapsed='false' data-theme='d' data-content-theme='c' id='collapsible_set" + setID + "'>" +
		"<h3>" + stationNumber + " Set " + setID + " (" + getURIItem(setKey, 'containersQuantity') + " containers)</h3>";

	//var deleteButton = '<a href="" onclick="alert(\'DELETE\')">(delete set)</a>';
	//var deleteButton = '<a href="" onclick="deleteSet(\''+setKey+'\')"> (delete set)</a>';

	if (isMulti(setKey)) {
		collapsible += "<h4>Modify this Set </strong>"+"</h4>";
	} else {
		collapsible += "<h4>Modify this Group</strong></h4>";
	}
	collapsible += viewModifyPage_checkboxesLayout(setKey);

	collapsible += '<div align="right"><a href="#" id="saveSetViewModifyPage" data-inline="true" data-icon="check" data-mini="true" data-role="button" onclick="saveChangesToSetFromModifyEventPage(\'' + setKey + '\')">Save Set Analyses Options</a></div>';

	collapsible = collapsible + "<p><strong>Click on button to Edit, View, or Delete a sample.</strong><br />Note: if you want to delete the group from the event, you have to delete the event instead</p>";

	//retrieves the analyzeIndSamples to determine if the samples are composite or not
	var analyzeIndSamplesValue = getURIItem(setKey, 'analyzeIndSamples');

	//if composite, get the containersQuantity from the Set Tag and generates a button that allows the user to increment/devcrement the samples number.
	//When user click on 'Update', the Set Tag is updated in the localStorage but no empty container is created
	//if Individual, the user can only Add samples and when user click on 'Add', new empty samples are created
	var totalSamplesGroup = parseInt(getURIItem(setKey, 'containersQuantity'));
	if (analyzeIndSamplesValue == 'N') {
		collapsible = collapsible + '<div class="ui-field-contain"><label for="addsamplesCounter' + eventID + setID + '">This Sample is a Composite of this many containers: </label><fieldset data-role="controlgroup" data-type="horizontal">';
		collapsible = collapsible + '<input data-wrapper-class="controlgroup-textinput ui-btn" type="number" min="1" value="' + totalSamplesGroup + '" max="40" data-mini="true" id="addsamplesCounter' + eventID + setID + '" /><button data-mini="true" onClick="addEmptyContainers(\'!C&' + eventID + '&' + setID + '&\',' + totalSamplesGroup + ',0)">Update</button></fieldset></div>';
	} else {
		//var totalSamplesGroup = countElementsInLS('!C&' + eventID);
		collapsible = collapsible + '<div class="ui-field-contain"><label for="addsamplesCounter' + eventID + setID + '">Total samples: </label><fieldset data-role="controlgroup" data-type="horizontal">';
		collapsible = collapsible + '<input data-wrapper-class="controlgroup-textinput ui-btn" type="number" min="' + totalSamplesGroup + '" value="' + totalSamplesGroup + '" max="40" data-mini="true" id="addsamplesCounter' + eventID + setID + '" /><button data-mini="true" onClick="addEmptyContainers(\'!C&' + eventID + '&' + setID + '&\',' + totalSamplesGroup + ',1)">Add</button></fieldset></div>';
	}


	var numberOfContainersInLS = countElementsInLS('!C&' + eventID + '&' + setID);
	for (var containerID = 1; containerID <= numberOfContainersInLS; containerID++) {
		// make a button for this item
		var containerKey = '!C&' + eventID + '&' + setID + '&' + containerID;

		var colorStyle = "";
		if (ls.getItem(containerKey) == "") {
			colorStyle = 'style="color:red"';
		}

		collapsible +=
			'<p ' + colorStyle + ' id="sampleLabel' + eventID + setID + containerID + '"><strong>Sample ' + containerID + '&nbsp;&nbsp;</strong>' +
			createButton('Edit', '#sampleParametersPage', "setContainerAsCurrentInLS('" + eventID + "','" + setID + "','" + containerID + "');saveToLocalStorage('createOrEdit','edit')", 'edit' + containerID) +
				//createButton('View', '#viewSamplePage', "getContainerHTML('" + containerKey + "',\'" + ls.getItem('station') + "\',\'" + setID + "\',\'" + containerID + "\');", 'view' + containerID) +
			createButton('View', '#viewSamplePage', "save_data('currentContainerKey','" + containerKey + "');", 'view' + containerID) +
			createButton('Delete', '#deleteDialog', 'deleteDialog(\'0\',\'0\',\'' + eventID + '\',\'' + setID + '\',\'' + containerID + '\');', 'delete' + containerID) + '</p>';
	}
	return collapsible;
}

function viewModifyPage_checkboxesLayout(setKey) { //todo: this is pulling from 'eventArray' and should pull from LS instead.
	console.log("viewModifyPage_checkboxesLayout(" + setKey + ")");
	var headingFormStr = '';
	var setLetter = setKey.split('&')[2];
	if (ls.getItem('userType') !== 'Observer') {
		headingFormStr += '<p>Analyses Requested (applies to all samples)</p>' +
			'<form id="editAnalysisForm' + setLetter + '" data-mini="true">' +   //NEW CODE DIANNE - Added the title to the Analyses checkboxes
			'<label for="checkbox' + setLetter + 'C" class="suspendedAdditionalFields">(C) Concentration</label>' +
			'<input type="checkbox" name="analysisEdit' + setLetter + '" id="checkbox' + setLetter + 'C" value="C" class="suspendedAdditionalFields" ' +
			'data-mini="true" onClick="chkBox(this.id,this.value)" />' +
			'<label for="checkbox' + setLetter + 'SF">(SF) Sand-Fine break**</label>' +
			'<input type="checkbox" name="analysisEdit' + setLetter + '" id="checkbox' + setLetter + 'SF" value="SF" data-mini="true" onClick="chkBox(this.id,this.value)" />' +
			'<label for="checkbox' + setLetter + 'SA">(SA) Sand Analysis**</label>' +
			'<input type="checkbox" name="analysisEdit' + setLetter + '" id="checkbox' + setLetter + 'SA" value="SA" data-mini="true" onClick="chkBox(this.id,this.value)" />' +
			'<label for="checkbox' + setLetter + 'T" class="suspendedAdditionalFields">(T) Turbidity</label>' +
			'<input type="checkbox" name="analysisEdit' + setLetter + '" id="checkbox' + setLetter + 'T" value="T" class="suspendedAdditionalFields" ' +
			'data-mini="true" onClick="chkBox(this.id,this.value)" />' +
			'<label for="checkbox' + setLetter + 'LOI">(LOI) Loss-on-ignition**</label>' +
			'<input type="checkbox" name="analysisEdit' + setLetter + '" id="checkbox' + setLetter + 'LOI" value="LOI" data-mini="true" onClick="chkBox(this.id,this.value)" />' +

			'<label for="checkbox' + setLetter + 'BD" class="bottomAdditionalFields">(BD) Bulk Density</label>' +
			'<input type="checkbox" name="analysisEdit' + setLetter + '" id="checkbox' + setLetter + 'BD" value="BD" class="bottomAdditionalFields" ' +
			'data-mini="true" onClick="chkBox(this.id,this.value)" />' +

			'<label for="checkbox' + setLetter + 'FO" class="bottomAdditionalFields bedloadAdditionalFields">(FO) Fines Only</label>' +
			'<input type="checkbox" name="analysisEdit' + setLetter + '" id="checkbox' + setLetter + 'FO" value="FO" ' +
			'class="bottomAdditionalFields bedloadAdditionalFields" data-mini="true" onClick="chkBox(this.id,this.value)" />' +
			'<label for="checkbox' + setLetter + 'DS" class="suspendedAdditionalFields">(DS) Dissolved Solids</label>' +
			'<input type="checkbox" name="analysisEdit' + setLetter + '" id="checkbox' + setLetter + 'DS" value="DS" class="suspendedAdditionalFields" ' +
			'data-mini="true" onClick="chkBox(this.id,this.value)" />' +
			'<label for="checkbox' + setLetter + 'SC" class="suspendedAdditionalFields">(SC) Specific Conductance</label>' +
			'<input type="checkbox" name="analysisEdit' + setLetter + '" id="checkbox' + setLetter + 'SC" value="SC" class="suspendedAdditionalFields" ' +
			'data-mini="true" onClick="chkBox(this.id,this.value)" />' +
			'<label for="checkbox' + setLetter + 'Z">(Z) Full-size fractions**</label>' +
			'<input type="checkbox" name="analysisEdit' + setLetter + '" id="checkbox' + setLetter + 'Z" value="Z" data-mini="true" onClick="chkBox(this.id,this.value)" />' +
			'</form>';
	}

	return headingFormStr;
}