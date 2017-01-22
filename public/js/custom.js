autosize($('#pp-terminal-area'));

$('#pp-terminal-area').keypress(function(e){
  e = e || event;
  if (e.which === 13) {
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
			// CHANGE 
			console.log('Bad boy');	
		} else { 
			var url = '/join-class?id=' + testInput;
			$.get(url, function(data){ 
				console.log('Good boy'); 
				console.log(data);
			});
		}
	} else { 
		// CHANGE add check for channel 
		console.log($('#pp-terminal-area').val());
	}
	$('#pp-terminal-area').val('');
};

var validateJoin = function(joinCall) { 
	var command = joinCall.split(' '); 
	if (command.length < 2) { 
		return false;
	}
	command.shift(); 
	var course = command.join(); 
	var upperCourse = course.toUpperCase(); 
	return upperCourse;
}; 

var unixToTime = function(unix) { 
	var date = new Date(unix *1000);
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var formattedTime = hours + ':' + minutes.substr(-2);
	return formattedTime;
};