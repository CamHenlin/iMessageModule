// normal module includes
var applescript = require("./applescript/lib/applescript.js");

// nodobjc required includes for private frameworks
var objc = require('NodObjC');
var $ = require('NodObjC');
$.import('MessagesKit');
var buddyHelper = $.SOBuddyHelper('alloc')('init');

// sending queue, since we can only send one message at a time
var sendingQueue = [];

var Message = function(chatTitle, chatMessage, isGroupChat) {
	this.chatTitle = chatTitle;
	this.chatMessage = chatMessage;
	this.isGroupChat = isGroupChat;
};

// main module export
exports.sendMessage = function(chatTitle, chatMessage, isGroupChat) {
	sendingQueue.push(new Message(chatTitle, chatMessage, isGroupChat));
	sendMessagesFromQueue();
};

function sendMessagesFromQueue() {
	if (queue.length > 0) {
		// select the first messages that we need to send
		var message = sendingQueue[0];

		// remove the first message from the queue
		sendingQueue = sendingQueue.slice(1, sendingQueue.length);

		var chatTitle = message.chatTitle;
		var chatMessage = message.chatMessage;
		var isGroupChat = message.isGroupChat;


		var remainingTitleText = "";	// this will hold the text after the first space, if any
										// required because the private messages frameworks can't handle spaces for some reason

		// determine if there is a space in the chatTitle:
		var spaceOffset = chatTitle.indexOf(' ');
		if (spaceOffset > -1) {
			// remaining text is everything after the first space, including the space
			remainingTitleText = chatTitle.slice(spaceOffset, chatTitle.length);

			// chat title is anything before the first space
			chatTitle = chatTitle.slice(0, spaceOffset);
		}

		// create a new chat, at least with the first portion of the chat title
		buddyHelper("openConversationWithBuddyID", $(chatTitle), "serviceName", $("iMessage"));

		// use applescript to set the second portion of the chat title, if any
		if (remainingTitleText !== "") {

		}
	}
}

/**
 * [setPartialChatTitle sets a portion of the chat title.
 * 						used if a title with a space was passed in to the sendMessage function]
 * @param {[type]} partialChatTitle [the partial chat title to set]
 */
function setPartialChatTitle(partialChatTitle, callback) {
	applescript.execFile(__dirname+'/setpartialchattitle.AppleScript', [], function(err, result) {
		if (err) {
			assistiveAccessCheck();
		}

		callback();
	});
}

// make sure assistive access is set up
function assistiveAccessCheck() {
	// first check if assistive access is turned on
	applescript.execFile(__dirname+'/assistive.AppleScript', [true], function(err, result) {
		if (err) {
			try {
				outputBox.setItems(["This program requires OS X Assistive Access, which is currently disabled.", "Opening Assistive Access now... (You may be asked to enter your password.)", "note: to run locally, enable access to Terminal or iTerm2, to run over SSH, enable access to sshd_keygen_wrapper."]);
				screen.render();
				applescript.execFile(__dirname+'/assistive.AppleScript', [false], function(err, result) {});
			} catch (error) {
				// I believe this might happen with old versions of OS X
				console.log('if you are seeing this text, please file an issue at https://github.com/CamHenlin/imessageclient/issues including your OS X version number and any problems you are encountering.')
			}
		}
	});
}

function sendMessage(chatMessage) {

}


	if (GROUPCHAT_SELECTED) {
		applescript.execFile(__dirname+'/sendmessage.AppleScript', [[SELECTED_GROUP.split('-chat')[0]], message, FULL_KEYBOARD_ACCESS], function(err, result) {
			if (err) {
				assistiveAccessCheck();
			}

			screen.render();
			sending = false;
		}.bind(this));
	} else {
		applescript.execFile(__dirname+'/sendmessage_single.AppleScript', [[to], message, FULL_KEYBOARD_ACCESS, ENABLE_OTHER_SERVICES], function(err, result) {
			if (err) {
				assistiveAccessCheck();
			}

			screen.render();
			sending = false;
		}.bind(this));
	}