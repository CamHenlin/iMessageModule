// local includes
var applescript = require('./applescript/lib/applescript.js');
var Queue = require('./queue.js').Queue;

// nodobjc required includes for private frameworks
var objc = require('nodobjc');
objc.import('MessagesKit');
var messageHelper = objc.SOMessageHelper('alloc')('init');
var buddyHelper = objc.SOBuddyHelper('alloc')('init');

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

	if (!callback) {
		this.messageCallback = function() {};
	}
};

/**
 * [assistiveAccessCheck make sure assistive access is set up]
 * @return {[type]} [void]
 */
function assistiveAccessCheck() {
	// first check if assistive access is turned on
	applescript.execFile(__dirname+'/assistive.AppleScript', [true], function(err) {
		if (err) {
			try {
				applescript.execFile(__dirname+'/assistive.AppleScript', [false], function() {});
			} catch (error) {
				// I believe this might happen with old versions of OS X
				console.log('if you are seeing this text, please file an issue at https://github.com/CamHenlin/iMessageModule/issues including your OS X version number and any problems you are encountering.');
			}
		}
	});
}

/**
 * [setGroupChatTitle 	sets the title To: line of a group chat. This has to be set differently because groupchat titles can have any UTF8 char
 * 						which for some reason gets mangled using the private interfaces and I haven't figured out how to get around that yet]
 * @param {[type]} groupChatTitle [the partial chat title to set]
 * @param  {Function} callback      [callback to execute when done setting title]
 */
function setGroupChatTitle(groupChatTitle, callback) {
	applescript.execFile(__dirname+'/setgroupchattitle.AppleScript', [groupChatTitle], function(err) {
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
	applescript.execFile(__dirname+'/sendmessage.AppleScript', [chatMessage], function(err) {
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

	// use applescript to set the second portion of the chat title, if any
	// if (chatTitle.indexOf(' ') > -1) {
		// typo is intentional in my code. error is in apple's headers
		messageHelper('startNewConverstaionInMessages');

		setGroupChatTitle(chatTitle, function() { sendMessage(chatMessage, messageCallback); }.bind(this));
	// } else {
		// create a new chat, at least with the first portion of the chat title
	// 	messageHelper('startNewConverstaionInMessages');

	// 	setTimeout(function() {
	// 		buddyHelper('openConversationWithBuddyID', objc(chatTitle), 'serviceName', objc('iMessage'));
	// 		sendMessage(chatMessage, messageCallback);
	// 	}.bind(this), 50)
	// }
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




