function saveConfig() {
    let encrypted = vigenere(JSON.stringify(config), "time-to-work")
    browser.storage.local.set({"config": encrypted});

    let func = async () => {
        let val = await browser.storage.local.get("config");
        console.log(val);
    }
    func();
}

async function getConfig() {
    let encrypted = await browser.storage.local.get("config");
    encrypted = encrypted.config;

    let decrypted = vigenere(encrypted, "time-to-work", true);
    console.log(decrypted);
    if (!decrypted) {
        return {"started_at":-1, "current_work_type":"", "history":[]};
    }

    return JSON.parse(decrypted);
}