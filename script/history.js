function updateHistory() {
    let all_entries = div_history_container.querySelectorAll("table.history_entry");
    let sample_entry = all_entries.shift(); // python.pop(0)

    let until_index; // Marks until which index the list has to be gone through.
    if (all_entries.length === 0) {
        until_index = config.history.length -1;
    }
    else {
        // Going through all history entries to see which is the last one
        // which is presented on the site.
        for (let i=0;i<config.history.length;i++) {
            if (all_entries[0].id === config.history[i][1]) {
                until_index = i;
                break;
            }
        }
    }

    for(let i=0;i<until_index;i++) {
        let config_entry = config.history[i];

        // Getting the HTML elements
        let new_entry = sample_entry.cloneNode(true);
        let text = new_entry.querySelector("tr>td.type_of_work_text");
        let duration = new_entry.querySelector("tr>td.type_of_work_duration");
        
        // Changing the default values
        new_entry.removeAttribute("hidden");
        new_entry.setAttribute("id", config_entry[1]);
        text.innerText = config_entry[0];
        duration.innerText = convertSecondsToTime(config_entry[2] - config_entry[1]);
        
        sample_entry.before(new_entry);
    }



    
}