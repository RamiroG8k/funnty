import { useEffect } from "react";
import {
    GoogleFontKey,
    useGoogleFonts,
} from "./hooks/useGoogleFonts/useGoogleFonts";
import { TextCanvas } from "./components/organisms/TextCanvas";
import FontOptions from "./views/Home/FontOptions";
import { useTextConfig } from "./context/textConfig";
import InputField from "./components/molecules/input-field";

// Main App Component
const TextCanvasApp: React.FC = () => {
    const { loadFont } = useGoogleFonts();
    const { updateConfig, ...config } = useTextConfig();

    useEffect(() => {
        loadFont(config.font as GoogleFontKey);
    }, [loadFont, config.font]);

    const handleLoadFont = (font: GoogleFontKey) => {
        loadFont(font);
    };

    return (
        <>
            <div className="h-full w-full bg-gradient-to-br from-[#FF0000] via-transparent to-[#FF0000] absolute z-[0] backdrop-blur-xl opacity-5" />

            <main className="relative min-h-screen flex-1 flex flex-col lg:flex-row gap-4 p-4 overflow-hidden">
                <div className="relative h-[75dvh] lg:h-[calc(100dvh-2rem)] lg:w-4/5 flex justify-center">
                    <FontOptions
                        className="absolute top-3 z-10 [&>div]:bg-red-300"
                        onFontChange={handleLoadFont}
                    />

                    <TextCanvas />
                </div>

                <InputField
                    className="w-full lg:w-1/5 [&>textarea,&>input]:bg-background"
                    cols={3}
                    id="textArea"
                    label="Custom text"
                    onChange={(text) => updateConfig({ text })}
                    placeholder="Enter your text here..."
                    value={config.text}
                />
            </main>
        </>
    );
};

export default TextCanvasApp;
