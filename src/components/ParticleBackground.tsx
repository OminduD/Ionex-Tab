import React, { useEffect, useRef, memo } from 'react';

interface ParticleBackgroundProps {
    theme: string;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = memo(({ theme }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const isVisibleRef = useRef(true);
    const animationFrameRef = useRef<number>(0);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return;

        let particles: Particle[] = [];
        let width = window.innerWidth;
        let height = window.innerHeight;
        
        // Pause animation when tab is not visible to save CPU/RAM
        const handleVisibilityChange = () => {
            isVisibleRef.current = !document.hidden;
            if (isVisibleRef.current && animationFrameRef.current === 0) {
                animate();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Theme colors
        const getColors = () => {
            switch (theme) {
                case 'cyberpunk': return ['#00f3ff', '#ff00ff', '#bd00ff'];
                case 'neon': return ['#ff0099', '#493240', '#00f3ff'];
                case 'nature': return ['#10b981', '#34d399', '#6ee7b7'];
                case 'forest': return ['#22c55e', '#166534', '#86efac'];
                case 'ocean': return ['#06b6d4', '#3b82f6', '#60a5fa'];
                case 'aurora': return ['#6366f1', '#8b5cf6', '#d8b4fe'];
                case 'sunset': return ['#f97316', '#fbbf24', '#f43f5e'];
                case 'cherry': return ['#f43f5e', '#fb7185', '#fda4af'];
                case 'midnight': return ['#8b5cf6', '#4c1d95', '#c4b5fd'];
                default: return ['#ffffff', '#a5f3fc', '#67e8f9'];
            }
        };

        const colors = getColors();

        class Particle {
            x: number;
            y: number;
            size: number;
            speedX: number;
            speedY: number;
            color: string;
            alpha: number;

            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = Math.random() * 0.5 - 0.25;
                this.speedY = Math.random() * 0.5 - 0.25;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.alpha = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > width) this.x = 0;
                if (this.x < 0) this.x = width;
                if (this.y > height) this.y = 0;
                if (this.y < 0) this.y = height;
            }

            draw() {
                if (!ctx) return;
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            // Further reduced particle count for lower RAM usage (35 max instead of 50)
            const particleCount = Math.min(35, Math.floor((width * height) / 35000));
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        let frameCount = 0;
        const animate = () => {
            // Skip animation when tab is hidden
            if (!isVisibleRef.current) {
                animationFrameRef.current = 0;
                return;
            }
            
            frameCount++;
            
            // Skip every 3rd frame for better performance (from every 2nd)
            if (frameCount % 3 === 0) {
                ctx.clearRect(0, 0, width, height);
            }

            // Connect particles - reduced subset for performance (10 instead of 15)
            const maxConnections = Math.min(particles.length, 10);
            for (let a = 0; a < maxConnections; a++) {
                for (let b = a + 1; b < particles.length; b++) {
                    const dx = particles[a].x - particles[b].x;
                    const dy = particles[a].y - particles[b].y;
                    // Use squared distance to avoid expensive sqrt calculation
                    const distanceSq = dx * dx + dy * dy;
                    const maxDistSq = 5625; // 75^2 (reduced from 80)

                    if (distanceSq < maxDistSq) {
                        const distance = Math.sqrt(distanceSq);
                        ctx.beginPath();
                        ctx.strokeStyle = particles[a].color;
                        ctx.globalAlpha = (75 - distance) / 1200;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        // Throttle resize handler
        let resizeTimeout: ReturnType<typeof setTimeout>;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                width = window.innerWidth;
                height = window.innerHeight;
                canvas.width = width;
                canvas.height = height;
                init();
            }, 150);
        };

        handleResize();
        animate();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            cancelAnimationFrame(animationFrameRef.current);
            clearTimeout(resizeTimeout);
        };
    }, [theme]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 pointer-events-none z-0"
            style={{ opacity: 0.6 }} // Subtle overlay
        />
    );
});

export default ParticleBackground;