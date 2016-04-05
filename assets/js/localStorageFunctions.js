// this file is for functions that read and write from local storage.  It is not intended for functions that display things.  //TODO  data storage/retrival functions should be split from display and layout functions


// this function  is only used for testing and development purposes.
function testShowLocalStorage(idToAppendTo) {

	console.log("testShowLocalStorage");

	$('#' + idToAppendTo).empty();

	for (var i = 0; i < localStorage.length; i++) {
		$('#' + idToAppendTo).append("<b><u>LS Key#" + i + "</u>: " + localStorage.key(i) + " => </b>" + localStorage.getItem(localStorage.key(i)) + "<br>");
	}

} // END testShowLocalStorage


// GET AND SET FUNCTIONS FOR CHECKBOXES
//Convert group checkboxes values into a comma delimited text
//memoryOrObj: get info from that source: 0:obj, 1:memory (localstorage)
function getGroupCheckboxValues(groupName, inclGroupName, memoryOrObj) {
console.log('getGroupCheckboxValues('+groupName+', '+inclGroupName+', '+memoryOrObj+')');
	if (memoryOrObj == 0) {
		var delim = '';
		$.each($("input[name='" + groupName + "']:checked"), function () {
			delim = delim + $(this).val() + ',';
		});
		if (inclGroupName == true) {
			delim = groupName + '=' + delim;
		}
		return delim.slice(0, -1); //removes the last character that is a comma;
	} else {
		return (getURIItem('!S&' + ls.getItem('#currentEventNumber') + '&' + ls.getItem('#set'), groupName));
	}
}

//Extract a comma delimited values into the corresponding component, using the groupName + an extra chart for determine the
//corresponding ID
function setGroupCheckboxValues(groupName, groupValues) {
	console.log("setGroupCheckboxValues("+groupName+' '+groupValues +")");
	if (typeof groupValues === "undefined" || groupValues == null) {
		//console.log("groupValue es undefined");
		return;
	}
	var data = groupValues.split(',');

	for (var i = 0; i < data.length; i++) {
		//$('#'+groupName+data[i]).attr("checked","checked") - it was working
		$('#' + groupName + data[i]).prop("checked", true).checkboxradio('refresh');
		$('#' + groupName + data[i]).enhanceWithin();

		//console.log("CHECKED -> "+'#'+groupName+data[i]);
	}  //todo: this doesn't seem to set the checkboxes taht aren't picked to 'false'
}

//Store the data as a key|value pair in localStorage
function save_data(id, value) { // TODO, this doesn't seem to be the right name for this?  What is the difference between this and save_eventTags?  Clean this up.
	try {
		ls.setItem('#' + id, value);
		//console.log('Saved #' + id + ':' + value);
	} catch (exception) {
		if ((exception != QUOTA_EXCEEDED_ERR) && (exception != NS_ERROR_DOM_QUOTA_REACHED)) {
			throw exception;
		}
	}
}

//tags are: !E, !S, !C: event, set, container
function saveToLocalStorage(id, value) {
	try {
		ls.setItem(id, value);
		//console.log('Saved ' + id + ':' + value);
	} catch (exception) {
		if ((exception != QUOTA_EXCEEDED_ERR) && (exception != NS_ERROR_DOM_QUOTA_REACHED)) {
			throw exception;  //TODO: provide a reasonable error message her.  This it he entire point of this function.
		}
	}
}


//get the data from localStorage and send it to the form
function load_data(id) {
	if (id !== null) {
		$(id).val(ls.getItem(id));
	}
}

//Validates Check boxes
function chkBox(id, value) {
	if (document.getElementById(id).checked === true) {
		save_data(id, value);
	} else if (document.getElementById(id).checked === false) {
		ls.removeItem('#' + id);
	}
}


//set corresponding classes based on id of sampleType
// if bool fromLS (fromLocalStorage) == true, the value will be get from the 
// what is stored in the corresponding tags starting with #E, #S, and #C (localstorage)
function setCorrespondingOptions(id) {
	console.log('setCorrespondingOptions('+id+')');
	var userVal = ls.getItem('userType');
	var sampleVal = ls.getItem('#' + id);
	// console.log("SampleVal: "+sampleVal);
	if (eventArray['singleOrMulti'] == 'multi') {
		$('.Multi_only').show();
	} else {
		$('.Multi_only').hide();
	}
	switch (sampleVal) {
		case 'Bedload':
			$('.suspendedAdditionalFields, .bottomAdditionalFields').hide();
			$('.bedloadAdditionalFields, #bedloadAdditionalFields').show();
			$('#tetherField').show();
			break;
		case 'Bottom':
			$('.suspendedAdditionalFields, .bedloadAdditionalFields, #bedloadAdditionalFields').hide();
			$('.bottomAdditionalFields').show();
			$('#tetherField').hide();
			break;
		case 'SuspSed':
			$('.bedloadAdditionalFields, #bedloadAdditionalFields, .bottomAdditionalFields').hide();
			$('.suspendedAdditionalFields').show();
			$('#tetherField, .teherField').show();

			break;
	}

	if (userVal != 'Observer') {
		$(' .hideFromObserver,.div div select ui-block-c,.ui-block-d').show()
	} else {
		$('.hideFromObserver,.div div select ui-block-c,.ui-block-d').hide();
	}

}

function fillSelect(value, selValue) {  //TODO this should be renamed
	console.log("fillSelect( " + value + "," + selValue + ")");

	switch (value) {
		case "Suspended Sediment":
		case "SuspSed":

			if ($('#P82398').html() != P82398_SUSPENDED_SEDIMENT_OPTIONS) {
				console.log('Resetting Suspended Sediment P82398 value.');
				$('#P82398').empty();
				$('#P82398').append(P82398_SUSPENDED_SEDIMENT_OPTIONS);
			}
			if ($('#sampleMedium').html() != SAMPLEMEDIUM_SUSPENDED_SEDIMENT_OPTIONS) {
				console.log('Resetting Suspended Sediment sampleMedium value.');
				$('#sampleMedium').empty();
				$('#sampleMedium').append(SAMPLEMEDIUM_SUSPENDED_SEDIMENT_OPTIONS);
			}

			if ($('#P84164').html() != P84164_SUSPENDED_SEDIMENT_OPTIONS) {
				console.log('Resetting Suspended Sediment P84164 value.');
				$('#P84164').empty();
				$('#P84164').append(P84164_SUSPENDED_SEDIMENT_OPTIONS);
			}
			break;
		case "Bottom Material":
		case "Bottom":

			if ($('#P82398').html() != P82398_BOTTOM_MATERIAL_OPTIONS) {
				console.log('Resetting Bottom Material P82398 value.');
				$('#P82398').empty();
				$('#P82398').append(P82398_BOTTOM_MATERIAL_OPTIONS);
			}


			if ($('#sampleMedium').html() != SAMPLEMEDIUM_BOTTOM_MATERIAL_OPTIONS) {
				console.log('Resetting Bottom Material sampleMedium value.');
				$('#sampleMedium').empty();
				$('#sampleMedium').append(SAMPLEMEDIUM_BOTTOM_MATERIAL_OPTIONS);
			}

			if ($('#P84164').html() != P84164_BOTTOM_MATERIAL_OPTIONS) {
				console.log('Resetting Bottom Material P84164 value.');
				$('#P84164').empty();
				$('#P84164').append(P84164_BOTTOM_MATERIAL_OPTIONS);
			}
			break;
		case "Bedload":
			if ($('#P82398').html() != P82398_BEDLOAD_OPTIONS) {
				console.log('Resetting Bedload P82398 value.');
				$('#P82398').empty();
				$('#P82398').append(P82398_BEDLOAD_OPTIONS);
			}

			if ($('#sampleMedium').html() != SAMPLEMEDIUM_BEDLOAD_OPTIONS) {
				console.log('Resetting Bedload sampleMedium value.');
				$('#sampleMedium').empty();
				$('#sampleMedium').append(SAMPLEMEDIUM_BEDLOAD_OPTIONS);
			}

			if ($('#P84164').html() != P84164_BEDLOAD_OPTIONS) {
				console.log('Resetting Bedload P84164 value.');
				$('#P84164').empty();
				$('#P84164').append(P84164_BEDLOAD_OPTIONS);
			}
			break;

		case "DD": //input select para default Date
			var selOptions = {
				'1': '1- Drought', '2': '2- Spill', '3': '3- Regulated Flow', '4': '4- Snowmelt', '5': '5- Earthquake',
				'6': '6- Hurricane', '7': '7- Flood', '8': '8- Volcanic activity', '9': '9- Routine Sample',
				'A': 'A- Spring breakup', 'B': 'B- Under ice cover', 'C': 'C- Glacial lake outbreak',
				'D': 'D- Mudflow', 'E': 'E- Tidal action', 'F': 'F- Fire, affected by fire prior sampling',
				'H': 'H- Dambreak', 'J': 'J- Storm', 'K': 'K- Backwater', 'X': 'X- Not applicable'
			};
			var optionsStr = '';
			$.each(selOptions, function (val, text) {
				if (val == selValue) {
					optionsStr = optionsStr + '<option value=' + val + ' selected>' + text + '</option>';
				} else {
					optionsStr = optionsStr + '<option value=' + val + '>' + text + '</option>';
				}
			});
			return optionsStr;
			break;
	}
	$('#P82398').change();
	$('#P84164').change();
	$('#sampleMedium').change();

}

function setAddOnOptions(id, objName) {
	var isChecked = false;

	//console.log("dentro de setAddOn TEST");		
	var analysesList = ls.getItem('#analysis').split(',');

	if (ls.getItem('#' + id) == 'Bedload') {
		//console.log("*Bedload");
		//console.log("*analysesList[0]: "+analysesList[0]);
		if (analysesList[0] == 'Z') {
			$('#addOnAnalysisZ, #fullSizeFractionlb').hide();
			$('#addOnAnalysisSF, #sandFineBreaklb').hide();
			$('#addOnAnalysisSA, #sandlb').hide();
			$('#addOnAnalysisLOI, #lossOnIgnitionlb').hide();
		} else {
			$('#addOnAnalysisZ, #fullSizeFractionlb').show();
		}

	} else {
		//console.log("*Other");

		$('#addOnAnalysisZ, #fullSizeFractionlb').show();
		$('#addOnAnalysisSF, #sandFineBreaklb').show();
		$('#addOnAnalysisSA, #sandlb').show();
		$('#addOnAnalysisLOI, #lossOnIgnitionlb').show();

		for (var n = 0; n < analysesList.length; n++) {
			//console.log("*analysesList["+n+"]: "+analysesList[n]);
			if (analysesList[n] == 'Z') {
				//console.log("Z *"); 
				$('#addOnAnalysisZ, #fullSizeFractionlb').hide();
			}
			if (analysesList[n] == 'SF') {
				//console.log("SF *");
				$('#addOnAnalysisSF, #sandFineBreaklb').hide();
			}
			if (analysesList[n] == 'SA') {
				//console.log("SA *");
				$('#addOnAnalysisSA, #sandlb').hide();
			}
			if (analysesList[n] == 'LOI') {
				//console.log("LOI *"); 
				$('#addOnAnalysisLOI, #lossOnIgnitionlb').hide();
			}
		}
	}

	setGroupCheckboxValues('addOnAnalysis', ls.getItem('#addOnAnalysis'));

	$('#possibleAddon').empty(); //
	//$('#possibleAddon').append('(Set already gets '+getGroupCheckboxValues(objName,false,1)+')');
	$('#possibleAddon').append('(Set already gets ' + analysesList + ')');

}
//


//TODO: This is really a layout function - no?  Divorce from LS calls somehow and move to layoutFunctions.js?
function createCollapsible(stn, collapsibleText, id, eventKey) {
	console.log('createCollapsible(' + stn + ", " + collapsibleText + ", " + id + ", " + eventKey + ')');
	var counter = 0;
	var totalSamplesGroup = 1;
	var highestContainerNum = 1;
	//the id of every element inthe collapsible will be object+set
	var collapsible = "<div data-role='collapsible' data-collapsed='false' data-theme='d' data-content-theme='c' id='set" + id + "'><h3>" + stn + " " + collapsibleText + "</h3>";
	if (collapsibleText === 'single') {
		collapsible = collapsible + "<h4>Modify this Group</strong></h4>";

		if (eventKey in ls) {
			collapsible += viewModifyPage_checkboxesLayout('!S&' + eventKey.split('&')[1] + '&A');
			//console.log("---- "+'S&'+eventKey.split('&')[1]+'&A');
		}
		totalSamplesGroup = countElementsInLS('!C&' + eventKey.split('&')[1] + '&A');
		//save SET TAG oif the containerQuiantity changes
		saveToLocalStorage('!S&' + eventKey.split('&')[1] + '&A', changeParamByName(ls.getItem('!S&' + eventKey.split('&')[1] + '&A'), totalSamplesGroup)); //TODO: layout saving to local storage...bad

		collapsible = collapsible + "<p><strong>Click on button to Edit, View, or Delete a sample.</strong><br />Note: if you want to delete the group from the event, you have to delete the event instead</p>";
	} else {
		collapsible += "<h4>Modify this Set</strong></h4>";
		if (eventKey in ls) {
			collapsible += viewModifyPage_checkboxesLayout('!S&' + eventKey.split('&')[1] + '&' + id);
			//console.log("---- "+'S&'+eventKey.split('&')[1]+'&'+id);
		}
		totalSamplesGroup = countElementsInLS('!C&' + eventKey.split('&')[1] + '&' + id); //todo: potentially wrong

		collapsible = collapsible + "<p><strong>Click on button to Edit, View, or Delete a sample.</strong><br />Note: if you want to delete the group from the event, you have to delete the event instead</p>";

		//retrieves the analyzeIndSamples to determine if the samples are composite or not
		var analyzeIndSamplesValue = getURIItem('!S&' + eventKey.split('&')[1] + '&' + id, 'analyzeIndSamples');

		//if composite, get the containersQuantity from the Set Tag and generates a button that allows the user to increment/devcrement the samples number.
		//When user click on 'Update', the Set Tag is updated in the localStorage but no empty container is created
		//if Individual, the user can only Add samples and when user click on 'Add', new empty samples are created
		if (analyzeIndSamplesValue == 'N') {
			totalSamplesGroup = parseInt(getURIItem('!S&' + eventKey.split('&')[1] + '&' + id, 'containersQuantity'));
			collapsible = collapsible + '<div class="ui-field-contain"><label for="addsamplesCounter' + eventKey.split('&')[1] + id + '">This Sample is a Composite of the following containers: </label><fieldset data-role="controlgroup" data-type="horizontal">';
			collapsible = collapsible + '<input data-wrapper-class="controlgroup-textinput ui-btn" type="number" min="1" value="' + totalSamplesGroup + '" max="40" data-mini="true" id="addsamplesCounter' + eventKey.split('&')[1] + id + '" /><button data-mini="true" onClick="addEmptyContainers(\'!C&' + eventKey.split('&')[1] + '&' + id + '&\',' + totalSamplesGroup + ',0)">Update</button></fieldset></div>';
		} else {
			collapsible = collapsible + '<div class="ui-field-contain"><label for="addsamplesCounter' + eventKey.split('&')[1] + id + '">Total samples: </label><fieldset data-role="controlgroup" data-type="horizontal">';
			collapsible = collapsible + '<input data-wrapper-class="controlgroup-textinput ui-btn" type="number" min="' + totalSamplesGroup + '" value="' + totalSamplesGroup + '" max="40" data-mini="true" id="addsamplesCounter' + eventKey.split('&')[1] + id + '" /><button data-mini="true" onClick="addEmptyContainers(\'!C&' + eventKey.split('&')[1] + '&' + id + '&\',' + totalSamplesGroup + ',1)">Add</button></fieldset></div>';
		}
	}
	collapsible += '<div align="right"><a href="#" id="saveSetViewModifyPage" data-inline="true" data-icon="check" data-mini="true" data-role="button" onclick="saveChangesToSetFromModifyEventPage()">Save Set Changes</a></div>';

	return collapsible;
}

function saveViewModifySetup(eventID, singleOrMulti) {  // TODO: can probably be included in the onclick function entirely, only split out for easing the layout functions
	console.log('saveViewModifySetup(' + eventID + "," + singleOrMulti + ")");
	setEventAsCurrentInLS(eventID);

	saveToLocalStorage('#currentEventNumber', eventID);
	saveToLocalStorage('#singleOrMulti', singleOrMulti);
	saveToLocalStorage('#sampleType', getURIItem('!E&' + eventID, 'sampleType'));

	saveToLocalStorage('#evtDate', getURIItem('!E&' + eventID, 'evtDate')); //TODO: this is grabbing the EVENT date, not the container date
	saveToLocalStorage('#evtDate', getURIItem('!E&' + eventID, 'evtDate')); //TODO: this should grab 'beginTime' from the container

	createCurrentSets(eventID, singleOrMulti); //todo: breaking this will break lots CRITICAL!!
}

function saveSampleParametersModifySetup(eventID,setID,containerNumber) {
	saveToLocalStorage('#currentEventNumber', eventID);

	saveToLocalStorage('#set', setID);
	saveToLocalStorage('#currentContainerNumber',containerNumber);
}

function setEventAsCurrentInLS(eventID) {  //TODO: if we run into LS space issues, this is a place we can be more efficient
	console.log('setEventAsCurrentInLS('+eventID+')');
	for(var key in ls) {
		if("!E&"+eventID == key) {
			var eventString = ls.getItem(key);
			var eventArray = eventString.split('&');
			for (var i = 0; i < eventArray.length; i++) {
				var entry = eventArray[i].split('=');
				save_data(entry[0],entry[1]);
			}
		}
	}
	saveToLocalStorage('#currentEventNumber', eventID);
}

function setSetAsCurrentInLS(eventID, setID) { //TODO: if we run into LS space issues, this is a place we can be more efficient
	console.log('setSetAsCurrentInLS('+eventID+','+setID+')');
	setEventAsCurrentInLS(eventID);
	for(var key in ls) {
		if("!S&"+eventID+"&"+setID == key) {
			var setString = ls.getItem(key);
			var setArray = setString.split('&');
			for (var i = 0; i < setArray.length; i++) {
				var entry = setArray[i].split('=');
				save_data(entry[0],entry[1]);
			}
		}
	}
	saveToLocalStorage('#set',setID);
}

function setContainerAsCurrentInLS(eventID, setID, containerNumber) { //TODO: if we run into LS space issues, this is a place we can be more efficient
	console.log('setContainerAsCurrentInLS('+eventID+','+setID+','+containerNumber+')');
	setEventAsCurrentInLS(eventID);
	setSetAsCurrentInLS(eventID,setID);
	for(var key in ls) {
		if("!C&"+eventID+"&"+setID+"&"+containerNumber == key) {
			var containerString = ls.getItem(key);
			var containerArray = containerString.split('&');
			for (var i = 0; i < containerArray.length; i++) {
				var entry = containerArray[i].split('=');
				save_data(entry[0],entry[1]);
			}
		}
	}
	saveToLocalStorage('#currentContainerNumber',containerNumber);
}

//TODO: This is really a layout function - no?  Divorce from LS calls somehow and move to layoutFunctions.js?
function createCurrentSets() {
	console.log('function createCurrentSets (heyo)');
	var stctr = ls.getItem('#currentEventNumber');
	var singlMulti = ls.getItem('#singleOrMulti');
	var counter = 1;
	var letterCtr = 65;
	var keyStr;
	var moreContainers = true;
	var moreSets = true;

	var letter = String.fromCharCode(letterCtr);
	var eventStr = '!E&' + stctr;
	workingWithThisEvCounter = stctr;



	if (ls.getItem('#singleOrMulti') === 'single') {
		counter = 1;
		moreContainers = true;
		$('#currentShipmentSamples').append(createCollapsible(ls.getItem('#station'), 'single', "", eventStr)); //Todo: rename 'currentshipmentsamples'


		fillSelect(ls.getItem('sampleType'));
		setCorrespondingOptions('sampleType');
		if (ls.getItem('userType') !== 'Observer') {
			setGroupCheckboxValues('checkboxA', getURIItem('!S&' + stctr + '&A', 'analysis'));  //VOY POR AQUI		
		}



		while (moreContainers) {
			keyStr = '!C&' + stctr + '&' + letter + '&' + counter;

			if (keyStr in ls) {
				//console.log('key - currentsets '+keyStr);
				addSampleButtons(stctr, letter, counter, 0);

				if (ls.getItem(keyStr) === '') {
					$('#sampleLabel' + stctr + letter + counter).addClass("redColor");  //TODO: it's ikely in here that we need to account for composite sets having multiple containers that were never filled out
				}
			}
			if (counter === SAMPLEQTY) {
				moreContainers = false;
			}
			counter++;
		}
		$('#currentShipmentSamples').append("</div"); //el end del collapsible
		$('#currentShipmentSamples').enhanceWithin();


		fillSelect(ls.getItem('sampleType'));
		setCorrespondingOptions('sampleType');
		if (ls.getItem('userType') !== 'Observer') {
			setGroupCheckboxValues('checkboxA', getURIItem('!S&' + stctr + '&A', 'analysis'));  //VOY POR AQUI		
		}


		$('#currentShipmentSamples').enhanceWithin();
		$('#currentShipmentSamples').change();
		$('#set').collapsible();

		$('#currentShipmentSamples').collapsibleset({
			inset: false
		});

	} else {  //multi
		letterCtr = 65;
		letter = String.fromCharCode(letterCtr);

		while (moreSets) {
			counter = 1;
			keyStr = '!C&' + stctr + '&' + letter + '&' + counter;
			//console.log('key S '+keyStr);
			if (keyStr in ls) {
				$('#currentShipmentSamples').append(createCollapsible(ls.getItem('#station'), ' Set ' + letter + ' (' + getURIItem('!S&'+ls.getItem('#currentEventNumber')+'&'+letter,'containersQuantity') +' containers)', letter, eventStr));
				counter = 1;
				moreContainers = true;

				if (ls.getItem('userType') !== 'Observer') {
					setGroupCheckboxValues('checkbox' + letter, getURIItem('!S&' + stctr + '&' + letter, 'analysis'));
				}

				var checkvals = getGroupCheckboxValues('analysisEdit',false,0);
				console.log("checkvals: " + checkvals);

				while (moreContainers) {
					keyStr = '!C&' + stctr + '&' + letter + '&' + counter;

					if (keyStr in ls) {
						//console.log('key - currentsets '+keyStr);
						addSampleButtons(stctr, letter, counter, 0);
						if (ls.getItem(keyStr) === '') {
							$('#sampleLabel' + stctr + letter + counter).addClass("redColor");
						}
					}
					if (counter === SAMPLEQTY) {
						moreContainers = false;
					}
					counter++;
				}
				$('#currentShipmentSamples').append("</div"); //el div end del collapsible
				$('#currentShipmentSamples').enhanceWithin();
				//$('#editAnalysisFormA').enhanceWithin();
				$('#set' + letter).collapsible();
			} //else {
			if (letterCtr === SETQTY) {
				moreSets = false;
			}
			letterCtr++;
			letter = String.fromCharCode(letterCtr);

		}
	} // end multi
	fillSelect(ls.getItem('sampleType'));
	setCorrespondingOptions('sampleType'); //nuevo Dianne
	$('#currentShipmentSamples').enhanceWithin();
}


//Changes the set and the header
function changeSet(id) {

	save_data('set', id);
	if ($('#singleOrMulti').val() == 'multi') {
		$('#setHeader').text('Set ' + id);
	} else {
		$('#containersQuantity').val($('#setQuantity').val());
		$('#setHeader').text($('#setQuantity').val() + ' ' + 'single container(s)');
	}
}

function saveSampleParametersPageAsContainer() {
	console.log('saveSampleParametersPageContainer()');

		$('#sampleParameters2').submit(); //Submit handler takes care of storing data
		alert("Modifications Saved");
}

function goToNextContainer() {   //todo: this should be moved and should do only waht it says... finishing the
	console.log('goToNextContainer()');
	var debug = true;
	var dataLoaded = false;

	if (ls.getItem('createOrEdit') == 'create') { //adding sample
		if (debug)console.log("adding sample");

		if (parseInt(ls.getItem('#currentContainerNumber')) < parseInt(ls.getItem('#containersQuantity')) && !(ls.getItem('#analyzeIndSamples') == 'N') ) {
			if (debug)console.log("Before submit");
			$('#sampleParameters2').submit(); //Submit handler takes care of storing data // TODO: this should be split out from the submiot handler into something like a "Save sampleParamaters" function

			$('#sampleLabel' + ls.getItem('#currentEventNumber') + ls.getItem('#set') + ls.getItem('#currentContainerNumber')).removeClass("redColor");

			// increment current container number
			saveToLocalStorage('#currentContainerNumber', parseInt(ls.getItem('#currentContainerNumber')) + 1);


			var tempKey = '!C&' + ls.getItem('#currentEventNumber') + '&' + ls.getItem('#set') + '&' + ls.getItem('#currentContainerNumber');
			if (debug)console.log("Before getContainerDatafromLS");
			dataLoaded = getContainerDatafromLS(tempKey, '!E&' + ls.getItem('#currentEventNumber'));
			if (debug)console.log("After getContainerDatafromLS");

		} else {
			$('#sampleParameters2').submit(); //Submit handler takes care of storing data

			$('#sampleLabel' + ls.getItem('#currentEventNumber') + ls.getItem('#set') + ls.getItem('#currentContainerNumber')).removeClass("redColor");
			if (ls.getItem('#singleOrMulti') == 'multi') {
				if (debug)console.log("This was the last container in a multi.... Redirecting to multiset");
				$.mobile.changePage('#multiSet');//Redirects the page to #multiSet
			} else {
				if (debug)console.log("This was the last container in a single.... Redirecting to Main Menu");
				alert("Event data entry complete.");
				$.mobile.changePage('#MainMenu');//Redirects the page to #MainMenu
			}
		}
	} else {
		alert("You have reached this page in error, please contact the SedWE team with the following message: \n\n goToNextContainer editing");
	}

	/* else {  //editing sample   Commented out on 4/20/15 becaue we don't have a 'next sample' button on the edit page anymore...
		if (debug)console.log('editing sample');
		//totalContainerInGroup = $('#addsamplesCounter' + ls.getItem('#currentEventNumber') + ls.getItem('#set')).val();  //todo: globals
		//console.log('#addsamplesCounter'+workingWithThisEvCounter+ls.getItem('#set'));
		//console.log('Container counter = ' + containerCounter+" of "+totalContainerInGroup);
		getCurrentContainerKey();
		saveToLocalStorage('#currentContainerNumber', parseInt(currentContainerKey.split("&")[3]));  //todo: globals
		var yyy = findNextContainerInLS(currentContainerKey); //todo: globals

		if (yyy != currentContainerKey) {
			$('#sampleParameters2').submit(); //Submit handler takes care of storing data
			$('#sampleLabel' + ls.getItem('#currentEventNumber') + ls.getItem('#set') + parseInt(currentContainerKey.split("&")[3])).removeClass("redColor");
			//		$('#sampleLabel'+workingWithThisEvCounter+ls.getItem('#set')+counterCounter).removeClass("redColor");
			saveToLocalStorage('#currentContainerNumber', parseInt(ls.getItem('#currentContainerNumber')) + 1);
			if (ls.getItem('#currentContainerNumber') > 1) {
				//	$('#priorSample').show();
			}

			//set page header
			if (eventArray['singleOrMulti'] == 'multi') {  //TODO: event array might not be set...  // this should be in a layout function anyway
				$('#sampleParametersPageHeader').text('Set ' + ls.getItem('#set') + ', container ' + parseInt(yyy.split("&")[3]) + ' of ' + ls.getItem('#containersQuantity'));
			} else {
				$('#sampleParametersPageHeader').text('Single, container ' + parseInt(yyy.split("&")[3]) + ' of ' + ls.getItem('#containersQuantity'));
			}

			//var tempKey = '#C&'+workingWithThisEvCounter + '&' + ls.getItem('#set') + '&' + containerCounter;
			var tempKey = yyy;

			dataLoaded = getContainerDatafromLS(tempKey, '!E&' + ls.getItem('#currentEventNumber'));
			//if (dataLoaded == false) console.log("new sample...");  else console.log("loading container: "+tempKey); 

		} else {
			$('#sampleParameters2').submit(); //Submit handler takes care of storing data
			$('#sampleLabel' + ls.getItem('#currentEventNumber') + ls.getItem('#set') + parseInt(currentContainerKey.split("&")[3])).removeClass("redColor");
			//if (eventArray['singleOrMulti'] == 'multi') {
			//	$.mobile.changePage('#currentShipmentContainer');//Redirects the page to #multiSet
			//} else{
			$.mobile.changePage('#viewModifyEventPage');//Redirects the page to #MainMenu
			//}
		}

	} */
	if (debug)console.log("goToNextContainer Returning: " + dataLoaded);
	return dataLoaded;
}

//TODO: This function contains a lot of "containerCounter' and needs conversion to ls.getItem('#currentContainerNumber')
//TODO: Combine go to next an go to prior into a 'goto'
function goToPriorContainer() {
	var dataLoaded = false;

	if (ls.getItem('createOrEdit') == 'create') { //adding sample
		if (ls.getItem('#currentContainerNumber') > 1) {
			$('#sampleParameters2').submit(); //Submit handler takes care of storing data

			saveToLocalStorage('#currentContainerNumber', parseInt(ls.getItem('#currentContainerNumber')) - 1);

			var tempKey = '!C&' + ls.getItem('#currentEventNumber') + '&' + ls.getItem('#set') + '&' + ls.getItem('#currentContainerNumber');
			dataLoaded = getContainerDatafromLS(tempKey, '!E&' + ls.getItem('#currentEventNumber'));

		} else {
			alert("You are already on the first sample, we are forwarding you to event.  This is an error, please contact the SedWE team with the following error message: \n\n goToPriorSample prior button exists on first container");
			//console.log("debo mover pagina - "+eventArray['singleOrMulti']);
			$('#sampleParameters2').submit(); //Submit handler takes care of storing data

			if (ls.getItem('#singleOrMulti') == 'multi') {
				$.mobile.changePage('#multiSet');//Redirects the page to #multiSet
			} else {
				$.mobile.changePage('#MainMenu');//Redirects the page to #MainMenu
			}
		}
	} else {
		alert("You have reached this page in error, please contact the SedWE team with the following message: \n\n goToPriorContainer editing");
	}

	/* else {  //editing sample   Commented out on 4/20/15 becaue we don't have a 'next sample' button on the edit page anymore...
		var yyy = findPrevContainerInLS(currentContainerKey);
		if (yyy != currentContainerKey) {
			$('#sampleParameters2').submit(); //Submit handler takes care of storing data
			$('#sampleLabel' + workingWithThisEvCounter + ls.getItem('#set') + parseInt(currentContainerKey.split("&")[3])).removeClass("redColor");
			saveToLocalStorage('#currentContainerNumber', parseInt(ls.getItem('#currentContainerNumber')) - 1);
			if (eventArray['singleOrMulti'] == 'multi') {
				$('#sampleParametersPageHeader').text('Set ' + ls.getItem('#set') + ', container ' + parseInt(yyy.split("&")[3]) + ' of ' + ls.getItem('#containersQuantity'));
			} else {
				$('#sampleParametersPageHeader').text('Single, container ' + parseInt(yyy.split("&")[3]) + ' of ' + ls.getItem('#containersQuantity'));
			}
			var tempKey = yyy;
			//var tempKey = '#C&'+workingWithThisEvCounter + '&' + ls.getItem('#set') + '&' + parseInt(yyy.split("&")[3]);
			//console.log("loading container: "+tempKey); 
			dataLoaded = getContainerDatafromLS(tempKey, '!E&' + workingWithThisEvCounter);
		} else {
			//console.log("debo mover pagina - "+eventArray['singleOrMulti']);
			$('#sampleParameters2').submit(); //Submit handler takes care of storing data
			//if (eventArray['singleOrMulti'] == 'multi') {
			//	$.mobile.changePage('#multiSet');//Redirects the page to #multiSet
			//} else {
			$.mobile.changePage('#viewModifyEventPage');//Redirects the page to #MainMenu
			//}
		}
	} */
	return dataLoaded;
}


//.............................................................................
//NEW CODE DIANNE
// Added the last argument of this function, 'addContainers' which indicates if new containers will be created or not.
// It was added when the Composite funtionality was coded.
//
//addContainers: 0 - update the Set tag but it does not create empty containers, 1 - creates the empty containers
function addEmptyContainers(keyName, initialNum, addContainers) { //NEW CODE DIANNE
	var keyData = keyName.split('&');
	var totNum = parseInt($('#addsamplesCounter' + keyData[1] + keyData[2]).val());

	var setKeyString = '!S&' + keyData[1] + '&' + keyData[2];
	saveToLocalStorage(setKeyString, changeParamByName(ls.getItem(setKeyString), totNum));
	console.log("addEmptyContainers function: addContainers is " + addContainers);
	if (addContainers == 1) {
		console.log("addEmptyContainers function: addContainers = 1");
		var initial = initialNum;
		var newSamples = totNum - initial;
		var h = getHighestLabelInLS(keyName) + 1;
		//console.log("highest: "+h+" newsamples: "+newSamples);

		for (var i = h; i < (h + newSamples); i++) {
			saveToLocalStorage(keyName + (i), '');
			addSampleButtons(keyData[1], keyData[2], i, 1);
			$('#sampleLabel' + keyData[1] + keyData[2] + i).addClass("redColor");
			//console.log('>>>>>#sampleLabel'+keyData[1]+keyData[2]+i);
		}
		if (initialNum != totNum) {
			//$('#currentButton').click();
		}
	}
}
// END NEW CODE DIANNE
//.............................................................................


//if list of stations stored in lcoalstorage and need to add only one, if
// will verify if that already exists and if not, the station will be added
function appendStation(stationId) {
	var key = 'email&' + $('#login_username').val();
	var stationFound = false;
	if (key in ls) {
		var query = ls.getItem(key);

		var stns = query.split("$")[1].split("!");
		for (var i = 0; i < stns.length; i++) {
			var pair = stns[i].split(" ");
			if (pair[1] == stationId) {
				//stationOps='<option value="'+pair[1]+'" selected >'+stns[i]+'</option>';
				stationFound = true;
			}
		}
		if (!stationFound) {
			//////ADD STATION NAME
			query = query + "!" + stationId;
		}
	} else {

	}
}


function updateHeaderText(pageid) {
	if (pageid === 'MainMenu') {
		//alert("pageid for update es: "+pageId+" variable "+localStorage.getItem('#userType'));
		if (ls.getItem('userType') !== null) {
			setHeaderText('#MainMenuHeader', "SedWE Main Menu (" + localStorage.getItem('userType') + ")");
		}
	}	// $('#page2Header').text(ls.getItem('#' + id));	

	if (pageid === 'page2') {
		//alert("pageid for update es: "+pageId+" variable "+localStorage.getItem('#userType'));
		if (ls.getItem('#sampleType') !== null) {
			//setHeaderText('#page2Header',"Adding Samples");
			switch (localStorage.getItem('#sampleType')) {
				case 'SuspSed':
					setHeaderText('#page2SubHeader', 'Suspended Sediment');
					break;
				case 'Bottom':
					setHeaderText('#page2SubHeader', 'Bottom Material');
					break;
				case 'Bedload':
					setHeaderText('#page2SubHeader', 'Bedload');
					break;
			}
			//setHeaderText('#page2SubHeader',localStorage.getItem('#sampleType'));
		}
	}
}

//Get the form data of past unfinished forms(i.e Current Samples).
function getContainerDatafromLS(key, eventKey) {  //TODO: learn what this does and rename?
	//TODO: I beleive this is a possible source of bad data... it appears it is looking back at previous pages rather than local storage.  Critical fix.
	console.log('getContainerDatafromLS');
	var dataLoaded = false;
	eventArray = getURIArray(eventKey);
	currentContainerKey = key;

	keysplit = key.split('&');
	saveToLocalStorage('#currentContainerNumber', parseInt(keysplit[3])); //getURIItem(setKey,'containersQuantity')
	var setKey = '!S&' + keysplit[1] + '&' + keysplit[2];

	//fill containersQuantity in LS to have info on total samples in set
	tempContQuant = parseInt(getURIItem(setKey, 'containersQuantity'));
	$('#containersQuantity').val(tempContQuant); // set the form value in case other pages are still looking there for the containerQuantity
	save_data('containersQuantity', tempContQuant); // save the containerQuantity to LS

	save_data('analysis', getURIItem(setKey, 'analysis'));

	if (eventArray['singleOrMulti'] !== 'single') {
		$('#sampleParametersPageHeader').text('Set ' + String(keysplit[2]) + ', container ' + ls.getItem('#currentContainerNumber') + ' of ' + ls.getItem('#containersQuantity'));
	} else {
		save_data('setQuantity', $('#containersQuantity').val());
		$('#sampleParametersPageHeader').text('Single, container ' + ls.getItem('#currentContainerNumber') + ' of ' + ls.getItem('#containersQuantity'));
	}

	fillSelect(eventArray['sampleType']);

	if (key in ls) {
		var query = ls.getItem(key);//looks for  the key in localStorage
		//console.log(query);
		if (query === '') {
			//console.log("+++datafromLS: empty EvtDate: "+eventArray['evtDate']);
			$('#beginDate').val(eventArray['evtDate']);
		} else {

			$('#addOnAnalysisLOI').prop('checked', false);
			$('#addOnAnalysisSF').prop('checked', false);
			$('#addOnAnalysisSA').prop('checked', false);
			;
			$('#addOnAnalysisZ').prop('checked', false);

			if ('#addOnAnalysisLOI' in ls)ls.removeItem('#addOnAnalysisLOI');
			if ('#addOnAnalysisSF' in ls)ls.removeItem('#addOnAnalysisSF');
			if ('#addOnAnalysisSA' in ls)ls.removeItem('#addOnAnalysisSA');
			if ('#addOnAnalysisZ' in ls)ls.removeItem('#addOnAnalysisZ');
			if ('#addOnAnalysis' in ls)ls.removeItem('#addOnAnalysis');

			var data = query.split("&");//search and split each element in the local storage by '&' delimiter 
			for (var i = 0; i < data.length; i++) {
				var item = data[i].split("=");

				if ($("#" + item[0]).attr('type') == 'checkbox') {
					//$("#" + item[0]).attr("checked","checked"); //it was working

					$("#" + item[0]).prop("checked", true);
					$("#" + item[0]).enhanceWithin();
				} else {
					if (item[0] !== "addOnAnalysis") {
						$("#" + item[0]).val(item[1]);
					}
				}
				if (item[0] == 'P84164' || item[0] == 'P82398') {
					//console.log("--> "+item[0]+": "+item[1]);
					$("#" + item[0]).find('option[value="' + item[1] + '"]').attr("selected", true);
					$("#" + item[0]).enhanceWithin();
					$("#" + item[0]).change();
				}

				if (item[0] == 'addOnAnalysis') {

					save_data(item[0], item[1]);
					var addOnVar = item[1].split(',');

					for (var x = 0; x < addOnVar.length; x++) {
						$('#addOnAnalysis' + addOnVar[x]).prop('checked', true);//.checkboxradio("refresh");
					}
				}

			}
			dataLoaded = true;
		}
	}
	return dataLoaded;
}


//Count matching Elements in local storage
function countElementsInLS(valString) {
	var counterOfElmsInLS = 0;

	for (ice = 0; ice < ls.length; ice++) {
		if (ls.key(ice).indexOf(valString) !== -1) {
			counterOfElmsInLS++;
		}
	}
	return counterOfElmsInLS;
}

//Compare date and time in all containers that matches keyStr. 
// Returns true is date/time already exists
//
function dateTimeExistsInSet() {  //todo: it seems this fucntion could be generalized to look at a passed key rather than the eventCounter?  Why?
	var keyStr = '!C&' + eventCounter;
	var dateStr = $('#beginDate').val();
	var timeStr = $('#beginTime').val();
	console.log("keyStr: " + keyStr);

	console.log(" bDate: " + dateStr + " bTime: " + timeStr);
	for (i = 0; i < ls.length; i++) {
		if (ls.key(i).indexOf(keyStr) !== -1) {
			var idx = ls.key(i);
			if (dateStr == getURIItem(idx, 'beginDate')) {
				if (timeStr == getURIItem(idx, 'beginTime')) {
					return true;
				}
			}
		}
	}
	return false;
}

function getHighestLabelInLS(valString) {
	var highest = 0;
	var tempNum = 0;
	var data;

	for (i = 0; i < ls.length; i++) {
		if (ls.key(i).indexOf(valString) !== -1) {
			data = ls.key(i).split("&");
			tempNum = parseInt(data[3]);
			if (tempNum >= highest)
				highest = tempNum;
		}
	}
	return highest;
}

function findNextContainerInLS(valString) {
	//console.log("findNextContainerInLS("+valString+")");
	var xxxCounter = parseInt(valString.split("&")[3]);
	var partKey = valString.split("&")[0] + '&' + valString.split("&")[1] + '&' + valString.split("&")[2] + '&';
	//console.log("PARTIAL: "+partKey);
	//currentContainerKey.split("&")[3]
	var highest = 0;
	var tempNum = 0;
	var data;
	var xxx1 = valString;
	var cc = xxxCounter;
	while (cc <= 40) {
		cc++;
		xxx1 = partKey + cc;
		if (xxx1 in ls) {
			return xxx1;
		}

	}
	return valString;
}

function findPrevContainerInLS(valString) {
	//console.log("findPrevContainerInLS("+valString+")");
	var xxxCounter = parseInt(valString.split("&")[3]);
	var partKey = valString.split("&")[0] + '&' + valString.split("&")[1] + '&' + valString.split("&")[2] + '&';
	//console.log("FIND2: "+partKey);
	//currentContainerKey.split("&")[3]
	var highest = 0;
	var tempNum = 0;
	var data;
	var xxx1 = valString;
	var cc = xxxCounter;
	while (cc > 0) {
		cc--;
		xxx1 = partKey + cc;
		if (xxx1 in ls) {
			return xxx1;
		}

	}
	return valString;
}


//Method for deleting sets, groups, samples, and events
function deleteSamples(delType, evCounter, letter, contCounter) { //TODO: This should be broken up into 3 separate functions
	console.log('deleteSamples(' + delType + ',' + evCounter + ',' + letter + "," + contCounter + ")");
	var tempKey = "";
	//var letter =  String.fromCharCode(letterCtr);
	var moreSets = true;
	var moreCountainers = true;
	var counter = 0;
	var ii = 0;
	switch (delType) {
		case '0': //del one sample - group (single)
			tempKey = '!C&' + evCounter + '&' + letter + '&' + contCounter;

			for (i = 0; i < ls.length; i++) {
				if (ls.key(i).indexOf("!C&" + evCounter + '&' + letter) !== -1) {
					counter++;
				}
			}
			if (counter > 1) {
				if (tempKey in ls) {
					ls.removeItem(tempKey);
					var setKey = '!S&'+evCounter+'&'+letter;
					var numSetContainers = parseInt(getURIItem(setKey,'containersQuantity'));
					numSetContainers = numSetContainers-1;
					updateURIItem('!S&'+evCounter+'&'+letter,'containersQuantity',numSetContainers);
				}
			} else {
				alert("groups/sets can not be empty.");
			}
			//sampleLabel'+stctr+letter+counter

			//addsamplesCounter'+eventKey.split('&')[1]+'A"
			var ttt = $('#addsamplesCounter' + evCounter + letter).val();
			if (ttt != 1) {
				$('#addsamplesCounter' + evCounter + letter).val(ttt - 1);
				$('#sampleLabel' + evCounter + letter + contCounter).remove();
			}
			break;
		case '1': //del sample - Set
			for (i = 0; i < ls.length; i++) {
				if (ls.key(i).indexOf("!S&" + evCounter) !== -1) {
					counter++;
				}
			}
			if (counter > 1) {
				for (var key in ls) {
					//for (i=0; i< ls.length; i++) {
					if (key.indexOf("!C&" + evCounter + '&' + letter) !== -1) {
						// console.log("deleting container: "+key);
						ls.removeItem(key);
					}
					if (key.indexOf("!S&" + evCounter + '&' + letter) !== -1) {
						// console.log("deleting group/set: "+key);
						ls.removeItem(key);
					}
					createCurrentSets(evCounter, 'MULT');
				}
			} else {
				alert("event can not be without sets/group. Please delete the event instead");
			}
			break;

		case '2':	//del Event Single	   
			for (var key in localStorage) {
				if (key.indexOf("!C&" + evCounter) !== -1) {
					//console.log("deleting container: "+key);
					ls.removeItem(key);
				}
				if (key.indexOf("!S&" + evCounter) !== -1) {
					//console.log("deleting group/set: "+key);
					ls.removeItem(key);
				}
				if (key.indexOf("!E&" + evCounter) !== -1) {
					//console.log("deleting event: "+key);
					ls.removeItem(key);
				}
			}
			if (window.navigator.onLine) {
				//if (false) {
				markEventDeletedInDB(getEventGUIDFromLS(evCounter));  //TODO: add in callbacks
			} else {
				addToMarkForDeletionList(getEventGUIDFromLS(evCounter)); // TODO: add in callbacks
			}
			alert("Event " + evCounter + " has been deleted");
			currentShipmentLayout(); // should refresh the currentShipment Page // TODO: create a 'refresh' function instead.
			break;
	}

}

function addToMarkForDeletionList(guid) {
	console.log("addToMarkForDeletionList: " + guid);
	var deletionList = ls.getItem("ForDeletionList");

	if (deletionList != null) {
		if (deletionList.indexOf(guid)!=-1) {
			return;
		}
		ls.setItem("ForDeletionList", ls.getItem("ForDeletionList") + guid + ",");
	} else {
		ls.setItem("ForDeletionList", guid + ",");
	}
}


/* this function will attempt to sync the local storage with the SedWE DB.  It will check for connectivity and if it finds it start syncing and call the passed callback function when done.
 local storage has priority.
 */
function attemptToSyncLSAndDB(successCallback, failureCallback) {
	console.log("-- Attempting to sync");

	$('#syncingArea').html('Attempting to Sync...');
	$('#syncingDiv').show(1000, function () {

		// check if we are online
		if (!window.navigator.onLine) {
			failureCallback('Connection Unavailable');
			return;
		}
			console.log("window thinks it is online... let's sync!");



		// mark the deletions in the DB   ... then  LS->DB  ... then DB->LS ... which calls the success callback.
		syncAllDeletionsToDB(function () {
			syncAllEventsfromLStoDB(function () {
				getAllEventsFromDB(successCallback);
			});
		});
	});
}

function syncAllDeletionsToDB(nextFunction) {
	console.log("syncAllDeletionsToDB");
	$('#syncingArea').html('Syncing Deletions...');
	var deletionList = ls.getItem("ForDeletionList");
	var delCallbackArr = [];
	if (deletionList != null && deletionList.length > 1) {

		deletionArray = deletionList.split(",");

		deletionArray.forEach(function (guid) {
			if (guid.length > 0) {
				delCallbackArr.push(guid); // storing so we know it's been 'sent for deletion'
				markEventDeletedInDB(guid, function (resp) {   //todo: need to get return from this and add in a callback
					// remove it from the deletionList
					if (resp.indexOf("success")!=-1) {
						deletionList = deletionList.replace(guid + ",", "");  // try removing it with the comma to keep the list from being just commas at the end
						deletionList = deletionList.replace(guid, ""); //todo: commas are all left behind... the above line doesn't fix it
						saveToLocalStorage('ForDeletionList', deletionList);
						console.log(ls.getItem('ForDeletionList'));
						console.log("Deletions sync'd to DB");
					} else {
						console.log("Attempt to mark '" + guid + "' for deletion failed");
					}
					var i = delCallbackArr.indexOf(guid);
					if (i != -1) {
						delCallbackArr.splice(i, 1);
					}
					if (delCallbackArr.length == 0) {
						console.log("all delete syncs callbacks called... next!");
						nextFunction();
					}

				});
			}
		});
	} else {
		console.log("there were no delete to sync.... next!");
		nextFunction();
	}
}


function syncAllEventsfromLStoDB(nextFunction) {
	// save all events in LS to the DB (note, not submit)
	$('#syncingArea').html('Syncing to DB...');
	console.log("attempting to sync events from LS to DB");

	var lsEventCallbackArr = [];
	for (var lskey in localStorage) {
		if (lskey.indexOf('!E&') === 0) {
			//alert('syncing: ' + lskey + "=" + getEventGUIDFromLS(lskey));
			lsEventCallbackArr.push(getEventGUIDFromLS(lskey));
			// then this is an event.
			var eKey = lskey;
			getEventXML(eKey);
			var eventArray = getURIArray(eKey);
			var siteID = eventArray['station'];
			var eKeyArr = eKey.split('&');
			var eventID = eKeyArr[1];
			var guid = getEventGUIDFromLS(eventID);
			var userEmail = ls.getItem('login_username');
			var evtDate = eventArray['evtDate'];
			if (inHistory(guid)) {
				var status = 1;
			} else {
				var status = 0
			}
			var overwrite = true; // TODO: need to discuss with the SedWE team

			saveEventToDB(getXMLString(), siteID, userEmail, evtDate, status, guid, overwrite, function (guidBack) {
				var i = lsEventCallbackArr.indexOf(guidBack);
				if (i != -1) {
					lsEventCallbackArr.splice(i, 1);
				}
				if (lsEventCallbackArr.length == 0) {
					console.log("callback syncAllEventsfromLStoDB next!");
					nextFunction();
				}
			}, function (guidBack) {
				console.log("failed to save to DB... guid: " + guidBack);
			});
		}
	}
	if (lsEventCallbackArr.length == 0) {
		console.log('nothting to sync from LS to DB... next!')
		nextFunction();
	}

}

function SyncCompleteCallback() {
	$('#syncingArea').html('Syncing was successful...');
	$('#syncingDiv').hide(4000);
	alert("Sync complete!");
}

function SyncFailCallback(errorMsg) {
	$('#syncingArea').html(errorMsg);
	$('#syncingDiv').hide(3000);
	//$('#syncingArea').hide('3000'); // todo: make it red or show a failure sign or something
	alert("Sync Fail!");
}

function loadXMLString(txt)
{
	if (window.DOMParser)
	{
		parser=new DOMParser();
		xmlDoc=parser.parseFromString(txt,"text/xml");
	}
	else // code for IE
	{
		xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async=false;
		xmlDoc.loadXML(txt);
	}
	return xmlDoc;
}

function outputTree(node, depth) {
	console.log("\nOT: " + node.nodeName + ", " + depth);
	var retStr;

	if(node.hasChildNodes()) {
		console.log("NodeName: " + node.nodeName);
		console.log("NodeValue: " + node.nodeValue);

		for (var i = 0; i < node.childNodes.length; i++) {
			retStr += node.nodeName + '<li>'
			if (node.nodeName != '#text') {
				//console.log("Calling OT on " + node.childNodes[i].nodeName);
				retStr += '<li>' + outputTree(node.childNodes[i], depth + 1) + '</li>';
			}
				retStr += "</li>";
		}
		return retStr;

	} else {
		//console.log('Value: ' + node.childNodes[0].nodeValue);
		console.log("LeafName: " + node.nodeName);
		console.log("LeafValue: " + node.nodeValue);
		spacer = "";
		for (var i = 0; i < depth; 	i++	) {
			spacer += "  ";
		}

		try { // protects against malformed xmlDoc
			console.log("returning " + node.nodeValue);
			return spacer + node.nodeValue;
		} catch (e) {
			console.error(e);
			return;
		}
	}
}

function getContainerHTML(key, stn, setgroup, contNum) {
	console.log("getContainerHTML(" + key + "," + stn + "," + setgroup + "," + contNum + ")");
	// key is container key



	getEventXML(key); // note, these 'getters' don't actually get anything, which makes no sense but that's how they were programmed
	xmlDoc = loadXMLString(getXMLString());



//TODO: this xmlsSTring actually returns useful stuff.  We need to traverse the XMLSTring (perhaps turn into xml object) and find the right 'set' and then turn that info into the display.



	var appender = "Here we go! <br>";

	//appender = outputTree(xmlDoc, 0);

	var jsonStr = xml2json(xmlDoc,"");

	jsonStr = replaceAll('{','<br>', jsonStr);
	jsonStr = replaceAll('}', '<br>', jsonStr);


	$('#FFView').append(appender + jsonStr);

	/*$('#reportTable').empty();




	var query = ls.getItem(key);
	var data = query.split("&");
	var analyses = [];
	//SETGROUP ES LETRA, NO SINGLE STRING			
	if (eventArray['singleOrMulti'] === "single")
		$('#reportHeader h3').text(stn + " Single Sample " + contNum);
	else
		$('#reportHeader h3').text(stn + " Set " + setgroup + " Sample " + contNum);
	//alert("inicio: "+$('#reportPage').html());
	var table = $('#reportTable');
	table.append('<thead><tr><th>Description</th><th>Value</th><th data-priority="1">Remark</th><th data-priority="2">Method</th><th data-priority="3">Null Qualifier</th></tr></thead><tbody></tbody>');

	for (var i = 0; i < data.length; i++) {

		var item = data[i].split("=");


		if (item[1] === '+' || item[1] === '') {
		} else {
			switch (item[0]) {

				case 'setType':
//				table.append('<tr><td>Method</td><td>' + String(item[1]) + '</td><td></td><td></td><td></td></tr>'); 
					table.last("tr").append('<tr><td>Set Type</td><td>' + String(item[1]) + '</td><td></td><td></td><td></td></tr>');
					break;

				case 'containersQuantity':
					table.last("tr").append('<tr><td>Container Quantity</td><td>' + String(item[1]) + '</td><td></td><td></td><td></td></tr>');
					break;


				case 'analyzeIndSamples':
					if (item[1] === 'N') {
						table.last("tr").append('<tr><td>Composite</td><td>No, Composite containers</td><td></td><td></td><td></td></tr>');
					} else {
						table.last("tr").append('<tr><td>Composite</td><td>Yes, Analyze individual containers</td><td></td><td></td><td></td></tr>');
					}
					break;
				case 'station':
					table.last("tr").append('<tr><td>Station</td><td>' + String(item[1]) + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'sampleMedium':
					table.last("tr").append('<tr><td>Sample Medium</td><td>' + String(item[1]) + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'evtDate':
					table.last("tr").append('<tr><td>Date</td><td>' + decodeURIComponent(item[1]) + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'EVENT':
					if ($('#eventTD').length > 0) {
						$('#eventTD,#eventTDR').empty();
						$('#eventTD').text('Event');
						$('#eventTDR').text(item[1]);
					} else {
						table.last("tr").append('<tr><td id="eventTD">Event</td><td id="eventTDR">' + String(item[1]) + '</td><td></td><td></td><td></td></tr>');
					}
					break;
				case 'setQuantity':
					table.last("tr").append('<tr><td>Set Quantity</td><td>' + String(item[1]) + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'singleOrMulti':
					table.last("tr").append('<tr><td>' + 'Single or multiple' + '</td><td>' + String(item[1]) + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'analysis':

					if (analyses.length === 0) {
						analyses.push(item[1]);
						table.last("tr").append('<tr><td id="analysesTD">' + 'Analysis' + '</td><td id="analysesTDR">' + analyses + '</td><td></td><td></td><td></td></tr>');
					} else {
						if (item[1] in analyses) {
						} else {
							analyses.push(item[1]);
							$('#analysesTD, #analysesTDR').empty();
							$('#analysesTD').text('Analyses');
							$('#analysesTDR').text(analyses);
						}
					}
					//console.log(analyses);
					//table.append('<tr><td id="analysesTD">' + 'Single or multiple' + '</td><td id="analysesTDR">' + analyses + '</td></tr>');
					break;
				case 'beginDate':
					table.last("tr").append('<tr><td>' + 'Begin date' + '</td><td>' + decodeURIComponent(item[1]) + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'beginTime':
					table.last("tr").append('<tr><td>' + 'Begin time' + '</td><td>' + item[1].replace('%3A', ':') + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'timeDatum':
					table.last("tr").append('<tr><td>' + 'Time datum' + '</td><td>' + item[1] + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'addOnAnalisys':
					table.last("tr").append('<tr><td>' + 'Add-On Analyses' + '</td><td>' + item[1] + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'collectingAgency':
					table.last("tr").append('<tr><td>' + 'Collecting agency' + '</td><td>' + item[1] + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'collectorsInitials':
					table.last("tr").append('<tr><td>' + 'Collectors initials' + '</td><td>' + item[1] + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'containerNum':
					table.last("tr").append('<tr><td>' + 'Container number' + '</td><td>' + item[1] + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'HSTAT':
					table.last("tr").append('<tr><td>' + 'Hydrologic condition' + '</td><td>' + item[1] + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'STYPE':
					table.last("tr").append('<tr><td>' + 'Sample type' + '</td><td>' + item[1] + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'ASTAT':
					//alert( $('#ASTAT').find('option[value="'+item[1]+'"]').text() );
					table.last("tr").append('<tr><td>' + 'Analysis status' + '</td><td>' + item[1] + '</td><td></td><td></td><td></td></tr>');
					//table.append('<tr><td>' + 'Analysis status' + '</td><td>' + $('#ASTAT').find('option[value="'+item[1]+'"]').text() + '</td></tr>');
					break;

				case 'P71999':
					table.last("tr").append('<tr><td></td><td>' + item[1] + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'P82398':
					table.last("tr").append('<tr><td>Sampling method</td><td>' + item[1] + '</td><td></td><td></td><td></td></tr>');
					break;
				case 'P84164':
					table.last("tr").append('<tr><td>Sampler Type</td><td>' + item[1] + '</td><td></td><td></td><td></td></tr>');
					break;

				case 'P00009':
					table.last("tr").append('<tr><td>Location in cross section: Left</td><td>' + item[1] + '</td></tr>');
					break;
				case 'P00009R':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;

				case 'P72103':
					table.last("tr").append('<tr><td>Location in cross section: Right</td><td>' + item[1] + '</td></tr>');
					break;
				case 'P72103R':
					table.last("tr").last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P00003':
					table.last("tr").append('<tr><td>Sampling depth</td><td>' + item[1] + ' ft</td></tr>');
					break;
				case 'P00003R':
					table.last("tr").last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P00004':
					table.last("tr").append('<tr><td>Stream width</td><td>' + item[1] + ' ft</td></tr>');
					break;
				case 'P00004R':
					table.last("tr").last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P00064':
					table.last("tr").append('<tr><td>Mean depth of stream</td><td>' + item[1] + ' ft</td></tr>');
					break;
				case 'P00064R':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'M2Lab':
					table.last("tr").append('<tr><td>Message to lab</td><td>' + item[1] + ' ft</td></tr>');
					break;
				case 'P00061':
					table.last("tr").append('<tr><td>Instantaneous discharge</td><td>' + item[1] + ' cfs</td></tr>');
					break;
				case 'P00061R':
				case 'P00061M':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P00010':
					table.last("tr").append('<tr><td>Water temperature</td><td>' + item[1] + String.fromCharCode(176) + 'C</td></tr>');
					break;
				case 'P00010R':
				case 'P00010M':
				case 'P00010N':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P00063':
					table.last("tr").append('<tr><td>Number of sampling points</td><td>' + item[1] + ' </td></tr>');
					break;
				case 'P00063R':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P00020':
					table.last("tr").append('<tr><td>Air temperature</td><td>' + item[1] + String.fromCharCode(176) + 'C</td></tr>');
					break;
				case 'P00020R':
				case 'P00020M':
				case 'P00020N':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P00065':
					table.last("tr").append('<tr><td>Gage height</td><td>' + item[1] + ' ft</td></tr>');
					break;
				case 'P00065R':
				case 'P00065M':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P00095':
					table.last("tr").append('<tr><td>Specific conductance</td><td>' + item[1] + ' per cm at 25' + String.fromCharCode(176) + 'C</td></tr>');
					break;
				case 'P00095R':
				case 'P00095M':
				case 'P00095N':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P63675':
					table.last("tr").append('<tr><td>Turbidity</td><td>' + item[1] + ' NTU, 400-600nm, 90' + String.fromCharCode(177) + '30' + String.fromCharCode(176) + '</td></tr>');
					break;
				case 'P63675R':
				case 'P63675M':
				case 'P63675N':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P63676':
					table.last("tr").append('<tr><td>Turbidity</td><td>' + item[1] + ' NTU,400-600nm, multiple angles</td></tr>');
					break;
				case 'P63676R':
				case 'P63676M':
				case 'P63676N':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P63680':
					table.last("tr").append('<tr><td>Turbidity</td><td>' + item[1] + ' NTU,780-900nm,90' + String.fromCharCode(177) + '2.5' + String.fromCharCode(176) + '</td></tr>');
					break;
				case 'P63680R':
				case 'P63680M':
				case 'P63680N':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P65225':
					table.last("tr").append('<tr><td>Transparency, transparecy tube</td><td>' + item[1] + ' cm</td></tr>');
					break;
				case 'P65225R':
				case 'P65225M':
				case 'P65225N':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P30333':
					table.last("tr").append('<tr><td>Bag mesh, bedload sampler</td><td>' + item[1] + ' mm</td></tr>');
					break;
				case 'P30333R':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P04117':
					table.last("tr").append('<tr><td>Thether line used for collecting sample</td><td>' + item[1] + '</td></tr>');
					break;
				case 'P04118':
					table.last("tr").append('<tr><td>Composite samples in cross-sectional bedload measurement</td><td>' + item[1] + '</td></tr>');
					break;
				case 'P04119':
					table.last("tr").append('<tr><td>Vertical in composite sample</td><td>' + item[1] + ' s</td></tr>');
					break;
				case 'P04120':
					table.last("tr").append('<tr><td>Rest time on bed for Bedload sample</td><td>' + item[1] + ' s</td></tr>');
					break;
				case 'P04120R':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P04121':
					table.last("tr").append('<tr><td>Horizontal width of vertical</td><td>' + item[1] + ' ft</td></tr>');
					break;
				case 'P04121R':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P82073':
					table.last("tr").append('<tr><td>Starting time</td><td>' + item[1] + '</td></tr>');
					break;
				case 'P82073R':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;
				case 'P82074':
					table.last("tr").append('<tr><td>Ending time</td><td>' + item[1] + '</td></tr>');
					break;
				case 'P82074R':
					table.last("td").append('<td>' + item[1] + '</td>');
					break;

			}

		}
	}
*/
	$('#reportTable tr:odd').css("background-color", '#e9e9e9'); //paints odd rows with cyan
}


//---------------------------------

//Checks the local storage and create a user friendly report of the data stored
//key, station, string of SNGL or letter or SET, container counter
function getURIItem(key, itemObj) {
//console.log('getURIItem('+key+", " + itemObj +")");
	var query = ls.getItem(key);
	if(query==null) {
		return "";
	}
	var vars = query.split("&");
	for (var i = 0; i < vars.length; i++) {
		var pair = vars[i].split("=");
		if (pair[0] == itemObj) {
			//console.log("getURIItem: "+itemObj+": "+pair[1]);

			return pair[1];
		}
	}
	return "";
}

function getURIArray(key) {

	var request = {};
	var query = ls.getItem(key);

	var pairs = query.split("&");
	for (var i = 0; i < pairs.length; i++) {
		var pair = pairs[i].split('=');
		request[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
	}
	return request;
}


function updateURIItem(key, paramName, paramValue) {
	var url = ls.getItem(key);
	if (url.indexOf(paramName + "=") >= 0) {
		var prefix = url.substring(0, url.indexOf(paramName));
		var suffix = url.substring(url.indexOf(paramName));
		suffix = suffix.substring(suffix.indexOf("=") + 1);
		suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
		url = prefix + paramName + "=" + paramValue + suffix;
	}
	else {
		if (url.indexOf("?") < 0)
			url += "?" + paramName + "=" + paramValue;
		else
			url += "&" + paramName + "=" + paramValue;
	}
	//window.location.href = url;
	//alert("new url : "+url);
	saveToLocalStorage(key, url);
}


// As far as I can tell, this function sets up the ability to call the "getXMLString" function.
function getEventXML(eKey) { //TODO: Rename function and/or combine with others... very hard to read.  Lilely split it up as well.
	//note, for some reason rather than returning the xml, this stores things in '$content'

	var eventArray = getURIArray(eKey);

	var eKeyArr = eKey.split('&');
	var eventID = eKeyArr[1];
	var setKey = '';
	var setData = '';
	var cKey = '';
	var cData = '';

	var moreSets = true;
	var sKey = '';
	var nodeStr = '';
	var letterCtr = 65;
	var letter = String.fromCharCode(letterCtr);
	var counter = 0;

	var keyStr = '';
	var node = "";
	createContent('<?xml version="1.0" encoding="ISO-8859-1"?>\n  <SedWE_data/>\n', 0);

	nodeStr =
		'  <Event>\n' +
		'    <EventNumber>' + eventID + '</EventNumber>\n' +
		'    <SiteId>' + eventArray['station'] + '</SiteId>\n' +
		'    <AgencyCd>' + eventArray['agencyCd'] + '</AgencyCd>\n' +
		'    <SiteNm>' + eventArray['stationNm'] + '</SiteNm>\n' +
		'    <SedTranspMode>' + eventArray['sampleType'] + '</SedTranspMode>\n' +
		'    <SmplMediumCode>' + eventArray['sampleMedium'] + '</SmplMediumCode>\n' +
		'    <CollectedVia>' + eventArray['CollectedVia'] + '</CollectedVia>\n' +
		'    <EventFieldComments>' + eventArray['EventFieldComments'] + '</EventFieldComments>\n';

	if (eventArray['singleOrMulti'] == 'multi') {

		nodeStr += '    <AvgRepMeasures>' + eventArray['averageRep'] + '</AvgRepMeasures>\n  </Event>\n';
	} else {

		nodeStr += '</Event>\n';
	}

	addNode("SedWE_data", nodeStr, "Event", 0, null, 0);

	while (moreSets) {

		setKey = '!S&' + eventID + '&' + letter;
		//console.log("SET: "+setKey);

		counter = 1;
		//console.log('key S '+keyStr);
		if (setKey in ls) { //is in localstorage??
			setData = ls.getItem(setKey); //find set content
			if (eventArray['singleOrMulti'] == 'single') {
				nodeStr = '<Name>Sngl</Name>\n';
			} else {
				nodeStr = '<Name>' + letter + '</Name>\n';
			}


			if (getURIItem(setKey, 'setType') == "") {  //editsetxmlhere
				addNode("Event", "      <Set>\n" + nodeStr + "      <NumberOfSamples>" + getURIItem(setKey, 'containersQuantity') + "</NumberOfSamples>\n      <AnalyzeIndSamples>" +
					getURIItem(setKey, 'analyzeIndSamples') + "</AnalyzeIndSamples>\n      <Analyses>" + getURIItem(setKey, 'analysis') + "</Analyses>\n     <SetType></SetType>" +
					"\n     <SetFieldComments>" + getURIItem(setKey,'SetFieldComments') + "</SetFieldComments>\n    </Set>", "Set", 0, null, 0);
			} else {
				addNode("Event", "      <Set>\n" + nodeStr + "      <NumberOfSamples>" + getURIItem(setKey, 'containersQuantity') + "</NumberOfSamples>\n      <AnalyzeIndSamples>" +
				getURIItem(setKey, 'analyzeIndSamples') + "</AnalyzeIndSamples>\n      <Analyses>" + getURIItem(setKey, 'analysis') + "</Analyses>" +
					"\n      <SetType>" + getURIItem(setKey, 'setType') + "</SetType>\n     <SetFieldComments>" + getURIItem(setKey,'SetFieldComments') + "</SetFieldComments>\n    </Set>\n", "Set", 0, null, 0);
			}

			counter = 1;
			moreContainers = true;
			while (moreContainers) {
				keyStr = '!C&' + eventID + '&' + letter + '&' + counter;
				//console.log('key C '+keyStr);

				if (keyStr in ls) {
					if (counter == 1) {
						getContainerXML(keyStr, true);
					} else {
						getContainerXML(keyStr, true);
					}
				} //else {
				if (counter === SAMPLEQTY) {
					moreContainers = false;
				}
				counter++;
			}

		} //else {
		if (letterCtr === SETQTY) {
			moreSets = false;
		}
		letterCtr++;
		letter = String.fromCharCode(letterCtr);
	}

}


/* adds specified event ID to the history (database) and refreshes the history (local storage) from the DB.  See markAsHistory(eKey,dateTime)*/
function markAsHistoryLite(guid) {
	console.log('2');
	markAsHistory(guid, getCurrentDateTime());
}

function getCurrentDateTime() {
	var d = new Date();
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1; //January is 0!

	var yyyy = today.getFullYear();
	if(dd<10){
		dd='0'+dd
	}
	if(mm<10){
		mm='0'+mm
	}
	var today = yyyy+'-'+mm+'-'+dd;

	return today + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
}

/* adds specified event ID to the history (database)  and refreshes the history (local storage) from the DB.
 *  @guid should be the event guid.
 *  @dateTime should be in the format 'YYYY-MM-DD @ HH:MM'
 * */
function markAsHistory(guid, dateTime) {
	console.log("markAsHistory: " + guid);

	var historyList = ls.getItem("HistoryList");

	if (historyList != null && historyList != "") {
		if (historyList.indexOf(guid)!=-1) {
			return;
		} else {
			ls.setItem("HistoryList", ls.getItem("HistoryList") + ",!G&" + guid + "%" + dateTime);
		}
	} else {
		ls.setItem("HistoryList", "!G&" + guid + "%" + dateTime);
	}
}


function clearLocalHistoryList() {
	alert("Clearing local history list");
	ls.removeItem("HistoryList");
}


function saveChangesToSetFromModifyEventPage(setKey) {
	var setID = setKey.split('&')[2];
	updateURIItem(setKey,'analysis',getGroupCheckboxValues('analysisEdit'+setID, false,0));
	alert("Analyses Options Saved");
}

// saves the items on the EventProperties page (previously 'page2') to local storage
function saveEventProperties() {
	console.log('saveEventProperties()');
	if ($('#sampleProperties').valid()) {
		console.log("samplePropertis is valid");
		save_data('station', $('#station').val());
		save_data('stationName', $('#station :selected').text());
		save_data('sampleMedium', $('#sampleMedium').val());
		save_data('evtDate', $('#evtDate').val());
		save_data('EVENT', $('#EVENT').val());  // TODO: change this name.  Be careful because it gets saved int he LS as 'EVENT' as well...
		save_data('singleOrMulti', $('#singleOrMulti').val());
		if(ls.getItem('singleOrMulti')=='single') {   //TODO: maybe just remove the #setQuantity field it if it's a single?
			save_data('containersQuantity', $('#setQuantity').val());
		} else {
			save_data('setQuantity', $('#setQuantity').val());
		}
		save_data('averageRep', $('#averageRep').val());
		save_data('CollectedVia', $('#CollectedVia').val());
		save_data('EventFieldComments', $('#EventFieldComments').val());

		createNewEvent(); // TODO: call this separately rather than chained at the end of this.
	} else {
		console.log("samplePropertis is not valid");
	}
}

function createNewEvent() {  // note this uses fields on the 'page2'
// todo: have everything save to LS when page2 loads/finishes and then pull this entire fucntion from LS
	//tODO: remove eventid's and just use the guid.  Long term process
	//TODO: lots of pulls from forms rather than LS... this is a problem.
	console.log('createNewEvent()');
	//TODO: check that all requisite data is available and throw error if not

	// take care of items common to single and multi events....
	// note the current event in LS
	var currentEventNumber = getNextEventNumber();  //todo: all references to currentEVentNumber in this function should point to the LS
	saveToLocalStorage("#currentEventNumber", currentEventNumber);


	//Save Event index tag that describes the event
	saveToLocalStorage('!E&' + currentEventNumber,
		$('#station').serialize() +
		'&userType=' + ls.getItem('userType') +
		'&' + decodeURIComponent($('#evtDate').serialize()) +
		'&' + $('#singleOrMulti').serialize() +
		'&sampleType=' + ls.getItem('#sampleType') +
		'&' + $('#sampleMedium').serialize() +
		'&' + $('#EVENT').serialize() +
		'&' + $('#averageRep').serialize() +
		'&agencyCd=' + ls.getItem('#stationName').split(' ')[0] +
		'&stationNm=' + ls.getItem('#stationName').split(' - ')[1] +
		'&CollectedVia=' + ls.getItem('#CollectedVia') +
		'&EventFieldComments=' + ls.getItem('#EventFieldComments'));

	// save the matching guid
	saveToLocalStorage('!G&' + currentEventNumber, generateGUID());

	var setLetter = 65;
	if (ls.getItem('#singleOrMulti') == 'multi') {
		// create the requested number of empty sets in LS (note, 65 is 'A')
		var numSets = ls.getItem('#setQuantity');
		for (i = 0; i < numSets; i++) {
			saveToLocalStorage('!S&' + currentEventNumber + '&' + String.fromCharCode(setLetter + i), '');
		}
	} else {
		// single
		$('#containersQuantity').val($('#setQuantity').val()); //in Single, containersQuantity is the same value as setQuantity
		save_data('containersQuantity', $('#setQuantity').val()); //copy same value into localStorage
		saveToLocalStorage('!S&' + eventCounter + '&' + String.fromCharCode(setLetter), '');
	}

	//TODO: passing this information via a variable breaks the refresh model.  Suggest splitting this data into LS and re-ingesting it as needed


	var workingWithThisEvCounter = currentEventNumber; //tODO: likely remove

	// TODO: this is what actually sends us to the next page...   Probably want to change this such that the setProperties page actually sets up the setProperties page...
	if (ls.getItem('#singleOrMulti') == 'multi') {
		$(':mobile-pagecontainer').pagecontainer('change', '#multiSet', {transition: 'fade', reload: true});
//			$('#multiAtributes').show();  // not sure thi sis doing anything
//			$('.Multi_only').show(); // not sure this is doing anything
	} else { //single
//			$('.Multi_only').hide();
		//if (eventArray['userType'] != 'Observer' || eventArray['userType'] == 'Observer') { // Teck & Admin  //TODO: Check with KEN!
		$(':mobile-pagecontainer').pagecontainer('change', '#setProperties', {
			transition: 'fade',
			reload: true
		});
		//		changeSet('A');
		// console.log('*** Getting set from ls: '+ls.getItem('#set'));
//				$('#multiAtributes').hide();
		//	}  //else { //Observer
//				changeSet('A');
//				linkToContainersObserver();
//			}
	}
}

function saveChangesToEventFromModifyEventPage() {  // this is the onclick function for saving on the viewModify page
	console.log('saveChangesToEvent()');
	//save the default begin date
	console.log("Updating event " + ls.getItem('#currentEventNumber') + " with " + $('#defaultDate').val() + " date");
	updateURIItem('!E&'+ls.getItem('#currentEventNumber'), 'evtDate', $('#defaultDate').val());

	//save the default hyd event
	updateURIItem('!E&'+ls.getItem('#currentEventNumber'), 'EVENT', $('#dEvent').val());

	setEventAsCurrentInLS(ls.getItem('#currentEventNumber'));
	alert("Event information has been saved.");
	viewModifyEventPageLayout();

}


function getNextEventNumber() { //todo: this still relies on the global variable
	return eventCounter; //tODO: globals
}

function linkToContainersFunction() { //todo: rename
	console.log('linkToContainersFunction');
	if ($('#setAtributesForm').valid() && $('#analysesForm').valid()) {
		// if everything is valid... various values from the setProperties form to local storage...
		save_data('setType',$('#setType').val());
		save_data('containersQuantity',$('#containersQuantity').val());
		save_data('analyzeIndSamples',$('#analyzeIndSamples').val());
		save_data('analysis', getGroupCheckboxValues('analysis', false, 0));
		save_data('SetFieldComments',$('#SetFieldComments').val());


		var data = '';
		var setStr = ls.getItem('#set');
		//console.log("^^^ #set "+setStr+"   #singleMulti "+ls.getItem('#singleOrMulti'));
		//console.log("^^^2  #containersQuantity: "+parseInt(ls.getItem('#containersQuantity')));
		if (ls.getItem('#singleOrMulti') == "single") {
			data = $('#setAtributesForm').not('#setType').serialize() + '&' + getGroupCheckboxValues('analysis', true, 0);
			data += "&SetFieldComments=" + ls.getItem('#SetFieldComments');

			saveToLocalStorage('!S&' + eventCounter + '&' + setStr, data);

			if(ls.getItem("#analyzeIndSamples")=='Y') {
				for (var i = 1; i <= ls.getItem('#setQuantity'); i++) { //create EMPTY CONTNS TAG in LS for this group
					saveToLocalStorage('!C&' + eventCounter + '&' + String.fromCharCode(setLetter) + '&' + i, '');
				}
			} else {
				saveToLocalStorage('!C&' + eventCounter + '&' + String.fromCharCode(setLetter) + '&1', '');
			}
		} else {
			data = $('#setAtributesForm').serialize() + '&' + getGroupCheckboxValues('analysis', true, 0);
			saveToLocalStorage('!S&' + eventCounter + '&' + setStr, data);
			if(ls.getItem("#analyzeIndSamples")=='Y') {
				for (var i = 1; i <= parseInt(ls.getItem('#containersQuantity')); i++) { //create empty containers for this group
					saveToLocalStorage('!C&' + eventCounter + '&' + setStr + '&' + i, '');
				}
			} else {
				saveToLocalStorage('!C&' + eventCounter + '&' + setStr + '&1', '');
			}
		}

		saveToLocalStorage('#currentContainerNumber', '1');

		$.mobile.changePage('#sampleParametersPage');
	}
}



/* Checks if the given event key is in the history list - returns true if it is*/
// note this function takes a eKey or a GUID for backwards compatibilty
function inHistory(eKey_Or_GUID) {
	var curGUID = eKey_Or_GUID;
	if (eKey_Or_GUID.indexOf("!E") == 0) {
		// the function was passed an eventKey
		var eKeyArr = eKey_Or_GUID.split('&');
		var eventID = eKeyArr[1];
		var curGUID = getEventGUIDFromLS(eventID);
	}
	var hl = window.localStorage.getItem("HistoryList");
	if (hl == null) {
		return false;
	}
	if (hl.indexOf(curGUID) == -1) {
		return false;
	}
	return true;
}

// accepts either event number or an entire event key
function getEventGUIDFromLS(eventNumOrKey) {
	if (eventNumOrKey.indexOf('!E&') == 0) {
		// this is a key
		eventNumOrKey = eventNumOrKey.split('!E&')[1];
	}
	return ls.getItem('!G&' + eventNumOrKey);
}

function getEventIDFromLS(eventGUID) {
	for (var key in localStorage) {
		if (ls.getItem(key) == eventGUID) {
			return key.split('&')[1];
		}
	}

}

function eventGUIDExists(eventGUID) {
	for (var key in localStorage) {
		if (key.charAt(1) === 'G') {
			//alert("G found: " + eventGUID);
			if (ls.getItem(key) == eventGUID) {
				return true;
			}
		}
	}
	return false;
}



function getContainerXML(key, isFirst) {
	// given a container key, this will set $content to the appropriate XML value

	console.log("getContainerXML(" + key + ", " + isFirst + ")");

	var xmlc = "";
	var query = ls.getItem(key);
	var data = query.split("&");
	var analyses = [];

	var node = "";

	for (var i = 0; i < data.length; i++) {

		var item = data[i].split("=");

		if (item[1] === '+' || item[1] === '') {

		} else {
			item[1]=replaceAll('&','&amp;',item[1]);
			item[1]=replaceAll('\"','&quot;',item[1]);
			item[1]=replaceAll('\'','&apos;',item[1]);
			item[1]=replaceAll('<','&lt;',item[1]);
			item[1]=replaceAll('>','&gt;',item[1]);


			switch (item[0]) {

				case 'beginDate':
					node = '<Sample>\n        <SampleNumber>' + key.split('&')[3] + '</SampleNumber>\n        <BeginDate>' + decodeURIComponent(item[1]) + '</BeginDate>\n</Sample>';
					addNode("Set", node, "Sample", 0, null, 0);
					break;

				case 'beginTime':
					node = '<BeginTime>' + item[1].replace('%3A', ':') + '</BeginTime>';
					addNode("Sample", node, "BeginTime", 0, null, 0);
					break;
				case 'timeDatum':
					node = '<TimeDatum>' + item[1] + '</TimeDatum>';
					addNode('Sample', node, "TimeDatum", 0, null, 0);
					break;
				case 'addOnAnalysis':
					node = '<AddOnAnalyses>' + item[1] + '</AddOnAnalyses>';
					addNode('Sample', node, "AddOnAnalyses", 0, null, 0);
					break;
				case 'brokenContainer':
					node = '<Broken>' + item[1] + '</Broken>';
					addNode('Sample', node, "Broken", 0, null, 0);
					break;
				case 'collectingAgency':
					node = '<CollecAgency>' + item[1] + '</CollecAgency>';
					addNode('Sample', node, "CollecAgency", 0, null, 0);
					break;
				case 'collectorsInitials':
					node = '<Initials>' + item[1] + '</Initials>';
					addNode('Sample', node, "Initials", 0, null, 0);
					break;
				case 'containerNum':
					node = '<ContainerNumber>' + item[1] + '</ContainerNumber>';
					addNode('Sample', node, "ContainerNumber", 0, null, 0);
					break;
				case 'EVENT':
					node = '<HydEvent>' + item[1] + '</HydEvent>';
					addNode('Sample', node, "HydEvent", 0, null, 0);
					break;
				case 'HSTAT':
					node = ' <Hstat>' + item[1] + '</Hstat>';
					addNode('Sample', node, "Hstat", 0, null, 0);
					break;
				case 'STYPE':
					node = '<Stype>' + item[1] + '</Stype>';
					addNode('Sample', node, "Stype", 0, null, 0);
					break;
				case 'ASTAT':
					node = '<Astat>' + item[1] + '</Astat>';
					addNode('Sample', node, "Astat", 0, null, 0);
					break;
				case 'P71999':
				case 'P82398':
				case 'P84164':
					node = '<' + item[0] + '>' + item[1] + '</' + item[0] + '>';
					addNode("Sample", node, item[0], 0, null, 0);
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
				case 'P72196':
				case 'P72217':
				case 'P72218':
				case 'P72219':
				case 'P72220':
					node = '<Param><Name>' + item[0] + '</Name><Value>' + item[1] + '</Value></Param>';
					addNode("Sample", node, "Param", 0, null, 0);
					break;
				case 'P82073':
				case 'P82074':
					node = '<Param><Name>' + item[0] + '</Name><Value>' + item[1].replace(':','') + '</Value></Param>';
					addNode("Sample", node, "Param", 0, null, 0);
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
				case 'P72196R':
				case 'P72217R':
				case 'P72218R':
					node = '<Rmrk>' + item[1] + '</Rmrk>';
					addNode("Name", node, "Rmrk", 1, item[0].substring(0, item[0].length - 1), 0);
					break;
				case 'P82073R':
				case 'P82074R':
					node = '<Rmrk>' + item[1].replace(':','') + '</Rmrk>';
					addNode("Name", node, "Rmrk", 1, item[0].substring(0, item[0].length - 1), 0);
					break;
				case 'M2Lab':
					node = '<M2Lab>' + item[1].replace(/\+/g, ' ') + '</M2Lab>';
					addNode("Sample", node, item[0], 0, null, 0);
					break;
				case 'ContainerFieldComments':
					//alert("Here - CFC");
					node = '<ContainerFieldComments>' + item[1].replace(/\+/g, ' ') + '</ContainerFieldComments>';
					addNode("Sample", node, item[0], 0, null, 0);
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
				case 'P72196M':
					node = '<Method>' + item[1] + '</Method>';
					addNode("Name", node, "Method", 1, item[0].substring(0, item[0].length - 1), 0);
					break;
				case 'P00095N':
				case 'P63680N':
				case 'P00010N':
				case 'P65225N':
				case 'P00020N':
				case 'P63675N':
				case 'P63676N':
				case 'P72196N':
				case 'P72217N':
				case 'P72218N':
					node = '<NullQlfr>' + item[1] + '</NullQlfr>';
					addNode("Name", node, 'NullQlfr', 1, item[0].substring(0, item[0].length - 1), 0);
					break;
				case 'P04119':
					node = '<Param>\n          <Name>' + item[1] + ' s</Name>\n        </Param>';
					addNode("Sample", node, "Param", 0, null, 0);
					break;
			}

		}

	}
	console.log("Leaving getContainerXML");
}

function ClearLS() {
	// completely clears local storage and logs you out
	window.localStorage.clear();
	var url = "index.html";
	setTimeout(function(){window.location.href = url;}, 500); //todo animation

}

function clearFormVariablesFromLS() {
	var ii = 0;
	for (var key in localStorage) {
		// console.log(':: '+ii+" "+key);
		if (key.charAt(0) === '#') {
			ls.removeItem(key);
			//console.log('::removed '+key);
		}
		ii++;
	}
}

//Loads localStorage to set defaults
//TODO: Remove this function?  March 6, 2015 JWF
/* function resetForm($form) {
 //console.log("resetting form");
 $form.find('input:text, input:password, input:file, select, textarea').val('');
 $form.find('input:radio, input:checkbox')
 .removeAttr('checked').removeAttr('selected');
 }*/

function deleteSet(setKey) {

	alert("Going to delete " + setKey);
}

//increment event counter, when needed. If no data has been entered at all, do not increment	
function setEventCounter() {

	var keyStr = '!E&' + eventCounter; //evaluating current event
	console.log("evaluating " + keyStr);
	clearFormVariablesFromLS();

	$('#sampleProperties')[0].reset();
	$('#analysesForm')[0].reset();
	$('#sampleParameters')[0].reset();
	$('#sampleParameters2')[0].reset();
	$('#setAtributesForm')[0].reset();
	if ($('#editAnalysisForm').length) {
		//console.log("AnalysisForm exists - reset");
		$('#editAnalysisForm')[0].reset();
	} else {
		//console.log("AnalysisForm does not exist");
	}

	//$('#evtDate').val('');
	if (keyStr in ls) { //if event exists in local storage
		if (ls.getItem(keyStr) === '') {//if event with nodata, keep same EC
			//console.log("Esta vacio");

		}
		else { //if event has data, create new event counter
			//console.log("hay data");
			eventCounter++;
			saveToLocalStorage("!EC", eventCounter);

		}
	} else { //if event does not exist, save it
		saveToLocalStorage("!EC", eventCounter);
	}
	//console.log("Current event key is: !E&"+eventCounter);
	addOrEdit = 0;

	console.log("Leaving set event Counter");

}


/* ingestXMLContentIntoLocalStorage takes an xml string and ingests it into the local storage
 *
 * @inputXML format of the input XML should be the same as what is stored in the database event_xml field with a few additions (status, submitted time, guid)
 */
function ingestXMLContentIntoLocalStorage(inputXML, callbackFunc) {
	//$('#testingOutput').empty();

	console.log('ingestXMLContentIntoLocalStorage');
//	console.log('inputXML:');
//	console.log(inputXML);

	setEventCounter();  ///TODO??? remove?  What is this doing? Why aren't we just using the event number from the DB?  Why do we even care about the event number?

//	var eventC = parseInt(ls.getItem("!EC"));

	xmlDoc = $.parseXML(inputXML), $xml = $(xmlDoc), $evento = $xml.find("Event");

	$xmlDocObjChildren = $(xmlDoc).children();

	$xmlDocObjChildren.each(function (index, Element) {

		// this parses through each 'SedWE_data' (of which there should only be one based on the return values from getAllXMLEventsForUser.php)
		$(this).find("Event").each(function (index, element) {
			// this parses through each 'Event' in the xmlDoc
			var eventString;
			var eventID = $(this).find("EventNumber").text();
			var eventC = eventID;
			var eventGUID = $(this).find("EventGUID").text();
			if (eventGUIDExists(eventGUID)) {
				console.log("Event " + eventGUID + " already exists in LS, skipping import");
				return;
			}
			var submittedDate = $(this).find("SubmittedDate").text();
			var eventStatus = $(this).find("EventStatus").text();
			var siteID = $(this).find("SiteId").text();
			console.log("Processing XML data for " + siteID + " station (EventID:" + eventID + ")");
			var agencyCd = $(this).find("AgencyCd").text();
			var siteNm = $(this).find("SiteNm").text();
			var sedT = $(this).find("SedTranspMode").text(); //sampleType
			var SampleM = $(this).find("SmplMediumCode").text(); //sampleMedium
			var Ave = $(this).find("AvgRepMeasures").text();
			var singleOrMulti = '';  //TODO ???
			var EVENT = ''; // TODO ???
			var userType = ls.getItem('userType');
			var collectedVia = $(this).find("CollectedVia").text();


			eventString = "userType=" + userType + "&station=" + siteID + "&sampleType=" + sedT + "&sampleMedium=" + SampleM + "&averageRep=" + Ave + "&agencyCd=" + agencyCd + "&stationNm=" + siteNm + "&CollectedVia=" + collectedVia;
			var eventFieldComments = $(this).find("EventFieldComments").text();
			if (eventFieldComments.length!=0) {
				eventString += "&EventFieldComments="+eventFieldComments;
			}

			// console.log("E!: "+eventID);  //

			$(this).find("Set").each(function (indexS, element) {
				// console.log("En SET: index="+indexS);
				var setString = "";
				var setName = $(this).children("Name").text();

				var numSamples = $(this).children("NumberOfSamples").text(); //containersQuantity
				// console.log("Found Set " + setName + " with " + numSamples + " of samples");
				var setFieldComments = $(this).children("SetFieldComments").text(); //SetFieldComments
				var aSamples = $(this).children("AnalyzeIndSamples").text(); //compositeOrIndividual

				var analiz = $(this).children("Analyses").text();			 //analysis
				var setType = $(this).children("SetType").text();			 //????
				//var method = $(this).children("Method").text();				 //method
				if (setType != "") setType = setType;
				var singleOrMulti = '';

				setString = "containersQuantity=" + numSamples + "&analyzeIndSamples=" + aSamples + "&analysis=" + analiz;
				if (setFieldComments.length!=0) {
					setString += "&SetFieldComments" + setFieldComments;
				}

				if (setType != '') {
					setString = setString + "&setType=" + setType;
				}
				if (setName == 'Sngl') {        /////VERIFY (USE Sngl)
					singleOrMulti = 'single';
					setName = 'A';
				} else {
					singleOrMulti = 'multi';
				}
				if (indexS == 0) {
					eventString = eventString + "&singleOrMulti=" + singleOrMulti;
					//console.log("saveToLocalStorage: EVENT " + eventC);
					saveToLocalStorage('!E&' + eventC, eventString);
					saveToLocalStorage('!G&' + eventC, eventGUID);
				}
				//console.log("S!: "+setString);
				//			console.log("saveToLocalStorage: SET!");
				saveToLocalStorage('!S&' + eventC + '&' + setName, setString);


				$(this).find("Sample").each(function (index, element) {
					var sampleString = "";
					var sNum = $(this).find("SampleNumber").text();//containerNum
					var containerFieldComments = $(this).find("ContainerFieldComments").text();//containerFieldComments
					var bDate = $(this).find("BeginDate").text(); //beginDate

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

					if (indexS == 0 && index == 0) {
						eventString = eventString + "&evtDate=" + bDate + "&EVENT=" + v7;
						//console.log("saveToLocalStorage: EVENT!");
						saveToLocalStorage('!E&' + eventC, eventString);
					}

					sampleString = "beginDate=" + bDate + "&beginTime=" + bTime;
					if (eDate != "") sampleString = sampleString + "&endDate=" + eDate;
					if (eTime != "") sampleString = sampleString + "&endTime=" + eTime;
					sampleString = sampleString + "&timeDatum=" + v1;
					if (v3 != "") sampleString = sampleString + "&brokenContainer=" + v3;
					sampleString = sampleString + "&collectingAgency=" + v4;
					if (v5 != "") sampleString = sampleString + "&collectorInitials=" + v5;
					sampleString = sampleString + "&HSTAT=" + v6 + "&EVENT=" + v7 + "&STYPE=" + v8 + "&ASTAT=" + v9;

					if (v10 != "") sampleString = sampleString + "&P71999=" + v10;
					sampleString = sampleString + "&P82398=" + v11 + "&P84164=" + v12;

					if (v13 != "") sampleString = sampleString + "&M2Lab=" + v13;
					if (v14 != "") sampleString = sampleString + "&containerNum=" + v14;

					//console.log("C!: "+sampleString);
					$(this).find("Param").each(function (index, element) {
						var paramString = "";
						var p1 = $(this).find("Name").text();
						var p2 = $(this).find("Value").text();
						var p3 = $(this).find("Rmrk").text();
						var p4 = $(this).find("NullQlfr").text();
						var p5 = $(this).find("Method").text();
						paramString = p1 + "=" + p2;
						if (p3 != "") paramString = paramString + "&" + p1 + "R=" + p3;
						if (p4 != "") paramString = paramString + "&" + p1 + "N=" + p4;
						if (p5 != "") paramString = paramString + "&" + p1 + "M=" + p5;
						//console.log("Param: "+paramString);
						sampleString = sampleString + "&" + paramString;
					});
					if(containerFieldComments.length!=0) {
						sampleString += "&ContainerFieldComments" + containerFieldComments;
					}
					saveToLocalStorage('!C&' + eventC + '&' + setName + '&' + sNum , sampleString);
				});
				//console.log("end set");
			});// console.log("end set");

			if (eventStatus == 1) {
				markAsHistory(eventGUID, submittedDate); //TODO grab actual datetime of submission from DB (which will  involved retrieving it from the DB via the XML like we do the guid)
			} //TODO is this the right format date?
		}); //console.log("end event");
	});

	callbackFunc();


}


function initializeFileReader() {

	//Check File API support
	if (window.File && window.FileList && window.FileReader) {
		var filesInput = document.getElementById("fileInput");

		filesInput.addEventListener("change", function (event) {

			var files = event.target.files; //FileList object
			var output = document.getElementById("result");

			for (var i = 0; i < files.length; i++) {
				var file = files[i];

				//Only plain text
				if (!file.type.match('plain')) continue;

				var picReader = new FileReader();

				picReader.addEventListener("load", function (event) {

					var textFile = event.target;

					//var div = document.createElement("div");
					alert("The file: " + textFile.result);
					//div.innerText = textFile.result;

					//output.insertBefore(div, null);

				});

				//Read the text file
				picReader.readAsText(file);

			}

		});
	}
	else {
		alert("Your browser does not support File API");
	}

}
