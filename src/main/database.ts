import { app } from 'electron'
import { join } from 'path'
import Database from 'better-sqlite3'

// 1. Ubicación segura
const dbPath = join(app.getPath('userData'), 'myvault.db')
const db = new Database(dbPath, { verbose: console.log }) // verbose ayuda a ver errores en consola
db.pragma('journal_mode = WAL') // Modo rápido y seguro

// 2. Inicializar Tablas
export function initDB() {
  
  // A. Tabla Maestra (Tu Login)
  db.exec(`
    CREATE TABLE IF NOT EXISTS master_account (
      id INTEGER PRIMARY KEY CHECK (id = 1), -- Solo permitimos 1 usuario maestro
      password_hash TEXT NOT NULL,           -- Hash para verificar login
      salt TEXT NOT NULL,                    -- Semilla para criptografía
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  // B. Tabla de Entradas (Tus Passwords)
  db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_name TEXT NOT NULL,
      service_id TEXT NOT NULL,      -- Para los logos (ej. 'netflix', 'custom')
      email TEXT NOT NULL,
      username TEXT,                 -- Puede ser NULL
      encrypted_password TEXT NOT NULL,
      iv TEXT NOT NULL,              -- Vector de Inicialización (Crypto)
      auth_tag TEXT NOT NULL,        -- Tag de Autenticación (Crypto)
      category TEXT DEFAULT 'all',
      website_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
}

// === FUNCIONES PARA EL MAESTRO (LOGIN) ===

// Verificar si ya existe un usuario (para saber si mostrar pantalla de Registro o Login)
export function hasMasterAccount() {
  const stmt = db.prepare('SELECT count(*) as count FROM master_account')
  const result = stmt.get() as { count: number }
  return result.count > 0
}

// Crear el usuario maestro (Solo la primera vez)
export function createMasterAccount(hash: string, salt: string) {
  const stmt = db.prepare('INSERT INTO master_account (id, password_hash, salt) VALUES (1, ?, ?)')
  return stmt.run(hash, salt)
}

// Obtener los datos de seguridad para intentar login
export function getMasterAuthData() {
  const stmt = db.prepare('SELECT password_hash, salt FROM master_account WHERE id = 1')
  return stmt.get()
}

// === FUNCIONES PARA LAS ENTRADAS (CRUD) ===

export interface NewEntryParams {
  service_name: string
  service_id: string
  email: string
  username?: string
  encrypted_password: string
  iv: string
  auth_tag: string
  category: string
  website_url?: string
}

export function addEntry(data: NewEntryParams) {
  const stmt = db.prepare(`
    INSERT INTO entries (
      service_name, service_id, email, username, 
      encrypted_password, iv, auth_tag, category, website_url
    ) VALUES (
      @service_name, @service_id, @email, @username, 
      @encrypted_password, @iv, @auth_tag, @category, @website_url
    )
  `)
  return stmt.run(data)
}

export function getAllEntries() {
  // OJO: Aquí devolvemos todo MENOS la contraseña desencriptada, 
  // esa solo se revela cuando el usuario la pide explícitamente.
  return db.prepare('SELECT * FROM entries ORDER BY id DESC').all()
}