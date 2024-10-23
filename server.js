const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

let loginAttempts = {}; // Speichert fehlgeschlagene Login-Versuche für Benutzer
const MAX_ATTEMPTS = 5;
const BASE_LATENCY = 1000; // Grundlatenz in ms

app.use(bodyParser.json());
app.use(express.static('public')); // Statischer Ordner für HTML-Dateien

// Einfache Datenbank mit Benutzername und Passwort (nur für Testzwecke)
const users = {
    'user1': 'password123',
    'user2': 'secretPassword'
};

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
        loginAttempts[username]++;

        // Berechne die Latenz basierend auf der Anzahl der fehlgeschlagenen Versuche
        const latency = BASE_LATENCY * loginAttempts[username];

        if (loginAttempts[username] >= MAX_ATTEMPTS) {
            return res.json({ success: false, message: "Konto gesperrt" });
        } else {
            // Antwort mit Verzögerung
            setTimeout(() => {
                return res.json({ success: false, message: "Falsches Passwort" });
            }, latency);
        }
    }
});

// Server starten
app.listen(port, () => {
    console.log(`Server läuft unter http://localhost:${port}`);
});
