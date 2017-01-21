var loggedIn = false;

$("#mainInput").keyup(function (e) {
  // User pressed enter
  if (e.keyCode == 13) {
    var data = $("#mainInput").val().trim();
    if (data.charAt(0) == "/") {
      // User has not logged in/signed up yet
      if (!loggedIn) {
        if (data.startsWith("/login")) {
          login(data);
        } else if (data.startsWith("/signup")) {
          signup(data);
        }
      }
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
