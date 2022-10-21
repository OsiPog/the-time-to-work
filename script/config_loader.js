const saveConfig = () => {
    const encrypted = vigenere(JSON.stringify(config), "time-to-work");
    browser.storage.local.set({ "config": encrypted });
}

const getConfig = async() => {
    let encrypted = await browser.storage.local.get("config");
    encrypted = encrypted.config;

    const decrypted = vigenere(encrypted, "time-to-work", true);

    if (!decrypted) {
        return {"started_at":-1, "history":[]};
    }

    return JSON.parse(decrypted);
}