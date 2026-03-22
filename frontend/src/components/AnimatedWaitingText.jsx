import React, { useState, useEffect } from 'react';

const AnimatedWaitingText = ({ className = "", as: Component = "h1" }) => {
  const texts = [
    "Looking for a partner...",
    "Finding someone for you...",
    "Almost there...",
    "Connecting you...",
    "Just a moment..."
  ];

  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      // Wait for fade out, then change text and fade in
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length);
        setFade(true);
      }, 300); // 300ms matches Tailwind duration-300
    }, 1500); // Change text every 1.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <Component 
      className={`${className} transition-opacity duration-300 ${fade ? 'opacity-100' : 'opacity-0'}`}
    >
      {texts[index]}
    </Component>
  );
};

export default AnimatedWaitingText;
