// Utility functions for video handling

/**
 * Converts YouTube URL to embed format
 * @param {string} url - YouTube URL
 * @param {number} startTime - Start time in seconds (optional)
 * @returns {string} - Embed URL
 */
export const getYouTubeEmbedUrl = (url, startTime = 0) => {
  const videoId = extractYouTubeVideoId(url);
  console.log('Original URL:', url);
  console.log('Extracted Video ID:', videoId);
  console.log('Start Time:', startTime);

  if (!videoId) {
    console.error('Failed to extract video ID from URL:', url);
    return null;
  }

  // Use the exact format from YouTube's embed code with modifications for our needs
  let embedUrl = `https://www.youtube.com/embed/${videoId}?si=UM2_OZql3idEI76Z&controls=0&autoplay=1&mute=1&loop=1&playlist=${videoId}&vq=hd1080`;

  // Always add start time
  if (startTime > 0) {
    embedUrl += `&start=${startTime}`;
  }

  console.log('Generated embed URL:', embedUrl);
  return embedUrl;
};

/**
 * Extracts video ID from YouTube URL
 * @param {string} url - YouTube URL
 * @returns {string|null} - Video ID or null
 */
export const extractYouTubeVideoId = (url) => {
  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/user\/[^\/]+#p\/[a-z]\/[0-9]+\/([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      const videoId = match[1];
      console.log('Raw video ID:', videoId, 'Length:', videoId.length);

      // YouTube video IDs are typically 11 characters, but let's be flexible
      if (videoId.length >= 11) {
        return videoId;
      }
    }
  }

  return null;
};

/**
 * Checks if URL is a YouTube URL
 * @param {string} url - URL to check
 * @returns {boolean} - True if YouTube URL
 */
export const isYouTubeUrl = (url) => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};