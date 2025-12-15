/**
 * React Hook for Wikimedia Commons Images
 * Provides easy integration with React components for dynamic image loading
 */

import { useState, useEffect, useCallback } from 'react';
import {
    getImageUrl,
    getMultipleImages,
    getGalleryImages,
    getIndiaLocationImage
} from '../utils/wikimediaService';

/**
 * Hook to fetch a single image from Wikimedia Commons
 * @param {string} keyword - Search keyword
 * @param {string} context - Image context (state, city, temple, food, etc.)
 * @param {string} fallbackUrl - Fallback URL if image not found
 * @returns {Object} { imageUrl, loading, error, refetch }
 */
export function useWikimediaImage(keyword, context = 'default', fallbackUrl = null) {
    const [imageUrl, setImageUrl] = useState(fallbackUrl);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchImage = useCallback(async () => {
        if (!keyword) {
            setImageUrl(fallbackUrl);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const url = await getImageUrl(keyword, context, fallbackUrl);
            setImageUrl(url);
        } catch (err) {
            console.error('Error fetching Wikimedia image:', err);
            setError(err);
            setImageUrl(fallbackUrl);
        } finally {
            setLoading(false);
        }
    }, [keyword, context, fallbackUrl]);

    useEffect(() => {
        fetchImage();
    }, [fetchImage]);

    return { imageUrl, loading, error, refetch: fetchImage };
}

/**
 * Hook to fetch multiple images from Wikimedia Commons
 * @param {string} keyword - Search keyword
 * @param {string} context - Image context
 * @param {number} count - Number of images to fetch
 * @returns {Object} { images, loading, error, refetch }
 */
export function useWikimediaImages(keyword, context = 'default', count = 3) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchImages = useCallback(async () => {
        if (!keyword) {
            setImages([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const urls = await getMultipleImages(keyword, context, count);
            setImages(urls);
        } catch (err) {
            console.error('Error fetching Wikimedia images:', err);
            setError(err);
            setImages([]);
        } finally {
            setLoading(false);
        }
    }, [keyword, context, count]);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    return { images, loading, error, refetch: fetchImages };
}

/**
 * Hook to fetch gallery images with metadata
 * @param {string} keyword - Search keyword
 * @param {string} context - Image context
 * @param {number} count - Number of images
 * @returns {Object} { gallery, loading, error, refetch }
 */
export function useWikimediaGallery(keyword, context = 'default', count = 6) {
    const [gallery, setGallery] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGallery = useCallback(async () => {
        if (!keyword) {
            setGallery([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const images = await getGalleryImages(keyword, context, count);
            setGallery(images);
        } catch (err) {
            console.error('Error fetching Wikimedia gallery:', err);
            setError(err);
            setGallery([]);
        } finally {
            setLoading(false);
        }
    }, [keyword, context, count]);

    useEffect(() => {
        fetchGallery();
    }, [fetchGallery]);

    return { gallery, loading, error, refetch: fetchGallery };
}

/**
 * Hook optimized for Indian location images
 * Uses predefined search queries for better accuracy
 * @param {string} locationName - Name of Indian location
 * @param {string} fallbackContext - Fallback context if location not in mappings
 * @returns {Object} { imageUrl, loading, error, refetch }
 */
export function useIndiaLocationImage(locationName, fallbackContext = 'default') {
    const [imageUrl, setImageUrl] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchImage = useCallback(async () => {
        if (!locationName) {
            setImageUrl(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const url = await getIndiaLocationImage(locationName, fallbackContext);
            setImageUrl(url);
        } catch (err) {
            console.error('Error fetching India location image:', err);
            setError(err);
            setImageUrl(null);
        } finally {
            setLoading(false);
        }
    }, [locationName, fallbackContext]);

    useEffect(() => {
        fetchImage();
    }, [fetchImage]);

    return { imageUrl, loading, error, refetch: fetchImage };
}

/**
 * Component wrapper for lazy-loaded Wikimedia images
 * Handles loading states and error fallbacks
 */
export function WikimediaImage({
    keyword,
    context = 'default',
    fallbackUrl = null,
    className = '',
    alt = '',
    style = {},
    onLoad,
    onError
}) {
    const { imageUrl, loading, error } = useWikimediaImage(keyword, context, fallbackUrl);

    const handleError = (e) => {
        if (fallbackUrl) {
            e.target.src = fallbackUrl;
        }
        onError?.(e);
    };

    if (loading) {
        return (
            <div
                className={`wikimedia-image-loading ${className}`}
                style={{
                    ...style,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <div className="loading-spinner" style={{
                    width: '24px',
                    height: '24px',
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
            </div>
        );
    }

    return (
        <img
            src={imageUrl || fallbackUrl}
            alt={alt || keyword}
            className={className}
            style={style}
            onLoad={onLoad}
            onError={handleError}
        />
    );
}

export default {
    useWikimediaImage,
    useWikimediaImages,
    useWikimediaGallery,
    useIndiaLocationImage,
    WikimediaImage
};
