import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
    // 1. Get the current location (URL path) from react-router-dom
    const { pathname } = useLocation();

    useEffect(() => {
        // 2. Whenever the pathname changes, scroll the window to the very top
        // 'instant' ensures there is no weird scrolling animation during navigation
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: "instant",
        });
    }, [pathname]); // Dependency array monitors the URL path

    // 3. This component does not render any UI, so it returns null
    return null;
};

export default ScrollToTop;