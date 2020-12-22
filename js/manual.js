$(function() 
{
	 $("#manualBox")
	.css( 
	{
	   "background":"rgba(255,255,255,0.1)"
	})
	.dialog({ autoOpen: false, 
		show: { effect: 'fade', duration: 500 },
		hide: { effect: 'fade', duration: 500 } 
	});
	
	 $("#manualButton")
       .text("") // sets text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":".9", 
	  "position":"absolute", "top":"4px", "left":"105px"
	}) // adds CSS
    .append("<img width='32' height='32' src='../images/manual.png'/>")
    .button()
	.click( 
		function() 
		{ 
			$("#manualBox").dialog("open");
		});
});