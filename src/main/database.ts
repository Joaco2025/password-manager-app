import { app } from 'electron'
import { join } from 'path'
import Database from 'better-sqlite3'

const dbPath = join(app.getPath('userData'), 'myvault.db')
const db = new Database(dbPath, { verbose: console.log })
db.pragma('journal_mode = WAL')

export function initDB() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS master_account (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      username TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  db.exec(`
    CREATE TABLE IF NOT EXISTS entries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_name TEXT NOT NULL,
      service_id TEXT NOT NULL,
      email TEXT NOT NULL,
      username TEXT,
      encrypted_password TEXT NOT NULL,
      iv TEXT NOT NULL,
      auth_tag TEXT NOT NULL,
      category TEXT DEFAULT 'all',
      website_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)
}

export function hasMasterAccount() {
  const stmt = db.prepare('SELECT count(*) as count FROM master_account')
  const result = stmt.get() as { count: number }
  return result.count > 0
}

export function getMasterUsername(): string | null {
  const stmt = db.prepare('SELECT username FROM master_account WHERE id = 1')
  const result = stmt.get() as { username: string } | undefined
  return result ? result.username : null
}

export function createMasterAccount(username: string, hash: string, salt: string) {
  const stmt = db.prepare('INSERT INTO master_account (id, username, password_hash, salt) VALUES (1, ?, ?, ?)')
  return stmt.run(username, hash, salt)
}

export function getMasterAuthData() {
  const stmt = db.prepare('SELECT password_hash, salt FROM master_account WHERE id = 1')
  return stmt.get()
}

// === ENTRIES ===

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
  return db.prepare('SELECT * FROM entries ORDER BY id DESC').all()
}

// NUEVA FUNCIÓN: Eliminar
export function deleteEntry(id: number) {
  const stmt = db.prepare('DELETE FROM entries WHERE id = ?')
  return stmt.run(id)
}