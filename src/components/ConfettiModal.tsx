import Confetti from "react-dom-confetti";
import React, { useEffect, useState } from "react";

interface ConfettiModalProps {
  active: boolean;
  onClose: () => void;
}

const ConfettiModal: React.FC<ConfettiModalProps> = ({ active, onClose }) => {
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    if (active) {
      setConfettiActive(false);
      setTimeout(() => setConfettiActive(true), 0);
    } else {
      setConfettiActive(false);
    }
  }, [active]);

  if (!active) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ pointerEvents: "auto" }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Confetti burst (centered, above overlay, below modal) */}
      <div
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 52,
        }}
      >
        <Confetti active={confettiActive} />
      </div>
      {/* Modal */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "auto",
          zIndex: 53,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div className="relative mt-6 px-8 py-6 rounded-3xl bg-white/90 shadow-2xl text-neutral-800 text-xl font-semibold border border-neutral-200 animate-fade-in flex flex-col items-center min-w-[320px]">
          {/* X button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-700 transition-colors text-xl font-bold shadow-sm cursor-pointer"
            aria-label="Close"
          >
            &times;
          </button>
          {/* Party hat icon */}
          <div className="text-5xl mb-2">🥳</div>
          Submitted Successfully!
          <br />
          <span className="text-base font-normal text-neutral-500">
            Please check console log
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConfettiModal;
