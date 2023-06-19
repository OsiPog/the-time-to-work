const saveConfig = () => {
    const encrypted = vigenere(JSON.stringify(config), "time-to-work");
    browser.storage.local.set({ "config": encrypted });
}

const getConfig = async() => {
    let encrypted = await browser.storage.local.get("config");
    encrypted = encrypted.config;

    let decrypted = vigenere(encrypted, "time-to-work", true);

    if (!decrypted || !encrypted || encrypted === "" || decrypted === "") decrypted = "{}"
    const config = JSON.parse(decrypted)

    config.started_at = config.started_at || -1
    config.history = config.history || []
    config.overtime = config.overtime || {
        threshold: 144000, // 40 hours
        sum: 0,
        sum_expiration_date: 0
    }
    config.templates = config.templates || {
        "Week_de": {
            text: "{work_types}<b>Gesamt: {duration_sum}h</b> ({overtime}h Gutstunden/Minusstunden diese Woche)<br/>Überstunden Gesamt: {overtime_sum}h",
            work_types: "{work_type} - {duration}h<br/>",
            time: "hh:mm",
            summary_of: "this week"
        },
        "Week_en": {
            text: "{work_types}<b>Total: {duration_sum}h</b> ({overtime}h overtime this week)<br/>Total Overtime: {overtime_sum}h",
            work_types: "{work_type} - {duration}h<br/>",
            time: "hh:mm",
            summary_of: "this week"
        }
    }
    config.selected_template = config.selected_template || "Week_en"


    return config;
}