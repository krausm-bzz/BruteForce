const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.static('public')); // Statischer Ordner für HTML-Dateien

// Diese Funktion gibt immer die gleiche Zeichenliste zurück
const string = {
    digits: '0123456789',
    ascii_letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    punctuation: '!@#$%^&*()_+-=[]{}|;:,.<>/?`~'
};

function difficultySetter(num) {
    if (num === 0) {
        return string.digits;
    } else if (num === 1) {
        return string.ascii_letters;
    } else if (num === 2) {
        return string.digits + string.ascii_letters;
    } else {
        return string.ascii_letters + string.digits + string.punctuation;
    }
}

function timer(originalFunction) {
    return function (...args) {
        const now = Date.now();
        const result = originalFunction(...args);
        console.log(`Time in ms: ${Date.now() - now}`);
        return result;
    };
}

function* generateCombinations(symbols, length) {
    if (length === 1) {
        for (const symbol of symbols) {
            yield symbol;
        }
    } else {
        for (const symbol of symbols) {
            for (const subCombination of generateCombinations(symbols, length - 1)) {
                yield symbol + subCombination;
            }
        }
    }
}

const bruteForce = timer(function (password, difficulty = 3, knowsLength = false) {
    const symbols = difficultySetter(difficulty);
    for (let i = 1; i <= 14; i++) {
        for (const e of generateCombinations(symbols, i)) {

            if (e === password) {
                console.log('password found');
                return password;
            }
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
