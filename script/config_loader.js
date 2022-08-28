function saveConfig() {
    let encrypted = vigenere(JSON.stringify(config), "time-to-work")
    browser.storage.local.set({"config": encrypted});
}

async function getConfig() {
    let encrypted = await browser.storage.local.get("config");
    encrypted = encrypted.config;

    let decrypted = vigenere(encrypted, "time-to-work", true);

    if (!decrypted) {
        return {"started_at":-1, "history":[]};
    }

    return JSON.parse(decrypted);
}