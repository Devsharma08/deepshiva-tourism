/**
 * Dynamic Image Component for Tourism Data
 * Automatically fetches images from Wikimedia Commons based on context
 * Replaces static Unsplash URLs with dynamic, accurate images
 */

import React, { useState, useEffect, memo } from 'react';
import { getImageUrl, getIndiaLocationImage, getPlaceholderImage } from '../utils/wikimediaService';

// Cache for storing fetched image URLs to avoid redundant calls
const localImageCache = new Map();

/**
 * Smart Image component that fetches from Wikimedia Commons
 * Falls back to provided src if Wikimedia fails
 */
const DynamicImage = memo(({
    name,
    context = 'default',
    fallbackSrc = null,
    className = '',
    style = {},
    alt = '',
    ...props
}) => {
    const [imageSrc, setImageSrc] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!name) {
            setImageSrc(fallbackSrc || getPlaceholderImage('Image'));
            setLoading(false);
            return;
        }

        const cacheKey = `${name}_${context}`;

        // Check local cache first
        if (localImageCache.has(cacheKey)) {
            setImageSrc(localImageCache.get(cacheKey));
            setLoading(false);
            return;
        }

        const fetchImage = async () => {
            setLoading(true);
            try {
                const url = await getIndiaLocationImage(name, context);
                if (url) {
                    localImageCache.set(cacheKey, url);
                    setImageSrc(url);
                } else {
                    // Use fallback or placeholder
                    setImageSrc(fallbackSrc || getPlaceholderImage(name));
                }
            } catch (err) {
                console.warn(`Failed to fetch image for ${name}:`, err);
                setImageSrc(fallbackSrc || getPlaceholderImage(name));
            } finally {
                setLoading(false);
            }
        };

        fetchImage();
    }, [name, context, fallbackSrc]);

    const handleError = () => {
        if (!error) {
            setError(true);
            setImageSrc(getPlaceholderImage(name || 'Image'));
        }
    };

    if (loading) {
        return (
            <div
                className={className}
                style={{
                    ...style,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: style.height || '200px'
                }}
            >
                <div style={{
                    width: '30px',
                    height: '30px',
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderTop: '3px solid white',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }} />
                <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        );
    }

    return (
        <img
            src={imageSrc}
            alt={alt || name}
            className={className}
            style={style}
            onError={handleError}
            {...props}
        />
    );
});

DynamicImage.displayName = 'DynamicImage';

/**
 * Hero Image component for state pages
 */
export const StateHeroImage = memo(({ stateName, fallbackSrc, className, style, ...props }) => (
    <DynamicImage
        name={stateName}
        context="state"
        fallbackSrc={fallbackSrc}
        className={className}
        style={style}
        {...props}
    />
));

/**
 * Destination Image component
 */
export const DestinationImage = memo(({ destinationName, type, fallbackSrc, className, style, ...props }) => {
    // Determine context based on destination type
    const getContext = (destType) => {
        const typeMap = {
            'City': 'city',
            'Desert': 'state',
            'Lakes': 'city',
            'Wonder': 'monument',
            'Spiritual': 'temple',
            'Pilgrimage': 'temple',
            'Lake': 'city',
            'Skiing': 'mountain',
            'Hill Station': 'mountain',
            'Nature': 'mountain',
            'Backwaters': 'city',
            'Hills': 'mountain',
            'Heritage': 'monument',
            'Beach': 'beach',
            'Wildlife': 'wildlife',
            'Temple': 'temple',
            'Island': 'beach',
            'Monument': 'monument',
            'River': 'city',
            'Yoga': 'city',
            'Tea': 'mountain',
            'History': 'monument',
            'Church': 'temple',
            'Ruins': 'monument',
            'Fort': 'monument',
            'Caves': 'monument'
        };
        return typeMap[destType] || 'city';
    };

    return (
        <DynamicImage
            name={destinationName}
            context={getContext(type)}
            fallbackSrc={fallbackSrc}
            className={className}
            style={style}
            {...props}
        />
    );
});

/**
 * Food Image component
 */
export const FoodImage = memo(({ foodName, fallbackSrc, className, style, ...props }) => (
    <DynamicImage
        name={foodName}
        context="food"
        fallbackSrc={fallbackSrc}
        className={className}
        style={style}
        {...props}
    />
));

/**
 * Background Image with Wikimedia
 * For use in hero sections with background-image CSS
 */
export const useWikimediaBackground = (name, context = 'state') => {
    const [backgroundUrl, setBackgroundUrl] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!name) {
            setLoading(false);
            return;
        }

        const cacheKey = `bg_${name}_${context}`;

        if (localImageCache.has(cacheKey)) {
            setBackgroundUrl(localImageCache.get(cacheKey));
            setLoading(false);
            return;
        }

        const fetchBackground = async () => {
            try {
                const url = await getIndiaLocationImage(name, context);
                if (url) {
                    localImageCache.set(cacheKey, url);
                    setBackgroundUrl(url);
                }
            } catch (err) {
                console.warn(`Failed to fetch background for ${name}`);
            } finally {
                setLoading(false);
            }
        };

        fetchBackground();
    }, [name, context]);

    return { backgroundUrl, loading };
};

/**
 * Preload images for a state
 * Call this when state page loads to start fetching all images
 */
export const preloadStateImages = async (stateData) => {
    if (!stateData) return;

    const promises = [];

    // Preload hero image
    if (stateData.name) {
        promises.push(getIndiaLocationImage(stateData.name, 'state'));
    }

    // Preload destination images
    if (stateData.destinations) {
        stateData.destinations.forEach(dest => {
            promises.push(getImageUrl(dest.name, 'city'));
        });
    }

    // Preload food images
    if (stateData.food) {
        stateData.food.forEach(food => {
            promises.push(getImageUrl(food.name, 'food'));
        });
    }

    await Promise.allSettled(promises);
};

export default DynamicImage;
