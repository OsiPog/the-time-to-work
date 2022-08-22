LETTERS = " s*G->9}XpL+Tg3te{:0lSM%kEN&#!Y\\FZmf:$jx<7VI58A[a]U?nzcduWr§KBPiO_JohHQC2DbvyR1w46q"

// Cleaning a string of every character which isn't present in LETTERS.
function cleanString(string) {
	let cleaned = "";
	for (let c of string.split("\n").join("").split(" ").join("")) {
		if (LETTERS.includes(c)) cleaned += c;
	}
	
	return cleaned;
}

// An implementation of the Vigenere encryption with an addition of safety.
// (The used alphabet is randomized)
function vigenere(string, key_string, decrypt = false) {
	if ((string === "") || (key_string === "") || !string || !key_string) return;
	
	// Going through the whole string
	let key, index;
	let new_string = "";
	for(let i=0;i<string.length; i++) {
		key_char = key_string[i%key_string.length];
		// Skip if any character is not in the table
		if (!LETTERS.includes(string[i]) || !LETTERS.includes(key_char)) {
			new_string += string[i];
			continue;
		}
		
		// Getting the amount of shifting of the current char
		key = LETTERS.indexOf(key_char);
		if (decrypt) key *= -1;
		
		index = LETTERS.indexOf(string[i]) + key;
		if (index > LETTERS.length-1) index -= LETTERS.length;
		if (index < 0) index += LETTERS.length;
		new_string += LETTERS[index];
	}
	
	return new_string;
}