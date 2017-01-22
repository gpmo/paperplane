$("#pp-terminal-area").keyup(function (e) {
  // User pressed enter
  if (e.keyCode == 13) {
    var data = $("#mainInput").val().trim();
    if (data.charAt(0) == "/") {

    } else {
      $(body).append("<p>Sorry, couldn't understand what you just wrote</p>");
    }
  }
});

function login(credentials) {
  var credentialsArray = credentials.split();
  $.post( "/login", { email: credentialsArray[0], password: credentialsArray[1] })
  .done(function( data ) {
    alert( "Data Loaded: " + data );
  });
}

function signup(credentials) {

}
