import { useCallback, useState } from "react";

const useGoogleFonts = () => {
    const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const loadFont = useCallback(
        async (fontFamily: string, weights: string = "100..900") => {
            if (loadedFonts.has(fontFamily)) return;

            setIsLoading(true);
            try {
                const link = document.createElement("link");
                link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontFamily.replace(/\s+/g, "+"))}:wght@${weights}&display=swap`;
                link.rel = "stylesheet";
                document.head.appendChild(link);

                // Wait for font to load
                await document.fonts.load(`16px "${fontFamily}"`);
                setLoadedFonts((prev) => new Set([...prev, fontFamily]));
            } catch (error) {
                console.warn(`Failed to load font: ${fontFamily}`, error);
            } finally {
                setIsLoading(false);
            }
        },
        [loadedFonts],
    );

    return { loadFont, isLoading, loadedFonts };
};

export { useGoogleFonts };
