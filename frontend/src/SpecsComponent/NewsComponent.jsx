import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, ExternalLink, Calendar } from "lucide-react";
import { cachedFetch } from "../utils/ContextManager";

// Accept stateName as a prop for reliability, fall back to URL params
const NewsCarousel = ({ stateName: propStateName }) => {
  const params = useParams();
  // Priority: Prop > URL Param > Default "India"
  const displayState = propStateName || params.stateName || "India";

  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  // --- Mock Data Fallback ---
  const getMockNews = (state) => [
    {
      title: `New Eco-Tourism Circuit Announced in ${state}`,
      description: `The tourism department has unveiled a new sustainable travel circuit connecting heritage villages and wildlife sanctuaries in ${state}.`,
      publishedAt: new Date().toISOString(),
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1596392927810-736021648a90?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: `${state} Heritage Festival Draws Record Crowds`,
      description: "Cultural performances, food stalls, and art exhibitions highlighted the annual heritage week, attracting tourists from across the globe.",
      publishedAt: new Date(Date.now() - 86400000).toISOString(),
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1532664189809-02133fee698d?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Top 5 Luxury Resorts Opening This Season",
      description: `Experience royal hospitality like never before. Check out the latest heritage hotels opening their doors in ${state}.`,
      publishedAt: new Date(Date.now() - 172800000).toISOString(),
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Adventure Sports Policy Revamped",
      description: "New safety guidelines and zones for paragliding and trekking have been established to ensure tourist safety.",
      publishedAt: new Date(Date.now() - 250000000).toISOString(),
      url: "#",
      urlToImage: "https://images.unsplash.com/photo-1533692328991-0815989768f2?q=80&w=800&auto=format&fit=crop"
    }
  ];

  // --- Real API Fetching Logic ---
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Use displayState here to ensure we search for the specific region
        const query = `${displayState} tourism India travel`;

        // Safely access env var or use empty string
        const apiKey = import.meta.env?.VITE_NEWS_API_KEY || "";

        // Only fetch if we have a key, otherwise jump straight to mock
        if (!apiKey) {
          throw new Error("No API Key");
        }

        const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`;

        // Cache news for 6 hours
        const data = await cachedFetch(url, {
          cacheTTL: 6 * 60 * 60 * 1000,
          cacheKey: `news_${displayState.replace(/\s/g, '_')}`
        });

        if (data.articles && data.articles.length > 0) {
          setNews(data.articles.slice(0, 6));
        } else {
          setNews(getMockNews(displayState));
        }
      } catch (error) {
        // console.warn('News fetch failed (using fallback data):', error);
        setNews(getMockNews(displayState));
      }
      setLoading(false);
    };

    fetchNews();
  }, [displayState]); // Dependency updated to displayState

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % news.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + news.length) % news.length);

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return "Recent";
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.heading}>Latest Insights</h3>
          <div style={styles.line}></div>
        </div>
        <div style={styles.loadingState}>
          <div className="spinner"></div>
        </div>
        <style>{`.spinner { width: 20px; height: 20px; border: 2px solid rgba(255,255,255,0.1); border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={styles.container}>

      {/* Header Section (Top Left) */}
      <div style={styles.header}>
        <h3 style={styles.heading}>Regional Updates</h3>
        <div style={styles.subHeading}>Curated news from {displayState}</div>
      </div>

      {/* Carousel Container */}
      <div style={styles.carouselViewport}>

        {/* Cards Track */}
        <div style={styles.cardsContainer}>
          {news.map((item, index) => {
            let position = 'hidden';
            if (index === currentIndex) position = 'active';
            else if (index === (currentIndex + 1) % news.length) position = 'next';
            else if (index === (currentIndex - 1 + news.length) % news.length) position = 'prev';

            return (
              <div
                key={index}
                className={`news-card ${position}`}
                style={{ ...styles.card, ...styles[position] }}
              >
                {/* Image Section */}
                <div style={styles.imageContainer}>
                  <img
                    src={item.urlToImage || item.image || "https://images.unsplash.com/photo-1596392927810-736021648a90?q=80&w=800&auto=format&fit=crop"}
                    alt={item.title}
                    style={styles.image}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1596392927810-736021648a90?q=80&w=800&auto=format&fit=crop" }}
                  />
                  <div style={styles.imageOverlay}></div>
                  <div style={styles.dateBadge}>
                    <Calendar size={12} color="white" />
                    <span>{formatDate(item.publishedAt)}</span>
                  </div>
                </div>

                {/* Content Section */}
                <div style={styles.content}>
                  <h4 style={styles.cardTitle}>{item.title}</h4>
                  <p style={styles.cardDesc}>{item.description ? item.description.substring(0, 80) : "Latest updates from the region..."}...</p>

                  <a href={item.url} target="_blank" rel="noopener noreferrer" style={styles.readMoreBtn}>
                    Read Full Story <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls */}
        <div style={styles.controls}>
          <button onClick={prevSlide} style={styles.navButton}>
            <ChevronLeft size={20} />
          </button>

          <div style={styles.dots}>
            {news.map((_, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.dot,
                  background: idx === currentIndex ? '#3b82f6' : 'rgba(255,255,255,0.2)'
                }}
              />
            ))}
          </div>

          <button onClick={nextSlide} style={styles.navButton}>
            <ChevronRight size={20} />
          </button>
        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Inter:wght@300;400;500&display=swap');

        .news-card {
          position: absolute;
          transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
          opacity: 0;
          transform: scale(0.9) translateX(0);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.3);
        }
        
        .news-card.active {
          opacity: 1;
          transform: translateX(0) scale(1);
          z-index: 10;
          box-shadow: 0 20px 50px -12px rgba(0, 0, 0, 0.5);
        }
        
        .news-card.next {
          opacity: 0.4;
          transform: translateX(105%) scale(0.85) rotateY(-10deg);
          z-index: 5;
          filter: blur(2px);
        }
        
        .news-card.prev {
          opacity: 0.4;
          transform: translateX(-105%) scale(0.85) rotateY(10deg);
          z-index: 5;
          filter: blur(2px);
        }

        .news-card:hover .image-overlay {
          background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
        }
      `}</style>
    </div>
  );
};

const styles = {
  container: {
    padding: "60px 0",
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden" // Keeps content within bounds
  },
  header: {
    marginBottom: "40px",
    paddingLeft: "20px",
    borderLeft: "4px solid #3b82f6",
    textAlign: "left"
  },
  heading: {
    fontFamily: "'Cinzel', serif",
    fontSize: "2rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 5px 0",
    letterSpacing: "-0.5px"
  },
  subHeading: {
    fontSize: "0.9rem",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "1px",
    fontWeight: "500"
  },
  loadingState: {
    height: "300px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "20px"
  },
  carouselViewport: {
    position: "relative",
    height: "320px",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    perspective: "1000px",
    overflow: "hidden"
  },
  cardsContainer: {
    position: "relative",
    width: "100%",
    maxWidth: "450px", // Compact card width
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  card: {
    width: "100%",
    height: "280px", // Compact height
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    borderRadius: "20px",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  imageContainer: {
    height: "55%",
    position: "relative",
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "transform 0.5s ease"
  },
  imageOverlay: {
    position: "absolute",
    inset: 0,
    background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)"
  },
  dateBadge: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    color: "white",
    fontSize: "0.7rem",
    padding: "4px 8px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontWeight: "600"
  },
  content: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    flex: 1,
    justifyContent: "space-between"
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "#1e293b",
    margin: "0 0 8px 0",
    lineHeight: "1.3",
    fontFamily: "'Cinzel', serif"
  },
  cardDesc: {
    fontSize: "0.85rem",
    color: "#64748b",
    lineHeight: "1.5",
    margin: 0
  },
  readMoreBtn: {
    marginTop: "15px",
    alignSelf: "flex-start",
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#2563eb",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    paddingBottom: "2px",
    borderBottom: "1px solid transparent",
    transition: "all 0.2s"
  },
  controls: {
    marginTop: "20px",
    display: "flex",
    alignItems: "center",
    gap: "20px"
  },
  navButton: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "1px solid rgba(0,0,0,0.1)",
    background: "white",
    color: "#1e293b",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },
  dots: {
    display: "flex",
    gap: "8px"
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    transition: "all 0.3s"
  }
};

export default NewsCarousel;