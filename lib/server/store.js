import { promises as fs } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import {
  ADMIN_CREDENTIALS,
  defaultAnnouncements,
  defaultChallenges,
  defaultClubs,
  defaultEvents,
  defaultGallery,
  defaultProjects,
  defaultTeam
} from "../storage";

const dataDir = path.join(process.cwd(), "data");
const storeFile = path.join(dataDir, "platform.json");

const baseState = () => ({
  clubs: defaultClubs,
  events: defaultEvents,
  challenges: defaultChallenges,
  projects: defaultProjects,
  team: defaultTeam,
  gallery: defaultGallery,
  announcements: defaultAnnouncements,
  challengeSubmissions: {},
  registrations: {},
  clubRegistrations: {},
  emailNotifications: {},
  userProfiles: {},
  bannedUsers: [],
  adminAuditLog: []
});

const clone = (value) => JSON.parse(JSON.stringify(value));

export const normalizeEmail = (email = "") => email.trim().toLowerCase();

const ensureShape = (store) => ({
  users: Array.isArray(store?.users) ? store.users : [],
  state: {
    ...baseState(),
    ...(store?.state || {})
  }
});

async function ensureStoreFile() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(storeFile);
  } catch {
    const passwordHash = await bcrypt.hash(ADMIN_CREDENTIALS.password, 10);
    const initialStore = {
      users: [
        {
          id: "admin-1",
          name: "ClubSphere Admin",
          email: ADMIN_CREDENTIALS.email.toLowerCase(),
          passwordHash,
          role: "admin",
          authType: "credentials",
          createdAt: new Date().toISOString()
        }
      ],
      state: baseState()
    };
    await fs.writeFile(storeFile, JSON.stringify(initialStore, null, 2), "utf8");
  }
}

export async function getStore() {
  await ensureStoreFile();
  const raw = await fs.readFile(storeFile, "utf8");
  return ensureShape(JSON.parse(raw));
}

export async function saveStore(store) {
  const next = ensureShape(store);
  await fs.writeFile(storeFile, JSON.stringify(next, null, 2), "utf8");
  return next;
}

export async function updateStore(updater) {
  const current = await getStore();
  const draft = clone(current);
  const updated = (await updater(draft)) || draft;
  return saveStore(updated);
}

export function sanitizeUser(user) {
  if (!user) return null;
  const { passwordHash, ...safeUser } = user;
  return safeUser;
}

export function publicStore(store) {
  const safe = ensureShape(store);
  return {
    ...safe.state,
    users: safe.users.map(sanitizeUser)
  };
}

export function findUserByEmail(store, email) {
  const normalized = normalizeEmail(email);
  return ensureShape(store).users.find((user) => user.email === normalized) || null;
}
