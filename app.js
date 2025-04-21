let currentKeys = null;
const CHARACTER_SET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!?., ";

// Tab navigation
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.style.display = 'none';
    });
    document.querySelectorAll('.tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.getElementById(tabId).style.display = 'block';
    event.target.classList.add('active');
}

// RSA Functions
function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}

function modPow(base, exponent, modulus) {
    let result = 1;
    base = base % modulus;
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % modulus;
        }
        exponent = Math.floor(exponent / 2);
        base = (base * base) % modulus;
    }
    return result;
}

function generateKeys() {
    const bitLength = parseInt(document.getElementById('bitLength').value);
    let p, q;

    do {
        p = Math.floor(Math.random() * (2 ** bitLength)) + (2 ** (bitLength - 1));
        q = Math.floor(Math.random() * (2 ** bitLength)) + (2 ** (bitLength - 1));
    } while (!isPrime(p) || !isPrime(q) || p === q);

    const n = p * q;
    const phi = (p - 1) * (q - 1);
    let e = 65537;

    if (e >= phi) {
        e = 3;
        while (gcd(e, phi) !== 1) {
            e += 2;
        }
    }

    const d = modInverse(e, phi);

    currentKeys = {
        publicKey: { n, e },
        privateKey: { n, d }
    };

    document.getElementById('publicKey').innerHTML = `
        n: ${n}<br>
        e: ${e}
    `;

    document.getElementById('privateKey').innerHTML = `
        n: ${n}<br>
        d: ${d}
    `;

    // Display mathematical steps
    displayMathematicalSteps(p, q, n, phi, e, d);
}

function displayMathematicalSteps(p, q, n, phi, e, d) {
    const stepsDiv = document.getElementById('steps');
    stepsDiv.innerHTML = `
        <div class="step">
            <h4>Step 1: Choose two distinct prime numbers p and q</h4>
            <p>Selected p = ${p} and q = ${q}</p>
        </div>
        <div class="step">
            <h4>Step 2: Compute n = p * q</h4>
            <p>n = ${p} * ${q} = ${n}</p>
        </div>
        <div class="step">
            <h4>Step 3: Compute Euler's totient function φ(n) = (p-1) * (q-1)</h4>
            <p>φ(n) = (${p} - 1) * (${q} - 1) = ${p - 1} * ${q - 1} = ${phi}</p>
        </div>
        <div class="step">
            <h4>Step 4: Choose an integer e such that 1 < e < φ(n) and gcd(e, φ(n)) = 1</h4>
            <p>Selected e = ${e} (gcd(${e}, ${phi}) = 1)</p>
        </div>
        <div class="step">
            <h4>Step 5: Compute d, the modular multiplicative inverse of e (mod φ(n))</h4>
            <p>d = ${e}^(-1) mod ${phi} = ${d}</p>
            <p>Verification: (d * e) mod φ(n) = (${d} * ${e}) mod ${phi} = ${(d * e) % phi}</p>
        </div>
    `;
}

function toggleSteps() {
    const stepsDiv = document.getElementById('steps');
    stepsDiv.style.display = stepsDiv.style.display === 'none' ? 'block' : 'none';
}

function encryptMessage() {
    if (!currentKeys) return alert("Generate keys first!");
    const message = document.getElementById('plaintext').value;
    const encrypted = [];
    let stepsHtml = '<div class="encryption-steps">';

    stepsHtml += `<h4>Using public key: (n=${currentKeys.publicKey.n}, e=${currentKeys.publicKey.e})</h4>`;

    // Convert message to ASCII values
    const asciiValues = [];
    for (let char of message) {
        asciiValues.push(char.charCodeAt(0));
    }
    stepsHtml += `<p>Message converted to ASCII: ${asciiValues.join(', ')}</p>`;

    // Encrypt each character
    for (let i = 0; i < message.length; i++) {
        const char = message[i];
        const ascii = asciiValues[i];
        const encryptedChar = modPow(ascii, currentKeys.publicKey.e, currentKeys.publicKey.n);
        encrypted.push(encryptedChar);

        stepsHtml += `
            <div class="encryption-step">
                <h4>Encrypting '${char}' (${ascii}):</h4>
                <p>c = ${ascii}^${currentKeys.publicKey.e} mod ${currentKeys.publicKey.n} = ${encryptedChar}</p>
            </div>
        `;
    }

    stepsHtml += `<p>Encrypted values: ${encrypted.join(', ')}</p>`;
    stepsHtml += '</div>';

    document.getElementById('encryptedResult').innerHTML = `
        <div class="result-container">
            <h3>Ciphertext:</h3>
            <textarea>${encrypted.join(',')}</textarea>
            <button onclick="toggleEncryptionSteps()">Show/Hide Encryption Steps</button>
            <div id="encryptionSteps" style="display: none;">
                ${stepsHtml}
            </div>
        </div>
    `;
}

function toggleEncryptionSteps() {
    const stepsDiv = document.getElementById('encryptionSteps');
    stepsDiv.style.display = stepsDiv.style.display === 'none' ? 'block' : 'none';
}

function decryptMessage() {
    if (!currentKeys) return alert("Generate keys first!");
    const ciphertext = document.getElementById('ciphertext').value.split(',').map(Number);
    let decrypted = '';
    let stepsHtml = '<div class="decryption-steps">';

    stepsHtml += `<h4>Using private key: (n=${currentKeys.privateKey.n}, d=${currentKeys.privateKey.d})</h4>`;
    stepsHtml += `<p>Encrypted values: ${ciphertext.join(', ')}</p>`;

    const decryptedAscii = [];
    for (let i = 0; i < ciphertext.length; i++) {
        const encryptedNum = ciphertext[i];
        const decryptedNum = modPow(encryptedNum, currentKeys.privateKey.d, currentKeys.privateKey.n);
        decryptedAscii.push(decryptedNum);
        decrypted += String.fromCharCode(decryptedNum);

        stepsHtml += `
            <div class="decryption-step">
                <h4>Decrypting ${encryptedNum}:</h4>
                <p>m = ${encryptedNum}^${currentKeys.privateKey.d} mod ${currentKeys.privateKey.n} = ${decryptedNum}</p>
            </div>
        `;
    }

    stepsHtml += `<p>Decrypted ASCII values: ${decryptedAscii.join(', ')}</p>`;
    stepsHtml += `<p>Decrypted message: "${decrypted}"</p>`;
    stepsHtml += '</div>';

    document.getElementById('decryptedResult').innerHTML = `
        <div class="result-container">
            <h3>Decrypted Message:</h3>
            <textarea>${decrypted}</textarea>
            <button onclick="toggleDecryptionSteps()">Show/Hide Decryption Steps</button>
            <div id="decryptionSteps" style="display: none;">
                ${stepsHtml}
            </div>
        </div>
    `;
}

function toggleDecryptionSteps() {
    const stepsDiv = document.getElementById('decryptionSteps');
    stepsDiv.style.display = stepsDiv.style.display === 'none' ? 'block' : 'none';
}

// Helper functions
function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}

function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return 1;
}

