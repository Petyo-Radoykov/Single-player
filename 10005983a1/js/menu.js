function loginLink() {
	// create the div
	var box = $('<div></div>').addClass("darkCover");
	
	//make first child to the body
	$("body").prepend(box);
	box.fadeTo("fast", 0.6);
	
	//create the content
	var content = $('<div></div>').addClass("darkContent");
	
	//prepend the content
	$("body").prepend(content);
	content.fadeTo("fast", 1);
	
	/************************************************/
	/************************************************/
	/************************************************/
		var beep = $("#beep")[0];
		
		//Add white background on top of the transparent container
		var whiteContainer = $('<div></div>').addClass("whiteContainer");
		$(content).prepend(whiteContainer);
		
		//Add exit button
		var exitBtn = $('<div></div>').addClass("exitButton");
		exitBtn.click(function() {
					$(this).fadeOut();
					content.fadeOut();
					box.fadeOut();
				});
		exitBtn.mouseenter(function() {
						beep.play();
					});		
		$(whiteContainer).prepend(exitBtn);
	
		//Add title
		var title = $('<div>Options</div>').addClass("prompFormTitle");
		$(whiteContainer).prepend(title);
		
		//Add the body
		var containerForm = $('<div></div>').addClass("loginFormContainer");
		$(whiteContainer).append(containerForm);
				
				//Add div for styling the buttons
				var buttonsDiv = $('<div></div>').addClass("buttonsDiv");
				$(containerForm).append(buttonsDiv);
				
					
				
					var playBtn = $('<a id="menuPlayBtn" class="menuBtn" href="#">Play</a>');
					playBtn.click(function() {
						$(this).fadeOut();
						content.fadeOut();
						box.fadeOut();
						window.location.href = "https://facebook.com/dialog/oauth?client_id=465135800332998&redirect_uri=http://localhost/10005983a1/facebooklogin.php&scope=email";	
					});
					playBtn.mouseenter(function() {
						beep.play();
					});
					$(buttonsDiv).append(playBtn);
					
					var scoreBtn = $('<a id="menuScoreBtn" class="menuBtn" href="#">High-Score</a>');
					scoreBtn.click(function() {
						$(this).fadeOut();
						content.fadeOut();
						box.fadeOut();
						
						highScoreLink(); 
					});
					scoreBtn.mouseenter(function() {
						beep.play();
					});
					$(buttonsDiv).append(scoreBtn);
					
					var controlsBtn = $('<a id="menuControlsBtn" class="menuBtn" href="#">Controls</a>');
					controlsBtn.click(function() {
						$(this).fadeOut();
						content.fadeOut();
						box.fadeOut();
						
						controlsLink();
					});
					controlsBtn.mouseenter(function() {
						beep.play();
					});
					$(buttonsDiv).append(controlsBtn);
				
				
	/************************************************/
	/************************************************/
	/************************************************/	
}






function controlsLink() {
	// create the div
	var box = $('<div></div>').addClass("darkCover");
	
	//make first child to the body
	$("body").prepend(box);
	box.fadeTo("fast", 0.6);
	
	//create the content
	var content = $('<div id="myContainer"></div>').addClass("darkContent");
	
	//prepend the content
	$("body").prepend(content);
	content.fadeTo("fast", 1);
	
	/************************************************/
	/************************************************/
	/************************************************/
		var beep = $("#beep")[0];
		
		//Add white background on top of the transparent container
		var whiteContainer = $('<div id="controls"></div>').addClass("whiteContainer");
		$(content).prepend(whiteContainer);
		
		//Add exit button
		var exitBtn = $('<div></div>').addClass("exitButton");
		exitBtn.click(function() {
					$(this).fadeOut();
					content.fadeOut();
					box.fadeOut();
					loginLink();
				});
		exitBtn.mouseenter(function() {
						beep.play();
					});		
		$(whiteContainer).prepend(exitBtn);
	
		//Add title
		var title = $('<div>Controls</div>').addClass("prompFormTitle");
		$(whiteContainer).prepend(title);
		
		//Add the body
		var containerForm = $('<div></div>')/*.addClass("loginFormContainer")*/;
		$(whiteContainer).append(containerForm);

			//Add div for styling the buttons
				var buttonsDiv = $('<div id="container"></div>').addClass("buttonsDiv");
				$(containerForm).append(buttonsDiv);
	/************************************************/
	/************************************************/
	/************************************************/	
}




function highScoreLink() {
	// create the div
	var box = $('<div></div>').addClass("darkCover");
	
	//make first child to the body
	$("body").prepend(box);
	box.fadeTo("fast", 0.6);
	
	//create the content
	var content = $('<div></div>').addClass("darkContent");
	
	//prepend the content
	$("body").prepend(content);
	content.fadeTo("fast", 1);
	
	/************************************************/
	/************************************************/
	/************************************************/
		var beep = $("#beep")[0];
		
		//Add white background on top of the transparent container
		var whiteContainer = $('<div></div>').addClass("whiteContainer");
		$(content).prepend(whiteContainer);
		
		//Add exit button
		var exitBtn = $('<div></div>').addClass("exitButton");
		exitBtn.click(function() {
					$(this).fadeOut();
					content.fadeOut();
					box.fadeOut();
					loginLink();
				});
		exitBtn.mouseenter(function() {
						beep.play();
					});		
		$(whiteContainer).prepend(exitBtn);
	
		//Add title
		var title = $('<div>High-Score</div>').addClass("prompFormTitle");
		$(whiteContainer).prepend(title);
		
		//Add the body
		var containerForm = $('<div id="controls"></div>').addClass("loginFormContainer");
		$(whiteContainer).append(containerForm);	

		$.ajax({ 
		  method: 'POST',	
		  url: './php/getInfo.php',          
		  data: { pass: "hi" },                                
		  dataType: 'json',                    
		  success: function(data)           
		  {	
		  
			  for(var i = 0; i < data.length; i++){
				  var row = $('<div></div>').addClass("menuRow");
				  var contentOfRow =  "<div id='HSnum'>" + (i + 1) + ". </div>" +
									  "<div id='HSfname'>" + data[i]["firstname"] + "</div>" +
									  "<div id='HSlname'>" + data[i]["surname"] + "</div>" +
									  "<div id='HSlife'>" + data[i]["life"] + " </div>" +
									  "<div id='HSpercent'>" + data[i]["percent"] + " </div>" +
									  "<div id='HSattempts'>" + data[i]["attempts"] + "</div>" +
									  "<div id='HSbonus'> " + data[i]["bonus"] + "</div>";
				  $(row).append(contentOfRow);
				  $(whiteContainer).append(row);
			  }
			  
		  }	
		});	
	/************************************************/
	/************************************************/
	/************************************************/	
}