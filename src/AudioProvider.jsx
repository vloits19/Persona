import React, { createContext, useContext, useEffect, useRef } from "react";
import bgmFile from "./assets/lobby.mp3";
import selectFile from "./assets/sellect.mp3";
import backFile from "./assets/back.mp3";
import odtFile from "./assets/odt.mp3";
import cdtFile from "./assets/cdt.mp3";
import ndtFile from "./assets/ndt.mp3";

const AudioContext = createContext(null);

export function AudioProvider({ children }) {
  const bgmRef = useRef(null);
  const hoverRef = useRef();
  const confirmRef = useRef();
  const cancelRef = useRef();
  const odtRef = useRef();
  const cdtRef = useRef();

  useEffect(() => {
    hoverRef.current = new Audio(ndtFile);
    confirmRef.current = new Audio(selectFile);
    cancelRef.current = new Audio(backFile);
    odtRef.current = new Audio(odtFile);
    cdtRef.current = new Audio(cdtFile);

    // Untuk memastikan BGM loop yang stabil
    if (bgmRef.current) {
      bgmRef.current.volume = 0.35; // Tidak terlalu keras
    }
  }, []);

  // Mulai mainkan BGM setiap kali ada interaksi (browser requirement)
  const ensureBGM = () => {
    if (bgmRef.current && bgmRef.current.paused) {
      bgmRef.current.play().catch(() => {
        // Ignored
      });
    }
  };

  const playHover = () => {
    if (hoverRef.current) {
      hoverRef.current.currentTime = 0;
      hoverRef.current.volume = 0.5;
      hoverRef.current.play().catch(() => {});
      ensureBGM();
    }
  };

  const playConfirm = () => {
    if (confirmRef.current) {
      confirmRef.current.currentTime = 0;
      confirmRef.current.volume = 0.6;
      confirmRef.current.play().catch(() => {});
      ensureBGM();
    }
  };

  const playCancel = () => {
    if (cancelRef.current) {
      cancelRef.current.currentTime = 0;
      cancelRef.current.volume = 0.6;
      cancelRef.current.play().catch(() => {});
      ensureBGM();
    }
  };

  const playOpenDetail = () => {
    if (odtRef.current) {
      odtRef.current.currentTime = 0;
      odtRef.current.volume = 0.6;
      odtRef.current.play().catch(() => {});
      ensureBGM();
    }
  };

  const playCloseDetail = () => {
    if (cdtRef.current) {
      cdtRef.current.currentTime = 0;
      cdtRef.current.volume = 0.6;
      cdtRef.current.play().catch(() => {});
      ensureBGM();
    }
  };

  return (
    <AudioContext.Provider value={{
      playHover, playConfirm, playCancel,
      playOpenDetail, playCloseDetail,
      ensureBGM
    }}>
      <audio ref={bgmRef} src={bgmFile} loop />
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    return {
      playHover: () => {},
      playConfirm: () => {},
      playCancel: () => {},
      playOpenDetail: () => {},
      playCloseDetail: () => {},
      ensureBGM: () => {}
    };
  }
  return context;
}
