on run argv
	tell Application "Messages" to activate
	delay 0.25
	tell application "System Events"
		tell process "Messages"
			set value of text area 1 of scroll area 4 of splitter group 1 of window 1 to item 1 of argv
			delay 0.1
			keystroke return
			keystroke return
			delay 0.1
		end tell
		key down command
		keystroke tab
		key up command
	end tell
end run
