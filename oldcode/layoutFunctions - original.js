/**
 * Created by jfederer on 3/2/2015.
 *
 * Functions in this file will lay out and fill content pages.  They will not directly make changes to the DB or local storage but likely rely on LS values being set in order to lay out correctly.
 */







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
	if(hl==null) {
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
		historySort.push({GUID:histGUID,dateTime:submitDateTime});
	}
	historySort.sort(function(a,b) {
		return a.dateTime.localeCompare(b.dateTime);
	});
	// at this point, historySort is ordered by dateTime from newest to oldest...

	$('#historySamples').append('<dl>');

	//build output for each item in historySort
	for (var i = 0; i < historySort.length; i++) {
		eventID = getEventIDFromLS(historySort[i].GUID);
		query = "!E&"+eventID;
		$('#historySamples').append('<dt><b>Station ID:</b> ' + getURIItem(query, 'station') + ' | <b>Date:</b> ' + getURIItem(query, 'evtDate') + ' | <b>Event Type:</b> ' + getURIItem(query, 'singleOrMulti') + '</dt><dd>' +
		'<dt><b>Station Name:</b> ' + getURIItem(query,'stationNm') + '</dt>' +
		'<dt><b>Originally Submitted:</b> ' + historySort[i].dateTime + '</dt>' +
		'<dd>' +
		'<a href="#viewModifyEventPage" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-eye ui-btn-icon-notext ui-btn-inline" data-mini="true" ' +
		'onclick="saveViewModifySetup(\'' + eventID + '\',\'' + getURIItem(query, 'singleOrMulti') + '\')">View/Modify event</a>' +
		'<a href="#authenticateDialog" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-mail ui-btn-icon-notext ui-btn-inline" data-inline="true" data-mini="true" data-role="button" data-transition="pop" data-rel="popup" data-position-to="window" ' +
		'onClick="authenticateDialog(\'' + query + '\',\'history\',\'' + ls.getItem('login_username') + '\');">Resubmit event</a>' +
		'</dd><hr><br>');
	}
	$('#historySamples').append('</dl>');
	$(window).trigger("resize");
}



function setPropertiesLayout () {
	// note the layout for setProperties is tied in with 'setCorrespondingOptions'.  //todo: split up that function so each function does one thing.

	if(ls.getItem('#singleOrMulti')=='multi') {
		//console.log("setPropertiesLayout for Multi");
		$('#multiAtributes').show();
		$('.Multi_only').show();
	} else {
		//console.log("SetPropertiesLayout for single");
		$('#multiAtributes').show(); //TODO: Ask Ken what needs to be asked when...
		$('.Multi_only').hide();  //TODO: Ask Ken what needs to be asked when...
		//$('.Multi_only').show();
		changeSet('A');

	}


}


function viewModifyEventPageLayout() {
	console.log('viewModifyEventPageLayout');
	$('#currentShipmentSamples').empty();

	createCurrentSets();

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
					numConts = countElementsInLS('!C&'+eventID);
					$('#currentSamples').append(
						'<dt><b>Station ID:</b> ' + tempStation + ' | <b>Date:</b> ' + getURIItem(query, 'evtDate') + ' | <b>Event Type:</b> ' + getURIItem(query, 'singleOrMulti') + '</dt><dd>' +
						'<dt><b>Station Name: </b> ' + getURIItem(query,'stationNm') + '</dt>' +
						'<dt><b>Total Number of Containers: </b> ' + numConts + '</dt>' +
							'<dd>' +
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

function multiSetLayout() {
	// relies on MultiSetViewedArray being set correctly in local storage for setup.
	console.log("multiSetLayout");
	$('#sampleSets').empty();


	//create buttons for sample sets, and creates empty set (!S) tag for every one
	if ($('#singleOrMulti').val() == 'multi') {
		var setLetter = 65; //'A'
		var numSets = ls.getItem('#setQuantity');
		var curEventNum = ls.getItem('currentEventNum');
		var anyMoreToLookAt = false;
		for (i = 0; i < numSets; i++) {
			var buttonLabel = 'Set' + ' ' + String.fromCharCode(setLetter);
			//console.log('!S&'+curEventNum+'&'+String.fromCharCode(setLetter) + ' => ' + ls.getItem('!S&'+curEventNum+'&'+String.fromCharCode(setLetter)));
			if(!ls.getItem('!S&'+curEventNum+'&'+String.fromCharCode(setLetter))) {
				buttonLabel += "*";
				anyMoreToLookAt = true;
			}
			$('#sampleSets').append(createButton(buttonLabel, '#setProperties', "changeSet(this.id)", String.fromCharCode(setLetter)));

			setLetter++;
		}
		if(!anyMoreToLookAt) {
			$('#sampleSets').append('<hr>');
			$('#sampleSets').append(createButton("Back to Main Menu", '#MainMenu', null, 'MultiSetHomeButton'));
		}

	} else { //if single, create one set only and its empty containers
		alert("You have reached this page in error. Starting the application over should fix the problem. Please alert the SedWE team if your problems persist.");
	//	window.location.href = "https://pr.water.usgs.gov/SedWE/";
	}




}

function authenticateDialog(eKey, type, username) {
	//TODO: SSL!!!  passwords over normal connection are a security risk
	console.log("authenticateDialog(" + eKey + ", " + type + ", " + username + ")");

	$('#dialogAuthenticate').empty();

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

		if(type == 'history') {
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
	} else {
		console.log("Appending to dialogAuthenticate");
		$('#dialogAuthenticate').append(dialogHTML);
	}

}

function deleteDialog(dialogType, delType, evCounter, letter, containerCounter) {  // TODO: break up into display only and provide a callback rather than a switch statement   ... perhaps simply making a 'dialog' function with "message" and "okayCallback" and "cancelCallback"?
	console.log("deleteDialog(" + dialogType + ", " + delType + ", " +  evCounter + ", " +  letter + ", " +  ls.getItem('currentContainerNumber') +")");
	$('#dialogDeleteSamples').empty();
	$('#dialogDeleteEvent').empty();

	switch (dialogType) {
		case '0':
			$('#dialogDeleteSamples').append('<h3 class="ui-title">Are you sure you want to delete sample ' + containerCounter + '?</h3><p>This action cannot be undone.</p>' +
			'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="#" data-rel="back">Cancel</a>' +
			'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="" onclick="deleteSamples(\'' + delType + '\',\'' + evCounter + '\',\'' + letter + '\',\'' + containerCounter + '\');" data-transition="flow" data-rel="back">Delete</a>');
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

function editEventSetHeading(key) {
	//var headingFormStr = ;
	// console.log(" editeventheading key: "+key);
	var headingFormStr = '';
	switch (key.charAt(1)) {
		case 'E': //heading for event
			headingFormStr = "<div><dl><dt class='current'>Event ID</dt><dd class='current'>" + key.split('&')[1] + "</dd>";
			headingFormStr = headingFormStr + "<dt class='current'>Sediment family</dt><dd class='current'>" + eventArray['sampleType'] + "</dd>";
			headingFormStr = headingFormStr + "<dt class='current'>Station ID</dt><dd class='current'>" + eventArray['agencyCd'] + ' ' + eventArray['station'] + "</dd>";
			headingFormStr = headingFormStr + "<dt class='current'>Station Name</dt><dd class='current'>" + eventArray['stationNm'] + "</dd>";
			if (eventArray['userType'] !== 'Observer') {
				headingFormStr = headingFormStr + "<dt class='current'>Medium</dt><dd class='current'>" + eventArray['sampleMedium'] + '</dd>';
			}
			headingFormStr = headingFormStr + '</dl></div><br clear"both"><div><form id="updateEvent"><div class="ui-field-contain"><label for="bDate">Default begin date:</label>' +
			'<input type="text" data-mini="true" name="defaultDate" id="defaultDate" onChange="save_data(this.name,this.value)"/></div></div>';
			headingFormStr = headingFormStr + '<div class="ui-field-contain"><label for="dEvent">Default hyd event:</label><select name="dEvent" id="dEvent" data-mini="true" onChange="updateURIItem(' + key + ',\'beginDate\',this.value)">' + fillSelect("DD", eventArray['EVENT']) + "</div></form>";
			break;
		case 'S':  //deading for set
			var setLetter = key.split('&')[2];
			if (eventArray['userType'] !== 'Observer') {
				//headingFormStr = headingFormStr + '<form id="editAnalysisForm' + setLetter + '" data-mini="true">' +
				headingFormStr = headingFormStr + '<p>Analyses Requested (applies to all samples)</p><form id="editAnalysisForm' + setLetter + '" data-mini="true">' +   //NEW CODE DIANNE - Added the title to the Analyses checkboxes
				'<label for="checkbox' + setLetter + 'C" class="suspendedAdditionalFields">(C) Concentration</label>' +
				'<input type="checkbox" name="analysisEdit" id="checkbox' + setLetter + 'C" value="C" class="suspendedAdditionalFields" ' +
				'data-mini="true" onClick="chkBox(this.id,this.value)" />' +
				'<label for="checkbox' + setLetter + 'SF">(SF) Sand-Fine break**</label>' +
				'<input type="checkbox" name="analysisEdit" id="checkbox' + setLetter + 'SF" value="SF" data-mini="true" onClick="chkBox(this.id,this.value)" />' +
				'<label for="checkbox' + setLetter + 'SA">(SA) Sand Analysis**</label>' +
				'<input type="checkbox" name="analysisEdit" id="checkbox' + setLetter + 'SA" value="SA" data-mini="true" onClick="chkBox(this.id,this.value)" />' +
				'<label for="checkbox' + setLetter + 'T" class="suspendedAdditionalFields">(T) Turbidity</label>' +
				'<input type="checkbox" name="analysisEdit" id="checkbox' + setLetter + 'T" value="T" class="suspendedAdditionalFields" ' +
				'data-mini="true" onClick="chkBox(this.id,this.value)" />' +
				'<label for="checkbox' + setLetter + 'LOI">(LOI) Loss-on-ignition**</label>' +
				'<input type="checkbox" name="analysisEdit" id="checkbox' + setLetter + 'LOI" value="LOI" data-mini="true" onClick="chkBox(this.id,this.value)" />' +

				'<label for="checkbox' + setLetter + 'BD" class="bottomAdditionalFields">(BD) Bulk Density</label>' +
				'<input type="checkbox" name="analysisEdit" id="checkbox' + setLetter + 'BD" value="BD" class="bottomAdditionalFields" ' +
				'data-mini="true" onClick="chkBox(this.id,this.value)" />' +

				'<label for="checkbox' + setLetter + 'FO" class="bottomAdditionalFields bedloadAdditionalFields">(FO) Fines Only</label>' +
				'<input type="checkbox" name="analysisEdit" id="checkbox' + setLetter + 'FO" value="FO" ' +
				'class="bottomAdditionalFields bedloadAdditionalFields" data-mini="true" onClick="chkBox(this.id,this.value)" />' +
				'<label for="checkbox' + setLetter + 'DS" class="suspendedAdditionalFields">(DS) Dissolved Solids</label>' +
				'<input type="checkbox" name="analysisEdit" id="checkbox' + setLetter + 'DS" value="DS" class="suspendedAdditionalFields" ' +
				'data-mini="true" onClick="chkBox(this.id,this.value)" />' +
				'<label for="checkbox' + setLetter + 'SC" class="suspendedAdditionalFields">(SC) Specific Conductance</label>' +
				'<input type="checkbox" name="analysisEdit" id="checkbox' + setLetter + 'SC" value="SC" class="suspendedAdditionalFields" ' +
				'data-mini="true" onClick="chkBox(this.id,this.value)" />' +
				'<label for="checkbox' + setLetter + 'Z">(Z) Full-size fractions**</label>' +
				'<input type="checkbox" name="analysisEdit" id="checkbox' + setLetter + 'Z" value="Z" data-mini="true" onClick="chkBox(this.id,this.value)" />' +
				'</form>';
			}
			break;

	}
	return headingFormStr;
}

function addSampleButtons(eventID, letter, counter, xxx) { // todo: what the heck is XXX

	var keyStr = '!C&' + eventID + '&' + letter + '&' + counter;
	var eventStr = '!E&' + eventID;
	//console.log("addsamplecounter -> "+eventArray['singleOrMulti']);
	if (xxx === 0)
		if (eventArray['singleOrMulti'] === 'single') {
			$('#set').append('<p id="sampleLabel' + eventID + letter + counter + '"><strong>Sample ' + counter + '&nbsp;&nbsp;</strong>' +
			createButton('Edit', '#sampleParametersPage', "save_data('set','" + letter + "');getContainerDatafromLS('" + keyStr + "','" + eventStr + "');changeSet('" + letter + "')", 'edit' + counter) +
			createButton('View', '#reportPage', "getContainerHTML('" + keyStr + "',\'" + eventArray['station'] + "\',\'" + letter + "\',\'" + counter + "\');", 'view' + counter) +
			createButton('Delete', '#deleteDialog', 'deleteDialog(\'0\',\'0\',\'' + eventID + '\',\'' + letter + '\',\'' + counter + '\');', 'delete' + counter) + '</p>').enhanceWithin();
		} else {
			$('#set' + letter).append('<p id="sampleLabel' + eventID + letter + counter + '"><strong>Sample ' + counter + '&nbsp;&nbsp;</strong>' +
			createButton('Edit', '#sampleParametersPage', "save_data('set','" + letter + "');getContainerDatafromLS('" + keyStr + "','" + eventStr + "');changeSet('" + letter + "')", 'edit' + counter) +
			createButton('View', '#reportPage', "getContainerHTML('" + keyStr + "',\'" + eventArray['station'] + "\',\'" + letter + "\',\'" + counter + "\');", 'view' + counter) +
			createButton('Delete', '#deleteDialog', 'deleteDialog(\'0\',\'1\',\'' + eventID + '\',\'' + letter + '\',\'' + counter + '\');', 'delete' + counter) + '</p>').enhanceWithin();
		}

	else if (eventArray['singleOrMulti'] === 'single') {
		$('#sampleLabel' + eventID + letter + (parseInt(counter) - 1)).after('<p id="sampleLabel' + eventID + letter + counter + '"><strong>Sample ' + counter + '&nbsp;&nbsp;</strong>' +
		createButton('Edit', '#sampleParametersPage', "save_data('set','" + letter + "');getContainerDatafromLS('" + keyStr + "','" + eventStr + "');changeSet('" + letter + "')", 'edit' + counter) +
		createButton('View', '#reportPage', "getContainerHTML('" + keyStr + "',\'" + eventArray['station'] + "\',\'" + letter + "\',\'" + counter + "\');", 'view' + counter) +
		createButton('Delete', '#deleteDialog', 'deleteDialog(\'0\',\'0\',\'' + eventID + '\',\'' + letter + '\',\'' + counter + '\');', 'delete' + counter) + '</p>').enhanceWithin();
	} else {
		$('#sampleLabel' + eventID + letter + (parseInt(counter) - 1)).after('<p id="sampleLabel' + eventID + letter + counter + '"><strong>Sample ' + counter + '&nbsp;&nbsp;</strong>' +
		createButton('Edit', '#sampleParametersPage', "save_data('set','" + letter + "');getContainerDatafromLS('" + keyStr + "','" + eventStr + "');changeSet('" + letter + "')", 'edit' + counter) +
		createButton('View', '#reportPage', "getContainerHTML('" + keyStr + "',\'" + eventArray['station'] + "\',\'" + letter + "\',\'" + counter + "\');", 'view' + counter) +
		createButton('Delete', '#deleteDialog', 'deleteDialog(\'0\',\'1\',\'' + eventID + '\',\'' + letter + '\',\'' + counter + '\');', 'delete' + counter) + '</p>').enhanceWithin();
	}
}

function sampleParametersPageLayout() {
	alert("preLayout");
	console.log('sampleParametersPageLayout()');
	setAddOnOptions('sampleType', 'analysis');
	alert("Layout1");
	$('#beginDate').val(ls.getItem('#evtDate'));
	var currentEventID = ls.getItem("currentEventNum");
	var currentSetID = ls.getItem("#set");
	var currentContainerNum = ls.getItem("currentContainerNum");
	var beginTimeGuess = getURIItem('!C&'+currentEventID+"&"+currentSetID+"&"+currentContainerNum,'beginTime');
	alert(beginTimeGuess);
	$('#beginTime').val(beginTimeGuess);  //TODO: we don't actually want this to be blank if we are reviewing


	// console.log('^^^Forms multiAttributes and analysesForm were valid');
	if (ls.getItem('#singleOrMulti') == 'multi') {
		if (ls.getItem('#analyzeIndSamples') == 'N') {
			$('#sampleParametersPageHeader').text('Set' + ' ' + ls.getItem('#set') + ', Composite');
		} else {
			$('#sampleParametersPageHeader').text('Set' + ' ' + ls.getItem('#set') + ', Container ' + ls.getItem('currentContainerNumber') + ' of ' + ls.getItem('#containersQuantity'));
		}
	} else if (ls.getItem('#singleOrMulti') == 'single') {
			$('#sampleParametersPageHeader').text('Single, container ' + ls.getItem('currentContainerNumber') + ' of ' + ls.getItem('#containersQuantity'));
		}
	else { //single or multi is not defined
		alert("You have reached this page in error.  Please start over.  If this problem persists, contact the SedWE team with the following messsage: 'sampleParametersPageLayout'");
	}
	alert("Layout3");

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

	alert("Layout4");
	$('#sampleParameters2').validate({
		rules: {
			P00003: {
				custom_float: true,
				positive: true },
			P00004: {
				custom_float: true,
				positive: true },
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
				positive: true },
			P00065: {
				custom_float: true,
				positive: true},
			P00095: {
				custom_float: true,
				positive: true},
			P04121: {custom_float: true},
			P04120: {custom_float: true},
			P04119: {
				custom_float: true,
				positive: true},
			P04118: {
				custom_float: true,
				positive: true
			},
			P04117: {custom_float: true},
			P30333: {custom_float: true},
			P63675: {
				custom_float: true,
				positive: true},
			P63676: {
				custom_float: true,
				positive: true},
			P63680: {
				custom_float: true,
				positive: true},
			P65225: {
				custom_float: true,
				positive: true},
			M2Lab: {},
			P71999: {required: true},
			P72103: {custom_float: true},
			P72217: {
				custom_float: true,
				positive: true },
			P72218: {
				custom_float: true,
				positive: true },
			P82073: {
				custom_float: true,
				positive: true },
			P82074: {
				custom_float: true,
				positive: true }
		},
		submitHandler: function (form) {
			console.log('sampleParameters2.validate->submitHandler');
			var data = $($('#sampleParameters')[0].elements).not('#addOnAnalysisZ,#addOnAnalysisSF,#addOnAnalysisLOI,#addOnAnalysisSA').serialize();


			if ('#addOnAnalysis' in ls) {
				data = data + '&addOnAnalysis=' + ls.getItem('#addOnAnalysis') + '&';
			}

			data = data + '&' + $('#sampleParameters2').serialize() + '&' + $('#bagSamplers').serialize();
			data = decodeURIComponent(data);

			var withoutEmpties = data.replace(/[^&]+=\.?(?:&|$)/g, ''); //todo: sanitize (but it still should be done in the php)

			saveToLocalStorage('!C&' + eventCounter + '&' + ls.getItem('#set') + '&' + ls.getItem('currentContainerNumber'), data);
			//return false;
			console.log("end of submit handler");


		},
		onfocusout: false,
		invalidHandler: function (form, validator) {
			var errors = validator.numberOfInvalids();
			console.log("SampleParamters2 validate ERRORS: "+errors);
			if (errors) {
				validator.errorList[0].element.focus();
			}
		}
	});

	alert("Layout5");


	if(ls.getItem("currentContainerNumber") <= 1) {
		$('#priorSampleButton').hide();
		$('#backToEventButton').show();
	} else {
		$('#priorSampleButton').show();
		$('#backToEventButton').hide();
	}

	$('#priorSampleButton').click(function () {    //todo:  surely this can be done better
		console.log("priorSampleButtonClickFunction");
		if ($('#sampleParameters').valid()) {
			console.log("sampleParameters is valid");
			if ($('#sampleParameters2').valid()) {
				console.log("sampleParameters2 is valid");
				var dataLoaded = goToPriorContainer();
				$('#addOnAnalysisZ').checkboxradio("refresh"); //needed to refresh the addOnAnalysis checkboxes
				$('#addOnAnalysisSA').checkboxradio("refresh");
				$('#addOnAnalysisSF').checkboxradio("refresh");
				$('#addOnAnalysisLOI').checkboxradio("refresh");
				$("html, body").animate({
					scrollTop: 0
				}, "slow");
			}
		}
	});

	$('#nextSampleButton').click(function () {    //todo: surely this can be done better.   At least move to sedwe setup?   Perhaps split off and name these functions and just use the onclick in the index.html
		console.log("nextSampleButtonClickFunction");
		if ($('#sampleParameters').valid()) {
			console.log("sampleParameters is VALID");
			if ($('#sampleParameters2').valid()) {
				console.log("sampleParameters2 is VALID");

				var dataLoaded = goToNextContainer();
				console.log("dataLoaded: " + dataLoaded);
				if (dataLoaded == false) {
					console.log("DataLoaded=false");
					$('#beginTime').val('');
				} else {
					console.log("DataLoaded=true");
					$('#addOnAnalysisZ').checkboxradio("refresh");
					$('#addOnAnalysisSA').checkboxradio("refresh");
					$('#addOnAnalysisSF').checkboxradio("refresh");
					$('#addOnAnalysisLOI').checkboxradio("refresh");
				}
				$("html, body").animate({
					scrollTop: 0
				}, "slow");
			}
		}
	});
}

//Create button elements and appends it to the div block
function createButton(buttonText, hrefLink, onclk, id) {
	var button = "";
	//console.log('=>' + onclk);
	switch (buttonText) {
		case "View":
		case "Info":
			button = '<a href="../../' + hrefLink + '" onClick="' + onclk + '" data-rel="dialog" data-role="button" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-eye ui-btn-icon-notext ui-btn-inline" id="' + id + '"' + '>' +
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

function updateLabel(id) {
	if ($('#' + id).val() === 'single') {
		$('.containerLabel').show();
		$('.setLabel').hide();
	} else {
		$('.containerLabel').hide();
		$('.setLabel').show();
	}
}

function showHideAverage() {
	if ($('#singleOrMulti').val() === 'single') {
		$('.multiMoreThanOne').hide("slow");
	} else {
		if (parseInt($('#setQuantity').val()) > 1) {
			$('.multiMoreThanOne').show("slow");
		} else {
			$('.multiMoreThanOne').hide("slow");
		}
	}
}