'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, X, Maximize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";

interface MermaidProps {
  chart: string;
  className?: string;
}

export function MermaidDiagram({ chart, className = '' }: MermaidProps) {
  const mermaidRef = useRef<HTMLDivElement>(null);
  const fullscreenRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [fullscreenScale, setFullscreenScale] = useState(1);
  const [isPanning, setIsPanning] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [fullscreenPosition, setFullscreenPosition] = useState({ x: 0, y: 0 });
  const [startPanPosition, setStartPanPosition] = useState({ x: 0, y: 0 });
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('light');
  
  useEffect(() => {
    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setThemeMode(isDarkMode ? 'dark' : 'light');
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setThemeMode(e.matches ? 'dark' : 'light');
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  useEffect(() => {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'neutral',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });
    
    renderChart(mermaidRef.current);
    if (isFullScreen) {
      renderChart(fullscreenRef.current);
    }
  }, [chart, themeMode, isFullScreen]);
  
  const renderChart = async (container: HTMLDivElement | null) => {
    if (!container) return;
    
    container.innerHTML = '';
    try {
      const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
      const { svg } = await mermaid.render(id, chart);
      container.innerHTML = svg;
      
      const svgElement = container.querySelector('svg');
      if (svgElement) {
        svgElement.style.transformOrigin = 'center';
        
        if (container === mermaidRef.current) {
          updateTransform(svgElement, scale, position);
        } else if (container === fullscreenRef.current) {
          updateTransform(svgElement, fullscreenScale, fullscreenPosition);
        }
      }
    } catch (error) {
      console.error('Error rendering Mermaid chart:', error);
      container.innerHTML = `<div class="p-4 border border-red-500 bg-red-50 text-red-600 rounded">
        Error rendering diagram: ${(error as Error).message}
      </div>`;
    }
  };
  
  const updateTransform = (svgElement: SVGElement | null, scaleValue: number, positionValue: {x: number, y: number}) => {
    if (!svgElement) return;
    svgElement.style.transform = `scale(${scaleValue}) translate(${positionValue.x}px, ${positionValue.y}px)`;
  };
  
  const zoomIn = () => setScale(prev => Math.min(prev + 0.1, 3));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.1, 0.5));
  const zoomInFullscreen = () => setFullscreenScale(prev => Math.min(prev + 0.1, 3));
  const zoomOutFullscreen = () => setFullscreenScale(prev => Math.max(prev - 0.1, 0.5));
  
  const handleWheel = (e: React.WheelEvent, isFullscreenView: boolean) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const zoomFactor = 0.1;
      const delta = e.deltaY > 0 ? -zoomFactor : zoomFactor;
      
      if (isFullscreenView) {
        setFullscreenScale(prev => Math.min(Math.max(prev + delta, 0.5), 3));
      } else {
        setScale(prev => Math.min(Math.max(prev + delta, 0.5), 3));
      }
    }
  };
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    
    setIsPanning(true);
    setStartPanPosition({ 
      x: e.clientX - position.x, 
      y: e.clientY - position.y 
    });
    
    const container = e.currentTarget as HTMLElement;
    container.style.cursor = 'grabbing';
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isPanning) return;
    
    const newX = e.clientX - startPanPosition.x;
    const newY = e.clientY - startPanPosition.y;
    setPosition({ x: newX, y: newY });
  };
  
  const handleMouseDownFullscreen = (e: React.MouseEvent) => {
    if (fullscreenScale <= 1) return;
    
    setIsPanning(true);
    setStartPanPosition({ 
      x: e.clientX - fullscreenPosition.x, 
      y: e.clientY - fullscreenPosition.y 
    });
    
    const container = e.currentTarget as HTMLElement;
    container.style.cursor = 'grabbing';
  };
  
  const handleMouseMoveFullscreen = (e: React.MouseEvent) => {
    if (!isPanning) return;
    
    const newX = e.clientX - startPanPosition.x;
    const newY = e.clientY - startPanPosition.y;
    setFullscreenPosition({ x: newX, y: newY });
  };
  
  const handleMouseUp = (e: React.MouseEvent) => {
    if (!isPanning) return;
    
    setIsPanning(false);
    const container = e.currentTarget as HTMLElement;
    container.style.cursor = scale > 1 || fullscreenScale > 1 ? 'grab' : 'default';
  };
  
  const handleDialogChange = (open: boolean) => {
    setIsFullScreen(open);
    if (open) {
      setFullscreenScale(1);
      setFullscreenPosition({ x: 0, y: 0 });
      
      setTimeout(() => {
        renderChart(fullscreenRef.current);
      }, 100);
    }
  };
  
  useEffect(() => {
    const svgElement = mermaidRef.current?.querySelector('svg') as SVGElement | null;
    updateTransform(svgElement, scale, position);
  }, [scale, position]);
  
  useEffect(() => {
    if (isFullScreen) {
      const svgElement = fullscreenRef.current?.querySelector('svg') as SVGElement | null;
      updateTransform(svgElement, fullscreenScale, fullscreenPosition);
    }
  }, [fullscreenScale, fullscreenPosition, isFullScreen]);
  
  useEffect(() => {
    const preventDefault = (e: WheelEvent) => {
      if (e.ctrlKey) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('wheel', preventDefault, { passive: false });
    
    return () => {
      document.removeEventListener('wheel', preventDefault);
    };
  }, []);
  
  return (
    <div className={`my-6 rounded border bg-muted/50 ${className}`}>
      <div className="flex justify-end gap-1 p-1 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={zoomOut}
          title="Zoom out"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8" 
          onClick={zoomIn}
          title="Zoom in"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Dialog onOpenChange={handleDialogChange}>
          <DialogTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              title="Full screen"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[100vw] h-[100vh] sm:max-w-[100%] p-0 m-0 rounded-none border-0 overflow-hidden">
            <div className="flex justify-between items-center h-10 px-3 border-b bg-background shadow-sm z-10">
              <DialogTitle className="text-sm font-medium">Diagram</DialogTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={zoomOutFullscreen}
                  title="Zoom out"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={zoomInFullscreen}
                  title="Zoom in"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <DialogClose asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7"
                    title="Close fullscreen"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </div>
            <div 
              className="w-full h-[calc(100vh-2.5rem)] overflow-hidden bg-muted/50"
              onMouseDown={handleMouseDownFullscreen}
              onMouseMove={handleMouseMoveFullscreen}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={(e) => handleWheel(e, true)}
              style={{ cursor: fullscreenScale > 1 ? 'grab' : 'default' }}
            >
              <div ref={fullscreenRef} className="w-full h-full flex items-center justify-center" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div 
        className="overflow-auto p-4"
        ref={mermaidRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={(e) => handleWheel(e, false)}
        style={{ cursor: scale > 1 ? 'grab' : 'default' }}
      />
    </div>
  );
} 