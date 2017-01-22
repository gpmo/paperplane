var express = require('express');
var SendBird = require('sendbird');
var Haikunator = require('haikunator');
var haikunator = new Haikunator();
var app = express();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

app.set('port', (process.env.PORT || 8080));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// set up db
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://test:test@ds117899.mlab.com:17899/heroku_npp0n9k5';

app.get('/', function(request, response) {
    var usernameString = haikunator.haikunate({tokenLength: 0})
  	response.render('pages/pp-home', {
      username: usernameString
    });
});

app.get('/get-class-times', function(request, response) {
  var id_param = request.query.id;

  var idToFull = {
    'CIS110': 'CIS110001',
    'CIS120': 'CIS120001',
    'CIS121': 'CIS121001',
    'CIS160': 'CIS160001',
    'CIS240': 'CIS240001',
    'CIS320': 'CIS320001',
    'CIS331': 'CIS331001',
    'CIS350': 'CIS350001',
    'CIS371': 'CIS371001',
    'CIS401': 'CIS401001',
    'CIS450': 'CIS450401',
    'CIS455': 'CIS455401',
    'TEST': 'test'
  };

  var course_id = idToFull[id_param];

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    var collection = db.collection('classes');

    collection.find({'course_id': course_id}).toArray(function(err, docs) {
      assert.equal(err, null);
      // didn't find class
      if (docs.length < 1) {
        response.send({"result": false, "error": "Class does not exist."});
        return;
      } else {
        course = docs[0];
        var start_time = course['start_time'];
        var end_time = course['end_time'];
        response.send({"result": true, "start_time": start_time, "end_time": end_time});
      }
    });
    db.close();
  });
});

app.get('/join-class', function(request, response) {
  var id_param = request.query.id;

  var idToFull = {
    'CIS110': 'CIS110001',
    'CIS120': 'CIS120001',
    'CIS121': 'CIS121001',
    'CIS160': 'CIS160001',
    'CIS240': 'CIS240001',
    'CIS320': 'CIS320001',
    'CIS331': 'CIS331001',
    'CIS350': 'CIS350001',
    'CIS371': 'CIS371001',
    'CIS401': 'CIS401001',
    'CIS450': 'CIS450401',
    'CIS455': 'CIS455401',
    'TEST': 'test'
  };

  if (!(id_param in idToFull)) {
    response.send({"result": false, "error": "I can't find that class."});
    return;
  }

  var course_id = idToFull[id_param];

  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    var collection = db.collection('classes');

    collection.find({'course_id': course_id}).toArray(function(err, docs) {
      assert.equal(err, null);
      // didn't find class
      if (docs.length < 1) {
        response.send({"result": false, "error": "I can't find that class."});
        return;
      } else {
        course = docs[0];
        var date = new Date();
        var day = date.getDay();
        var dayToLetter = {
          0: 'Su',
          1: 'M',
          2: 'T',
          3: 'W',
          4: 'R',
          5: 'F',
          6: 'S',
        }
        var meeting_days = course['meeting_days'];
        // wrong time
        if (meeting_days.indexOf(dayToLetter[day]) == -1) {
          response.send({"result": false, "error": "Class is not in session. Come back when class starts."});
          return;
        } else {
          var time = date.getHours() * 60 + date.getMinutes();
          var result = time >= course['start_time'] && time <= course['end_time'];
          response.send({"result": result});
          return;
        }
      }
    });
    db.close();
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
