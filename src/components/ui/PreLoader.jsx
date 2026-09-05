import { useEffect, useState } from "react";
import CountUp from "./CountUp";
import { motion, AnimatePresence } from "motion/react";
import { useLanguage } from "../../context/LanguageContext";

const Preloader = ({ onFinish }) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState("count1");
  // count1 | count2 | done | exit

  const welcomeText = language === "en" ? "Welcome!" : "Selamat Datang!";

  // DONE → EXIT
  useEffect(() => {
    if (step === "done") {
      const timer = setTimeout(() => {
        setStep("exit");
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // EXIT → APP
  useEffect(() => {
    if (step === "exit") {
      const timer = setTimeout(() => {
        onFinish();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step, onFinish]);

  const progress = step === "count1" ? 45 : step === "count2" ? 85 : 100;

  return (
    <AnimatePresence>
      {step !== "exit" ? (
        <motion.div
          exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-xl bg-black/70"
        >
          {/* Content */}
          <div className="flex flex-col items-center gap-6">
            {/* Counter / Welcome */}
            <AnimatePresence mode="wait">
              {step === "count1" && (
                <motion.div
                  key="count1"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <CountUp
                    from={0}
                    to={90}
                    duration={0.35}
                    onEnd={() => setStep("count2")}
                    className="text-6xl sm:text-7xl font-bold text-white font-[Space_Grotesk] tabular-nums"
                  />
                </motion.div>
              )}
              {step === "count2" && (
                <motion.div
                  key="count2"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <CountUp
                    from={90}
                    to={100}
                    duration={0.25}
                    onEnd={() => setStep("done")}
                    className="text-6xl sm:text-7xl font-bold text-white font-[Space_Grotesk] tabular-nums"
                  />
                </motion.div>
              )}
              {step === "done" && (
                <motion.span
                  key="done"
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl sm:text-5xl font-bold text-white font-[Space_Grotesk]"
                >
                  {welcomeText}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Progress bar */}
            <div className="w-48 sm:w-56 h-1 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: "var(--accent)" }}
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default Preloader;
