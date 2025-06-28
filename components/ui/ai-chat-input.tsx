"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { Lightbulb, Mic, Globe, Paperclip, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

const PLACEHOLDERS = [
  "Find the best iPhone 15 Pro Max deals",
  "Compare Samsung Galaxy S24 vs iPhone 15",
  "Show me gaming laptops under ₹80,000",
  "What are the best wireless headphones?",
  "Find Nike running shoes for men",
  "Search for MacBook Pro M3 reviews",
  "Show me smartwatches with health tracking",
  "Find the best budget smartphones",
];

interface AIChatInputProps {
  onSubmit?: (message: string, options?: { think: boolean; deepSearch: boolean }) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const AIChatInput = ({ 
  onSubmit, 
  placeholder, 
  disabled = false, 
  className = "" 
}: AIChatInputProps) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [thinkActive, setThinkActive] = useState(false);
  const [deepSearchActive, setDeepSearchActive] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle placeholder text when input is inactive
  useEffect(() => {
    if (isActive || inputValue || placeholder) return;

    const interval = setInterval(() => {
      setShowPlaceholder(false);
      setTimeout(() => {
        setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
        setShowPlaceholder(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, [isActive, inputValue, placeholder]);

  // Close input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        if (!inputValue) setIsActive(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputValue]);

  const handleActivate = () => {
    if (!disabled) {
      setIsActive(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (inputValue.trim() && onSubmit && !disabled) {
      onSubmit(inputValue.trim(), {
        think: thinkActive,
        deepSearch: deepSearchActive
      });
      setInputValue("");
      setIsActive(false);
      setThinkActive(false);
      setDeepSearchActive(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const containerVariants = {
    collapsed: {
      height: 68,
      boxShadow: "0 2px 8px 0 rgba(0,0,0,0.08), 0 0 0 1px rgba(59, 130, 246, 0.1), 0 0 20px rgba(59, 130, 246, 0.05)",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
    expanded: {
      height: 128,
      boxShadow: "0 8px 32px 0 rgba(0,0,0,0.16), 0 0 0 1px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.15)",
      transition: { type: "spring", stiffness: 120, damping: 18 },
    },
  };

  const placeholderContainerVariants = {
    initial: {},
    animate: { transition: { staggerChildren: 0.025 } },
    exit: { transition: { staggerChildren: 0.015, staggerDirection: -1 } },
  };

  const letterVariants = {
    initial: {
      opacity: 0,
      filter: "blur(12px)",
      y: 10,
    },
    animate: {
      opacity: 1,
      filter: "blur(0px)",
      y: 0,
      transition: {
        opacity: { duration: 0.25 },
        filter: { duration: 0.4 },
        y: { type: "spring", stiffness: 80, damping: 20 },
      },
    },
    exit: {
      opacity: 0,
      filter: "blur(12px)",
      y: -10,
      transition: {
        opacity: { duration: 0.2 },
        filter: { duration: 0.3 },
        y: { type: "spring", stiffness: 80, damping: 20 },
      },
    },
  };

  const currentPlaceholder = placeholder || PLACEHOLDERS[placeholderIndex];

  return (
    <div className={`w-full flex justify-center items-center ${className}`}>
      <motion.div
        ref={wrapperRef}
        className={`w-full max-w-3xl ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-text'}`}
        variants={containerVariants}
        animate={isActive || inputValue ? "expanded" : "collapsed"}
        initial="collapsed"
        style={{ 
          overflow: "hidden", 
          borderRadius: 32, 
          background: "hsl(var(--background))",
          border: "1px solid hsl(var(--border))"
        }}
        onClick={handleActivate}
      >
        <form onSubmit={handleSubmit} className="flex flex-col items-stretch w-full h-full">
          {/* Input Row */}
          <div className="flex items-center gap-2 p-3 rounded-full max-w-3xl w-full">
            <button
              className="p-3 rounded-full hover:bg-muted transition-colors"
              title="Attach file"
              type="button"
              tabIndex={-1}
              disabled={disabled}
            >
              <Paperclip size={20} className="text-muted-foreground" />
            </button>

            {/* Text Input & Placeholder */}
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 border-0 outline-0 rounded-md py-2 text-base bg-transparent w-full font-normal text-foreground"
                style={{ position: "relative", zIndex: 1 }}
                onFocus={handleActivate}
                disabled={disabled}
                placeholder=""
              />
              <div className="absolute left-0 top-0 w-full h-full pointer-events-none flex items-center px-3 py-2">
                <AnimatePresence mode="wait">
                  {showPlaceholder && !isActive && !inputValue && (
                    <motion.span
                      key={placeholder ? 'static' : placeholderIndex}
                      className="absolute left-0 top-1/2 -translate-y-1/2 text-muted-foreground select-none pointer-events-none"
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        zIndex: 0,
                      }}
                      variants={placeholderContainerVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      {currentPlaceholder
                        .split("")
                        .map((char, i) => (
                          <motion.span
                            key={i}
                            variants={letterVariants}
                            style={{ display: "inline-block" }}
                          >
                            {char === " " ? "\u00A0" : char}
                          </motion.span>
                        ))}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button
              className="p-3 rounded-full hover:bg-muted transition-colors"
              title="Voice input"
              type="button"
              tabIndex={-1}
              disabled={disabled}
            >
              <Mic size={20} className="text-muted-foreground" />
            </button>
            <button
              className="flex items-center gap-1 bg-primary hover:bg-primary/90 text-primary-foreground p-3 rounded-full font-medium justify-center transition-colors disabled:opacity-50"
              title="Send"
              type="submit"
              disabled={disabled || !inputValue.trim()}
            >
              <Send size={18} />
            </button>
          </div>

          {/* Expanded Controls */}
          <motion.div
            className="w-full flex justify-start px-4 items-center text-sm"
            variants={{
              hidden: {
                opacity: 0,
                y: 20,
                pointerEvents: "none" as const,
                transition: { duration: 0.25 },
              },
              visible: {
                opacity: 1,
                y: 0,
                pointerEvents: "auto" as const,
                transition: { duration: 0.35, delay: 0.08 },
              },
            }}
            initial="hidden"
            animate={isActive || inputValue ? "visible" : "hidden"}
            style={{ marginTop: 8 }}
          >
            <div className="flex gap-3 items-center">
              {/* Think Toggle */}
              <button
                className={`flex items-center gap-1 px-4 py-2 rounded-full transition-all font-medium group ${
                  thinkActive
                    ? "bg-primary/10 outline outline-primary/60 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                title="AI Deep Thinking - Get more detailed analysis"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setThinkActive((a) => !a);
                }}
                disabled={disabled}
              >
                <Lightbulb
                  className={`group-hover:text-yellow-500 transition-all ${thinkActive ? 'text-yellow-500' : ''}`}
                  size={18}
                />
                Think
              </button>

              {/* Deep Search Toggle */}
              <motion.button
                className={`flex items-center px-4 gap-1 py-2 rounded-full transition font-medium whitespace-nowrap overflow-hidden justify-start ${
                  deepSearchActive
                    ? "bg-primary/10 outline outline-primary/60 text-primary"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
                title="Deep Search - Search across multiple sources for comprehensive results"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setDeepSearchActive((a) => !a);
                }}
                disabled={disabled}
                initial={false}
                animate={{
                  width: deepSearchActive ? 125 : 36,
                  paddingLeft: deepSearchActive ? 8 : 9,
                }}
              >
                <div className="flex-1">
                  <Globe size={18} />
                </div>
                <motion.span
                  className="pb-[2px]"
                  initial={false}
                  animate={{
                    opacity: deepSearchActive ? 1 : 0,
                  }}
                >
                  Deep Search
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  );
};

export { AIChatInput };
export type { AIChatInputProps };