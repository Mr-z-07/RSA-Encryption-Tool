# RSA-Encryption-Tool
An RSA Encryption Tool securely encrypts and decrypts messages using the RSA public-key cryptographic algorithm.

# RSA Encryption Project

A web-based implementation of the RSA (Rivest-Shamir-Adleman) encryption algorithm. This project provides a user-friendly interface for generating RSA keys, encrypting messages, and decrypting ciphertext.

## Features

- Generate RSA key pairs with customizable bit length
- Encrypt plaintext messages using the public key
- Decrypt ciphertext using the private key
- User-friendly web interface
- Support for alphanumeric characters and basic punctuation

## Mathematical Steps

### Key Generation
1. **Choose Prime Numbers (p, q)**
   - Select two distinct large prime numbers
   - In this implementation, primes are generated based on the selected bit length

2. **Calculate Modulus (n)**
   - n = p × q
   - This is part of both public and private keys

3. **Calculate Euler's Totient (φ(n))**
   - φ(n) = (p - 1) × (q - 1)
   - Used to find the public and private exponents

4. **Choose Public Exponent (e)**
   - Default is 65537 (commonly used)
   - Must be coprime with φ(n)
   - 1 < e < φ(n)

5. **Calculate Private Exponent (d)**
   - Find d such that (d × e) mod φ(n) = 1
   - d is the modular multiplicative inverse of e modulo φ(n)

### Encryption Process
- For each character in the message:
  1. Convert to numerical value (m) using character set index
  2. Calculate ciphertext: c = m^e mod n
  3. Result is a series of numbers representing encrypted characters

### Decryption Process
- For each number in the ciphertext:
  1. Calculate: m = c^d mod n
  2. Convert numerical result back to character
  3. Concatenate characters to recover original message

## How to Use

1. **Generate Keys**
   - Select the desired bit length for your keys
   - Click the "Generate Keys" button
   - Your public and private keys will be displayed

2. **Encrypt a Message**
   - Enter your plaintext message in the encryption tab
   - Click "Encrypt"
   - The encrypted ciphertext will be displayed

3. **Decrypt a Message**
   - Enter the ciphertext in the decryption tab
   - Click "Decrypt"
   - The decrypted message will be displayed

## Technical Details

- The project uses JavaScript for all cryptographic operations
- Implements modular exponentiation for efficient encryption/decryption
- Uses a character set of 65 characters (A-Z, a-z, 0-9, and basic punctuation)
- Default public exponent (e) is 65537, with fallback to smaller values if needed

## Files

- `index.html` - The main interface
- `app.js` - Core RSA implementation and UI logic
- `style.css` - Styling for the web interface

## Security Notes

- This is an educational implementation and should not be used for production security
- The key generation uses JavaScript's Math.random() which is not cryptographically secure
- For real-world applications, use established cryptographic libraries

## Browser Compatibility

The project should work in all modern browsers that support JavaScript.

## License

This project is open source and available for educational purposes. 
