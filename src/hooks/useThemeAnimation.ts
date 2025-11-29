import { Variants } from 'framer-motion';

export const useThemeAnimation = (theme: string) => {
    const getAnimationVariants = (): Variants => {
        switch (theme) {
            case 'aurora':
                return {
                    initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
                    animate: {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        transition: { duration: 0.8, ease: 'easeOut' }
                    },
                    hover: {
                        scale: 1.02,
                        filter: 'brightness(1.1)',
                        transition: { duration: 0.3 }
                    }
                };
            case 'neon':
                return {
                    initial: { opacity: 0, scale: 0.9, filter: 'brightness(0)' },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        filter: 'brightness(1)',
                        transition: { type: 'spring', stiffness: 200, damping: 20 }
                    },
                    hover: {
                        scale: 1.05,
                        boxShadow: '0 0 20px rgba(var(--primary-color-rgb), 0.5)',
                        transition: { duration: 0.1 }
                    }
                };
            case 'ocean':
                return {
                    initial: { opacity: 0, y: 30 },
                    animate: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 1, ease: 'easeInOut' }
                    },
                    hover: {
                        y: -5,
                        transition: { duration: 0.4, ease: 'easeInOut' }
                    }
                };
            case 'forest':
                return {
                    initial: { opacity: 0, x: -20 },
                    animate: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.7, ease: 'easeOut' }
                    },
                    hover: {
                        rotate: 1,
                        scale: 1.02,
                        transition: { duration: 0.3 }
                    }
                };
            case 'midnight':
                return {
                    initial: { opacity: 0, scale: 0.95 },
                    animate: {
                        opacity: 1,
                        scale: 1,
                        transition: { duration: 1.2, ease: 'easeOut' }
                    },
                    hover: {
                        boxShadow: '0 0 30px rgba(255,255,255,0.1)',
                        transition: { duration: 0.5 }
                    }
                };
            case 'sunset':
                return {
                    initial: { opacity: 0, y: 10 },
                    animate: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.8, ease: 'easeOut' }
                    },
                    hover: {
                        scale: 1.03,
                        filter: 'sepia(0.2)',
                        transition: { duration: 0.3 }
                    }
                };
            default:
                return {
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 },
                    hover: { scale: 1.02 }
                };
        }
    };

    const getContainerStyle = () => {
        switch (theme) {
            case 'neon':
                return 'border border-primary/50 shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.3)]';
            case 'aurora':
                return 'backdrop-blur-xl bg-white/5 border border-white/10';
            case 'midnight':
                return 'bg-black/40 backdrop-blur-md border border-white/5';
            case 'ocean':
                return 'bg-blue-900/20 backdrop-blur-md border border-white/10';
            default:
                return 'backdrop-blur-md bg-white/10 border border-white/10';
        }
    };

    return {
        variants: getAnimationVariants(),
        containerStyle: getContainerStyle()
    };
};
