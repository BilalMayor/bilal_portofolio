// scripts/optimize-images.js
const sharp = require('sharp');
const fs = require('fs').promises;
const path = require('path');
const { glob } = require('glob');

async function optimizeImages() {
    console.log('🚀 Starting image optimization...');

    const images = await glob('public/images/**/*.{jpg,jpeg,png}');

    for (const imagePath of images) {
        try {
            const ext = path.extname(imagePath);
            const name = path.basename(imagePath, ext);
            const dir = path.dirname(imagePath);

            // Skip jika sudah ada versi webp
            const webpPath = path.join(dir, `${name}.webp`);
            if (await fs.access(webpPath).then(() => true).catch(() => false)) {
                console.log(`✓ Already optimized: ${name}`);
                continue;
            }

            console.log(`⚡ Optimizing: ${name}${ext}`);

            // Baca dan optimasi
            const imageBuffer = await fs.readFile(imagePath);
            const metadata = await sharp(imageBuffer).metadata();

            // Buat versi webp
            await sharp(imageBuffer)
                .resize({
                    width: Math.min(metadata.width, 1200),
                    height: Math.min(metadata.height, 1200),
                    fit: 'inside',
                    withoutEnlargement: true
                })
                .webp({
                    quality: 80,
                    effort: 6
                })
                .toFile(webpPath);

            // Buat versi thumbnail
            await sharp(imageBuffer)
                .resize(400, 300, { fit: 'cover' })
                .webp({ quality: 60 })
                .toFile(path.join(dir, `${name}-thumb.webp`));

            console.log(`✅ Optimized: ${name}.webp`);

        } catch (error) {
            console.error(`❌ Error optimizing ${imagePath}:`, error.message);
        }
    }

    console.log('🎉 All images optimized!');
}

optimizeImages();