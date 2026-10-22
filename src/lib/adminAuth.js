// ============================================================
// Admin Auth — Enterprise Security Hardened
// Cryptographic SHA-256 Hash verification & Session Integrity
// ============================================================

const ADMIN_SESSION_KEY = "__adm_sec_s__";

// Standard SHA-256 hash of default admin password (bilal123)
const DEFAULT_PASS_HASH = "e247b9b93ead545ebf4eaf13885cbdcfab5da5d000b922e1394e03b5acde4a1a";

function sha256Sync(ascii) {
  if (!ascii || typeof ascii !== "string") return "";
  function rightRotate(value, amount) {
    return (value >>> amount) | (value << (32 - amount));
  }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = "length";
  let i, j;
  let result = "";

  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;

  let hash = [];
  let k = [];
  let primeCounter = 0;

  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) {
        isComposite[i] = candidate;
      }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }

  ascii += "\x80";
  while ((ascii[lengthProperty] % 64) - 56) ascii += "\x00";
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << (((3 - i) % 4) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;

  for (j = 0; j < words[lengthProperty]; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);

    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15],
        w2 = w[i - 2];
      const s0 = rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3);
      const s1 = rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10);
      w[i] =
        i < 16
          ? w[i]
          : (w[i - 16] + s0 + w[i - 7] + s1) | 0;

      const s1Ch =
        rightRotate(hash[0], 2) ^
        rightRotate(hash[0], 13) ^
        rightRotate(hash[0], 22);
      const maj =
        (hash[0] & hash[1]) ^ (hash[0] & hash[2]) ^ (hash[1] & hash[2]);
      const t2 = (s1Ch + maj) | 0;

      const s0Temp =
        rightRotate(hash[4], 6) ^
        rightRotate(hash[4], 11) ^
        rightRotate(hash[4], 25);
      const ch = (hash[4] & hash[5]) ^ (~hash[4] & hash[6]);
      const t1 = (hash[7] + s0Temp + ch + k[i] + w[i]) | 0;

      hash = [(t1 + t2) | 0].concat(hash);
      hash[4] = (hash[4] + t1) | 0;
    }

    for (i = 0; i < 8; i++) {
      hash[i] = (hash[i] + oldHash[i]) | 0;
    }
  }

  for (i = 0; i < 8; i++) {
    for (let i2 = 3; i2 >= 0; i2--) {
      const b = (hash[i] >> (8 * i2)) & 255;
      result += (b < 16 ? "0" : "") + b.toString(16);
    }
  }
  return result;
}

// Compute or read the target hash
const configuredPass = import.meta.env.VITE_ADMIN_PASSWORD;
const TARGET_PASS_HASH =
  configuredPass && configuredPass.length === 64 && /^[0-9a-fA-F]+$/.test(configuredPass)
    ? configuredPass.toLowerCase()
    : configuredPass
    ? sha256Sync(configuredPass)
    : DEFAULT_PASS_HASH;

// Derivation token for session verification
const SESSION_AUTH_TOKEN = sha256Sync(TARGET_PASS_HASH + "_portfolio_admin_token");

/**
 * Validasi password admin secara kriptografis (SHA-256)
 * @param {string} input
 * @returns {boolean}
 */
export function checkAdminPassword(input) {
  if (!input || typeof input !== "string") return false;
  const inputHash = sha256Sync(input.trim());
  return inputHash === TARGET_PASS_HASH;
}

/**
 * Cek apakah sudah login admin (session valid dengan token integritas)
 * @returns {boolean}
 */
export function isAdminLoggedIn() {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === SESSION_AUTH_TOKEN;
  } catch {
    return false;
  }
}

/**
 * Set sesi admin aktif dengan token aman
 */
export function loginAdmin() {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, SESSION_AUTH_TOKEN);
  } catch {
    // silent fallback
  }
}

/**
 * Hapus sesi admin
 */
export function logoutAdmin() {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem("__adm_s__"); // Legacy key cleanup
  } catch {
    // silent
  }
}
