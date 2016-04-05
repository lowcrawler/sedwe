// this file is only for functions that call php files via ajax calls.  They are not to interact directly with local storage or do any displaying of any kind.


function sendEmailContent(fileContent, siteid, emailFrom, emailList, eDate, eventGUID) {
	//alert('eventID: ' + eventID);
	if (window.navigator.onLine) {
		return $.ajax({
			type: "POST",
			url: "assets/php/emailXML.php", // note this php file removes duplicates from the email list
			async: false,
			data: {
				to: emailList,
				from: encodeURI(emailFrom),
				evtDate: eDate,
				fileContent: fileContent,
				siteid: encodeURI(siteid),
				evtGUID: eventGUID
			},
			success: function (data) {
				console.log("return from sendEmailContent" + data);
				return true; // actually get something back from this and check if it really worked
			}
		}).responseText;

	} else { //if connection
		return false;
	}
}

function saveEventToDB(xmlString, siteid, userEmail, evtDate, status, guid, overwrite, successFunction, failureFunction) {

	if (window.navigator.onLine) {
		return $.ajax({
			type: "POST",
			url: "assets/php/saveEventToDB.php",
			async: true,
			data: {
				from: encodeURI(userEmail),
				evtDate: evtDate,
				eventXML: xmlString,
				siteid: encodeURI(siteid),
				status: status,
				overwrite: overwrite,
				guid: guid
			},
			success: function (data) {
				console.log("Return from saveEventToDB: " + data);
				if (data=='success') {
					successFunction(guid);
				}  else {
					failureFunction(guid);
				}
			}
		}).responseText;

	} else { //if connection
		return false;
	}
}

function saveSubmitDateTimeToDB(guid,submittedDateTime) {  // this is split out so we can save to the DB without setting the submit time
	if (window.navigator.onLine) {
		return $.ajax({
			type: "POST",
			url: "assets/php/saveSubmitDateTimeToDB.php",
			async: true,
			data: {
				submittedDateTime: submittedDateTime,
				guid: guid
			},
			success: function (data) {
				console.log("Return from saveSubmitDateTimeToDB: " + data);
				return true;
			}
		}).responseText;

	} else { //if connection
		return false;
	}
}

function markEventDeletedInDB(guid, callback) {
	console.log('markEventDeletedInDB: ' + guid);
	if (window.navigator.onLine) {
		return $.ajax({
			type: "POST",
			url: "assets/php/markEventForDeletionInDB.php",
			async: true,
			data: {
				guid: guid
			},
			success: function (data) {
				console.log("Return from markEventDeletedInDB: " + data);
				callback(data);
			},
			error:function(jqXHR, textStatus, errorThrown){
				$('#ajax-loading').empty();
				// failed request; give feedback to user
				//$('#ajax-panel').html('<p class="error"><strong>Oops!</strong> Try that again in a few moments.</p>');
				console.log("ERROR FUNCTION: " + jqXHR.toString());
				console.log("ERROR FUNCTION: " + textStatus);
				console.log("ERROR FUNCTION: " + errorThrown);
			}

		}).responseText;

	} else { //if no connection
		return false;
	}
}


function validateEmail() {  //Todo: rename to validateLogin or other less ambiguous name?
	//todo: split apart into a few different functions - verify in DB, set login_username, set user type, etc)
	console.log("validateEmail");

	if (! $('#loginF').valid()) {
		console.log("Email invalid");
		$('#loginError').removeClass('hidden');
	} else {
		console.log("Email passes 'valid()' check");
		saveToLocalStorage('login_username', $('#login_username').val());
		console.log("Saved " + $('#login_username').val() + "to local storage");
		if (window.navigator.onLine) {
			console.log("We are online");
			var tempUserType = $.trim(getUserType($('#login_username').val())); //userType comes with an space at the end, verify, and then, eliminate trim
			console.log("tempUserType: " + tempUserType);
			if (tempUserType != "no_user") { // this means: if the user has not logged onto this system before. Thus we'll go get the info from the DB
				saveToLocalStorage('userType', tempUserType); //todo: why?

				$.ajax({
					type: "GET",
					url: "includes/functions2.php",  //TODO: Rename php file?  // does this mean this can't run offline??
					data: {email: $('#login_username').val()},
					success: function (data) {
						//$('#station').empty();
						console.log('functions2.php - success function');
						console.log("Data: " + data);
						saveToLocalStorage("StationOptions",data);

						// todo: this defining station stuff gets run again, but needs to here because somewhere else looks at the field for logging in... and it's dumb and we all know it.
						$('#station').empty();
						$('#station').append(data).enhanceWithin();
						$('#station').change();

						var values = $.map($('#station option'), function (e) {
							return e.value;
						});
						if (values.length > 0) {
							//console.log("...values length > 0: "+values.join(','));
							if (values[0] == "") {
								//console.log("empty values ");
								login(1);
								$('#loginDialog').enhanceWithin();
							} else {

								setHeaderText('#MainMenuHeader', tempUserType);
								if (tempUserType == 'Observer') {
									$('.hideFromObserver,.div div select ui-block-c,.ui-block-d').hide(); // hides every div containing hideFromObserver, .div div select ui-block-c and .ui-block-d class
									$('#M2Lab').attr('placeholder', 'Remarks');//Sets the placeholder of the messageToLab text area

								} else {
									$(' .hideFromObserver,.div div select ui-block-c,.ui-block-d').show();// In case of user type change it makes sure the elemnts hidden s up again
									$('#M2Lab').attr('placeholder', 'Message to lab');//Sets the placeholder of the messageToLab text area
								}

								var texts = $.map($('#station option'), function (e) {
									return e.text;
								});
								//console.log("values: "+texts.join('!'));
								saveToLocalStorage('email&' + $('#login_username').val(), tempUserType + "&" + texts.join('!'));
								$(':mobile-pagecontainer').pagecontainer('change', '#MainMenu', {
									transition: 'fade',
									reload: false
								});
							}
						} else {
							//console.log("...values length = 0");
						}
					}, // end success function
					error: function(XMLHttpRequest, textStatus, errorThrown) {
						alert("Status: " + textStatus); alert("Error: " + errorThrown);
					}
				}); // end ajax
			} // end if not no_user
			else { // tempUserType was 'no_user'
				$('#loginError').removeClass('hidden');
			}
		} // end if online
		else { // not online
			var stationOps = '';
			var key = 'email&' + $('#login_username').val();
			if (key in ls) {
				var query = ls.getItem(key);
				saveToLocalStorage('userType', query.split("&")[0]);

				//var stns = query.split("$")[1].split("!");
				var stns = query.split("&")[1].split("!");
				for (var i = 0; i < stns.length; i++) {
					var pair = stns[i].split(" ");
					if (i == 0) {
						stationOps = '<option value="' + pair[1] + '" selected >' + stns[i] + '</option>';
					} else {
						stationOps = stationOps + '<option value="' + pair[1] + '">' + stns[i] + '</option>';
					}
				}
				$('#station').empty();
				$('#station').append(stationOps).enhanceWithin();
				$('#station').change();
				$(':mobile-pagecontainer').pagecontainer('change', '#MainMenu', {transition: 'fade', reload: false});
			}
		}

	} // end if loginF valid
}

function getCurrentVersionNumber(callback) {

	$.ajax({
		type: 'POST',
		url: 'assets/php/currentVersionNumber.php',
		async: true,
		success:function(data){

			callback(data);
		},
		error:function(jqXHR, textStatus, errorThrown){
			$('#ajax-loading').empty();
			console.log("ERROR FUNCTION: " + jqXHR.toString());
			console.log("ERROR FUNCTION: " + textStatus);
			console.log("ERROR FUNCTION: " + errorThrown);
		}
	});

}

function getAllEventsFromDB(callback) {

	console.log("getAllEventsFromDB - Getting all events from the database");


	if (!window.navigator.onLine) {
		return 'NOT CONNECTED TO INTERNET';
	}

	$.ajax({
		callback: callback,
		type: 'POST',
		url: 'assets/php/getAllXMLEventsForUser.php',
		data: { username: ls.getItem('login_username') },
		async: true,
		beforeSend:function(){
			//todo The before function works, but this doesn't show status for some reason
			$('#syncingArea').html('Syncing from DB...');
			//console.log("BEFORE FUNCTION");
		},
		success:function(data){
			$('#ajax-loading').empty();
			console.log("getAllEVentsFromDB returned successfully. Data length: " + data.length);
			if(data.length!=0) {
				ingestXMLContentIntoLocalStorage(data, this.callback);
			} else {
				console.log("No events for " + ls.getItem('login_username') + " were found in the database.");
			}
		},
		error:function(jqXHR, textStatus, errorThrown){
			$('#ajax-loading').empty();
			// failed request; give feedback to user //todo
			//$('#ajax-panel').html('<p class="error"><strong>Oops!</strong> Try that again in a few moments.</p>');
			console.log("ERROR FUNCTION: " + jqXHR.toString());
			console.log("ERROR FUNCTION: " + textStatus);
			console.log("ERROR FUNCTION: " + errorThrown);
		}
	});
}


function authenticate(onSuccess,onFail) {
	var debug = true;
	console.log('authenticate(success,fail)');

//TODO: "working" animation

	// Glean Data from form
	var username = $("#usernameInput").val();
	var password = $("#passwordInput").val();
	if (debug)    console.log("Username: " + username);
	// the following line replaces special characters with PHP-appropriate replacements
	//password = encodeURIComponent(password);
	//password = encodeURIComponent(password);
	if (debug) console.log('URI Encoded Password: ' + password);

	if (password == "") {  //TODO better validation
		alert("Password field may not be left blank. Please Try Again.");
		return;
	}

	if (!isNaN(password) &&  parseInt(password)>999 && parseInt(password)<9999) {

		if (username.toLowerCase().indexOf('@usgs.gov') != -1) { // if this is a USGS email
			onFail("USGS employees must use their Active Directory password.\nPlease try again.");
			return;
		} else {
			$.ajax({
				type: 'POST',
				url: 'assets/php/clientAuthenticateDB.php',
				data: {username: username, code: password},
				beforeSend: function () {
					if (debug) console.log("Authenticate->BeforeFunction");
					// this is where we append a loading image
					//$('#ajax-loading').html('<div class="loading"><img src="assets/images/loading.gif" alt="Loading..." /></div>'); //tODO: loading doesn't show -- likely doesn't exist?

				},
				success: function (data) {
					//$('#ajax-loading').empty();
					if (debug) console.log("Authenticate-> success function return: " + data);
					if (data === 'true') {
						if (debug) console.log('User has authenticated against SEDWE...');
						onSuccess();
					} else {
						if (debug) console.log('User FAILED to authenticate against SEDWE...');
						//return "User failed to log into the system.\nEmail request ignored.\n\nError message: \n" + data;
						onFail("User failed to log into the system.\nEmail request ignored.\n\nError message: \n" + data);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					$('#ajax-loading').empty();

					console.log("attemptAuthenticateForEmail ERROR FUNCTION: " + jqXHR.toString());
					console.log("attemptAuthenticateForEmail ERROR FUNCTION: " + textStatus);
					console.log("attemptAuthenticateForEmail ERROR FUNCTION: " + errorThrown);
					//return "User failed to log into the system. Potential problem with server or connection.\nEmail request ignored.\n\nError message: \n" + textStatus;
					onFail("User failed to log into the system. Potential problem with server or connection.\nEmail request ignored.\n\nError message: \n" + textStatus);
				}
			});
		}
	} else { // this person is using a real password and will need to authenticate against AD, they must be a USGS employee

		if(username.toLowerCase().indexOf('@usgs.gov') == -1) { // if they don't have a USGS.gov email...
			onFail("You don't appear to be a USGS employee and don't appear to have entered a valid code.  Please check and try again.");
			return;
		} else {
			$.ajax({  //TODO: Securely send this (ssl?)
				type: 'POST',
				url: 'assets/php/clientAuthenticateAD.php',
				data: {username: username, password: password},
				beforeSend: function () {
					// this is where we append a loading image
					$('#ajax-loading').html('<div class="loading"><img src="assets/images/loading.gif" alt="Loading..." /></div>'); //tODO: loading doesn't show -- likely doesn't exist?
					if (debug) console.log("BEFORE FUNCTION");
				},
				success: function (data) {
					$('#ajax-loading').empty();
					if (debug) console.log("attemptAuthenticateForEmail success function return: " + data);
					if (data === 'true') {
						if (debug) console.log('User has authenticated against AD and exists in SEDWE...');
						onSuccess();
					} else {
						if (debug) console.log('User FAILED to authenticated against AD and/or does not exist in SEDWE...');
						//return "User failed to log into the system.\nEmail request ignored.\n\nError message: \n" + data;
						onFail("User failed to log into the system.\nEmail request ignored.\n\nError message: \n" + data);
					}
				},
				error: function (jqXHR, textStatus, errorThrown) {
					$('#ajax-loading').empty();

					console.log("attemptAuthenticateForEmail ERROR FUNCTION: " + jqXHR.toString());
					console.log("attemptAuthenticateForEmail ERROR FUNCTION: " + textStatus);
					console.log("attemptAuthenticateForEmail ERROR FUNCTION: " + errorThrown);
					//return "User failed to log into the system. Potential problem with server or connection.\nEmail request ignored.\n\nError message: \n" + textStatus;
					onFail("User failed to log into the system. Potential problem with server or connection.\nEmail request ignored.\n\nError message: \n" + textStatus);
				}
			});
		}
	}
}



function getUserType(em) {

	if (!window.navigator.onLine) { //if connection
		alert("No connection");
		return;
	}

	return $.ajax({
		type: "GET",
		url: "includes/validateUser.php",  //TODO: Rename?
		async: false,
		data: {email: $('#login_username').val()},
		success: function (data) {
			//$('#station').empty();
			//console.log('-'+data);
			return data;

			if (data.length > 0) {
				//console.log("...data length > 0: ");
				if (data == "") {
					//console.log("empty user TYpe ");

				} else {
					//saveToLocalStorage('email&'+$('#login_username').val(),texts);
				}

			} else {
				//console.log("...data length = 0");
			}
		}
	}).responseText;

}

function getStationsEmailRecipientsFnc(station) {   //todo: this relies on globals rather than passed variables... fix that.

	if (! window.navigator.onLine) { //if connection
		alert("There is no Internet connection");
		return;
	}

	return $.ajax({
		type: "GET",
		url: "assets/php/getStationsEmailRecipients.php",
		async: false,
		data: {station_no: station},
		success: function (data) {
			return data;
		}
	}).responseText;


}




