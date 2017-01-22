var express = require('express');
var SendBird = require('sendbird');
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
  	response.render('pages/pp-home');
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
    response.status(404).send({"result": false});
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
        response.status(404).send({"result": false});
      } else {
        course = docs[0];
        var date = new Date();
        var day = date.getDay();
        var dayToLetter = {
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
          response.status(200).send({"result": false});
        } else {
          var time = date.getHours() * 60 + date.getMinutes();
          var result = time >= course['start_time'] && time <= course['end_time'];
          response.status(200).send({"result": result});
        }
      }
    });
    db.close();
  });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
