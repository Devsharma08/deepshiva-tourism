# Monthly Video Hero Component

This component creates a Switzerland tourism-style hero section with rotating monthly videos and a progress timer.

## Features

- **Auto-rotating videos**: Changes every 20 seconds
- **Progress bar**: Shows countdown to next video
- **Month navigation**: Click to jump to specific months
- **Play/Pause controls**: Control video playback
- **YouTube support**: Handles both YouTube and direct video URLs
- **Responsive design**: Works on all screen sizes

## Usage

```jsx
import MonthlyVideoHero from '../components/MonthlyVideoHero';

function YourPage() {
  return (
    <div>
      <MonthlyVideoHero />
      {/* Your other content */}
    </div>
  );
}
```

## Adding New Videos

To add more months and videos, edit the `monthlyVideos` array in `MonthlyVideoHero.jsx`:

```jsx
const monthlyVideos = [
  {
    month: "June",
    location: "India: Leh–Ladakh",
    videoUrl: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID",
    isYouTube: true,
    description: "Your description here"
  },
  {
    month: "July", 
    location: "Your Location",
    videoSrc: "https://your-direct-video-url.mp4",
    isYouTube: false,
    description: "Your description here"
  }
];
```

## Video Types Supported

1. **YouTube Videos**: Set `isYouTube: true` and use `videoUrl`
2. **Direct MP4 Videos**: Set `isYouTube: false` and use `videoSrc`

## Customization

- **Timer Duration**: Change `INTERVAL_DURATION` (default: 20 seconds)
- **Styling**: Modify the CSS classes or `MonthlyVideoHero.css`
- **Content**: Update the heading text in the JSX

## Notes

- YouTube videos auto-play muted due to browser policies
- Direct video files should be optimized for web (compressed, proper format)
- The component is fully responsive and works on mobile devices
- Progress bar and controls are accessible via keyboard navigation