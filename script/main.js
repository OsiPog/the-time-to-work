// Starting the timer
const startTimer = () => {
    // Updating the class
    button_timer.classList.add("active")

    // Starting the visual timer (Text inside button will be the elapsed time).
    if (config.started_at === -1) {
        config.started_at = Math.round(Date.now()/1000);
        
        // Adding the work to the history
        let work_type = input_work_type.value;
        if (work_type === "") work_type = "not defined";

        config.history.unshift([work_type, config.started_at, -1]);
    }
    visualTimer();
}

const stopTimer = () => {
    // Updating the class
    button_timer.classList.remove("active");

    // Resetting the timer button
    button_timer.value = "Start Working";

    // Adding the end-timestamp to the entry in history
    config.history[0][2] = Math.round(Date.now() / 1000);

    // resetting the visual timer
    config.started_at = -1;

    // saving the changed config
    saveConfig();

    // Updating the visual history
    updateHistory();
}

const visualTimer = () => {
    if (!button_timer.classList.contains("active")) {
        return;
    }

    const elapsed = Math.round(Date.now()/1000 - config.started_at);

    button_timer.value = convertSecondsToTime(elapsed);

    saveConfig();

    // Delaying the next "recursive" call by 1 second.
    setTimeout(() => {
        visualTimer();
    }, 1000);
    
}

const executeDebugCommand = () => {
    switch(input_work_type.value) {
        case "HARD_RESET":
            browser.storage.local.set({"config":null});
            window.location.reload(true);
            return true;
        default:
            return false;
    }
}

async function init() {
    // Initialize global variables.
    config = await getConfig().catch(e => {
        console.log(e);
    });

    // These elements are needed very often thus they are global.
    button_timer = document.querySelector("input#timer-button");
    button_analytics = document.querySelector("#open-analytics")
    input_work_type = document.querySelector("input#work-type-input");
    div_history = document.querySelector("div#list");

    // Toggle the timer on click
    button_timer.addEventListener("click", () => {
        if (button_timer.classList.contains("active")) {
            stopTimer();
        }
        else {
            if (executeDebugCommand()) return;
            startTimer();
        }
    });

    // Making the Analytics-Button open the options page.
    button_analytics.addEventListener("click", () => {
        browser.runtime.openOptionsPage()
    });

    // Starting the timer if the popup was closed with the timer on.
    if (config.started_at !== -1) {
        startTimer();
    }

    // Creating the visual history.
    updateHistory();
}

// Declare globals
let config;
let button_timer;
let button_analytics;
let input_work_type;
let div_history;

init();