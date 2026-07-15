/* REVOGUE - shared local storage helpers (school project: no backend, everything lives in the browser) */

const DB_KEYS = {
  USERS: 'revogue_users',
  SESSION: 'revogue_session',
  CLOSET_PREFIX: 'revogue_closet_',
  HISTORY_PREFIX: 'revogue_history_'
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

const Store = {
  getUsers() {
    return readJSON(DB_KEYS.USERS, []);
  },
  saveUsers(users) {
    writeJSON(DB_KEYS.USERS, users);
  },
  findUserByEmail(email) {
    return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
  },
  createUser(user) {
    const users = this.getUsers();
    const newUser = { id: 'u_' + Date.now().toString(36), createdAt: Date.now(), ...user };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  },
  updateUser(userId, patch) {
    const users = this.getUsers();
    const idx = users.findIndex(u => u.id === userId);
    if (idx > -1) {
      users[idx] = { ...users[idx], ...patch };
      this.saveUsers(users);
      return users[idx];
    }
    return null;
  },

  getSession() {
    return readJSON(DB_KEYS.SESSION, null);
  },
  setSession(userId) {
    writeJSON(DB_KEYS.SESSION, { userId });
  },
  clearSession() {
    localStorage.removeItem(DB_KEYS.SESSION);
  },
  getCurrentUser() {
    const session = this.getSession();
    if (!session) return null;
    return this.getUsers().find(u => u.id === session.userId) || null;
  },

  getCloset(userId) {
    return readJSON(DB_KEYS.CLOSET_PREFIX + userId, []);
  },
  saveCloset(userId, items) {
    writeJSON(DB_KEYS.CLOSET_PREFIX + userId, items);
  },

  getHistory(userId) {
    return readJSON(DB_KEYS.HISTORY_PREFIX + userId, []);
  },
  saveHistory(userId, items) {
    writeJSON(DB_KEYS.HISTORY_PREFIX + userId, items.slice(0, 6));
  }
};

function randomSeed() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickRandomN(arr, n) {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < n) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
}

function picsum(seed, w, h) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${w}/${h}`;
}

function amazonSearchUrl(query) {
  return `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
}
