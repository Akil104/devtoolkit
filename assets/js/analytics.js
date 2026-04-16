/**
 * DevToolkit Global Analytics Tracking System
 * Auto-tracks page views and tool usage events.
 */

const Analytics = (function() {
    const API_URL = 'http://localhost:5000/api/analytics/track';
    
    // State to prevent duplicate page view calls
    let hasTrackedPageView = false;

    /**
     * Determines a clean tool name from the document title or URL
     */
    function getCleanToolName() {
        const titleElements = document.title.split('|');
        if (titleElements.length > 0 && titleElements[0].trim() !== '') {
            return titleElements[0].trim();
        }
        
        // Fallback to URL path if title is not helpful
        const path = window.location.pathname;
        return path === '/' ? 'Home' : path.replace('.html', '').split('/').pop();
    }

    /**
     * Core tracking API wrapper
     */
    async function trackEvent(eventType, additionalData = {}) {
        try {
            const payload = {
                eventType: eventType,
                path: window.location.pathname,
                toolName: getCleanToolName(),
                ...additionalData
            };

            await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            
            // Helpful logging for development verification
            console.debug(`[Analytics Tracked] ${eventType}`, payload);
            
        } catch (error) {
            console.error('[Analytics Error] Failed to track event:', error);
        }
    }

    /**
     * Tracks a page view exactly once per page load
     */
    function trackPage() {
        if (hasTrackedPageView) return;
        
        trackEvent('page_view');
        hasTrackedPageView = true;
    }

    /**
     * Automatically detect user interactions based on button clicks
     */
    function setupAutoEventTracking() {
        // Words typically associated with using a tool
        const actionKeywords = [
            'convert', 'merge', 'format', 'generate', 'minify', 
            'validate', 'encode', 'decode', 'hash', 'encrypt'
        ];
        
        document.addEventListener('click', function(e) {
            let target = e.target;

            // Traverse up the DOM tree to see if the click originated inside a button or link
            while (target && target.tagName !== 'BUTTON' && target.tagName !== 'A' && target.tagName !== 'INPUT') {
                if (target === document.body) return;
                target = target.parentElement;
            }

            if (!target) return;

            // Only track 'submit' or 'button' type inputs
            if (target.tagName === 'INPUT' && !['button', 'submit'].includes(target.type)) {
                return;
            }

            const text = (target.value || target.textContent || '').toLowerCase().trim();
            
            // Check if the interactive element contains any of our action keywords
            if (actionKeywords.some(keyword => text.includes(keyword))) {
                trackEvent('tool_usage', { 
                    action: target.innerText || target.value || target.id || 'unknown_action'
                });
            }
        });
    }

    /**
     * Bootstraps the tracker system
     */
    function init() {
        trackPage();
        setupAutoEventTracking();
        
        // Handle Single Page App (SPA) navigations if applicable
        window.addEventListener('popstate', () => {
            hasTrackedPageView = false; // Reset for the new soft navigation
            trackPage();
        });
    }

    // Auto-initialize when the DOM becomes interactive
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose public API for manual tracking if needed inside specific tools
    return {
        trackPage,
        trackEvent
    };
})();
