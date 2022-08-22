
// Starting the timer
function startTimer() {
    // Changing the class
    button_timer.className = "on";

    // Starting the visual timer (Text inside button will be the elapsed time).
    visualTimer(0);
}

function stopTimer() {
    // Updating the class
    button_timer.className = "off";

    // Resetting the timer
    button_text.innerText = "Start Working";
}

function visualTimer(elapsed) {
    if (button_timer.className !== "on") {
        return;
    }

    let h = Math.floor(elapsed/3600);
    let min = Math.floor((elapsed-h*3600)/60);
    let s = elapsed-h*3600-min*60;

    if (h < 10) h = "0" + h;
    if (min < 10) min = "0" + min;
    if (s < 10) s = "0" + s;

    button_text.innerText = h + ":" + min + ":" + s;

    // Delaying the next "recursive" call by 1 second.
    setTimeout(function() {
        visualTimer(elapsed+1);
    }, 1000);
      
}

// This is called when the button got clicked.
function clickedButton() {
    if (button_timer.className === "off") {
        startTimer();
    }
    else {
        stopTimer();
    }
}


// Initialize global variables.
// These elements are needed very often thus they are global.
let button_timer = document.querySelector("button#timer");
let button_text = button_timer.querySelector("p");

// Connecting the click function to the click event
button_timer.addEventListener("click", clickedButton);