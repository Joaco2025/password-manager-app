// src/main/auth.ts
import { 
  createMasterAccount, 
  getMasterAuthData, 
  hasMasterAccount, 
  getMasterUsername
} from './database'
import { CryptoService } from './crypto'

// VARIABLE DE MEMORIA RAM (Volátil)
// Aquí guardaremos la llave maestra desencriptada mientras la app está abierta.
// Si cierras la app, esta variable se borra (seguridad por diseño).
let sessionKey: Buffer | null = null

export const AuthService = {
  
  // 1. Verificar si la app ya está configurada
  isAppConfigured: () => {
    return getMasterUsername()
  },

  // 2. REGISTRO (Crear cuenta maestra)
  register: (username: string, password: string) => {
    // A. Generamos una sal aleatoria
    const salt = CryptoService.generateSalt()
    
    // B. Hasheamos la contraseña para guardarla en BD (Login futuro)
    const passwordHash = CryptoService.hashPassword(password, salt)
    
    // C. Guardamos en Base de Datos
    createMasterAccount(username, passwordHash, salt)
    
    // D. Iniciamos sesión automáticamente (Derivamos la llave AES)
    sessionKey = CryptoService.deriveKey(password, salt)
    
    return true
  },

  // 3. LOGIN (Iniciar sesión)
  login: (password: string) => {
    // A. Buscamos los datos de seguridad del usuario en la BD
    const authData = getMasterAuthData()
    
    if (!authData) return false // No existe usuario

    // B. Intentamos reproducir el hash con la contraseña que nos dieron
    const attemptHash = CryptoService.hashPassword(password, authData.salt)

    // C. Comparamos: ¿Es igual al hash guardado?
    if (attemptHash === authData.password_hash) {
      // ¡ÉXITO! Contraseña correcta.
      // D. Derivamos la llave maestra real y la guardamos en RAM
      sessionKey = CryptoService.deriveKey(password, authData.salt)
      return true
    }

    return false // Contraseña incorrecta
  },

  // 4. CERRAR SESIÓN (Borrar llave de memoria)
  logout: () => {
    sessionKey = null
  },

  // 5. OBTENER LLAVE (Para usarla al guardar/leer contraseñas)
  getSessionKey: () => {
    if (!sessionKey) throw new Error('NO_AUTHORIZED: No hay sesión activa')
    return sessionKey
  }
}