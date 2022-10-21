const updateHistory = (seperation=null) => {
    const sample_seperator = div_history.querySelector("div#sample-history-seperator")
    const all_entries = div_history.querySelectorAll("div.entry");
    const sample_entry = all_entries[all_entries.length - 1];

    let until_index; // Marks until which index the list has to be walked through.
    if (all_entries.length === 1) { // if theres nothing except the sample
        until_index = config.history.length;
    }
    else {
        // Going through all history entries to see which is the last one
        // presented. (to know which ones have to be added)
        for (let i = 0; i < config.history.length; i++) {
            // console.log(Number(all_entries[0].id), "===", Number(config.history[i][1]));
            if (Number(all_entries[0].id) === Number(config.history[i][1])) {
                until_index = i;
                break;
            }
        }
    }

    // console.log("until_index=",until_index);

    for (let i = 0; i < until_index; i++) {
        const config_entry = config.history[i];

        if (config_entry[2] === -1) continue;

        // Getting the HTML elements.
        const new_entry = sample_entry.cloneNode(true);
        const text = new_entry.querySelector("div.text");
        const duration = new_entry.querySelector("div.duration");
        const buttons = new_entry.querySelectorAll("div.control>img");

        // Changing the default values.
        new_entry.removeAttribute("hidden");
        // Setting the ID to the unix timestamp when the work started.
        new_entry.setAttribute("id", config_entry[1]);
        // The text will be the work type.
        text.innerText = config_entry[0];
        duration.innerText = convertSecondsToTime(config_entry[2] - config_entry[1]);

        // Giving the buttons a function
        // Trash icon
        buttons[0].addEventListener("click", () => {

            // Shriking and fading out
            new_entry.setAttribute("style", "max-height:0;opacity:0");

            // After animations, delete
            setTimeout(function () {
                // Erasing every memory to this entry
                div_history.removeChild(new_entry);
                config.history.pop(i);
                saveConfig();
            }, 300)
        })

        // Copy up icon
        buttons[1].addEventListener("click", () => {
            // Changing the input fields value to this entrys value
            config.history[i][0] = input_work_type.value;
            text.innerText = input_work_type.value;
            saveConfig();
        })

        // Copy down icon
        buttons[2].addEventListener("click", () => {
            // Changing the input fields value to this entrys value
            input_work_type.value = config.history[i][0];
        })

        
        // Adding the new entry to the current displayed entries
        all_entries[0].before(new_entry);
    }
}