// preview html email in real time
// ... så jeg fandt ud af at det slet ikke var nødvendigt.
// på hans mac kan han nemt ændre stillen i et div-element.
// så jeg tror bare at jeg bruger det i stedet ;)


// DETTE SCRIPT ER IKKE FÆRDIG; OG BLIVER IKKE UDVIKLET PÅ LÆNGERE :( \\

let oven = document.getElementById('oven')
let product = document.getElementById('product')
let keysPressed = {};
let list = ['b', 'i', 'Enter']
let output = ['strong', 'i', 'br']
let lengths = [9, 3, 9]

oven.addEventListener("keyup", (event) => {
	product.innerHTML = oven.value

	keysPressed[event.key] = false

})

oven.addEventListener('keydown', (event) => {
	keysPressed[event.key] = true

	let command_key = 'Control'

	if (keysPressed[command_key] && list.includes(event.key)) {
		let cursorPosition = $('#oven').prop("selectionStart")
		let txt = ''
		let this_length;

		for (const i in list) {
			if (event.key == list[i]) {
				// first check if the script should remove instead of placing...

				// so first I need to check the sorrunding letters.

				//txt = '<' + output[i] + '></' + output[i] + '>'
				this_length = lengths[i]
			}
		}

		insertAtCursor(oven, txt)
		setCaretToPos(oven, cursorPosition + this_length)


	} else if (keysPressed[command_key] && event.key == 'j') {
		let cursorPosition = $('#oven').prop("selectionStart")
		console.log('cp:', cursorPosition)
	}
})






function insertAtCursor(myField, myValue) {
	//IE support
	if (document.selection) {
		myField.focus();
		sel = document.selection.createRange();
		sel.text = myValue;
	}
	//MOZILLA and others
	else if (myField.selectionStart || myField.selectionStart == '0') {
		var startPos = myField.selectionStart;
		var endPos = myField.selectionEnd;
		myField.value = myField.value.substring(0, startPos)
			+ myValue
			+ myField.value.substring(endPos, myField.value.length);
	} else {
		myField.value += myValue;
	}
}

function setSelectionRange(input, selectionStart, selectionEnd) {
	if (input.setSelectionRange) {
		input.focus();
		input.setSelectionRange(selectionStart, selectionEnd);
	}
	else if (input.createTextRange) {
		var range = input.createTextRange();
		range.collapse(true);
		range.moveEnd('character', selectionEnd);
		range.moveStart('character', selectionStart);
		range.select();
	}
}

function setCaretToPos(input, pos) {
   setSelectionRange(input, pos, pos);
}