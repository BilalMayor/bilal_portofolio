import { auth } from "./firebase";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
  setPersistence,
  browserLocalPersistence,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";

// Pastikan sesi disimpan di localStorage browser agar tidak perlu login ulang
setPersistence(auth, browserLocalPersistence).catch((err) =>
  console.warn("Auth persistence error:", err)
);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

export const loginWithGithub = () => signInWithPopup(auth, githubProvider);

export const loginWithPasscodeOrGuest = async (displayName = "Guest User") => {
  const cred = await signInAnonymously(auth);
  const finalName = displayName.trim() || "Guest User";
  await updateProfile(cred.user, {
    displayName: finalName,
    photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(finalName)}&background=FF6B35&color=fff&bold=true`,
  });
  return cred.user;
};

export const logout = () => signOut(auth);

