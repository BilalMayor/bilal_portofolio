import { useState, useEffect, useRef } from "react";
import { logoutAdmin } from "../lib/adminAuth";
import {
  getMergedGallery, addAdminGalleryItem, deleteAdminGalleryItem, updateAdminGalleryItem,
  getMergedProjects, addAdminProjectItem, deleteAdminProjectItem, updateAdminProjectItem,
  getMergedAchievements, addAdminAchievementItem, deleteAdminAchievementItem, updateAdminAchievementItem,
} from "../lib/adminStore";
import { galleryData } from "../data/galleryData";
import { projectData } from "../data/projectData";
import { achievementsData } from "../data/achievementsData";
import { uploadImageToCloudinary } from "../lib/cloudinary";
import {
  Images, FolderKanban, LogOut, Plus, Trash2, Upload,
  X, Save, Eye, Palette, FileImage, CheckCircle2, Edit2, AlertCircle, Award, Loader2
} from "lucide-react";

// ─── Warna preset untuk project ───
const COLOR_PRESETS = [
  "#10b981", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444",
  "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#61DAFB",
];

// ─── Komponen card kecil untuk preview ───
const GalleryPreviewCard = ({ item, onEdit, onDelete }) => (
  <div className="group relative rounded-xl overflow-hidden bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-800/40 transition-all duration-300 shadow-md">
    <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
      <img 
        src={item.image} 
        alt={item.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none select-none">
        {item.isAdmin ? (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
            ADMIN
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase text-orange-300 bg-orange-500/10 border border-orange-500/20 backdrop-blur-md">
            STATIC
          </span>
        )}
      </div>

      {/* Action overlay */}
      <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {onEdit && (
          <button 
            onClick={onEdit} 
            title="Edit Item"
            className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-sky-500 text-zinc-300 hover:text-white border border-zinc-800 transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
          >
            <Edit2 size={11} />
          </button>
        )}
        {onDelete && (
          <button 
            onClick={onDelete} 
            title="Hapus Item"
            className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-red-500 text-zinc-300 hover:text-white border border-zinc-800 transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>
    </div>
    
    <div className="p-3 space-y-1">
      <p className="text-zinc-100 text-xs font-semibold truncate font-[Space_Grotesk]">{item.title}</p>
      {item.description && (
        <p className="text-zinc-400 text-[10px] line-clamp-2 leading-relaxed">{item.description}</p>
      )}
    </div>
  </div>
);

const ProjectPreviewCard = ({ item, onEdit, onDelete }) => (
  <div 
    className="relative rounded-xl p-3 bg-zinc-900/60 border hover:bg-zinc-800/40 transition-all duration-300 flex gap-3.5 items-center group shadow-md"
    style={{ 
      borderColor: item.borderColor ? `${item.borderColor}25` : "rgba(255,255,255,0.08)",
      background: item.gradient ? `linear-gradient(135deg, rgba(20, 20, 22, 0.9) 0%, ${item.borderColor}08 100%)` : undefined 
    }}
  >
    {item.image ? (
      <div className="w-12 h-12 rounded-lg overflow-hidden bg-zinc-950 flex-shrink-0 border border-zinc-800/80">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
    ) : (
      <div className="w-12 h-12 rounded-lg bg-zinc-950/60 border border-zinc-800/80 flex items-center justify-center flex-shrink-0">
        <FolderKanban size={16} className="text-zinc-600" />
      </div>
    )}
    
    <div className="flex-1 min-w-0 space-y-0.5">
      <div className="flex items-center gap-2">
        <p className="text-zinc-100 text-xs font-semibold truncate font-[Space_Grotesk]">{item.title}</p>
        {item.isAdmin ? (
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">
            ADM
          </span>
        ) : (
          <span className="px-1.5 py-0.5 rounded text-[8px] font-bold tracking-wider uppercase text-orange-300 bg-orange-500/10 border border-orange-500/20">
            STA
          </span>
        )}
      </div>
      <p className="text-zinc-400 text-[10px] truncate">{item.subtitle}</p>
    </div>
    
    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
      {onEdit && (
        <button 
          onClick={onEdit} 
          title="Edit Proyek"
          className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-sky-500 text-zinc-300 hover:text-white border border-zinc-800 transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
        >
          <Edit2 size={11} />
        </button>
      )}
      {onDelete && (
        <button 
          onClick={onDelete} 
          title="Hapus Proyek"
          className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-red-500 text-zinc-300 hover:text-white border border-zinc-800 transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
        >
          <Trash2 size={11} />
        </button>
      )}
    </div>
  </div>
);

const AchievementPreviewCard = ({ item, onEdit, onDelete }) => (
  <div className="group relative rounded-xl overflow-hidden bg-zinc-900/60 border border-zinc-800/80 hover:border-zinc-700/80 hover:bg-zinc-800/40 transition-all duration-300 shadow-md">
    <div className="relative aspect-video w-full overflow-hidden bg-zinc-950">
      <img 
        src={item.image} 
        alt={item.title} 
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80" />
      
      {/* Badges */}
      <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 pointer-events-none select-none">
        {item.isAdmin ? (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
            ADMIN
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold tracking-wider uppercase text-orange-300 bg-orange-500/10 border border-orange-500/20 backdrop-blur-md">
            STATIC
          </span>
        )}
      </div>

      {/* Action overlay */}
      <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        {onEdit && (
          <button 
            onClick={onEdit} 
            title="Edit Pencapaian"
            className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-sky-500 text-zinc-300 hover:text-white border border-zinc-800 transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
          >
            <Edit2 size={11} />
          </button>
        )}
        {onDelete && (
          <button 
            onClick={onDelete} 
            title="Hapus Pencapaian"
            className="p-1.5 rounded-lg bg-zinc-900/90 hover:bg-red-500 text-zinc-300 hover:text-white border border-zinc-800 transition-all duration-200 cursor-pointer shadow-md hover:scale-105"
          >
            <Trash2 size={11} />
          </button>
        )}
      </div>
    </div>
    
    <div className="p-3 space-y-1.5">
      <p className="text-zinc-100 text-xs font-semibold truncate font-[Space_Grotesk]">{item.title}</p>
      {item.tech && item.tech.length > 0 && (
        <div className="flex flex-wrap gap-1 select-none">
          {item.tech.map((t, idx) => (
            <span key={idx} className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[8px] font-medium tracking-wide border border-zinc-800/80">
              {t}
            </span>
          ))}
        </div>
      )}
      {item.description && (
        <p className="text-zinc-400 text-[10px] line-clamp-2 leading-relaxed">{item.description}</p>
      )}
    </div>
  </div>
);

// ─── Toast Notifikasi ───
const Toast = ({ message, type, onDone }) => {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div 
      className={`fixed bottom-6 right-6 z-[99999] px-4 py-3 rounded-xl border font-semibold text-xs flex items-center gap-2.5 shadow-2xl backdrop-blur-md animate-slideUp`}
      style={{
        background: type === "error" ? "rgba(239, 68, 68, 0.15)" : "rgba(16, 185, 129, 0.15)",
        borderColor: type === "error" ? "rgba(239, 68, 68, 0.3)" : "rgba(16, 185, 129, 0.3)",
        color: type === "error" ? "#fecaca" : "#d1fae5",
        boxShadow: type === "error" ? "0 10px 30px rgba(239,68,68,0.15)" : "0 10px 30px rgba(16,185,129,0.15)",
      }}
    >
      {type === "error" ? <AlertCircle size={15} className="text-red-400" /> : <CheckCircle2 size={15} className="text-emerald-400" />}
      {message}
    </div>
  );
};

// ─── Confirmation Modal ───
const ConfirmModal = ({ title, message, onConfirm, onCancel }) => (
  <div className="fixed inset-0 z-[100000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
    <div className="w-full max-w-sm bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 rounded-2xl p-6 shadow-2xl space-y-4 animate-scaleUp">
      <div className="flex gap-3.5 items-start">
        <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400">
          <AlertCircle size={20} />
        </div>
        <div className="space-y-1">
          <h3 className="text-zinc-100 font-bold text-sm tracking-wide font-[Space_Grotesk]">{title}</h3>
          <p className="text-zinc-400 text-xs leading-relaxed">{message}</p>
        </div>
      </div>
      
      <div className="flex gap-2.5 justify-end">
        <button 
          onClick={onCancel} 
          className="px-4 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-700/50 hover:border-zinc-600/50 text-xs font-semibold transition-all cursor-pointer"
        >
          Batal
        </button>
        <button 
          onClick={onConfirm} 
          className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-red-600/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          Hapus
        </button>
      </div>
    </div>
  </div>
);

// ─── MAIN ADMIN PANEL ───
const AdminPanel = ({ onClose, initialTab = "gallery" }) => {
  const [tab, setTab] = useState(initialTab);
  const [toast, setToast] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Gallery state
  const [adminGallery, setAdminGallery] = useState([]);
  const [galleryForm, setGalleryForm] = useState({ id: null, title: "", description: "", image: "" });
  const [galleryPreview, setGalleryPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Project state
  const [adminProjects, setAdminProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({
    id: null, title: "", subtitle: "", image: "", url: "",
    borderColor: "#10b981", gradient: "",
  });
  const [projectPreview, setProjectPreview] = useState(null);
  const [isProjectDragging, setIsProjectDragging] = useState(false);
  const projectFileInputRef = useRef(null);
  const [selectedColor, setSelectedColor] = useState("#10b981");

  // Achievement state
  const [adminAchievements, setAdminAchievements] = useState([]);
  const [achievementForm, setAchievementForm] = useState({ id: null, title: "", description: "", tech: "", image: "" });
  const [achievementPreview, setAchievementPreview] = useState(null);
  const [isAchievementDragging, setIsAchievementDragging] = useState(false);
  const achievementFileInputRef = useRef(null);

  // Load ALL data on mount (static + Firestore merged)
  useEffect(() => {
    const loadData = async () => {
      const [gallery, projects, achievements] = await Promise.all([
        getMergedGallery(galleryData),
        getMergedProjects(projectData),
        getMergedAchievements(achievementsData),
      ]);
      setAdminGallery(gallery);
      setAdminProjects(projects);
      setAdminAchievements(achievements);
    };
    loadData();
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
  };

  // Helpers to refresh individual lists after mutations
  const refreshAll = async () => {
    const [g, p, a] = await Promise.all([
      getMergedGallery(galleryData),
      getMergedProjects(projectData),
      getMergedAchievements(achievementsData),
    ]);
    setAdminGallery(g); setAdminProjects(p); setAdminAchievements(a);
  };

  // ── Unified image upload ──
  const uploadImage = async (file, folder = "gallery") => {
    if (import.meta.env.DEV) {
      try {
        const reader = new FileReader();
        const base64 = await new Promise((resolve, reject) => {
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const ext = file.name.split(".").pop().toLowerCase();
        const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const res = await fetch("/api/upload-local", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename, data: base64, folder }),
        });
        if (res.ok) {
          const { url } = await res.json();
          return url;
        }
      } catch {
        // fallback
      }
    }
    try {
      return await uploadImageToCloudinary(file);
    } catch (err) {
      console.warn("Cloudinary upload failed or missing preset, falling back to base64 encoding:", err);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }
  };

  // Client-side image compression (no dependencies, uses HTML Canvas)
  const compressImage = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.75) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Scale down if exceeds max dimensions
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to compressed webp base64
          const compressedBase64 = canvas.toDataURL("image/webp", quality);

          // Re-create a File object from the compressed blob
          canvas.toBlob((blob) => {
            if (!blob) {
              resolve({ base64: e.target.result, file });
              return;
            }
            const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
              type: "image/webp",
              lastModified: Date.now()
            });
            resolve({ base64: compressedBase64, file: compressedFile });
          }, "image/webp", quality);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const processImageFile = async (file, setForm, setPreview) => {
    if (!file || !file.type.startsWith("image/")) return;
    showToast("Mengompres gambar...", "info");
    try {
      const { base64, file: compressedFile } = await compressImage(file);
      setForm((p) => ({ ...p, image: base64, imageFile: compressedFile }));
      setPreview(base64);
      showToast("Gambar terkompresi!");
    } catch (err) {
      console.error("Compression error:", err);
      // Fallback to original file if compression fails
      const reader = new FileReader();
      reader.onload = (e) => {
        setForm((p) => ({ ...p, image: e.target.result, imageFile: file }));
        setPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e, setForm, setPreview, setDragging) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    processImageFile(file, setForm, setPreview);
  };

  // ── Gallery Actions ──
  const handleGalleryAddOrUpdate = async () => {
    if (!galleryForm.title || (!galleryForm.image && !galleryForm.imageFile)) {
      showToast("Judul dan gambar wajib diisi!", "error");
      return;
    }
    setUploading(true);
    let imageUrl = galleryForm.image;
    try {
      if (galleryForm.imageFile) {
        showToast("Menyimpan gambar...", "info");
        imageUrl = await uploadImage(galleryForm.imageFile, "gallery");
      }
      const { imageFile: _gf, ...galleryRest } = galleryForm;
      const payload = { ...galleryRest, image: imageUrl };

      if (galleryForm.id) {
        const updated = await updateAdminGalleryItem(galleryForm.id, payload);
        setAdminGallery((p) => p.map(i => i.id === galleryForm.id ? updated : i));
        showToast("Foto berhasil diupdate!");
      } else {
        const newItem = await addAdminGalleryItem(payload);
        setAdminGallery((p) => [...p, newItem]);
        showToast("Foto berhasil ditambahkan!");
      }
      setGalleryForm({ id: null, title: "", description: "", image: "", imageFile: null });
      setGalleryPreview(null);
      await refreshAll();
      window.dispatchEvent(new Event("adminDataUpdated"));
    } catch (e) {
      console.error("Error saving gallery item:", e);
      showToast("Gagal menyimpan data", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryEdit = (item) => {
    setGalleryForm({ id: item.id, title: item.title, description: item.description, image: item.image, imageFile: null });
    setGalleryPreview(item.image);
    setTab("gallery");
  };

  const executeGalleryDelete = async () => {
    console.log("[executeGalleryDelete] started. id:", confirmDelete?.id);
    try {
      if (!confirmDelete || !confirmDelete.id) {
        console.warn("[executeGalleryDelete] No confirmDelete or ID found.");
        return;
      }
      await deleteAdminGalleryItem(confirmDelete.id);
      console.log("[executeGalleryDelete] deleteAdminGalleryItem successful.");
      setConfirmDelete(null);
      showToast("Foto dihapus");
      await refreshAll();
      window.dispatchEvent(new Event("adminDataUpdated"));
    } catch (e) {
      console.error("[delete-gallery] Error:", e);
      showToast("Gagal menghapus data", "error");
    }
  };

  // ── Project Actions ──
  const handleProjectAddOrUpdate = async () => {
    if (!projectForm.title || !projectForm.subtitle || (!projectForm.image && !projectForm.imageFile)) {
      showToast("Judul, subtitle, dan gambar wajib diisi!", "error");
      return;
    }
    setUploading(true);
    let imageUrl = projectForm.image;
    try {
      if (projectForm.imageFile) {
        showToast("Menyimpan gambar...", "info");
        imageUrl = await uploadImage(projectForm.imageFile, "projects");
      }
      const gradient = `linear-gradient(160deg,${selectedColor} 0%,#000 70%)`;
      const { imageFile: _pf, ...projectRest } = projectForm;
      const payload = { ...projectRest, borderColor: selectedColor, gradient, image: imageUrl };
      
      if (projectForm.id) {
        const updated = await updateAdminProjectItem(projectForm.id, payload);
        setAdminProjects((p) => p.map(i => i.id === projectForm.id ? updated : i));
        showToast("Project berhasil diupdate!");
      } else {
        const newItem = await addAdminProjectItem(payload);
        setAdminProjects((p) => [...p, newItem]);
        showToast("Project berhasil ditambahkan!");
      }
      
      setProjectForm({ id: null, title: "", subtitle: "", image: "", imageFile: null, url: "", borderColor: "#10b981", gradient: "" });
      setProjectPreview(null);
      setSelectedColor("#10b981");
      await refreshAll();
      window.dispatchEvent(new Event("adminDataUpdated"));
    } catch (e) {
      console.error("Error saving project item:", e);
      showToast("Gagal menyimpan data", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleProjectEdit = (item) => {
    setProjectForm({ id: item.id, title: item.title, subtitle: item.subtitle, image: item.image, imageFile: null, url: item.url || "" });
    setSelectedColor(item.borderColor || "#10b981");
    setProjectPreview(item.image);
    setTab("project");
  };

  const executeProjectDelete = async () => {
    console.log("[executeProjectDelete] started. id:", confirmDelete?.id);
    try {
      if (!confirmDelete || !confirmDelete.id) {
        console.warn("[executeProjectDelete] No confirmDelete or ID found.");
        return;
      }
      await deleteAdminProjectItem(confirmDelete.id);
      console.log("[executeProjectDelete] deleteAdminProjectItem successful.");
      setConfirmDelete(null);
      showToast("Project dihapus");
      await refreshAll();
      window.dispatchEvent(new Event("adminDataUpdated"));
    } catch (e) {
      console.error("[delete-project] Error:", e);
      showToast("Gagal menghapus data", "error");
    }
  };

  // ── Achievement Actions ──
  const handleAchievementAddOrUpdate = async () => {
    if (!achievementForm.title || (!achievementForm.image && !achievementForm.imageFile)) {
      showToast("Judul dan gambar wajib diisi!", "error");
      return;
    }
    setUploading(true);
    let imageUrl = achievementForm.image;
    try {
      if (achievementForm.imageFile) {
        showToast("Menyimpan gambar...", "info");
        imageUrl = await uploadImage(achievementForm.imageFile, "certificate");
      }
      const techArray = typeof achievementForm.tech === "string" 
        ? achievementForm.tech.split(",").map(t => t.trim()).filter(Boolean)
        : achievementForm.tech;
        
      const { imageFile: _af, ...achievementRest } = achievementForm;
      const payload = { ...achievementRest, tech: techArray, image: imageUrl };

      if (achievementForm.id) {
        const updated = await updateAdminAchievementItem(achievementForm.id, payload);
        setAdminAchievements((p) => p.map(i => i.id === achievementForm.id ? updated : i));
        showToast("Pencapaian berhasil diupdate!");
      } else {
        const newItem = await addAdminAchievementItem(payload);
        setAdminAchievements((p) => [...p, newItem]);
        showToast("Pencapaian berhasil ditambahkan!");
      }
      setAchievementForm({ id: null, title: "", description: "", tech: "", image: "", imageFile: null });
      setAchievementPreview(null);
      await refreshAll();
      window.dispatchEvent(new Event("adminDataUpdated"));
    } catch (e) {
      console.error("Error saving achievement item:", e);
      showToast("Gagal menyimpan data", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleAchievementEdit = (item) => {
    setAchievementForm({ 
      id: item.id, 
      title: item.title, 
      description: item.description, 
      tech: Array.isArray(item.tech) ? item.tech.join(", ") : (item.tech || ""), 
      image: item.image,
      imageFile: null
    });
    setAchievementPreview(item.image);
    setTab("achievement");
  };

  const executeAchievementDelete = async () => {
    console.log("[executeAchievementDelete] started. id:", confirmDelete?.id);
    try {
      if (!confirmDelete || !confirmDelete.id) {
        console.warn("[executeAchievementDelete] No confirmDelete or ID found.");
        return;
      }
      await deleteAdminAchievementItem(confirmDelete.id);
      console.log("[executeAchievementDelete] deleteAdminAchievementItem successful.");
      setConfirmDelete(null);
      showToast("Pencapaian dihapus");
      await refreshAll();
      window.dispatchEvent(new Event("adminDataUpdated"));
    } catch (e) {
      console.error("[delete-achievement] Error:", e);
      showToast("Gagal menghapus data", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-[9998] bg-black/85 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-4xl h-[85vh] bg-gradient-to-br from-zinc-900/95 to-zinc-950/98 border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col animate-scaleUp">
        
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/70 bg-zinc-900/20 backdrop-blur-md">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-500/5">
              <Eye size={18} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="text-zinc-100 text-sm font-bold tracking-wide font-[Space_Grotesk]">Admin Panel</h2>
              <p className="text-zinc-500 text-[10px] tracking-wide font-medium">Bilal Mayor Abdillah — Workspace Content Creator</p>
            </div>
          </div>
          <button 
            onClick={() => { logoutAdmin(); onClose(); }} 
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/5 hover:bg-red-500 border border-red-500/10 hover:border-red-500/20 text-red-400 hover:text-white text-xs font-bold transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-red-500/10 hover:scale-[1.02] active:scale-[0.98]"
          >
            <LogOut size={13} />
            Keluar
          </button>
        </div>

        {/* ── Tab Bar ── */}
        <div className="flex px-6 border-b border-zinc-800/50 bg-zinc-950/20">
          {[
            { id: "gallery", icon: <Images size={14} />, label: "Gallery", data: adminGallery },
            { id: "project", icon: <FolderKanban size={14} />, label: "Projects", data: adminProjects },
            { id: "achievement", icon: <Award size={14} />, label: "Achievements", data: adminAchievements },
          ].map((t) => {
            const isActive = tab === t.id;
            return (
              <button 
                key={t.id} 
                onClick={() => setTab(t.id)} 
                className={`relative flex items-center gap-2 px-5 py-4 text-xs font-bold tracking-wide transition-all duration-300 border-b-2 cursor-pointer
                  ${isActive ? "text-emerald-400 border-emerald-500 font-extrabold" : "text-zinc-500 border-transparent hover:text-zinc-300"}`}
              >
                {t.icon}
                <span>{t.label}</span>
                <span 
                  className={`ml-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border transition-colors duration-300
                    ${isActive ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-500"}`}
                >
                  {t.data.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Content Body ── */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6 custom-scrollbar">

          {/* ─── GALLERY TAB ─── */}
          {tab === "gallery" && (
            <>
              {/* Left Column - Form */}
              <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase font-[Space_Grotesk]">
                    {galleryForm.id ? "Edit Foto" : "Tambah Foto Baru"}
                  </h3>
                  {galleryForm.id && (
                    <button 
                      onClick={() => { setGalleryForm({ id: null, title: "", description: "", image: "" }); setGalleryPreview(null); }} 
                      className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-[10px] font-semibold cursor-pointer transition-colors"
                    >
                      <X size={11} /> Batal Edit
                    </button>
                  )}
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={(e) => handleDrop(e, setGalleryForm, setGalleryPreview, setIsDragging)}
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-5 cursor-pointer text-center flex flex-col items-center justify-center gap-2.5 transition-all duration-300 min-h-[140px]
                    ${isDragging 
                      ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.08)]" 
                      : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/40"}`}
                >
                  {galleryPreview ? (
                    <div className="relative w-full h-[120px] rounded-lg overflow-hidden border border-zinc-850">
                      <img src={galleryPreview} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <>
                      <div className="p-3 rounded-full bg-zinc-900 text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        <Upload size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-zinc-300 text-xs font-semibold">Tarik gambar kemari</p>
                        <p className="text-zinc-500 text-[10px] font-medium">atau <span className="text-emerald-400 font-bold hover:underline">cari berkas</span></p>
                      </div>
                    </>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => processImageFile(e.target.files[0], setGalleryForm, setGalleryPreview)} />
                </div>

                {galleryPreview && (
                  <button 
                    onClick={() => { setGalleryPreview(null); setGalleryForm((p) => ({ ...p, image: "" })); }}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-[10px] font-bold cursor-pointer transition-colors self-start ml-1"
                  >
                    <X size={12} /> Hapus Gambar
                  </button>
                )}

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase ml-1">Judul *</label>
                  <input 
                    className="w-full bg-zinc-900/60 focus:bg-zinc-900 border border-zinc-800/80 focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:shadow-[0_0_15px_rgba(16,185,129,0.06)]" 
                    placeholder="Contoh: Foto Wisuda"
                    value={galleryForm.title}
                    onChange={(e) => setGalleryForm((p) => ({ ...p, title: e.target.value }))} 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase ml-1">Deskripsi</label>
                  <textarea 
                    className="w-full bg-zinc-900/60 focus:bg-zinc-900 border border-zinc-800/80 focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:shadow-[0_0_15px_rgba(16,185,129,0.06)] resize-none h-20"
                    placeholder="Deskripsi singkat..."
                    value={galleryForm.description}
                    onChange={(e) => setGalleryForm((p) => ({ ...p, description: e.target.value }))} 
                  />
                </div>

                <button 
                  onClick={handleGalleryAddOrUpdate} 
                  disabled={uploading} 
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white transition-all shadow-lg select-none cursor-pointer
                    ${uploading 
                      ? "bg-zinc-850 border border-zinc-800 text-zinc-500 cursor-not-allowed" 
                      : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98]"}`}
                >
                  {uploading ? <Loader2 size={13} className="animate-spin text-zinc-500" /> : (galleryForm.id ? <Save size={13} /> : <Plus size={13} />)} 
                  {uploading ? "Menyimpan..." : (galleryForm.id ? "Simpan Perubahan" : "Tambahkan ke Gallery")}
                </button>
              </div>

              {/* Right Column - Cards List */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <h3 className="text-zinc-400 font-bold text-xs tracking-wider uppercase font-[Space_Grotesk]">
                  Daftar Foto ({adminGallery.length})
                </h3>
                {adminGallery.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-800/80 rounded-2xl p-12 text-center bg-zinc-900/5">
                    <FileImage size={32} className="text-zinc-600 mb-3 animate-pulse" />
                    <p className="text-zinc-400 text-xs font-semibold">Belum ada foto</p>
                    <p className="text-zinc-600 text-[10px] mt-1">Gunakan formulir untuk menambahkan item</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[500px] custom-scrollbar">
                    {adminGallery.map((item) => (
                      <GalleryPreviewCard key={item.id} item={item} 
                        onEdit={() => handleGalleryEdit(item)}
                        onDelete={() => setConfirmDelete({ type: 'gallery', id: item.id })} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ─── PROJECT TAB ─── */}
          {tab === "project" && (
            <>
              {/* Left Column - Form */}
              <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase font-[Space_Grotesk]">
                    {projectForm.id ? "Edit Project" : "Tambah Project Baru"}
                  </h3>
                  {projectForm.id && (
                    <button 
                      onClick={() => { setProjectForm({ id: null, title: "", subtitle: "", image: "", url: "", borderColor: "#10b981", gradient: "" }); setProjectPreview(null); }}
                      className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-[10px] font-semibold cursor-pointer transition-colors"
                    >
                      <X size={11} /> Batal Edit
                    </button>
                  )}
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsProjectDragging(true); }}
                  onDragLeave={() => setIsProjectDragging(false)}
                  onDrop={(e) => handleDrop(e, setProjectForm, setProjectPreview, setIsProjectDragging)}
                  onClick={() => projectFileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-4 cursor-pointer text-center flex flex-col items-center justify-center gap-2 transition-all duration-300 min-h-[110px]
                    ${isProjectDragging 
                      ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.08)]" 
                      : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/40"}`}
                >
                  {projectPreview ? (
                    <div className="relative w-full h-[90px] rounded-lg overflow-hidden border border-zinc-850">
                      <img src={projectPreview} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <>
                      <Upload size={16} className="text-zinc-400" />
                      <p className="text-zinc-300 text-xs font-semibold">Upload Thumbnail Project</p>
                      <p className="text-zinc-500 text-[9px]">Tarik & drop disini</p>
                    </>
                  )}
                  <input ref={projectFileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => processImageFile(e.target.files[0], setProjectForm, setProjectPreview)} />
                </div>

                {projectPreview && (
                  <button 
                    onClick={() => { setProjectPreview(null); setProjectForm((p) => ({ ...p, image: "" })); }}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-[10px] font-bold cursor-pointer transition-colors self-start ml-1"
                  >
                    <X size={12} /> Hapus Gambar
                  </button>
                )}

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase ml-1">Judul Project *</label>
                  <input 
                    className="w-full bg-zinc-900/60 focus:bg-zinc-900 border border-zinc-800/80 focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:shadow-[0_0_15px_rgba(16,185,129,0.06)]" 
                    placeholder="Nama project..."
                    value={projectForm.title}
                    onChange={(e) => setProjectForm((p) => ({ ...p, title: e.target.value }))} 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase ml-1">Subtitle / Stack *</label>
                  <input 
                    className="w-full bg-zinc-900/60 focus:bg-zinc-900 border border-zinc-800/80 focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:shadow-[0_0_15px_rgba(16,185,129,0.06)]" 
                    placeholder="ReactJS • TailwindCSS"
                    value={projectForm.subtitle}
                    onChange={(e) => setProjectForm((p) => ({ ...p, subtitle: e.target.value }))} 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase ml-1">URL Project</label>
                  <input 
                    className="w-full bg-zinc-900/60 focus:bg-zinc-900 border border-zinc-800/80 focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:shadow-[0_0_15px_rgba(16,185,129,0.06)]" 
                    placeholder="https://..."
                    value={projectForm.url}
                    onChange={(e) => setProjectForm((p) => ({ ...p, url: e.target.value }))} 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase ml-1 flex items-center gap-1.5"><Palette size={11} /> Warna Aksen</label>
                  <div className="flex flex-wrap gap-2 p-1.5 bg-zinc-900/20 border border-zinc-800/80 rounded-xl justify-between">
                    {COLOR_PRESETS.map((c) => {
                      const isSelected = selectedColor === c;
                      return (
                        <button 
                          key={c} 
                          onClick={() => setSelectedColor(c)} 
                          className="w-6 h-6 rounded-lg transition-all duration-300 cursor-pointer hover:scale-110"
                          style={{
                            background: c,
                            boxShadow: isSelected ? `0 0 12px ${c}c0` : "none",
                            transform: isSelected ? "scale(1.15)" : undefined,
                            border: isSelected ? "2px solid #fff" : "1px solid rgba(255,255,255,0.15)"
                          }} 
                        />
                      );
                    })}
                  </div>
                </div>

                {projectForm.title && (
                  <div className="space-y-1">
                    <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase ml-1">Preview Project Card</label>
                    <ProjectPreviewCard item={{ ...projectForm, borderColor: selectedColor, gradient: `linear-gradient(160deg,${selectedColor} 0%,#000 70%)` }} />
                  </div>
                )}

                <button 
                  onClick={handleProjectAddOrUpdate} 
                  disabled={uploading} 
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white transition-all shadow-lg select-none cursor-pointer
                    ${uploading 
                      ? "bg-zinc-850 border border-zinc-800 text-zinc-500 cursor-not-allowed" 
                      : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98]"}`}
                >
                  {uploading ? <Loader2 size={13} className="animate-spin text-zinc-500" /> : (projectForm.id ? <Save size={13} /> : <Plus size={13} />)} 
                  {uploading ? "Menyimpan..." : (projectForm.id ? "Simpan Perubahan" : "Simpan Project")}
                </button>
              </div>

              {/* Right Column - Cards List */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <h3 className="text-zinc-400 font-bold text-xs tracking-wider uppercase font-[Space_Grotesk]">
                  Daftar Project ({adminProjects.length})
                </h3>
                {adminProjects.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-800/80 rounded-2xl p-12 text-center bg-zinc-900/5">
                    <FolderKanban size={32} className="text-zinc-600 mb-3 animate-pulse" />
                    <p className="text-zinc-400 text-xs font-semibold">Belum ada project</p>
                    <p className="text-zinc-600 text-[10px] mt-1">Gunakan formulir untuk menambahkan item</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2.5 max-h-[500px] custom-scrollbar">
                    {adminProjects.map((item) => (
                      <ProjectPreviewCard key={item.id} item={item} 
                        onEdit={() => handleProjectEdit(item)}
                        onDelete={() => setConfirmDelete({ type: 'project', id: item.id })} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ─── ACHIEVEMENT TAB ─── */}
          {tab === "achievement" && (
            <>
              {/* Left Column - Form */}
              <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-zinc-200 font-bold text-xs tracking-wider uppercase font-[Space_Grotesk]">
                    {achievementForm.id ? "Edit Pencapaian" : "Tambah Pencapaian"}
                  </h3>
                  {achievementForm.id && (
                    <button 
                      onClick={() => { setAchievementForm({ id: null, title: "", description: "", tech: "", image: "" }); setAchievementPreview(null); }}
                      className="flex items-center gap-1 text-zinc-500 hover:text-zinc-300 text-[10px] font-semibold cursor-pointer transition-colors"
                    >
                      <X size={11} /> Batal Edit
                    </button>
                  )}
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setIsAchievementDragging(true); }}
                  onDragLeave={() => setIsAchievementDragging(false)}
                  onDrop={(e) => handleDrop(e, setAchievementForm, setAchievementPreview, setIsAchievementDragging)}
                  onClick={() => achievementFileInputRef.current?.click()}
                  className={`relative border-2 border-dashed rounded-xl p-5 cursor-pointer text-center flex flex-col items-center justify-center gap-2.5 transition-all duration-300 min-h-[140px]
                    ${isAchievementDragging 
                      ? "border-emerald-500 bg-emerald-500/5 shadow-[0_0_20px_rgba(16,185,129,0.08)]" 
                      : "border-zinc-800 hover:border-zinc-700 bg-zinc-900/20 hover:bg-zinc-900/40"}`}
                >
                  {achievementPreview ? (
                    <div className="relative w-full h-[120px] rounded-lg overflow-hidden border border-zinc-850">
                      <img src={achievementPreview} alt="preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <>
                      <div className="p-3 rounded-full bg-zinc-900 text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        <Upload size={18} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-zinc-300 text-xs font-semibold">Tarik gambar kemari</p>
                        <p className="text-zinc-500 text-[10px] font-medium">atau <span className="text-emerald-400 font-bold hover:underline">cari berkas</span></p>
                      </div>
                    </>
                  )}
                  <input ref={achievementFileInputRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => processImageFile(e.target.files[0], setAchievementForm, setAchievementPreview)} />
                </div>

                {achievementPreview && (
                  <button 
                    onClick={() => { setAchievementPreview(null); setAchievementForm((p) => ({ ...p, image: "" })); }}
                    className="flex items-center gap-1.5 text-red-400 hover:text-red-300 text-[10px] font-bold cursor-pointer transition-colors self-start ml-1"
                  >
                    <X size={12} /> Hapus Gambar
                  </button>
                )}

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase ml-1">Judul Pencapaian *</label>
                  <input 
                    className="w-full bg-zinc-900/60 focus:bg-zinc-900 border border-zinc-800/80 focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:shadow-[0_0_15px_rgba(16,185,129,0.06)]" 
                    placeholder="Contoh: Sertifikat React..."
                    value={achievementForm.title}
                    onChange={(e) => setAchievementForm((p) => ({ ...p, title: e.target.value }))} 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase ml-1">Kategori / Tech (pisahkan koma)</label>
                  <input 
                    className="w-full bg-zinc-900/60 focus:bg-zinc-900 border border-zinc-800/80 focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:shadow-[0_0_15px_rgba(16,185,129,0.06)]" 
                    placeholder="Aplikasi, Ide Bisnis"
                    value={achievementForm.tech}
                    onChange={(e) => setAchievementForm((p) => ({ ...p, tech: e.target.value }))} 
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 text-[10px] font-bold tracking-wider uppercase ml-1">Deskripsi</label>
                  <textarea 
                    className="w-full bg-zinc-900/60 focus:bg-zinc-900 border border-zinc-800/80 focus:border-emerald-500/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-600 outline-none transition-all focus:shadow-[0_0_15px_rgba(16,185,129,0.06)] resize-none h-20"
                    placeholder="Deskripsi singkat..."
                    value={achievementForm.description}
                    onChange={(e) => setAchievementForm((p) => ({ ...p, description: e.target.value }))} 
                  />
                </div>

                <button 
                  onClick={handleAchievementAddOrUpdate} 
                  disabled={uploading} 
                  className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white transition-all shadow-lg select-none cursor-pointer
                    ${uploading 
                      ? "bg-zinc-850 border border-zinc-800 text-zinc-500 cursor-not-allowed" 
                      : "bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98]"}`}
                >
                  {uploading ? <Loader2 size={13} className="animate-spin text-zinc-500" /> : (achievementForm.id ? <Save size={13} /> : <Plus size={13} />)} 
                  {uploading ? "Menyimpan..." : (achievementForm.id ? "Simpan Perubahan" : "Tambahkan Pencapaian")}
                </button>
              </div>

              {/* Right Column - Cards List */}
              <div className="flex-1 min-w-0 flex flex-col gap-4">
                <h3 className="text-zinc-400 font-bold text-xs tracking-wider uppercase font-[Space_Grotesk]">
                  Daftar Pencapaian ({adminAchievements.length})
                </h3>
                {adminAchievements.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-zinc-800/80 rounded-2xl p-12 text-center bg-zinc-900/5">
                    <Award size={32} className="text-zinc-600 mb-3 animate-pulse" />
                    <p className="text-zinc-400 text-xs font-semibold">Belum ada pencapaian</p>
                    <p className="text-zinc-600 text-[10px] mt-1">Gunakan formulir untuk menambahkan item</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 sm:grid-cols-3 gap-3.5 max-h-[500px] custom-scrollbar">
                    {adminAchievements.map((item) => (
                      <AchievementPreviewCard key={item.id} item={item} 
                        onEdit={() => handleAchievementEdit(item)}
                        onDelete={() => setConfirmDelete({ type: 'achievement', id: item.id })} 
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />}
      
      {/* Modal Konfirmasi Hapus */}
      {confirmDelete && (
        <ConfirmModal 
          title="Konfirmasi Hapus"
          message={`Apakah Anda yakin ingin menghapus ${confirmDelete.type === 'gallery' ? 'foto' : confirmDelete.type === 'project' ? 'project' : 'pencapaian'} ini? Data yang dihapus tidak dapat dikembalikan.`}
          onCancel={() => setConfirmDelete(null)}
          onConfirm={confirmDelete.type === 'gallery' ? executeGalleryDelete : confirmDelete.type === 'project' ? executeProjectDelete : executeAchievementDelete}
        />
      )}

      {/* Global CSS variables & Keyframes */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-scaleUp {
          animation: scaleUp 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.01);
          border-radius: 9px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 9px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.3);
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;
