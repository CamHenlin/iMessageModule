
var imessage = require("./index.js");

imessage.sendMessage("", "test 1", function() {
	console.log("should be fine.");
});

imessage.sendMessage("paul come back 🤷‍♀️", "imessage module 2 unit test - can send message with emojis🤷‍♀️\nand new lines", function() {
	console.log("should be fine.");
});