var ls = window.localStorage;
var setLetter = 65; //'A'
var containerCounter = 1;
var SAMPLEQTY = 40;
var SETQTY = 90; //equivalent of 'Z'
var eventCounter = 1; //EC in localstorage
var currentSampleType; //help in updating the program options based on the sampleType selected
var eventArray = {}; //stores in an associative array the values that were stores in the eventKey item
var workingWithThisEvCounter = 1;
var addOrEdit = 0; //adding samples = 0, edit currentSamples = 1;
var currentContainerKey = ''; //used when editing containers
//DATA OF THE FORMS START WITH #, EXCEPT USERTYPE
//DATA TAGS FOR THE EVENTS (EVENT, SETS, CONTAINERS START WITH '!'
//var appCache = window.applicationCache;


function initialize() {
	var availLS = true;
   	//Check if browser supports localStorage
	var mod = 'modernizr';
    try {
        ls.setItem(mod, mod);
        ls.removeItem(mod);
    } catch(e) {
		availLS = false;
    }
    if (!Modernizr.localstorage) {
        alert("This application will not work on your device, please change or update your current browser");
		availLS = false;
        return false;
    } else  {
        alert("This application may store data on your device");
    }
	//the following is the event counter that identifies unique events
	if (availLS == true) {
		//alert("AvailLS = true");
		if (ls.getItem("!EC") === null) {
			save_eventTags("!EC",eventCounter);
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


	$('#userPage').on('pagecreate', function () {
	/*	
	    $.ajax({
			type: "POST",
			url: "callajax.php",
			cache: false,
			data: formData,
			success: onSuccess,
			error: onError
		});	
	*/	
		$( "#loginF" ).validate({  
			rules: {    
				login_username: {      
				required: true,      
				email: true    
				},  
            messages: {
                login_username: {
                    required: 'Please select at least one analysis',
					login_username: "Your email address must be in the format of name@domain"
                }
            },
            submitHandler: function (form) {
				console.log("email valido");
				$(':mobile-pagecontainer').pagecontainer('change','#MainMenu',{transition: 'fade', reload : true});
            },
			onfocusout: false,
			invalidHandler: function(form, validator) {
        			var errors = validator.numberOfInvalids();
					console.log("invalid email: "+errors);
        			if (errors) {                    
            			validator.errorList[0].element.focus();
        			}
    			} 						
						
		}
		});
});

	//...........................................................................
	//PAGE2 on pagecreate - triggered after page initialization occurs
    //$('#page2').on('pageinit', function () {
		$('#page2').on('pagecreate', function () {
	    setTimeout(function () { //DIANNE - created to allow focus in IE9. Needed to save data to localStorage when onBlur is fired.
			$('#station').focus(); },500);
		 
        $('#sampleProperties').validate({ //form validation
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
			invalidHandler: function(form, validator) {
        			var errors = validator.numberOfInvalids();
					console.log("ERRORS: "+errors);
        			if (errors) {                    
            			validator.errorList[0].element.focus();
        			}
    			} 			
        });
	 	
		//ADD 'GROUP OR SET' BUTTON, in PAGE2 FOR ADDING NEW EVENT
	$('#addSampleParameters').click(function (e) {
		console.log('*** ADDSAMPLEPARAMETERS - ONCLICK');
        if ($('#sampleProperties').valid()) {
        	$('#sampleSets').empty();
            setLetter = 65; //'A'

			//create buttons for sample sets, and creates empty set (!S) tag for every one
			if ($('#singleOrMulti').val() == 'multi') {				
               	for (i = 0; i < $('#setQuantity').val(); i++) {
                   	$('#sampleSets').append(createButton('Set' + ' ' + String.fromCharCode(setLetter), '#setProperties', "changeSet(this.id)", String.fromCharCode(setLetter)));
					save_eventTags('!S&'+eventCounter+'&'+String.fromCharCode(setLetter),'');
                   	setLetter++;
               	}

			} else { //if single, create one set only and its empty containers
                $('#sampleSets').append(createButton('Set' + ' ' + String.fromCharCode(setLetter), '#setProperties', "changeSet(this.id)", String.fromCharCode(setLetter)));
				save_eventTags('!S&'+eventCounter+'&'+String.fromCharCode(setLetter),'');
				for (var i = 1; i <= ls.getItem('#setQuantity'); i++) { //create EMPTY CONTNS TAG in LS for this group
					save_eventTags('!C&'+eventCounter + '&' + String.fromCharCode(setLetter) + '&' + i,'');
				}
				$('#containersQuantity').val($('#setQuantity').val()); //in Single, containersQuantity is the same value as setQuantity
				save_data('containersQuantity',$('#setQuantity').val()); //copy same value in localStorage
			}
			//Save Event index tag that describes the event
			save_eventTags('!E&'+eventCounter, $('#station').serialize()+'&userType='+ls.getItem('userType')+'&'+decodeURIComponent($('#evtDate').serialize())+'&'+$('#singleOrMulti').serialize()+'&sampleType='+ls.getItem('#sampleType')+'&'+$('#sampleMedium').serialize()+'&'+$('#EVENT').serialize());
			console.log('*** Saved data E&....');
			eventArray = getURIArray('!E&'+eventCounter); 	 //fill event array to have the information of the current event 
			workingWithThisEvCounter = eventCounter;
				
            if (eventArray['singleOrMulti'] == 'multi') {
				//$.mobile.changePage('#multiSet');
				$(':mobile-pagecontainer').pagecontainer('change','#multiSet',{transition: 'fade', reload : true});
				$('#multiAtributes').show();
				if ($('#sampleType') == 'SS') {
					$('.SS_and_Multi_only').show();
				}
            } else  { //single
				if (eventArray['userType'] == 'Technician') { //dianne
				   //$.mobile.changePage('#setProperties');
				   $(':mobile-pagecontainer').pagecontainer('change','#setProperties',{transition: 'fade', reload : true});
				   changeSet('A');
				   console.log('*** Getting set from ls: '+ls.getItem('#set'));
				   $('#multiAtributes').hide();
				} else { //Observer
					changeSet('A');
					linkToContainersObserver();					   
				}
           }
           } //if valid

        });
    });

//create the list of current events, based on what is stored in local storage
    $('#currentButton').click(function (e) {
		addOrEdit = 1;
        $('#currentSamples').empty(); 
        var station = 0;
		var eventID = 0;
		var tempStation = "";
		
		$('#currentSamples').append('<dl>');
		for (i = 0; i < ls.length; i++) { //for every element in localstorage

			if (ls.key(i).indexOf("!E&")!== -1) { //if an event is found
				var query = ls.key(i);
				console.log('EVENT found = '+query+ '   '+ls.getItem(query));
				if (ls.getItem('userType') === getURIItem(query,'userType')) {
					eventID = query.split('&')[1]; //event counter for this event
					tempStation = getURIItem(query,'station');				
							$('#currentSamples').append('<dt>EventID '+eventID+": "+tempStation+' - '+getURIItem(query,'evtDate')+' '+getURIItem(query,'singleOrMulti')+'</dt><dd>'+
					'<a href="#currentShipmentContainer" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-eye ui-btn-icon-notext ui-btn-inline" data-mini="true" '+
							'onclick="createCurrentSets(\''+eventID+'\',\''+getURIItem(query,'singleOrMulti')+'\')">Access event</a>'+
					'<a href="#" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-mail ui-btn-icon-notext ui-btn-inline" data-inline="true" data-mini="true" data-role="button" data-transition="pop" data-rel="popup" data-position-to="window" '+
							'onClick="getEventXML(\''+query+'\');">Submit event</a>'+
					'<a href="#deleteEventDialog" class="xxx ui-btn  ui-btn-corner-all ui-shadow ui-icon-delete ui-btn-icon-notext ui-btn-inline" data-inline="true" data-mini="true" data-role="button" data-transition="pop" data-rel="popup" data-position-to="window" '+
							'onClick="deleteDialog(\'2\',\'2\',\''+eventID+'\',\'\',\'1\');">Delete event</a>'+
					'</dd>');
				}
			}
		}

		if (tempStation === "") 
		     $('#currentSamples').append('<span> There are no samples </span></dl>');
		else {
			 $('#currentSamples').append('</dl>');}
			 
    });
	
    $('#currentShipmentPage').on('pageinit', function () {
		//alert("currentshipment");
    });

	$('#sampleParametersPage').on("pagecontainer", function() {
		pageId = $('body').pagecontainer('getActivePage').prop("id");
		if (pageId==='sampleParametersPage') {
			console.log("...en sampleparameterspage");
			console.log(getGroupCheckboxValues('analysis',false));
			setAddOnOptions('sampleType');
			//$('#possibleAddon').empty();
			//$('#possibleAddon').append('<strong>Set already gets '+getGroupCheckboxValues('analysis',false)+'</strong>');
		}	
	});
	//++++++++++++++++++++++++++++++++++++++
    $('#setProperties').on('pageinit', function () {

       console.log("SETPROPERTIES - pageinit");
      		
        $('#setAtributesForm').validate({
            rules: {
                method: 'required',
                containersQuantity: {
                    required: 'true',
                    custom_number: true, //for strings
                    range: [1, 40],
                    digits: true
                }
            },
			onfocusout: false,
			invalidHandler: function(form, validator) {
        			var errors = validator.numberOfInvalids();
					console.log("ERRORS: "+errors);
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
			invalidHandler: function(form, validator) {
        			var errors = validator.numberOfInvalids();
					console.log("ERRORS: "+errors);
        			if (errors) {                    
            			validator.errorList[0].element.focus();
        			}
    			} 			
        });
		//LINK IN SETPROPERTIES PAGE, AFTER SETTING ANALYSIS CKBOXES.
        $('#linkToContainers').click(function () {
			console.log("^^^LINKTOCONTAINERS");
            if ($('#setAtributesForm').valid() && $('#analysesForm').valid()) {
				$('#beginDate').val($('#evtDate').val());
				$('#beginTime').val('');
				$('#backToEvent').hide();
				
				var data = '';
				var setStr = ls.getItem('#set');
				console.log("^^^ #set "+setStr+"   #singleMulti "+ls.getItem('#singleOrMulti'));
				console.log("^^^2  #containersQuantity: "+parseInt(ls.getItem('#containersQuantity')));
				if (ls.getItem('#singleOrMulti') == "single") {
					data = $('#setAtributesForm').not('#method').serialize() + '&'+ getGroupCheckboxValues('analysis',true);
					save_eventTags('!S&'+eventCounter + '&'+setStr, data);
				} else {
					data = $('#setAtributesForm').serialize() + '&'+ getGroupCheckboxValues('analysis',true);
					save_eventTags('!S&'+eventCounter + '&'+setStr, data);
					
					for (var i = 1; i <= parseInt(ls.getItem('#containersQuantity')); i++) { //create empty containers for this group
						save_eventTags('!C&'+eventCounter + '&' + setStr + '&' + i,'');
					}					
				}
				
                containerCounter = 1; //initiating container counter for this set
                console.log('^^^Forms multiAttributes and analysesForm were valid');
                if (ls.getItem('#singleOrMulti') == 'multi') {
                    $('#sampleParametersPageHeader').text('Set' + ' ' + ls.getItem('#set') + ', Container ' + containerCounter+ ' of ' + ls.getItem('#containersQuantity'));
                }
                if (ls.getItem('#singleOrMulti') == 'single') {
                    $('#sampleParametersPageHeader').text('Single, container ' + containerCounter+ ' of ' + ls.getItem('#containersQuantity'));
                }
                $.mobile.changePage('#sampleParametersPage');
            }
        });
		console.log("--->SETPROPERTIES - pageinit");
    });

		//LINK IN SETPROPERTIES PAGE, AFTER SETTING ANALYSIS CKBOXES.
  function linkToContainersObserver () {
			console.log("^^^LINKTOCONTAINERSOBSERVER");
				$('#beginDate').val($('#evtDate').val());
				$('#beginTime').val('');
				$('#backToEvent').hide();
				
				var data = '';
				var setStr = ls.getItem('#set');
				console.log("^^^ #set "+setStr+"   #singleMulti "+ls.getItem('#singleOrMulti'));
				console.log("^^^2  #containersQuantity: "+parseInt(ls.getItem('#containersQuantity')));
				if (ls.getItem('#singleOrMulti') == "single") {
					//$('#containersQuantity').val($('#setQuantity'));
					data = $('#containersQuantity').serialize();
					save_eventTags('!S&'+eventCounter + '&'+setStr, data);
				} else {
					data = $('#setAtributesForm').serialize();
					save_eventTags('!S&'+eventCounter + '&'+setStr, data);
					
					for (var i = 1; i <= parseInt(ls.getItem('#containersQuantity')); i++) { //create empty containers for this group
						save_eventTags('!C&'+eventCounter + '&' + setStr + '&' + i,'');
					}					
				}
				
                containerCounter = 1; //initiating container counter for this set
                console.log('^^^Forms multiAttributes and analysesForm were valid');
                if (ls.getItem('#singleOrMulti') == 'multi') {
                    $('#sampleParametersPageHeader').text('Set' + ' ' + ls.getItem('#set') + ', Container ' + containerCounter+ ' of ' + ls.getItem('#containersQuantity'));
                } else {
                    $('#sampleParametersPageHeader').text('Single, container ' + containerCounter+ ' of ' + ls.getItem('#containersQuantity'));
                }
                $.mobile.changePage('#sampleParametersPage');
				console.log("--->SETPROPERTIES - pageinit");
    }
		
    $('#sampleParametersPage').on('pageinit', function () {

        if ($('#singleOrMulti').val() == 'multi') {
            $('#sampleParametersPageHeader').text('Set ' + ls.getItem('#set') + ', container ' + containerCounter);
        } else {
            $('#sampleParametersPageHeader').text('Single, container ' + containerCounter+ ' of ' + ls.getItem('#containersQuantity'));
        }
		
        $('#sampleParameters').validate({
            rules: {
                beginDate: 'required',
                beginTime: 'required',
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
			invalidHandler: function(form, validator) {
        			var errors = validator.numberOfInvalids();
					console.log("ERRORS: "+errors);
        			if (errors) {                    
            			validator.errorList[0].element.focus();
        			}
    			} 			
        });
        
		$('#sampleParameters2').validate({
            rules: {
                P04121: { custom_float: true },
                P04120: { custom_float: true },
                P04119: { custom_float: true },
                P04118: { custom_float: true },
                P04117: { custom_float: true },
                P30333: { custom_float: true },
                P65225: { custom_float: true },
                P63680: { custom_float: true },
                P63676: { custom_float: true },
                P63675: { custom_float: true },
                P00095: { custom_float: true },
                P00020: { custom_float: true },
                P00061: { custom_float: true },
                M2Lab: { },
                P00064: { custom_float: true },
                P00003: { custom_float: true },
                P72103: { custom_float: true },
                P00009: { custom_float: true },
                P00061: { custom_float: true },
                P00010: { custom_float: true },
                P00063: { custom_float: true },
                P00065: { custom_float: true },
                P71999: { required: true }
                //P82398: { required: true },
                //P84164: { required: true }
            }, 
            submitHandler: function (form) {
				var data = decodeURIComponent($('#beginDate').serialize())+'&'+decodeURIComponent($('#beginTime').serialize())+
				'&'+$($('#sampleParameters')[0].elements).not('#beginDate,#beginTime,#m2lab').serialize() + '&' +
				decodeURIComponent($('#m2lab').serialize()) + '&' + $('#sampleParameters2').serialize();
                console.log("PARAMETERS2 - VALIDATE: "+data);
				save_eventTags('!C&'+eventCounter + '&' + ls.getItem('#set') + '&' + containerCounter, data);
               // return false;
            },
			onfocusout: false,
			invalidHandler: function(form, validator) {
        			var errors = validator.numberOfInvalids();
					console.log("ERRORS: "+errors);
        			if (errors) {                    
            			validator.errorList[0].element.focus();
        			}
    			} 
        });
///ANADIR DATA LOADED COMO EN NEXT CONTAINER
        $('#priorSample').click(function () {			
            if ($('#sampleParameters').valid() && $('#sampleParameters2').valid()) {
                goToPriorContainer();
                $("html, body").animate({
                    scrollTop: 0
                }, "slow");
            }
        });
        $('#nextSample').click(function () {
            if ($('#sampleParameters').valid() && $('#sampleParameters2').valid()) {
                var dataLoaded = goToNextContainer();
				if (dataLoaded == false)  {
					$('#beginTime').val('');
				}
                $("html, body").animate({
                    scrollTop: 0
                }, "slow");
            }
        });
	
    });
	
    $('#multiSet').on('pageinit', function () {
        $('#addSampleSet').click(function (e) {
            var setQuantity = $('#setQuantity').val();
            console.log(setQuantity);
            $('#sampleSets').append(createButton('Set' + ' ' + String.fromCharCode(setLetter), '#setProperties', 'changeSet(this.id)', String.fromCharCode(setLetter)));
            setLetter++;
            setQuantity++;
            $('#setQuantity').val(setQuantity);
            save_data('setQuantity', $('#setQuantity').val());
        });

    });


}
// GET AND SET FUNCTIONS FOR CHECKBOXES
//Convert group checkboxes values into a comma delimited text
function getGroupCheckboxValues(groupName,inclGroupName) {
	var delim = '';
	$.each($("input[name='"+groupName+"']:checked"), function() {
		delim=delim+$(this).val()+',';
   });
   if (inclGroupName == true) {
	   delim = groupName+'='+delim;
   } 
   return delim.slice(0, -1); //removes the last character that is a comma;
}

//Extract a comma delimited values into the corresponding component, uning the groupName + an extra chart for determine the
//corresponding ID
function setGroupCheckboxValues(groupName,groupValues) {
	var data = groupValues.split(',');
	
    for (var i = 0; i < data.length; i++) {
	     $('#'+groupName+data[i]).attr("checked","checked");
	}
}

//Store the data as a key|value pair in localStorage
function save_data(id, value) {
    try {
		ls.setItem('#' + id, value); 
		console.log('Saved #' + id + ':' + value);        
    } catch (exception) {
        if ((exception != QUOTA_EXCEEDED_ERR) && (exception != NS_ERROR_DOM_QUOTA_REACHED)) {
            throw exception;
        }
    }
}
//tags are: !E, !S, !C: event, set, container
function save_eventTags(id, value) {
    try {
		ls.setItem(id, value); 
		console.log('Saved ' + id + ':' + value);        
    } catch (exception) {
        if ((exception != QUOTA_EXCEEDED_ERR) && (exception != NS_ERROR_DOM_QUOTA_REACHED)) {
            throw exception;
        }
    }
}
//updateLabel(this.id)
function updateLabel(id) {

 if ($('#'+id).val() === 'single') {
	$('.containerLabel').show();
	$('.setLabel').hide();
 } else {
	$('.containerLabel').hide();
	$('.setLabel').show();
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
//Sets the title of the header page
function setTitle(id, value) {
	//alert("dentro de settitle");
	$('#page2SubHeader').text(value);
	if (value === 'Suspended Sediment') {
	  save_data(id, 'SS'); 
	}
	if (value === 'Bottom Material') {
	  save_data(id, 'BM'); 
	}
	if (value === 'Bedload') {
	  save_data(id, 'BL'); 
	}
}
//set corresponding classes based on id of sampleType
// if bool fromLS (fromLocalStorage) == true, the value will be get from the 
// what is stored in the corresponding tags starting with #E, #S, and #C (localstorage)
function setCorrespondingOptions(id) {	
	  var userVal = ls.getItem('userType');
	  var sampleVal = ls.getItem('#' + id);
	  
	  switch (sampleVal) {
	  	case 'BL': 	$('.suspendedAdditionalFields, .bottomAdditionalFields').hide();
					$('.bedloadAdditionalFields, #bedloadAdditionalFields').show();
					$('.SS_and_Multi_only').hide();
					break;
		case 'BM': 	$('.suspendedAdditionalFields, .bedloadAdditionalFields, #bedloadAdditionalFields').hide();
					$('.bottomAdditionalFields').show();
					$('.SS_and_Multi_only').hide();
					break;
		case 'SS': 	$('.bedloadAdditionalFields, #bedloadAdditionalFields, .bottomAdditionalFields').hide();
					$('.suspendedAdditionalFields').show();
					break;
	  }

    if (userVal != 'Observer') {
		$(' .hideClass,.div div select ui-block-c,.ui-block-d').show()
	} else {
	    $('.hideClass,.div div select ui-block-c,.ui-block-d').hide();
	}
     
}

function fillSelect (value, selValue) {
	console.log("FILLSELECT: "+value);
	
	switch (value) {
		case "Suspended Sediment":
		case "SS":
 			  $('#P82398').empty();
	          $('#P82398').append('<option value="">You must select one</option>'+
			  	'<option value="10">10 EQUAL WIDTH INCREMENT (EWI)</option>'+
                '<option value="15">15 EQUAL WIDTH INCREMENT, NON-ISOKINETIC</option>'+
                '<option value="20">20 EQUAL DISCHARGE INCREMENT (EDI)</option>'+
                '<option value="25">25 TIMED SAMPLING INTERVAL</option>'+
                '<option value="30">30 SINGLE VERTICAL</option>'+
                '<option value="40">40 MULTIPLE VERTICALS</option>'+
                '<option value="50">50 POINT SAMPLE</option>'+
                '<option value="55">55 COMPOSITE - MULTIPLE POINT SAMPLES</option>'+
                '<option value="60">60 WEIGHTED BOTTLE</option>'+
                '<option value="70">70 GRAB SAMPLE (DIP)</option>'+
                '<option value="80">80 DISCHARGE INTEGRATED, EQUAL TRANSIT RATE (ETR)</option>'+
                '<option value="90">90 DISCHARGE INTEGRATED, CENTROID</option>'+
                '<option value="100">100 VAN DORN SAMPLER</option>'+
                '<option value="110">110 SEWAGE SAMPLER</option>'+
                '<option value="120">120 VELOCITY INTEGRATED</option>'+
                '<option value="900">900 SUSPSED; PUMPING - stream sample using a pumping mechanism</option>'+
                '<option value="910">910 SUSPSED;SINGLE-STAGE,nozzle at fixed stage,passively fillng</option>'+
                '<option value="920">920 SUSPSED; BOX-SINGLE VER, DEPTH-INT, Attached To Structure</option>'+
                '<option value="930">930 SUSPSED;PARTIAL DEPTH,DEPTH integrated,part of single vert</option>'+
                '<option value="940">940 SUSPSED; PARTIAL WIDTH - DEP/WIDTH INT, part of X-section</option>'+
                '<option value="4010">4010 THIEF SAMPLE</option>'+
                '<option value="4020">4020 OPEN-TOP BAILER</option>'+
                '<option value="4025">4025 DOUBLE-VALVE BAILER</option>'+
                '<option value="8010">8010 OTHER</option>'+
                '<option value="8030">8030 GRAB SAMPLE AT WATER-SUPPLY TAP</option>'+
                '<option value="8040">8040 SPIGOT (NON-WATER-SUPPLY)</option>'+
                '<option value="8050">8050 GRAB SAMPLE AT TAP(S) ON A DAM</option>');
				
				$('#sampleMedium').empty();
				$('#sampleMedium').append('<option value="WS" >WS (Surface Water)</option>'+
                	'<option value="WSQ">WSQ (Surface Water QC)</option>');
					
				$('#P84164').empty();	
                $('#P84164').append('<option value="">You must select one</option>'+
				'<option value="100">100 VAN DORN SAMPLER</option>'+
                '<option value="110">110 SEWAGE SAMPLE</option>'+
                '<option value="120">120 VELOCITY INTEGRATED SAMPLE</option>'+
                '<option value="125">125 KEMMERER BOTTLE</option>'+
                '<option value="3001">3001 SAMPLER, US DH-48</option>'+
                '<option value="3002">3002 SAMPLER, US DH-59</option>'+
                '<option value="3003">3003 SAMPLER, US DH-75P</option>'+
                '<option value="3004">3004 SAMPLER, US DH-75Q</option>'+
                '<option value="3005">3005 SAMPLER, US DH-76</option>'+
                '<option value="3006">3006 SAMPLER, US D-43</option>'+
                '<option value="3007">3007 SAMPLER, US D-49</option>'+
                '<option value="3008">3008 SAMPLER, US D-49AL</option>'+
                '<option value="3009">3009 SAMPLER, US D-74</option>'+
                '<option value="3010">3010 SAMPLER, US D-74AL</option>'+
                '<option value="3011">3011 SAMPLER, US D-77</option>'+
                '<option value="3012">3012 SAMPLER, US P-46</option>'+
                '<option value="3013">3013 SAMPLER, US P-50</option>'+
                '<option value="3014">3014 SAMPLER, US P-61-A1</option>'+
                '<option value="3015">3015 SAMPLER, US P-63</option>'+
                '<option value="3016">3016 SAMPLER, US P-72</option>'+
                '<option value="3017">3017 SAMPLER, US U-59</option>'+
                '<option value="3018">3018 SAMPLER, US U-73</option>'+
                '<option value="3019">3019 SAMPLER, US PS-69</option>'+
                '<option value="3020">3020 SAMPLER, US PS-69TM</option>'+
                '<option value="3021">3021 SAMPLER, US CS-77</option>'+
                '<option value="3022">3022 SAMPLER, US PS-82</option>'+
                '<option value="3030">3030 US DH-48 TM</option>'+
                '<option value="3031">3031 US DH-48 TM WITH TEFLON GASKET AND NOZZLE</option>'+
                '<option value="3032">3032 US DH-59 TM</option>'+
                '<option value="3033">3033 US DH-59 TM WITH TEFLON GASKET AND NOZZLE</option>'+
                '<option value="3034">3034 US DH-76 TM</option>'+
                '<option value="3035">3035 US DH-76 TM WITH TEFLON GASKET AND NOZZLE</option>'+
                '<option value="3036">3036 US D-74 TM</option>'+
                '<option value="3037">3037 US D-74 AL-TM</option>'+
                '<option value="3038">3038 US D-74 AL-TM WITH TEFLON GASKET AND NOZZLE</option>'+
                '<option value="3039">3039 US D-77 TM</option>'+
                '<option value="3040">3040 US D-77 TM MODIFIED TEFLON BAG SAMPLER</option>'+
                '<option value="3041">3041 US P-61 AL-TM</option>'+
                '<option value="3042">3042 US P-61</option>'+
                '<option value="3043">3043 US P-61 TM</option>'+
                '<option value="3044">3044 US DH-81</option>'+
                '<option value="3045">3045 US DH-81 WITH TEFLON CAP AND NOZZLE</option>'+
                '<option value="3046">3046 SAMPLER, D-77 TM, WITH REYNOLDS OVEN COLLAPSIBLE BAG</option>'+
                '<option value="3047">3047 SAMPLER, FRAME-TYPE, PLASTIC BOTTLE WITH REYNOLDS OVEN BAG</option>'+
                '<option value="3048">3048 SAMPLER, FRAME-TYPE, TEFLON BOTTLE</option>'+
                '<option value="3049">3049 SAMPLER, FRAME-TYPE, PLASTIC BOTTLE</option>'+
                '<option value="3050">3050 SAMPLER, FRAME-TYPE, PLASTIC BOTTLE W/TEFLON COLLAPS. BAG</option>'+
                '<option value="3051">3051 US DH-95 TEFLON BOTTLE</option>'+
                '<option value="3052">3052 US DH-95 PLASTIC BOTTLE</option>'+
                '<option value="3053">3053 US D-95 TEFLON BOTTLE</option>'+
                '<option value="3054">3054 US D-95 PLASTIC BOTTLE</option>'+
                '<option value="3055">3055 US D-96 BAG SAMPLER</option>'+
                '<option value="3056">3056 US D-96-A1 BAG SAMPLER</option>'+
                '<option value="3057">3057 US D-99 BAG SAMPLER</option>'+
                '<option value="3058">3058 US DH-2 BAG SAMPLER</option>'+
                '<option value="3060">3060 WEIGHTED-BOTTLE SAMPLER</option>'+
                '<option value="3061">3061 US WBH-96 WEIGHTED-BOTTLE SAMPLER</option>'+
                '<option value="3070">3070 GRAB SAMPLE</option>'+
                '<option value="3071">3071 OPEN-MOUTH BOTTLE</option>'+
                '<option value="3080">3080 VOC HAND SAMPLER</option>'+
                '<option value="4010">4010 THIEF SAMPLER</option>'+
                '<option value="4020">4020 OPEN-TOP BAILER</option>'+
                '<option value="4115">4115 SAMPLER, POINT, AUTOMATIC</option>'+
                '<option value="8010">8010 OTHER</option>');
				break;
		case "Bottom Material": 
		case "BM":
  			  $('#P82398').empty();
		      $('#P82398').append('<option value="">You must select one</option>'+
			  	'<option value="50">50 POINT SAMPLE</option>'+
                '<option value="55">55 COMPOSITE - MULTIPLE POINT SAMPLES</option>'+
                '<option value="5010">5010 SEDIMENT CORE</option>'+
                '<option value="8010">8010 OTHER</option>');
				
				$('#sampleMedium').empty();
				$('#sampleMedium').append('<option value="SB" >SB (bottom material)</option>'+
                	'<option value="SBQ">SBQ (bottom material QC)</option>');
					
				$('#P84164').empty();	
				$('#P84164').append('<option value="">You must select one</option>'+
				'<option value="3023">3023 SAMPLER, US BMH-53</option>'+
                '<option value="3024">3024 SAMPLER, US BMH-53TM</option>'+
                '<option value="3025">3025 SAMPLER, US BM-54</option>'+
                '<option value="3026">3026 SAMPLER, US BM-54TM</option>'+
                '<option value="3027">3027 SAMPLER, US BMH-60</option>'+
                '<option value="3028">3028 SAMPLER, US BMH-60TM</option>'+
                '<option value="3029">3029 SAMPLER, US RBM-80</option>'+
                '<option value="5010">5010 BOX CORE, LONG</option>'+
                '<option value="5020">5020 BOX CORE, SHORT</option>'+
                '<option value="5030">5030 GRAVITY CORE</option>'+
                '<option value="5040">5040 PISTON CORE</option>'+
                '<option value="5050">5050 PUSH CORE</option>'+
                '<option value="6000">6000 Bed Material -- Scoop Shovel</option>'+
                '<option value="6010">6010 Bed Material -- Scoop TM (Epoxy coated metal sampler)</option>'+
                '<option value="6020">6020 Bed Material -- Scoop Teflon</option>'+
                '<option value="6030">6030 Bed Material -- Pipe Dredge</option>'+
                '<option value="6040">6040 Bed Material -- Dredge-Cooper Scooper</option>'+
                '<option value="6050">6050 Bed Material -- Ponar Grab</option>'+
                '<option value="6060">6060 Bed Material -- Ekman Grab</option>'+
                '<option value="6070">6070 Bed Material -- Box Core Grab</option>'+
                '<option value="6080">6080 Bed Material -- Peterson Grab</option>'+
                '<option value="6090">6090 Bed Material -- Van Veen Grab</option>'+
                '<option value="8010">8010 OTHER</option>');
				break;
		case "Bedload":
		case "BL":
			   $('#P82398').empty();
		       $('#P82398').append('<option value="">You must select one</option>'+
			   	'<option value="50">50 POINT SAMPLE</option>'+
                '<option value="55">55 COMPOSITE - MULTIPLE POINT SAMPLES</option>'+
                '<option value="1000">1000 BEDLOAD, SINGLE EQUAL WIDTH INCREMENT (SEWI)</option>'+
                '<option value="1010">1010 BEDLOAD, MULTIPLE EQUAL WIDTH INCREMENT (MEWI)</option>'+
                '<option value="1020">1020 BEDLOAD, UNEQUAL WIDTH INCREMENT (UWI)</option>'+
                '<option value="8010">8010 OTHER</option>');
				
				$('#sampleMedium').empty();
				$('#sampleMedium').append('<option value="WS" >WS (Surface Water)</option>'+
                	'<option value="WSQ">WSQ (Surface Water QC)</option>');
					
				$('#P84164').empty();	
           		$('#P84164').append('<option value="">You must select one</option>'+
				'<option value="1050">1050 BL-6X12 in, Toutle R. Type 2, Exp. Ratio 1.40, Cable Susp</option>'+
                '<option value="1055">1055 BL-6X12 in, Toutle R. Type 2, Exp. Ratio 1.40, Wading</option>'+
                '<option value="1060">1060 BL-3X3 in, BL-84, Exp. Ratio 1.40, Cable Susp</option>'+
                '<option value="1100">1100 BL-3X3 in, H-S, 50-100 lb, Exp. Ratio 3.22, Cable Susp</option>'+
                '<option value="1110">1110 BL-3X3 in, H-S, 100-200 lb,   Exp. Ratio 3.22, Cable Susp</option>'+
                '<option value="1120">1120 BL-3X3 in, H-S, 1/4-in thick nozzle,  Exp. Ratio 3.22, Wading</option>'+
                '<option value="1150">1150 BL-3X3 in, BLH-84, 1/4-in thick nozzle,  Exp. Ratio 1.4, Wading</option>'+
                '<option value="1170">1170 BL-6X6 in H-S, 1/4-in nozzle, 150-200 lb, Exp. Ratio 3.22, Cable Susp</option>'+
                '<option value="1180">1180 BL-4X8 in, Elwha R., Exp. Ratio 1.40, Wading</option>'+
                '<option value="1190">1190 BL-4X8 in, Elwha R., Exp. Ratio 1.40, Cable Susp</option>'+
                '<option value="1200">1200 BL-Net-Frame Trap</option>'+
				'<option value="8010">8010 OTHER</option>'+
                '<option value="8020">8020 Mulitple samplers used</option>');	
				break;		
		case "DD": //input select para default Date
				var selOptions = {'1':'1- Drought','2':'2- Spill','3':'3- Regulated Flow','4':'4- Snowmelt','5':'5- Earthquake',
				'6':'6- Hurricane','7':'7- Flood','8':'8- Volcanic activity','9':'9- Routine Sample',
				'A':'A- Spring breakup','B':'B- Under ice cover','C':'C- Glacial lake outbreak',
				'D':'D- Mudflow','E':'E- Tidal action','F':'F- Fire, affected by fire prior sampling',
				'H':'H- Dambreak','J':'J- Storm','K':'K- Backwater','X':'X- Not applicable'};
				var optionsStr = '';
				$.each(selOptions,function(val,text) {
					if (val == selValue) {
					    optionsStr = optionsStr+'<option value='+val+' selected>'+text+'</option>';
					} else {
						optionsStr = optionsStr+'<option value='+val+'>'+text+'</option>';
					}
				});
				return optionsStr;
		        break;
	}
	$('#P82398').change();
	$('#P84164').change();
	$('#sampleMedium').change();
	
}

function setAddOnOptions(id) {	
    var isChecked = false;
	
	console.log("dentro de setAddOn");
	$('#fullSizeFraction, #fullSizeFractionlb').hide();
	$('#sandFineBreak, #sandFineBreaklb').hide();
	$('#sand, #sandlb').hide();
	$('#lossOnIgnition, #lossOnIgnitionlb').hide();
	
    if (ls.getItem('#' + id) == 'BL') { 
		isChecked = $('#analysesZ:checked').val()?true:false;	
		if (!isChecked) {
		   $('#fullSizeFraction, #fullSizeFractionlb').show();
		}

    } else  {
		isChecked = $('#analysesZ:checked').val()?true:false;	
		if (!isChecked) {
		   $('#fullSizeFraction, #fullSizeFractionlb').show();
		}
		isChecked = $('#analysesSF:checked').val()?true:false;	
		if (!isChecked) {
		   $('#sandFineBreak, #sandFineBreaklb').show();
		}
		isChecked = $('#analysesSA:checked').val()?true:false;	
		if (!isChecked) {
		   $('#sand, #sandlb').show();
		}
		isChecked = $('#analysesLOI:checked').val()?true:false;	
		if (!isChecked) {
		   $('#lossOnIgnition, #lossOnIgnitionlb').show();
		}
		
    }
	$('#possibleAddon').empty();
	$('#possibleAddon').append('(Set already gets '+getGroupCheckboxValues('analysis',false)+')');
	 
}
//


//Create button elements and appends it to the div block
function createButton(buttonText, hrefLink, onclk, id) {
	var button="";
    console.log('=>' + onclk);
	switch(buttonText) {
		case "View":
		case "Info":
			button = '<a href="' + hrefLink + '" onClick="' + onclk + '" data-rel="dialog" data-role="button" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-eye ui-btn-icon-notext ui-btn-inline" id="' + id + '"' + '>' +            
			buttonText+'</a>';
			break;
		case "Edit":
	   		button = '<a href="' + hrefLink + '" onClick="' + onclk + '" class="xxx ui-btn ui-btn-corner-all ui-shadow ui-icon-edit ui-btn-icon-notext ui-btn-inline" id="' + id + '"' + '>' +
            buttonText+'</a>';
			break;
		case "Delete":
	   		button = '<a href="' + hrefLink + '" onClick="' + onclk + '" class="xxx ui-btn-corner-all ui-shadow ui-btn ui-icon-delete ui-btn-icon-notext ui-btn-inline" data-role="button" data-theme="d" data-transition="pop" data-rel="popup" data-position-to="window" id="' + id + '"' + '>' +
            buttonText+'</a>';	
			break;
		case "Delete event":
        	button = '<a href="' + hrefLink + '" onClick="' + onclk + '" class="ui-btn ui-btn-corner-all ui-shadow ui-btn-up-c" data-role="button" data-theme="d" data-transition="pop" data-rel="popup" data-position-to="window"  data-inline="true" id="' + id + '"' + '>' +
            buttonText+'</a>';
			break;
		default:		
        	button = '<a href="' + hrefLink + '" onClick="' + onclk + '" class="ui-btn ui-btn-corner-all ui-shadow ui-btn-up-c" data-role="button" data-theme="d" id="' + id + '"' + '>' +
			buttonText+'</a>';
    }
    return button;
}

function createCollapsible(stn,collapsibleText, id,eventKey) {
    var counter = 0;
	var totalSamplesGroup=1;
	var highestContainerNum=1;
	//the id of every element inthe collapsible will be object+set
	var collapsible = "<div data-role='collapsible' data-collapsed='false' data-theme='d' data-content-theme='c' id='set" + id + "'><h3>" + stn+" "+collapsibleText+"</h3>";
	//anade buton en header
			//	'<span class="ui-row-btn">'+
			//		'<a href="index.html" data-theme="b" data-role="button" data-iconpos="notext" data-inline = "true" data-mini="true" data-icon="delete" style="float:right; margin-top:-20px;" >Delete</a>'+	 
			//	"</span>"+
	if (collapsibleText === 'single') {
		collapsible = collapsible+"<h4>Modify this Group</strong></h4>";
		if (eventKey in ls) {
			collapsible +=editEventSetHeading('!S&'+eventKey.split('&')[1]+'&A');
			console.log("---- "+'S&'+eventKey.split('&')[1]+'&A');
		}
		totalSamplesGroup = countElementsInLS('!C&'+eventKey.split('&')[1]+'&A');
		//save SET TAG oif the containerQuiantity changes
		save_eventTags('!S&'+eventKey.split('&')[1]+'&A',changeParamByName(ls.getItem('!S&'+eventKey.split('&')[1]+'&A'),totalSamplesGroup));

/*
		collapsible = collapsible+"<p><strong>Click on button to Edit, View, or Delete a sample.</strong><br />Note: if you want to delete the group from the event, you have to delete the event instead</p>";		
 		collapsible = collapsible+'<label for="addsamplesCounter'+eventKey.split('&')[1]+'A">Total samples: </label><div data-role="controlgroup" data-type="horizontal">';
        collapsible = collapsible+'<input data-wrapper-class="controlgroup-textinput ui-btn" type="number" min="'+totalSamplesGroup+'" value="'+totalSamplesGroup+'" max="40" data-mini="true" id="addsamplesCounter'+eventKey.split('&')[1]+'A" onBlur="addEmptyContainers(\'!C&'+eventKey.split('&')[1]+'&A&\','+totalSamplesGroup+')"/><button data-mini="true">Add</button></div>';	

*/
		collapsible = collapsible+"<p><strong>Click on button to Edit, View, or Delete a sample.</strong><br />Note: if you want to delete the group from the event, you have to delete the event instead</p>";		
 		
		collapsible = collapsible+'<div class="ui-field-contain"><label for="addsamplesCounter'+eventKey.split('&')[1]+'A">Total samples: </label><fieldset data-role="controlgroup" data-type="horizontal">';
        collapsible = collapsible+'<input data-wrapper-class="controlgroup-textinput ui-btn" type="number" min="'+totalSamplesGroup+'" value="'+totalSamplesGroup+'" max="40" data-mini="true" id="addsamplesCounter'+eventKey.split('&')[1]+'A" /><button data-mini="true" onClick="addEmptyContainers(\'!C&'+eventKey.split('&')[1]+'&A&\','+totalSamplesGroup+')">Add</button></fieldset></div>';	
	}
	else {
		collapsible = collapsible+"<h4>Modify this Set</strong></h4>";
		if (eventKey in ls) {
			collapsible +=editEventSetHeading('!S&'+eventKey.split('&')[1]+'&'+id);
			console.log("---- "+'S&'+eventKey.split('&')[1]+'&'+id);
		}
		totalSamplesGroup = countElementsInLS('!C&'+eventKey.split('&')[1]+'&'+id);
		//save SET TAG oif the containerQuiantity changes
		save_eventTags('!S&'+eventKey.split('&')[1]+'&'+id,changeParamByName(ls.getItem('!S&'+eventKey.split('&')[1]+'&'+id),totalSamplesGroup));
		collapsible = collapsible+"<p><strong>Click on button to Edit, View, or Delete a sample.</strong><br />Note: if you want to delete the group from the event, you have to delete the event instead</p>";		
 		collapsible = collapsible+'<div class="ui-field-contain"><label for="addsamplesCounter'+eventKey.split('&')[1]+id+'">Total samples: </label><fieldset data-role="controlgroup" data-type="horizontal">';
        collapsible = collapsible+'<input data-wrapper-class="controlgroup-textinput ui-btn" type="number" min="'+totalSamplesGroup+'" value="'+totalSamplesGroup+'" max="40" data-mini="true" id="addsamplesCounter'+eventKey.split('&')[1]+id+'" /><button data-mini="true" onClick="addEmptyContainers(\'!C&'+eventKey.split('&')[1]+'&'+id+'&\','+totalSamplesGroup+')">Add</button></fieldset></div>';	
		//collapsible = collapsible+"<p>Total samples: "+totalSamplesGroup+"<br>Only increases allowed. To decrease, DELETE a sample</p>";
	}
	return collapsible;
}

function editEventSetHeading(key) {
   //var headingFormStr = ; 
   console.log(" editeventheading key: "+key);
   var headingFormStr = '';
   switch (key.charAt(1)) {
	   case 'E': //heading for event
   		headingFormStr = "<div><dl><dt class='current'>Event ID</dt><dd class='current'>"+key.split('&')[1]+"</dd>";
		headingFormStr=headingFormStr+"<dt class='current'>Sediment family</dt><dd class='current'>"+eventArray['sampleType']+"</dd>";
   		headingFormStr=headingFormStr+"<dt class='current'>Station</dt><dd class='current'>"+eventArray['station']+"</dd>";
		if (eventArray['userType'] !== 'Observer') {
   			headingFormStr=headingFormStr+"<dt class='current'>Medium</dt><dd class='current'>"+eventArray['sampleMedium']+'</dd>';
		}
		headingFormStr=headingFormStr+'</dl></div><br clear"both"><div><form id="updateEvent"><div class="ui-field-contain"><label for="bDate">Default begin date:</label>'+
   		'<input type="text" data-mini="true" name="defaultDate" id="defaultDate" onChange="save_data(this.name,this.value)"/></div></div>';
   		headingFormStr=headingFormStr+'<div class="ui-field-contain"><label for="dEvent">Default hyd event:</label><select name="dEvent" id="dEvent" data-mini="true" onChange="updateURIItem('+key+',\'beginDate\',this.value)">'+fillSelect("DD",eventArray['EVENT'])+"</div></form>";
   		break;
	  case 'S':  //deading for set
	    var setLetter = key.split('&')[2];
   		if (eventArray['userType'] !== 'Observer') {
			headingFormStr=headingFormStr+'<form id="editAnalysisForm'+setLetter+'" data-mini="true">'+
                '<label for="checkbox'+setLetter+'C" class="suspendedAdditionalFields">Concentration</label>'+
                '<input type="checkbox" name="analysisEdit" id="checkbox'+setLetter+'C" value="C" class="suspendedAdditionalFields" '+ 
                       'data-mini="true" onClick="chkBox(this.id,this.value)" />'+
                '<label for="checkbox'+setLetter+'SF">Sand-Fine break**</label>'+
                '<input type="checkbox" name="analysisEdit" id="checkbox'+setLetter+'SF" value="SF" data-mini="true" onClick="chkBox(this.id,this.value)" />'+
                '<label for="checkbox'+setLetter+'SA">Sand Analysis**</label>'+
                '<input type="checkbox" name="analysisEdit" id="checkbox'+setLetter+'SA" value="SA" data-mini="true" onClick="chkBox(this.id,this.value)" />'+
                '<label for="checkbox'+setLetter+'T" class="suspendedAdditionalFields">Turbidity</label>'+
                '<input type="checkbox" name="analysisEdit" id="checkbox'+setLetter+'T" value="T" class="suspendedAdditionalFields" '+
                       'data-mini="true" onClick="chkBox(this.id,this.value)" />'+
                '<label for="checkbox'+setLetter+'LOI">Loss-on-ignition**</label>'+
                '<input type="checkbox" name="analysisEdit" id="checkbox'+setLetter+'LOI" value="LOI" data-mini="true" onClick="chkBox(this.id,this.value)" />'+
                
                '<label for="checkbox'+setLetter+'BD" class="bottomAdditionalFields">Bulk Density</label>'+
                '<input type="checkbox" name="analysisEdit" id="checkbox'+setLetter+'BD" value="BD" class="bottomAdditionalFields" '+ 
                       'data-mini="true" onClick="chkBox(this.id,this.value)" />'+
                               
                '<label for="checkbox'+setLetter+'FO" class="bottomAdditionalFields bedloadAdditionalFields">Fines Only</label>'+
                '<input type="checkbox" name="analysisEdit" id="checkbox'+setLetter+'FO" value="FO" '+ 
                       'class="bottomAdditionalFields bedloadAdditionalFields" data-mini="true" onClick="chkBox(this.id,this.value)" />'+                
                '<label for="checkbox'+setLetter+'DS" class="suspendedAdditionalFields">Dissolved Solids</label>'+
                '<input type="checkbox" name="analysisEdit" id="checkbox'+setLetter+'DS" value="DS" class="suspendedAdditionalFields" '+ 
                       'data-mini="true" onClick="chkBox(this.id,this.value)" />'+
                '<label for="checkbox'+setLetter+'SC" class="suspendedAdditionalFields">Specific Conductance</label>'+
                '<input type="checkbox" name="analysisEdit" id="checkbox'+setLetter+'SC" value="SC" class="suspendedAdditionalFields" '+ 
                       'data-mini="true" onClick="chkBox(this.id,this.value)" />'+
                '<label for="checkbox'+setLetter+'Z">Full-size fractions**</label>'+
                '<input type="checkbox" name="analysisEdit" id="checkbox'+setLetter+'Z" value="Z" data-mini="true" onClick="chkBox(this.id,this.value)" />'+
           	'</form>';		
		}
   		break;

   }
   return headingFormStr;
}

function addSampleButtons(eventID,letter,counter,xxx) {
	
	var keyStr = '!C&'+eventID + '&' + letter + '&' + counter;
	var eventStr = '!E&'+eventID;
	console.log("addsamplecounter -> "+eventArray['singleOrMulti']);
	if (xxx === 0)
	if (eventArray['singleOrMulti'] === 'single') {
		$('#set').append('<p id="sampleLabel'+eventID+letter+counter+'"><strong>Sample ' +counter+ '&nbsp;&nbsp;</strong>'+ 
		createButton('Edit', '#sampleParametersPage', "save_data('set','"+letter+"');getContainerDatafromLS('" +keyStr+"','"+eventStr+"');changeSet('" +letter+ "')", 'edit'+counter)+ 
		createButton('View', '#reportPage', "getContainerHTML('" + keyStr + "',\'"+eventArray['station']+"\',\'"+letter+"\',\'"+counter+"\');", 'view' + counter)+
 		createButton('Delete','#deleteDialog','deleteDialog(\'0\',\'0\',\''+eventID+'\',\''+letter+'\',\''+counter+'\');','delete'+counter)+'</p>').enhanceWithin();	
	} else {
		$('#set'+ letter).append('<p id="sampleLabel'+eventID+letter+counter+'"><strong>Sample ' +counter+ '&nbsp;&nbsp;</strong>'+ 
		createButton('Edit', '#sampleParametersPage', "save_data('set','"+letter+"');getContainerDatafromLS('" +keyStr+"','"+eventStr+"');changeSet('" +letter+ "')", 'edit'+counter)+ 
		createButton('View', '#reportPage', "getContainerHTML('" + keyStr + "',\'"+eventArray['station']+"\',\'"+letter+"\',\'"+counter+"\');", 'view' + counter)+
		createButton('Delete','#deleteDialog','deleteDialog(\'0\',\'1\',\''+eventID+'\',\''+letter+'\',\''+counter+'\');','delete'+counter)+'</p>').enhanceWithin();
	}
	
	else 

	if (eventArray['singleOrMulti'] === 'single') {
		$('#sampleLabel'+eventID+letter+(parseInt(counter)-1)).after('<p id="sampleLabel'+eventID+letter+counter+'"><strong>Sample ' +counter+ '&nbsp;&nbsp;</strong>'+ 
		createButton('Edit', '#sampleParametersPage', "save_data('set','"+letter+"');getContainerDatafromLS('" +keyStr+"','"+eventStr+"');changeSet('" +letter+ "')", 'edit'+counter)+ 
		createButton('View', '#reportPage', "getContainerHTML('" + keyStr + "',\'"+eventArray['station']+"\',\'"+letter+"\',\'"+counter+"\');", 'view' + counter)+
 		createButton('Delete','#deleteDialog','deleteDialog(\'0\',\'0\',\''+eventID+'\',\''+letter+'\',\''+counter+'\');','delete'+counter)+'</p>').enhanceWithin();	
	} else {
		$('#sampleLabel'+eventID+letter+(parseInt(counter)-1)).after('<p id="sampleLabel'+eventID+letter+counter+'"><strong>Sample ' +counter+ '&nbsp;&nbsp;</strong>'+ 
		createButton('Edit', '#sampleParametersPage', "save_data('set','"+letter+"');getContainerDatafromLS('" +keyStr+"','"+eventStr+"');changeSet('" +letter+ "')", 'edit'+counter)+ 
		createButton('View', '#reportPage', "getContainerHTML('" + keyStr + "',\'"+eventArray['station']+"\',\'"+letter+"\',\'"+counter+"\');", 'view' + counter)+
		createButton('Delete','#deleteDialog','deleteDialog(\'0\',\'1\',\''+eventID+'\',\''+letter+'\',\''+counter+'\');','delete'+counter)+'</p>').enhanceWithin();
	}
	
}

//function createCurrentSets(stctr,station,settmp) {
function createCurrentSets(stctr,singlMulti) {
    console.log('function createCurrentSets ('+stctr+' '+singlMulti+')');
    var counter = 1;	
	var letterCtr = 65;
	var keyStr;
	var moreContainers = true;
	var moreSets = true;
	
	var letter = String.fromCharCode(letterCtr);
	var eventStr = '!E&'+stctr;
	workingWithThisEvCounter = stctr;
	
    $('#currentShipmentSamples').empty();
	
		$('#currentShipmentSamples').append("<h4>Change the basic event information</strong></h4>");
		if (eventStr in ls) {
			eventArray = getURIArray(eventStr); 
	
			$('#currentShipmentSamples').append(editEventSetHeading(eventStr));
			$('#defaultDate').datetimepicker({
 				timepicker:false,
				formatDate:'d/m/Y',
				format:'d/m/Y',
				mask:false, // '9999/19/39 29:59' - digit is the maximum possible for a cell
			});
			$('#defaultDate').val(eventArray['evtDate']);
			//setGroupCheckboxValues(groupName,groupValues);
			$('#currentShipmentSamples').append("<br /><h4>Group or Sets</strong></h4>");
		}	
	
	if (singlMulti === 'single') {
		counter=1;
		moreContainers = true;
		//$('#currentShipmentSamples').append(createCollapsible('Single set', ""));
		//PONER EL ID DE CREATE COLLAPSIBLE COMO 'A'
		$('#currentShipmentSamples').append(createCollapsible(eventArray['station'],singlMulti, "",eventStr));
	//	setCorrespondingOptions(null,true,'SS');
		if (eventArray['userType'] !== 'Observer') {
			setGroupCheckboxValues('checkboxA', getURIItem('!S&'+stctr+'&A','analysis') );  //VOY POR AQUI
		}
        while (moreContainers) {
        	keyStr = '!C&'+stctr + '&' + letter + '&' + counter;
			

            if (keyStr in ls) {
				console.log('key - currentsets '+keyStr);
/*
				$('#set').append('<p id="sampleLabel'+stctr+letter+counter+'"><strong>Sample ' + counter + '&nbsp;&nbsp;</strong>'+ 
					createButton('Edit', '#sampleParametersPage', "save_data('set','"+letter+"');getContainerDatafromLS('" +keyStr+"','"+eventStr+"');changeSet('" +letter+ "')", 'edit'+counter)+ 
					createButton('View', '#reportPage', "getContainerHTML('" + keyStr + "',\'"+eventArray['station']+"\',\'"+letter+"\',\'"+counter+"\');", 'view' + counter) +
					createButton('Delete','#deleteDialog','deleteDialog(\'0\',\'0\',\''+stctr+'\',\''+letter+'\',\''+counter+'\');','delete'+counter)+'</p>').enhanceWithin();
		*/
	            addSampleButtons(stctr,letter,counter,0);
						
				if (ls.getItem(keyStr) === '') {
					$('#sampleLabel'+stctr+letter+counter).addClass("redColor");
				} 

            }
		    if (counter === SAMPLEQTY) {
		   	   moreContainers = false;
		    }
		    counter++;
        }
		$('#currentShipmentSamples').append("</div"); //el end del collapsible
		//$('#currentShipmentSamples').trigger('create');
		$('#currentShipmentSamples').enhanceWithin();
        $('#set').collapsible();
		
        $('#currentShipmentSamples').collapsibleset({
           	inset: false
        });
				
	} else {
		letterCtr = 65;
		letter = String.fromCharCode(letterCtr);
		
		while (moreSets) {
			counter=1;
			keyStr = '!C&'+stctr+'&'+letter+'&'+counter;
			//console.log('key S '+keyStr);
        	if (keyStr in ls) {
				$('#currentShipmentSamples').append(createCollapsible(eventArray['station'],' Set' +letter,letter,eventStr));
				counter=1;
				moreContainers = true;
        		//setGroupCheckboxValues('checkbox',getURIItem('S&'+stctr+'&'+letter,'analysis'));
				console.log("antes de setgroupcheckboc: "+'!S&'+stctr+'&'+letter); 
				console.log(getURIItem('!S&'+stctr+'&'+letter,'analysis')); 
				////
				////
				//PONER IDS UNICOS A LOS ELEMENTOS DE LOS COLLAPSIBLES
				////
				////
				if (eventArray['userType'] !== 'Observer') {
					setGroupCheckboxValues('checkbox'+letter, getURIItem('!S&'+stctr+'&'+letter,'analysis') ); 
				}
				
//				setGroupCheckboxValues('checkbox','C,SF'); 
				while (moreContainers) {
        			keyStr = '!C&'+stctr+'&'+letter+'&'+counter;
					//console.log('key C '+keyStr);

            		if (keyStr in ls) {
						console.log('key - currentsets '+keyStr);
/*
                		$('#set' + letter).append('<p id="sampleLabel'+stctr+letter+counter+'"><strong>Sample ' + counter + '&nbsp;&nbsp;</strong>'+ 
							createButton('Edit', '#sampleParametersPage', "save_data('set','"+letter+"');getContainerDatafromLS('" +keyStr+"','"+eventStr+ "');changeSet('" + letter + "')", 'edit'+counter)+ 
							createButton('View', '#reportPage', "getContainerHTML('" + keyStr + "',\'"+eventArray['station']+"\',\'"+letter+"\',\'"+counter+"\');", 'view' + counter) +
							createButton('Delete','#deleteDialog','deleteDialog(\'0\',\'1\',\''+stctr+'\',\''+letter+'\',\''+counter+'\');','delete'+counter)+'</p>').enhanceWithin();
							*/
							addSampleButtons(stctr,letter,counter,0);
						if (ls.getItem(keyStr) === '') {
							$('#sampleLabel'+stctr+letter+counter).addClass("redColor");
						}
            		} 
		   			if (counter === SAMPLEQTY) {
		   	   			moreContainers = false;
		   			}					
					counter++;
        		}
				$('#currentShipmentSamples').append("</div"); //el div end del collapsible
				$('#currentShipmentSamples').enhanceWithin();
        		$('#set' + letter).collapsible();
			} //else {
		   	if (letterCtr === SETQTY) {
		   		moreSets = false;
			}
			letterCtr++;
			letter = String.fromCharCode(letterCtr);
			
		}
	}
	
}

function deleteDialog(dialogType,delType, evCounter, letter, containerCounter) {
   $('#dialogDeleteSamples').empty();
   $('#dialogDeleteEvent').empty();
   
    switch (dialogType) {
	  case '0':    
	  	$('#dialogDeleteSamples').append('<h3 class="ui-title">Are you sure you want to delete sample '+containerCounter+'?</h3><p>This action cannot be undone.</p>'+
   		'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="#" data-rel="back">Cancel</a>'+
   		'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="" onclick="deleteSamples(\''+delType+'\',\''+evCounter+'\',\''+letter+'\',\''+containerCounter+'\');" data-transition="flow" data-rel="back">Delete</a>');
		break;
	  case '1':    
	  	$('#dialogDeleteSamples').append('<h3 class="ui-title">Are you sure you want to delete this set?</h3><p>This action cannot be undone.</p>'+
   		'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="#" data-rel="back">Cancel</a>'+
   		'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="" onclick="deleteSamples(\''+delType+'\',\''+evCounter+'\',\''+letter+'\',\''+containerCounter+'\');" data-transition="flow" data-rel="back">Delete</a>');
		break;
	  case '2':   
	   	$('#dialogDeleteEvent').append('<h3 class="ui-title">Are you sure you want to delete event #'+evCounter+'?</h3><p>This action cannot be undone.</p>'+
   		'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="#" data-rel="back">Cancel</a>'+
   		'<a class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" href="" onclick="deleteSamples(\''+delType+'\',\''+evCounter+'\',\'\',\''+containerCounter+'\');" data-transition="flow" data-rel="back">Delete</a>');
		break;
	}
}

//Changes the set and the header
function changeSet(id) {
	//alert("dentro de changeSet. Id = "+id);
	save_data('set', id);
    if ($('#singleOrMulti').val() == 'multi') {
        $('#setHeader').text('Set ' + id);
    } else {
        $('#containersQuantity').val($('#setQuantity').val());
        $('#setHeader').text($('#setQuantity').val() + ' ' + 'single container(s)');
    }
}
/*
function goToNextContainer() {
	var dataLoaded = false;
    console.log('Container counter = ' + containerCounter+" of "+$('#containersQuantity').val());
    if (containerCounter < $('#containersQuantity').val()) {
        $('#sampleParameters2').submit(); //Submit handler takes care of storing data
		$('#sampleLabel'+workingWithThisEvCounter+ls.getItem('#set')+counterCounter).removeClass("redColor");
		containerCounter++;
		if (containerCounter > 1) {
			$('#priorSample').show();
		}
		//set page header
        if (eventArray['singleOrMulti'] == 'multi') {
             $('#sampleParametersPageHeader').text('Set ' + ls.getItem('#set') + ', ' + 'container' + ' ' + containerCounter);
		}else {
             $('#sampleParametersPageHeader').text('Single' + ' ' + 'container' + ' ' + containerCounter);
        }
		var tempKey = '#C&'+workingWithThisEvCounter + '&' + ls.getItem('#set') + '&' + containerCounter;
			
		dataLoaded = getContainerDatafromLS(tempKey,'#E&'+workingWithThisEvCounter);
		if (dataLoaded == false) console.log("new sample...");  else console.log("loading container: "+tempKey); 
    } else {
		$('#sampleParameters2').submit(); //Submit handler takes care of storing data
        if (eventArray['singleOrMulti'] == 'multi') {
   			$.mobile.changePage('#multiSet');//Redirects the page to #multiSet
   		} else{
   			$.mobile.changePage('#MainMenu');//Redirects the page to #MainMenu
		}
	}
	return dataLoaded;
}
*/

//AL EDITAR LOS CONTAINERS NO NECESARIAMENTE VAN EN ORDEN SECUENCIAL
//CORREGOR ESTO
function goToNextContainer() {
	var dataLoaded = false;
	var totalContainerInGroup =1;
	console.log("ADDOREDIT: "+addOrEdit);
	if (addOrEdit === 0) { //adding sample
		totalContainerInGroup =	$('#containersQuantity').val();
		console.log('#addsamplesCounter'+workingWithThisEvCounter+ls.getItem('#set'));
    	console.log('Container counter = ' + containerCounter+" of "+totalContainerInGroup);
	

		if (containerCounter < totalContainerInGroup) {
			$('#sampleParameters2').submit(); //Submit handler takes care of storing data
			$('#sampleLabel'+workingWithThisEvCounter+ls.getItem('#set')+containerCounter).removeClass("redColor");
			containerCounter++;
			if (containerCounter > 1) {
				$('#priorSample').show();
			}
			//set page header
			if (eventArray['singleOrMulti'] == 'multi') {
				 $('#sampleParametersPageHeader').text('Set ' + ls.getItem('#set') + ', container ' + containerCounter);
			}else {
				 $('#sampleParametersPageHeader').text('Single, container ' + containerCounter);
			}
			var tempKey = '!C&'+workingWithThisEvCounter + '&' + ls.getItem('#set') + '&' + containerCounter;
				
			dataLoaded = getContainerDatafromLS(tempKey,'!E&'+workingWithThisEvCounter);
			if (dataLoaded == false) console.log("new sample...");  else console.log("loading container: "+tempKey); 
		} else {
			$('#sampleParameters2').submit(); //Submit handler takes care of storing data
			if (eventArray['singleOrMulti'] == 'multi') {
				$.mobile.changePage('#multiSet');//Redirects the page to #multiSet
			} else{
				$.mobile.changePage('#MainMenu');//Redirects the page to #MainMenu
			}
		}
	} else { //editing sample
		totalContainerInGroup = $('#addsamplesCounter'+workingWithThisEvCounter+ls.getItem('#set')).val();
		console.log('#addsamplesCounter'+workingWithThisEvCounter+ls.getItem('#set'));
    	console.log('Container counter = ' + containerCounter+" of "+totalContainerInGroup);
		containerCounter = parseInt(currentContainerKey.split("&")[3]);
		var yyy = findNextContainerInLS(currentContainerKey);
		
		if (yyy != currentContainerKey ) {
			$('#sampleParameters2').submit(); //Submit handler takes care of storing data
			$('#sampleLabel'+workingWithThisEvCounter+ls.getItem('#set')+parseInt(currentContainerKey.split("&")[3])).removeClass("redColor");
	//		$('#sampleLabel'+workingWithThisEvCounter+ls.getItem('#set')+counterCounter).removeClass("redColor");
			containerCounter++;
			if (containerCounter > 1) {
			//	$('#priorSample').show();
			}
			//set page header
			if (eventArray['singleOrMulti'] == 'multi') {
				 $('#sampleParametersPageHeader').text('Set ' + ls.getItem('#set') + ', container ' + parseInt(yyy.split("&")[3])+ ' of ' + ls.getItem('#containersQuantity'));
			}else {
				 $('#sampleParametersPageHeader').text('Single, container ' + parseInt(yyy.split("&")[3])+ ' of ' + ls.getItem('#containersQuantity'));
			}
			//var tempKey = '#C&'+workingWithThisEvCounter + '&' + ls.getItem('#set') + '&' + containerCounter;
			var tempKey = yyy;
				
			dataLoaded = getContainerDatafromLS(tempKey,'!E&'+workingWithThisEvCounter);
			if (dataLoaded == false) console.log("new sample...");  else console.log("loading container: "+tempKey); 
		} else {
			$('#sampleParameters2').submit(); //Submit handler takes care of storing data
			//if (eventArray['singleOrMulti'] == 'multi') {
			//	$.mobile.changePage('#currentShipmentContainer');//Redirects the page to #multiSet
			//} else{
				$.mobile.changePage('#currentShipmentContainer');//Redirects the page to #MainMenu
			//}
		}	
	
	}
	
	return dataLoaded;
}


function goToPriorContainer() {
	var dataLoaded = false;
    console.log('GOTOPRIORCONTAINER Container counter = ' + containerCounter);
	if (addOrEdit === 0) { //adding sample
			if (containerCounter > 1) {
				$('#sampleParameters2').submit(); //Submit handler takes care of storing data
					containerCounter--;
					if (eventArray['singleOrMulti'] == 'multi') {
						$('#sampleParametersPageHeader').text('Set ' + ls.getItem('#set') + ', container ' + containerCounter+ ' of ' + ls.getItem('#containersQuantity'));
					} else  {
						$('#sampleParametersPageHeader').text('Single, container ' + containerCounter+ ' of ' + ls.getItem('#containersQuantity'));
					}
					var tempKey = '!C&'+workingWithThisEvCounter + '&' + ls.getItem('#set') + '&' + containerCounter;
					console.log("loading container: "+tempKey); 
					dataLoaded = getContainerDatafromLS(tempKey,'!E&'+workingWithThisEvCounter);
			} else {
				console.log("debo mover pagina - "+eventArray['singleOrMulti']);
				$('#sampleParameters2').submit(); //Submit handler takes care of storing data
				if (eventArray['singleOrMulti'] == 'multi') {
					$.mobile.changePage('#multiSet');//Redirects the page to #multiSet
				} else {
					$.mobile.changePage('#MainMenu');//Redirects the page to #MainMenu
				}
			}
	} else {
			var yyy = findPrevContainerInLS(currentContainerKey);
			if (yyy != currentContainerKey ) {
				$('#sampleParameters2').submit(); //Submit handler takes care of storing data
					$('#sampleLabel'+workingWithThisEvCounter+ls.getItem('#set')+parseInt(currentContainerKey.split("&")[3])).removeClass("redColor");
					containerCounter--;
					if (eventArray['singleOrMulti'] == 'multi') {
						$('#sampleParametersPageHeader').text('Set ' + ls.getItem('#set') + ', container ' + parseInt(yyy.split("&")[3])+ ' of ' + ls.getItem('#containersQuantity'));
					} else  {
						$('#sampleParametersPageHeader').text('Single, container ' + parseInt(yyy.split("&")[3])+ ' of ' + ls.getItem('#containersQuantity'));
					}
					var tempKey = yyy;
					//var tempKey = '#C&'+workingWithThisEvCounter + '&' + ls.getItem('#set') + '&' + parseInt(yyy.split("&")[3]);
					console.log("loading container: "+tempKey); 
					dataLoaded = getContainerDatafromLS(tempKey,'!E&'+workingWithThisEvCounter);
			} else {
				console.log("debo mover pagina - "+eventArray['singleOrMulti']);
				$('#sampleParameters2').submit(); //Submit handler takes care of storing data
				//if (eventArray['singleOrMulti'] == 'multi') {
				//	$.mobile.changePage('#multiSet');//Redirects the page to #multiSet
				//} else {
					$.mobile.changePage('#currentShipmentContainer');//Redirects the page to #MainMenu
				//}
			}		
	}
    return dataLoaded;
}




function addOnLogic() {
    if ($('#analysesZ:checked') === true) {
        $('#fullSizeFraction').hide();
    }
}

//addEmptyContainers('#C&'+eventKey.split('&')[1]+'&A&',totalSamplesGroup,addsamplesCounter.val())
function addEmptyContainers(keyName,initialNum) {
    var keyData = keyName.split('&');
	console.log("en addEmptyContainers, reading from: "+"#addsamplesCounter"+keyData[1]+keyData[2]);
	var totNum = parseInt($('#addsamplesCounter'+keyData[1]+keyData[2]).val());
	
	var setKeyString = '!S&'+keyData[1]+'&'+keyData[2];
	//function changeParamByName(href, paramName, newVal) 
	save_eventTags(setKeyString,changeParamByName(ls.getItem(setKeyString),totNum));
	var initial = initialNum;
	var newSamples = totNum - initial;
	console.log("addEmpty..."+keyName+" "+initialNum+" "+totNum);
	
	var h = getHighestLabelInLS(keyName)+1;
	console.log("highest: "+h+" newsamples: "+newSamples);

	for  (var i=h; i<(h+newSamples); i++) {
		save_eventTags(keyName+(i),'');
		addSampleButtons(keyData[1],keyData[2],i,1);
		$('#sampleLabel'+keyData[1]+keyData[2]+i).addClass("redColor");
		console.log('>>>>>#sampleLabel'+keyData[1]+keyData[2]+i);
	}
	if (initialNum != totNum){
		//$('#currentButton').click();
	}
}

function validateEmail(text) {
	console.log("dentro de validateEmail");
	if ($('#loginF').valid()) {
		if( $('#saveCb').is(':checked') ) {
			save_eventTags('login_username', $('#login_username').val());	
		} else {
	
		}
		console.log("email valido");
		console.log("''''Email:"+$('#login_username').val());
		
	setHeaderText('#MainMenuHeader',text);
    if (text == 'Observer') {
		
		$('#loginDialog').enhanceWithin().popup();
		
        $('.hideClass,.div div select ui-block-c,.ui-block-d').hide(); // hides every div containing hide, .div div select ui-block-c and .ui-block-d class
		$('#M2Lab').attr('placeholder', 'Remarks');//Sets the placeholder of the messageToLab text area
		
    } else  {
        $(' .hideClass,.div div select ui-block-c,.ui-block-d').show();// In case of user type change it makes sure the elemnts hidden s up again
        $('#M2Lab').attr('placeholder', 'Message to lab');//Sets the placeholder of the messageToLab text area
    }	
	
	if (window.navigator.onLine) {
	   	console.log("OK connection");

  
	    //console.log("++++"+getStationsList());
		$.ajax({
			type:"GET",
			url:"php/functions2.php",
			data:{email:$('#login_username').val()},
			success: function(data){
					//$('#station').empty();
					console.log('-'+data);
					$('#station').empty();
					$('#station').append(data).enhanceWithin();
					$('#station').change();


					var values = $.map($('#station option'), function(e) { return e.value; });
					if (values.length > 0) {
	    				console.log("...values length > 0: "+values.join(','));	
						if (values[0] == "") {
							console.log("empty values "); 
							
							login(text,1);
							$('#loginDialog').enhanceWithin().popup();
						} else {
							var texts = $.map($('#station option'), function(e) { return e.text; });
							console.log("values: "+texts.join('!'));
							save_eventTags('email&'+$('#login_username').val(),texts);
							$(':mobile-pagecontainer').pagecontainer('change','#MainMenu',{transition: 'fade', reload : false});
						}
						
					} else {
						console.log("...values length = 0");	
					}
			}
		});
		
  		} else { //if connection
			var stationOps = '';
			var key='email&'+$('#login_username').val();
		     if (key in ls) {
		   		var query = ls.getItem(key);
		   		var stns = query.split("!");
				  for (var i=0;i<stns.length;i++) {
    				var pair = stns[i].split(" ");
					if (i==0){
						stationOps='<option value="'+pair[1]+'" selected >'+stns[i]+'</option>';
					} else {
						stationOps=stationOps+'<option value="'+pair[1]+'">'+stns[i]+'</option>';
					}
  				}
				$('#station').empty();
				$('#station').append(stationOps).enhanceWithin();
				$('#station').change();
				$(':mobile-pagecontainer').pagecontainer('change','#MainMenu',{transition: 'fade', reload : false});
			 }
		/*
		  var query = ls.getItem(key);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == itemObj) {
		console.log("getURIItem: "+itemObj+": "+pair[1]);

      return pair[1];
    }
  } 
		*/
	  	console.log("No connection");
	  	//return ("0"); //Means the is no Internet connection
  		}		
		
		/*	
	//$(':mobile-pagecontainer').pagecontainer('change','#MainMenu',{transition: 'fade', reload : false});
	var stationOptions = '';
	stationOptions = getStationsList($('#login_username').val());
	$('#station').empty();
	$('#station').append(stationOptions).enhanceWithin();
	$('#station').change();

	var values = $.map($('#station option'), function(e) { return e.value; });
	if (values.length > 0) {
	    console.log("values length > 0: "+values.join(','));	
		
	} else 
		console.log("values length = 0");	
	if (values[0] == "") console.log("empty values"); 
	console.log("----");
	$('#station option').each(function() {
	   console.log("---- value "+$this.val());
	});
	
	//console.login("Query result: "+stationOptions);
	
	if (stationOptions ==  "0") { //No Internet connection, look for info in localsStorage
		console.log("en query results 0");
		$('#station option').each(function() {
			console.log("values: "+$this.val());
		});
		
	} if (stationOptions == "1") { //empty query results
		console.log("en query results 1");
		login(text,1);
		$('#loginDialog').enhanceWithin().popup();
	} else { //query results
		console.log("en query results");
		//$('#station').append(stationOptions).enhanceWithin();
		//var myOpts = document.getElementById('station').options;
//alert(myOpts[0].value);
		//$('#station option').each(function() {
			//var values = $.map($('#station option'), function(e) { return e.value; });
			//console.log("values: "+values.join(','));
		//	console.log("values: ");
		//});

	} */
	
	
	}
	else {
		console.log("email invalido");
	}
	
	//save_eventTags('login_username', $('#login_username').val());
}
//Determines User type and style the form depending of the type of user.
function login(text,userStatus) {
	console.log("dentro de login");
    save_eventTags('userType', text); //ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b" 
		
	var mesg = 'This email allows you to retrieve the corresponding list of stations.';
	if (userStatus == 1) {
		mesg = '<strong>The selected user does not have any assigned station. Please, type another email.</strong>';
	}
	
	$('#mainLoginDialog').empty();
	
	if (ls.getItem('login_username') === '') {
		//$('#mainLoginDialog').append('<p class="ui-title"><span class="ui-icon ui-btn-icon-' + 'alert' + '" style="float:left; margin:5px 10px 20px 0;"></span>'+mesg+'</p>'+
		$('#mainLoginDialog').append('<p class="ui-title">'+mesg+'</p>'+
	 	'<form id="loginF"><div class="ui-field-contain"><label for="login_username">Email:</label><input type="text" name="login_username" id="login_username" required="true" email="true" /></div>'+
	 	'<div class="ui-field-contain"><label for="saveCb">Do you want to save the email for future use?</label>'+
	 	'<input type="checkbox" name="saveCb" id="saveCb" data-mini="true" onClick="" /></div>'+
	 	'<a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-b ui-btn-icon-left ui-icon-back" data-rel="back">Cancel</a>'+
	 	'<a href="" id="obsButton" onClick="validateEmail(\''+text+'\')" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-d ui-btn-icon-left ui-icon-forward" data-transition="fade">Send</a></form>').enhanceWithin();

	  	console.log("Please, enter email");
	} else {
		$('#mainLoginDialog').append('<p class="ui-title">'+mesg+'</p>'+
		//$('#mainLoginDialog').append('<p class="ui-title"><span class="ui-icon ui-btn-icon-' + 'alert' + '" style="float:left; margin:5px 10px 20px 0;"></span>'+mesg+'</p>'+
	 	'<form id="loginF"><div class="ui-field-contain"><label for="login_username">Email:</label><input type="text" name="login_username" id="login_username" value="'+ls.getItem('login_username')+'" required="true" email="true"/></div>'+
	 	'<div class="ui-field-contain"><label for="saveCb">Do you want to save the email for future use?</label>'+
	 	'<input type="checkbox" name="saveCb" id="saveCb" checked data-mini="true" onClick="" /></div>'+
	 	'<a href="#" class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-icon-left ui-icon-back ui-btn-d" data-rel="back">Cancel</a>'+
	 	'<a href="#" id="obsButton" onClick="validateEmail(\''+text+'\')"  class="ui-btn ui-corner-all ui-shadow ui-btn-inline ui-btn-d ui-btn-icon-left ui-icon-forward" data-transition="fade">Go!</a></form>').enhanceWithin();	
	}
	/*
	setHeaderText('#MainMenuHeader',text);
    if (text == 'Observer') {
		
		$('#loginDialog').enhanceWithin().popup();
		
        $('.hideClass,.div div select ui-block-c,.ui-block-d').hide(); // hides every div containing hide, .div div select ui-block-c and .ui-block-d class
		$('#M2Lab').attr('placeholder', 'Remarks');//Sets the placeholder of the messageToLab text area
		
    } else if (text !== 'Observer') {
        $(' .hideClass,.div div select ui-block-c,.ui-block-d').show();// In case of user type change it makes sure the elemnts hidden s up again
        $('#M2Lab').attr('placeholder', 'Message to lab');//Sets the placeholder of the messageToLab text area
    }
	console.log("++++"+getStationsList());
	//$('#stations').append(getStationsList()).enhanceWithin();*/
}

function setHeaderText(obj,txt) {
  $(obj).text(txt);
}

function updateHeaderText(pageid) {
	if (pageid==='MainMenu') {
		//alert("pageid for update es: "+pageId+" variable "+localStorage.getItem('#userType'));
		if (ls.getItem('userType') !== null) {
        	setHeaderText('#MainMenuHeader',localStorage.getItem('userType'));
    	} 
	}	// $('#page2Header').text(ls.getItem('#' + id));	
	
	if (pageid==='page2') {
		//alert("pageid for update es: "+pageId+" variable "+localStorage.getItem('#userType'));
		if (ls.getItem('#sampleType') !== null) {
        	//setHeaderText('#page2Header',"Adding Samples");
			switch(localStorage.getItem('#sampleType')) {
			  case 'SS': setHeaderText('#page2SubHeader','Suspended Sediment'); break;
			  case 'BM': setHeaderText('#page2SubHeader','Bottom Material'); break;
			  case 'BL': setHeaderText('#page2SubHeader','Bedload'); break;
			}
			//setHeaderText('#page2SubHeader',localStorage.getItem('#sampleType'));
    	} 
	}	
}

//Get the form data of past unfinished forms(i.e Current Samples).
function getContainerDatafromLS(key,eventKey) {
	var dataLoaded = false;
	
	eventArray = getURIArray(eventKey);
	currentContainerKey = key;
	
	console.log("+++en getContainerDatafromLS: "+key);
	keysplit = key.split('&');
	containerCounter = parseInt(keysplit[3]); //getURIItem(setKey,'containersQuantity')
	
	//fill containersQuantity to have info on total samples in set
	$('#containersQuantity').val(parseInt(getURIItem('!S&'+keysplit[1]+'&'+keysplit[2],'containersQuantity')));
	save_data('containersQuantity',$('#containersQuantity').val());
	console.log("+++"+keysplit[2]+" "+containerCounter); //set or group letter
	if (eventArray['singleOrMulti'] === 'single') {
		save_data('setQuantity',$('#containersQuantity').val());
	}
	//getGroupCheckboxValues('analysis',false);----
//	if (eventArray['userType'] !== 'Observer') {
//		setGroupCheckboxValues('analysis', getURIItem('!S&'+keysplit[1]+'&'+keysplit[2],'analysis') ); 
//	}	
	
	
	if(eventArray['singleOrMulti']!=='single'){
		$('#sampleParametersPageHeader').text('Set ' + String(keysplit[2]) + ', container ' + containerCounter+ ' of ' + ls.getItem('#containersQuantity'));
	}else{
		$('#sampleParametersPageHeader').text('Single, container ' + containerCounter+ ' of ' + ls.getItem('#containersQuantity'));
	}
    
	fillSelect(eventArray['sampleType']);
	console.log("+++singleOrMulti: "+eventArray['singleOrMulti']+" sampleType: "+eventArray['sampleType']); 
	
	if (key in ls) {
		var query = ls.getItem(key);//looks for  the key in localStorage
		if (query === '') {
			console.log("+++datafromLS: empty EvtDate: "+eventArray['evtDate']);
			$('#beginDate').val(eventArray['evtDate']);
		} else {
    		var data = query.split("&");//search and split each element in the local storage by '&' delimiter 
			//console.log("data en Json: "+query);
    		for (var i = 0; i < data.length; i++) {
        		var item = data[i].split("=");
				$("#" + item[0]).val(item[1]);
				console.log("#"+item[0]+" = "+$("#" + item[0]).val()+" "+$("#" + item[0]).attr('type'));
			}
			dataLoaded = true;
		}
	}
    return dataLoaded;
}
//Count Elements in local storage
function countElementsInLS(valString) {
	var counter = 0;

    for (i=0; i< ls.length; i++) {
	    if (ls.key(i).indexOf(valString)!== -1) {
			 counter++;
		}
	}
 	return counter;	
}


function getHighestLabelInLS(valString) {
	var highest = 0;
	var tempNum=0;
	var data;

    for (i=0; i< ls.length; i++) {
	    if (ls.key(i).indexOf(valString)!== -1) {
			 data = ls.key(i).split("&");
			 tempNum = parseInt(data[3]);
			 if (tempNum >= highest)
			 	highest = tempNum;
		}
	}
 	return highest;	
}

function findNextContainerInLS(valString) {
	console.log("FIND NEXT OF: "+valString);
	var xxxCounter = parseInt(valString.split("&")[3]);
	var partKey = valString.split("&")[0]+'&'+valString.split("&")[1]+'&'+valString.split("&")[2]+'&';
		console.log("PARTIAL: "+partKey);
	//currentContainerKey.split("&")[3]
	var highest = 0;
	var tempNum=0;
	var data;
    var xxx1 = valString;
    var cc = xxxCounter;
	while (cc <= 40) {
		cc++;
		xxx1 = partKey+cc;
		if (xxx1 in ls) {
			return xxx1;
		}
		
	}
 	return valString;	
}
function findPrevContainerInLS(valString) {
	console.log("FIND PRIOR OF: "+valString);
	var xxxCounter = parseInt(valString.split("&")[3]);
	var partKey = valString.split("&")[0]+'&'+valString.split("&")[1]+'&'+valString.split("&")[2]+'&';
		console.log("FIND2: "+partKey);
	//currentContainerKey.split("&")[3]
	var highest = 0;
	var tempNum=0;
	var data;
    var xxx1 = valString;
    var cc = xxxCounter;
	while (cc >0) {
		cc--;
		xxx1 = partKey+cc;
		if (xxx1 in ls) {
			return xxx1;
		}
		
	}
 	return valString;	
}

//Method for deleting sets, groups, samples, and events
function deleteSamples(delType, evCounter, letter, contCounter) {
	var tempKey="";
	//var letter =  String.fromCharCode(letterCtr);
	var moreSets = true;
	var moreCountainers = true;
	var counter = 0;
    var ii=0;
	switch (delType) {
	  case '0': //del one sample - group (single)
			tempKey = '!C&'+evCounter + '&'+letter+'&' + contCounter;
              
		    for (i=0; i< ls.length; i++) {
			    if (ls.key(i).indexOf("!C&"+evCounter + '&'+letter)!== -1) {
					 counter++;
				}
			}
			if (counter > 1) {
	  			if (tempKey in ls) {
					ls.removeItem(tempKey);
					console.log('Deleting sample: ' +tempKey );
					//createCurrentSets(evCounter,'single');
				}
			 } else {
				 alert("groups can not be empty. Please delete the group instead");
			 }			
		//sampleLabel'+stctr+letter+counter
		
		//addsamplesCounter'+eventKey.split('&')[1]+'A"
			var ttt = $('#addsamplesCounter'+evCounter+letter).val();
			if (ttt != 1) { 
				$('#addsamplesCounter'+evCounter+letter).val(ttt-1);
				$('#sampleLabel'+evCounter+letter+contCounter).remove();
			}
	      	break;
	  case '1': //del sample - Set
		    for (i=0; i< ls.length; i++) {
			    if (ls.key(i).indexOf("!S&"+evCounter)!== -1) {
					 counter++;
				}
			}		
			if (counter > 1) {
				 for (var key in ls) {
		     	//for (i=0; i< ls.length; i++) {
			    	if (key.indexOf("!C&"+evCounter + '&'+letter)!== -1) {
					 console.log("deleting container: "+key);
					 ls.removeItem(key);
					}	
			    	if (key.indexOf("!S&"+evCounter + '&'+letter)!== -1) {
					 console.log("deleting group/set: "+key);
					 ls.removeItem(key);
					}	
					createCurrentSets(evCounter,'MULT');
				}
			 } else {
				 alert("event can not be without sets/group. Please delete the event instead");
			 }	
	      	break;		
			
	  case '2':	//del Event Single	   
		    for (var key in localStorage) {
			    if (key.indexOf("!C&"+evCounter)!== -1) {
					 console.log("deleting container: "+key);
					 ls.removeItem(key);
				}
			    if (key.indexOf("!S&"+evCounter)!== -1) {
					 console.log("deleting group/set: "+key);
					 ls.removeItem(key);
				}	
			    if (key.indexOf("!E&"+evCounter)!== -1) {
					 console.log("deleting event: "+key);
					 ls.removeItem(key);
				}							
			}
			$('#currentButton').click();
	      	break;	
	}
	
}

//function createReport(key, stn, setgroup, contNum) {
  function getContainerHTML(key, stn, setgroup, contNum) {
    //getContainerXML(key, stn, setgroup, contNum);
	$('#reportTable').empty();
	
    var query = ls.getItem(key);
    var data = query.split("&");
	var analyses= [];
    							//SETGROUP ES LETRA, NO SINGLE STRING			
	if (eventArray['singleOrMulti'] === "single")				
    	$('#reportHeader h3').text(stn+" Single Sample "+contNum);
	else 
		$('#reportHeader h3').text(stn+" Set "+setgroup+" Sample "+contNum);
    //alert("inicio: "+$('#reportPage').html());
    var table = $('#reportTable'); 
    table.append('<thead><tr><th>Description</th><th>Value</th><th data-priority="1">Remark</th><th data-priority="2">Method</th><th data-priority="3">Null Qualifier</th></tr></thead><tbody></tbody>');

    for (var i = 0; i < data.length; i++) {
		
        var item = data[i].split("=");
		
		
		if(item[1] === '+' || item[1] ===''){
		}else{
		switch(item[0]){
			
			case 'method':
//				table.append('<tr><td>Method</td><td>' + String(item[1]) + '</td><td></td><td></td><td></td></tr>'); 
                table.last("tr").append('<tr><td>Method</td><td>' + String(item[1]) + '</td><td></td><td></td><td></td></tr>'); 
				break;
				
			case 'containersQuantity':
				table.last("tr").append('<tr><td>Container Quantity</td><td>' + String(item[1]) + '</td><td></td><td></td><td></td></tr>');
				break;
				
				
			case 'compositeOrIndividual':
				if(item[1] === 'composite'){
					table.last("tr").append('<tr><td>Composite</td><td>true</td><td></td><td></td><td></td></tr>');
				}else{
					table.last("tr").append('<tr><td>Composite</td><td>false</td><td></td><td></td><td></td></tr>');
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
				if($('#eventTD').length > 0){
					$('#eventTD,#eventTDR').empty();
					$('#eventTD').text('Event');
					$('#eventTDR').text(item[1]);
				}else{
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
			
				if(analyses.length === 0){
					analyses.push(item[1]);
					table.last("tr").append('<tr><td id="analysesTD">' + 'Analysis' + '</td><td id="analysesTDR">' + analyses + '</td><td></td><td></td><td></td></tr>');
				}else{
						if(item[1] in analyses){
							}else{
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
				table.last("tr").append('<tr><td>' + 'Begin time' + '</td><td>' + item[1].replace('%3A',':') + '</td><td></td><td></td><td></td></tr>');
				break;
			case 'timeDatum':
				table.last("tr").append('<tr><td>' + 'Time datum' + '</td><td>' + item[1] + '</td><td></td><td></td><td></td></tr>');
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
				table.last("tr").append('<tr><td>Sampling depth</td><td>' + item[1]+' ft</td></tr>');
				break;
			case 'P00003R':
				table.last("tr").last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P00004':
				table.last("tr").append('<tr><td>Stream width</td><td>' + item[1]+' ft</td></tr>');	
				break;
			case 'P00004R':
				table.last("tr").last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P00064':
				table.last("tr").append('<tr><td>Mean depth of stream</td><td>' + item[1]+' ft</td></tr>');
				break;
			case 'P00064R':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'M2Lab':
				table.last("tr").append('<tr><td>Message to lab</td><td>' +item[1]+' ft</td></tr>');
				break;
			case 'P00061':
				table.last("tr").append('<tr><td>Instantaneous discharge</td><td>' + item[1]+' cfs</td></tr>');
				break;
			case 'P00061R':
			case 'P00061M':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;	
			case 'P00010':
				table.last("tr").append('<tr><td>Water temperature</td><td>' + item[1]+String.fromCharCode(176)+'C</td></tr>');
				break;
			case 'P00010R':
			case 'P00010M':
			case 'P00010N':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P00063':
				table.last("tr").append('<tr><td>Number of sampling points</td><td>' +item[1]+' </td></tr>');
				break;
			case 'P00063R':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P00020':
				table.last("tr").append('<tr><td>Air temperature</td><td>' +item[1]+String.fromCharCode(176)+'C</td></tr>');
				break;
			case 'P00020R':
			case 'P00020M':
			case 'P00020N':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P00065':
				table.last("tr").append('<tr><td>Gage height</td><td>' + item[1]+' ft</td></tr>');
				break;
			case 'P00065R':
			case 'P00065M':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P00095':
				table.last("tr").append('<tr><td>Specific conductance</td><td>' + item[1]+' per cm at 25'+String.fromCharCode(176)+'C</td></tr>');
				break;
			case 'P00095R':
			case 'P00095M':
			case 'P00095N':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P63675':
				table.last("tr").append('<tr><td>Turbidity</td><td>' + item[1]+' NTU, 400-600nm, 90'+String.fromCharCode(177)+'30'+String.fromCharCode(176) +'</td></tr>');
				break;
			case 'P63675R':
			case 'P63675M':
			case 'P63675N':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P63676':
				table.last("tr").append('<tr><td>Turbidity</td><td>' + item[1]+' NTU,400-600nm, multiple angles</td></tr>');
				break;
			case 'P63676R':
			case 'P63676M':
			case 'P63676N':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P63680':
				table.last("tr").append('<tr><td>Turbidity</td><td>' + item[1]+' NTU,780-900nm,90'+String.fromCharCode(177)+'2.5'+String.fromCharCode(176) + '</td></tr>');
				break;
			case 'P63680R':
			case 'P63680M':
			case 'P63680N':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P65225':
				table.last("tr").append('<tr><td>Transparency, transparecy tube</td><td>' + item[1]+' cm</td></tr>');
				break;
			case 'P65225R':
			case 'P65225M':
			case 'P65225N':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P30333':
				table.last("tr").append('<tr><td>Bag mesh, bedload sampler</td><td>' + item[1]+' mm</td></tr>');
				break;
			case 'P30333R':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P04117':
				table.last("tr").append('<tr><td>Thether line used for collecting sample</td><td>' + item[1]+'</td></tr>');
				break;
			case 'P04118':
				table.last("tr").append('<tr><td>Composite samples in cross-sectional bedload measurement</td><td>' + item[1]+'</td></tr>');
				break;
			case 'P04119':
				table.last("tr").append('<tr><td>Vertical in composite sample</td><td>' + item[1]+' s</td></tr>');
				break;
			case 'P04120':
				table.last("tr").append('<tr><td>Rest time on bed for Bedload sample</td><td>' + item[1]+' s</td></tr>');
				break;
			case 'P04120R':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P04121':
				table.last("tr").append('<tr><td>Horizontal width of vertical</td><td>' + item[1]+' ft</td></tr>');
				break;
			case 'P04121R':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;	
			case 'P82073':
				table.last("tr").append('<tr><td>Starting time</td><td>' + item[1]+'</td></tr>');
				break;
			case 'P82073R':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;
			case 'P82074':
				table.last("tr").append('<tr><td>Ending time</td><td>' + item[1]+'</td></tr>');
				break;
			case 'P82074R':
				table.last("td").append('<td>' + item[1] + '</td>');
				break;	
		
        }
		
     //   console.log('createReport(): Excuted');
    }
	//Checks for table data containing '+' values (+ = null) and remove from table to optimize space
	//$('#reportTable tr td:contains('+')').each(function(index, element) {
      //      if($(this).text() === '+'){
		//		$(this).parent().remove();	
			//	console.log('removed');
			//}
      //  });
 }		 
   // $('#reportTable tr:odd').css("background-color", '#9FF'); //paints odd rows with cyan 
   $('#reportTable tr:odd').css("background-color", '#e9e9e9'); //paints odd rows with cyan 
//  $('#reportTable').trigger("create");;
}


function xmlToString($xmlObj) { 

    var xmlString="";
    $xmlObj.children().each(function(){
        xmlString+="<"+this.nodeName+">";
        if($(this).children().length>0){
            xmlString+=getXmlString($(this));
        }
        else
            xmlString+=$(this).text();
        xmlString+="</"+this.nodeName+">";
    });
  //  return xmlString;
	console.log(xmlString);
   alert(xmlString);
}   

//---------------------------------
//Checks the local storage and create a user friendly report of the data stored
//key, station, string of SNGL or letter or SET, container counter
function getURIItem(key,itemObj) {
	
  var query = ls.getItem(key);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    if (pair[0] == itemObj) {
		console.log("getURIItem: "+itemObj+": "+pair[1]);

      return pair[1];
    }
  }    
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


function updateURIItem(key,paramName,paramValue) {
	var url = ls.getItem(key);
    if (url.indexOf(paramName + "=") >= 0) {
        var prefix = url.substring(0, url.indexOf(paramName));
        var suffix = url.substring(url.indexOf(paramName));
        suffix = suffix.substring(suffix.indexOf("=") + 1);
        suffix = (suffix.indexOf("&") >= 0) ? suffix.substring(suffix.indexOf("&")) : "";
        url = prefix + paramName + "=" + paramValue + suffix;
    }
    else{
    if (url.indexOf("?") < 0)
        url += "?" + paramName + "=" + paramValue;
    else
        url += "&" + paramName + "=" + paramValue;
    }
    //window.location.href = url;
	alert("new url : "+url);
	save_eventTags(key,url);

}

function getEventXML(eKey){
	console.log("en getEventXML");
	//eventkey
	eventArray = getURIArray(eKey); 
	var eKeyData = eKey.split('&');
//	var eItemQuery = ls.getItem(eKey);
 //   var eItemData = eItemQuery.split("&");
	var eCtr = eKeyData[1];
	
	var setKey = '';
	var setData = '';
	var cKey = '';
	var cData = '';
	
	var moreSets = true;
	var sKey = '';
	nodeStr = '';
    var letterCtr = 65;
	var letter = String.fromCharCode(letterCtr);
	var counter = 0;

	var keyStr = '';

    var node = "";
   // createContent('<root><Source><SoftwareName>sedwe</SoftwareName><version>0.8</Version><Email></Email><Role></Role></Source><Event><Set><Sample></Sample></Set></Event></root>',0);
//   createContent('<root><Event><Set><Sample></Sample></Set></Event></root>',0);
   	createContent('<root><Event></Event></root>',0);

	nodeStr='<EventNumber>' + eKeyData[1] + '</EventNumber>';
	nodeStr='<SiteId>' + eventArray['station'] + '</SiteId>';	
	nodeStr='<AgencyCd>' + 'USGS' + '</AgencyCd>';	
	nodeStr='<SiteNm>' + 'sitename' + '</SiteNm>';	
	nodeStr='<SedTranspMode>' + eventArray['sampleType'] + '</SedTranspMode>';
	nodeStr='<SmplMediumCode>' + eventArray['sampleType'] + '</SmplMediumCode>';
	nodeStr='<AvgRepMeasures>' + 'null' + '</AvgRepMeasures>';
	addNode("Event",nodeStr,"AvgRepMeasures",0,null,0);
	
	while (moreSets) {
		
		    setKey = '!S&'+eCtr+'&'+letter;
			console.log("SET: "+setKey);
		
			counter=1;
			//console.log('key S '+keyStr);
        	if (setKey in ls) { //is in localstorage??
				setData = ls.getItem(setKey); //find set content
				if (eventArray['singleOrMulti']=='single') {
					nodeStr = '<Name>SNGL</Name>';
				} else {
					nodeStr = '<Name>'+letter+'</Name>';
				}
				addNode("Event","<Set>"+nodeStr+"<NumberOfSamples>"+getURIItem(setKey,'containersQuantity')+"</NumberOfSamples></Set>","Set",0,null,0);
//				addNode("Set",,"NumberOfSamples",0,null,0);
	//			addNode("Set",'<AnalyzeIndSamples></AnalyzeIndSamples>',"AnalyzeIndSamples",0,null,0);
	//			addNode("Set",'<Analysis>'+getURIItem(setKey,'analysis')+'</Analysis>',"Analysis",0,null,0);
	//			addNode("Set",'<SetType></SetType>',"SetType",0,null,0);
				
				
				counter=1;
				moreContainers = true;
        		while (moreContainers) {
        			keyStr = '!C&'+eCtr+'&'+letter+'&'+counter;
					//console.log('key C '+keyStr);

            		if (keyStr in ls) {
						getContainerXML(keyStr);
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
	//alert(getXMLString());
	sendEmailContent(getXMLString(),eventArray['station']);
	console.log("STATION EMAIL: "+eventArray['station']);
	alert("Email sent");
	//return eStr;
}

//function getContainerXML(key, stn, setgroup, contNum) {
	function getContainerXML(key) {
	var xmlc = "";
    var query = ls.getItem(key);
    var data = query.split("&");
	var analyses= [];

    var node = "";
    //createContent('<root><Source></Source><Event><Set><Sample></Sample></Set></Event></root>',0);
	//createContent('<Sample></Sample>',0);
	addNode("Set","<Sample></Sample>","Sample",0,null,0);
	
    for (var i = 0; i < data.length; i++) {
		
        var item = data[i].split("=");
		
		if(item[1] === '+' || item[1] ===''){
		
		}else{
		switch(item[0]){
			
			case 'beginDate':
				xmlc=xmlc+'<beginDate>' + decodeURIComponent(item[1]) + '</beginDate>';
				node='<beginDate>' + decodeURIComponent(item[1]) + '</beginDate>';
				addNode('Sample',node,item[0],0,null,0);
				break;
				
			case 'beginTime':
				xmlc=xmlc+'<beginTime>'+ item[1].replace('%3A',':') + '</beginTime>';
				node  = '<beginTime>'+ item[1].replace('%3A',':') + '</beginTime>';
				addNode('Sample',node,item[0],0,null,0);
				break;
			case 'timeDatum':
				node='<timeDatum>' + item[1] + '</timeDatum>';
				addNode('Sample',node,item[0],0,null,0);
				break;
			case 'collectingAgency':
				xmlc=xmlc+'<Agency>' + item[1] + '</Agency>';
				break;
			case 'collectorsInitials':
				xmlc=xmlc+'<initials>' + item[1] + '</initials'; break;
			case 'containerNum':
				xmlc=xmlc+'<ContainerNumber>' + item[1] + '</ContainerNumber>'; break;
			case 'HSTAT':
				xmlc=xmlc+'<HSTAT>' + item[1] + '</HSTAT>'; break;
			case 'STYPE':
				xmlc=xmlc+'<STYPE>' + item[1] + '</STYPE>'; break;
			case 'ASTAT':
//				alert( $('#ASTAT').find('option[value="'+item[1]+'"]').text() );
				//table.append('<tr><td>' + 'Analysis status' + '</td><td>' + item[1] + '</td></tr>');
				xmlc=xmlc+'<ASTAT>' + item[1] + '</ASTAT>';
	//			table.append('<tr><td>' + 'Analysis status' + '</td><td>' + $('#ASTAT').find('option[value="'+item[1]+'"]').text() + '</td></tr>');
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
				addNode("Name", node,'Rmrk',1,item[0].substring(0,item[0].length - 1),0);
				break;
			case 'M2Lab':
				node='<M2LAB>' + item[1].replace(/\+/g, ' ') + '</M2LAB>';
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
				addNode("Name",node,'Method',1,item[0].substring(0,item[0].length - 1),0);
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
				break;
			
        }

    }

 }
   //      alert(xmlc);
		 return getXMLString();
}


//----------------------------------------------------
function changeParamByName(href, newVal) {
var reExp = /containersQuantity=\d+/;
var newUrl = href.replace(reExp, "containersQuantity=" + newVal);
	return newUrl;
	}
	 
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
      };
	}
	return 'NOT SUPPORTED';
}


//Update icon if user added data in the dialog window. Otherwise the icon will be
//minus, indicating that nothing has been entered in the dialog.
function anyChangeInPopupData(objName,anyNull) {
	var partial = false;
	var tempObj = "#"+objName+"R";
	
	if ($(tempObj).val() !== " ") {
		partial = true;
	}
	tempObj = "#"+objName+"M";
	if ($(tempObj).val() !== " ") {
		partial = true;
	}
	
	if (anyNull === 1) {
		tempObj = "#"+objName+"N";
		if ($(tempObj).val() !== " ") {
			partial = true;
		}
	}

//alert("partial: "+partial);
	if (partial === false) {
    	$('#popup'+objName).attr('data-icon','minus');
    	$('#popup'+objName).removeClass('ui-icon-plus').addClass('ui-icon-minus');
	}
	else {
    	$('#popup'+objName).attr('data-icon','plus');
    	$('#popup'+objName).removeClass('ui-icon-minus').addClass('ui-icon-plus');
	}
	

}


/*
$('#P00061back').click(function() {
	alert("en funcion");
	anyChangeInPopupData(1);
 //   $('#popupP61').attr('data-icon','star');
 //   $('#popupP61').removeClass('ui-icon-grid').addClass('ui-icon-star');
});	
*/
	$(function(){
$(window).bind("resize",function(){
    console.log($(this).width())
    if($(this).width() <600){
    $('.xxx').addClass('ui-btn-icon-notext')
	
    }
    else{
    $('.xxx').removeClass('ui-btn-icon-notext')
    }
})
	})
	
 function clearFormVariablesFromLS() {
	 
	var ii = 0;
	for(var key in localStorage) {
      // console.log(':: '+ii+" "+key);
	   if (key.charAt(0) === '#') {
	   		ls.removeItem(key);
			console.log('::removed '+key);
	   }
	   ii++;
    }	 
 }
//Loads localStorage to set defaults 

function resetForm($form) {
	console.log("resetting form");
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
}

	//increment event counter, when needed. If no data has been entered at all, do not increment	
	function setEventCounter () {
		
		var keyStr = '!E&'+eventCounter; //evaluating current event
		console.log("evaluating "+keyStr);
		clearFormVariablesFromLS();
		
		//CLEAREAR LOS VALORES DEL FORM EN SI
		$('#sampleProperties')[0].reset();
		$('#analysesForm')[0].reset();
		$('#sampleParameters')[0].reset();
		$('#sampleParameters2')[0].reset();
		$('#setAtributesForm')[0].reset();
		if ($('#editAnalysisForm').length) {
			console.log("AnalysisForm exists - reset");
			$('#editAnalysisForm')[0].reset();
		} else {
			console.log("AnalysisForm does not exist");
		}
		
		//$('#evtDate').val('');
		if (keyStr in ls) { //if event exists in local storage
			if (ls.getItem(keyStr)==='') {//if event with nodata, keep same EC 
				console.log("Esta vacio");
				
			}
			else { //if event has data, create new event counter
				console.log("hay data");
				eventCounter++;
				save_eventTags("!EC",eventCounter);
				
			}
		} else { //if event does not exist, save it
			save_eventTags("!EC",eventCounter);
		}
		console.log("Current event key is: !E&"+eventCounter);
		addOrEdit=0;
	 }

$(window).on('beforeunload', function(){

	console.log('user is leaving...');
	
});	 

$(window).on('load', function(){
//	var loc = $(location).attr('href');
	
//	alert("location: "+loc);
 console.log("windows onload function");

});
	

	 
$(document).ready(function (e) {
    //login(ls.getItem('#userType'));
    //ls.clear();
    //console.log(appCache.status);
	//alert("dentro de document ready");
    if (checkCache() === 'UPDATEREADY') {
        window.applicationCache.update();
    }
	
	
    initialize()
	$('.setLabel').hide();


 	var param = document.URL.split('#')[1];

	if (param == null) {
		//alert("en index.html");
	} else {
		switch (param) {
			
			case 'MainMenu': 
			case 'newEvent': 
			case 'page2': //alert("station:"+ls.getItem('#station'));//load event information. 
			//alert("sampleMediumen LS:"+ls.getItem('#sampleMedium'));
			/*
						fillSelect (ls.getItem('#sampleType')); 
						//alert("valor en la lista previo al cambio:"+	$('#sampleMedium').val());		
						$('#station').val(ls.getItem('#station')); 
						$('#sampleMedium').val(ls.getItem('#sampleMedium'));
						$('#evtDate').val(ls.getItem('#evtDate')); 
						$('#EVENT').val(ls.getItem('#EVENT'));  //$('#EVENT').change();
						eventCounter = ls.getItem("#EC");
						$('#singleOrMulti').val(ls.getItem('#singleOrMulti'));
						$('#setQuantity').val(ls.getItem('#setQuantity'));

 						setCorrespondingOptions('sampleType',false)						
*/
						break;
			case 'MainMenu': //alert("#MainMenu"); 
							break;
			case 'sampleProperties': //alert("sampleProperties"); 
						break;

		}
		fillSelect (ls.getItem('sampleType')); 
 		setCorrespondingOptions('sampleType')
		$('#multiAtributes').hide();
		//load event, page refreshed
	}


});