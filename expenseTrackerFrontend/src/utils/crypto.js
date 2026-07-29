// convert raw password or PIN strring into a key derivation base
async function getPasswordKey(secret){
    const enc=new TextEncoder();
    return window.crypto.subtle.importKey(
        "raw",
        enc.encode(secret),
        "PBKDF2",
        false,
        ["deriveKey"]
    );
}

// Derive a secure 256-bit AES key using PBKDF2  
async function deriveKey(passwordKey, salt) {
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 250000, // High iteration count prevents brute-force attacks
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}


// encrypts the data using the users password or PIN
export async function encryptData(data, secret) {
    const enc = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16)); // Random Salt
    const iv = window.crypto.getRandomValues(new Uint8Array(12));   // Random IV

    const passwordKey = await getPasswordKey(secret);
    const aesKey = await deriveKey(passwordKey, salt);

    const encryptedContent = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv: iv },
        aesKey,
        enc.encode(JSON.stringify(data))
    );

    // Combine Salt + IV + Encrypted Data into one array
    const combined = new Uint8Array(salt.byteLength + iv.byteLength + encryptedContent.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.byteLength);
    combined.set(new Uint8Array(encryptedContent), salt.byteLength + iv.byteLength);

    // Return Base64 string for database storage
    return btoa(String.fromCharCode(...combined));
}


// Decrypts data using the users password or PIN
export async function decryptData(encryptedBase64, secret) {
    try {
        const combined = new Uint8Array(atob(encryptedBase64).split('').map(c => c.charCodeAt(0)));

        const salt = combined.slice(0, 16);
        const iv = combined.slice(16, 28);
        const data = combined.slice(28);

        const passwordKey = await getPasswordKey(secret);
        const aesKey = await deriveKey(passwordKey, salt);

        const decryptedContent = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv: iv },
            aesKey,
            data
        );

        const dec = new TextDecoder();
        return JSON.parse(dec.decode(decryptedContent));
    } catch (error) {
        throw new Error("Invalid PIN/Password or corrupted data.");
    }
}