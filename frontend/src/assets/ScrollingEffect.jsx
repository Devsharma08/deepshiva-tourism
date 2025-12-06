import React, { useEffect, useState } from 'react';

// --- THE STANDALONE COMPONENT YOU REQUESTED ---
export const FashionProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      
      // Calculate progress percentage (0 to 100)
      const currentProgress = scrollHeight > 0 ? (currentScrollY / scrollHeight) * 100 : 0;
      
      setProgress(currentProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css?family=Montserrat:800,200,400,600');
        .font-montserrat { font-family: 'Montserrat', sans-serif; }
      `}</style>
      
      <div className="fixed top-8 right-8 z-50 flex flex-col gap-2 mix-blend-difference text-white font-montserrat">
        <div className="flex items-center gap-3">
           <span className="text-xs font-bold tracking-[0.3em] uppercase">India</span>
           <span className="text-[10px] font-light tracking-widest opacity-80">
             {Math.round(progress)}%
           </span>
        </div>
        
        {/* The Progress Line */}
        <div className="w-24 h-[2px] bg-white/20 relative overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-white transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </>
  );
};