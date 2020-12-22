$(function() 
{
	 $("#infoBox")
	.css( 
	{
	   "background":"rgba(255,255,255,0.1)"
	})
	.dialog({ autoOpen: false, 
		show: { effect: 'fade', duration: 500 },
		hide: { effect: 'fade', duration: 500 } 
	});
	
	 $("#infoButton")
       .text("") // sets text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":".9", 
	  "position":"absolute", "top":"4px", "left":"504px"
	}) // adds CSS
    .append("<img width='32' height='34' src='images/info.png'/>")
    .button()
	.click( 
		function() 
		{ 
			$("#infoBox").dialog("open");
		});
});
$(function() 
{
	$("#helpBox")
	.css( 
	{
	   "background":"rgba(255,255,255,0.1)"
	})
	.dialog({ autoOpen: false, 
		show: { effect: 'fade', duration: 500 },
		hide: { effect: 'fade', duration: 500 } 
	});
	
	 $("#helpButton")
       .text("") // sets text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":".9", 
	  "position":"absolute", "top":"4px", "left":"570px"
	}) // adds CSS
    .append("<img width='32' height='34' src='images/help.png'/>")
    .button()
	.click( 
		function() 
		{ 
			window.open('CADjsManual.pdf', '_blank', 'fullscreen=yes')
		});
});
$(function() 
{
	 $("#powerpointButton")
       .text("") // sets text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":".9", 
	  "position":"absolute", "top":"4px", "left":"640px"
	}) // adds CSS
    .append("<img width='32' height='34' src='images/powerpoint.png'/>")
    .button()
	.click( 
		function() 
		{ 
			window.open('http://www.ersl.wisc.edu/printableProgramming.html', '_blank', 'fullscreen=yes')
		});
});






