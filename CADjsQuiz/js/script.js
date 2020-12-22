function submitAnswers()
{
	var total = 4;
	var score = 0;
	var q;
	
	//get user input
	var q1 = document.forms["quizForm"]["q1"].value;
	var q2 = document.forms["quizForm"]["q2"].value;
	var q3 = document.forms["quizForm"]["q3"].value;
	var q4 = document.forms["quizForm"]["q4"].value;
	
	//basic validation
	for (i = 1; i <= 4;i++) {
		q = eval('q'+i);
		if ( (q == null) || (q == '')){
			alert('You missed question ' + i);
			return false;
		}
	}
	
	//Set answers
	var answers = ["b","a","d","d"];
	
	//check answers
	for (i = 1; i <= 4;i++) {
		q = eval('q'+i);
		if (q == answers[i-1])
			score++;
	}
	var results = document.getElementById("results");
	results.innerHTML = "<h3> You scored <span> " + score +"</span> </h3>";
	
	return false;//no further server processing
}