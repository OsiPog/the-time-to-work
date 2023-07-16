const createSeperator = (string) => {
    const sample_seperator = div_history.querySelector("div#sample-history-seperator");
    const seperator = sample_seperator.cloneNode(true);

    // Updating defaults
    seperator.removeAttribute("hidden");
    seperator.removeAttribute("id");
    seperator.innerText = string;

    return seperator
}


const updateHistory = ({seperation="week", update_all=false, hide_buttons=false, load_amount=null}) => {
    // if this parameter is true, delete everything for a "true" update
    if (update_all) {
        // saving this to add it later
        const sample_seperator = div_history.querySelector("div#sample-history-seperator");
        const sample_entry = div_history.querySelector("div#sample-history-entry");
        // deleting it all
        div_history.innerHTML = "";

        // adding the samples again
        div_history.appendChild(sample_seperator);
        div_history.appendChild(sample_entry);
    }
    let all_entries = div_history.querySelectorAll("div.entry");
    const sample_entry = all_entries[all_entries.length - 1];

    let until_index; // Marks until which index the list has to be walked through.
    if (all_entries.length === 1) { // if theres nothing except the sample
        until_index = load_amount || config.history.length;
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

    for (let i = 0; i < until_index; i++) {
        const work_type = config.history[i][0];
        const t0 = config.history[i][1];
        const t1 = config.history[i][2];

        if (t1 === -1) continue;

        // Getting the HTML elements.
        const new_entry = sample_entry.cloneNode(true);
        const text = new_entry.querySelector("div.text");
        const duration = new_entry.querySelector("div.duration>.length");
        const date = new_entry.querySelector("div.duration>.date");
        const buttons = new_entry.querySelectorAll("div.control>img");

        // Changing the default values.
        new_entry.removeAttribute("hidden");
        // Setting the ID to the unix timestamp when the work started.
        new_entry.setAttribute("id", t0);
        // The text will be the work type.
        text.innerText = work_type;
        duration.innerText = convertSecondsToTime(t1 - t0);

        const t0_date = new Date(t0*1000)
        date.innerText = `${t0_date.getDate()}.${t0_date.getMonth()+1}.${t0_date.getFullYear()}`

        // Buttons
        if (!hide_buttons) {
            // Trash
            buttons[0].addEventListener("click", () => {
                // Shriking and fading out
                new_entry.setAttribute("style", "max-height:0;opacity:0;min-height:0");
                // After animations, delete
                setTimeout(()=> {
                    // Erasing every memory to this entry
                    div_history.removeChild(new_entry);
                    config.history.splice(i, 1);
                    saveConfig();
                }, 300)
            })

            // Copy up
            buttons[1].addEventListener("click", () => {
                // Changing the input fields value to this entrys value
                config.history[i][0] = input_work_type.value;
                text.innerText = input_work_type.value;
                saveConfig();
            })

            // Copy down
            buttons[2].addEventListener("click", () => {
                // Changing the input fields value to this entrys value
                input_work_type.value = config.history[i][0];
            })
        }
        else {
            for (const button of buttons) {
                button.parentElement.removeChild(button)
            }
        }
        
        // Adding the new entry to the current displayed entries
        all_entries[0].before(new_entry);
    }

    // Seperators do not need to be left untouched so deleting all of them and
    // creating them is the easiest solution.
    const all_seperators = div_history.querySelectorAll("div.seperator");
    all_seperators.forEach(element => {
        if (element.id !== "sample-history-seperator") {
            element.parentElement.removeChild(element);
        }
    });
    
    // Looking at each gap between the entries if a seperator is needed
    // Getting all entries again as there are more now.
    all_entries = div_history.querySelectorAll("div.entry");
    for (let i = 0; i<all_entries.length;i++) {
        // You can't check the gap when there isn't another one.
        if ((i === all_entries.length -1)
            || (all_entries[i].id === "sample-history-entry")) {
            continue;
        }
        // Seperation happens between two elements. if it's the first put a 
        // seperator anyway, as a kind of "heading".
        let seperator;
        if (i === 0)
            seperator = getSeperator(0, all_entries[i].id, seperation, true)
        else
            seperator = getSeperator(all_entries[i-1].id, all_entries[i].id, seperation)


        // If a seperator got created add it.
        if (seperator) {
            all_entries[i].before(createSeperator(seperator));
        }
    }
}