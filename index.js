var Queue = require('./queue.js').Queue;
const shell = require('shelljs')

// sending queue, since we can only send one message at a time
var sendingQueue = [];

// isSending is set true when a message is actively being sent by applescript
var isSending = false;

// instantiate a queue to store messages in
var messageQueue = new Queue();

const _automatorSendMessageToChat = (chatTitle, chatMessage, callback) => {

	return shell.exec(`automator -i "${chatTitle}\n${chatMessage.replace(/(?:\\[rn]|[\r\n]+)+/g, '\r')}" ${__dirname}/automations/Messages-sendMessage.workflow`, {
		silent: true
	}, callback)
}

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

	_automatorSendMessageToChat(chatTitle, chatMessage, messageCallback);
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




