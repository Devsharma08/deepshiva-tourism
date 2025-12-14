import React, { useState } from "react";

// Fallback image that is guaranteed to work
const FALLBACK_HERO = "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1920&q=80";

const HeroSection = ({ stateName, data, onBack }) => {
  const [imgError, setImgError] = useState(false);
  const heroImage = imgError ? FALLBACK_HERO : (data.heroImage || FALLBACK_HERO);

  return (
    <div style={styles.heroContainer}>
      {/* Hidden img to detect broken images */}
      <img src={data.heroImage} alt="" style={{ display: 'none' }} onError={() => setImgError(true)} />
      <div style={{ ...styles.bgImage, backgroundImage: `url(${heroImage})` }} />
      <div style={styles.gradientOverlay} />

      <button onClick={onBack} style={styles.backButton}>← Back</button>

      <div style={styles.content}>
        <span style={styles.tagline}>{data.tagline}</span>
        <h1 style={styles.title}>{stateName}</h1>
        <p style={styles.desc}>{data.desc}</p>
      </div>
    </div>
  );
};

const styles = {
  heroContainer: { position: "relative", height: "70vh", width: "100%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" },
  bgImage: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backgroundSize: "cover", backgroundPosition: "center", transform: "scale(1.1)" },
  gradientOverlay: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))" },
  content: { position: "relative", zIndex: 10, textAlign: "center", color: "white", maxWidth: "800px", padding: "20px" },
  tagline: { fontSize: "1rem", letterSpacing: "4px", textTransform: "uppercase", background: "rgba(255,255,255,0.2)", padding: "5px 15px", borderRadius: "20px", backdropFilter: "blur(5px)" },
  title: { fontSize: "5rem", margin: "10px 0", fontWeight: "800", textShadow: "0 10px 20px rgba(0,0,0,0.3)" },
  desc: { fontSize: "1.2rem", lineHeight: "1.6", opacity: 0.9 },
  backButton: { position: "absolute", top: 30, left: 30, zIndex: 20, background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "10px 20px", borderRadius: "30px", cursor: "pointer", backdropFilter: "blur(10px)" }
};

export default HeroSection;