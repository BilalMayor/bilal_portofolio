import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

// Nama Collections
const GALLERY_COLLECTION = "gallery";
const PROJECT_COLLECTION = "projects";
const ACHIEVEMENT_COLLECTION = "achievements";
const STATIC_OVERRIDES_COLLECTION = "static_overrides"; 

// Helper to transparently map legacy image formats to our optimized WebP files
function webpFallback(item) {
  if (item && item.image && typeof item.image === "string") {
    if (
      (item.image.startsWith("/projects/") ||
       item.image.startsWith("/gallery/") ||
       item.image.startsWith("/certificate/") ||
       item.image.startsWith("/uploads/")) &&
      !item.image.endsWith(".webp")
    ) {
      item.image = item.image.replace(/\.(png|jpe?g|JPG|PNG|JPEG)$/i, ".webp");
    }
  }
  return item;
}

// ─────────────────────── STATIC OVERRIDES ───────────────────

export async function getStaticOverrides() {
  try {
    const snapshot = await getDocs(collection(db, STATIC_OVERRIDES_COLLECTION));
    const overrides = {};
    snapshot.forEach(doc => {
      overrides[doc.id] = webpFallback(doc.data());
    });
    return overrides;
  } catch (error) {
    console.error("Error fetching static overrides:", error);
    return {};
  }
}

export async function addDeletedStaticId(id) {
  const docRef = doc(db, STATIC_OVERRIDES_COLLECTION, id);
  await setDoc(docRef, { _deleted: true }, { merge: true });
}

export async function updateEditedStaticItem(id, updates) {
  const docRef = doc(db, STATIC_OVERRIDES_COLLECTION, id);
  await setDoc(docRef, { ...updates, updatedAt: new Date().toISOString() }, { merge: true });
}

// ─────────────────────── GALLERY ────────────────────────────

export async function getAdminGallery() {
  try {
    const snapshot = await getDocs(collection(db, GALLERY_COLLECTION));
    const items = [];
    snapshot.forEach(doc => items.push(webpFallback({ ...doc.data(), id: doc.id })));
    return items;
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return [];
  }
}

export async function getMergedGallery(staticData = []) {
  try {
    const [adminItems, overrides] = await Promise.all([
      getAdminGallery(),
      getStaticOverrides()
    ]);
    
    const filteredStatic = staticData
      .filter(item => !(overrides[item.id] && overrides[item.id]._deleted))
      .map(item => overrides[item.id] ? { ...item, ...overrides[item.id] } : item);
      
    return [...adminItems, ...filteredStatic];
  } catch (error) {
    console.error("Failed to merge gallery:", error);
    return staticData;
  }
}

export async function addAdminGalleryItem(item) {
  const newItem = {
    ...item,
    isAdmin: true,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, GALLERY_COLLECTION), newItem);
  return { ...newItem, id: docRef.id };
}

export async function updateAdminGalleryItem(id, updates) {
  if (id.startsWith("gal_")) {
    await updateEditedStaticItem(id, updates);
    return { id, ...updates };
  }
  const docRef = doc(db, GALLERY_COLLECTION, id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
  return { id, ...updates };
}

export async function deleteAdminGalleryItem(id) {
  if (id.startsWith("gal_")) {
    await addDeletedStaticId(id);
    return;
  }
  await deleteDoc(doc(db, GALLERY_COLLECTION, id));
}

// ─────────────────────── PROJECTS ───────────────────────────

export async function getAdminProjects() {
  try {
    const snapshot = await getDocs(collection(db, PROJECT_COLLECTION));
    const items = [];
    snapshot.forEach(doc => items.push(webpFallback({ ...doc.data(), id: doc.id })));
    return items;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
}

export async function getMergedProjects(staticData = []) {
  try {
    const [adminItems, overrides] = await Promise.all([
      getAdminProjects(),
      getStaticOverrides()
    ]);
    
    const filteredStatic = staticData
      .filter(item => !(overrides[item.id] && overrides[item.id]._deleted))
      .map(item => overrides[item.id] ? { ...item, ...overrides[item.id] } : item);
      
    return [...adminItems, ...filteredStatic];
  } catch (error) {
    console.error("Failed to merge projects:", error);
    return staticData;
  }
}

export async function addAdminProjectItem(item) {
  const newItem = {
    ...item,
    isAdmin: true,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, PROJECT_COLLECTION), newItem);
  return { ...newItem, id: docRef.id };
}

export async function updateAdminProjectItem(id, updates) {
  if (id.startsWith("proj_")) {
    await updateEditedStaticItem(id, updates);
    return { id, ...updates };
  }
  const docRef = doc(db, PROJECT_COLLECTION, id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
  return { id, ...updates };
}

export async function deleteAdminProjectItem(id) {
  if (id.startsWith("proj_")) {
    await addDeletedStaticId(id);
    return;
  }
  await deleteDoc(doc(db, PROJECT_COLLECTION, id));
}

// ─────────────────────── ACHIEVEMENTS ───────────────────────

export async function getAdminAchievements() {
  try {
    const snapshot = await getDocs(collection(db, ACHIEVEMENT_COLLECTION));
    const items = [];
    snapshot.forEach(doc => items.push(webpFallback({ ...doc.data(), id: doc.id })));
    return items;
  } catch (error) {
    console.error("Error fetching achievements:", error);
    return [];
  }
}

export async function getMergedAchievements(staticData = []) {
  try {
    const [adminItems, overrides] = await Promise.all([
      getAdminAchievements(),
      getStaticOverrides()
    ]);
    
    const filteredStatic = staticData
      .filter(item => !(overrides[item.id] && overrides[item.id]._deleted))
      .map(item => overrides[item.id] ? { ...item, ...overrides[item.id] } : item);
      
    return [...adminItems, ...filteredStatic];
  } catch (error) {
    console.error("Failed to merge achievements:", error);
    return staticData;
  }
}

export async function addAdminAchievementItem(item) {
  const newItem = {
    ...item,
    isAdmin: true,
    createdAt: new Date().toISOString(),
  };
  const docRef = await addDoc(collection(db, ACHIEVEMENT_COLLECTION), newItem);
  return { ...newItem, id: docRef.id };
}

export async function updateAdminAchievementItem(id, updates) {
  if (id.startsWith("ach_")) {
    await updateEditedStaticItem(id, updates);
    return { id, ...updates };
  }
  const docRef = doc(db, ACHIEVEMENT_COLLECTION, id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
  return { id, ...updates };
}

export async function deleteAdminAchievementItem(id) {
  if (id.startsWith("ach_")) {
    await addDeletedStaticId(id);
    return;
  }
  await deleteDoc(doc(db, ACHIEVEMENT_COLLECTION, id));
}
