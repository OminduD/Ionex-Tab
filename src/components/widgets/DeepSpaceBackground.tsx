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

    // Star and nebula configuration
    const stars: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      twinkle: number;
    }> = [];

    // Create stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.05 + 0.01,
        opacity: Math.random(),
        twinkle: Math.random() * 0.02 + 0.005
      });
    }

    // Nebula clouds
    const nebulaClouds = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, size: 400, color: 'rgba(138, 43, 226, 0.15)' },
      { x: canvas.width * 0.7, y: canvas.height * 0.5, size: 500, color: 'rgba(75, 0, 130, 0.12)' },
      { x: canvas.width * 0.5, y: canvas.height * 0.7, size: 350, color: 'rgba(138, 43, 226, 0.1)' },
      { x: canvas.width * 0.1, y: canvas.height * 0.8, size: 300, color: 'rgba(72, 61, 139, 0.13)' },
    ];

    let animationFrame: number;

    const animate = () => {
      // Clear canvas with deep space background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#000814');
      gradient.addColorStop(0.5, '#001233');
      gradient.addColorStop(1, '#001845');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula clouds
      nebulaClouds.forEach((cloud) => {
        const nebulaGradient = ctx.createRadialGradient(
          cloud.x, cloud.y, 0,
          cloud.x, cloud.y, cloud.size
        );
        nebulaGradient.addColorStop(0, cloud.color);
        nebulaGradient.addColorStop(0.5, cloud.color.replace(/[\d.]+\)$/, '0.05)'));
        nebulaGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = nebulaGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      });

      // Draw and animate stars
      stars.forEach((star) => {
        // Twinkling effect
        star.opacity += star.twinkle;
        if (star.opacity > 1 || star.opacity < 0.2) {
          star.twinkle = -star.twinkle;
        }

        // Draw star
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
        ctx.fill();
        ctx.shadowBlur = 0;

        // Slow drift
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
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
      {/* Canvas for stars and nebula */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />
      
      {/* Additional CSS gradient overlays for depth */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(138, 43, 226, 0.15) 0%, transparent 50%)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 70% 60%, rgba(75, 0, 130, 0.2) 0%, transparent 50%)',
        }}
        animate={{
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      />

      {/* Shooting stars */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={`shoot-${i}`}
          className="absolute h-0.5 w-24 bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            top: `${20 * i}%`,
            left: '-100px',
            filter: 'blur(1px)',
            opacity: 0.7
          }}
          animate={{
            x: ['0vw', '120vw'],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 4,
            ease: 'easeOut'
          }}
        />
      ))}
    </>
  );
};
