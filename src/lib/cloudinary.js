export const uploadImageToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dsk5gf5oy";
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(`Cloudinary upload failed: missing ${!uploadPreset ? "VITE_CLOUDINARY_UPLOAD_PRESET" : "VITE_CLOUDINARY_CLOUD_NAME"} environment variable.`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  // Opsional: Anda bisa menambahkan folder
  // formData.append("folder", "portfolio"); 

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    // Mengembalikan URL secure (https) dari gambar yang terunggah
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};
