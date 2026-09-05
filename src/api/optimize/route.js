// app/api/optimize/route.js
import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request) {
    try {
        const { imageUrl, width = 800, quality = 80, format = 'webp' } = await request.json();

        // Fetch gambar
        const response = await fetch(imageUrl);
        const buffer = await response.arrayBuffer();

        // Optimasi dengan sharp
        const optimizedImage = await sharp(Buffer.from(buffer))
            .resize(width, null, {
                withoutEnlargement: true,
                fit: 'inside'
            })
            .toFormat(format, {
                quality,
                progressive: true
            })
            .toBuffer();

        // Return sebagai base64 atau simpan ke CDN
        const base64Image = optimizedImage.toString('base64');
        const mimeType = format === 'webp' ? 'image/webp' : 'image/jpeg';

        return NextResponse.json({
            success: true,
            data: `data:${mimeType};base64,${base64Image}`,
            size: optimizedImage.length,
            originalSize: buffer.byteLength,
            compression: Math.round((1 - optimizedImage.length / buffer.byteLength) * 100)
        });

    } catch (error) {
        console.error('Optimization error:', error);
        return NextResponse.json(
            { error: 'Failed to optimize image' },
            { status: 500 }
        );
    }
}