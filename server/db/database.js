const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_FILE = path.join(__dirname, 'qa_platform.json');
const ENCRYPTION_KEY = crypto.scryptSync('apk-qa-secret-key-2026', 'salt', 32);

class DatabaseEngine {
  constructor() {
    this.data = {
      users: [],
      projects: [],
      apks: [],
      test_credentials: [],
      test_runs: [],
      test_cases: [],
      test_steps: [],
      findings: [],
      evidence: [],
      reports: [],
      audit_logs: []
    };
    this.init();
  }

  init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        this.data = { ...this.data, ...parsed };
      } catch (err) {
        console.error('Error loading DB, creating fresh schema:', err);
        this.save();
      }
    } else {
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (err) {
      console.error('Error saving DB:', err);
    }
  }

  // --- Encryption Helpers for Test Credentials ---
  encryptPassword(plainText) {
    if (!plainText) return '';
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${iv.toString('hex')}:${encrypted}`;
  }

  decryptPassword(encryptedText) {
    if (!encryptedText || !encryptedText.includes(':')) return '';
    const [ivHex, encrypted] = encryptedText.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  // --- Generic CRUD helpers ---
  find(table, filterFn) {
    if (!this.data[table]) return [];
    if (!filterFn) return [...this.data[table]];
    return this.data[table].filter(filterFn);
  }

  findOne(table, filterFn) {
    if (!this.data[table]) return null;
    return this.data[table].find(filterFn) || null;
  }

  insert(table, item) {
    if (!this.data[table]) this.data[table] = [];
    const now = new Date().toISOString();
    const newItem = {
      id: item.id || `${table.substring(0, 3).toUpperCase()}-${crypto.randomBytes(4).toString('hex')}`,
      ...item,
      created_at: item.created_at || now,
      updated_at: item.updated_at || now
    };
    this.data[table].unshift(newItem);
    this.save();
    return newItem;
  }

  update(table, id, updates) {
    if (!this.data[table]) return null;
    const index = this.data[table].findIndex(item => item.id === id);
    if (index === -1) return null;

    this.data[table][index] = {
      ...this.data[table][index],
      ...updates,
      updated_at: new Date().toISOString()
    };
    this.save();
    return this.data[table][index];
  }

  delete(table, id) {
    if (!this.data[table]) return false;
    const initialLen = this.data[table].length;
    this.data[table] = this.data[table].filter(item => item.id !== id);
    const deleted = this.data[table].length < initialLen;
    if (deleted) this.save();
    return deleted;
  }

  logAudit(userId, action, details) {
    this.insert('audit_logs', {
      user_id: userId || 'SYSTEM',
      action,
      details: typeof details === 'object' ? JSON.stringify(details) : String(details),
      timestamp: new Date().toISOString()
    });
  }
}

const db = new DatabaseEngine();
module.exports = db;
