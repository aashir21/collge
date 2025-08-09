import { useRef, useState } from 'react';
import { Dimensions } from 'react-native';

const windowWidth = Dimensions.get('window').width;

interface SwipeOptions {
    onSwipeLeft?: () => void;
    onSwipeRight?: () => void;
    minSwipeDistance?: number;
    minSwipeVelocity?: number;
    lockDirection?: boolean;
}

export function useSwipe({
    onSwipeLeft,
    onSwipeRight,
    minSwipeDistance = 50,
    minSwipeVelocity = 0.3,
    lockDirection = true,
}: SwipeOptions) {
    const startTouch = useRef({ x: 0, time: 0 });
    const [swipeInProgress, setSwipeInProgress] = useState(false);

    function onTouchStart(e: any) {
        startTouch.current = {
            x: e.nativeEvent.pageX,
            time: Date.now(),
        };
    }

    function onTouchEnd(e: any) {
        if (swipeInProgress) return;  // Prevent multiple swipes in quick succession

        const endTouchX = e.nativeEvent.pageX;
        const distanceX = endTouchX - startTouch.current.x;
        const timeTaken = Date.now() - startTouch.current.time;

        const velocityX = Math.abs(distanceX / timeTaken);
        const isFastEnough = velocityX > minSwipeVelocity;
        const isLongEnough = Math.abs(distanceX) > minSwipeDistance;

        if (isFastEnough && isLongEnough) {
            if (distanceX > 0 && onSwipeRight && (!lockDirection || distanceX > 0)) {
                setSwipeInProgress(true);  // Set swipe in progress
                onSwipeRight();
                setTimeout(() => setSwipeInProgress(false), 300);  // Reset after debounce period
            } else if (distanceX < 0 && onSwipeLeft && (!lockDirection || distanceX < 0)) {
                setSwipeInProgress(true);  // Set swipe in progress
                onSwipeLeft();
                setTimeout(() => setSwipeInProgress(false), 300);  // Reset after debounce period
            }
        }
    }

    return { onTouchStart, onTouchEnd };
}
