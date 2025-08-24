/**
 * Security Utilities
 * Handles encryption, decryption, and security operations for consent management
 */

import CryptoJS from 'crypto-js';

class SecurityUtils {
  constructor() {
    this.algorithm = 'AES-256-GCM';
    this.keySize = 256;
    this.ivSize = 12;
    this.tagSize = 16;
  }

  /**
   * Generate a random encryption key
   * @param {number} length - Key length in bytes
   * @returns {string} - Base64 encoded key
   */
  generateKey(length = 32) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return btoa(String.fromCharCode(...array));
  }

  /**
   * Generate a random initialization vector
   * @returns {string} - Base64 encoded IV
   */
  generateIV() {
    return this.generateKey(this.ivSize);
  }

  /**
   * Hash data using SHA-256
   * @param {string} data - Data to hash
   * @returns {string} - SHA-256 hash
   */
  hashData(data) {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Hash data with salt
   * @param {string} data - Data to hash
   * @param {string} salt - Salt for hashing
   * @returns {string} - Salted hash
   */
  hashWithSalt(data, salt) {
    return CryptoJS.PBKDF2(data, salt, {
      keySize: 256 / 32,
      iterations: 1000
    }).toString();
  }

  /**
   * Encrypt data using AES-256-GCM
   * @param {string} data - Data to encrypt
   * @param {string} key - Encryption key (base64)
   * @returns {Object} - Encrypted data with IV and tag
   */
  async encryptData(data, key) {
    try {
      const iv = this.generateIV();
      const encodedKey = atob(key);
      const encodedData = new TextEncoder().encode(data);
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        new Uint8Array(encodedKey.split('').map(c => c.charCodeAt(0))),
        { name: 'AES-GCM' },
        false,
        ['encrypt']
      );

      const encrypted = await crypto.subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: new Uint8Array(atob(iv).split('').map(c => c.charCodeAt(0)))
        },
        cryptoKey,
        encodedData
      );

      const encryptedArray = new Uint8Array(encrypted);
      const tag = encryptedArray.slice(-this.tagSize);
      const ciphertext = encryptedArray.slice(0, -this.tagSize);

      return {
        ciphertext: btoa(String.fromCharCode(...ciphertext)),
        iv: iv,
        tag: btoa(String.fromCharCode(...tag))
      };
    } catch (error) {
      console.error('Encryption failed:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  /**
   * Decrypt data using AES-256-GCM
   * @param {Object} encryptedData - Encrypted data object
   * @param {string} key - Decryption key (base64)
   * @returns {string} - Decrypted data
   */
  async decryptData(encryptedData, key) {
    try {
      const { ciphertext, iv, tag } = encryptedData;
      const encodedKey = atob(key);
      
      const cryptoKey = await crypto.subtle.importKey(
        'raw',
        new Uint8Array(encodedKey.split('').map(c => c.charCodeAt(0))),
        { name: 'AES-GCM' },
        false,
        ['decrypt']
      );

      const ciphertextArray = new Uint8Array(atob(ciphertext).split('').map(c => c.charCodeAt(0)));
      const tagArray = new Uint8Array(atob(tag).split('').map(c => c.charCodeAt(0)));
      const ivArray = new Uint8Array(atob(iv).split('').map(c => c.charCodeAt(0)));

      const combined = new Uint8Array(ciphertextArray.length + tagArray.length);
      combined.set(ciphertextArray);
      combined.set(tagArray, ciphertextArray.length);

      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivArray
        },
        cryptoKey,
        combined
      );

      return new TextDecoder().decode(decrypted);
    } catch (error) {
      console.error('Decryption failed:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  /**
   * Encrypt sensitive consent data
   * @param {Object} consentData - Consent data to encrypt
   * @param {string} key - Encryption key
   * @returns {Object} - Encrypted consent data
   */
  async encryptConsentData(consentData, key) {
    const sensitiveFields = ['documentHash', 'requester', 'permissions'];
    const encryptedData = { ...consentData };

    for (const field of sensitiveFields) {
      if (encryptedData[field]) {
        const encrypted = await this.encryptData(
          JSON.stringify(encryptedData[field]),
          key
        );
        encryptedData[field] = encrypted;
      }
    }

    return encryptedData;
  }

  /**
   * Decrypt sensitive consent data
   * @param {Object} encryptedConsentData - Encrypted consent data
   * @param {string} key - Decryption key
   * @returns {Object} - Decrypted consent data
   */
  async decryptConsentData(encryptedConsentData, key) {
    const sensitiveFields = ['documentHash', 'requester', 'permissions'];
    const decryptedData = { ...encryptedConsentData };

    for (const field of sensitiveFields) {
      if (decryptedData[field] && typeof decryptedData[field] === 'object') {
        try {
          const decrypted = await this.decryptData(decryptedData[field], key);
          decryptedData[field] = JSON.parse(decrypted);
        } catch (error) {
          console.warn(`Failed to decrypt field ${field}:`, error);
        }
      }
    }

    return decryptedData;
  }

  /**
   * Generate a secure random string
   * @param {number} length - Length of the string
   * @returns {string} - Random string
   */
  generateRandomString(length = 32) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return result;
  }

  /**
   * Generate a secure password hash
   * @param {string} password - Password to hash
   * @param {string} salt - Salt for hashing
   * @returns {string} - Hashed password
   */
  hashPassword(password, salt) {
    return this.hashWithSalt(password, salt);
  }

  /**
   * Verify password against hash
   * @param {string} password - Password to verify
   * @param {string} hash - Stored hash
   * @param {string} salt - Salt used for hashing
   * @returns {boolean} - True if password matches
   */
  verifyPassword(password, hash, salt) {
    const computedHash = this.hashPassword(password, salt);
    return computedHash === hash;
  }

  /**
   * Generate a digital signature
   * @param {string} data - Data to sign
   * @param {string} privateKey - Private key for signing
   * @returns {string} - Digital signature
   */
  async generateSignature(data, privateKey) {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      const key = await crypto.subtle.importKey(
        'pkcs8',
        new Uint8Array(atob(privateKey).split('').map(c => c.charCodeAt(0))),
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256'
        },
        false,
        ['sign']
      );

      const signature = await crypto.subtle.sign(
        'RSASSA-PKCS1-v1_5',
        key,
        dataBuffer
      );

      return btoa(String.fromCharCode(...new Uint8Array(signature)));
    } catch (error) {
      console.error('Signature generation failed:', error);
      throw new Error('Failed to generate signature');
    }
  }

  /**
   * Verify digital signature
   * @param {string} data - Original data
   * @param {string} signature - Digital signature
   * @param {string} publicKey - Public key for verification
   * @returns {boolean} - True if signature is valid
   */
  async verifySignature(data, signature, publicKey) {
    try {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      
      const key = await crypto.subtle.importKey(
        'spki',
        new Uint8Array(atob(publicKey).split('').map(c => c.charCodeAt(0))),
        {
          name: 'RSASSA-PKCS1-v1_5',
          hash: 'SHA-256'
        },
        false,
        ['verify']
      );

      const signatureBuffer = new Uint8Array(atob(signature).split('').map(c => c.charCodeAt(0)));

      return await crypto.subtle.verify(
        'RSASSA-PKCS1-v1_5',
        key,
        signatureBuffer,
        dataBuffer
      );
    } catch (error) {
      console.error('Signature verification failed:', error);
      return false;
    }
  }

  /**
   * Sanitize user input
   * @param {string} input - User input to sanitize
   * @returns {string} - Sanitized input
   */
  sanitizeInput(input) {
    if (typeof input !== 'string') return input;
    
    return input
      .replace(/[<>]/g, '') // Remove < and >
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim();
  }

  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - True if email is valid
   */
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check password strength
   * @param {string} password - Password to check
   * @returns {Object} - Password strength analysis
   */
  checkPasswordStrength(password) {
    const analysis = {
      score: 0,
      feedback: [],
      isStrong: false
    };

    if (password.length < 8) {
      analysis.feedback.push('Password should be at least 8 characters long');
    } else {
      analysis.score += 1;
    }

    if (/[a-z]/.test(password)) {
      analysis.score += 1;
    } else {
      analysis.feedback.push('Include lowercase letters');
    }

    if (/[A-Z]/.test(password)) {
      analysis.score += 1;
    } else {
      analysis.feedback.push('Include uppercase letters');
    }

    if (/[0-9]/.test(password)) {
      analysis.score += 1;
    } else {
      analysis.feedback.push('Include numbers');
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      analysis.score += 1;
    } else {
      analysis.feedback.push('Include special characters');
    }

    analysis.isStrong = analysis.score >= 4;
    return analysis;
  }
}

// Create singleton instance
const securityUtils = new SecurityUtils();

export default securityUtils; 