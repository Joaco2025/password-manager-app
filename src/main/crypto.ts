// src/main/crypto.ts
import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv } from 'node:crypto'

// CONFIGURACIÓN DE SEGURIDAD (ESTÁNDARES 2025)
const ALGORITHM = 'aes-256-gcm' 
const KEY_LENGTH = 32           // 256 bits
const IV_LENGTH = 12            // Estándar para GCM
const SALT_LENGTH = 16          
const ITERATIONS = 100000       // Costo de CPU para evitar fuerza bruta
const DIGEST = 'sha512'         

export const CryptoService = {
  
  // 1. Generar Sal aleatoria (Para que dos passwords iguales tengan hash distinto)
  generateSalt: (): string => {
    return randomBytes(SALT_LENGTH).toString('hex')
  },

  // 2. Derivar Llave Maestra (Convierte tu password "gato" en una llave de 32 bytes)
  deriveKey: (password: string, salt: string): Buffer => {
    return pbkdf2Sync(password, salt, ITERATIONS, KEY_LENGTH, DIGEST)
  },

  // 3. Hashear Password (Para verificar Login - Solo ida)
  hashPassword: (password: string, salt: string): string => {
    return pbkdf2Sync(password, salt, ITERATIONS, 64, DIGEST).toString('hex')
  },

  // 4. ENCRIPTAR DATO (Para guardar en BD - Ida y vuelta)
  encrypt: (text: string, masterKey: Buffer) => {
    const iv = randomBytes(IV_LENGTH)
    const cipher = createCipheriv(ALGORITHM, masterKey, iv)

    let encrypted = cipher.update(text, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    const authTag = cipher.getAuthTag().toString('hex')

    return {
      content: encrypted,
      iv: iv.toString('hex'),
      tag: authTag
    }
  },

  // 5. DESENCRIPTAR DATO (Para mostrar en UI)
  decrypt: (encryptedContent: string, ivHex: string, authTagHex: string, masterKey: Buffer): string => {
    const decipher = createDecipheriv(ALGORITHM, masterKey, Buffer.from(ivHex, 'hex'))
    decipher.setAuthTag(Buffer.from(authTagHex, 'hex'))

    let decrypted = decipher.update(encryptedContent, 'hex', 'utf8')
    decrypted += decipher.final('utf8') // Si el tag no coincide, esto lanza error (datos corruptos/hackeados)
    
    return decrypted
  }
}