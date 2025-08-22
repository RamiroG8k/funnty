import { useCallback, useState } from "react";

export enum GoogleFonts {
    Inter = "https://fonts.googleapis.com/css2?family=Inter:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    Roboto = "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
    Montserrat = "https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    Poppins = "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    OpenSans = "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap",
    Lato = "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap",
    SourceSans3 = "https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    Oswald = "https://fonts.googleapis.com/css2?family=Oswald:wght@200;300;400;500;600;700&display=swap",
    Raleway = "https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    Nunito = "https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    NotoSans = "https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    NotoSerif = "https://fonts.googleapis.com/css2?family=Noto+Serif:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    PlayfairDisplay = "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    Merriweather = "https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400;1,700;1,900&display=swap",
    WorkSans = "https://fonts.googleapis.com/css2?family=Work+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    FiraSans = "https://fonts.googleapis.com/css2?family=Fira+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    Quicksand = "https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap",
    Kanit = "https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    Rubik = "https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    Archivo = "https://fonts.googleapis.com/css2?family=Archivo:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    Manrope = "https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap",
    SpaceGrotesk = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap",
    DMSans = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
    IBMPlexSans = "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,500;1,600;1,700&display=swap",
    BebasNeue = "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
    DancingScript = "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap",
    PermanentMarker = "https://fonts.googleapis.com/css2?family=Permanent+Marker&display=swap",
    AbrilFatface = "https://fonts.googleapis.com/css2?family=Abril+Fatface&display=swap",
    TitilliumWeb = "https://fonts.googleapis.com/css2?family=Titillium+Web:ital,wght@0,200;0,300;0,400;0,600;0,700;0,900;1,200;1,300;1,400;1,600;1,700&display=swap",
    Overpass = "https://fonts.googleapis.com/css2?family=Overpass:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap",
}

export type GoogleFontKey = keyof typeof GoogleFonts;

export const getFontDisplayName = (key: GoogleFontKey): string => {
    const displayNames: Record<GoogleFontKey, string> = {
        Inter: "Inter",
        Roboto: "Roboto",
        Montserrat: "Montserrat",
        Poppins: "Poppins",
        OpenSans: "Open Sans",
        Lato: "Lato",
        SourceSans3: "Source Sans 3",
        Oswald: "Oswald",
        Raleway: "Raleway",
        Nunito: "Nunito",
        NotoSans: "Noto Sans",
        NotoSerif: "Noto Serif",
        PlayfairDisplay: "Playfair Display",
        Merriweather: "Merriweather",
        WorkSans: "Work Sans",
        FiraSans: "Fira Sans",
        Quicksand: "Quicksand",
        Kanit: "Kanit",
        Rubik: "Rubik",
        Archivo: "Archivo",
        Manrope: "Manrope",
        SpaceGrotesk: "Space Grotesk",
        DMSans: "DM Sans",
        IBMPlexSans: "IBM Plex Sans",
        BebasNeue: "Bebas Neue",
        DancingScript: "Dancing Script",
        PermanentMarker: "Permanent Marker",
        AbrilFatface: "Abril Fatface",
        TitilliumWeb: "Titillium Web",
        Overpass: "Overpass",
    };

    return displayNames[key];
};

export const getFontOptions = () => {
    return Object.keys(GoogleFonts).map((key) => ({
        label: getFontDisplayName(key as GoogleFontKey),
        value: key as GoogleFontKey,
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
                const link = document.createElement("link");

                link.href = GoogleFonts[fontFamily];
                link.rel = "stylesheet";

                console.log(`Loading font: ${link.href}`);

                document.head.appendChild(link);

                await document.fonts.load(fontFamily);

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
