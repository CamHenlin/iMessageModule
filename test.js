
var imessage = require("./index.js");

imessage.sendMessage("Let’s slop ‘em up", "test", function() {
	console.log("should be fine.");
});