// local includes
var applescript = require("./applescript/lib/applescript.js");
var Queue = require("./queue.js").Queue;

// nodobjc required includes for private frameworks
var $ = require('NodObjC');
$.import('MessagesKit');
var messageHelper = $.SOMessageHelper('alloc')('init');
var buddyHelper = $.SOBuddyHelper('alloc')('init');

// sending queue, since we can only send one message at a time
var sendingQueue = [];

// isSending is set true when a message is actively being sent by applescript
var isSending = false;

// instantiate a queue to store messages in
var messageQueue = new Queue();

// basic message model
var Message = function(chatTitle, chatMessage, callback) {
	this.chatTitle = chatTitle;
	this.chatMessage = chatMessage;
	this.messageCallback = callback;
};

/**
 * [sendMessagesFromQueue checks queue for more messages, attempts to send them if it is not already sending]
 * @return {[type]} [void]
 */
function sendMessagesFromQueue() {
	if (!messageQueue.hasNext() || isSending) {
		return;
	}
	isSending = true;

	// select the first messages that we need to send
	var message = messageQueue.dequeue();

	// remove the first message from the queue
	sendingQueue = sendingQueue.slice(1, sendingQueue.length);

	var chatTitle = message.chatTitle;
	var chatMessage = message.chatMessage;
	var messageCallback = message.messageCallback;

	var remainingTitleText = "";	// this will hold the text after the first space, if any
									// required because the private messages frameworks can't handle spaces for some reason

	// use applescript to set the second portion of the chat title, if any
	if (chatTitle.indexOf(' ') > -1) {
		// typo is intentional in my code. error is in apple's headers
		messageHelper("startNewConverstaionInMessages");

		setGroupChatTitle(chatTitle, function() { sendMessage(chatMessage, messageCallback) }.bind(this));
	} else {
		// create a new chat, at least with the first portion of the chat title
		buddyHelper("openConversationWithBuddyID", $(chatTitle), "serviceName", $("iMessage"));

		sendMessage(chatMessage, messageCallback);
	}
}

/**
 * [setGroupChatTitle 	sets the title To: line of a group chat. This has to be set differently because groupchat titles can have any UTF8 char
 * 						which for some reason gets mangled using the private interfaces and I haven't figured out how to get around that yet]
 * @param {[type]} groupChatTitle [the partial chat title to set]
 * @param  {Function} callback      [callback to execute when done setting title]
 */
function setGroupChatTitle(groupChatTitle, callback) {
	applescript.execFile(__dirname+'/setgroupchattitle.AppleScript', [groupChatTitle], function(err, result) {
		if (err) {
			assistiveAccessCheck();
		}

		callback();
	});
}

/**
 * [sendMessage initiates the applescript to send the imessages]
 * @param  {[type]} chatMessage [message text to send]
 * @return {[type]}             [void]
 */
function sendMessage(chatMessage, messageCallback) {
	applescript.execFile(__dirname+'/sendmessage.AppleScript', [chatMessage], function(err, result) {
		isSending = false;

		if (err) {
			assistiveAccessCheck();
		}

		// pass the applescript error through to the user and let them try to deal with it
		messageCallback(err);

		// send more messages, if any
		sendMessagesFromQueue();
	}.bind(this));
}

/**
 * [sendMessage main module export]
 * @param  {[type]}   chatTitle   [phone number, email address, title of group chat]
 * @param  {[type]}   chatMessage [message to send]
 * @param  {Function} callback    [callback to execute when done sending]
 * @return {[type]}               [void]
 */
exports.sendMessage = function(chatTitle, chatMessage, callback) {
	// add new message to the messagequeue
	messageQueue.enqueue(new Message(chatTitle, chatMessage, callback));
	// attempt to send messages
	sendMessagesFromQueue();
};






