import { useState, useEffect, useRef } from 'react';

const OptimizedImage = ({
    src,
    alt,
    className = '',
    placeholder,
    onLoad,
    priority = false
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(priority);
    const [currentSrc, setCurrentSrc] = useState(placeholder || '');
    const imgRef = useRef(null);

    // Intersection Observer untuk lazy loading
    useEffect(() => {
        if (priority || !imgRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setIsInView(true);
                        observer.disconnect();
                    }
                });
            },
            {
                rootMargin: '50px', // Mulai load 50px sebelum masuk viewport
                threshold: 0.01
            }
        );

        observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, [priority]);

    // Load gambar saat masuk viewport
    useEffect(() => {
        if (!isInView || !src) return;

        const img = new Image();

        img.onload = () => {
            setCurrentSrc(src);
            setIsLoaded(true);
            onLoad?.();
        };

        img.onerror = () => {
            console.warn(`Failed to load image: ${src}`);
            setIsLoaded(true);
        };

        img.src = src;
    }, [isInView, src, onLoad]);

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
            {/* Placeholder blur */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-zinc-800 animate-pulse" />
            )}

            {/* Gambar utama */}
            <img
                src={currentSrc}
                alt={alt}
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
            />
        </div>
    );
};

export default OptimizedImage;
