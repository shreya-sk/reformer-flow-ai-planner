
import { useEffect, useState, useRef, useCallback } from 'react';

// Lazy loading hook for images
export const useLazyLoading = () => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  const observeImage = useCallback((element: HTMLImageElement, src: string) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              const actualSrc = img.dataset.src;
              if (actualSrc) {
                img.src = actualSrc;
                setLoadedImages(prev => new Set(prev).add(actualSrc));
                observerRef.current?.unobserve(img);
              }
            }
          });
        },
        { rootMargin: '50px' }
      );
    }

    element.dataset.src = src;
    observerRef.current.observe(element);
  }, []);

  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  return { observeImage, loadedImages };
};

// Virtual scrolling hook for large lists
export const useVirtualScrolling = (items: any[], itemHeight: number, containerHeight: number) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const visibleStart = Math.max(0, Math.floor(scrollTop / itemHeight) - 2);
  const visibleEnd = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + 2);
  const visibleItems = items.slice(visibleStart, visibleEnd);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleStart * itemHeight;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    visibleStart,
  };
};

// Performance monitoring hook
export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    fps: 0,
    memoryUsage: 0,
    loadTime: 0,
  });

  useEffect(() => {
    // FPS monitoring
    let frames = 0;
    let lastTime = performance.now();
    
    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      if (currentTime >= lastTime + 1000) {
        const fps = Math.round((frames * 1000) / (currentTime - lastTime));
        setMetrics(prev => ({ ...prev, fps }));
        frames = 0;
        lastTime = currentTime;
      }
      requestAnimationFrame(measureFPS);
    };

    measureFPS();

    // Memory usage monitoring (if available)
    if ('memory' in performance) {
      const checkMemory = () => {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: Math.round(memory.usedJSHeapSize / 1024 / 1024),
        }));
      };
      
      const interval = setInterval(checkMemory, 5000);
      return () => clearInterval(interval);
    }
  }, []);

  return metrics;
};
