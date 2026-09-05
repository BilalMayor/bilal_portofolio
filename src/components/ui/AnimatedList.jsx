import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "motion/react";

const AnimatedItem = ({ children, index, staggerDelay = 0.1, onMouseEnter, onClick, isSelected }) => {
  return (
    <motion.div
      data-index={index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.82, y: 32, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ amount: 0.15, once: true }}
      transition={{
        duration: 0.65,
        delay: (index % 5) * staggerDelay,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ scale: 1.015, y: -3, transition: { duration: 0.25, ease: "easeOut" } }}
      className="mb-4 cursor-pointer"
    >
      {children}
    </motion.div>
  );
};

const AnimatedList = ({
  items = [],
  renderItem,
  onItemSelect,
  showGradients = true,
  enableArrowNavigation = true,
  className = "",
  itemClassName = "",
  displayScrollbar = true,
  initialSelectedIndex = -1,
  maxHeight = "460px",
  staggerDelay = 0.12,
}) => {
  const listRef = useRef(null);
  const [selectedIndex, setSelectedIndex] = useState(initialSelectedIndex);
  const [keyboardNav, setKeyboardNav] = useState(false);
  const [topGradientOpacity, setTopGradientOpacity] = useState(0);
  const [bottomGradientOpacity, setBottomGradientOpacity] = useState(1);

  const handleItemMouseEnter = useCallback((index) => {
    setSelectedIndex(index);
  }, []);

  const handleItemClick = useCallback(
    (item, index) => {
      setSelectedIndex(index);
      if (onItemSelect) {
        onItemSelect(item, index);
      }
    },
    [onItemSelect]
  );

  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    setTopGradientOpacity(Math.min(scrollTop / 40, 1));
    const bottomDistance = scrollHeight - (scrollTop + clientHeight);
    setBottomGradientOpacity(scrollHeight <= clientHeight ? 0 : Math.min(bottomDistance / 40, 1));
  };

  useEffect(() => {
    if (!enableArrowNavigation) return;
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown" || (e.key === "Tab" && !e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
      } else if (e.key === "ArrowUp" || (e.key === "Tab" && e.shiftKey)) {
        e.preventDefault();
        setKeyboardNav(true);
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0 && selectedIndex < items.length) {
          e.preventDefault();
          if (onItemSelect) {
            onItemSelect(items[selectedIndex], selectedIndex);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [items, selectedIndex, onItemSelect, enableArrowNavigation]);

  useEffect(() => {
    if (!keyboardNav || selectedIndex < 0 || !listRef.current) return;
    const container = listRef.current;
    const selectedItem = container.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedItem) {
      const extraMargin = 40;
      const containerScrollTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const itemTop = selectedItem.offsetTop;
      const itemBottom = itemTop + selectedItem.offsetHeight;

      if (itemTop < containerScrollTop + extraMargin) {
        container.scrollTo({ top: itemTop - extraMargin, behavior: "smooth" });
      } else if (itemBottom > containerScrollTop + containerHeight - extraMargin) {
        container.scrollTo({
          top: itemBottom - containerHeight + extraMargin,
          behavior: "smooth",
        });
      }
    }
    setKeyboardNav(false);
  }, [selectedIndex, keyboardNav]);

  return (
    <div className={`relative w-full ${className}`}>
      <div
        ref={listRef}
        className={`overflow-y-auto pr-1 sm:pr-2 py-1 ${displayScrollbar
            ? "[&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-track]:bg-white/5 [&::-webkit-scrollbar-thumb]:bg-white/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-(--accent)/60"
            : "scrollbar-hide"
          }`}
        onScroll={handleScroll}
        style={{
          maxHeight: maxHeight,
          scrollbarWidth: displayScrollbar ? "thin" : "none",
          scrollbarColor: "rgba(255,255,255,0.2) rgba(255,255,255,0.05)",
        }}
      >
        {items.map((item, index) => (
          <AnimatedItem
            key={item?.title || item?.id || index}
            staggerDelay={staggerDelay}
            index={index}
            containerRef={listRef}
            isSelected={selectedIndex === index}
            onMouseEnter={() => handleItemMouseEnter(index)}
            onClick={() => handleItemClick(item, index)}
          >
            {renderItem ? (
              renderItem(item, index, selectedIndex === index)
            ) : (
              <div
                className={`p-5 rounded-2xl transition-colors duration-200 ${selectedIndex === index
                    ? "bg-white/10 border-white/25 shadow-lg"
                    : "bg-white/5 border-white/10 hover:bg-white/8"
                  } border ${itemClassName}`}
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  boxShadow:
                    selectedIndex === index
                      ? "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)"
                      : "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-zinc-100 font-medium m-0">
                  {typeof item === "string" ? item : JSON.stringify(item)}
                </p>
              </div>
            )}
          </AnimatedItem>
        ))}
      </div>

      {showGradients && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-[40px] bg-gradient-to-b from-zinc-950/90 to-transparent pointer-events-none transition-opacity duration-300 rounded-t-2xl z-10"
            style={{ opacity: topGradientOpacity }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-zinc-950/90 to-transparent pointer-events-none transition-opacity duration-300 rounded-b-2xl z-10"
            style={{ opacity: bottomGradientOpacity }}
          />
        </>
      )}
    </div>
  );
};

export default AnimatedList;
