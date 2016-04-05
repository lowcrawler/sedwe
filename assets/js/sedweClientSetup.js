/**
 * Created by jfederer on 3/6/2015.
 */




$(document).ready(function (e) {

	checkVersion();
	checkBrowser();


	if (checkCache() === 'UPDATEREADY') {   //todo: not sure what this is doing
		window.applicationCache.update();
	}
	initialize();
	$('.setLabel').hide();

	var param = document.URL.split('#')[1];

	if (param == null) {


	} else {
		switch (param) {

			case 'MainMenu':
			case 'newEvent':
			case 'page2':
				break;
			case 'MainMenu': //alert("#MainMenu");
				break;
			case 'openXMLPage':


				break;
			case 'sampleProperties': //alert("sampleProperties");
				break;

		}
		//fillSelect(ls.getItem('sampleType'));
		//setCorrespondingOptions('sampleType');
		//$('#multiAtributes').hide();
		//load event, page refreshed
	}


	var usrnm = '';
	if (ls.getItem('login_username') !== null) {
		usrnm = ls.getItem('login_username');
	}
	$("#login_username").attr("value",usrnm);

	$("#loginF").on('submit', function (e) {
		//ajax call here
		mainlogin();
		//stop form submission
		e.preventDefault();
	});

});

$(function () {
	$(window).bind("resize", function () {
		//  console.log($(this).width())
		if ($(this).width() < 600) {
			$('.xxx').addClass('ui-btn-icon-notext')

		}
		else {
			$('.xxx').removeClass('ui-btn-icon-notext')
		}
	})
})

$(window).on('beforeunload', function () {

	//console.log('user is leaving...');

});

$(window).on('load', function () {
// console.log("windows onload function");

	//Check File API support
	if (window.File && window.FileList && window.FileReader) {
		var filesInput = document.getElementById("fileXML");

		filesInput.addEventListener("change", function (e) {
			var fileExtension = /xml.*/;
			var fileToBeRead = filesInput.files[0];
			if (fileToBeRead.type.match(fileExtension)) {
				var fileReader = new FileReader();
				fileReader.onload = function (e) {
//				alert(fileReader.result);
					inputXMLContent(fileReader.result);
				}
				fileReader.readAsText(fileToBeRead);
			} else {
				alert("Please, select an XML file");
			}

		}, false);

	}
	else {
		alert("Your browser does not support File API");
	}
});


//DATA OF THE FORMS START WITH #, EXCEPT USERTYPE
//DATA TAGS FOR THE EVENTS (EVENT, SETS, CONTAINERS START WITH '!'
//var appCache = window.applicationCache;

// TODO: divorce initlaize from ls
// TODO: give this function a true name and purpose
function initialize() {


	$(document).on("pagecontainershow", function () {  //this runs with every single page update throughtout the client.  TODO: I suggest a lot of functionality could be added here.

		pageId = $('body').pagecontainer('getActivePage').prop("id");
		console.log("---PAGE ID: " + pageId + "---");

		if (pageId === 'sampleParametersPage') {
			if (ls.getItem('#sampleType') !== null) {
				if (ls.getItem('#sampleType') == 'SuspSed' && ls.getItem('userType') != 'Observer') {
					$('#bagSamplersDiv').show();
				} else {
					$('#bagSamplersDiv').hide();
				}
			} else {
				alert("You have reached this page without setting the sample type. \n \n This could be due to refreshing the page.  If it's not, please note what you did and report the error to the SedWE team.");
			}
			sampleParametersPageLayout();

		}
		if (pageId === 'setProperties') {
			setCorrespondingOptions('sampleType');
			setPropertiesLayout();
		}
		if (pageId === 'page2') {
			updateHeaderText(pageId);
			setCorrespondingOptions('sampleType');
			page2Layout();
		}
		if (pageId === 'MainMenu') {
			checkVersion();
			clearFormVariablesFromLS();
			updateHeaderText(pageId);

		}
		if (pageId === 'multiSet') {
			multiSetLayout();
		}
		if (pageId == 'historyPage') {
			saveToLocalStorage('currentOrHistory', 'history');
			historyLayout();
		}
		if (pageId == 'currentShipmentPage') {
			saveToLocalStorage('currentOrHistory', 'current');
			currentShipmentLayout();
		}
		if (pageId == 'newEvent') {
			saveToLocalStorage('createOrEdit', 'create');
		}
		if (pageId == 'viewModifyEventPage') {
			viewModifyEventPageLayout();
		}
		if (pageId == 'viewSamplePage') {
			viewSamplePageLayout();
		}

		var publicFooter =
			'<div data-role="footer" data-position="fixed" data-tap-toggle="false">' +
			'<a href="#userPage" data-icon="arrow-l" class="ui-btn-lef ui-btn-inline" data-role="button">Back to Login</a>' +
			'</div>';
		var privateFooter = '<div data-role="footer" data-position="fixed" data-tap-toggle="false">' +
			'<a href="#MainMenu" data-icon="arrow-l" class="ui-btn-lef ui-btn-inline" data-role="button">Back to Main Menu</a>' +
			'</div>';

		if (pageId == 'about') {
			if(ls.getItem('userType')==null) {
				$('#about_footer').append(publicFooter).enhanceWithin();
			} else {
				$('#about_footer').append(privateFooter).enhanceWithin();
			}
		}

		if (pageId == 'help_manual') {
			if(ls.getItem('userType')==null) {
				$('#manual_footer').append(publicFooter).enhanceWithin();
			} else {
				$('#manual_footer').append(privateFooter).enhanceWithin();
			}
		}

		if (pageId == 'help_release') {
			if(ls.getItem('userType')==null) {
				$('#release_footer').append(publicFooter).enhanceWithin();
			} else {
				$('#release_footer').append(privateFooter).enhanceWithin();
			}
		}
	});


	var availLS = true;
	//Check if browser supports localStorage
	var mod = 'modernizr';
	try {
		ls.setItem(mod, mod);
		ls.removeItem(mod);
	} catch (e) {
		availLS = false;
	}
	if (!Modernizr.localstorage) {
		alert("This application will not work on your device, please change or update your current browser");
		availLS = false;
		return false;
	} else {
		// alert("Data and resources of this app can be stored in local device.");
	}
	//the following is the event counter that identifies unique events
	if (availLS == true) {
		//alert("AvailLS = true");
		if (ls.getItem("!EC") === null) {
			saveToLocalStorage("!EC", eventCounter);
		} else {
			eventCounter = ls.getItem("!EC");
		}
		//clearFormVariablesFromLS();
	}

	//Add custom rules for validation
	$.validator.addMethod("custom_number", function (value, element) {
		return value.match(/^([0-9,\+-]+|)$/);//Accepts only numbers or blank space
	}, "Please enter a valid custom number");
	$.validator.addMethod("custom_float", function (value, element) {
		return value.match(/^([+-]?(?=\.\d|\d)(?:\d+)?(?:\.?\d*)|)$/);//Accepts only floats or blank space
	}, "Please enter a valid float number");
	$.validator.addMethod("positive", function (value, element) {
		if (value == null || value.trim() == "") {
			return true;
		} else
			return (value > 0);
	}, "Please enter a value greater than or equal to zero");
	$.validator.addMethod("time24", function(value, element) {
		if (!/^\d{2}:\d{2}:\d{2}$/.test(value)) return false;
		var parts = value.split(':');
		if (parts[0] > 23 || parts[1] > 59 || parts[2] > 59) return false;
		return true;
	}, "Invalid time format.");


	$('#userPage').on('pagecreate', function () {
		console.log("userpage before email validation"); //TODO: This happens after logging in, then refreshing the main page, and going to the login page again.
		$("#loginF").validate({
			rules: {
				login_username: {
					required: true,
					email: true
				}
			},
			messages: {
				login_username: {
					required: "Need your email address to retrieve your list of stations",
					login_username: "Your email address must be in the format of name@domain"
				}
			},
			submitHandler: function (form) {
				$(':mobile-pagecontainer').pagecontainer('change', '#MainMenu', {transition: 'fade', reload: true});
			},
			onfocusout: false,
			invalidHandler: function (form, validator) {
				var errors = validator.numberOfInvalids();
				alert("invalid email: " + errors);
				if (errors) {
					validator.errorList[0].element.focus();
				}
			}
			//}
		});
	});

	//...........................................................................
	//PAGE2 on pagecreate - triggered after page initialization occurs
//	$('#page2').on('pagecreate', function () {  JWF
	setTimeout(function () { //DIANNE - created to allow focus in IE9. Needed to save data to localStorage when onBlur is fired.
		$('#station').focus();
	}, 500);


	$('#sampleProperties').validate({ //form validation  //todo: move this to the other validation functions area
		rules: {
			station: 'required',
			evtDate: 'required',
			singleOrMulti: 'required',
			setQuantity: {
				required: 'true',
				custom_number: true, //for strings
				range: [1, 40],
				digits: true
			}
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


	$('#openXMLPage').on("pageshow", function () {
		//console.log("windows... "+window.location.href);
		var urlResult = window.location.href.split("?");

		var eventIDVar = false;
		var eventIDStr = '';
		var emailVar = false;
		var emailStr = '';

		if (urlResult.length > 1) {
			var searchData = urlResult[1].split('&');

			for (var i = 0; i < searchData.length; i++) {
				var pair = searchData[i].split("=");
				if (pair[0] == 'eventID') {
					eventIDVar = true;
					eventIDStr = pair[1];
				}
				if (pair[0] == 'email') {
					emailVar = true;
					emailStr = pair[1];
				}
			}
			if (emailVar && eventIDVar) {
				//alert("Estan ambos parametros");
				//saveToLocalStorage('login_username', pair[1]);
				$('#login_username').val(emailStr);
				validateEmail();

				inputXMLContent($.ajax({
					type: "GET",
					url: "includes/getEventXML.php",
					async: false,
					data: {eventID: eventIDStr, email: encodeURI(emailStr)},
					success: function (data) {
						//$('#station').empty();
						//console.log('-'+data);
						return data;

					}
				}).responseText);

			}

		}

		//console.log("...en openXMLPage: ");
	});

	$('#priorSampleButton').click(function () {    //todo:  surely this can be done better
		console.log("priorSampleButtonClickFunction");
		if ($('#sampleParameters').valid()) {
			if ($('#sampleParameters2').valid()) {
				var dataLoaded = goToPriorContainer();
				$('#addOnAnalysisZ').checkboxradio("refresh"); //needed to refresh the addOnAnalysis checkboxes
				$('#addOnAnalysisSA').checkboxradio("refresh");
				$('#addOnAnalysisSF').checkboxradio("refresh");
				$('#addOnAnalysisLOI').checkboxradio("refresh");
				sampleParametersPageLayout();
				$("html, body").animate({
					scrollTop: 0
				}, "slow");
			}
		}
	});

	$('#nextSampleButton').click(function () {    //todo: surely this can be done better.    Perhaps split off and name these functions and just use the onclick in the index.html
		console.log("nextSampleButtonClickFunction");
		if ($('#sampleParameters').valid()) {
			if ($('#sampleParameters2').valid()) {

				var dataLoaded = goToNextContainer();
				console.log("dataLoaded: " + dataLoaded);
				if (dataLoaded == false) {
					console.log("DataLoaded=false");
				} else {
					console.log("DataLoaded=true");
					$('#addOnAnalysisZ').checkboxradio("refresh");
					$('#addOnAnalysisSA').checkboxradio("refresh");
					$('#addOnAnalysisSF').checkboxradio("refresh");
					$('#addOnAnalysisLOI').checkboxradio("refresh");

				}
				sampleParametersPageLayout();
				$("html, body").animate({
					scrollTop: 0
				}, "slow");

			}
		}
	});

	$('#saveModifySampleButton').click(function () {    //todo: surely this can be done better.     Perhaps split off and name these functions and just use the onclick in the index.html
		console.log("saveModifySampleButtonClickFunction");
		var valid = false;
		if ($('#sampleParameters').valid()) {
			if ($('#sampleParameters2').valid()) {
				valid = true;
				saveSampleParametersPageAsContainer();
				$.mobile.changePage('#viewModifyEventPage');

			}
		}
		if (!valid) {
			alert("Data appears to be invalid");
		}
	});


	$('#setProperties').on('pageinit', function () {

		// console.log("SETPROPERTIES - pageinit");

		$('#setAtributesForm').validate({
			rules: {
				setType: 'required',
				containersQuantity: {
					required: 'true',
					custom_number: true, //for strings
					range: [1, 40],
					digits: true
				}
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
		$('#analysesForm').validate({
			rules: {
				analysis: {
					required: true,
					minlength: 1
				}
			},
			messages: {
				analysis: {
					required: 'Please select at least one analysis'
				}
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
	});


}

//Determines User type and style the form depending of the type of user.
function mainlogin(userStatus) {  //TODO: rename to "create Login Fields" or something

	console.log("mainlogin(" + userStatus + ")");
	//saveToLocalStorage('userType', text); //ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b"

	if (userStatus == 1) {
		$('#loginError').removeClass('hidden');
	}

	validateEmail();
}

