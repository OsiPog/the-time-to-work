const saveConfig = () => {
    const encrypted = vigenere(JSON.stringify(config), "time-to-work");
    browser.storage.local.set({ "config": encrypted });
}

const getConfig = async() => {
    let encrypted = await browser.storage.local.get("config");
    encrypted = encrypted.config;

    let decrypted = vigenere(encrypted, "time-to-work", true);
    console.log(decrypted)

    if (!decrypted || !encrypted || encrypted === "" || decrypted === "") decrypted = "{}"
    
    const config = JSON.parse(decrypted)

    config.started_at = config.started_at || -1
    config.history = config.history || []
    config.overtime_sum = config.overtime_sum || 0
    config.overtime_limit = config.overtime_limit || 144000

    return config;
}