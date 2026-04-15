import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

const IntroSequence = ({ onComplete }) => {
  const [textVisible, setTextVisible] = useState(false);

  // Note: Browsers block autoplay without interaction.
  // Try to play audio and quietly ignore autoplay failures.
  const audioRef = useRef(null);

  useEffect(() => {
    // 1. Play sound at low volume
    if(audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {
        // Expected in non-interactive environments.
      });
    }

    // 2. Text Fade In
    setTimeout(() => setTextVisible(true), 500);

    // 3. Complete Sequence
    setTimeout(() => {
        onComplete();
    }, 4000); // 4 seconds total ritual
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50 overflow-hidden">
      {/* Audio element (file may be unavailable in some development setups). */}
      <audio ref={audioRef} src="/assets/sounds/wing_whisper.mp3" />

      {/* Light Effect (The "Wing" visual) */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.5, 30], opacity: [0, 0.5, 0] }}
        transition={{ duration: 3.5, ease: "easeInOut" }}
        className="absolute w-4 h-4 bg-cyan-400 rounded-full blur-2xl"
        style={{ boxShadow: "0 0 100px 50px rgba(34,211,238,0.3)" }}
      />

      {/* Brand Text */}
      <motion.h1
        initial={{ opacity: 0, letterSpacing: "0.5em" }}
        animate={{ opacity: textVisible ? 1 : 0, letterSpacing: "0.2em" }}
        transition={{ duration: 2 }}
        className="text-white text-4xl md:text-6xl font-light tracking-[0.2em] z-10 font-sans"
        style={{
          textShadow: "0 0 30px rgba(255,255,255,0.5)",
          fontFamily: "'Rajdhani', sans-serif"
        }}
      >
        INSPIRAFIRMA
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: textVisible ? 0.7 : 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="text-cyan-200/50 mt-4 text-sm tracking-widest uppercase z-10"
      >
        System Initializing...
      </motion.p>
    </div>
  );
};

export default IntroSequence;
