on run argv
	tell Application "Messages" to activate
	delay 0.25
	tell application "System Events"
		tell process "Messages"
			set current_value to value of text field 1 of scroll area 3 of splitter group 1 of window 1
			set value of text field 1 of scroll area 3 of splitter group 1 of window 1 to current_value & item 1 of argv
			delay 1.9
			key code 125
			keystroke return
		end tell
	end tell
end run
