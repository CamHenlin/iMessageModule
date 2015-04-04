
var imessage = require("./index.js");

imessage.sendMessage("", "test 1", function() {
	console.log("should be fine.");
});

imessage.sendMessage("group chat", "test 2", function() {
	console.log("should be fine.");
});