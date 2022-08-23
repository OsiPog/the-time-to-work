// Starting the timer
function startTimer() {
    // Changing the class
    button_timer.className = "on";

    // Starting the visual timer (Text inside button will be the elapsed time).
    if (config.started_at === -1) {
        config.started_at = Math.round(Date.now()/1000);
        
        // Adding the work to the history
        let work_type = input_work_type.innerText
        if (work_type === "") work_type = "not defined";

        config.history.unshift([work_type, config.started_at, -1]);
    }
    visualTimer();
}

function stopTimer() {
    // Updating the class
    button_timer.className = "off";

    // Resetting the timer button
    button_text.innerText = "Start Working";

    // Adding the end-timestamp to the entry in history
    config.history[0][2] = Math.round(Date.now()/1000);

    // resetting the visual timer
    config.started_at = -1;
    
    // saving the changed config
    saveConfig();
}

function visualTimer() {
    if (button_timer.className !== "on") {
        return;
    }

    let elapsed = Math.round(Date.now()/1000 - config.started_at);

    button_text.innerText = convertSecondsToTime(elapsed);

    saveConfig();

    // Delaying the next "recursive" call by 1 second.
    setTimeout(function() {
        visualTimer();
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
let config = getConfig();

// These elements are needed very often thus they are global.
let button_timer = document.querySelector("button#timer");
let button_text = button_timer.querySelector("p");
let input_work_type = document.querySelector("input#type_of_work");
let div_history_container = document.querySelector("div#history_container");

// Connecting the click function to the click event
button_timer.addEventListener("click", clickedButton);

if (config.started_at !== -1) {
    startTimer();
}