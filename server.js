const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(express.static('public')); // Statischer Ordner für HTML-Dateien

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

function generatePassword(length, difficulty = 2) {
    const symbols = difficultySetter(difficulty);
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomSymbol = Math.floor(Math.random() * symbols.length);
        password += symbols[randomSymbol];
    }
    return password;
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

const bruteForce = async function (password, difficulty = 3) {
    const symbols = difficultySetter(difficulty);
    const startTime = Date.now();

    for (let i = 1; i <= 14; i++) {
        for (const e of generateCombinations(symbols, i)) {
            if (e === password) {
                const endTime = Date.now();
                console.log('Password found:', e);
                console.log(`Total time taken: ${endTime - startTime} ms`);
                return e;
            }
        }
    }
    console.log('Password not found');
    return null;
};

app.post('/bruteforce', async (req, res) => { // make the handler async
    const { password } = req.body;
    const foundPassword = await bruteForce(password); // wait for bruteForce result
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
