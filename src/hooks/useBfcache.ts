import { useEffect } from 'react';

/**
 * Hook to optimize for bfcache (back/forward cache)
 * Handles page restoration and cleanup to ensure bfcache eligibility
 */
export const useBfcache = () => {
    useEffect(() => {
        // Handle page show event (fired when page is restored from bfcache)
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                // Page was restored from bfcache
                console.log('✅ Page restored from bfcache');

                // Refresh any stale data
                window.dispatchEvent(new Event('bfcache-restore'));
            }
        };

        // Handle page hide event (fired when page might be cached)
        const handlePageHide = (event: PageTransitionEvent) => {
            if (event.persisted) {
                // Page is being cached
                console.log('💾 Page cached for bfcache');
            }
        };

        // Handle visibility change (pause/resume activities)
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Page is hidden, pause non-essential activities
                console.log('⏸️ Page hidden - pausing activities');
            } else {
                // Page is visible again
                console.log('▶️ Page visible - resuming activities');
            }
        };

        // Add event listeners
        window.addEventListener('pageshow', handlePageShow);
        window.addEventListener('pagehide', handlePageHide);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            window.removeEventListener('pageshow', handlePageShow);
            window.removeEventListener('pagehide', handlePageHide);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);
};

/**
 * Check if page was restored from bfcache
 */
export const wasRestoredFromBfcache = (): boolean => {
    return (
        window.performance &&
        window.performance.getEntriesByType &&
        window.performance.getEntriesByType('navigation').length > 0 &&
        (window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming).type === 'back_forward'
    );
};

/**
 * Monitor bfcache eligibility
 */
export const monitorBfcacheEligibility = () => {
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.entryType === 'navigation') {
                    const navEntry = entry as PerformanceNavigationTiming;
                    console.log('Navigation type:', navEntry.type);

                    if (navEntry.type === 'back_forward') {
                        console.log('✅ bfcache hit!');
                    } else {
                        console.log('❌ bfcache miss - full navigation');
                    }
                }
            }
        });

        observer.observe({ entryTypes: ['navigation'] });
    }
};
