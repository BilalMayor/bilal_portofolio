import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export const sendMessage = async ({ text, user }) => {
  if (!text.trim()) return;

  await addDoc(collection(db, "messages"), {
    text,
    uid: user.uid,
    name: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    createdAt: serverTimestamp(),
  });
};
