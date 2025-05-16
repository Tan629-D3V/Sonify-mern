import React from "react";
import { motion } from "framer-motion";

/**
 * LoadingSpinner component - A reusable circular loading animation
 * 
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the spinner (sm, md, lg)
 * @param {string} props.color - Color of the spinner (primary, white, etc.)
 * @param {string} props.text - Optional text to display below the spinner
 * @param {boolean} props.fullScreen - Whether to center the spinner in the full screen
 * @param {string} props.className - Additional CSS classes
 */
const LoadingSpinner = ({ 
  size = "md", 
  color = "primary", 
  text, 
  fullScreen = false,
  className = "" 
}) => {
  // Size mappings
  const sizeMap = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  // Color mappings
  const colorMap = {
    primary: "border-primary",
    white: "border-white",
    gray: "border-gray-300"
  };

  // Container classes based on fullScreen prop
  const containerClasses = fullScreen 
    ? "flex flex-col items-center justify-center min-h-screen" 
    : "flex flex-col items-center justify-center";

  return (
    <div className={`${containerClasses} ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
        className={`${sizeMap[size]} rounded-full border-t-2 border-b-2 ${colorMap[color]}`}
      />
      {text && (
        <p className="mt-3 text-text-primary text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
