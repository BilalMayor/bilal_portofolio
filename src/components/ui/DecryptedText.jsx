import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";

/**
 * DecryptedText — ReactBits-inspired character decoding animation
 * Scrambles and decrypts text on hover or initial view
 */
export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = true,
  revealDirection = "start",
  useOriginalCharsOnly = false,
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?",
  className = "",
  parentClassName = "",
  encryptedClassName = "",
  animateOn = "hover",
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isHovering, setIsHovering] = useState(false);
  const [isScrambling, setIsScrambling] = useState(false);
  const revealedIndices = useRef(new Set());
  const intervalRef = useRef(null);

  useEffect(() => {
    let currentIteration = 0;

    const getNextChar = (originalChar, isRevealed) => {
      if (isRevealed || originalChar === " ") return originalChar;
      if (useOriginalCharsOnly) {
        const chars = text.split("").filter((c) => c !== " ");
        return chars[Math.floor(Math.random() * chars.length)] || originalChar;
      }
      return characters[Math.floor(Math.random() * characters.length)];
    };

    const getNextIndex = (revealedSet) => {
      const textLen = text.length;
      switch (revealDirection) {
        case "start":
          return revealedSet.size;
        case "end":
          return textLen - 1 - revealedSet.size;
        case "center": {
          const middle = Math.floor(textLen / 2);
          const offset = Math.floor(revealedSet.size / 2);
          const nextIndex =
            revealedSet.size % 2 === 0 ? middle + offset : middle - offset;
          if (nextIndex >= 0 && nextIndex < textLen && !revealedSet.has(nextIndex)) {
            return nextIndex;
          }
          for (let i = 0; i < textLen; i++) {
            if (!revealedSet.has(i)) return i;
          }
          return 0;
        }
        default:
          return revealedSet.size;
      }
    };

    const runScramble = () => {
      setIsScrambling(true);
      intervalRef.current = setInterval(() => {
        setDisplayText((prevText) => {
          if (sequential) {
            if (revealedIndices.current.size < text.length) {
              const nextIndex = getNextIndex(revealedIndices.current);
              revealedIndices.current.add(nextIndex);
            } else {
              clearInterval(intervalRef.current);
              setIsScrambling(false);
              return text;
            }
          } else {
            currentIteration++;
            if (currentIteration >= maxIterations) {
              clearInterval(intervalRef.current);
              setIsScrambling(false);
              return text;
            }
          }

          return text
            .split("")
            .map((char, index) => {
              const isRevealed =
                sequential ? revealedIndices.current.has(index) : false;
              return getNextChar(char, isRevealed);
            })
            .join("");
        });
      }, speed);
    };

    if (animateOn === "view") {
      revealedIndices.current.clear();
      runScramble();
    } else if (animateOn === "hover" && isHovering) {
      revealedIndices.current.clear();
      runScramble();
    } else {
      setDisplayText(text);
      revealedIndices.current.clear();
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsScrambling(false);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [
    isHovering,
    text,
    speed,
    maxIterations,
    sequential,
    revealDirection,
    characters,
    useOriginalCharsOnly,
    animateOn,
  ]);

  return (
    <motion.span
      className={`inline-block whitespace-pre-wrap cursor-default ${parentClassName}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      <span className={isScrambling ? encryptedClassName || className : className}>
        {displayText}
      </span>
    </motion.span>
  );
}
