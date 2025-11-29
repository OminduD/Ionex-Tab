// Deep Space Animated Background Component
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

export const DeepSpaceBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Star configuration
    const stars: Array<{
      x: number;
      y: number;
      z: number;
      o: number; // opacity
    }> = [];

    const numStars = 800;
    const focalLength = canvas.width * 2;
    const warpSpeed = 0.5; // Calm speed

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width - centerX,
        y: Math.random() * canvas.height - centerY,
        z: Math.random() * canvas.width,
        o: Math.random(),
      });
    }

    let animationFrame: number;

    const animate = () => {
      // Clear canvas with a trail effect for smoothness
      ctx.fillStyle = 'rgba(0, 5, 16, 0.2)'; // Dark blue-black with low opacity for trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Move and draw stars
      stars.forEach((star) => {
        // Move star towards viewer
        star.z -= warpSpeed;

        // Reset star if it passes viewer
        if (star.z <= 0) {
          star.z = canvas.width;
          star.x = Math.random() * canvas.width - centerX;
          star.y = Math.random() * canvas.height - centerY;
        }

        // Project 3D coordinates to 2D
        const scale = focalLength / star.z;
        const x2d = centerX + star.x * scale;
        const y2d = centerY + star.y * scale;

        // Size depends on closeness
        const size = (1 - star.z / canvas.width) * 2.5;
        const opacity = (1 - star.z / canvas.width);

        if (x2d >= 0 && x2d <= canvas.width && y2d >= 0 && y2d <= canvas.height) {
          ctx.beginPath();
          ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`;
          ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <>
      {/* Deep gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#000205] via-[#00091B] to-[#011026]" />

      {/* Canvas for 3D starfield */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full mix-blend-screen"
      />

      {/* Nebula overlays for depth and calmness */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(60, 20, 120, 0.1) 0%, transparent 60%)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 80% 20%, rgba(20, 80, 150, 0.08) 0%, transparent 50%)',
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(transparent_0%,#000000_90%)] pointer-events-none" />
    </>
  );
};
