import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-Memory Database Stores for Simulation
interface UserAccount {
  id: string;
  email: string;
  passwordHash: string;
  provider: string;
  isGuest: boolean;
  emailVerified: boolean;
  twoFactorEnabled: boolean;
  twoFactorSecret?: string;
  renameTickets: number;
  createdAt: string;
}

interface SessionRecord {
  id: string;
  userId: string;
  deviceName: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  browser: string;
  ipAddress: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

interface CharacterRecord {
  id: string;
  userId: string;
  name: string;
  characterClass: 'Warrior' | 'Mage' | 'Archer' | 'Assassin' | 'Paladin';
  level: number;
  serverName: string;
  customization: {
    hairStyle: number;
    hairColor: string;
    skinTone: string;
    outfitColor: string;
    weaponGlow: string;
  };
  stats: {
    hp: number;
    mp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  lastPlayed: string;
  createdAt: string;
}

interface CloudSaveRecord {
  userId: string;
  timestamp: string;
  level: number;
  gold: number;
  inventoryCount: number;
  zone: string;
  playtimeMinutes: number;
  hash: string;
}

const users: Map<string, UserAccount> = new Map();
const sessions: Map<string, SessionRecord> = new Map();
const characters: Map<string, CharacterRecord[]> = new Map();
const cloudSaves: Map<string, CloudSaveRecord> = new Map();

// Rate limiting & Brute force simulation
const failedAttempts: Map<string, { count: number; lockedUntil: number }> = new Map();

// Seed initial default demo user
const demoUserId = "usr_demo_777";
users.set("demo@aetheria.io", {
  id: demoUserId,
  email: "demo@aetheria.io",
  passwordHash: "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vj.3pP.yie", // "password123"
  provider: "email",
  isGuest: false,
  emailVerified: true,
  twoFactorEnabled: false,
  renameTickets: 2,
  createdAt: new Date().toISOString(),
});

characters.set(demoUserId, [
  {
    id: "char_101",
    userId: demoUserId,
    name: "Valerius",
    characterClass: "Paladin",
    level: 42,
    serverName: "Aetheria-East-1",
    customization: { hairStyle: 1, hairColor: "#facc15", skinTone: "#fde047", outfitColor: "#3b82f6", weaponGlow: "#60a5fa" },
    stats: { hp: 3200, mp: 1400, attack: 450, defense: 620, speed: 120 },
    lastPlayed: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "char_102",
    userId: demoUserId,
    name: "Astraea",
    characterClass: "Mage",
    level: 38,
    serverName: "Aetheria-East-1",
    customization: { hairStyle: 3, hairColor: "#ec4899", skinTone: "#f3e8ff", outfitColor: "#8b5cf6", weaponGlow: "#c084fc" },
    stats: { hp: 1800, mp: 4200, attack: 780, defense: 290, speed: 150 },
    lastPlayed: new Date(Date.now() - 86400000).toISOString(),
    createdAt: new Date().toISOString(),
  },
]);

cloudSaves.set(demoUserId, {
  userId: demoUserId,
  timestamp: new Date().toISOString(),
  level: 42,
  gold: 154200,
  inventoryCount: 48,
  zone: "village",
  playtimeMinutes: 1240,
  hash: "a8f9c12e5d7b301a",
});

sessions.set("sess_current_1", {
  id: "sess_current_1",
  userId: demoUserId,
  deviceName: "Chrome / Windows 11 Desktop",
  deviceType: "Desktop",
  browser: "Chrome v126",
  ipAddress: "192.168.1.100",
  location: "United States (Cloud)",
  lastActive: "Just now",
  isCurrent: true,
});

sessions.set("sess_mobile_2", {
  id: "sess_mobile_2",
  userId: demoUserId,
  deviceName: "iPhone 15 Pro Max",
  deviceType: "Mobile",
  browser: "Safari iOS",
  ipAddress: "203.0.113.45",
  location: "Tokyo, Japan",
  lastActive: "2 hours ago",
  isCurrent: false,
});

// helper JWT generator
function generateJWT(userId: string, email: string) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      sub: userId,
      email,
      iss: "aetheria-auth-server",
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    })
  ).toString("base64url");
  const signature = Buffer.from(`secret_sign_${userId}`).toString("base64url");
  return {
    accessToken: `${header}.${payload}.${signature}`,
    refreshToken: `ref_${Buffer.from(`${userId}_${Date.now()}`).toString("base64url")}`,
    expiresIn: 3600,
  };
}

// REST API ROUTES
app.post("/api/auth/login", (req, res) => {
  const { email, password, provider } = req.body;

  // Rate Limiter Check
  const lock = failedAttempts.get(email);
  if (lock && lock.lockedUntil > Date.now()) {
    const remainingSecs = Math.ceil((lock.lockedUntil - Date.now()) / 1000);
    return res.status(429).json({
      error: "ACCOUNT_LOCKED",
      message: `Account temporarily locked due to failed attempts. Retry in ${remainingSecs} seconds.`,
      remainingSecs,
    });
  }

  // Social or Guest Login
  if (provider && provider !== "email") {
    let user = Array.from(users.values()).find((u) => u.email === email);
    if (!user) {
      const newId = `usr_${Date.now()}`;
      user = {
        id: newId,
        email: email || `guest_${Date.now()}@aetheria.io`,
        passwordHash: "$2b$10$social_auth_hash",
        provider,
        isGuest: provider === "guest",
        emailVerified: true,
        twoFactorEnabled: false,
        renameTickets: 1,
        createdAt: new Date().toISOString(),
      };
      users.set(user.email, user);
      characters.set(newId, []);
    }

    const tokens = generateJWT(user.id, user.email);
    return res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.email.split("@")[0],
        provider: user.provider,
        isGuest: user.isGuest,
        emailVerified: user.emailVerified,
        twoFactorEnabled: user.twoFactorEnabled,
        renameTickets: user.renameTickets,
        createdAt: user.createdAt,
      },
      tokens,
    });
  }

  // Email/Password login
  const user = users.get(email);
  if (!user || (password !== "password123" && password !== "demo123")) {
    const attempts = (lock?.count || 0) + 1;
    if (attempts >= 4) {
      failedAttempts.set(email, { count: attempts, lockedUntil: Date.now() + 30000 }); // 30s lock
      return res.status(429).json({
        error: "ACCOUNT_LOCKED",
        message: "Too many failed attempts. Account locked for 30 seconds.",
        remainingSecs: 30,
      });
    } else {
      failedAttempts.set(email, { count: attempts, lockedUntil: 0 });
      return res.status(401).json({
        error: "INVALID_CREDENTIALS",
        message: `Invalid email or password. (${4 - attempts} attempts remaining)`,
      });
    }
  }

  // Clear failed attempts on success
  failedAttempts.delete(email);

  if (user.twoFactorEnabled) {
    return res.json({
      require2FA: true,
      userId: user.id,
      message: "Please enter your 2FA 6-digit authenticator code.",
    });
  }

  const tokens = generateJWT(user.id, user.email);
  res.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.email.split("@")[0],
      provider: user.provider,
      isGuest: user.isGuest,
      emailVerified: user.emailVerified,
      twoFactorEnabled: user.twoFactorEnabled,
      renameTickets: user.renameTickets,
      createdAt: user.createdAt,
    },
    tokens,
  });
});

app.post("/api/auth/register", (req, res) => {
  const { email, password } = req.body;
  if (users.has(email)) {
    return res.status(400).json({ error: "EMAIL_EXISTS", message: "An account with this email already exists." });
  }

  const userId = `usr_${Date.now()}`;
  const newUser: UserAccount = {
    id: userId,
    email,
    passwordHash: `$2b$10$hash_${Date.now()}`,
    provider: "email",
    isGuest: false,
    emailVerified: false,
    twoFactorEnabled: false,
    renameTickets: 1,
    createdAt: new Date().toISOString(),
  };

  users.set(email, newUser);
  characters.set(userId, []);

  const tokens = generateJWT(userId, email);
  res.json({
    user: {
      id: userId,
      email,
      username: email.split("@")[0],
      provider: "email",
      isGuest: false,
      emailVerified: false,
      twoFactorEnabled: false,
      renameTickets: 1,
      createdAt: newUser.createdAt,
    },
    tokens,
  });
});

app.get("/api/auth/sessions", (req, res) => {
  res.json(Array.from(sessions.values()));
});

app.delete("/api/auth/sessions/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  sessions.delete(sessionId);
  res.json({ success: true, message: "Session revoked successfully." });
});

app.get("/api/characters", (req, res) => {
  const userId = (req.query.userId as string) || demoUserId;
  const userChars = characters.get(userId) || [];
  res.json(userChars);
});

app.post("/api/characters", (req, res) => {
  const { userId = demoUserId, name, characterClass, customization, serverName } = req.body;
  const userChars = characters.get(userId) || [];

  if (userChars.length >= 5) {
    return res.status(400).json({ error: "MAX_CHARACTERS", message: "Maximum 5 character slots per account." });
  }

  const newChar: CharacterRecord = {
    id: `char_${Date.now()}`,
    userId,
    name,
    characterClass,
    level: 1,
    serverName: serverName || "Aetheria-East-1",
    customization,
    stats: { hp: 1200, mp: 600, attack: 150, defense: 120, speed: 100 },
    lastPlayed: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  userChars.push(newChar);
  characters.set(userId, userChars);
  res.json(newChar);
});

app.delete("/api/characters/:charId", (req, res) => {
  const { charId } = req.params;
  const userId = (req.query.userId as string) || demoUserId;
  let userChars = characters.get(userId) || [];

  userChars = userChars.filter((c) => c.id !== charId);
  characters.set(userId, userChars);
  res.json({ success: true, message: "Character deleted." });
});

app.post("/api/characters/:charId/rename", (req, res) => {
  const { charId } = req.params;
  const { newName, userId = demoUserId } = req.body;
  const userChars = characters.get(userId) || [];
  const char = userChars.find((c) => c.id === charId);

  if (!char) {
    return res.status(404).json({ error: "NOT_FOUND", message: "Character not found." });
  }

  char.name = newName;
  res.json({ success: true, character: char });
});

app.get("/api/cloud-save", (req, res) => {
  const userId = (req.query.userId as string) || demoUserId;
  const save = cloudSaves.get(userId) || {
    userId,
    timestamp: new Date().toISOString(),
    level: 1,
    gold: 500,
    inventoryCount: 5,
    zone: "village",
    playtimeMinutes: 10,
    hash: "initial_save_hash",
  };
  res.json(save);
});

app.post("/api/cloud-save", (req, res) => {
  const { userId = demoUserId, level, gold, inventoryCount, zone, playtimeMinutes } = req.body;
  const newSave: CloudSaveRecord = {
    userId,
    timestamp: new Date().toISOString(),
    level,
    gold,
    inventoryCount,
    zone,
    playtimeMinutes,
    hash: Math.random().toString(36).substring(2, 10),
  };
  cloudSaves.set(userId, newSave);
  res.json({ success: true, save: newSave });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Aetheria RPG Core Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
