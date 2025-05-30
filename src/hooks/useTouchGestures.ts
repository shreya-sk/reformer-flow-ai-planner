
import { useEffect, useRef, useState } from 'react';

interface TouchGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPullToRefresh?: () => void;
  minSwipeDistance?: number;
  pullToRefreshThreshold?: number;
}

export const useTouchGestures = (options: TouchGestureOptions) => {
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPullToRefresh,
    minSwipeDistance = 50,
    pullToRefreshThreshold = 60
  } = options;

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    setIsPulling(false);
    setPullDistance(0);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!touchStartRef.current) return;
    
    const touch = e.touches[0];
    const deltaY = touch.clientY - touchStartRef.current.y;
    
    // Check for pull to refresh (only at top of page)
    if (window.scrollY === 0 && deltaY > 0 && onPullToRefresh) {
      e.preventDefault();
      setIsPulling(true);
      setPullDistance(Math.min(deltaY, pullToRefreshThreshold * 1.5));
    }
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - touchStartRef.current.x;
    const deltaY = touch.clientY - touchStartRef.current.y;

    // Handle pull to refresh
    if (isPulling && pullDistance >= pullToRefreshThreshold && onPullToRefresh) {
      onPullToRefresh();
    }

    // Handle swipe gestures
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (Math.max(absX, absY) > minSwipeDistance) {
      if (absX > absY) {
        // Horizontal swipe
        if (deltaX > 0 && onSwipeRight) {
          onSwipeRight();
        } else if (deltaX < 0 && onSwipeLeft) {
          onSwipeLeft();
        }
      } else {
        // Vertical swipe
        if (deltaY > 0 && onSwipeDown) {
          onSwipeDown();
        } else if (deltaY < 0 && onSwipeUp) {
          onSwipeUp();
        }
      }
    }

    touchStartRef.current = null;
    setIsPulling(false);
    setPullDistance(0);
  };

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [options]);

  return { isPulling, pullDistance };
};
