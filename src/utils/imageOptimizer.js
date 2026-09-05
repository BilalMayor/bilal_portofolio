// utils/imageOptimizer.js

const CLOUDINARY_CLOUD_NAME = 'dsk5gf5oy'; // Ganti dengan cloud name Anda

/**
 * Cek apakah browser support WebP
 */
export const supportsWebP = () => {
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
        return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return false;
};

/**
 * Deteksi kualitas koneksi
 */
export const getConnectionSpeed = () => {
    if ('connection' in navigator) {
        const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

        if (connection) {
            const effectiveType = connection.effectiveType;

            if (effectiveType === 'slow-2g' || effectiveType === '2g') {
                return 'slow';
            } else if (effectiveType === '3g') {
                return 'medium';
            }
        }
    }

    return 'fast';
};

/**
 * Get optimal quality berdasarkan koneksi dan device
 */
export const getOptimalQuality = () => {
    const speed = getConnectionSpeed();
    const isMobile = window.innerWidth < 768;

    if (speed === 'slow') return isMobile ? 0.4 : 0.5;
    if (speed === 'medium') return isMobile ? 0.6 : 0.7;
    return isMobile ? 0.75 : 0.85;
};

/**
 * Get optimal max width berdasarkan device
 */
export const getOptimalMaxWidth = () => {
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

    if (isMobile) return 600;
    if (isTablet) return 1000;
    return 1400;
};

export const optimizeImage = (imageUrl, options = {}) => {
    const {
        width = getOptimalMaxWidth(),
        quality = getOptimalQuality(),
        format = 'auto'
    } = options;

    // Jika sudah Cloudinary URL, optimasi parameter
    if (imageUrl.includes('cloudinary.com')) {
        return imageUrl.replace('/upload/', `/upload/q_${quality},f_${format},w_${width}/`);
    }

    // Jika gambar lokal di public folder
    if (imageUrl.startsWith('/')) {
        return imageUrl;
    }

    // Fallback: tambahkan parameter cache busting
    return `${imageUrl}?w=${width}&q=${quality}&format=${format}`;
};

export const preloadImages = (urls, priority = 3) => {
    // Load gambar prioritas dulu (3 pertama)
    const priorityUrls = urls.slice(0, priority);
    const remainingUrls = urls.slice(priority);

    // Load prioritas secara parallel
    const priorityPromises = priorityUrls.map(url => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = resolve;
            img.onerror = resolve; // Tetap resolve meski error
            img.src = url;
        });
    });

    // Load sisanya dengan delay untuk tidak block
    const remainingPromises = remainingUrls.map((url, index) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve;
                img.src = url;
            }, index * 100); // Delay 100ms antar gambar
        });
    });

    return Promise.all([...priorityPromises, ...remainingPromises]);
};

export const getImageSize = async (url) => {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const size = response.headers.get('content-length');
        return size ? parseInt(size) : null;
    } catch {
        return null;
    }
};

export const compressImageLocally = async (file, maxWidth = 1200, quality = 0.7) => {
    // Kompresi gambar di client-side untuk upload
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Adaptive max dimensions berdasarkan device
                const MAX_WIDTH = maxWidth;
                const MAX_HEIGHT = maxWidth;

                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);

                // Gunakan WebP jika didukung
                const format = supportsWebP() ? 'image/webp' : 'image/jpeg';

                canvas.toBlob(
                    (blob) => resolve(blob),
                    format,
                    quality
                );
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
};

/**
 * Generate placeholder blur untuk progressive loading
 */
export const generatePlaceholder = (width = 400, height = 300) => {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#1f2937;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#111827;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="${width}" height="${height}" fill="url(#grad)"/>
        <rect x="${width / 2 - 50}" y="${height / 2 - 30}" width="100" height="60" rx="10" fill="#374151" opacity="0.5"/>
        <circle cx="${width / 2}" cy="${height / 2}" r="20" fill="#4b5563" opacity="0.5"/>
      </svg>
    `;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Compress image from URL
 */
export const compressImageFromUrl = (imageSrc, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            let width = img.width;
            let height = img.height;

            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }

            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            const format = supportsWebP() ? 'image/webp' : 'image/jpeg';
            const compressedDataUrl = canvas.toDataURL(format, quality);

            resolve(compressedDataUrl);
        };

        img.onerror = reject;
        img.src = imageSrc;
    });
};