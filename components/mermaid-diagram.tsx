'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { ZoomIn, ZoomOut, X, Maximize2, MoveHorizontal } from 'lucide-react';
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
  const [diagramSize, setDiagramSize] = useState({ width: 0, height: 0 });
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [initialScale, setInitialScale] = useState(1);
  
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
  
  const calculateInitialScale = (container: HTMLDivElement, svg: SVGElement) => {
    const containerRect = container.getBoundingClientRect();
    const svgRect = svg.getBoundingClientRect();
    
    const scaleX = (containerRect.width - 40) / svgRect.width;
    const scaleY = (containerRect.height - 40) / svgRect.height;
    
    return Math.min(scaleX, scaleY, 1); // Don't scale up, only down if needed
  };
  
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
        
        // Set initial dimensions for the SVG
        svgElement.style.width = '100%';
        svgElement.style.height = '100%';
        
        // Calculate and set initial scale
        if (container === fullscreenRef.current) {
          const newScale = calculateInitialScale(container, svgElement);
          setFullscreenScale(newScale);
          setInitialScale(newScale);
          updateTransform(svgElement, newScale, fullscreenPosition);
          
          // Update sizes for boundaries
          const svgRect = svgElement.getBoundingClientRect();
          setDiagramSize({
            width: svgRect.width,
            height: svgRect.height
          });
          setContainerSize({
            width: container.clientWidth,
            height: container.clientHeight
          });
        } else {
          updateTransform(svgElement, scale, position);
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
    
    // Calculate boundaries with padding
    const maxX = Math.max((diagramSize.width * fullscreenScale - containerSize.width) / 2 + 100, 100);
    const maxY = Math.max((diagramSize.height * fullscreenScale - containerSize.height) / 2 + 100, 100);
    
    // Apply boundaries with smoother limits
    const boundedX = Math.max(Math.min(newX, maxX), -maxX);
    const boundedY = Math.max(Math.min(newY, maxY), -maxY);
    
    setFullscreenPosition({ x: boundedX, y: boundedY });
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
  
  // Add resize observer
  useEffect(() => {
    if (!fullscreenRef.current) return;
    
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const svg = entry.target.querySelector('svg');
        if (svg) {
          setDiagramSize({
            width: svg.getBoundingClientRect().width,
            height: svg.getBoundingClientRect().height
          });
          setContainerSize({
            width: entry.contentRect.width,
            height: entry.contentRect.height
          });
        }
      }
    });
    
    resizeObserver.observe(fullscreenRef.current);
    return () => resizeObserver.disconnect();
  }, [isFullScreen]);
  
  const centerDiagram = () => {
    setFullscreenPosition({ x: 0, y: 0 });
    setFullscreenScale(initialScale);
  };
  
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
          <DialogContent className="w-[100vw] h-[100vh] sm:max-w-[100%] p-0 m-0 rounded-none border-0">
            <div className="flex justify-between items-center h-10 px-3 border-b bg-background shadow-sm z-10">
              <DialogTitle className="text-sm font-medium">Diagram</DialogTitle>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={centerDiagram}
                  title="Center diagram"
                >
                  <MoveHorizontal className="h-4 w-4" />
                </Button>
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
                    title="Close"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogClose>
              </div>
            </div>
            <div 
              ref={fullscreenRef}
              className="w-full h-[calc(100vh-2.5rem)] overflow-hidden bg-background flex items-center justify-center p-5"
              style={{ 
                cursor: isPanning ? 'grabbing' : 'grab',
                touchAction: 'none'
              }}
              onMouseDown={handleMouseDownFullscreen}
              onMouseMove={handleMouseMoveFullscreen}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={(e) => handleWheel(e, true)}
            />
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