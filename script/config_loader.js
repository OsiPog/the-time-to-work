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
        default: {
            format: "{work_types}\n<b>Gesamt: {duration_sum}h</b> ({overtime}h Gutstunden/Minusstunden diese Woche)\nÜberstunden Gesamt: {overtime_sum}h",
            work_types_format: "{work_type} - {duration}h\n",
            duration_format: "hh:mm"
        }
    }


    return config;
}