const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

let loginAttempts = {}; // Speichert fehlgeschlagene Login-Versuche für Benutzer
const MAX_ATTEMPTS = 5;
const BASE_LATENCY = 1000; // Grundlatenz in ms

app.use(bodyParser.json());
app.use(express.static('public')); // Statischer Ordner für HTML-Dateien

const users = {
    'user1': 'password123',
    'user2': 'secretPassword'
};

const string = {
    digits: '0123456789',
    ascii_letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    punctuation: '!@#$%^&*()_+-=[]{}|;:,.<>/?`~'
};

// Diese Funktion gibt immer die gleiche Zeichenliste zurück
function getSymbols() {
    return string.digits + string.ascii_letters + string.punctuation; // Zeichenliste mit allem
}

function generateCombinations(symbols, length) {
    if (length === 1) {
        return symbols.split('');
    } else {
        const combinations = [];
        for (const symbol of symbols) {
            for (const subCombination of generateCombinations(symbols, length - 1)) {
                combinations.push(symbol + subCombination);
            }
        }
        return combinations;
    }
}

function bruteForce(password) {
    const symbols = getSymbols();
    for (let i = 1; i <= 14; i++) {
        const combinations = generateCombinations(symbols, i);
        for (const e of combinations) {
            if (e === password) {
                return e; // Passwort gefunden
            }
        }
    }
    return null; // Passwort nicht gefunden
}

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!users[username]) {
        return res.json({ success: false, message: "Benutzer nicht gefunden" });
    }

    if (!loginAttempts[username]) {
        loginAttempts[username] = 0;
    }

    // Passwort prüfen
    if (users[username] === password) {
        // Bei erfolgreichem Login Zähler zurücksetzen
        loginAttempts[username] = 0;
        return res.json({ success: true });
    } else {
        // Fehlversuch zählen
        loginAttempts++;

        const latency = BASE_LATENCY * loginAttempts[username];

        if (loginAttempts[username] >= MAX_ATTEMPTS) {
            return res.json({ success: false, message: "Konto gesperrt" });
        } else {
            setTimeout(() => {
                return res.json({ success: false, message: "Falsches Passwort" });
            }, latency);
        }
    }
});

app.post('/bruteforce', (req, res) => {
    const { password } = req.body;
    const foundPassword = bruteForce(password);
    if (foundPassword) {
        return res.json({ success: true, foundPassword });
    } else {
        return res.json({ success: false, message: "Passwort nicht gefunden" });
    }
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
