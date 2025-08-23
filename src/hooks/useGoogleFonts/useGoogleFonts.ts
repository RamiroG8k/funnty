import { useCallback, useState } from "react";
import { GoogleFonts } from "./fonts";
import { GoogleFontKey } from "./types";

export const getFontOptions = () => {
    return Object.entries(GoogleFonts).map(([key, value]) => ({
        label: value,
        value: key,
    }));
};

const useGoogleFonts = () => {
    const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
    const [isLoading, setIsLoading] = useState(false);

    const loadFont = useCallback(
        async (fontFamily: GoogleFontKey) => {
            if (loadedFonts.has(fontFamily)) return;

            setIsLoading(true);
            try {
                // Fonts are already loaded via index.html, so we just need to apply them
                await document.fonts.load(`12px "${GoogleFonts[fontFamily]}"`);
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
