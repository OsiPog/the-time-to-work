function saveConfig() {
    let encrypted = vigenere(JSON.stringify(config), "time-to-work")
    localStorage.setItem("time-to-work", encrypted);

    console.log(JSON.stringify(config));
}

function getConfig() {
    let encrypted = localStorage.getItem("time-to-work");
    if (!encrypted) {
        return {"started_at":-1, "history":[]};
    }

    let decrypted = vigenere(encrypted, "time-to-work", true);
    console.log(decrypted);

    return JSON.parse(decrypted);
}