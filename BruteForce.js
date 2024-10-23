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
const randomPassword = generatePassword(6, 1);

console.log(`Random Password: ${randomPassword}\n`);
console.log('Without knowing password length:');
bruteForce(randomPassword, 1);

console.log('\n');
console.log('With known password length:');
bruteForce(randomPassword, 1, true);
