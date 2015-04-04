# Node iMessage Module

### What is this?
This is a node module that allows you to send iMessages, assuming you are running on a Mac that's signed in to an iMessage account.

### How do I use it in my project?

Like this:
```
var imessage = require("index.js");

imessage.sendMessage("person's icloud email, phone number, or group chat title", "message text", function(err) {});

```

It's really that simple!

### What's the purpose?
Nothing else on npm seems to deal with group chats correctly. I wanted something to use in my own project that I believed worked reliably. This uses a combination of private OS X frameworks in MessagesKit that I figured out while working on https://github.com/CamHenlin/nodeprivatemessageskit and AppleScript files to send messages.

### Why doesn't this handle reading the database?
There's already a pretty good library for that on npm at https://www.npmjs.com/package/imessage but personally I just read the Messages SQLite database directly in my other projects at https://github.com/CamHenlin/imessageclient, https://github.com/CamHenlin/iMessageWebClient, and https://github.com/CamHenlin/imessagebot.