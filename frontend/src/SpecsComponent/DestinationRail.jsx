import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, MapPin, Compass } from "lucide-react";
import { getImageUrl, getPlaceholderImage } from '../utils/wikimediaService';

const DeastinationRail = ({ destinations }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [destinationImages, setDestinationImages] = useState({});

  if (!destinations || destinations.length === 0) return null;

  // Fetch images from Wikimedia Commons
  useEffect(() => {
    const fetchImages = async () => {
      const imageMap = {};

      for (const dest of destinations) {
        try {
          // Determine context based on destination type
          const contextMap = {
            'City': 'city', 'Desert': 'state', 'Lakes': 'city', 'Wonder': 'monument',
            'Spiritual': 'temple', 'Pilgrimage': 'temple', 'Lake': 'city', 'Skiing': 'mountain',
            'Hill Station': 'mountain', 'Nature': 'mountain', 'Backwaters': 'city',
            'Hills': 'mountain', 'Heritage': 'monument', 'Beach': 'beach', 'Wildlife': 'wildlife',
            'Temple': 'temple', 'Island': 'beach', 'Monument': 'monument', 'Yoga': 'city',
            'Tea': 'mountain', 'Church': 'temple', 'Ruins': 'monument', 'Fort': 'monument'
          };
          const context = contextMap[dest.type] || 'city';
          const img = await getImageUrl(dest.name, context);
          if (img) {
            imageMap[dest.name] = img;
          }
        } catch (error) {
          console.log(`Failed to fetch image for ${dest.name}`);
        }
      }

      setDestinationImages(imageMap);
    };

    fetchImages();
  }, [destinations]);

  // Get image for a destination with Wikimedia preference
  const getDestinationImage = (dest) => {
    if (destinationImages[dest.name]) return destinationImages[dest.name];
    return getPlaceholderImage(dest.name);
  };

  // Logic to calculate Next Slide
  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % destinations.length);
      setIsAnimating(false);
    }, 500); // Animation duration
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
      setIsAnimating(false);
    }, 500);
  };

  // Auto-play
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [activeIndex]);

  const activeItem = destinations[activeIndex];
  const nextItem = destinations[(activeIndex + 1) % destinations.length];

  return (
    <div style={styles.wrapper}>

      {/* HEADER */}
      <div style={styles.header}>
        <div className="flex flex-col gap-y-[3px]">
          <h3 style={styles.heading}>Featured Destinations</h3>
          <div style={styles.subHeading}>Top Recomendations </div>
        </div>
        <div style={styles.pagination}>
          {activeIndex + 1} <span style={{ color: '#cbd5e1' }}>/</span> {destinations.length}
        </div>
      </div>

      {/* MAIN "CARD INSIDE CARD" LAYOUT */}
      <div style={styles.mainCard}>

        {/* LEFT SIDE: Content Info */}
        <div style={styles.leftPanel}>
          <div className={isAnimating ? "fade-out" : "fade-in"}>
            <div style={styles.tag}>
              <Compass size={14} /> {activeItem.type || "Must Visit"}
            </div>

            <h1 style={styles.title}>{activeItem.name}</h1>

            <div style={styles.divider} />

            <p style={styles.description}>
              {activeItem.desc || "Experience the breathtaking beauty, rich culture, and historic significance of this amazing destination."}
            </p>

            <div style={styles.metaRow}>
              <div style={styles.metaItem}>
                <MapPin size={16} className="text-blue-500" />
                <span>Best Time: Oct-Mar</span>
              </div>
            </div>

            <button style={styles.ctaBtn}>
              View Itinerary <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* RIGHT SIDE: Image & Navigation */}
        <div style={styles.rightPanel}>

          {/* Main Background Image */}
          <img
            src={getDestinationImage(activeItem)}
            alt={activeItem.name}
            style={styles.mainImage}
            className={isAnimating ? "zoom-out" : "zoom-in"}
            onError={(e) => { e.target.src = getPlaceholderImage(activeItem.name); }}
          />
          <div style={styles.imageOverlay} />

          {/* "CARD INSIDE CARD": The Next Preview */}
          <div style={styles.floatingCard} onClick={nextSlide}>
            <div style={styles.nextLabel}>Up Next</div>
            <div style={styles.nextContent}>
              <img
                src={getDestinationImage(nextItem)}
                alt="Next"
                style={styles.nextImage}
                onError={(e) => { e.target.src = getPlaceholderImage(nextItem.name); }}
              />
              <div style={styles.nextInfo}>
                <div style={styles.nextTitle}>{nextItem.name}</div>
                <div style={styles.arrowIcon}><ArrowRight size={14} /></div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <div style={styles.controls}>
            <button onClick={prevSlide} style={styles.navBtn}>
              <ArrowLeft size={20} />
            </button>
            <button onClick={nextSlide} style={styles.navBtn}>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

      </div>

      {/* ANIMATION STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@300;400;600&display=swap');

        .fade-in { opacity: 1; transform: translateY(0); transition: all 0.5s ease-out; }
        .fade-out { opacity: 0; transform: translateY(10px); transition: all 0.4s ease-in; }

        .zoom-in { transform: scale(1); transition: transform 6s ease; }
        .zoom-out { transform: scale(1.05); transition: transform 0.5s ease; }
      `}</style>
    </div>
  );
};

const styles = {
  wrapper: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "80px 20px",
    fontFamily: "'Inter', sans-serif",
  },
  subHeading: {
    fontSize: "0.85rem",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "2px",
    fontWeight: "600",
    marginTop: "5px"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "35px",
    paddingLeft: "20px",
    borderLeft: "4px solid transparent",
    borderImage: "linear-gradient(180deg, #3b82f6, #8b5cf6) 1"
  },
  heading: {
    fontFamily: "'Cinzel', serif",
    fontSize: "2.5rem",
    fontWeight: "700",
    color: "#0f172a",
    margin: "0 0 5px 0",
    letterSpacing: "-1px",
    background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text"
  },
  pagination: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#94a3b8",
    background: "rgba(148, 163, 184, 0.1)",
    padding: "8px 16px",
    borderRadius: "50px"
  },

  // --- MAIN CARD CONTAINER - Premium Design ---
  mainCard: {
    display: "flex",
    flexDirection: "row",
    height: "550px",
    backgroundColor: "#ffffff",
    borderRadius: "32px",
    overflow: "hidden",
    boxShadow: "0 30px 60px -15px rgba(0, 0, 0, 0.12), 0 10px 20px -5px rgba(0, 0, 0, 0.04)",
    border: "1px solid rgba(241, 245, 249, 0.8)",
    transition: "all 0.4s ease"
  },

  // --- LEFT PANEL (Text) - Premium Design ---
  leftPanel: {
    flex: "0 0 42%",
    padding: "70px 60px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
    position: "relative",
    zIndex: 2,
    background: "linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)"
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.7rem",
    textTransform: "uppercase",
    fontWeight: "700",
    color: "#3b82f6",
    letterSpacing: "2px",
    marginBottom: "25px",
    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
    padding: "8px 16px",
    borderRadius: "50px",
    width: "fit-content"
  },
  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: "3.2rem",
    color: "#0f172a",
    margin: "0 0 25px 0",
    lineHeight: "1.1",
    letterSpacing: "-1px",
    fontWeight: "600"
  },
  divider: {
    width: "80px",
    height: "4px",
    background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
    borderRadius: "4px",
    marginBottom: "30px"
  },
  description: {
    fontSize: "1.05rem",
    lineHeight: "1.8",
    color: "#64748b",
    marginBottom: "40px",
    fontWeight: "400"
  },
  metaRow: {
    display: "flex",
    gap: "25px",
    marginBottom: "45px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#475569"
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "rgba(241, 245, 249, 0.8)",
    padding: "10px 16px",
    borderRadius: "50px"
  },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    padding: "16px 36px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "white",
    borderRadius: "50px",
    fontSize: "0.95rem",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    width: "fit-content",
    boxShadow: "0 10px 30px -5px rgba(15, 23, 42, 0.3)"
  },

  // --- RIGHT PANEL (Image + Navigation) ---
  rightPanel: {
    flex: "1",
    position: "relative",
    overflow: "hidden"
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 6s ease"
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 25%)",
    pointerEvents: "none"
  },

  // --- FLOATING "NEXT" CARD - Premium Glassmorphism ---
  floatingCard: {
    position: "absolute",
    bottom: "45px",
    right: "45px",
    width: "240px",
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderRadius: "24px",
    padding: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.05)",
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    border: "1px solid rgba(255,255,255,0.6)"
  },
  nextLabel: {
    fontSize: "0.65rem",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#94a3b8",
    marginBottom: "10px",
    paddingLeft: "4px",
    letterSpacing: "1.5px"
  },
  nextContent: {
    display: "flex",
    alignItems: "center",
    gap: "14px"
  },
  nextImage: {
    width: "56px",
    height: "56px",
    borderRadius: "14px",
    objectFit: "cover",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
  },
  nextInfo: {
    flex: 1,
    overflow: "hidden"
  },
  nextTitle: {
    fontSize: "0.95rem",
    fontWeight: "700",
    color: "#0f172a",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: "2px"
  },
  arrowIcon: {
    marginTop: "4px",
    color: "#3b82f6",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "0.75rem"
  },

  // --- CONTROLS - Premium Nav Buttons ---
  controls: {
    position: "absolute",
    bottom: "45px",
    left: "45px",
    display: "flex",
    gap: "14px"
  },
  navBtn: {
    width: "54px",
    height: "54px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.9) 100%)",
    color: "white",
    border: "1px solid rgba(255,255,255,0.1)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
    transition: "all 0.3s ease",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
  }
};

export default DeastinationRail;