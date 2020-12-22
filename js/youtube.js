$(function() 
{
	 $("#youtubeBox")
	.css( 
	{
	   "background":"rgba(255,255,255,0.1)"
	})
	.dialog({ autoOpen: false, 
		show: { effect: 'fade', duration: 500 },
		hide: { effect: 'fade', duration: 500 } 
	});
	
	 $("#youtubeButton")
       .text("") // sets text to empty
	.css(
	{ "z-index":"2",
	  "background":"rgba(0,0,0,0)", "opacity":".9", 
	  "position":"absolute", "top":"4px", "left":"140px"
	}) // adds CSS
    .append("<img width='32' height='34' src='../images/youtube.png'/>")
    .button()
	.click( 
		function() 
		{ 
			$("#youtubeBox").dialog("open");
		});
});