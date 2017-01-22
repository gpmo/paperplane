var Haikunator = require('haikunator')
var haikunator = new Haikunator()

var generateUsername = function(){
	haikunator.haikunate({tokenLength: 0});
}