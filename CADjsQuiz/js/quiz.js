$(document).ready(function(){
var item1 = document.getElementById('questions');
var selectedAnswer = Array();
var totalQuestions = $('.questions').size();
var currentQuestion = 0;
var correctAnswers = ["c","a","d","b","a","c","a","b","d","d"];
var totalScore = 0;
var feedback = document.getElementById("results");
feedback.innerHTML = "<h3> Your Score:  </h3>";
$('#restart').hide();
$questions = $('.questions');
$questions.hide();
$("input:radio").removeAttr("checked");//remove all checks
$($questions.get(currentQuestion)).fadeIn();
$('#restart').click(function(){
	location.reload();
});
$('#next').click(function(){
    $($questions.get(currentQuestion)).fadeOut(function(){
		$($questions.get(currentQuestion)).prop('checked', false);
		var str,qs;
		qs = "q" + (currentQuestion+1);
		str = "input[name="+qs+"]:checked";
		selectedAnswer[currentQuestion] =$(str).val();
		if (selectedAnswer[currentQuestion] == correctAnswers[currentQuestion])
			totalScore = totalScore +1;
		
		currentQuestion = currentQuestion +1;
		var rs = document.getElementById("results");
		rs.innerHTML = "<h3> Your Score: " + totalScore + " / " + currentQuestion +"  </h3>";
		$($questions.get(currentQuestion)).fadeIn();
        if(currentQuestion == totalQuestions){
			  $("#next").hide();
			  $('#restart').fadeIn();
			  var fd = document.getElementById("feedback");
			  if (totalScore < currentQuestion)
				fd.innerHTML = "<h1> Try again?  </h3>";
			  else {
				fd.innerHTML = "<h1> Great job!  </h3>";
			  }
        }	
    });
});
});