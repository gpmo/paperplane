var express = require('express');
var SendBird = require('sendbird');
var Haikunator = require('haikunator');
var haikunator = new Haikunator();
var app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// set up db
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');

// Connection URL
var url = 'mongodb://test:test@ds117899.mlab.com:17899/heroku_npp0n9k5';

var insertDocuments = function(db, callback) {
  // Get the documents collection
  var collection = db.collection('documents');
  // Insert some documents
  collection.insertMany([
    {a : 1}, {a : 2}, {a : 3}
  ], function(err, result) {
    assert.equal(err, null);
    assert.equal(3, result.result.n);
    assert.equal(3, result.ops.length);
    console.log("Inserted 3 documents into the collection");
    callback(result);
  });
}

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  insertDocuments(db, function() {
    db.close();
  });
});

app.get('/', function(request, response) {
  	response.render('pages/index');
});

app.post('/login', function(request, response) {
	response.send("hello world");
});

app.get('/create-username', function(request, response) {
  response.send(haikunator.haikunate({tokenLength: 0}));
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
