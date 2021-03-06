autosize($('#pp-terminal-area'));

$("#pp-terminal-area").keyup(function (e) {
  // User pressed enter
  if (e.keyCode == 13) {
    // start your submit function
    var input = $('#pp-terminal-area').val();
    handleInput(input);
  }
  return true;
 });

var handleInput = function(input){
	// this is join
	input = input.trim();
	if (input.startsWith('/join')) {
		var testInput = validateJoin(input);
		if (testInput == false) {
      appendErrorMessage("I can't find that class.");
		} else {
			var url = '/join-class?id=' + testInput;
			$.get(url, function(data){
				console.log('Good boy');
        var result = data.result;
        if (result) {
          var alreadyJoined = joinChannel(testInput);
          if (alreadyJoined) {
            appendInfoMessage("You're already in this class.");
          } else {
            appendInfoMessage("Welcome to " + testInput + "!");
          }
        } else {
          if (data.error == "Class is not in session. Come back when class starts.") {
            deleteChannel(channelObject);
          }
          appendErrorMessage(data.error);
        }
			});
		}
	} else {
    var channelName = $("#channel").val();
		if (channelName != null && channelName != undefined && channelName != "") {
      sendMessage(input);
    } else {
      appendErrorMessage("Stop talking to a wall! Join a class.");
    }
	}
	$('#pp-terminal-area').val('');
};

var validateJoin = function(joinCall) {
	var command = joinCall.split(' ');
	if (command.length < 2) {
		return false;
	}
	command.shift();
	var course = command.join("");
	var upperCourse = course.toUpperCase();
	return upperCourse;
};

var unixToTime = function(unix) {
	var date = new Date(unix);
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var formattedTime = hours + ':' + minutes.substr(-2);
	return formattedTime;
};

var appendErrorMessage = function(errorMessage) {
  $("#main-chat").append("<p><pp-pink>" + errorMessage + "<pp-pink></p>");
  $('#pp-scrollable').scrollTop($('#pp-scrollable')[0].scrollHeight);
}

var appendInfoMessage = function(infoMessage) {
  $("#main-chat").append("<p><pp-yellow>" + infoMessage + "<pp-yellow></p>");
  $('#pp-scrollable').scrollTop($('#pp-scrollable')[0].scrollHeight);
}
