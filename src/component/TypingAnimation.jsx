import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const TypingAnimation = ({ texts, speed = 100 }) => {
  const [currentText, setCurrentText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentStringIndex, setCurrentStringIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const currentString = texts[currentStringIndex];
      
      if (!isDeleting) {
        setCurrentText(currentString.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
        
        if (currentIndex === currentString.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setCurrentText(currentString.substring(0, currentIndex - 1));
        setCurrentIndex(currentIndex - 1);
        
        if (currentIndex === 0) {
          setIsDeleting(false);
          setCurrentStringIndex((currentStringIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? speed / 2 : speed);

    return () => clearTimeout(timeout);
  }, [currentIndex, isDeleting, currentStringIndex, texts, speed]);

  return (
    <span className="inline-block">
      {currentText}
      <motion.span
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="inline-block w-0.5 h-6 bg-blue-400 ml-1"
      />
    </span>
  );
};

export default TypingAnimation;
