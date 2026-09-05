/**
 * Konfigurasi optimasi gambar
 * Sesuaikan nilai-nilai ini untuk mengubah perilaku optimasi
 */

export const IMAGE_CONFIG = {
    // Jumlah gambar yang di-load dengan prioritas tinggi
    PRIORITY_COUNT: 3,

    // Delay antar loading gambar (ms)
    LOAD_DELAY: 50,

    // Timeout loading berdasarkan koneksi (ms)
    TIMEOUT: {
        slow: 3000,
        medium: 5000,
        fast: 8000,
    },

    // Quality kompresi berdasarkan koneksi (0-1)
    QUALITY: {
        slow: {
            mobile: 0.4,
            desktop: 0.5,
        },
        medium: {
            mobile: 0.6,
            desktop: 0.7,
        },
        fast: {
            mobile: 0.75,
            desktop: 0.85,
        },
    },

    // Max width berdasarkan device (px)
    MAX_WIDTH: {
        mobile: 600,
        tablet: 1000,
        desktop: 1400,
    },

    // Breakpoints untuk responsive (px)
    BREAKPOINTS: {
        mobile: 768,
        tablet: 1024,
    },

    // Format gambar
    FORMATS: {
        webp: 'image/webp',
        jpeg: 'image/jpeg',
    },

    // Placeholder dimensions
    PLACEHOLDER: {
        width: 400,
        height: 300,
    },

    // Intersection Observer options untuk lazy loading
    OBSERVER_OPTIONS: {
        rootMargin: '50px', // Mulai load 50px sebelum masuk viewport
        threshold: 0.01,
    },
};

export default IMAGE_CONFIG;
