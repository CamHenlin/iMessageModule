# Node iMessage Module
## Requires OS X 10.7 or better, and an active iMessage account

### What is this?
This is a node module that allows you to send iMessages, assuming you are running on a Mac that's signed in to an iMessage account.

### How do I use it in my project?

Like this:
```
var imessagemodule = require("iMessageModule");

imessagemodule.sendMessage("recipient email, phone, or chat title", "message text", function(err) {});
```

It's really that simple! And you can send the messages as quickly as you like. iMessageModule will queue up them and send them as quickly as Messages.app will allow.

### What's the purpose?
Nothing else on npm seems to deal with group chats correctly. I wanted something to use in my own project that I believed worked reliably and as quickly as possible. This uses a combination of private OS X frameworks in MessagesKit that I figured out while working on [nodeprivatemessageskit](https://github.com/CamHenlin/nodeprivatemessageskit) and AppleScript files to send messages. Should work with OS X 10.7 or better.

### Why doesn't this handle reading the database?
There's already a pretty good library for that on npm at [imessage](https://www.npmjs.com/package/imessage) but personally I just read the Messages SQLite database directly in my other projects at [imessageclient](https://github.com/CamHenlin/imessageclient), [iMessageWebClient](https://github.com/CamHenlin/iMessageWebClient), and [imessagebot](https://github.com/CamHenlin/imessagebot).

## This is clunky!
This is using some private APIs with in OS X, but could be improved to use more. Private APIs within OS X should be able to be used to completely send messages without the use of Messages.app, but I haven't figured out how to do so yet. Right now I am using some private APIs to open a new message window and prefilling the To: field. Maybe you can help out and contribute? Check out [nodeprivatemessageskit](https://github.com/camhenlin/nodeprivatemessageskit) for more info.