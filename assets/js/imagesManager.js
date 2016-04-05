$(document).ready(function (e) {
	var imgBase64;
	var date = new Date();
	
	//Verify if file is .gif,.jpeg,.jpg,.png and returns true if it is and false if it's not.
	function imgUpload(fileName){
			
		var allowed_extensions = new Array("jpg","png","gif","jpeg");
		var file_extension = fileName.split('.').pop(); // split function will split the filename by dot(.), and pop function will pop the last element from the array which will give you the extension as well. If there will be no extension then it will return the filename.
		// compare with every extension in the allowed extensions array...
		for(var i = 0; i <= allowed_extensions.length; i++){
			//if this extension is valid return true
			if(allowed_extensions[i]==file_extension){
				return true; // valid file extension
			}
		}
		return false;
	}
	
	//Reads the path to the picture for a preview 
	function readURL(input) {
		if (input.files && input.files[0]) { //if file exist
			var reader = new FileReader(); //new instance of the file reader
			//console.log('1: '+ new Date().getTime());
			reader.onload = function (e) { //when the reader loads the chosen file...
				//console.log('2: '+ new Date().getTime());
				imgToBase64(e.target.result, function (dataURL) { //..then the is converted 
					//console.log('9: '+ new Date().getTime());
					setDataURL(dataURL);
					//console.log('10: '+ new Date().getTime());
				});
								
			}
			reader.readAsDataURL(input.files[0]);
		}
	}
	
	//Sets the imgBase64 value to the base64 string
	function setDataURL(dataURL){
		imgBase64 = dataURL.replace(/data:image[^;]+;base64,/,'');
		console.log('setDataUrl=>'+imgBase64);
	}


	//Converts file upload in a base64 string
	function imgToBase64(url, callback, outputFormat) {
		var canvas = document.createElement('CANVAS'); //Creates variable containing canvas in the DOM
		var canvas_context = canvas.getContext('2d'); //Creates canvas environment (context) in 2 dimensions 
		var img = new Image; // new Image instance
		console.log('3: '+ new Date().getTime());
		img.crossOrigin = 'Anonymous'; //Cross origin textures from other URL's are permitted (see http://blog.chromium.org/2011/07/using-cross-domain-images-in-webgl-and.html) for more information
		//console.log('4: '+ new Date().getTime());
		//Image load trigger, encode image into base64
		img.onload = function () {
			//console.log('5: '+ new Date().getTime());
			//Determine canvas height and width 
			canvas.height = img.height;
			canvas.width = img.width;
			//console.log('Canvas info:\n Height: ' + canvas.height + '\n Width: ' + canvas.width);
			console.log('6: '+new Date().getTime());
			//Draws the image raw format 
			canvas_context.drawImage(img, 0, 0);
			//console.log('7: '+new Date().getTime());
			var dataURL = canvas.toDataURL(outputFormat || 'image/png'); //THIS IS WHERE THE MAGIC HAPPENS (img encode to base64)		
			//imgBase64 = dataURL;
			$('#show-picture, #imgPreview').attr('src', dataURL); //Change source of the #show-picture image tag to the base64 string to show preview to user 
			//console.log('8: '+ new Date().getTime());
			//console.log(dataURL);
			
			callback.call(this, dataURL); //Callback function @param {dataURL} 
			// Clean up
			console.log('11: '+ new Date().getTime());
			canvas = null;
		};
		img.src = url;
		//console.log('12: '+ new Date().getTime());
	}

	
	$('#takePicture').change(function () {
		$('#pictureManagerFeedback').html('');
		//If the source attribute contains information from previous uploads, reset.
		if($('#show-picture').attr('src')){
			$('#show-picture').attr('src','');
		}
		
		//Validate if its a picture or image.
		if(imgUpload($(this).val())){
			readURL(this);
			console.log('ONLOAD'+imgBase64);
		}else{
			$('#takePicture').val('');
			alert('Please select a valid extension');	
			//return;
		}
	});
	
		
		//On click of submitImgBtn open confirm dialog
	$('#submitImgBtn').on('click',function(){ 
		
	//If no comment is added input 'No comment added' on <p id='commentPreview></p> on the #popupDialog
		if($('#imgComment').val() == '' || $('#imgComment').val() == 'undefined' || $('#imgComment').val() == null){
			$('#commentPreview').html('No comment added');
		}else{
			$('#commentPreview').html($('#imgComment').val());
		}
		
		if($('#takePicture').val() == 'undefined' || $('#takePicture').val() == null || $('#takePicture').val() == ''){
			$('#pictureManagerFeedback').html('*Please choose an image');
			
		}else{
			$('#popupDialog').popup('open', {
            transition: 'pop'
        	});
		}
		
		
	});
	
	
	//On confirming , upload to mailer.php and generate email
	$('#uploadImgBtn').on('click',function(){
		var uemail = window.localStorage.getItem('login_username');
		console.log("usuario es: "+uemail);
		$.mobile.loading('show',{
			text:'Uploading Picture',
			textVisible:true
			});
		$.ajax({
			type:"POST",
			url:"../../includes/mailer.php",
			data:{dataURL:imgBase64.replace(/data:image[^;]+;base64,/,''),comment:$('#imgComment').val(),email:uemail},
			success: function(data){
				console.log('14: '+ new Date().getTime());
				//console.log('response: '+data);
				$('#imgComment').val('');
				$('#takePicture').val('');
				$('#show-picture').attr('src','');
				$.mobile.loading('hide');
				}
			});
	});
	
	
});