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