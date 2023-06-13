const init = async() => {
    // Globals
    config = await getConfig().catch(e => {
        console.log(e);
    });

    div_history = document.querySelector("div#list");



    // Create History
    updateHistory(seperation="week", update_all=true, hide_buttons=true)
}

// Declare globals
let config;
let div_history;

init();