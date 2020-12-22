$(function() 
{
	 $("#reportBox")
	.css( 
	{
	   "background":"rgba(255,255,255,0.1)",
	   'overflow-y':'scroll',
	   'height': '20px',
	})
	.dialog({ autoOpen: false, 
		show: { effect: 'fade', duration: 500 },
		hide: { effect: 'fade', duration: 500 } 
	});
	
	 $("#reportButton")
       .text("") // sets text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":".9", 
	  "position":"absolute", "top":"4px", "left":"75px",
	}) // adds CSS
    .append("<img width='32' height='32' src='../images/lens.png'/>")
    .button()
	.click( 
	function() 
	{ 
		$("#reportBox").dialog("open");
	});
});