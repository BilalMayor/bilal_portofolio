// ============================================================
// Admin Auth — hanya untuk internal, tidak di-expose ke publik
// Akses: Ctrl + Shift + A → password prompt
// ============================================================

const ADMIN_SESSION_KEY = "__adm_s__";
const ADMIN_PASS_HASH = import.meta.env.VITE_ADMIN_PASSWORD || "bilal123";

/**
 * Validasi password admin
 * @param {string} input
 * @returns {boolean}
 */
export function checkAdminPassword(input) {
  return input === ADMIN_PASS_HASH;
}

/**
 * Cek apakah sudah login admin (session saat ini)
 * @returns {boolean}
 */
export function isAdminLoggedIn() {
  try {
    return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Set sesi admin aktif
 */
export function loginAdmin() {
  try {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  } catch {
    // silent
  }
}

/**
 * Hapus sesi admin
 */
export function logoutAdmin() {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // silent
  }
}
