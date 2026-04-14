import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGamepad } from "./useGamepad";
import { useAudio } from "./AudioProvider";
import bgVideo from "./assets/main1.mp4";

const GITHUB_LINKS = [
  { name: "blairxu13", url: "https://github.com/blairxu13" },
  { name: "Vloits", url: "https://github.com/vloits19" },
];

export default function CreditsPage() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [activeBtn, setActiveBtn] = useState(0); // 0 = blairxu13, 1 = Vloits

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  const { playHover, playConfirm, playCancel } = useAudio();

  const activateBtn = (idx) => {
    if (idx !== activeBtn) playHover();
    setActiveBtn(idx);
  };

  const handleKey = (e) => {
    // FIX: Cegah backspace trigger pas Ctrl+A atau modifier keys lain aktif
    if (e.ctrlKey || e.altKey || e.metaKey) return;

    if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") {
      playCancel();
      navigate("/menu");
    }
    if (e.key === "ArrowUp" || e.key === "LB") {
      activateBtn(Math.max(0, activeBtn - 1));
    }
    if (e.key === "ArrowDown" || e.key === "RB") {
      activateBtn(Math.min(GITHUB_LINKS.length - 1, activeBtn + 1));
    }
    if (e.key === "Enter") {
      playConfirm();
      window.open(GITHUB_LINKS[activeBtn].url, "_blank");
    }
  };

  useGamepad(handleKey);

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate, activeBtn]);

  const handleGithubClick = (idx) => {
    playConfirm();
    window.open(GITHUB_LINKS[idx].url, "_blank");
  };

  return (
    <div id="menu-screen">
      <video src={bgVideo} autoPlay loop muted playsInline />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&display=swap');

        .credits-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
        }

        .credits-container {
          position: relative;
          background: linear-gradient(180deg, rgba(15, 28, 105, 0.96) 0%, rgba(8, 16, 68, 0.97) 100%);
          padding: 48px 64px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 24px) 100%, 0 100%);
          box-shadow:
            inset 0 0 0 1px rgba(133, 244, 255, 0.16),
            16px 16px 0 rgba(0, 6, 30, 0.55);
          max-width: 600px;
          pointer-events: all;
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .credits-container.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .credits-title {
          font-family: 'Anton', sans-serif;
          font-size: 56px;
          letter-spacing: 4px;
          color: #ff2a2a;
          margin-bottom: 32px;
          text-align: center;
          text-transform: uppercase;
        }

        .credits-section {
          margin-bottom: 28px;
        }

        .credits-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          letter-spacing: 3px;
          color: #3ce2ff;
          margin-bottom: 8px;
          text-transform: uppercase;
        }

        .credits-text {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 24px;
          letter-spacing: 2px;
          color: #ffffff;
          line-height: 1.4;
        }

        .credits-github-btn {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          margin-top: 16px;
          padding: 14px 28px;
          background: #333;
          clip-path: polygon(0 0, 100% 0, calc(100% - 12px) 100%, 0 100%);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          letter-spacing: 2px;
          color: #ffffff;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
          border: none;
          pointer-events: all;
          box-shadow: 0 0 0 2px transparent;
        }

        .credits-github-btn:hover {
          background: #444;
          transform: translateX(4px);
        }

        .credits-github-btn.active {
          background: #c4001a;
          box-shadow: 0 0 0 2px #ff2a2a, 0 4px 20px rgba(196, 0, 26, 0.5);
        }

        .credits-github-btn.active:hover {
          background: #ff2a2a;
        }

        .credits-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, rgba(60, 226, 255, 0.5) 50%, transparent 100%);
          margin: 24px 0;
        }

        .credits-footer {
          position: fixed;
          bottom: 24px;
          right: 28px;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 5px;
          font-family: 'Bebas Neue', sans-serif;
          z-index: 20;
          opacity: 0;
          transition: opacity 0.4s ease 0.6s;
        }

        .credits-footer.mounted {
          opacity: 1;
        }

        .credits-footer-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          letter-spacing: 2px;
          color: rgba(255, 255, 255, 0.28);
        }

        .credits-footer-key {
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 3px;
          padding: 1px 6px;
          font-size: 11px;
        }

        .github-icon {
          width: 20px;
          height: 20px;
          fill: currentColor;
        }
      `}</style>

      <div className="credits-overlay">
        <div className={`credits-container ${mounted ? 'mounted' : ''}`}>
          <div className="credits-title">CREDITS</div>

          <div className="credits-section">
            <div className="credits-label">Original Creator</div>
            <div className="credits-text">
              This website fan made was created by
              <br />
              <span style={{ color: '#ff2a2a', fontSize: '28px' }}>blairxu13</span>
            </div>
            <button 
              className={`credits-github-btn ${activeBtn === 0 ? 'active' : ''}`}
              onClick={() => handleGithubClick(0)}
              onMouseEnter={() => activateBtn(0)}
            >
              <svg className="github-icon" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              VIEW GITHUB
            </button>
          </div>

          <div className="credits-divider" />

          <div className="credits-section">
            <div className="credits-label">Modified By</div>
            <div className="credits-text">
              This website was modified by
              <br />
              <span style={{ color: '#3ce2ff', fontSize: '28px' }}>Vloits</span>
            </div>
            <button 
              className={`credits-github-btn ${activeBtn === 1 ? 'active' : ''}`}
              onClick={() => handleGithubClick(1)}
              onMouseEnter={() => activateBtn(1)}
            >
              <svg className="github-icon" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              VIEW GITHUB
            </button>
          </div>
        </div>
      </div>

      <div className={`credits-footer ${mounted ? 'mounted' : ''}`}>
        <div className="credits-footer-row">
          <span className="credits-footer-key">↑↓ / LB·RB</span>
          <span>SELECT GITHUB</span>
        </div>
        <div className="credits-footer-row">
          <span className="credits-footer-key">↵</span>
          <span>OPEN GITHUB</span>
        </div>
        <div className="credits-footer-row">
          <span className="credits-footer-key">ESC / ← / ⌫</span>
          <span>BACK</span>
        </div>
      </div>
    </div>
  );
}
