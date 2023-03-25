const LETTERS = " s*G->9}XpL+[T]g3te{:0lSM%kEN&#!YFZmf:$jx<7VI58AaU?nzcduWr§KBPiO_JohHQC2DbvyR1w46q"

// An implementation of the Vigenere encryption with an addition of safety.
// (The used alphabet is randomized)
const vigenere = (string, key_string, decrypt = false) => {
	if ((string === "") || (key_string === "") || !string || !key_string) return;
	
	// Going through the whole string
	let new_string = "";
	for(let i=0; i<string.length; i++) {
		const key_char = key_string[i%key_string.length];
		// Skip if any character is not in the table
		if (!LETTERS.includes(string[i]) || !LETTERS.includes(key_char)) {
			new_string += string[i];
			continue;
		}
		
		// Getting the amount of shifting of the current char
		let key = LETTERS.indexOf(key_char);
		if (decrypt) key *= -1;
		
		let index = LETTERS.indexOf(string[i]) + key;
		if (index > LETTERS.length-1) index -= LETTERS.length;
		if (index < 0) index += LETTERS.length;
		new_string += LETTERS[index];
	}
	
	return new_string;
}


// Returns an amount of seconds into the time format hh:mm:ss
const convertSecondsToTime = (seconds) => {
	let h = Math.floor(seconds/3600);
    let min = Math.floor((seconds-h*3600)/60);
    let s = seconds-h*3600-min*60;

    if (h < 10) h = "0" + h;
    if (min < 10) min = "0" + min;
    if (s < 10) s = "0" + s;

    return h + ":" + min + ":" + s;
}

// Returns the week number of the year of a certain date
const weekOfTheYear = (date) => {
	//																sec  -min -h   -day  -week
	return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24 / 7)
}