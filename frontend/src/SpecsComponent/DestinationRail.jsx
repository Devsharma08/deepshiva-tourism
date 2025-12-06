import React, { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, MapPin, Compass } from "lucide-react";

const DeastinationRail = ({ destinations }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  if (!destinations || destinations.length === 0) return null;

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
          {activeIndex + 1} <span style={{color:'#cbd5e1'}}>/</span> {destinations.length}
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
            src={activeItem.img} 
            alt={activeItem.name} 
            style={styles.mainImage}
            className={isAnimating ? "zoom-out" : "zoom-in"}
          />
          <div style={styles.imageOverlay} />

          {/* "CARD INSIDE CARD": The Next Preview */}
          <div style={styles.floatingCard} onClick={nextSlide}>
            <div style={styles.nextLabel}>Up Next</div>
            <div style={styles.nextContent}>
               <img src={nextItem.img} alt="Next" style={styles.nextImage} />
               <div style={styles.nextInfo}>
                  <div style={styles.nextTitle}>{nextItem.name}</div>
                  <div style={styles.arrowIcon}><ArrowRight size={14}/></div>
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
    padding: "60px 0px",
    fontFamily: "'Inter', sans-serif",
  },
  subHeading: {
    fontSize: "0.9rem",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "500"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    paddingLeft: "15px",
    borderLeft: "4px solid #3b82f6"
  },
  heading: {
    fontFamily: "'Cinzel', serif",
    fontSize: "2rem",
    fontWeight: "900",
    color: "#1e293b",
    margin: "0 0 5px 0",
    letterSpacing: "-0.5px"
  },
  pagination: {
    fontSize: "1rem",
    fontWeight: "700",
    color: "#64748b"
  },

  // --- MAIN CARD CONTAINER ---
  mainCard: {
    display: "flex",
    flexDirection: "row", // Side by Side
    height: "500px",
    backgroundColor: "#ffffff",
    borderRadius: "32px",
    overflow: "hidden",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    border: "1px solid #f1f5f9"
  },

  // --- LEFT PANEL (Text) ---
  leftPanel: {
    flex: "0 0 40%", // Takes 40% width
    padding: "60px 50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "#fff",
    position: "relative",
    zIndex: 2
  },
  tag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "0.75rem",
    textTransform: "uppercase",
    fontWeight: "700",
    color: "#3b82f6",
    letterSpacing: "1px",
    marginBottom: "20px"
  },
  title: {
    fontFamily: "'Cinzel', serif",
    fontSize: "3rem",
    color: "#0f172a",
    margin: "0 0 20px 0",
    lineHeight: "1.1"
  },
  divider: {
    width: "60px",
    height: "4px",
    backgroundColor: "#e2e8f0",
    borderRadius: "2px",
    marginBottom: "25px"
  },
  description: {
    fontSize: "1rem",
    lineHeight: "1.7",
    color: "#64748b",
    marginBottom: "35px"
  },
  metaRow: {
    display: "flex",
    gap: "20px",
    marginBottom: "40px",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#475569"
  },
  metaItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "14px 32px",
    backgroundColor: "#0f172a",
    color: "white",
    borderRadius: "50px",
    fontSize: "0.9rem",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.2s",
    width: "fit-content"
  },

  // --- RIGHT PANEL (Image + Navigation) ---
  rightPanel: {
    flex: "1", // Takes remaining space (60%)
    position: "relative",
    overflow: "hidden"
  },
  mainImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 20%)",
    pointerEvents: "none"
  },

  // --- FLOATING "NEXT" CARD (The Card inside Card) ---
  floatingCard: {
    position: "absolute",
    bottom: "40px",
    right: "40px",
    width: "220px",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    backdropFilter: "blur(12px)",
    borderRadius: "20px",
    padding: "12px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    cursor: "pointer",
    transition: "transform 0.3s",
    border: "1px solid rgba(255,255,255,0.5)"
  },
  nextLabel: {
    fontSize: "0.7rem",
    fontWeight: "700",
    textTransform: "uppercase",
    color: "#64748b",
    marginBottom: "8px",
    paddingLeft: "4px"
  },
  nextContent: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  nextImage: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    objectFit: "cover"
  },
  nextInfo: {
    flex: 1,
    overflow: "hidden"
  },
  nextTitle: {
    fontSize: "0.9rem",
    fontWeight: "700",
    color: "#1e293b",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  arrowIcon: {
    marginTop: "2px",
    color: "#3b82f6"
  },

  // --- CONTROLS ---
  controls: {
    position: "absolute",
    bottom: "40px",
    left: "40px", // Bottom Left of the IMAGE section
    display: "flex",
    gap: "12px"
  },
  navBtn: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    color: "white",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    backdropFilter: "blur(4px)",
    transition: "background 0.3s"
  }
};

export default DeastinationRail;