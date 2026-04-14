import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import loadingGif from "./assets/InitLoading.gif";
import initBg from "./assets/InitBG.jpg";
import { useAudio } from "./AudioProvider";

export default function Loading() {
  const [status, setStatus] = useState("loading"); // "loading", "start", "done"
  const [progress, setProgress] = useState("0/2 loaded");
  const navigate = useNavigate();
  const { playConfirm } = useAudio();

  useEffect(() => {
    // Tunggu 3.25 detik sebelum mulai check loading
    const initTimer = setTimeout(() => {
      const videos = document.getElementsByTagName("video");
      
      const checkReady = setInterval(() => {
        let loadedCount = 0;
        for (let i = 0; i < videos.length; i++) {
          if (videos[i].readyState === 4) {
            loadedCount++;
          }
        }
        setProgress(`${loadedCount}/${videos.length} loaded`);
        
        if (loadedCount === videos.length) {
          clearInterval(checkReady);
          setStatus("start");
          // Auto start setelah 1 detik
          setTimeout(() => {
            setStatus("done");
            playConfirm();
            // Delay dikit biar audio keplay dulu baru navigate
            setTimeout(() => {
              navigate("/menu");
            }, 500);
          }, 1000);
        }
      }, 700);

      // Timeout fallback 12 detik
      const timeout = setTimeout(() => {
        clearInterval(checkReady);
        setStatus("start");
        setTimeout(() => {
          setStatus("done");
          playConfirm();
          setTimeout(() => {
            navigate("/menu");
          }, 500);
        }, 1000);
      }, 12000);

      return () => {
        clearInterval(checkReady);
        clearTimeout(timeout);
      };
    }, 3250);

    return () => clearTimeout(initTimer);
  }, [navigate, playConfirm]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${initBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#c4001a",
      }}
    >
      <style>{`
        @font-face {
          font-family: 'Persona';
          src: url('./assets/UXFont.ttf') format('truetype');
        }
        .loading-text {
          font-family: 'Bebas Neue', 'Anton', sans-serif;
          font-size: 24px;
          color: white;
          letter-spacing: 2px;
          margin-top: 20px;
        }
        .start-text {
          font-family: 'Anton', sans-serif;
          font-size: 64px;
          color: white;
          text-shadow: -3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000;
          animation: pulse 1s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinner {
          animation: spin 2s linear infinite;
        }
      `}</style>

      {status === "loading" && (
        <>
          <img 
            src={loadingGif} 
            alt="Loading" 
            height="60" 
            style={{ imageRendering: "pixelated" }}
          />
          <span className="loading-text">{progress}</span>
        </>
      )}

      {status === "start" && (
        <span className="start-text">Start...</span>
      )}

      {status === "done" && (
        <span className="start-text" style={{ color: "#ffff00" }}>Loading Complete</span>
      )}
    </div>
  );
}
