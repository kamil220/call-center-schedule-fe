'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

// External SVG bunny using Next.js Image component
const BunnySVG = ({ wiggle = false }) => (
  <div className={wiggle ? 'wiggle' : ''}>
    <Image 
      src="/rabbit.svg" 
      alt="Easter Bunny" 
      width={80} 
      height={100} 
      priority
    />
  </div>
);

// Easter eggs collection
const EASTER_EGGS = [
  'Happy Easter!',
  'Enjoy your Easter egg hunt!',
  'Have a hoppy Easter!',
  'Spring has sprung!',
  'Easter bunny sends greetings!'
];

// Types for bunny position
type Position = 'top' | 'right' | 'bottom' | 'left';
type BunnyPosition = {
  position: Position;
  x: number;
  y: number;
  rotation: number;
};

export function EasterBunny() {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<BunnyPosition>({ position: 'top', x: 50, y: 0, rotation: 0 });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCaught, setIsCaught] = useState(false);
  const [catchCount, setCatchCount] = useState(0);
  const [easterMessage, setEasterMessage] = useState('');
  const [wiggleBunny, setWiggleBunny] = useState(false);
  
  // Refs for sound effects
  const popSoundRef = useRef<HTMLAudioElement | null>(null);
  const catchSoundRef = useRef<HTMLAudioElement | null>(null);
  
  // Initialize sound effects
  useEffect(() => {
    if (typeof window !== 'undefined') {
      popSoundRef.current = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'+'x'.repeat(100));
      catchSoundRef.current = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'+'x'.repeat(100));
    }
  }, []);

  // Generate random position for the bunny
  const generateRandomPosition = useCallback((): BunnyPosition => {
    const positions: Position[] = ['top', 'right', 'bottom', 'left'];
    const randomPosition = positions[Math.floor(Math.random() * positions.length)];
    
    // Calculate x, y, and rotation based on position
    let x = 50;
    let y = 0;
    let rotation = 0;
    
    switch (randomPosition) {
      case 'top':
        x = Math.random() * 80 + 10; // 10-90% of viewport width
        y = 0;
        rotation = 180; // Upside down when coming from top
        break;
      case 'right':
        x = 100;
        y = Math.random() * 80 + 10; // 10-90% of viewport height
        rotation = 270; // Facing left when coming from right
        break;
      case 'bottom':
        x = Math.random() * 80 + 10; // 10-90% of viewport width
        y = 100;
        rotation = 0; // Right side up when coming from bottom
        break;
      case 'left':
        x = 0;
        y = Math.random() * 80 + 10; // 10-90% of viewport height
        rotation = 90; // Facing right when coming from left
        break;
    }
    
    return { position: randomPosition, x, y, rotation };
  }, []);

  // Handle bunny catch
  const handleCatch = () => {
    // Play catch sound
    if (catchSoundRef.current) {
      catchSoundRef.current.play().catch(e => console.log('Sound play failed:', e));
    }
    
    setIsVisible(false);
    setIsCaught(true);
    setCatchCount(prev => prev + 1);
    
    // Get random Easter message
    const randomMsg = EASTER_EGGS[Math.floor(Math.random() * EASTER_EGGS.length)];
    setEasterMessage(randomMsg);
    
    setIsDialogOpen(true);
  };

  // Make bunny wiggle when close to disappearing
  useEffect(() => {
    if (!isVisible) return;
    
    // Start wiggling after 3 seconds (2 seconds before disappearing)
    const wiggleTimeout = setTimeout(() => {
      setWiggleBunny(true);
    }, 3000);
    
    return () => {
      clearTimeout(wiggleTimeout);
      setWiggleBunny(false);
    };
  }, [isVisible]);

  // Show bunny at random intervals
  useEffect(() => {
    const showBunny = () => {
      // Play pop sound when appearing
      if (popSoundRef.current) {
        popSoundRef.current.play().catch(e => console.log('Sound play failed:', e));
      }
      
      setPosition(generateRandomPosition());
      setIsVisible(true);
      
      // Hide bunny after 5 seconds if not caught
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Initial appearance after a short delay
    const initialTimeout = setTimeout(showBunny, 3000);
    
    // Set interval for reappearance (shorter if never caught)
    const interval = setInterval(showBunny, isCaught ? 30000 : 20000);
    
    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [generateRandomPosition, isCaught]);

  // Get CSS for bunny position
  const getBunnyStyle = () => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      transition: 'all 0.5s ease-in-out',
      cursor: 'pointer',
      zIndex: 1000,
    };

    switch (position.position) {
      case 'top':
        return {
          ...baseStyle,
          top: '-30px', // Show more of the bunny
          left: `${position.x}%`,
          transform: `rotate(${position.rotation}deg)`,
          animation: 'peekFromTop 5s ease-in-out',
        };
      case 'right':
        return {
          ...baseStyle,
          top: `${position.y}%`,
          right: '-40px', // Show more of the bunny
          transform: `rotate(${position.rotation}deg)`,
          animation: 'peekFromRight 5s ease-in-out',
        };
      case 'bottom':
        return {
          ...baseStyle,
          bottom: '-30px', // Show more of the bunny
          left: `${position.x}%`,
          transform: `rotate(${position.rotation}deg)`,
          animation: 'peekFromBottom 5s ease-in-out',
        };
      case 'left':
        return {
          ...baseStyle,
          top: `${position.y}%`,
          left: '-40px', // Show more of the bunny
          transform: `rotate(${position.rotation}deg)`,
          animation: 'peekFromLeft 5s ease-in-out',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <>
      {isVisible && (
        <div
          onClick={handleCatch}
          style={getBunnyStyle()}
          className="easter-bunny"
        >
          <BunnySVG wiggle={wiggleBunny} />
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">{easterMessage}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4 py-4">
            <div className="relative">
              <Image 
                src="/rabbit.svg" 
                alt="Easter Bunny" 
                width={80} 
                height={100} 
                priority
              />
            </div>
            <p className="text-center text-muted-foreground">
              You caught the Easter bunny! {catchCount > 1 ? `(×${catchCount})` : ''}
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)} className="w-full">
              Thank you!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <style jsx global>{`
        @keyframes peekFromTop {
          0% { top: -80px; }
          15% { top: -30px; }
          85% { top: -30px; }
          100% { top: -80px; }
        }
        
        @keyframes peekFromRight {
          0% { right: -80px; }
          15% { right: -40px; }
          85% { right: -40px; }
          100% { right: -80px; }
        }
        
        @keyframes peekFromBottom {
          0% { bottom: -80px; }
          15% { bottom: -30px; }
          85% { bottom: -30px; }
          100% { bottom: -80px; }
        }
        
        @keyframes peekFromLeft {
          0% { left: -80px; }
          15% { left: -40px; }
          85% { left: -40px; }
          100% { left: -80px; }
        }
        
        .wiggle {
          animation: wiggle 0.5s infinite;
        }
        
        @keyframes wiggle {
          0% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          50% { transform: rotate(0deg); }
          75% { transform: rotate(5deg); }
          100% { transform: rotate(0deg); }
        }
      `}</style>
    </>
  );
} 