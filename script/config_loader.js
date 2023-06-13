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


    return config;
}